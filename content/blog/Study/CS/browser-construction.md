---
title: '💻 브라우저 렌더링 - 파싱단계 construction'
date: 2021-07-27 14:44:00
category: 'Study'
draft: false
tag: 'CS'
---

## Construction

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/construction1.PNG" alt="1">
</div>

가져온 `HTML`, `CSS`를 `parsing`하고 합쳐진 하나의 `Tree`를 생성하는것이 `constuction`단계 이다.

### HTML parsing

처음 서버에서 받아오는 `HTML`은 마크업 언어로서 `Javascript`가 각각의 `HTML`태그에 접근할 수 있도록 `DOM Tree`로 파싱해줄 필요가 있다.

```js
<html>
  <body>
    <p>Hello World</p>
    <div>
      <img src="example.jpg" alt="example.jpg" />
    </div>
  </body>
</html>
```

위와 같은 마크업을

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/construction2.PNG" alt="2">
</div>

`DOM Tree`로 파싱을 해주어야 한다.

`DOM`이란, `Document Object Model`로 `HTML`마크업 문서를 `Javascript`가 이용할 수 있는 객체로 만든것이다.

> 우리가 흔히 `React Typescript`를 사용하여 타입 상속을 해줄 때, 사용하는 `HTMLDivElement`등으로 변환되는 것이다.

그리고, 태그를 포함한 텍스트등의 모든 속성들을 `Javascript`가 읽을수 있는 `node`로 하여 상위부터 하위로 뿌리처럼 내려가는 구조를 `DOM Tree`라고 한다.

`HTML` 마크업을 `DOM Tree`로 변환하는것이기 때문에, 결과를 보면 `1:1`의 매칭 관계를 맺는다고 한다.

하지만 여기서 생성된 `DOM`은 `Javascript`기반이 아니다. 오로지 웹페이지를 효율적으로 렌더링하고 개발자가 여러 목적으로 `DOM`의 각 요소들을 동적으로 조작할 수 있도록 브라우저에서 제공하는 `Web API`이다.

> `Javascript`의 작동원리를 생각할 때, `setTimeout`과 같은 비동기작업들이 실행되는 `Web API`가 브라우저에서 제공하는 `API`이다. 따라서, 메인스레드가 아닌 다른 스레드에서 작업이 실행되고, 완료된 후의 콜백함수를 다시 `Javascript`의 `Task Que`에 전달하는것

`Web API`는 `Javascript API`와 함께 사용되지만, 항상 그렇지는 않으며, 절대로 동일한것도 아니다.

### CSS parsing

`HTML` 마크업을 파싱하면서, `CSS`도 마찬가지로 파싱을 하여 `CSSOM - CSS Object Model`을 구축한다.

`CSSOM`에는 `HTML` 마크업 안에 있는 임베디드 스타일, css파일등 스타일에 있는 `color`나 `font-size`와 같은 디자인적인 속성들을 설정한다.

사실 사용자의 커스텀한 속성 외에도, 모든 브라우저들은 `user agent styles`이라고 하는 기본 스타일 집합인 `computed styles`가 존재한다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/construction3.PNG" alt="3">
</div>

`CSSOM`은 `cascading`이라는 룰을 갖고 있다.

1. 계단식 스타일
   > 동일한 속성의 스타일이라면 최 하단의 스타일이 적용됨
2. `class`, `id`와 같은 선택자에 따라 우선순위가 결정됨
3. 몇몇 속성에 한정된 상속
   > 부모 태그의 속성에 하위 태그도 영향을 받는 경우들

이러한 룰을 갖고 스타일을 세분화, 파싱한다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/construction4.PNG" alt="4">
</div>

## DOM Tree + CSSOM = Render Tree

`body`태그를 `Render Tree`의 루트 오브젝트로 생성한다. 이후, 하위는 나머지 `DOM Node`들로 구성을 한다. 이 때의 `Render Tree`는 `DOM Tree`와 1:1 매칭이 아닌 상태이다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/construction5.PNG" alt="5">
</div>

위의 사진을 통해 `CSSDOM`과 `DOM`이 합쳐졌지만, `display : none`이라는 속성이 존재하는 노드는 `Render Tree`에서 제외됨을 확인할 수 있다.

해당 속성을 통해 요소는 화면에서 `0px 0px`의 크기를 갖기 때문이다.

하지만 `opacity : 0;`나 `visiblity : hidden;`은 크기가 아닌 다른 속성으로인해 안보이는것이기 때문에, `Render Tree`에 포함된다.

`DOM API`를 통해 접근이 `DOM Tree`와는 다르게, `CSSOM`에 직접적인 접근은 불가능하지만 `Render Tree`로 서로가 결합한 이후, 브라우저는 `DOM`의 요소들의 `CSSOM`을 노출시켜 접근할 수 있도록 해준다.

```js
element.style.backgroundColor = 'red'
getComputedStyle(document.body).background
```

## 결론

`HTML`, `CSS`를 `Javascript`가 이해할 수 있도록 분석하고, 결합하여 화면의 보여질 노드들만을 간추린 `Render Tree`를 생성하였다.

하지만, 한가지 의문점이 있다.

만약 `parsing`도중, `script`태그나 `link`로된 스타일시트 혹은 스크립트 파일을 만나게되면 어떠한 일이 일어날까?

다음 포스트에서 알아보도록 하자

## 참조

- [까마귀의 생각 창고 - 웹 브라우저 동작원리](https://development-crow.tistory.com/5)
- [LogRocket - Eliminate content repaints with the new Layers panel in Chrome](https://blog.logrocket.com/eliminate-content-repaints-with-the-new-layers-panel-in-chrome-e2c306d4d752/)
- [consturction](https://sangcho.tistory.com/entry/browser-rendering-construction)
