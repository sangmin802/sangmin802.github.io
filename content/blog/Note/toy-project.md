---
title: '토이프로젝트(모노레포) 구성기'
date: 2023-01-01
category: 'Note'
draft: false
---

23년 1월부터 토이프로젝트를 진행해오면서 모노레포를 운영하며 확인한점, 과정을 기록해두고자 함

> 종료되는 프로젝트가 아니기 때문에, 계속하여 추가될 수 있음

## 모노레포 구성기

turboRepo를 선택하였음.

### yarn pnpm모드 미지원

Yarn berry / pnp는 아직 정식지원 x node-modules만 가능 (blog post 11이였나 12에서 yarn berry 지원까지는 하는데 pnp는 아직이라고 함.. 진행중이라고는 하는데 마지막 포스트까지도 언급 없음..)

### eslint 설정 중 말줄임이 가능한것을 확인함

eslint plugin에서 (/)eslint-plugin(-)는 제거할 수 있음

- @jquery/jquery = @jquery/eslint-plugin-jquery
- @foobar = @foobar/eslint-plugin

eslint extends에서는 위의 plugin처럼 eslint-config-이름 생략 가능하며, plugin:이후의 eslint-plugin-을 제거할 수 있다.

- plugin:eslint-plugin-react/recommended = eslint-plugin-react 라는 package이름의 플러그인 안 recommend를 사용
  - plugin:react/recommended 요렇게 가능
- @typescript-eslint/eslint-plugin/recommended
  - plugin:@typescript-eslint/recommended 요렇게 가능

무언가를 확장하고자 할 때, 그 대상이 플러그인이면 앞에 plugin:을 해주는듯
이게근데 해보니깐, a/eslint-config/b 이런식이면 중간에있는건 제거를 잘 못해주는것 같기도..?

eslant:recommend 백날찾아도 안보이길래, 커밋 확인해보니 js.config.recommend로 변경된듯..아직은 기존방식으로 해도 warning만 주면서 해주는듯 함

