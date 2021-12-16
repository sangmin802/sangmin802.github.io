---
title: '💻 브라우저 렌더링 - 시각화 단계 operation'
date: 2021-07-27 14:46:00
category: 'Study'
draft: false
tag: 'Think'
---

## Operation

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/operation1.PNG" alt="1">
</div>

`CSSOM`과 `DOM Tree`를 결합하여 오로지 화면에 `render`될 요소들만 남긴 `Render Tree`를 형성하였다.

이제, 이 `Render Tree`를 속성에 맞게 화면에 `render`하는데까지의 과정을 살펴보자

## Layout

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/operation2.png" alt="2">
</div>

`Render Tree`의 요소인 각 `Node`들의 뷰포트 내에서 크기, 위치 등의 구조들을 계산하여 `layout`을 생성한다.

스크롤을 하여 변화된 뷰포트 기준으로 새롭게 위치값을 계산해야하거나, 직접적으로 DOM의 위치값에 변화를 주었을 때, 다시 계산하게되는데 이러한것을 `reflow` 라고 한다.

## Painting

`Layout`단계에서 `Render Tree` 요소들의 크기, 구조등을 계산하여 `layout`을 만들었다.

하지만, 이러한 기하학적인 요소만으로는 화면이 완성되었다고 할 수 없다.

`문서의 구조`, `각 요소의 스타일`, `페이지의 기하학 구조`, `그릴 순서`를 알았으니, 페이지를 렌더링할 수 있다.
이러한 정보들을 스크린의 픽셀로 바꾸는것을 **레스터화**라고 한다.

이렇게 위치값과같은 기하학적인 요소는 변화가 없지만, 색상과같은 변화가 다시 발생하는것을 `repaint`라고 한다.

## Composition

위와같이 스크롤을 하여 뷰포트가 변경되는등 자연스럽게 발생하는 `reflow`등에 대한 렌더링 최적화를 위해 추가된 방법이다.

이전에는 스크롤을 하여서 페이지 내부에서 뷰포트가 하단으로 이동하였을 때, 새롭게 화면을 그려냈다. 그런데 문제는, 요소에 변경이 있다면 그 위치값을 다시계산하기 위해 `reflow`가 발생하는 점 이였다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/parser-blocking1.png" alt="1">
</div>

렌더링을 해야하는 페이지에서 각각의 요소들을 모두 분리하고 미리 `Layer`로 나누어서 관리한다.

각각의 요소들이 모두 분리되어서 관리되기 때문에, 위치가 변경된다고 해서 다른 레이어에 영향을 주지 않는다.

`Layer Tree`가 생성되고 페인트 순서는 이전단계에서 알고 있기 때문에 메인스레드는 해당 정보들을 **컴포지터 스레드**에게 전달해준다

그럼 컴포지터 스레드는 각 레이어들을 레스터라이즈(레스터화)를 시도 한다.

하지만, 생성된 레스터화 하려는 `Layer`의 크기가 어마어마하게 클 수 있기 때문에 컴포지터 스레드는 `Layer`을 여러개의 조각으로 쪼개서 다수의 **레스터 스레드**에게 레스터화 작업을 위임한다.

이때, 컴포지터 스레드는 레스터 스레드들에게 작업을 위임하면서 우선순위를 정해줄 수 있어, 화면에서 보여야 하는 것들을 먼저 레스터화 하도록 시킬 수 있다.

여러개의 조각들이 레스터 스레드에서 레스터화가 완료되면, 컴포지트 스레드는 화면에 포여질 조각들만 모아서 렌더링 하도록 전달을 해준다.

만약 스크롤이 발생하여 보여질 화면이 변경된다거나, 각각의 요소들의 위치와 같은 속성들이 변경되는 상황에는 `Render Tree`를 재구성할 필요 없이, `composition` 단계에서 `Layer`들을 재조합해주기만 하면 된다.

이 뜻은, 메인 스레드가 작동될 필요 없이, 컴포지터 스레드에서만의 작업으로 렌더링을 할 수 있다는 점이다.

