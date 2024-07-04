---
title: cache-control 헤더를 사용하여 섬세하게 캐시 관리하기
date: 2024-01-31 20:31:00
category: 'Study'
draft: false
tag: 'Think'
---

## 문제 / 발단

- 오리진서버와 브라우저 사이에 cdn 캐시서버가 존재할 때, 오리진서버에서 cache-control값을 모두 설정해주지 않은 동일한 경우에도 aws cloudfront를 쓰냐, cloudflare를 쓰냐에 따라 캐시정첵이 미묘하게 다른점이 있어 의문이 생김
- 위 과정에서 age, date, etag, if-none-match와 같은 캐시와 관련된 http header에 대해 명확히 이해하고 있지 않은것 같아 정리해보고자 함

## 원인 예상

- [각 브라우저별 브라우저의 캐시유지시간 설정](https://medium.com/a-day-of-a-programmer/cache-control-expires%EB%A5%BC-%EB%B9%A0%EB%9C%A8%EB%A6%AC%EB%A9%B4-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C-%EB%AC%B4%EC%8A%A8-%EC%9D%BC%EC%9D%B4-%EC%9D%BC%EC%96%B4%EB%82%A0%EA%B9%8C%EC%9A%94-756158e22f2d)

cache-control이 응답에 빠져있다면 각 os별 위의 링크와 같은 방향으로 캐시 시간을 결정해준다고 함.

그래서, 해당 값이 존재하지 않을 경우 알 수 없는 시간만큼 브라우저의 디스크캐시를 바라보고 있어 예전의 코드를 불러오는 경우가 종종 있는게 아닐까 싶음
그리고 어떤 청크는 브라우저캐시를 보고 요청을 안보내고, 어떤 청크는 캐시가 만료됬다고 판단하여 재검증요청을 보내는듯 함

## 테스트 / 정리

### node server로 테스트

cdn 서버는 없지만.. 별다른 설정이 없는 경우 오리진서버에서 명시해주는 캐시정책을 따라간다는것은 cloudflare, aws cloudfront 모두 동일한 것 같아서 헤더적용여부는 비슷할것 같긴 하다.

1. cache-control 헤더가 응답에 포함되지 않은 경우

   <div style="margin : 0 auto; text-align : center">
     <img src="/img/2024/01/31/no-cache-control-header.png?raw=true" alt="no-cache-control-header">
   </div>
   위의 링크글에 대한 이유로 브라우저에서 계산된 임의의 캐시시간을 갖게되어 서버에 요청을 보내지 않고 메모리캐시를 반환하는것 같음

2. max-age=초
   빠른 확인을 위해 해당 응답이 캐시될 수 있는 시간을 10초로 부여해볼 경우
   <div style="margin : 0 auto; text-align : center">
     <img src="/img/2024/01/31/max-age-10-cache.png?raw=true" alt="max-age-10-cache">
   </div>
   서버로부터 첫 응답이 생성된 이후, 새로고침하였을 경우, 서버로 다시 요청을보내는것이 아닌 메모리캐시에서 반환되는것을 볼 수 있다.

만약, 가능한 시간이 지난다면

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/01/31/etag-match.png?raw=true" alt="etag-match">
</div>
위와 같이 재검증을 받게 된다.
이 때, 확인해볼만한 것이, 이전에 요청에 대한 응답으로 갖고있던 Etag값을 If-None-Match 헤더에 함께 보내어서, 소스코드가 변경되었는지 체크를 한 후 변경이 없다면 304 status로 그냥 내려준다.

그렇다면, max-age 시간 이후 소스코드가 변경되었다면??

> 정말 소스코드만 변경했다 (그냥 콘솔에 텍스트 하나 추가됨)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/01/31/different-etag.png?raw=true" alt="different-etag">
</div>

If-None-Match로 가지고있던 etag를 함께 보내었지만, 오리진서버에서 소스코드 변경으로 새로운 etag값과 함께, 200 status로 내려준다.
브라우저는 다시 max-age 시간을 기준으로 이 변경된 etag를 함께 캐시해두고 있을 것

### 서버 응답 cache-control 헤더

- no-cache || max-age=0: 서버검증시 etag, if-none-match 검사 후 동일하면 304 다르면 200(새로운 etag와 함께)
  - 사실 etag 이런거는 모던 빌드 툴(vite etc) 같은 경우 소스코드가 달라지면 해시값을 다르게 줘서 어차피 구분되어서 index.html 같이 파일이 동일한 경우에만 크게 효과볼듯..?
- max-age=시간: `브라우저에서 해당 응답 최초 생성 이후 신선하다고 판단하고 캐시해두는 시간`
  - 요게 좀 중요한것이, 1200으로 되어있다고 1200초 온전히 신선한 캐시로 판단하는것이 아님. 만약, age헤더의 값 혹은 (현재시간 - Date헤더 값)이 300초정도 된다 (응답이 최초 생성된 이후 캐시서버에서 300초동안 캐시되고있었다) 라면 900초정도만 브라우저에서 신선하다고 캐시를 유지하는것 같음
  - 그래서, 304같이 응답이 새로 내려올 때에는, date 헤더가 갱신됨. 새로운 캐시시간이 계산되겠지?
- s-max-age=시간: cdn 과 같은, 중간서버의 캐시 시간
- max-age=0, s-max-age=시간: 브라우저에서는 캐시하지 않고, 항상 cdn 서버에 요청을 함. cdn서버는 s-max-age 시간 동안만 유지하고, 그 시간이 넘어가면 오리진서버에 검증요청을 받아와 갱신함

더 많은 값을 부여할 수 있지만, 이렇게가 자주 쓰이는것 같다.

### aws cloud front 기본 캐시전략

- [AWS 콘텐츠 유지시간](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [cache-control 미할당 경우](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html#ExpirationDownloadDist)

cf에서 따로 캐시전략을 설정해줄 수 는 없는듯 함. 오리진서버에서 각 객체별 캐시전략을 설정해줄 수 있음. 만약, 없다면 cf에서는 기본적으로 24시간동안(s-max-age=24t시간) 캐시해두고 있으며, 클라이언트에서 요청 시 cf에서 체크했을 때 cf에서 들고있는 최신의 데이터라면 304로 반환해줌

만약, 24시간이 지났다면 cf는 오리진에 검증요청을 해서 달라졌다면, 오리진에서 내려주는 200, 동일하다면 오리진에서 내려주는304를 그대로 클라이언트에 주고, cf에 캐시를 최신화함

캐시서버(cdn이든 cdn을 사용하지 않아 오리진이 캐시서버이든) 에 얼마나 보관되고있었는지는 age 헤더를 보면 됨. 몇초인지 나옴. 실제로 매 요청이 전달된다면 응답에 age값이 계속 증가하는것을 볼 수 있음.

> 뭐 아니면.. Date 헤더에서 오늘시간 빼도..?

1. 서버에 소스 요청을 보내면, etag를 함께 받음. 내부 코드가 달라지면 etag도 바뀜
2. no-cache로 저장을 해도 그 도메인의 요청경로 매핑 etag로 저장이 되고있는것 같음. 물론 내부 코드에 따라 etag는 달라짐. 그래서 서버에서 코드가 변경됨을 감지하는 것
   1. 만약에, 저장되고있는 매핑된경로의 etag가 없다면 안보내고 서버에서 받아오기만 하는것 같음(200 status)
3. 요청을 보낼 때, 이전 etag를 함께 전달함. cf에서 캐시시간이 남아있고, cf에서의 etag와 동일하면 cf에서 바로 내려주는듯 함. Cloudfront hit
   1. 위에서 이야기했지만.. 빌드툴을 쓰는 경우 html을 제외한 다른 파일들은 해시를 포함한 파일이름 자체가 달라져서 어차피.. etag 없어도 cdn이나 오리진서버에서 구분은 할듯 함.. cdn에서 없으면 miss 뜨고 오리진에 요청해 가져오고, 그 해시가 있음연 그냥 hit 뜨고 주겠지..
4. 만약에 없다면, 오리진으로부터 확인하고 받아오는데, 오리진에 etag와 동일하다면 304로 내려줌. Cloudfront miss. 만약, 해당 경로에 대한 etag가 변경되었다면(소스코드가 변경됨) 200과 함께 새로운 etag를 줌
   1. 사실 etag가 변경되었다 라는 기준은, 요즘 대개 빌드배포하면 해시값이 붙어서 청크 해시가 변경된것을 새롭게 요청하는 경우라 브라우저에 해당 경로에 대해 서버로부터 전달받은 etag가 존재하지 않는 경우만 있을것 같음. 그냥 도메인 딱 찍고 index.html을 받아오고, 그 청크자체를 완전 처음 요청하는 상황
   2. 테스트 해볼 때에는 따로 스크립트에 해시가 달리지 않아서 경로는 똑같은데, 내부 코드 변경으로 etag가 달라져 req etag와 res etag를 자주보긴 함
5. 요청을 한 청크가 오리진에 아예 존재하지 않는 경로 즉, 해시가 변경되어 갈아껴졌으면 당연히 청크못불러오는 에러 반환

#### cloudfront 기본 캐시유지시간(24시간) + 그보다 작은 max-age 시간

간혹 max-age=1200 이런데, cf에서 기본값으로 24시간동안 유지된다고 하면 age가 1200 보다 클 때, 브라우저에서 유지할 시간이(브라우저에서 유효하다고 생각할 캐시시간 1200 - 응답 생성 이후 캐시되고있던 시간인 age) 0보다 작은경우 항상 cf한테 새로 달라고 요청하는것 같음.

하지만, cf는 24시간이 지나지 않아 아직 신선한 캐시로 판단하여 오리진에게 다시 판단요청하지 않고 그냥 브라우저에게 다시 전달.

다시 브라우저는 위의 이유로 신선하지 않다고 판단해 매 요청마다 cf에 새로달라고 함. 이게 반복되는경우도 있는듯

## 이렇게 해결한다면

서버에서 응답으로 내려줄 때, index.html 파일만은 max-age=0으로 항상 검증을 받도록 해야하지 않을까. js나 style 같은 청크들은 변경시 새로운 해시가 붙게된 상태로 항상검증하는 index.html에 보내질 테니, 브라우저에서는 캐시시간을 오래가져도 될 것 같음. 받아왔던 경로는 디스크캐시를 쓰고, 없는것은 요청을 하게 될 테니깐

## 참고자료

- [aws 캐시제어](https://jinminkim-50502.medium.com/s3-%EC%BA%90%EC%8B%9C-%EC%A0%9C%EC%96%B4-282d5cceec36)
- [클라우드플레어 캐싱](https://f-dever-error-log.tistory.com/m/64)
- [토스 웹캐시 다루기](https://toss.tech/article/smart-web-service-cache)
- [웹브라우저 캐시전략](https://inpa.tistory.com/entry/HTTP-%F0%9F%8C%90-%EC%9B%B9-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98-%EC%BA%90%EC%8B%9C-%EC%A0%84%EB%9E%B5-Cache-Headers-%EB%8B%A4%EB%A3%A8%EA%B8%B0)
