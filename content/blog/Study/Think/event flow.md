---
title: 'Event Phase에 대한 오해 feat. capturing, bubbling'
date: 2021-03-24 15:30:00
category: 'Study'
draft: false
tag: 'Think'
---

여러 개인 프로젝트를 사용해오면서 겪어왔던 상황들이 있다.

```js
<div class="parent">
  <div class="child">자식</div>
</div>
```

부모의 이벤트가 자식에게 전달되지 않기를 원하거나, 혹은 그 반대의 경우.

늘 이러한 문제를 `addEventListener`메소드의 3번째 인자로 `capture`값 만으로 컨트롤 할 수 있을거라고 생각했지만, 늘 실패하고 그냥 `stopPropagation()` 메소드를 사용해왔었다.

늘 이렇게 대처해오면서, `capture : false` 인데 왜 자꾸 부모의 이벤트가 자식에게 전달되지 라는 생각을 하고 있었는데, 이번에 그 의문점을 모두 해결하게 되었다.

## Event

사용자의 요청으로 발생하고, 우리가 생성하는 이벤트들은 사실상 하나의 객체라고 한다.

```js
element.addEventListener('click', e => {
  console.log('클릭 실행')
})
```

`e => {console.log('클릭 실행')}` 이라는 함수를 실행시키는 `click` 타입의 객체인 것이다.

## Event Flow

<div style="text-align : center">
  <img src="/img/2021/03/24/1.png?raw=true" alt="12">
</div>

최상위 엘리먼트인 `window`를 기준으로 그 내부에 세부적인 엘리먼트들이 생성이 되는데, 이것을 기준으로 이벤트 객체들이 이동하는 경로들이 형성된다. 다만, 여러 테스트를 해본 결과 이러한 경로는 부모엘리먼트와 바로 아래의 직계자식 엘리먼트까지만 영향을 끼치는것 같다. 이때 범위의 최 상단엘리먼트가 `e.currentTarget` 인듯 하다.

이처럼 경로 범위? 가 정해진다면 특정한 방식을 통해 이벤트가 전달이 된다. 그리고, 이벤트에 해당되는 타겟이라면 이벤트가 실행되는 방식이다.

> 솔직히 이벤트가 전달된다는 느낌보다는 이벤트 실행 순서를 결정하는느낌이다.

이벤트 전달 방식을 `Event Phase`라고 한다.

1. Bubble phase : 하위 엘리먼트에서 상위 엘리먼트로 전달되는 방식
2. Capture phase : 상위 엘리먼트에서 하위 엘리먼트로 전달되는 방식
3. Target phase : 이벤트가 할당된 엘리먼트에 도달한 경우로, 필요에 따라 이후의 이벤트들의 전달 여부를 결정할 수 있다.

## 예제

`child`클래스의 엘리먼트만 클릭할 경우를 따져보려고한다.

```html
<div class="grandParent">
  <div class="parent">
    React
    <div class="child">React is...</div>
  </div>
</div>
```

## Bubbling, Capturing에 따른 변화

### Bubbling

기본적인 `Bubbilng`의 경우

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener('click', e => {
  console.log('grandParent is clicked')
})
parent.addEventListener('click', e => {
  console.log('parent is clicked')
})
child.addEventListener('click', e => {
  console.log('child is clicked')
})
```

최 하위에서부터 상위 순으로 실행이 된다.

```js
'child is clicked'
'parent is clicked'
'grandParent is clicked'
'window is clicked'
```

### Capturing

이번엔 조금 다르게, 모두 `Bubbling`의 방식이지만, `parent` 엘리먼트에서는 `Capturing`의 방식을 채용하고 있다.

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener('click', e => {
  console.log('grandParent is clicked')
})
parent.addEventListener(
  'click',
  e => {
    console.log('parent is clicked')
  },
  { capture: true }
)
child.addEventListener('click', e => {
  console.log('child is clicked')
})
```

결과값은

```js
'parent is clicked'
'child is clicked'
'grandParent is clicked'
'window is clicked'
```

원래대로라면 하위의 엘리먼트부터 호출이 되지만, `parent`의 경우는 자신과 자신의 자식엘리먼트에서는 상위부터 호출이되도록 하였다.

처음에 `이벤트가 실행되는 순서를 의미하는것 같다`라는 생각을 하게된점이 바로 이부분이다.

마치 `Queue`처럼 선입선출의 구조를 갖고있는 자료구조에 이벤트 객체들이 담긴다고 생각했을 때,

1. `child is clicked` 이벤트 객체가 먼저 들어온다.
2. 하지만, 그 바로 위의 `parent` 엘리먼트가 `Capturing`의 방식을 채용하고 있어, `parent is clicked` 이벤트 객체가 앞으로 들어온다.
3. 그 이후로는, 모두 `Bubbling`의 방식이기 때문에, 순서대로 뒤에 붙게된다.

```js
let queue = []
// 1
queue = ['child is clicked']
// 2
queue = ['parent is clicked', 'child is clicked']
// 3
queue = ['parent is clicked', 'child is clicked', 'grandParent is clicked']
// 4
queue = [
  'parent is clicked',
  'child is clicked',
  'grandParent is clicked',
  'window is clicked',
]
```