- 실제로, 애니메이션 속성을 부여할 때, `width`을 변경하면 `alert`를 사용하여 중단시켰을 때, 애니메이션도 중지되지만, `transform` 속성을 사용하면 `alert`이 활성화 되어도 중지되지 않고 끝까지 진행된다.(비동기같음)
- 렌더링 프로세스의 메인스레드에서 자바스크립트 코드를 만나 자바스크립트 해석기에 역할을 위임하고, 콜스택에서 `window.alert`라는 중단 `api`가 호출되면서 메인스레드는 중단되지만, 위와같이 컴포지터 스레드에서 실행되는 작업들은 렌더링 프로세스의 메인스레드와는 별도의 스레드이기 때문에 중단되지 않는것 같다.

생성된 `Render Tree`에서 레이어트리에 포함시킬 레이어들을 골라내는 기준이 있을까?

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/operation3.jpg" alt="3">
</div>

위의 속성들이 할당된 요소들은 레이어 트리에 별도의 레이어로 만들라는 일종의 약속인것 같다.
요소의 우선순위나 색상, 보여지는 여부등을 변경하지 않는 속성들이 대부분이다.

- opacity : `Render Tree` 형성 단계에서, `display : none`은 `0px 0px`로 제외되지만, `Opacity`속성은 공간은 차지하는 상태라고 했었음
- transform(translate, scale, rotate) : 요소의 위치 혹은 고유 크기, 디자인을 해치지 않고 고유의 모양만 변경되는 `CSS` 속성

혹은, 이러한 속성을 사용하지 않는 요소를 레이어로 만들고 싶다면
`will-change` 속성을 사용하라고 한다.

하지만, 위와같이 무분별하게 레이어 트리에 포함시키고 관리한다는것도 하나의 비용이소모되기 때문에 지나치게 된다면 되려 역효과만 난다고 한다.

크롬에서는 레이어가 과도하게 많아지는것을 막기 위해 레이어를 생성하지 않거나, 하나로 합치기도 한다고 한다.

## 렌더링 성능 개선

렌더링 시간이 길어지게되면, 사용자에게 부적절한 사용경험을 남기게 될 수 있다.

사용자가 요청을하고 최종 렌더링이 될 때 까지의 시간을 가능한 단축시켜서 빠르게 화면을 접할 수 있도록 하는것이 중요하다.

`Render Tree`를 형성하기까지의 구간을 `Construction`, `Layout`단계부터 `Composition`까지 `Operation`이라고 했었다.

## Construction

날것의 파일을 브라우저가 이해할 수 있고 사용할수 있는 언어로 바꾸는 작업을 한다.

사실 이 구간에서는 **불필요한 태그 사용**을 하지 않는것이 최선이라 볼 수 있을것 같다.

### Reflow

브라우저가 `layout`, `paint`, `composition` 즉, `Operation`의 모든 단계를 다시 실행하여 우선순위, 고유 크기 등이 변경되는 상황이다.

> `display`, `width` 등등

`position : absolute`나 `position : fixed`와 같이 다른 요소들보과 다른 영역에 생성된 요소의 경우 너비와 같은 속성의 변경으로 `reflow`가 발생할 때, 다른 요소에는 영향을 주지 않아서 `position : absolute`와 같은 속성을 사용하지 않았을 때 보다 비교적 적은 `reflow` 비용이 소모된다.

> 성능탭을 확인해보면 발생이 안하는것은 아닌듯

따라서, 복잡한 애니메이션을 갖고 있는 요소라면 `position : absolute`와 같은 속성을 사용하여 다른 요소들은 재계산 되지 않도록 하자.

