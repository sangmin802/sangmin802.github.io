---
title : "SSR vs CSR 비교"
date : 2021-02-11 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 

`Loa-Hands`라는 동일한 웹앱을 `Next.js`와 순수 `React.js` 두가지 버전으로 제작을 해보았다.

우리가 흔히 `SSR`을 채택하는 이유는 클라이언트의 입장에서 첫 화면을 빠르게 접할 수 있는점과, 각종 검색포털의 크롤러가 생성한 웹 사이트를 잘 긁어갈 수 있도록 일부분의 돔을 구성하고 있다는 점이였다.

실제로 눈으로 보는것이 더 좋을것 같아 결과물을 비교해보았다.

## TTV
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 49%" src="/img/2021/02/11/3.gif?raw=true" alt="result1">
  <img style="display : inlneblock; width : 49%" src="/img/2021/02/11/4.gif?raw=true" alt="result2">
</div>

첫번째 이미지가 `Next.js`의 `SSR`

두번째 이미지가 순수 `React.js`로만 만든 `CSR`이다.

**`SSR`**의 경우, 그냥 `jpg` 이미지 같지만, 사실 서버에게 첫 요청부터 화면 생성까지의 `gif`이다. 즉, 클라이언트의 입장에서 봤을 때, 로딩이란것이 전혀느껴지지않는다.
> 배포단계에서, 첫 화면은 서버에서 데이터를 모두 받아 돔을 생성하고 클라이언트에게 넘겨주기 때문!

**`CSR`**의 경우, 클라이언트가 서버에 첫 요청을 하고, 10초정도의 시간이 지난 후에 모든 화면이 완성된다. 클라이언트의 입장에서는 실로 어마어마한 로딩시간이라고 볼 수 있다.
> 사실상 `cors`문제 때문에, 무료로 생성한 `proxy`서버를 한단계 거쳐서 가느라 더 오래걸리는 수도 있긴 함..

> 서버에서 클라이언트에게 빈 `html`파일이 전달되면, 브라우저상에서 스크립트 파일을 읽어 일부분 화면을 구성하고, 외부 데이터를 사용하여 만드는 동적인 돔들의 경우 `http`통신을 위한 추가적인 시간이 필요하므로 이러한 결과가 발생한 것이다.

## SEO
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 49%" src="/img/2021/02/11/1.PNG?raw=true" alt="result3">
  <img style="display : inlneblock; width : 49%" src="/img/2021/02/11/2.PNG?raw=true" alt="result4">
</div>

**`SSR`**의 경우 빌드 시, 외부 데이터를 받아와서 생성하는 동적인 부분도 모두 서버에서 처리 후, `index.html`을 반환하기 때문에 채워저있는 `index.html`을 확인할 수 있다.

당연하게도, 이렇다보니 검색엔진들은 해당 돔들을 크롤링하여 각 포털사이트에 노출이 될 수 있는것이다.

**`CSR`**의 경우, 초기에 비어있는 `index.html`을 반환하기 때문에 검색엔진들은 해당 웹사이트에대한 정보를 크롤링 하지 못하여 흔히말하는 `컨텐츠부족`이라는 문제를 발생시키고 포털사이트에 노출이 되지 않는다.

실제로 두가지 방법을 통해 같은 웹앱을 만들어보았는데, 눈에띄게 차이가 있어 어느정도 확신을 갖게되었다.

물론 `Next.js`를 사용한 웹앱은 첫 화면만 `SSR`로 구성하였고, 이후 검색 라우트(페이지)등, 다른것들은 `CSR`형식을 취하고 있어 두가지 렌더링 방식을 모두 보유하고있다.

😃앞으로 `Next.js`를 더 애용하게될 듯 하다..