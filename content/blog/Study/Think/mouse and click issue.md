---
title: '🖱 클릭이벤트, 마우스이벤트 이슈'
date: 2022-01-22 12:47:00
category: 'Study'
draft: false
tag: 'Think'
---

## 문제 발생

최근 어떤 프로젝트를 진행하면서 한가지 발생했던 이슈와 해결과정, 해결방법에 대한 확신을 다룬 포스트 이다.

좌우 스크롤과 같은 영역을 구현할 때, 워낙 잘 알려져있고 높은 사용을 자랑하는 `swiper`모듈 대신 좌우 스크롤을 통해 구현해보고자 하였다.

구현과정 자체에는 큰 문제가 없었는데 한가지 문제가 발생하였다.

`click` 이벤트의 경우, **동일한 요소** 내에 `mousedown` - `mouseup`이 발생하면 `click`이 호출되는것 같았다.

그 순서또한 동일하게 `mousedown` - `mouseup` - `click`이 호출되었다.

> 그래서 그게 왜?

위에서 잠깐 언급되었는데, 서로 다른 요소에서 `mousedown`, `mouseup`이 이어지게된다면 `click`이 호출되지 않지만 동일한 요소에서 시작, 마무리 된다면 `click`이 호출되어 원하지 않는 상황에 해당 이벤트가 발생하였다.

즉, 사용자의 입장에서 단순 좌우 스크롤을 원했던 것이 예상하지 못한 클릭이벤트가 발생하여 요소에 할당된 `route`로 이동하는 등의 사이드이펙트가 발생하였다.

## 이벤트 전파 차단을 통한 해결

한가지 해결방법은 클릭이벤트가 아닌 `mouseup`이벤트로 대체하고 드래그중인 상태를 구분하여 이벤트 전파를 막는것이였다.

이벤트가 전달되는 순서나 이벤트 전파자체를 막을수 있는 자바스크립트의 특징을 잘 살린 해결방법일 수 있다.

다만 아쉬운점은 `mouseup`이라는 행위는 생각보다 많은 방법을 공유하게되는데,

마우스 휠을 클릭한다거나, 다른 요소에서 시작하고 드래그하여 해당요소에서 마우스업을 할 경우에도 발생할 수 있다는 점이다.

결국, 동일하게 사용자가 원하지 않는 상황에서도 해당 이벤트가 발생할 수 있다는점은 해결되지 않았다.

## 실행함수의 호출시간 제어

조금 다르게 접근을 해보자.

결국 `mousedown` - `mouseup` - `click`과 같이 동일 요소 내에서 발생하는 이벤트의 호출순서는 바꿀 수 가 없다.

즉 `mouseup`을 통해 드래그중이 아닌 상태를 초기화 하게 된다면 당연히 이후에 호출되는 `click`이벤트에서는 드래그중인 상태를 구분할 수 없다.

자바스크립트가 실행되는 환경은 하나의 콜스택으로 처리되어 필요시 비동기로 전달하여 실행되는 순서, 시간을 개발자가 어느정도 컨트롤 할 수 있다.

이러한 점이 정말 매력있다고 생각하는데, 위의 문제도 이와같이 접근하여 해결할 수 있었다.

```js
setTimeout(() => {
  isDragging = false
})
```

정말 단순한 한 줄 이지만 많은것을 의미하고있다.

저 함수는 `mouseup`라는 이벤트가 실행될 때 콜백함수로 전달되어 실행되는 실행함수이다.

하지만, `setTimout`을 통해 비동기처리하였기 때문에 별도의 시간을 지정해주지 않았더라도 즉시실행되는것이 아닌 태스크큐에 저장이 된다.

사용자의 이벤트도 각각의 이벤트 핸들러에 할당되어있는 실행함수들이 비동기로 처리되는 특징인데, 저 `setTimeout`을 통해 전달되는 **드래그상태 초기화** 라는 실행함수는 `click`이벤트의 실행함수보다 뒷순위인 상태로 태스크큐에 저장된다.

선입선출의 특징을 갖고있는 큐의 자료규조 특성상 `click`이벤트의 호출이 먼저 진행이 되지만, 아직 `isDragging`의 상태가 초기화되지 않았기 때문에 `route`이동과 같이 할당된 클릭이벤트가 호출되지 않는다.