- [reflow 비용 줄이기](https://developers.google.com/speed/docs/insights/browser-reflow)

### Repaint

`paint`와 `composition` 단계만 재실행 되는 경우를 의미한다.

> `background-color`, `box-shadow` 등등

브라우저별로 `css` 속성과 관련되어 어느 수준의 단계부터 다시계산되어야 하는지 보여주는 사이트가 있다.

- [css triggers](https://csstriggers.com/)

### 위치값 조회 reflow 발생, 레이아웃 스레싱

`getBoundingClientRect`, `offsetWidth`와 같이 요소의 기하학적인 요소를 조회할 경우 최신의 위치값을 알 기 위해, 이전까지 누적된 계산 요청을 일괄처리하여 `reflow`를 발생시키고 값을 반환한다.

```js
function logBoxHeight() {
  box.classList.add('super-big')

  console.log(box.offsetHeight)

  box.classList.add('super-super-big')

  console.log(box.offsetHeight)
}
```

위와같은 함수가 호출되었을 때, 최신의 `box.offsetHeight`을 얻기 위해 이전에 추가된 `class`의 기하학적인 변화를 `reflow`한다.

`box.offsetHeight`의 최신의 값을 알기 위해 2번의 `class`가 추가되어 2번의 `reflow`가 불필요하게 발생한다.

```js
function logBoxHeight() {
  box.classList.add('super-big')
  box.classList.add('super-super-big')

  console.log(box.offsetHeight)
}
```

위치값의 변화를 발생시킬수 있는 로직들은 하나로 뭉치고, 그러한 위치값을 조회하는 로직은 되도록 최소한의 `reflow`만 발생하도록 한다.

```js
function resizeAllParagraphsToMatchBlockWidth() {
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px'
  }
}
```

`i` 번째 요소의 너비를 `box.offsetWidth`와 동일하게 변경시키는 로직이다.

중요한 점은, `A`라는 요소의 기하학적인 값이 변경되었을 때 `B`또한 기하학적인 값이 변경될 수 있기 때문에 `B`의 최신의 위치값을 조회하려한다면 다시 계산하는 `reflow`가 발생한다.

> 주변 환경에 위치한 요소가 변경되었을 때에도 기하학적인 값을 다시 계산함. 당연한것이, 서로 붙어있는 `A`, `B`요소중 `A`의 너비가 달라진다면 `B`또한 위치가 달라질 수있기때문

즉, 저 로직에있어서 `box.offsetWidth`를 계속 호출할 때마다 이전에 `i`번째 요소의 너비가 변경되었기 때문에 최신의 `offsetWidth`를 알기 위해 `reflow`가 발생한다.

```js
var width = box.offsetWidth

function resizeAllParagraphsToMatchBlockWidth() {
  for (var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = width + 'px'
  }
}
```

`i`번째 요소가 변경될 때 마다 `offsetWidth`의 최신값을 계산하도록 하지 말고, 한번만 계산된 `offsetWidth`를 기억하고 사용하도록 한다.

다른 요소의 위치값 변경으로 달라질 여부가 있는 위치값을 다시 계산하기 위한 `reflow`가 과도하게 발생할 수 있는 레이아웃 스레싱 문제

> `i`번쨰 요소가 업데이트될 때마다 새롭게 계산된 `offsetWidth`를 필요하도록 요청하는것이 아닌, 이전에 한번만 계산된 `offsetWidth`를 기억하여 사용

핵심은 위치값을 요청하는 로직들은 이전에 발생한 자신 혹은 다른 요소들의 기하학적 변화로 인해 최신의 위치값을 계산하기 위해서 `reflow`가 발생한다.

```js
setTimeout(() => {
  changedBox.style.height = '200px'
  changedBox.style.height = '400px'
})

setTimeout(() => {
  changedBox.style.height = '200px'
  console.log(box.getBoundingClientRect())
  changedBox.style.height = '400px'
})
```

성능탭에서 확인하였을 때, 위의 두가지에서 첫번째에는 한번의 레이아웃(`reflow`)이 발생하고 아래는 두번의 레이아웃이 발생한다.

활동에 `스타일 다시 계산 예약`이라는 명칭이 있는데, 기하학적인 수치가 변경되었을 때 다시 계산하는것을 즉시실행하는것이 아니라 예약을 넣었다가 일괄처리하는것 같다. 하지만, 중간에 `getBoundingClientRect`와 같이 값을 조회하려고 한다면 최신의 상태를 계산하기 위해 이전의 예약된 모든 계산을 처리하게 되어 한번의 `reflow`가 더 발생하는게 아닐까 예상해본다.

- [레이아웃 스레싱 피하기](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing#%EA%B0%80%EA%B8%89%EC%A0%81_%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83_%ED%94%BC%ED%95%98%EA%B8%B0)

## 이벤트가 발생할 때

클릭과 같은 사용자의 이벤트가 발생하면, 브라우저 프로세스에서 이벤트를 감지한다.

다만, 이벤트핸들러는 자바스크립트로서 렌더링프로세스의 메인스레드에서 작업을 수행하므로 이벤트가 발생한 좌표를 렌더링프로세스에 전달한다.

스크롤을 할 때, 추가되는 뷰포트를 추가로 그리는 대신 컴포지터스레드에서 각각을 레이어화 하여 합성만을 하도록 하는것이 최근 브라우저의 작동방식이였다.

이벤트핸들러가 연결된 요소가 컴포지터스레드에서 관리되는 상태라면 컴포지터스레드는 해당 영역을 기억하고, 브라우저 프로세스에서 해당 영역에서 이벤트가 발생하였을 때 렌더링프로세스의 메인스레드에 바로전달되기 전 컴포지터스레드와 통신을 하고 전달하는것 같다.

> 링크의 그림을 보면 브라우저프로세스에서 감지된 이벤트를 컴포지터스레드를 거쳐 메인스레드로 전달되는것처럼 보인다.

만약, 이벤트핸들러가 연결된 요소가 없다면 컴포지터스레드는 해당 이벤트에 대한것을 메인스레드에 확인하지 않고 그냥 본인의 일을 계속해서 진행한다.

이벤트 위임을 통해 이벤트를 효율적으로 부여하는 기법을 사용하게 되는데, 그럴 경우 컴포지터스레드에서 이벤트가 존재한다고 구분짓는 영역이 늘어나게 되면서 실제로는 이벤트가 할당되어있지 않는 영역이여도 컴포지터스레드가 메인스레드에게 확인을 받아야 하는 상황이 발생해 컴포지터스레드의 별도로 작업을 멈춤없이 진행한다는 장점을 훼손시킬 수 있다고 한다.

> 메인스레드와 별도로 작동되는것이 아닌 꾸준히 통신해야하는 영역이 늘어나는 상황

- [컴포지터스레드와 이벤트](https://developers.google.com/web/updates/2018/09/inside-browser-part4)

## 결론

브라우저의 렌더링 과정과, 성능개선에 대해 알아보았다.

처음 `HTML Parsing`부터 `Composition`까지 브라우저를 렌더링하는 모든 단계들을 `CRP - Critical Rendering Path` 라고 한다.

> 이전, `CRP`가 중단되는 상황을 설명했던 포스트에서의 그 `CRP`다

그중에서도, 렌더링 최적화에있어서 여러부분에 놀라게되었는데, 현재 사용하고 있는 방식들 중 몇몇부분은 `operation`단계에서 많은 비용이 사용되고 있다는 점 이였다.

이 문제에 대해서 개선해봐야할 것 같다.

> 아래 `LogRocket` 블로그에서는 테스트 방법도 나와있으니 해봐야할듯!

## 참조

- [operation](https://sangcho.tistory.com/entry/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%9D%98Rendering2Operation?category=740188)
- [modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
- [high performance animations](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [LogRocket - repaint](https://blog.logrocket.com/eliminate-content-repaints-with-the-new-layers-panel-in-chrome-e2c306d4d752/)
- [composite](https://devsdk.github.io/ko/development/2021/03/29/blink-render-composition.html)
- [최신 브라우저 내부](https://d2.naver.com/helloworld/2922312)
- [Stick to Compositor-Only Properties and Manage Layer Count](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
