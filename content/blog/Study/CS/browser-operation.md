---
title: '💻 브라우저 렌더링 - 시각화 단계 operation'
date: 2021-07-27 14:46:00
category: 'Study'
draft: false
tag: 'CS'
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

## Painting

`Layout`단계에서 `Render Tree` 요소들의 크기, 구조등을 계산하여 `layout`을 만들었다.

하지만, 이러한 기하학적인 요소를 갖고있는 `layout`만으로 화면을 렌더링하기에는 부족함이있다.

`z-index`와 같은 속성이 적용되어있다면, `HTML`로 작성된 순서로 만 그리게 되었을 때 원하는 결과값이 다르기 때문이다.

> 이 떄문에, `DOM Tree`의 노드 순서와 페인트 순서는 다를 수 있다.

따라서, 메인 스레드는 `Layout Tree`를 순회하며 요소들의 속성(배치 방식 등)에 따라 그릴 순서를 판단한다.

`문서의 구조`, `각 요소의 스타일`, `페이지의 기하학 구조`, `그릴 순서`를 알았으니, 페이지를 렌더링할 수 있다.
이러한 정보들을 스크린의 픽셀로 바꾸는것을 **레스터화**라고 한다.

초기 화면을 레스터화 하고, 사용자의 스크롤 이벤트등으로 인해 뷰포트가 변경되면, 그만큼을 추가로 레스터화하는 방식으로 진행이 된다.

> 즉, 뷰포트가 변경되면 `Painting`과정이 한번 더 수행됨

## Composition

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/parser-blocking1.png" alt="1">
</div>

렌더링을 해야하는 페이지에서 각각의 요소들을 모두 `Layer`로 나누어서 관리한다.

이렇게 `Layer Tree`가 생성되고 페인트 순서는 이전단계에서 알고 있기 때문에 메인스레드는 해당 정보들을 **컴포지터 스레드**에게 전달해준다

그럼 컴포지터 스레드는 각 레이어들을 레스터라이즈(레스터화)를 시도 한다.

하지만, 생성된 레스터화 하려는 `Layer`의 크기가 어마어마하게 클 수 있기 때문에 컴포지터 스레드는 `Layer`을 여러개의 조각으로 쪼개서 다수의 **레스터 스레드**에게 레스터화 작업을 위임한다.

이때, 컴포지터 스레드는 레스터 스레드들에게 작업을 위임하면서 우선순위를 정해줄 수 있어, 화면에서 보여야 하는 것들을 먼저 레스터화 하도록 시킬 수 있다.

> `opacity : 1`로 보여지는 `layer` 이런것들 일까?

여러개의 조각들이 레스터 스레드에서 레스터화가 완료되면, 컴포지트 스레드는 화면에 포여질 조각들만 모아서 렌더링 하도록 전달을 해준다.

만약 스크롤이 발생하여 보여질 화면이 변경된다거나, 각각의 요소들의 위치와 같은 속성들이 변경되는 상황에는 `Layout Tree`를 재구성할 필요 없이, `composition` 단계에서 `Layer`들을 재조합해주기만 하면 된다.

이 뜻은, 메인 스레드가 작동될 필요 없이, 컴포지터 스레드에서만의 작업으로 렌더링을 할 수 있다는 점이다.

> Layout -> Paint 과정의 비용 절약

## 렌더링 성능 개선

렌더링 시간이 길어지게되면, 사용자에게 부적절한 사용경험을 남기게 될 수 있다.

사용자가 요청을하고 최종 렌더링이 될 때 까지의 시간을 가능한 단축시켜서 빠르게 화면을 접할 수 있도록 하는것이 중요하다.

`Render Tree`를 형성하기까지의 구간을 `Construction`, `Layout`단계부터 `Composition`까지 `Operation`이라고 했었다.

## Construction

날것의 파일을 브라우저가 이해할 수 있고 사용할수 있는 언어로 바꾸는 작업을 한다.

사실 이 구간에서는 **불필요한 태그 사용**을 하지 않는것이 최선이라 볼 수 있을것 같다.

## Operation

위에서 화면의 각 요소들을 `Layer`로 관리하고, 메인 스레드에서의 작업을 컴포지션 스레드에 위임하여 렌더링 비용을 절약할 수 있다고 했다.

하지만, 모든 상황에서 위와 같은 최상의 렌더링 효율을 낼 수 있는 `CSS`속성들은 한정되어있다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/operation3.jpg" alt="3">
</div>

요소의 우선순위나 색상, 보여지는 여부등을 변경하지 않는 속성들이 대부분이다.

- opacity : `Render Tree` 형성 단계에서, `display : none`은 `0px 0px`로 제외되지만, `Opacity`속성은 공간은 차지하는 상태라고 했었음
- transform(translate, scale, rotate) : 요소의 위치 혹은 고유 크기, 디자인을 해치지 않고 고유의 모양만 변경되는 `CSS` 속성

그 외의 `CSS` 속성들은 아래의 상황이 발생한다.

### Reflow

브라우저가 `layout`, `paint`, `composition` 즉, `Operation`의 모든 단계를 다시 실행하여 우선순위, 고유 크기 등이 변경되는 상황이다.

> `display`, `position`, `width` 등등

### Repaint

`paint`와 `composition` 단계만 재실행 되는 경우를 의미한다.

> `background-color`, `box-shadow` 등등

브라우저별로 `css` 속성과 관련되어 어느 수준의 단계부터 다시계산되어야 하는지 보여주는 사이트가 있다.

- [css triggers](https://csstriggers.com/)

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
