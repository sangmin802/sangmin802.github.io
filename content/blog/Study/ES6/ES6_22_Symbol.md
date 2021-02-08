---
title : "ES6_Symbol"
date : 2020-08-17 00:00:02
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6
---   
## Symbol
* 7번째 원시 데이터 타입으로 `Symbol`이 추가되었다.
* 객체 고유 속성(`key`, `value`)를 만들 수 있는 원시데이터 형식이다..
* 객체에서 `Symbol`로 생성된 속성은, `for of`나 `map`과 같은 순회 메소드에서 노출되지 않는다.
* `Symbol`은 `string.reaplce`, `string.search`등의 메소드를 사용할 수 있다.

```javascript
console.dir(Symbol) // Symbol은 함수이다. 여러개의 메소드를 갖고있는 객체이기도 하다.
```

### Symbol('원하는 key')

```javascript
const mainDivide = Symbol('대분류');
const subDivide = Symbol('소분류');
const item = {};
item[mainDivide] = '신선' // Symbol 선언법
item[subDivide] = '고기'

console.log(mainDivide); // Symbol(대분류)
console.log(mainDivide === 'Symbol(대분류)');
// 결과값이 문자열처럼보이지만, 문자열도 아니고, == 도 성립안됨. 야예 다른 값
console.log(Symbol('대분류') === Symbol('대분류')) // false
console.log(item[mainDivide]); // 신선
console.log(item[mainDivide] === '신선') // true
console.log(typeof mainDivide); // symbol
// 문자열타입이 아니기 떄문에, 문자열과 합치는것이 불가능하다.
console.log(item)
```

### Symbol.for
* `Symbol.for()`는 다른곳에서도 접근 가능한 Symbol을 생성하는것이다.
* `Symbol`의 중요 특징인 고요성을 없애기 때문에, 되도록 사용하지 말자.

### System Symbol
* 자바스크립트 내부에서 사용되는 `Symbol`들로, 해당 `Symbol`들을 활용하여 객체를 조정하는 기본동작을 입맛대로 변경할 수 있다.
1. Symbol.hasInstance
2. Symbol.isConcatSpreadable
3. <b style="color : tomato">Symbol.iterator</b>
4. Symbol.toPrimitive