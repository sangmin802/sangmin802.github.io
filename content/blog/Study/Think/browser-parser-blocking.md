---
title: '💻 브라우저 렌더링 - CRP 멈춰!'
date: 2021-07-27 14:45:00
category: 'Study'
draft: false
tag: 'Think'
---

## Parsing Blocking

브라우저의 `Web API`는 `text/html`인 `HTML` 코드로부터 `DOM Tree`를 구성하도록 해주는 `DOM Parser`를 제공한다.

> 흔히 아는 `new DOMParser()`

대부분의 웹 어플리케이션은 `HTML`, `CSS`, `JS`가 함께해야 완전하다.

즉, `HTML`을 `parsing`하다보면 `embedded`되거나 외부 파일로 연결된 `CSS`, `JS`를 만나게 된다.

> 그 외에도, `img`와 같이 외부 링크를 다운받아야 하는 경우도 있다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/parser-blocking1.png" alt="1">
</div>

`DOM Parsing`을 포함한 대부분의 브라우저 렌더링의 작업들은 메인스레드에서 진행이 된다.

그렇다면, 중간에 다른 작업이 필요한 경우, 어떠한 우선순위로 작업을 수행할까

## Parser-Blocking Scripts

이름에서부터 알 수 있는것처럼, `Javascript`의 파일 또는 코드들을 의미한다.

기본적으로 `script`태그를 만나게 된다면, 해당 스크립트를 먼저 일고, 실행시킨 다음 나머지 `HTML`을 파싱한다.

**렌더링엔진의 메인스레드에서 파싱 도중 `script`코드를 만나게 된다면, 자바스크립트 해석기에 역할을 넘기고 대기한다. 여기서 자바스크립트 해석기가 우리가 잘 알고있는 자바스크립트의 콜스택(흔히 이러한 특징때문에 싱글스레드라고 불리는)에서 작업을 수행하게 된다.**

```js
<div>Hello</div>
<script>...</script>
<div>Parse stop</div>
```

따라서 위와같은 `embedded Script`들은 모두 메인스레드의 `HTML` 파싱을 중단시키고, 모든 `embedded Script`들은 `Parser-Blocking`이라고 불린다.

그렇다면, 왜 `Script`파일을 만나게된다면, 파싱을 중단할까?

기본적으로 개발자들은 `DOM`에 이벤트를 부여하거나, 조작하고 변경할수 있는데, 이것이 가능한것이

브라우저에서 형성된 `DOM`은 `DOM API`를 통해 `Javascript` 환경에 노출시키기 때문이다.

> 즉, `Document.write` 처럼`Javascript`의 문법이 이전에 형성되어있는 `DOM`의 요소를 바꿀 수 있기 때문

하지만, `DOM`의 요소를 바꾸지 않는 `Script` 인데도 불구하고, 다운로드 하는 동안 `DOM Parser`의 작업이 멈추게 된다는점은 그만큼의 시간이 더 든다는 점이다.

### async defer

브라우저가 `HTML`을 파싱하면서, `Script`를 만났을 때에 로드하는 방식을 알려주는 방법이 있다.

> `embedded`를 제외한

`script` 요소에 `async` 혹은 `defer`속성을 할당해주는 것이다.

- 아무속성x : `DOM` 파싱 중 `script`를 만나면 `DOM` 파싱 중단 > `script` 파일 다운로드 > `script` 실행 > 나머지 `DOM` 파싱
- async : `DOM`파싱과 `script`파일 다운로드, 실행 병렬 진행(따라서 순서가 명확하지 않음 `DCL` 이전, 이후 모두 가능)
- defer : `DOM`파싱과 `script`파일 다운로드 동시 진행 > `script`다운로드 완료되어도 `DOM`파싱 진행 > `DOM`파싱 종료 후 스크립트 실행. 단, `DCL` 이전

단, `type="module"`일 경우, 위 비동기속성을 주지 않았더라도 파싱을 막지 않음. 근데, SPA 기준 파싱을 막지는 않아서 html내 콘텐츠는 그리겠지만 app 내부 컨텐츠에 요소를 그리기 전에 어마어마하게 오래걸리는 작업이 있다면 최종 화면을 그리는데에는 오래걸릴 수 있을 것 같음

내 브라우저에서 임의로 테스트해보려 했지만, 어지간한 양이 아니라면, 네트워크 속도 때문에 확인하기가 어려웠다..

따라서 좋은 예시를 보여주고 있는 사이트를 통해 보는것이 좋을듯 하다!

