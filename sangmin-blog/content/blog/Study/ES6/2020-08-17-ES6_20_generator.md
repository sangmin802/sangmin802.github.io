---
title : "ES6_generator"
date : 2020-08-17 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## generator함수
1. `function*`의 구조를 가지고 있다.
2. `generator`함수 호출 시, 코드가 실행되는것이 아닌 실행을 처리하는 특별객체 `generator객체`를 반환하다.
3. `return`으로 단 하나의 값을 반환하는것이 아닌, `yield`로 여러개의 결과값을 원하는 시기에 반환시킬 수 있다.
4. `next()`는` generator`의 주요 메소드로, `next()`호출시, 가장 가까운 yield문을 만날때까지 실행되고, 해당 값을 반환한다.
5. `next()`의 반환값은 `{done : boolean, value : any}`의 형태이고, `done=true`는 반복종료. `done=false`일땐 `value`에 값이 저장된다.

```javascript
function* generateSequence(){
  yield 1;
  yield 2;
  return 3;
}
const generator = generateSequence();
console.log(typeof generateSequence()); // object

const firstYield = generator.next();
console.log(firstYield); // {value : 1, done : false};
const secondYield = generator.next();
console.log(secondYield); // {value : 2, done : false};
const thirdYield = generator.next();
console.log(thirdYield); // {value : 3, done : true};
```
* `next()`를 보면 알 수 있듯이, `generator`는 `iterator객체`를 반환하는 `iterable객체`이다.

### iterator객체를 반환하는 코드를 generator로 짜보기
```javascript
const range = {
  from : 1,
  to : 5,
  *[Symbol.iterator](){ // == [Symbol.iterator] : *function()
    for(let value = this.from; value <= this.to; value++){
      yield value;
    };
  }
};
console.log([...range]); // [1,2,3,4,5]
```
1. `Symbol.iterator`를 통해 반환되는 객체는, `next()` 메소드를 갖고있어야하며 정해진 구성을 갖춰야 한다.
2. `generator`를 통해 반환되는 값은, 위의 조건에 충족되기때문에 가능함.

### 참조
* <https://ko.javascript.info/generators>