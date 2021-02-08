---
title : "Next.js Webpack"
date : 2021-02-01 00:00:00
category : "Study"
draft : false
tag : "Next.js"
--- 

대부분의 프레임워크들은 편리한 배포를 위해, `Webpack`파일을 알아서 만들어준다.

따라서, 간단한 커맨드를 통해 빌드파일을 만들 수 있는데
> 이전에 `Vanila JS`, `Node.js`,` Mysql`로 서버, `DB`부터, `Webpack` 빌드환경까지 만들었던 생각을 해보면 참 편하긴 함..

`Next.js`또한 그러한 기능을 제공한다.

## 문제발생 😡
`loa-hands`앱을 `Next.js`로 개발해보는 과정에서, `Home Route`는 모든 사용자에게 공통된 정보를 보여주기때문에, `getStaticProps`메소드를 통해 정적 `pre-rendering`을 사용하기로 했다.

해당 앱은 로스트아크 공식 사이트 전투정보실에 생성된 돔을 가져와서 데이터를 재가공하기 때문에, `DOMParser` API를 사용하는데, 해당 API가 존재하지 않는다는 에러가 발생했다
> 당연한것이, `DOMParser`는 돔이 구성되는 클라이언트? 측에서 존재하는 API이라고 알고있어서 서버상에서 작동되는 `getStaticProps`실행시에는 해당 API가 존재할 수 없었다.

너무나도 고맙게도, `JSDOM`이라는 외부 모듈을 가져와서 서버상에서도 돔을 조작할 수 있도록 하였는데

<div style="text-align : center">
  <img src="/img/2021/02/01/1.PNG?raw=true" alt="1">
</div>

**뭐야?**

## 두번의 번들링
`Next.js`는 개발중에도 가상의 서버를 통해 진행된다. 따라서, `npm run dev`메소드가 실행되면 가상의 서버가 실행되고, 작성했던 파일들이 번들링되어 화면을 그려주는 걸로 알고있었다.

**하지만** 알고보니 `Next.js`는 클라이언트상에서 한번 서버에서 한번 총 두번의 번들링 과정을 갖는다고 한다. 따라서, `JSDOM`을 통해 서버에서 돔을 조작할 수 있게 되었지만, 클라이언트단 에서는 `JSDOM`모듈이 사용하는 외부 모듈들을 실행시키지 못하는것이였다.

너무 고맙게도, `Next.js`는 `webpack`메소드를 통해, `Webpack`파일을 수정할 수 있었는데

<div style="text-align : center">
  <img src="/img/2021/02/01/2.PNG?raw=true" alt="2">
</div>

해당 메소드를 사용하여 서버환경이 아닐경우, 해당 노드들을 사용하지 않게하였고, 정상적으로 작동되었다.

## next-redux-wrapper
`Next.js`에서도 `redux`를 사용할 수 있는데, 기존 `React.js`와는 다르게 하나의 모듈이 더 필요하다. `next-redux-wrapper`

<div style="text-align : center">
  <img src="/img/2021/02/01/3.PNG?raw=true" alt="3">
</div>


`Next.js`는 `SEO`최적화를 위한 `pre-rendering`이 가능한 프레임워크로서 개발자의 필요에 따라 특정 라우트를 서버에서 미리 생성하게 할 수 있다. 그렇게 된다면, 클라이언트단에서 페이지 라우팅을 할 때마다 새로운 페이지를 받아오면서 새로운 `Redux Store`를 생성하게되는데, 이때 필요한 것이 `next-redux-wrapper`이다.
> `next-redux-wrapper`의 사용법은 해당 깃허브주소에 잘 나와있다.

이 모듈을 사용해야만 `getStaticProps`와 같이 서버에서 실행되는 메소드 내부에서도 `Redux Hook`을 사용할 수 있다.


<div style="text-align : center">
  <img src="/img/2021/02/01/4.PNG?raw=true" alt="4">
</div>

`Reducer`에서는 기존 `React.js`와 다르게 `HYDRATE`이라는 타입이 추가되는데, 이 과정에서 서버에서 가지고있는 `store`정보와 클라이언트에서 갖고있는 `store`의 정보를 하나로 합친다.

이로인해, 위에서의 상황을 해결하여 완성한 `pre-rendering`을 통해 받은 데이터를 클라이언트에서 그대로 사용할 수 있다.

<div style="text-align : center">
  <img src="/img/2021/02/01/5.PNG?raw=true" alt="5">
</div>

터미널을 통해 해당 과정을 지켜보면

<div style="text-align : center">
  <img src="/img/2021/02/01/6.PNG?raw=true" alt="6">
</div>

1. 서버에서 기본값으로 구성된 `store`가 생성되고
3. 서버에서 `dispatch`메소드를 통해 `store`에 변화를 주게된다.
> 이 때, 보내지는 정보들은 `JSON`형식이 아니면 에러가 발생하더라..
4. `App`을 감싸준 `wrapper`에서 서버에서 생성된 `store`를 확인하는것 같다.
> `wrapper`와 관련된것은 `next-redux-wrapper`의 공식 깃허브 디렉토리를 가보면 잘 나와있다.

이후, 정적파일로 빌드해보면 `index.html`에 `pre-rendering`이 잘 되어있음을 확인할 수 있다.



**야호!🥳**