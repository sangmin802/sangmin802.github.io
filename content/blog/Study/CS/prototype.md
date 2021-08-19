---
title: '🌳 자바스크립트 class의 뿌리 prototype'
date: 2021-07-23 15:58:00
category: 'Study'
draft: false
tag: 'CS'
---

`ECMAScript 2015`에서 `class`라는 문법이 도입되고, 상속을 통해 사용하고있는 객체를 확장하는등의 작업을 할 수 있다.

```js
class 확장객체 extends 루트객체 {
  constructor(props) {}
  // ...
}
```

`React`의 `class`기반 컴포넌트들도 비슷한 원리일 것이다.

```js
class CustomComponent extends React.Component {}
```

그렇다면, 기존의 자바스크립트에서 업데이트되면서 `class`문법이 추가되었다는 것인데, 이전의 자바스크립트에서는 객체간 상속이란것이 불가능하였을 까?

## Javascript 상속의 뿌리 prototype

`Javascript`는 흔히 프로토타입 기반 언어라고 한다. 추가된 `Javascript`의 `class` 문법 또한 사실, 프로토타입 기반이라고 한다.

`Javascript`내의 모든 객체들은 메소드를 포함한 속성들을 상속받기 위해서 **프로토타입 객체(prototype object)**라는것을 갖는다고 한다.

> 상속되는 속성들은 해당 객체의 속성으로 바로 존재하는것이 아닌, 객체의 생성자의 `prototype`이라는 속성에 정의 됨

해당 객체를 통해, 상위 혹은 그보다 더 상위 객체로부터 속성들을 상속받을 수 있다고 한다.

이렇게 `프로토타입 객체`를 통해 속성들을 상속받는 줄기를 **프로토타입 체인(prototype chain)**이라고 한다.

### 프로토타입 객체와 프로토타입 체인

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

const me = new Person('상민', 27)
me.valueOf()
```

`Person`이라는 생성자 함수로 `me`라는 객체를 만들고, `valueOf`라는 메소드를 호출을 시켜보았다.

사실, `valueOf`라는 메소드는 `object`의 메소드이다. 따라서, 해당 메소드를 갖고있는 `me`객체는 존재하지 않는다는 에러를 반환해야된다고 생각하지만, 정상적으로 호출이 된다.

왜일까?

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/25/1.PNG" alt="1">
</div>

1. `me`라는 객체에서 `valueOf`라는 속성으 탐색한다.
2. 해당 속성이 존재하지 않아, `me`는 **프로토타입 체인**으로 연결된 **프로토타입 객체**에서 `valueOf`라는 속성을 탐색한다.
   > 이 때의 **프로토타입 객체**에는 `Person`생성자 함수가 존재함
3. 마찬가지로 해당 **프로토타입 객체** 에도 존재하지 않아, 해당 **프로토타입 객체**의 **프로토타입 체인**으로 연결된 **프로토타입 객체**를 탐색함
   > 이 때의 **프로토타입 객체**에는 `Object`객체가 존재함
4. `Object`에서 `valueOf`라는 메소드를 발견하고, 호출함

## 프로토타입 체인 - prototype chain

모든 객체들이 갖고있는 하나의 공통된 속성이 있다.

```js
const obj = {}
console.log(obj)
```

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/25/2.PNG" alt="2">
</div>

`[[Prototype]]`라는 숨겨진 속성이다. 이 객체를 통해 참조할수 있는 다른 객체를 설명한다. 이러한 방식으로 참조할 수 있는 객체들이 `[[Prototype]]`이라는 숨겨진 속성으로 연결되어있는 것을 **프로토타입 체인** 이라고 한다.

위에서, `valueOf`라는 속성을 찾아갈 때 생성자 함수로 생성된 함수 또한 객체이므로 `[[Prototype]]` 숨김 속성을 갖고 있었고, 그 **프로토타입 체인**을 통해 상속하고있는 **프로토타입 객체**를 타고 가다, `Object`에서 해당 메소드를 발견한 것이다.

만약, 가장 끝의 프로토타입 객체에도 존재하지 않았다면 `undefined`를 반환하게 된다.

## 함수의 prototype

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.type = 'person'
const me = new Person('상민', 27)
console.dir(me)
```

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/25/3.PNG" alt="3">
</div>

생성자 함수를 사용하여 객체를 생성했다면, `prototype`속성을 사용하여 **프로토타입 객체**에 접근할 수 있다.

하지만, `.prototype` 을 통한 방법으로는 모든 객체가 아닌 위와 같은 생성자 함수 에서만 접근이 가능하다.

생성자함수에서의 `.prototype`은 이전의 모든 객체가 갖고있는 `[[Prototype]]`라는 숨겨진 속성을 통해 접근할 수 있는 참조 객체인 `prototype`과 이름이 유사해보이지만 사실은 다르다.

> 생성자함수의 `.prototype`으로 접근하는 객체는 이름만 `prototype`인 일반 속성이다.

`생성자함수.prototype`는, 해당 생성자 함수를 통해 만들어지는 객체의 `[[Prototype]]`으로 연결되는 `prototype`객체의 값으로 사용하라는 뜻이다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/25/5.PNG" alt="5">
</div>

만약 `const obj = {}`와 같은 일반 객체에서 `prototype`속성에 접근하기 위해서는 `__proto__`를 사용해야 한다.

> `setter`와 `getter` 역할을 수행

이를 통해 알 수 있는점은, `__proto__`는 객체의 속성이 아닌, `prototype`에 접근하기 위한 속성일 뿐이다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/25/4.png" alt="4">
</div>

생성자 함수를 정의하였을 때 두가지 반응이 일어난다.

1. 기본 반응인 본인 자신이 정의됨
2. 생성자 함수는 함수이기 때문에, `prototype`이라는 속성을 기본적으로 가지고 있다.
   > 이 속성에는 기본적으로 함수 자기 자신을 지칭하는 `counstructor`속성과, 자신을 통해 생성되는 객체의 `[[Prototype]]`으로 연결되는 `prototype` 객체를 지정해줄 수 있다.
   > 이때, `constructor`의 값을 유지하기 위해 `.prototype`을 아예 새로운 객체로 변경하기 보다는 속성을 추가해주는것이 좋다.

이렇게 정의된 생성자 함수로 생성된 객체는, 프로토타입 체인을 통해 자신을 생성한 생성자 함수의 프로토타입 객체에 접근할 수 있다.

## 결론

`Javascript`의 발전으로 `class`문법이 등장하긴 했지만, 이 또한 `prototype`기반의 문법이였다.

모든 객체들의 `[[Prototype]]`라는 속성은, `prototype chain`을 의미하였고, 이 연결을 통해 참조되고있는 `prototype`객체들에 접근할 수 있었다.

함수의 경우 정의될 때 추가적으로 함수의 `prototpye`속성이 자동으로 생성되었고, 이 속성의 내부에는 기본적으로 함수 자기자신을 지칭하는 `consturctor`가 존재하며, 다른 속성을 추가할 수 있었다.

생성자 함수를 통해 생성되는 객체의 `[[Prototype]]`을 통해 연결되는 `prototype` 객체는 생성자 함수가 정의될 때 만들어진 `prototype object`였다.

`prototype object`들도 마찬가지로 `[[Prototype]]`속성을 통한 `prototype chain`이 있었고, 해당 `chaining`을 타고 올라가며 찾고자 하는 속성을 탐색한다.
