---
title : "ES6_iterable"
date : 2020-08-17 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## iterable객체
* 반복가능한 객체로, 배열을 일반화 한 객체이다.
* 어떤 객체에서도, `for of`등의 반복문을 적용할 수 있다.

### iterable한 객체 만들기
```javascript
const range = {
  from : 1,
  to : 5
}
```
* 현재, `range`라는 객체는 `iterable`하지 않은 객체이다. 이 객체를, `for of`를 통해 반복순회 가능한 `iterable` 객체로 만들어보자.
* `iterable`한 객체가 되기 위해선, `Symbol.iterator` 메소드를 추가해야한다.
  1. `for of` 호출 시, `Symbol.iterator`를 가장 먼저 실행.
  2. `Symbol.iterator`는 `iterator`(`next()`메소드를 가지고있음)객체를 반환해야한다.
  3. 이후, `for of`는 반환된 `iterator`객체만을 대상으로 동작한다.
  4. `for of`에서 순차적으로 작업을 할 때, 다음값이 필요하면 `next()`를 실행시킨다.
  5. `next()`의 반환값은 `{done : boolean, value : any}`의 형태이고, `done=true`는 반복종료. `done=false`일땐 `value`에 값이 저장된다.

### 예제
```javascript
range[Symbol.iterator] = function(){ // range객체에 Symbol.iterator 메소드 생성. 1. 제일먼저 실행됨.
  // 딱 한번만 실행되서 iterator객체를 return하고 끝
  return { // 2. 반환되는 객체이며, for of는 해당 객체를 대상으로 진행
    current : this.from,
    last : this.to,
    
    next(){ // 3. for of 반복문으로 실행될때마다 next() 작동
      // console.log(this) // 이후, 계속 실행 iterator객체
      if(this.current <= this.last){
        return {done : false, value : this.current++}
      }else{
        return {done : true};
      };
    }
  };
};

for(let num of range){
  console.log(num); // 1 2 3 4 5
}
```

### 아예 첫 객체를 iterator 객체로 만드는 방법
```javascript
const range2 = {
  from : 3,
  to : 10,
  [Symbol.iterator](){
    this.current = this.from; // 변화가 있는 속성 따로지정
    return this; // next()를 가지고있는 자기자신을 반환
  },
  next(){
    if(this.current <= this.to){
      return {done : false, value : this.current++};
    }else{
      return {done : true};
    };
  }
};
for(let num of range2){
  console.log(num); // 3,4,5,6,7,8,9,10
}
```

### 요약
1. `for of`등 순회 메소드를 사용할 수 있는 객체를 `iterable`이라고 한다.
2. `iterable`한 객체에는 `Symbol.iterator` 메소드가 있어야 한다.
3. `Symbol.iterator`를 통해 반환되는 객체를 `iterator`라고 한다.
4. 이후 `for of`의 요청은 `iterator`객체의 `next()`를 통해 진행된다.

### 참조
* <https://ko.javascript.info/iterable>