---
title: '💻 브라우저의 렌더링 과정 및 구간별 성능개선'
date: 2021-07-26 14:44:00
category: 'Study'
draft: false
tag: 'CS'
---

`naver.com`, `youtube.com` 정말 많은 사람들이 url입력창에 다양한 사이트 주소를 입력하고 접속을 한다.

우리가 입력하는것은 한 줄의 영어 주소인데, 어떻게 브라우저는 하나의 웹 사이트를 만들어내는걸까?

## naver.com -> 10.20.215.....

사실 우리가 입력하는 `naver.com`이런 도메인 자체로는 아무런 힘을 갖고 있지 않는다.

웹 어플리케이션들은 본인만의 고유한 `IP`를 갖고있는데, 이 규칙성없는 숫자집합을 우리는 외우기도 힘들고 입력하는데도 불편하니 우리의 입맛에 맞게 새로운 이름을 붙여준것이 `naver.com`이런 것들이다.

그래서, `naver.com`을 입력했을 때 서버에 이대로 요청을 하는 것이 아닌 도메인 주소와 매칭된 웹 어플리케이션의 `IP`를 연결해주는 누군가의 도움이 필요하다.

그러한 역할을 해주는것이 `DNS 서버`였다.

> 저번 DNS와 IP를 비교한 글을 통해 배웠었다.

어쨌든, 매칭된 `IP`주소를 사용하여 해당 `IP`주소를 찾아가게 된다.

## 필요한 기초자원 수집

요청이 잘 전달되었다면, 해당 서버에서는 `HTML`, `CSS`와 같이 웹 어플리케이션을 구성하기위한 기초 자원들을 브라우저에게 전달해준다.

## 렌더링 엔진의 렌더링 과정

자원들이 전달된다면, 브라우저의 렌더링 엔진이 해당 자원들을 화면에 표시하기위한 작업들을 시작하게된다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/26/1.PNG" alt="1">
</div>

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
  <img src="/img/2021/07/26/2.PNG" alt="2">
</div>

`DOM Tree`로 파싱을 해주어야 한다.

> `DOM`이란, `Document Object Model`로 `HTML`마크업 문서를 `Javascript`가 이용할 수 있는 객체로 만든것이다.
> 그리고, 각각의 속성(태그, 텍스드 등등)들을 `node`로 하여 상위부터 하위로 뿌리처럼 내려가는 구조를 `DOM Tree`라고 한다.

`HTML` 마크업을 `DOM Tree`로 변환하는것이기 때문에, 결과를 보면 `1:1`의 매칭 관계를 맺는다고 한다.

### CSS parsing

`HTML` 마크업을 파싱하면서, `CSS`도 마찬가지로 파싱을 하여 `CSSOM - CSS Object Model`을 구축한다.

`CSSOM`에는 `HTML` 마크업 안에 있는 임베디드 스타일, css파일등 스타일과 관련된 모든 정보들을 포함하고 있다.

사실 그 외에도, 모든 브라우저들은 `user agent styles`이라고 하는 기본 스타일 집합인 `computed styles`가 존재한다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/26/3.PNG" alt="3">
</div>

`CSSOM`은 `cascading`이라는 룰을 갖고 있다.

1. 계단식 스타일
   > 동일한 속성의 스타일이라면 최 하단의 스타일이 적용됨
2. `class`, `id`와 같은 선택자에 따라 우선순위가 결정됨
3. 몇몇 속성에 한정된 상속
   > 부모 태그의 속성에 하위 태그도 영향을 받는 경우들

이러한 룰을 갖고 스타일을 세분화, 파싱한다.

## DOM Tree + CSSOM = Render Tree

`body`태그를 `Render Tree`의 루트 오브젝트로 생성한다. 이후, 하위는 나머지 `DOM Node`들로 구성을 한다. 이 때의 `Render Tree`는 `DOM Tree`와 1:1 매칭이 아닌 상태이다.

왜?

`DOM Tree`에 있어도, `display : none;`과 같이 화면에 그려지지 않는 태그의 경우 `Render Tree`에서 제외된다.

### Layout

위에서 하위에 각각의 `DOM Node`로 구성되는 렌더 오브젝트가 추가될 때, 각 `Node`들의 스타일은 이제 알고 있지만, **위치·크기**와 같은 스타일을 계산하여 실제 어떠한 구조를 갖고있는지는 모르는 상태이다.

뷰포트 내에서 정확한 크기, 위치를 계산해주는 역할을한다.

> 뷰포트에 변경이 일어난다면, `Layout`도 업데이트되는 것

단 이 시점에서 요소는 벡터단위로만 표시된다.

## Painting

