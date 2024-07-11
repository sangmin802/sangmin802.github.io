---
title: '한줄 기억 노트'
date: 2022-01-03
category: 'Note'
draft: false
---

# 목표

같은 실수를 하고 싶지 않거나, 동일한 문제가 발생하였을 때 빠르게 해결하기 위해 개발을 하면서, 다시잡게 되거나, 놓쳤거나, 몰랐거나, 잘못알고있었거나 (비슷한말인가) 그런 것들을 간단하게 요약해두고자 한다.

메모장에 기록을 해두었는데, 괜찮은것들은 공유되어도 좋은것같구.. 메모장이 항상 유지되는것도 아닌것 같아서 옮겨두려 한다.

모두 한번에 기억할 수 있으면 좋지만.. 사용 빈도가 비교적 작은것들은 잊기 쉬운것 같아서.. 기록.. 해둬야겠지..?

몇몇 깊은 소재들은 포스트로 다뤄볼만 할듯!?

> 기억을 위한 메모장이기 때문에 가볍게 적어두기. 한줄 노트이긴 한데, 뭐 몇줄 더 있을 수 도 있지. 그건 내 맘

> 계속 추가되고, 수정될 수 있다!

> 주관이 많이 담겨져있음..!

### Mac Chrome 그래픽 가속모드 + 비디오 흰 화면

- https://github.com/video-dev/hls.js/issues/1003
  - Firefox와 Safari는 macOS의 H.264 시스템 디코더를 사용하지만 Chrome은 자체 H.264 디코더를 번들로 제공한다 함
- https://www.reddit.com/r/chrome/comments/lbomvc/every_chrome_video_has_a_white_screen_and_i_cant/
  - 크롬 그래픽 가속 모드를 비활성화면 정상적으로 영상이 노출됨
- https://support.google.com/chrome/thread/34584059/hardware-acceleration-causes-problems-when-watching-videos?hl=en
- https://www.reddit.com/r/chrome/comments/lbomvc/every_chrome_video_has_a_white_screen_and_i_cant/
- https://www.quora.com/Playing-videos-on-Edge-and-on-Chrome-makes-everything-else-but-the-video-blurry-Why
  - 그래픽 가속 모드로 인해 영상이 흰화면만 나온다는 이슈가 꽤 등록됨
- 실시간 스트리밍 영상을 HLS 라이브러리로 변환하는 과정에서만 그런 줄 알았더니, MP4도 동일하게 발생함

  - 라이브러리 문제는 아닌 것 같음.

- https://issues.chromium.org/issues/332234167
  - Chromium에 유사한 이슈가 등록됨

크롬에서 하드웨어 가속 모드(그래픽 가속 모드)를 활성화 시켰을 때, 동영상을 디코딩하면서 문제가 발생하는 것 같음.

#### 조금 특이한 해결

- rounded, overflow-hidden으로 영상을 자르지 않거나, backdrop filter를 사용하지 않으면 문제 없음
- 혹은, 위 기능을 모두 사용하더라도 상위요소에 rounded, overflow-hidden가 있고, videoTag 자체에 rounded를 주거나 더 상위요소에 rounded, overflow-hidden를 한번 더 해주면 됨. 다만 좀 밝아짐.. 이해가 잘 안됨...

### react deep dive

