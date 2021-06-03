---
title: 'Next.js style error'
date: 2021-03-19 00:00:00
category: 'Study'
draft: false
tag: 'Next.js'
---

최근 `Loa-Hands`를 다시 전반적으로 리팩토링하면서, `Next` 버전도 수정해주었다.

별 다른 문제는 없었지만, 유독 `style` 관련해서만 문제가 발생했는데, 다시한번 복기할 겸 정리해보려고 한다.

## styled component

`React`에서 동적인 스타일을 좀 더 편리하게 사용하도록 도와주는 모듈이다. 이 컴포넌트로 생성된 클래스는 임의의 흡사 잡영어로된 클래스명을 갖게된다.

단순히 `React`에서만 사용하게될 경우에는 크게 문제가 없었는데, `Next`에서 사용하면서 어떠한 에러를 만나게 되었다.

> warning: prop `classname` did not match.

서버사이드에서 한번, 그 이후 클라이언트사이드에서 한번 실행되는 `Next`의 특성상 이 `styled component`또한 두번 렌더링되게 되는데, 이 과정에서 서로 다른 잡영어의 클래스명을 받게 되면서 생기는 문제라고 한다.

해결방법은 간단했다.

`.babelrc` 파일을 프로젝트의 루트에 추가하여 컴파일할 때 참고할 플러그인을 추가해준다.

```ts
{
  // next에서 바벨설정을 할 때 필수적으로 추가해줘야한다 함.
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      { "fileName": true, "displayName": true, "pure": true }
    ]
  ]
}
```

`babel-plugin-styled-components` 플러그인을 사용하면 된다.

해당 플러그인의 기본 목적으로는 `styled component`를 사용할 때 더 가시성있는 클래스명을 갖게 하여, 추후 디버깅을 할 때 유리할 수 있도록 해준다 한다.

또한 주목할 점은

> `consistently hashed component classNames between environments (a must for server-side rendering)`

서버측 렌더링의 과정에서 일관돤 클래스명을 부여해준다는것 같음.

## next-css

원래는 별도의 모듈이였지만, `next`에서 수용하여 직접 관리하는것 같다.

해당 모듈을 사용하면, 기존의 `React`처럼 컴포넌트별로 각각의 `css` 모듈들을 `import` 하여 사용할 수 있는데, 한가지 이상한점이 있었다.

다른때에는 잘 되지만, 유일하게 첫 라우트 이동을 했을 때에는 `css`가 적용되지 않았다.

> 그런데 이 또한, 새로고침하면 정상 작동됨..

구글링중 한 글을 보았는데,

> Yes, on route change issue still present. Long time i used next6 with old next-css and regulary gets not loaded styles on route change. After refresh page it works as expected even on route change.

> On 7 version it reproduced on every page change (not sometimes as next6).

> But if you 1) load first page 2) transition to next page (gets not loaded styles) 3) refresh page - then you take working styles on both pages.

> Looks like styles compilation is long process and delayed and page do not have time for take it and apply. After refresh page styles already precompiled and applied immediatelly.

대충 계속 존재해왔던 버그이고, 새로고침 했을 때에는 잘 적용되기 때문에, 라우트 이동하자마자 한번 새로고침해주는 방법이 있다.

더 중요한건, 개발 모드에서만 이렇고 배포 모드에서는 문제 없다고 함!

실제로 배포를 해보니 정상작동 되더라..

해프닝
