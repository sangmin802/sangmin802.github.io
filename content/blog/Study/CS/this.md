---
title: '🧙‍♀️ this를 제어하는 자'
date: 2021-07-23 15:58:00
category: 'Study'
draft: false
tag: 'CS'
---

프론트엔드 개발을 하다보면 정말 자주 접하게되는 키워드가 있다.

`this`

이전 `class` 기반의 `React`를 구성할 때에는 이 `this`를 정말 질리도록 사용을 했었다.

너무나도 자연스럽게 사용하고 있었지만, `this`에 대해 설명을 해보자 하면 무슨말 부터 꺼내야 할지 몰랐던 점이 `this`에게 너무 미안해서 제대로 알아보려고 한다.

## this

정말 단순하게 정의해보자면 `this`는 자신을 사용하는 메소드를 호출한 객체가 저장되어있는 속성이라고 생각해볼 수 있을것 같다.

하지만 이러한 `this`가 형성이 되는 방식은 여러개가 있다.

아마 이러한 점 때문에, `this`에 대해 혼선이 생기고 사용했을 때 예상하지 못한 결과를 맞닥드리게 되는게 아닌가 싶다.

## 전역문맥에서의 this

전역컨텍스트에서 형성된 `this`는 전역객체를 참조하게 된다.

```js
console.log(this === window) // true
```

## 함수문맥에서의 this

함수 내부에서의 `this`는 다른 변수나 상수들과 다르게 선언 시에 할당되는것이 아닌, 호출되는 방법에 의해 할당이 된다.

### 전역호출

```js
function test() {
  console.log(this)
}
test() // window
```

일반 함수에서 `this`를 호출 하였을 때에는 전역객체인 `window`를 참조한다.

우리는 함수를 호출할 때 간략하게 `test()`와 같이 함수명만 적어서 호출하지만, `window.test()`라는것이 생략되어있기 때문에, `window`를 참조하는 채로 호출이 되어서 그런것 같다.

### this 객체 전달

`call`과 `apply` 메소드를 사용하여 기존 호출 방식에 따른 `this`할당이 아닌 다른 객체로 넘겨줄 수 있다.

```js
const obj = { name: '객체 상민' }
const name = '전역 상민'
function test() {
  console.log(this.name)
}
test() // 전역 상민
test.call(obj) // 객체 상민
test() // 전역 상민
```

하지만, `call`의 방식은 일회성이 강하다. 객체를 넘겨주었을 때에는 해당 객체로 할당이 되지만, 이후의 호출에서는 다시 원래의 방식으로 돌아온다.

```js
const obj = { name: '객체 상민' }
const name = '전역 상민'
function test() {
  console.log(this.name)
}
const newTest = test.bind(obj)
test() // 전역 상민
newTest() // 객체 상민
newTest() // 객체 상민
```

`ECMAScript5`에서 도입된 `bind`메소드를 사용하게 될 경우, `call`과 유사하게 객체를 넘겨줄수 있게 되지만, 일회성이 아닌 영구적으로 참조하게되는 새로운 함수를 생성하게된다.

## 화살표함수에서의 this

아마 가장 많이 헷갈리는 부분이 아닐까 싶다.

콜백함수 등 자주 접하게되는 화살표함수 또한 **함수** 이지만, 호출되는 방식에 따라 `this`가 할당되는것이 아닌, 선언될 당시의 외부 렉시컬 환경를 참조하여 `this`를 사용한다.

또한, 이 화살표함수에는 `bind`와 같은 넘겨주는 메소드가 적용되지 않는다.

```js
const obj1 = {
  introduce() {
    console.log(this)
  },
}
const obj2 = {
  introduce: () => {
    console.log(this)
  },
}
obj1.introduce() // obj1
obj2.introduce() // window
```

`obj1`의 상황을 알아보자

`obj1`의 `introduce` 메소드를 호출하게 되면서, 함수 내부의 `this`는 호출방식에 따라 할당되기 때문에 `obj1`을 참조하게 된다.

`obj2`는 화살표함수로서 조금 다르게 진행된다.
기본적으로 `this`는 두가지 방식으로 알 수 있다.

1. 전역 스코프의 `this`
2. 일반 정규 함수에서 호출 및 메소드로 바인딩되는 `this`

화살표함수의 경우 위의 두가지에 해당되지 않는 상태이며, 선언될 당시 외부 렉시컬 스코프에서 `this`를 탐색하여 가 할당이 되기 때문에, `this`를 찾기 위해 선언되었을 때 상위인 `obj2`에서 탐색을 한다.

마찬가지로, `this`를 찾지 못해서, 최상위 `window`까지 나오게 되고, `window`를 `this`로 참조하게 되는 것이다.

## 화살표함수와 정규함수의 this 차이

외부 깃에서 좋은 예제와 설명글을 찾을 수 있었다.

### 정규함수

