---
title: '🧙‍♀️ this를 제어하는 자'
date: 2021-07-23 15:58:00
category: 'Study'
draft: false
tag: 'Think'
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

함수에서의 `this`는 다른 변수나 상수들과 다르게 선언 시에 할당되는것이 아닌, 호출되는 방법에 의해 할당이 된다.

> 기본적으로 함수에서의 `this`는 전역객체인 `window`를 지칭한다.

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

## 내부함수에서의 this

내부함수의 `this`는 전역컨텍스트의 `this`인 `window`를 참조하고 있다.

이 때, 참조하는 `this`를 변경하기 위해서는 `.bind`, `.call`등으로 `this`를 할당하여 호출해야 한다.

```js
const obj = { id: 1 }

function fun() {
  function innerFun() {
    console.log('innerFun' + this)
  }

  function innerFun2() {
    console.log('innerFun2' + this)
  }

  innerFun()
  innerFun2.call(obj)
}

fun()
// innerFun window
// innerFun2 obj
```

## 화살표함수에서의 this

아마 가장 많이 헷갈리는 부분이 아닐까 싶다.

콜백함수 등 자주 접하게되는 화살표함수 또한 **함수** 이지만, 화살표 함수를 호출할 때 형성되는것이 아닌, 자신보다 상위인 외부 렉시컬 환경에서 참조하고있는 `this`를 참조한다.

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
2. 객체의 프로퍼티로서 함수가 호출 및 메소드로 바인딩되는 `this`

하지만 위의 두가지와 다르가 화살표함수는 정적스코프의 `this`를 참조한다.

화살표함수는 일반 함수와 다르게 `arguments`, `this`, `constructor`가 없다.

> `consturctor`가 없기 때문에 화살표함수를 생성자 함수로 사용할 수 없는것.

따라서, 함수 내부에서 사용되는 `this`를 사용하기 위해 선언될 당시의 상위 스코프에 있는 `this`를 참조하는 것이다.

> 변수를 찾아가는 일종의 스코프 체인으로 볼 수 있을것 같음

추측해보건데, 함수 컨텍스트가 실행되면서 기본적으로 `this`가 참조하는 `window`객체에서, 함수가 호출되는 방식에 따라 다른 `this`로 변경될 수 있고, 화살표함수는 정적스코프로 참조하는 변경된 `this`를 참조하는것이 아닐까?

```js
const obj = {
  name: '상민',
  aa: this, // global
  normal() {
    // 호출될 때 결정되어 obj
    console.log(this)

    // 화살표함수는 constructor, this가 없기에 부모의 this를 따라가 obj (obj.normal때 결정)
    const test = () => {
      console.log(1, this)
    }

    // 호출될 때 결정되어 global
    function test2() {
      console.log(2, this)
    }
    setTimeout(() => {
      // 화살표함수는 constructor, this가 없기에 부모의 this를 따라가 obj
      console.log(this)
    })
    setTimeout(function () {
      // setTimout 내부에서 호출될 때 결정되어 timeout 객체
      console.log(this)
    })
  },
  arrow: () => {
    // 화살표함수는 constructor, this가 없기에 부모의 this를 따라가 global
    console.log(this)
    setTimeout(() => {
      // 화살표함수는 constructor, this가 없기에 부모의 this를 따라가 global
      console.log(this)
    })
    setTimeout(function () {
      // setTimout 내부에서 호출될 때 결정되어 timeout 객체
      console.log(this)
    })
  },
}

// 일반함수는 호출될 때 결정
// 화살표함수는 본인의 부모의 this를 참조

obj.arrow()
```

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
- [this](https://poiemaweb.com/js-this)
- [화살표함수와 실행컨텍스트](https://velog.io/@seungdeng17/%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EC%9D%98-this-with-%EC%8B%A4%ED%96%89-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8)
