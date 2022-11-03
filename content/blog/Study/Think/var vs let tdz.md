---
title: 'var vs let의 차이와 기준이 되는 TDZ'
date: 2021-04-30 16:36:00
category: 'Study'
draft: false
tag: 'Think'
---

`var`과 `es2015`에서 추가된 `const`와 `let`의 큰 차이는 이후에 동일한 `key`로 재선언이 가능하냐 불가능하냐 엄격함의 차이였다.

`const`는 사실 값 또한 변경될 수 없다는점에 상수 에 가까워 변수인 `var`와는 정말 다르다고 볼 수 있다.

하지만 기능적으로 보았을 때, `let`과 `var`는 동일한 변수선언으로서 위의 차이를 제외하곤 비슷하다고 생각했는데, 그렇지 않았다.

## 유효범위(scope)의 차이

선언 당시 변수나 상수가 자리잡는 범위인 `scope`는 해당 변수가 `var`인지 `let`인지에 따라 다르게 잡힌다.

### function-scoped

기존의 `var`의 유효범위는 함수이다.

```js
function test() {
  for (var i = 0; i < 5; i++) {}
  console.log(i) // 5
}
test()
console.log(i) // ReferenceError: i is not defined
```

함수가 선언될 때, 자신을 갖고있는 함수가 곧 유효범위가 된다. 당연히 `hoisting`을 통해 해당 함수의 최상단으로 먼저 선언되고 이후에 값을 할당받는다.

자신의 유효범위인 함수 외부에서 호출을 하자, 해당 변수는 정의되지 않았다는 에러가 발생한다.

### block-scoped

`let`의 유효범위는 `{}` 블록이다.

```js
function test() {
  let c = 'c'
  for (let i = 0; i < 5; i++) {
    console.log(c) // c
    console.log(i) // 0,1,2,3,4
  }
  console.log(i) // ReferenceError: i is not defined
}
test()
```

`var`와 다르게 좀더 작은 `{}` 블록단위의 유효범위를 갖고있기 때문에, `for loop`와 같은 경우 내부에서만 해당 변수를 조회할 수 있으며, 한 단계의 블록만 넘어가더라도 정의되지 않았다는 에러가 발생한다.

> 부모 함수에 있는 `let` 변수의 경우, 해당 함수 블록이 유효범위이기 때문에, 자식 함수에서는 접근 가능하다. `ex) closure`

### hoisting

`let`, `const`의 `hoisting`은 기존의 `var`과도 차이가 있다.

`var`의 경우 이전의 `hoisting`을 다뤘던 포스트에서처럼 함수영역 내부 최상단에서 선언부분만 먼저 `hoisting` 되고, 이후에 값을 할당 받고 이전에 호출할 시 `undefined`라는 값을 보였었다.

즉, 선언은 되었지만 값은 존재하지 않는 상태이다.

하지만, `let`, `const`는 초기화되지 않았다는 에러가 바로 발생했었는데, 이러한 점으로 이 둘은 `hoisting`이 작동되지 않는다 라는 말도 있지만, 사실 그렇지 않고 이 **초기화** 라는 문구에 차이가 있다.

## TDZ - Temporal Dead Zone

`TDZ`란, 변수 함수 등의 **선언 단계**부터 **초기화 단계** 사이의 사각지대라고 한다.
컨텍스트(전역 or 함수)가 생성되면서 변수 함수 등은 각각의 `TDZ` 순서에 따라 변수객체에 담긴다.

함수나 변수 등이 컨텍스트의 변수 객체에 담기는 데에는 3가지 단계가 존재한다.

1. 선언 단계 : 변수를 실행 컨텍스트의 변수 객체에 등록하는 단계로, 이후에 스코프는 해당 변수 객체를 참조한다.
   > `var a = 1` => `{a}`
2. 초기화 단계 : 변수 객체에 담긴 변수에 필요한 메모리를 만드는 단계로, 이 단계에서 할당된 메모리에 `undefined`를 통해 먼저 초기화시킨다.
   > `var a = 1` => `{a : undefined}`
3. 할당 단계 : `undefined`로 초기화된 변수의 메모리에 사용자가 지정했던 값을 할당하는 단계이다.

### var

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/30/1.jpg" alt="1">
</div>

`var` 변수가 선언되기 전에 조회를 하였을 때 `hoisting`으로 인하여 `undefined` 라는 결과값을 반환한다.

이러했던 이유는, `var`의 경우 `hoisting`을 하면서 선언 단계와 초기화 단계가 동시에 일어나기 때문이다.

### let, const

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/30/2.jpg" alt="2">
</div>

`let`, `const`의 경우 `var`과 다르게 좀 더 엄격하게 3가지 단계를 모두 거쳐서 변수가 선언되게 되는데 이러한 차이때문에 다른 결과를 보이는 것이다.

`let` 변수 이전에 조회를 하였을 때, 선언 단계는 진행이 되었지만 초기화 단계에서 메모리 할당이 되지 않아

> `Cannot access 'let 변수 or const 상수' before initialization`

라는 에러가 발생하는 것이다.

### 간혹 들었던 의문

웬만한 상황에서는 `ide`에서 초기화되지 않았다 등의 에러를 미리 알려준다. 그런데 그렇지 않은 경우가 있는데,

```ts
const func = () => setState(2)

const [state, setState] = useState(1)
```

위의 경우 `func` 내부의 `setState`는 초기화 이전에 작성된것으로 보이지만 문제되지 않는다.(`state`를 조회하는것도 동일)
하지만

```ts
const param = setState

const [state, setState] = useState(1)
```

위의 경우는 초기화되지 않았다고 잡힌다.

왜일까??

추측컨데 저 `func`의 호출시기를 예상할 수 없어서가 아닐까 싶다.

두번째의 경우의 순서를 먼저 따져보자

1. `param` 호이스팅 - 선언
2. `state` 호이스팅 - 선언
3. `setState` 호이스팅 - 선언
4. `param` 초기화 및 값 할당 시작
5. `param`의 값 할당 중 사용되는 `setState`는 선언되었지만 아직 초기화는 되지 않은상태(`TDZ`)

예상할 수 있는 순서라서 에러를 잡는것 같다.

하지만 첫번째의 경우

```ts
const func = () => setState(2)

func() // 초기화 에러 발생

const [state, setState] = useState(1)

func() // 정상 진행
```

함수 호출시기에 따라 가능, 불가능이 나뉜다.
위의 두가지 경우 모두 순서를 따져보자면

1. `func` 호이스팅 - 선언
2. `state` 호이스팅 - 선언
3. `setState` 호이스팅 - 선언
4. `func` 초기화 및 값 할당
5. `func` 함수 호출로 함수컨텍스트 생성
6. `func` 컨텍스트 내부의 `setState` 호출
7. 이 당시에는 `setState`가 선언은 되어있지만 초기화는 되지 않은 상태라 에러(`TDZ`)
8. `state`, `setState` 초기화 및 값 할당
9. `func` 함수 호출로 함수컨텍스트 생성
10. `func` 컨텍스트 내부의 `setState` 호출
11. 이 당시에는 `setState`가 초기화, 할당까지 모두 완료된상태라 정상진행

이처럼 초기화 전의 함수 혹은 값을 사용하고 있는 함수가 어떤시기에 호출되냐에 따라 값이 초기화, 할당 되어있을수도, 그렇지 않을수도 있기 때문에 에러를 표시해주지 않는게 아닐까?