```js
function foo() {
  setTimeout(function() {
    console.log(this.a) // global
  }, 100)
}

foo.a = 'func'

var a = 'global'

foo.call(foo)
```

처음 `foo`함수가 호출이 될 때, `foo`객체를 넘겨주었기 때문에 `foo`함수에서의 `this`는 `window`가 아니라 `foo`일것이다.

하지만. `setTimeout`의 콜백함수로 실행된 함수에서의 `this`는 `foo`가 아닌 `window`를 참조하고 있다.

왜일까?

일반 함수의 경우 호출될 때 `this`가 할당된다고 하였다.

`foo`함수는 호출되는 과정에서 `call`을 통해 `foo`객체가 전달되었지만, `foo`내부에서 `setTimeout`이후 내부 콜백함수가 **호출** 될 때에는 별 다르게 넘겨지는것이 없기 때문에, `window`객체를 참조하는것이다.

### setTimeout, setInterval에서의 this

`setTimeout`에서의 `this` 바인딩은 기존과는 조금 다른 방식으로 진행된다고 한다.

```js
const obj = {
  func() {
    console.log(this) // window
  },
}
setTimeout(obj.func, 0)
```

함수에서의 `this`는 호출이 될 때 `binding`이 되니, `func`에서의 `this`는 `obj`라 생각할 수 있지만, 결과값은 `window`가 나온다.

`setTimeout`의 조금 특별한 동작방식때문이라고 한다.

전달받은 인수인 콜백함수를 실행시킬 때, `this`에 `window`를 할당한다고 한다.

```js
const f = obj.func
setTimeout(f, 0)
```

위와 같은 방식으로 실행되는 느낌이라고 한다.

따라서, `setTimeout`의 콜백함수의 `this`를 `window`가 아닌 본연의 객체로 `binding`되게 하기 위해 하나의 껍데기 `function`을 감싸서 사용하는것이다.

그렇게 된다면, 껍데기인 `fucntion`의 `this`는 `setTimeout`의 특징으로 `this`가 바인딩 되지만, 내부 함수는 일반 함수의 `binding` 방식에 따라 호출될 때 `this`가 결정된다.

### 정규함수 + bind

위의 정규함수에서 콜백함수에 다른 객체를 전달해줄 수 있는 방법을 이전에 알았다.

```js
function foo() {
  setTimeout(
    function() {
      console.log(this.a) // func
    }.bind(this),
    100
  )
}

foo.a = 'func'

var a = 'global'

foo.call(foo)
```

이전까지는 모두 동일하지만, `setTimout`으로 보내지는 콜백함수에 `this`가 `binding`이 되어있는것을 볼 수 있다.

이때의 `this`는 `foo.call(foo)` 로 전달이 된 `foo`객체를 지칭하고 있고, 해당 `foo`객체를 콜백함수의 호출단계에도 바인딩을 해준 것이다.

### 화살표함수

```js
function foo() {
  setTimeout(() => {
    console.log(this.a) // func
  }, 100)
}

foo.a = 'func'

var a = 'global'

foo.call(foo)
```

처음 정규함수와 동일하지만, 콜백함수가 화살표함수로 구성이 되어있다.

단순하게 화살표함수로 구현을 했더니, 자연스럽게 `this`가 처음 전달된 `foo`객체를 참조하고 있다.

순서를 생각해보면 간단하다.

1. 화살표함수 내부의 `this`는 외부 렉시컬 스코프를 참조하여 형성되기 때문에, 콜백함수 내부에서 바인딩된 `this`를 찾는다.
2. 콜백함수 내부에는 `this`가 존재하지 않아, `function foo`까지 탐색하여 올라간다.
3. `fucntion foo`에는 `call`로 전달된 `foo` `this`객체가 존재했고, 해당 객체를 참조하게 된다.

당연히, `call`메소드가 존재하지 않는다면 `this`는 `window`를 참조하게 된다.

## prototype chain에서의 this

```js
const obj = {
  test() {
    return this.a + this.b
  },
}
const newObj = Object.create(obj)
newObj.a = 1
newObj.b = 4
console.log(newObj.test()) // 5
```

`class`이전 자바스크립트에서 상속개념을 사용할 수 있었던 `prototype`또한 `this`에 있어서는 일반 정규 함수와 비슷하게 호출될 때 할당이 된다.

또한, `class`와 생성자함수 `new Fucntion`내부에서의 `this`또한 자기 자신 객체를 참조로 하여 `binding`된다.

`React`의 `class`기반에서 사용해오던 `this.state`, `this.props`들이 이와 같은 방식때문이다.

## 참조

- [arrow functions this](https://github.com/anirudh-modi/JS-essentials/blob/master/ES2015/Functions/Arrow%20functions.md#how-this-is-different-for-arrow-functions)
- [mdn this](https://developer.mozilla.org/ko/docs/orphaned/Web/JavaScript/Reference/Operators/this)