만약, `grandParent` 엘리먼트도 `Capturing`의 방식이라면?

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener(
  'click',
  e => {
    console.log('grandParent is clicked')
  },
  { capture: true }
)
parent.addEventListener(
  'click',
  e => {
    console.log('parent is clicked')
  },
  { capture: true }
)
child.addEventListener('click', e => {
  console.log('child is clicked')
})
```

1. `child is clicked` 이벤트 객체가 먼저 들어온다.
2. 하지만, 그 바로 위의 `parent` 엘리먼트가 `Capturing`의 방식을 채용하고 있어, `parent is clicked` 이벤트 객체가 앞으로 들어온다.
3. `grandParent`또한 `Capturing`의 방식이기 때문에 자식 엘리먼트 뭉치들 보다 우선순위에 놓여진다.
4. `window`는 `Bubbling`의 방식이기 때문에, 자식 엘리먼트 뭉치보다 뒤에 위치하게 된다.

```js
let queue = []
// 1
queue = ['child is clicked']
// 2
queue = ['parent is clicked', 'child is clicked']
// 3
queue = ['grandParent is clicked', 'parent is clicked', 'child is clicked']
// 4
queue = [
  'grandParent is clicked',
  'parent is clicked',
  'child is clicked',
  'window is clicked',
]
```

결과값을 보아도 이렇게 나온다.

```js
'grandParent is clicked'
'parent is clicked'
'child is clicked'
'window is clicked'
```

## stopPropagation

이러한 `Event Phase`에서 필요에 따라 이후의 이벤트는 호출되지 않도록 해줄 수 있는데, 특정 엘리먼트의 이벤트가 호출이 되면서 `e.stopPropagation()`이라는 메소드를 호출하게 되면, 이후의 이벤트객체들은 더이상 전달되지 않는다.

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener('click', e => {
  console.log('grandParent is clicked')
})
parent.addEventListener(
  'click',
  e => {
    e.stopPropagation()
    console.log('parent is clicked')
  },
  { capture: true }
)
child.addEventListener('click', e => {
  console.log('child is clicked')
})
```

1. `child is clicked` 이벤트 객체가 먼저 들어온다.
2. 하지만, 그 바로 위의 `parent` 엘리먼트가 `Capturing`의 방식을 채용하고 있어, `parent is clicked` 이벤트 객체가 앞으로 들어온다.
3. 그 이후로는, 모두 `Bubbling`의 방식이기 때문에, 순서대로 뒤에 붙게된다.
4. 하지만 `parent`에서의 이벤트 객체에서 이후의 이벤트 객체들에대한 전달을 모두 하였기 때문에, 모두 사라지게 된다.

```js
let queue = []
// 1
queue = ['child is clicked']
// 2
queue = ['parent is clicked', 'child is clicked']
// 3
queue = ['parent is clicked', 'child is clicked', 'grandParent is clicked']
// 4
queue = [
  'parent is clicked',
  'child is clicked',
  'grandParent is clicked',
  'window is clicked',
]
// 5. stopPropagation
queue = ['parent is clicked']
```

`child` 엘리먼트를 클릭하여도, 이벤트 전달 방식이 상위에서 하위인 `Capturing`이기 때문에, `child` 이벤트 객체는 전달받지 못하게 된다.

```js
'parent is clicked'
```

`grandParent`또한 `Capturing`의 방식을 취한다면?

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener(
  'click',
  e => {
    console.log('grandParent is clicked')
  },
  { capture: true }
)
parent.addEventListener(
  'click',
  e => {
    e.stopPropagation()
    console.log('parent is clicked')
  },
  { capture: true }
)
child.addEventListener('click', e => {
  console.log('child is clicked')
})
```

1. `child is clicked` 이벤트 객체가 먼저 들어온다.
2. 하지만, 그 바로 위의 `parent` 엘리먼트가 `Capturing`의 방식을 채용하고 있어, `parent is clicked` 이벤트 객체가 앞으로 들어온다.
3. `grandParent`또한 `Capturing`의 방식이기 때문에 자식 엘리먼트 뭉치들 보다 우선순위에 놓여진다.
4. `parent` 이벤트 객체 이후의 이벤트 전달을 막았기 때문에, 이보다 우선인 `grandParent`의 이벤트는 전달 받지만, 그 외에는 모두 전달받지 못한다.

```js
let queue = []
// 1
queue = ['child is clicked']
// 2
queue = ['parent is clicked', 'child is clicked']
// 3
queue = ['grandParent is clicked', 'parent is clicked', 'child is clicked']
// 4
queue = [
  'grandParent is clicked',
  'parent is clicked',
  'child is clicked',
  'window is clicked',
]
// 5. stopPropagation
queue = ['grandParent is clicked', 'parent is clicked']
```

결과값을 보아도 이렇게 나온다.

```js
'grandParent is clicked'
'parent is clicked'
```

## 단순히 stopPropagation 만으로 해결가능해왔던 이유

아마, `Capturing`, `Bubbling`의 흐름에 대해 정확히 알고있지 않더라도 해당 메소드를 통해 이벤트전달을 간단히 막을수 있었던 이유는, 기본적으로 `Bubbling`방식이여서, `child` 이벤트 객체가 가장 먼저 전달을 받는데다가, 그 이후의 전달을 무시하는 상황이 대부분 원하는 상황이였기 때문이 아니였나 싶다.

```js
const grandParent = document.querySelector('.grandParent')
const parent = document.querySelector('.parent')
const child = document.querySelector('.child')
window.addEventListener('click', e => {
  console.log('window is clicked')
})
grandParent.addEventListener('click', e => {
  console.log('grandParent is clicked')
})
parent.addEventListener('click', e => {
  console.log('parent is clicked')
})
child.addEventListener('click', e => {
  e.stopPropagation()
  console.log('child is clicked')
})
```

## 정리

1. `Capture`속성의 값만을 통해서 이벤트 전달을 막는것이 아니라 `stopPropagation`메소드를 사용해서 막아야 한다.
2. 전달 받는 이벤트 객체를 조금 더 디테일하고 섬세하게 관리하고자 할 때 필요한것이 `Capture` 속성인듯 하다.