- [normal vs async vs defer](https://sangcho.tistory.com/entry/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98-Rendering-3-Rendering-Process-in-browsers?category=740188)

## Parser-Blocking? No! Render-Blocking CSS

`script`요소외의 것들은 `DOM`파싱을 막지 않는다. 따라서, `CSS`는 `DOM`파싱을 **직접적**으로 막지는 않는다.

`embedded` 스타일이나, `inline` 스타일의 경우 종종 `DOM`파싱을 막는 경우가 있다.

`embedded`스타일의 종료를 알리는 `</style>`을 만났을 때, `DOM`파싱이 멈추고 해당 구간의 `embedded`스타일을 파싱하여 `CSSOM`트리를 업데이트한다. 그 이후에 `DOM`파싱이 재개된다.

왜일까?

이전 포스트에서 `CSSOM`은 `cascading`이라는 룰을 기준으로 `CSSOM`트리를 형성한다고 했다.

그 특징중 하나가 중요했는데,

1. 계단식 스타일
   > 동일한 속성의 스타일이라면 최 하단의 스타일이 적용됨

이와같은 이유 때문에, `DOM Tree`는 점진적으로 구성되지만, `CSSOM`은 그런 방식으로는 불가능하다.

만약 `CSSOM`을 점진적으로 구성하게 된다면, 동일한 요소의 동일한 속성에 다른 값으로 부여되는 코드가 여러 줄에 존재할 수 있고,
하나의 속성 변경이 여러 요소에 영향을 줄 수 있기 때문이다.

그렇게된다면 계속해서 `CSSOM`이 업데이트됨에 따라 `Render Tree`가 여러번 렌더링이 되어 많은 비용이 소요되고, 사용자에게 좋지않은 경험을 줄 수 있다.

`styleSheet`의 경우 `embedded`, `inline`스타일과 다르게 백그라운드에서 완전히 다운로드 받을 수 있어 `DOM`파싱을 중단시키지는 않는다.

다만, `styledSheet`도 위의 룰로 인해 `styleSheet`를 처리하고 딱 한번만 `CSSOM`트리를 수정한다. 그리고 수정된 `CSSOM`트리를 통해 `Render Tree`가 업데이트된다.

`CSS`가 `Render-Blocking` 자원이라고 불리는 이유이다. 스타일 요소가 읽히는 동안에는 `Render Tree` 구성이 중지된다.

> 마지막에 한번만 `CSSOM` 수정 > `Render Tree` 업데이트가 이뤄지기 때문

하지만, `Render Tree`의 구성이 멈출뿐이지, `DOM`을 파싱하는것은 멈추지 않는다.

`DOM` 파싱이 종료되어 `DOM Tree`가 완성되었다고 하더라도, `CSSOM`트리가 아직 완성되어있지 않는다면 `Render Tree`를 구성하지 않는다.

> 생각해보면 당연한것이, `CSS`작업이 완료되지 않았는데 화면에 보여질 요소들을 형성한다는것이 말이안됨

위와 같은 상황을 `CRP`가 멈춘 상황이라고 한다.(화면을 그리지 않음)

> CRP - Critical Rendering Path 브라우저 렌더링 경로

또한, `styleSheet`를 백그라운드에서 다운로드 받을 수 있기 때문에, `HTML`을 파싱하면서 `script`또한 읽힐 수 있다.

경우에 따라 읽힌 `script`는 실행될 수 있는데, 브라우저는 이전의 `styleSheet`가 파싱되어있지 않다면 다운로드된 `script`를 `block`한다고 한다. 이를, `Script-Blocking stylesheet` 또는 `Script-Blocking CSS` 라고 한다.

> `JS`로 `DOM Tree` 요소의 스타일을 수집한 후에 `CSSOM`이 업데이트 되어 `DOM Tree`가 변경된다면 `JS`는 잘못된 스타일 속성을 가질 수 있기 때문

## 결론

`Parse` 중단, `Render`중단에 따른 `CRP`가 멈추는상황들을 알아보았다.

위와같은 상황들을 모두 거치고 완성된 `Render Tree`는 어떠한 과정을 거쳐 마침내 사용자에게 보여지는지 다음 포스트로 이어서 알아보도록 하자.

## 참조

- [parse-blocking](https://sangcho.tistory.com/entry/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98-Rendering-3-Rendering-Process-in-browsers?category=740188)
- [parse-blocking vs render-blocking](https://stackoverflow.com/questions/37759321/parser-blocking-vs-render-blocking)
- [modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
- [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)