- [커밋내용](https://github.com/eslint/eslint/commit/c8c0c715a2964cc1859b99f9d4f542675094d1d5)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/01/01/eslint.png?raw=true" alt="eslint">
</div>

### prettier 똑똑함

prettier는 prettier-plugin-<name> 형식이 devDep에 포함되어있다면 라면 자동으로 plugin에 연동시킨다. 호오.. prettier-plugin-tailwindcss를 plugin에 수기로 추가하지 않아도 작동되는 이유였다..

### tsconfig

tsconfig root옵션을 잘 조절하여 레포 상 하위 tsconfig가 읽히는 범위를 잘 조절하면 좋은듯
만약, tsconfig를 패키지로 뺐을 때, ts server는 extends의 경로가 절대경로나 상대경로냐에 따라 다르게 보는듯
절대경로일 경우, basePath에 그냥 tsconfig.json 만 붙여주는것 같음.

> 이거는 Typescript repo 볼 때, 와! 이거다! 싶을정도로 명쾌하진 않아서..

그래서 tsconfig의 이름이 조금이라도 바뀌면 안되고, 앞에 어떤 경로가 있던지 상관은 없는듯. tsconfig를 구분해주고 싶으면 dir 경로로 구분해줘야 할듯..?

- @sono-repo/tsconfig, @sono-repo/tsconfig/next 이런느낌?

```js
// Typescript repo 일부
combinePaths(basePath, 'tsconfig.json')
```

typescript moduleResolution을 nodeNext++ 로 변경하면서 package.json의 모듈로드 방식을 따라가고, exports 필드를 읽을 수 있게 되는 등 변경이 되었고, 이에 exports 필드 내부에서 경로, 타입스트립트가 추론할 수 있도록 type파일을 각각 설정해줄 수 있게되었음

> 이거는 다른 포스트로 깊게 다루고자 함

그래도 해당 패키지를 사용하는곳에서 아직 node 방식으로 설정되어있다면 exports를 못읽으니, main이랑 types 필드는 같이 유지시켜주는게..?

### Next app을 vercel 배포 시, react minify error

￼
실제로 서버컴포넌트 내부에서 날짜객체값을 조회할 때, 에러가 발생했었음. (현재는 클라이언트 환경 안에서만 날짜객체 조회하도록 변경)

서버컴포넌트는 web api를 사용할 수 없으니 당연한 결과일 것 같음

- [관련이슈](https://github.com/vercel/next.js/issues/50245)
- [서버컴포넌트](https://www.freecodecamp.org/korean/news/how-to-use-react-server-components/)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/01/01/vercel-react-minify.png?raw=true" alt="vercel-react-minify">
</div>

### next13 server component cache

각 페이지 혹은 서버에서 요청하는 데이터에 대한 캐시가 진행되는것 같음.

첫 진입 시, 서버에서 만든 정적인 html 화면(데이터요청은 완료하고, 내부 동적인 스크립트코드만 안읽히는것같음) 그려주고 클라이언트사이드에서 하이드레이션 작동

페이지별 데이터재검증, 요청 데이터별 재검증을 따로 줄 수 있다고 함(특정 조건마다 캐시초기화)

- [관련 공문 1](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)
- [관련 공문 2](https://nextjs.org/docs/app/building-your-application/caching)

### npm 배포 scope

packages 하위 timer를 배포해보는데, 기존 package name 그대로 @sono-repo/timer 형식으로 하면 안됨

@는 packages의 스코프를 명시하는데 이를 하려면 조직기능을 사거나, private 기능을 사야한다는것 같음..

위 기능구매 없이 하면 내 계정 레지스트리에 관리중인 scope 가 없다고 에러나옴

당연히 scope인 @ 없으면 / 도 안되니 그냥 sono-repo-timer로 함...

### 배포, rollup

react를 dependencies에 해두면 라이브러리 받을 때 같이 받아지긴 하는데..

이름도 react timer 이고 빌드를 하니 devDeps에 두고 그냥 rollup external로 제외시키자.

React 없으면 설치도 안되게 peer 명시해두기.

> 근데 요즘 패키지매니저들 peer 설치 안되어있으면 그냥 깔아주는게 기본옵션인것 같긴 하더라 ㅎㅎ..

깡 Rollup 빌드 시, 기본적으로는 import 해오는 다른 라이브러리에 대한 처리는 하지 않아서 external로 제외한다고 안해주면 unresolved module 경고가 나옴

추후 다른 라이브러리들은 빌드결과물에 포함시켜줄 수 도 있으니 resolve plugin은 적용시켜둠

vite는 prod build를 할 때, Rollup을 사용하는데, vite는 위 plugin이 없어도 import 해오는 패키지들도 같이 포함시켜서 빌드함

그냥 vite 안에 config를 보면 저 plugin 넣어주는것을 확인함.

vite는 다 넣어줄 테니 external로 알잘딱하게 빼라는것같음

## 모노레포 패키지의 deps / devDeps 명시 기준은..?

생각해보면 당연하구 간단한듯

여러 ui 라이브러리들을 보면 내부에 rc-table과같은 react component 라이브러리를 내부에서 사용하는 경우가 있음. 그런데 우리가 그 ui 라이브러리를 쓸 때, rc-table을 받지는 않음

받아오는 패키지가 a 라는 라이브러리를 쓴다고 보았을 때, 우리도 그 패키지가 아닌 우리 내부의 코드에서 a라는 라이브러리를 쓰면 명시를 해줘야할것 같음.

만약, 우리는 쓰지 않고 패키지만 쓴다면 그냥 그 패키지만 받아오면 되는거니깐

tailwind-config 패키지가 있다면, tailwind-config도 받아오고 걔가 tailwind를 들고있긴 하지만, 우리도 스타일을 할 때 tailwind 문법을 쓰니 tailwind를 명시해줘야겠지?

chakra ui를 쓴다고 했을 때, chakra만 받아오지 chakra가 내부에서 쓰는 emotion은 명시 안해주는것처럼

## next-pwa / tailwindconfig

next-pwa를 사용할 때, tailwind config 의 Content 경로에 문자열 앞 glob pattern `**component/**/\*` 등등.. 사용 시, 무한히 rebuilding 하는 문제가 있음...

지금은 다른 방법으로 배포해둠..

## 빌드시 여러개의 Entry

Swiper 라이브러리의 경우, path를 통해 구분해주고 있음. 여러개의 entry가 있고, 각각 exports 필드를 구분하여 이름이 아닌 경로로 구분.
어차피 moduleResolution으로 exports 필드를 읽을 수 있는 값을 부여해줬다면 잘 나누는것도 괜찮을듯

## 배민 전환기

- [배민 우아콘 아키텍처 변경](https://techblog.woowahan.com/15084/)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/01/01/wooacon.png?raw=true" alt="wooacon">
</div>

여기 모노레포 전환하면서 아키텍처를 변경한 과정도 있는데, 메모없이면 기억 못할것같아서..
이해 돕기￼

- 화살표 A—>B는, A는 B에 의존함(그냥 A는 B를 사용함)
- Bridge layer는 그냥 custom hook같은것들
- Data layer는 redux(store)나, react-query(cache)같은 라이브러리
- Model layer는 getter, setter hook, 혹은 api 서비스같은 것
  —> 생각해보면 service api에 의존하고있는, useQuery를 커스텀hook으로 래핑하여 컴포넌트나 페이지에서 사용함 이런느낌?

## 패키지매니저 변경 후 vercel 배포 이슈

Yarn -> pnpm으로 변경함.
근데 모노레포 배포 중 이슈를 만남.
yarm은 workspace로 등록이 되어있다면, 하위 apps에 명시되지 않은 커맨드라도, root에 명시되어있다면 실행이 가능했음.

그래서 vercel 배포할 때, working dir이 apps 하위로 되어있어도, root의 lostsark:build 커맨드를 호출할 수 있었음.

하지만 pnpm은 그렇지 않기 때문에, build script를 cd ../.. lostark:build로 변경해줘야 잘됨

이 때 든 생각이, yarn, pnpm 두개가 workpsace 내에서 package.json의 script를 읽을 수 있는 범위가 다른건가 했음

## stand-alone 전환

Next 에서 Image 태그 사용 시, standalone 모드라면 sharp 라는 이미지 최적화 라이브러리를 깔아주어야 한다 함. (Vercel 배포시에는 자동 깔린다 함)

그런데, 깔아주었는데도 깔아야한다는 에러가 계속 반환됨

- [관련이슈](https://github.com/vercel/nft/issues/371)
- [sharp를 0.32.6 버전 사용 혹은, 14.0.5 canary 사용](https://github.com/vercel/next.js/issues/59346)

빌드 결과물에 static, public은 복사를 안해줌. 내가 직접 해야 함.
static은 .next의 static을 standalone/apps/lostark-hands-next/.next/static
public은 root의 public을 standalone/apps/lostark-hands-next/public

사실 위 두개의 정적폴더가 존재하지 않음은 docker 이미지빌드, 실행 하면서 확인함 ㅋㅋ..
docker파일에도 동일하게 추가해줬음

turborpo내에 docker 이미지 전용 빌드방식이 있다고 하여 두가지 방법으로 모두 배포해보았음.
아직 많이 경험해보진 못해서 이야기해주는 이점에 대해 크게 느끼진 못하겠음.. 더 경험해봐야 알것 같음

> prune.Dockerfile, no-prune.Dockerfile로 구분하여 생성해둠

- [turbo prune](https://turbo.build/repo/docs/handbook/deploying-with-docker)

## next 14 axios / fetch

next14 appdir이 되면서, api 요청에 따른 캐시방식을 axios에서는 fetch보다 자유롭게 주기 어려운것 같음..

ppr 모드 활성화 시 아직 실험모드라 그런건진 모르겠는데, revalidate값을 빼서 항상 새롭게 받아오는 형식으로 하더라도, 배포환경에서 부분적으로 렌더링되는게 아니라 한번에 캐시된것 가져오는것 같음..

Home, User info 쪽 streaming render 적용했는데, home은 정적인 경로 캐시에, segment만 부여되어있어서 잘 안되는것 같기도..

확실히 Userinfo는 완전 동적경로라 잘 되는것으로 보임

얘는 확실하진 않아서 좀 더 확인해보긴 해야할듯..

## timer bin / publish action / changesets

timer binary로 package.json 변경해주는것은 만듬.

changesets라고 binary로도 제공해주고, ci로도 제공해주는데 문제가 좀 있는게, 배포해줄 때 패키지 하위 모두 배포를 해주는것 같음. ignore로 제외할 수 있는것 같은데, devDeps에 사용되고있는 패키지가 ignore 되어있으면 에러를 반환함..

changesets action까지 적용은 했는데, 액션이 무조건 fail함. timer는 배포가 되긴 함. 사실 위의 이유로 timer만 배포되는게 맞긴한데, 모든 패키지들을 배포하려고 시도하는것때문에.. 허허

그래서 그냥 배포 액션도 따로 만듬.