다만, 위의 `click`이벤트의 실행함수가 종료되면 콜스택이 비어있음을 감지하고 `setTimeout`의 `isDragging`상태를 초기화하는 실행함수가 호출되는 점이다.

이를 통해, 드래그중인 상태 초기화는 `mouseup`에 할당하였더라도 실제 그 로직 자체는 `click`이벤트 호출 이후에 작동되기 때문에 `click`의 실행함수 내부에서는 `isDragging`의 `true`, `false` 두가지 상태를 알 수 있게 된다.

## swiper 모듈에서는 어떻게 처리될까

내가 해결했던 방법이 절대로 정답이라고 생각하지 않고, 틀린 정답일 수 도 있다.

따라서 다른 대중적으로 사용되고있는 비슷한 상황이 생길수 있는 오픈소스를 통해 어떤 방법이 있는지 확인해보고자 했다.

- [swiper](https://www.npmjs.com/package/swiper)
  > 토요일 기준 주간 다운횟수가 70만회 이상인 어마어마한 모듈이다.

```js
onClick?: (swiper: SwiperClass, event: MouseEvent | TouchEvent | PointerEvent) => void;
onTouchStart?: (swiper: SwiperClass, event: MouseEvent | TouchEvent | PointerEvent) => void;
onTouchMove?: (swiper: SwiperClass, event: MouseEvent | TouchEvent | PointerEvent) => void;
onTouchEnd?: (swiper: SwiperClass, event: MouseEvent | TouchEvent | PointerEvent) => void;
```

먼저 해당 모듈의 `Swiper`에서는 생성한 커스텀 이벤트가 `mouse`, `touch`, `pointer` 3가지 일반 이벤트들을 핸들링해주는것 같다.

> `pointer`는 `mouse`를 포함한 조금 더 넓은 개념의 이벤트라고 한다.

`core.js`에서 `Swiper`라는 클래스가 생성될 때 갖고있는 몇가지 속성이 핵심으로 보인다.

```js
// Clicks
allowClick: true,

preventClicks: true,
preventClicksPropagation: true,
```

또한, 커스텀하게 생성되는 `click`이벤트는 아래와 같은 중간단계를 거치게 되는데,

```js
export default function onClick(e) {
  const swiper = this
  if (!swiper.enabled) return
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault()
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }
}
```

`swiper.allowClick`속성이 `false` 라면 이벤트 전파자체를 막아버린다.

이 구분 로직이 매우 핵심이다.

`Swiper`모듈에서 커스텀하게 생성한 `onTouchMove`이벤트의 내부 코드를 보다보면 모든 종료상황 전에 값이 할당되는것이 있다.

```js
swiper.allowClick = false
```

즉, 드래그중인 상황에는 내부적으로 클릭이 가능한 상태를 부정화 하는 구문이다.

그리고 `onTouchEnd`의 커스텀 이벤트 내부에 눈에띄는 한가지 로직이 있다.

```js
nextTick(() => {
  if (!swiper.destroyed) swiper.allowClick = true
})
```

종료될 때, `swiper`모듈이 존재한다면 `swiper.allowClick` 속성을 다시 클릭 가능한 상태로 변경을 해주는데,

놀랍게도 저 `nextTick`메소드의 역할은

```js
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay)
}
```

똑같다.

초기화 로직을 비동기로 전달하여 `click`이벤트 이후에 실행되도록 해주었다.

## 결론

요소를 선택한다는 행위에 `mouseup`이벤트를 사용하는것이 권장되지 않고, 동일한 요소 내에 `mousedown`과 `mouseup`이 함께 작동되야하는 `click`이벤트를 적극 권장하고 있었고 그러한 이유가 사용자의 입장에서 예상 외의 상황을 발생시킬수 있다는점이 이유였기 때문에 그러한 방법을 유지한 채로 해결에 접근했다는것에 큰 의미가 있었던것 같다.

또, 대중적인 모듈이 선택했던 방식과 동일한 방식의 접근이라 나름의 가치있는 방법인것 같아 뿌듯하기도 하다.
