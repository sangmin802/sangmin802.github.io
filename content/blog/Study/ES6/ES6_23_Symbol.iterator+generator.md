---
title : "ES6_Symbol.iterator+generator"
date : 2020-08-17 00:00:03
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Symbol[iterator]+generator
* 두가지 기능을 활용하여 `iterable`객체를 반환하는 함수를 만들어보자

```javascript
const obj = {
  1 : 'one',
  2 : 'two',
  3 : 'three'
}
for(let a of obj){
  console.log(a) // obj is not iterable
}
console.log(...obj) // error
```
* 현재 `obj`는 반복순회할 수 없기 때문에 위의 에러가 발생한다.
* 해결하기 위해, 반복할 수 있는 `Array`의 형식으로 바꾸기위해 `Object.keys` 혹은 `Object.values`로 변환해줘야 한다.
* 위처럼 `Object method`를 활용하여 새롭게 배열을 만드는것이 아닌, `Symbol.iterator`로 할 수 있다.

```javascript
const ChangeToIterable = (unIterableObj) => {
  const iter = valuesIter(unIterableObj);
  return {
    [Symbol.iterator] : function(){
      return this; // iterator객체를 반환함
    },
    next : function(){
      return iter.next();
    }
  }
};

const valuesIter = function*(unIterableObj){
  for(let key in unIterableObj){
    yield unIterableObj[key];
  }
};

// 정상작동됨.
for(let a of ChangeToIterable(obj)){
  console.log(a) // one two three
};
```