`Render Tree`, `Layout`에서 각 `Node`들의 기하학적인 요소가 계산되어도 최종 화면을 렌더링 하기에는 부족함이 있다.

`z-index`와 같은 속성이 적용되어있다면, `HTML`로 작성된 순서로 만 그리게 되었을 때 원하는 결과값이 다르기 때문이다.

> 이 떄문에, `DOM Tree`의 노드 순서와 페인트 순서는 다를 수 있다.

따라서, 메인 스레드는 `Layout`에서 형성된 `Tree`를 순회하며 요소들의 속성(배치 방식 등)에 따라 구분지어 계산을 하고 벡터에서 픽셀단위로 변환하여 그린다.

> 이를 레스터화라고 함

## 최신 브라우저에서 추가된 단계 - Composition

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/26/4.PNG" alt="4">
</div>

최신 브라우저에서의 렌더링 단계에 한가지가 추가되었는데, `Composition` 조합 이다.

위의 `Painting`단계에서, 픽셀단위로 변환하고 바로 그리는것이 아니라 레이어로 관리한다.

이때, 속성별로 구분지어 레이어를 만드는 이유는, 변경이 필요한 속성을 갖고있는 레이어만 작업을 하여 성능을 높이기위해 브라우저들이 선택한 방식이라고 한다.

그리고 현재 화면을 렌더링하는데 필요한 레이아웃들만 쌓아서 브라우저위에 그리게 된다.

> 마치 포토샵의 레이아웃처럼

## 렌더링 성능 개선

렌더링 시간이 길어지게되면, 사용자에게 부적절한 사용경험을 남기게 될 수 있다.

사용자가 요청을하고 최종 렌더링이 될 때 까지의 시간을 가능한 단축시켜서 빠르게 화면을 접할 수 있도록 하는것이 중요하다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/26/5.PNG" alt="5">
</div>

이미지를 보면, `Render Tree`를 형성하기까지의 구간을 `Construction`, `layout`단계부터 `composition`까지 `Operation`이라고 구분지어있고 서로 다른 방식으로 최적화를 진행할 수 있다고 한다.

## Construction

날것의 파일을 브라우저가 이해할 수 있고 사용할수 있는 언어로 바꾸는 작업을 한다.

사실 이 구간에서는 **불필요한 태그 사용**을 하지 않는것이 최선이라 볼 수 있을것 같다.

## Operation

변환된 언어를 해석하여 각 `Node`들의 위치, 구조등을 계산하고 형성된 `layout`을 관리하는 구간이다.

`Construction`와 다르게 초기 구조를 수정하는것이 아닌, 사용자의 요청에 의해 발생할 수 있는 애니메이션이나 요소들의 변화와 관련된 항목이다.

### Reflow

브라우저가 `layout`, `paint`, `composition` 즉, `Operation`의 모든 단계를 다시 실행하여 위치나 크기 구조등과 같은 값들을 다시 계산하는 상황을 의미한다.

> `display`, `animation`, `position`, `width` 등등

### Repaint

`paint`와 `composition` 단계만 재실행 되는 경우를 의미한다.

> `background-color`, `box-shadow` 등등

브라우저별로 `css` 속성과 관련되어 어느 수준의 단계부터 다시계산되어야 하는지 보여주는 사이트가 있다.

- [css triggers](https://csstriggers.com/)

## 최선의 방법

`Reflow`, `Repaint`모두 많은 단계를 거쳐야 함에 있어서 그만큼의 비용이 들게된다는 점이다.
즉, 렌더링시간이 길어지게 된다는 점.

사용자의 요청을 통한 애니메이션이나 변화에 있어서 최소의 비용으로
`composition`단계만 거치게 되는 경우는 `opacity`나 `transform`속성을 변경하는것 뿐이라고 한다.

## 후기

브라우저의 렌더링 과정과, 성능개선에 대해 알아보았다.

그중에서도, 렌더링 최적화에있어서 여러부분에 놀라게되었는데, 현재 사용하고 있는 방식들 중 몇몇부분은 `operation`단계에서 많은 비용이 사용되고 있다는 점 이였다.

이 문제에 대해서 개선해봐야할 것 같다.

> 아래 `LogRocket` 블로그에서는 테스트 방법도 나와있으니 해봐야할듯!

## 참조

- [까마귀의 생각 창고 - 웹 브라우저 동작원리](https://development-crow.tistory.com/5)
- [개발 전용차선 - 렌더트리](https://development-crow.tistory.com/5)
- [LogRocket - Eliminate content repaints with the new Layers panel in Chrome](https://blog.logrocket.com/eliminate-content-repaints-with-the-new-layers-panel-in-chrome-e2c306d4d752/)
