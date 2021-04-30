---
title: 'Hoisting, 호이스팅'
date: 2020-07-13 00:00:00
category: 'Study'
draft: false
tag: 'Think'
---

# Hoisting, 호이스팅

처음 코딩을 배울 때, 들었던 말이 있는데

> 변수나 함수는 항상 맨 위에 쓰세요.

처음에는 그 이유를 몰랐었고, 함수의 경우는 길어지게되면 너무 스크롤을 많이 내려야해서 아래에 몰아쓰기도 했다

> 사실 이때는, 리팩토링이라는 개념도 없던시절이라 구현만 되면 장땡이라고 생각했던..

그러다보면 종종 마주치는 상황이 있다.

```js
console.log(a) // undefined
func() // Hi

var a = 1
function func() {
  console.log('Hi')
}
```

함수는 잘 출력되지만, 변수는 `undefined` 라는 값을 출력한다.  
이는, 코드의 실행환경인 컨텍스트가 형성되면서 생기는 이유이다.

## 표현식과 선언식

표현식이든 선언식이든 모두 컨텍스트가 형성될 때, 해당 스코프에서 최상위로 이동이 된다. 이렇게 올라가지는 것을 `hoisting`이라고 한다

단, 중요한점은 **선언** 까지이다.

```js
var a = 1; // var a = 라는 선언까지만 hoisting
function func(){...} // function func(){} 라는 선언까지만
```

위에서처럼 선언 까지만 `hoisting`이 되는데, 선언식같은 경우 모든것이 `hoisting`되지만, 표현식의 경우 변수의 선언까지만 `hoisting`이 된다.

따라서, `hoisting`이 진행된 후의 모습을 본다면

```js
var a = undefined;
function func(){...}
a = 1;
```

이런식으로 진행되기 때문에, 표현식과 같은 경우 변수 차제는 `hoisting`이 되지만, 값은 그렇지 않아서 `undefined`라는 값을 반환하는 것이다.

당연히, 함수의 경우도 표현식으로 작성한다면 `undefined`라는 값을 반환한다.

## 예외

비교적 최신 `ES`에서 권장하는 상수, 변수 선언 방식인 `const`, `let`은 `var`와 다르게 `hoisting` 되지 않는다.

```js
console.log(a) // undefined
console.log(b) // Cannot access 'b' before initialization
console.log(c) // Cannot access 'c' before initialization
var a = 1
const b = 1
let c = 1
```

값이 존재하지 않다가 아니라 변수나 상수가 형성되기 이전이라 접근할 수 없다는 에러가 발생한다.

좀더 `const`와 `let`의 엄격한 특징이 이 분야에서도 나타나는것 같다.