- [React internal deep dive](https://jser.dev/series/react-source-code-walkthrough/)

### Git yaml 옵션

- [깃 공식 문서](https://docs.github.com/ko/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)

### T extends ?? 제너릭타입 return type 에러

- [링크](https://dev.to/wes/b-is-assignable-to-the-constraint-of-type-t-but-t-could-be-instantiated-with-a-different-subtype-of-constraint-a-2l38)

- 특정 함수에 extends 를 사용한 제너릭 타입으로 넣었을 때 could be instantiated with an arbitrary type which could be unrelated to 이런 에러가 나옴. 위 링크글을 보면 이해가 되는데, extends 제너릭으로 전달된 값을 그대로 반환할 경우, 내가 그 generic 타입이 할당된 값에 새롭게 값을 구성하여 넣는 로직이 있다면 위 에러가 뜨는듯 함. 외부에서 입력된 제너릭타입과, 내가 새롭게 값을 구성하여 넣을때의 타입이 서로 다를 수 있기 때문이라는것 같음. 제너릭으로 보내줄 때, age는 필수인데, 내부에서 age를 뺄수도 있으니깐
- 근데 이것도 테스트해보면, 단순 객체반환 함수에서 T 제너릭 타입으로 받은 인자를 `{id: 1, ??: ??}` 이런식으로 해주면 안되고 `{...T, ??: ??}` 이런식으로 하면 되긴 하는데, 이거는 반환되는 타입에 항상 T 타입이 모두 존재하여서 그런것 같음. 즉 모두 있다는 보장을 주면 되는것같기도 함

```js
const a = <T extends { id: number }>(a: T): T => {
  if (a.id === 1) {
    // 여기서 ...a 빠지면 안됨
    return { ...a, age: 123, name: '123' };
  }

  return { ...a, name: '123' };
};

a({ id: 1 });
```

### modulepreload 모듈 자체는 미리 받아오나, 실행되는 시점은 개발자가 해당 모듈을 import 하는 순간 실행됨.

### 모바일에서 안드로이드는 클릭까지 잘 인식하지만, 아이폰은 touchstart여아 모두 인식 가능한것 같다(이거는 확실치 않지만, 계속 의심해보기)

### Container+presentational(이하 CP로 함)이 절대적인 구조였다면, hook이 추가된 이후로 많은것이 hook으로 대체가능해졌다고봄. 둘중 우열을 가리는것이 아님.

- 단순 비즈니스로직 분리나, 하나의 컴포넌트에 관련된 기능을 보다 응집력있는 컴포넌트를 만들고자 할 때나, 재사용가능한 로직을 분리할 때에는 이젠 hook 만으로 가능해짐
- 동일한 로직을 하위의 여러개의 컴포넌트가 공유, 사용해야한다면 이때에는 CP로 가능(물론 이 때 Hook 혼용 가능). 적당한 깊이라면 조합으로
- 동일한 로직을 하위 서로 다른 깊이의 여러개의 컴포넌트가 공유, 사용해야한다면 이때에는 redux나 context api 사용 가능

### 본래, peerdeps는 안깔리지만 npm은 7버전부터는 자동으로 깔리게 추가됨

- [npm7](https://github.blog/2021-02-02-npm-7-is-now-generally-available/#peer-dependencies)

### 기본적으로 A 패키지를 받을 때, A 패키지의 package.json의 의존성 필드에 따라 라이브러리의 설치방식이 다름

- deps: 같이 깔림. npm이라면, 호이스팅되어 node_modules에 같이관리, yarn도 pnp모드가 아닌 node_modules모드라면 동일할듯. pnpm은 node_modules/.npm/a에 위치, 링크되어있음
- devDeps: 안깔림.
- peerDeps: 원래는 안깔리는데, 요즘 pkm 추세가 같이 깔아주는듯 함. 안깔아줄 때, 만약 peer가 안깔려있으면 설치도 안됨

- 만약 vite 혹은 rollup에서 external로 번들링파일에 제외를 시킨다면
  - 번들링하는 작업을 제외하는거라 위 특징은 유지됨. deps는 해당 패키지가 깔리며 함께 설치되고, peerDeps는 root에 깔린것을 보도록 되어있지만 pkm 버전이 올라오면서 자동 깔리긴 할듯
  - deps는 깔리는 과정에 일반 nodeModules 방식이라면 해당 라이브러리가 호이스팅되면서 package.json에 명시되어있지 않아도 쓸 수 있는 유령의존성문제가 생기고, pnpm이나 yarnberry는 설치한 패키지에서만 접근 가능한 deps로 구분되어 해당 문제 없음

### Hook 개발 이후, CP가 절대적인 구조 방식이 아니라고 글을 남긴 초기 CP 글 작성자

- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### 모바일 이벤트 이슈

- pc에서는 mousedown - mouseup - click 순이라서 mouseup과 click 의 timestamp는 동일, 즉 동일한 시간에 호출되기 때문에, mouseup에서의 콜백을 settimeout으로 강제로 뒤로 미룰 수 있다. 하지만, 모바일에서는 touchstart - touchend - mousedown - mouseup - click 순이기 때문에, touch 이벤트와 mouse -> click으로 이어지는 timestamp가 달라서 위와 같은 방식으로는 안되고 최대 100 ms의 시간지연을 주어야 하더라.(100ms는 사용자가 동시라고 느낄 수 있는 최대의 지연 시간)
- 발생 사례. 모달 배경을 마우스다운, 모바일에서 터치시작으로 종료할 때 모달이 바로 꺼지지만, 하위에 클릭가능한 요소가 있을 때 지연되어 실행되는 마우스다운 마우스업이 클릭가능한 요소 위에서 실행되면서 클릭 발생. 동일하게, 마우스이벤트도 막히도록 지연시간 부여. 클릭은 상관없음. 모든 것이 거쳐지고 가장 마지막에 호출되는거라

### 웹뷰 swiper resize 이슈

- 앱의 헤더가 사라지면서 앱의 높이가 달라질 때 웹뷰의 window.resize가 작동되어 swiper.js의 슬라이드들이 크기를 다시계산해 translate가 이전으로 돌아가는 문제가 있었다.
- 앱의 높이가 달라지는것을 왜 Window에서 Resize되었다고 생각할까?
- window와 client의 innerHeIght이 모두 달라짐. 아마 웹뷰의 높이가 달라지만셔 윈도우의 크기도 확장되다보니 그런것 같기도..?

### 반응형 웹 100vh 쓰읍..

- 반응형 웹에서 100vh는 아직 상당히 위험한 스타일이라고 한다. 스크롤 될 때 활성화되는 url Bar에 대해 동적으로 높이를 계산하지 못하기 때문.
- 만약에 position: fixed된 요소라면 height: 100%를 통해 해결 가능. 당근마켓에서는 stackflow라는 라이브러리를 개발하여 웹뷰 레이아웃을 구성하였는데, 같은방법으로 보임
  - [링크1](https://bokand.github.io/demo/urlbarsize.html)
  - [링크2](https://stackoverflow.com/questions/52848856/100vh-height-when-address-bar-is-shown-chrome-mobile)
- 윈도우의 InnerWidth를 강제로 박는방법. 다만 스크롤 될 때 url bar의 활성화 여부가 토글링되기 때문에 Resize로 계속 감시해줘야 함.
  - [링크1](https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html)
- Css 2022에 제시된 svh(url바를 제외한 최소의 vh) 궁금한점은, 이것또한 동적으로 계산을 하는지에 대한 의문, 아직 모든 os의 버전에 호환되지 않는 문제
- 모바일웹에서 모달같은것들 absolute inset-0 하위 h-100%로 주면 알잘딱이긴 함

### 네이티브에서의 딥링크, 다이나믹링크

- 정의로는 접근하고자 하는 홈페이지의 컨텐츠 path까지 바로 도달하는 url을 말한다고 함
- 웹에서는 Url을 직접 입력할 수 있고, 볼 수 있어서 크게 의미 없지만, 앱에서는 그렇지 않아 이와같이 별도로 처리되어야 하는것 같음
- 더해서 앱에서는 해당 url을 클릭하였을 때, 설치된 앱인지 설치되지 않은 앱인지, 어떤 앱으로 활성화시킬것인지에 따라서도 선택할 수 있게 바텀시트같이 활성화 된다고 함
- 다이나믹링크도 딥링크의 일종인데, 기존 딥링크는 iOS, android 따로 만들어줘야 하는데 다이나믹링크는 두가지 os 모두 사용가능한 링크라고 함
- 링크를 통해 push 메시지를 보낼 때, 앱이 설치되지 않은 사용자일 경우 설치 경로 안내나, 바로 앱으로 이동될 수 있도록 하기 위해서

### 청크분리

- 프로젝트가 커지게 되면, 번들링 크기도 비례하여 커짐. 하나의 번들링된 파일을 가져오는것은 클라이언트에게있어 오랜시간 지연되는것처럼 느껴질 수 있기 때문에 번들링을 분할하는 과정이 필요함.
- 웹팩기준 수동으로 번들링하였을 때 나오는 엔트리파일들을 여러개로 관리 할 수 있음. 하지만 이 경우, 수동으로 관리해주어야 하며 여러개의 엔트리파일에서 공통적으로 사용하는 모듈의 경우 중복하여 받아오는 경우가 있음. 물론, 이는 SplitChunksPlugin 플러그인의 optization.splitChucks를 통해 별도의 엔트리로 뺄 수 있긴 함. Vender ~~ 명칭의 파일로 분리되며, 이는 (전역 혹은)공통적으로 사용되는 모듈들을 하나의 청크로 분리해놓은것임
- 수동 엔트리포인트를 만드는것이 아닌 개발단계에서 동적 임포트를 통해 코드 스플리팅을 하여 분리를 할 수 있음. 필요할 때 동적으로 가져오고자 하는 모듈을 별도의 청크(하나의 번들링파일을 효율적으로 관리하기 위해 다시 분리함)로 분리해주며, 필요하다면 해당 청크의 이름을 정해줄 수 도 있음 vender ~~ 도 동일하게 생성
- [프론트엔드 개발환경의 이해: 웹팩(심화)](https://jeonghwan-kim.github.io/series/2020/01/02/frontend-dev-env-webpack-intermediate.html)

### reactQuery onSuccess 안에서 setState 쓰지 말래

- React query + Suspense 모드를 함께 사용할 경우, onSuccess 내부에서 setState를 사용하는것은 의미가 없음. onSuccess하였을 때에는 해당 컴포넌트가 아닌 fallback 컴포넌트가 렌더링되고 있어 setState를 찾을 수 없음. 필요하다면 컴포넌트 렌더 이후인 useEffect내부에서 처리
- 이게 5버전부터 아예 그냥 onSuccess 제거됨

### zod

- zod를 사용하면 타입스크립트를 조금 더 강하게 사용할 수 있게된다. 인풋에서 종종 사용되는 유효성검사 로직과 타입정의를 동시에 진행할 수 있다. 개발중에는 타입체크를 하며, js로 트랜스 파일 이후에는 유효성 검사를 진행
- React-hook-form과 같은 유효성검사 라이브러리를 통해 유효성검사 로직과 타입정의 코드를 별도로 관리, 작성하는것이 아닌 zod를 통해 함께 관리 가능

### 타입스트립트 타입추론 구조적 서브타이핑(덕타이핑) `#추론판정 후함`

- typescript는 일반 C#, JAVA등등의 언어와 다르게 구조적 서브타이핑을 지원하기 때문에 특정 타입의 인자를 받는 함수에 다른 타입의 값이 전달되더라도, 함수의 인자가 받고자 하는 타입의 모든 속성이 맞는다면 에러를 반환하지 않는다
- C#, JAVA 등은 보내는 값의 타입을 꼭 명시해주어야 유효하다고 인식 하는 명시적 타이핑
- 단, 함수에 객체 리터럴을 바로 전달할 경우, fresh 한 값이라 판단하여 구조적 서브타이핑을 지원하지 않음. 자세한 내용은 링크 확인
- 여러 테스트를 해본 코드가 모노레포에 있으니 필요하다면 확인
- [타입 호환성 뜯어보기](https://toss.tech/article/typescript-type-compatibility)

### cjs, esm 모두 지원하는 라이브러리

- Package.json의 exports field를 통해 지정 가능
- [예시1](https://github.com/reduxjs/redux/blob/master/package.json)
- [예시2](https://github.com/toss/slash/blob/main/packages/common/date/package.json)
- [예시3](https://github.com/DuCanhGH/next-pwa)
- [두개의 포멧을 지원하는 패키지 구성](https://toss.tech/article/commonjs-esm-exports-field)
- [node exports field](https://nodejs.org/api/packages.html#exports)

### d.ts, nameSpace

- [typescript d.ts](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)
- d.ts: javascript에 타입을 선언(declare) 해줌
- nameSpace: 하나의 이름 하위에 타입을 명시해줌(객체 안의 타입 느낌..?) A.ITest

### cjs tree-shaking nono

- cjs는 동적인 경로를 require 해줄 수 있는 특징으로 빌드될 때 tree-shaking이 되지 않음. esm은 정적인 경로만 가질 수 있기 때문에 가능
- 예를 들어, require('./' + moduleName)과 같은 코드에서 moduleName은 런타임에 결정되므로, 이를 정적으로 분석하기 어렵습니다. 또한, require() 함수의 인자로 변수나 함수 등의 동적인 값이 전달될 수 있으므로, 빌드 시점에서 어떤 모듈이 로드될지 예측하기 어렵습니다.
- 이와 달리, ESM(ECMAScript Modules)은 import 문을 사용하여 모듈을 로드합니다. import 문은 정적인 모듈 경로를 가지고 있으며, 빌드 시점에서 모듈 의존성을 정적으로 분석할 수 있습니다. 이는 tree shaking을 가능하게 하고, 번들 크기를 줄이는데 도움을 줍니다.

### Build bundle analyzer tool

- Webpack bundle analyzer
- rollup도 뭐가 있긴 한듯

### Literal type, infer를 통해 더 강력한 조건부타입 추론하기 (재귀를 사용하여 진짜 강력하게, 디테일하게도 가능해보임)

- 리터럴타입, extends, infer 등등을 쓴 호기심유발 예제들. 솔직히.. 좀.. 여러의미로 대박인듯
- 이거 좀 재미있어서 모노레포에 여러 커스텀유틸리티 타입 만들어 보았음. 사례로 open API 응답은 파스칼인데, 클라이언트에서는 파스칼 안쓰니 그런 변환해주는 재귀유틸타입등..?
- [예제1](https://toss.tech/article/template-literal-types)
- [예제2](https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe)

### react memo대신 children

- A라는 컴포넌트에서 B라는 컴포넌트에 속성(children)으로 C라는 컴포넌트를 전달해줌. 이 경우 B라는 컴포넌트에서 rerender가 발생해도 C컴포넌트는 rerender가 발생하지 않음. 왜냐, C컴포넌트는 위에서 만들어진것을 전달받았고, B가 rerender되도 props로 전달받은 C는 변경되지 않기 때문 컴포넌트 함수를 호출하여 새롭게 만들지 않기 때문에.
- 만약, A라는 컴포넌트가 Rerender가 발생하면 그 때에는 C도 rerender 될것임.
- 만약, B라는 컴포넌트에서 C 컴포넌트를 속성(children)으로 전달받는것이 아니라, 본인이 직접 import 해서 호출하여 컴포넌트를 생성한다면 얘는 B가 rerender 될 때마다 다시 만들어질 것임
- Context 변경으로 인한 rerender를 최소화 할 수 있을것 같음
  - 부모, 자식이 동일한 context state를 조회하여도, 이 context 감지로 인한 rerender라면, batching을 통해 한번만 rerender됨
  - State, dispatcher 짝이 있다면, state만 사용하는곳, dispatcher만 사용하는곳이 있을 수 있고 dispatcher만 사용하는곳은 state변경을 알 필요 없으므로 두개 provider 분리
  - ContextProvider를 감쌀 때, 해당 provider 컴포넌트가 직접 하위 컴포넌트를 생성하도록 하는것이 아닌, 위에서 생성된것을 props(children etc…)로 받아와서 사용하도록 함.
    - providerComponent에서 관리하고있는 context 상태가 변경되어 rerender되더라도 props로 전달받은것을 다시만드는것은 아니기 때문에, 불필요하게 전체가 rerender되지는 않을것임
- [관련 글1](https://www.developerway.com/posts/react-elements-children-parents)
- [관련 글2](https://overreacted.io/before-you-memo/#solution-2-lift-content-up)

### vite modulePreload 파일 생성

- vite빌드를 할 때, dynamic import로 할당해 놓은 애들은, 빌드 할 때 modulepreload로 분리해놓고 header에 박아넣음 따라서, 분할된 스크립트 파일이 다운로드되고, Js엔진에서 읽히기 시작할 때, modulepreload로 먼저 다운받아진것들은 바로 실행시킬 수 있는것 같음.

### package.json 동적생성하는 레포

- Package.json exports 복붙(exports filed 말고 다른것들도 복붙은 가능해보임. 재미있는 레포인듯)
- 실행중인 node.js 환경에서 다른 커맨드라인 호출, 값 받기 child_process.execSync
- process.argv로 접근한 파일 내부에서 이후의 커맨드 인자를 받고
  - node filename a b -> filename 파일에서 (a, b) 조회 가능
- [링크](https://github.com/nolimits4web/swiper/blob/master/scripts/build.js)

### window.open \_blank일 경우, sessionStorage가 상속됨.

- [관련 글1](https://stackoverflow.com/questions/20879714/how-to-prevent-sessionstorage-being-inherited-when-using-target-blank-window)

### 동적인 요소 말줄임처리

- 동적 너비를 가진 요소에, truncate와 같이 말줄임 해줄 때, 동적 너비를 가진 요소에 min-width: 0 주면 가능

### vite legacy plugin modern browser 체크방식

- Vite legacy plugin에 import(“\_”)의 이유. 정확한것은 아닌데, import.meta가 사용가능한 모던브라우저인지 체크하기 위한 용도로 보임
- [pr1](https://github.com/vitejs/vite/pull/8285)
- [pr2](https://github.com/vitejs/vite/pull/7644)

### interface -> indexSignature 타입이 못받아줌

- Typescript interface alias는 동일한 명칭의 interface를 한번 더 써서, 합쳐질 수 있기 때문에, indexSignature로 생성된 타입에서 받을 수 없음. type은 하나의 이름을 한번 더 써도 합쳐져서 변동되는것이 아니기 때문에, 문제없음.
- [관련 글1](https://github.com/Microsoft/TypeScript/issues/15300#issuecomment-332366024)
  ```js
    // 근데, 객체형식은 interface로 만드는게 너무 습관이 되어있고, 대부분 이미 구성되어있다보니 필요할 때 마다 변환해주는 커스텀 유틸타입을 만들어서 쓰는 중..
    export type ToIndexSignature<Interface> = {
      [key in keyof Interface]: Interface[key];
    };
  ```

### aws presigned url

- Aws s3 버킷에 접근가능한 권한이 포함된 presigned url을 전달받아 aws 버킷에 클라이언트에서 등록할 수 있다.

### Event loop 가시화 해주는 사이트.

- [링크](https://www.jsv9000.app/)

### 커링함수

- React에서 이벤트핸들러를 할당해주고자 할 때, return 구문 내의 값을 사용하고자할 때(.map등으로 순회된) 커링을 쓰냐 인라인으로 쓰냐 고민이 되는데, 그냥 단순하게 setState(값) 이런식으로 하나면 인라인으로도 괜찮을것 같음. 커링의 장점이 나오는 경우는
- 인라인에서 많은 로직이 수행되어야 하거나(컴포넌트 내부값들을 많이 써서 유틸로 빼기 어려운 상황)
- 해당 이벤트핸들러가 특정 값을 기준으로 재사용될 가능성이 높거나

### flex container Sticky

- 부모의 flex 속성으로 flex container가 된 자식들에게 sticky 기능을 부여하고자 할 때, align-self:flex-start를 주면 먹힘
- 부모에게 flex 값이 부여되면 자식들은 기본 stretch값으로 부여되게 되는데, 해당 값을 준 요소만 위쪽으로 정렬되어 스크롤 될 때 높이를 인식할 수 있다는것 같음..

### Openssl

- node16 / openssl 1.1.1의 지원종료일(보안수정사항 이제 안해줌. 별도로 돈주면 해주는것같기도...)과 동일한 9.11일로 땡겨서 함께 지원종료됨
- openssl 메이저 3이상 기준으로 개발된 node17 (lts node18) 사용을 권장하는것 같음 사실 이 계기로 처음 보게 됨
- [openssl link](https://www.ssldragon.com/blog/what-is-openssl/)

### yarn berry unplugged

- Yarn berry2 zero-install 특성상, 모듈들을 압축시켜 읽기만 가능하도록 관리하는데, 간혹 실행되어야하는 모듈들의 경우 Unplugged로 분리하는 경우가 있음. 이를 막기 위해 옵션을 변경하여 cache에서 함께 관리되도록 할 수 있음. package.json의 dependenciesMeta에서 각 라이브러리별 unplugged값을 주는것도 가능(yarn berry 전용)
- While Yarn attempts to reference and load packages directly from their zip archives, it may not always be possible. In those cases, Yarn will extract the files to the unplugged folder.
- [yarn berry](https://beomy.github.io/tech/etc/yarn-berry/#enablescripts)
- [발생했던 관련이슈](https://github.com/yarnpkg/berry/issues/4514)

### 디자인 ui 팁 `#사이드프로젝트` `#디자인리소스` `#제일 어려워`

- [디자인 팁](https://www.uidesign.tips/ui-tips)

### react 청크분리 이슈 `vite+react환경`

- lazy로 페이지 청크 분리하여 배포 시, 아래와 같은 상황이 발생함
- 사용자가 페이지를 보던 중, 배포 진행.
  - 사용자가 받아왔던 청크들은 브라우저에서도 청크요청, 응답을 캐시하고있어서 바로 반환 때려줘서 문제없이 보여짐(물론, 최신이 아닌 올드버전)
  - 사용자가 페이지 이동을 하거나, 이전에 받아오지 않았던 청크를 요청할 때, 청크의 이름이 변경되어 존재하지 않는 상태로 네트워크 에러 발생
- 새로고침하면 되긴 하는데, 재시도하는 등 처리 필요
- lazy를 커스텀하게 처리하는 과정에서, 반환값이 없으면 컴포넌트를 만들 때 문제가 생겨 react render error로 상단에서 ErrorBoundary로 감싸줘야 함
- ErrorBoundary로 해도 되는데, 내부에서 에러 구분을 위해 errMsg를 봐야하는게 쪼오오오 금 아쉬워서 청크를 불러올 때 실패만을 보는 lazy에서 처리하기로 함
  - 청크를 온전히 불러오지 못하더라도 render error가 발생하지 않도록, default jsx 반환
  - 청크를 불러오는데 실패한 페이지로 이동시, 그 요청또한 브라우저에서 캐시하여 다시 페이지 접근 시 해당 catch가 다시 안돔. 다만, default의 jsx 요소는 계속 새롭게 그리기 때문에, 청크를 불러오는데 실패한 페이지 접근때마다 토스트를 노출시켜주기 위해 jsx 안에서 토스트 생성

```js
const customLazy = (
	importer: Parameters<typeof lazy>[0],
): ReturnType<typeof lazy> => {
	const retryImport = async () => {
		try {
			return await importer();
		} catch (error) {
      // 해당 요청에 대한 결과 캐시 이유로 요기서 토스트 안띄움

			return await {
        // 기본 jsx 생성
				default: () => {
          // react-toastify
					showToast('페이지를 불러오는 데 실패하였습니다. 새로고침 해주세요.', {
						toastId: 'dynamic-error',
					});

					return null;
				},
			};
		}
	};

	return lazy(retryImport);
};
```

### promise resolve 유동적으로 사용하기

promise를 생성하고, resolve를 별도로 빼서 원하는 위치에서 해당 resolve를 실행시켜 promise를 await하고있는 함수에서 resolve가 호출될때까지 대기하도록 하는 방법. 매력있음

- [참고](https://daveteu.medium.com/react-custom-confirmation-box-458cceba3f7b)

### react 초기 state 재설정해주기

The key attribute on a React component is a special thing. Keys are mostly used for lists to signalize stability to React, so that the reconciler knows which elements can be re-used, and thus re-rendered.
However, you can also just put a key attribute on any component to tell React: "Please mount this whenever the key changes. As long as the key is the same, please re-render".
This can be seen a little bit like the dependency array in effects. If it changes, compared to the previous render, React will re-run the "mounting" of the component.

블라블라

요약: 컴포넌트에 변경의 주체가 될 값 key로 주기

- [블로그](https://tkdodo.eu/blog/putting-props-to-use-state)

### tanstackQuery clientData, serverData 구분 관리

- [v5 useQuery에서 onSuccess 등등.. 제거](https://github.com/TanStack/query/discussions/5279#discussioncomment-6257901)
- [떡도도 client, server 데이터 분리 관리](https://tkdodo.eu/blog/practical-react-query#keep-server-and-client-state-separate)

v5에서 onSuccess가 사라짐. 그러면서 사람들이 가장 많이 다는 이슈가 이런 내용임

> 우리 그러면 서버에서 받아온 데이터를 onSuccess를 통해 클라이언트상태로 변경하여 관리하는것은 어떻게 처리함?

개발자가 제거하는 이유 등을 적어둔 링크가 있음

- [remove useQuery callback](https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose)

suspense 기능이 활성화 되었을 경우에는 api 호출이 되며 중단되는 컴포넌트 내부의 onSuccess에 달린 setState는 의미가 없어질 것이기 때문에 onSuccess 내부에서 setState를 사용하는것은 의미가 없긴 함

- [use setState in onSuccess](https://github.com/TanStack/query/issues/3784)

이슈에 위와같은 질문이 달리면 늘 답변하던 방법, 심지어 블로그에도 작성해둔 방법이 있음

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/05/tkdodo-client-server-data-seperate.png?raw=true" alt="tkdodo-client-server-data-seperate">
</div>

1. 하나의 커스텀 훅 안에, 초기값이 될 데이터(이하 A라 함)와, 변경될 데이터를 담을 상태(이하 B라 함)를 만듬
2. B가 존재하면 B를 반환하고 없으면 A를 반환함
3. 해당 데이터를 사용하는(변조도 하는 form 같은) 곳에서 초기값은 B가 없기때문에 받아온 A를 사용함.
4. 만약 변조가 생겨서 setDraft를 하면, B를 기준으로 ui를 그림
5. A객체 내부의 특정 객체를 수정하고자 하는것도 문제 없어보임. A내부, a,b,c가 있다면 a,b,c, 각각 따로 return 시키고, 변경되는것이 b라면, b를 반환할 때에만 B가 있다면 B, B가 없다면 A-b를 반환

이렇게 하면 query로 받아오는 서버데이터를 항상 최신화시켜줄 수 있음 (pulling 걸려있는 경우에도)
물론, useEffect로도 가능은 하지만, 선호될만한 방법은 아닐듯..? 위 방법을 먼저 고려해보는게 좋을 것 같음

### TanstackQuery 캐시타임 개별적용 특이점

- 테스트중 확인한점 cachetime이 0이였던 곳 갔다가, 0이 아닌곳을 갔다면, 해당 쿼리는 계속 0이 아닌 cache time이 할당되어있는것같음. (요약. 동일 key, cache time 변경 시, 큰값이 유지됨)
  <div style="margin : 0 auto; text-align : center">
    <img src="/img/2024/02/05/gctime.png?raw=true" alt="gctime">
  </div>

### 이모지는 문자열이기 때문에 replace 같은 String Api 사용 가능

- [이모지](https://www.padosum.dev/wiki/Various-Aspects-of-Emoji/)

  - 🐻‍❄️ 요 이모지를 배열에서 스프레드로 풀어보면 곰, 눈 이모지가 나옴
  - 🐻‍❄️ 요 이모지를 js에서 사용하는 utf-16 방식으로 풀어보면 4개의 유니코드가 나오는데, 이중 첫번째, 세번째가 곰과 눈임
    > 호오..
  - 이모지도 유니코드 기반의 문자열이기 때문에 조합하여 생성될 수 있는것 같음

- [유니코드](https://goodgid.github.io/Unicode-And-UTF-Encoding/)
  - 1bit = 0.125byte / 8bit = 1byte
  - Utf-8은 문자 하나를 표현할 때, 8bit를 사용함. byte로 치면 1byte를 사용.
  - Utf-8이면 1byte 부터 Utf-32인 4byte 까지 쓸 수 있다는것 같음
  - Utf-16이면, 2byte~4byte까지
  - 비트연산자 비교방식은 각 순자를 이진법으로 표현한 다음, 두개의 숫자 중 겹쳐지는 1을 찾은 다음에 그걸 십진법으로 교체했을 때의 값을 반환함
    - 6: 110, 7: 111 —> 110 (2^0*0 + 2^1*1 + 2^2\*1)
    - 🚀 해당 이모지의 length를 조회하면 2가나오는데, 문자열을 utf-16으로 다루는 Script 에서 저 유니코드를 utf-16으로 변환했을 때, 두개의 값이 나옴. 즉, 두개를 조합해서 만든 유니코드로 2가 찍힌다는것 같음

### ISR, streaming, PPR

모노레포를 구성하던 중 기존에 알고있던 렌더링방식이 아닌 새로운것들이라 간단하게 정리해봄

#### Incremental Static Regeneration

간단하게, Ssg처럼 빌드시간에 한번 만드는데, 지정한 시간에 주기적으로 새롭게 다시빌드시킬 수 있다는것 같음

> 주기적으로 새롭게 패칭된 데이터로 새롭게 빌드

#### Streaming

완성된 페이지정보를 받아오고, 상호작용가능하게 hydrate하는시간이 길게느껴질 때 (기존의 깡 SSR 방식) 각각 컴포넌트별로 작게 청크를 나누어 모든 데이터로드가 아닌 페이지의 일부를 더 빨리 표시할 수 있다고 함.

이게 특별하게 뭘 해주는게 아니라, fallback이 부여된 suspense boundary로 감싸주기만 하면 된다네..

- [next 공식문서](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [예시, 이점 안내](https://shopify.github.io/hydrogen-v1/tutorials/streaming-ssr)

요약하면, `기존 ssr 처럼 모든 html 그리기 대기 -> 모두 hydrate 대기`가 아니라 Suspense로 감싸진분들은 따로따로 html 그리고 따로 hydrate하도록 분리시킬 수 있다는것 같음.

각각 컴포넌트들이 서로간 동기적으로 기다리고 최종 hydrate되는것이 아니라 각자 html 받고완료되면 hydrate를 진행하고 아직 hydrate중인 컴포넌트가 있더라도, 모두 완료된 컴포넌트는 클릭과 같이 사용자와 즉시 상호작용이 가능하다는것 같음.

선택적 hydrate를 통해 아직 hydrate 이전의 컴포넌트에 사용자의 상호작용이 발생하였다면, 그 컴포넌트의 hydrate 우선순위를 높여줄 수 있다는것 같은데.. 얘는 아직 미확인..

#### next14++ PPR (Partial Prerendering)

Next.config pprmode 설정 아직은 실험모드로 보임

> 얘도 그냥 별다른거 없이 위 설정이랑 suspense 경계로 구분하는듯..?

`PPR combines ultra-quick static edge delivery with fully dynamic capabilities and we believe it has the potential to become the default rendering model for web applications, bringing together the best of static site generation and dynamic delivery.`

정적 콘텐츠의 매우 빠른 전달 및, 동적 기능 결합?

- [next 공식문서](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model)

Suspense를 경계로, 중단되지 않은 부분들은 정적으로 생성하여 엣지거점(cdn같은?)에서 콘텐츠를 바로 제공하고, Suspense 하위의 영역은 동적인 컨텐츠로 관리하여 정적콘텐츠가 빠르게 전달되고 해석될 때 병렬로 받아온다(?)

isr+ssr이기 때문에, 정적 콘텐츠에 있어서도 주기적으로 다시 빌드시키도록 해줄 수 있다는것 같음(사용자 진입 후, 해당 시간 + 해당 시간 종료 후, 재빌드하는데의 시간동안 이전꺼 보여줌. 재빌드 후에는 갱신)

#### streaming이랑 ppr이랑 비교

두개 모두 Suspense로 나중에 보여질 부분을 구분한다는 특징으로 조금 헷갈렸는데, 고맙게도 비슷한 질문 글이 있었음.

- [streaming, ppr discussions](https://github.com/vercel/next.js/discussions/58322#discussioncomment-7549806)

- ppr: Suspense로 감싼 컴포넌트를 제외한 부분만 먼저 빠르게 제공하고, 이후에 Suspense 내부의 컨텐츠들을 서버로 요청해 가져옴
- streaming: Suspense로 감싼 컴포넌트도 처음에 먼저 제공하지만, 병렬적으로 Suspense 내부의 컨텐츠들을 서버로 요청해 가져옴

### url 인코딩에 제외되는 예약문자

서비스단에서 searchQuery를 전달할 때, 대괄호가 읽히지 못하는 문제가 있었음. 그 이해과정임 (개인 블로그들 기준이라 아닐수도 있음 ㅎ)

#### url 예약문자, Spring

- [url 예약문자](https://kkamagistory.tistory.com/878)
- [예약문자 및 제외문자](https://www.ibm.com/docs/ko/cics-ts/5.5?topic=concepts-reserved-excluded-characters)

url 자체에서 사용될 수 있는 예약문자(url에서 기능을 갖고있는 문자들)들은 기본적으로는 인코딩 되지 않음.

따라서, 대괄호, 소괄호는 인코딩되지 않는 예약문자로 분리되어 인코딩되지 않은채로 전달되고 있었음. 그리고, 이 문자들을 포함하여 서버로 전달했을 때, 서버에서 에러를 반환하고 있었는데,담당 서버개발자분에게 받은 답변이 있음

Spring에서는 대괄호는 Ipv6를 표현할 때에만 사용한다고 규정되어있다 함... 따라서, query 값 같이 Url에 대괄호가 포함되어있는 경우 에러를 반환하다고 함.

그래서 보내줄 때 수동으로 인코딩해서 같이 보내주기로 함..

> Spring 자체에 대해 아~~~예 몰라서 그렇구나... 싶은 정도

- [관련링크](https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2)

### React Compound pattern

상태와 비즈니스로직의 재사용성은 컴포넌트로 유지하며, 자식요소들은 유연하게 교체할 수 있도록 개발하는 컴파운드 패턴

#### 그냥 영어 해석만..

1. 컴파운드 패턴에서 상태와 논리를 관리할 상위 구성 요소를 정의합니다 .
2. 상위 구성 요소에 의해 렌더링될 하위 구성 요소를 만들고 함께 작동하여 응집력 있는 사용자 인터페이스를 형성합니다.
3. props를 사용하여 상위 구성 요소에서 하위 구성 요소로 데이터 및 제어를 전달합니다 .
4. 상위 구성 요소에서 하위 구성 요소를 렌더링하여 공통 목표를 달성하기 위해 함께 작동하는지 확인합니다.

React.Children.map으로 주입을 해주거나, context api를 사용해 A라는 Context Provider를 반환하는 컴포넌트를 export default 할 때, useContext로 값을 조회하여 사용하는 AListComponent 컴포넌트를 A.List = AListComponent 형식으로 같이 빼주고 사용하는곳에서 아래와 같이 사용

- ui와 관련된 비즈니스로직을 한곳에 응집시켜 외부에서 신경쓸 필요 없도록 숨겨두고, 같이 제공하는 컴포넌트들에는 상태를 주입해서 제공
- ui구성을 자유롭게 가져갈 수 있고

요 패턴은 손에 익고, 구현하기 전에 구조가 생각나고 눈에 보일때까지 자주 경험을 가져봐야할 것 같음

> 여러 디자인시스템에서 종종 보이긴 함. OptionGroup > Option

```js
<A>
  <A.List />
</A>
```

- [React Compound pattern](https://www.patterns.dev/react/compound-pattern/)
- [React Design System Compound pattern](https://medium.com/@vitorbritto/react-design-patterns-compound-component-pattern-ec247f491294)

## 브라우저 호환이슈

- 안드로이드 낮은 브라우저에서는 아직 e.code가 지원되지 않으니 e.keycode에 대한 로직도 함께하기
- 안드로이드 낮은 브라우저에서는 input에 userSelect none이 되어있으면 인풋 자체가 입력이 안되니, userSelect text 해주기
- iOS 낮은버전에서는 ResizeObserver가 아직 지원되지 않으니, npm으로 polyfill을 받아 빌드툴 config에 주입해주기
- iOS 낮은버전에서는 애니메이션의 ease-in등의 옵션 등 모든 구조의 값을 완성시켜야 잘 작동되는건지.. react-toast 커스텀 transition을 할당해줄 때 몇개의 옵션이 빠져있으면 적용이 안됨
