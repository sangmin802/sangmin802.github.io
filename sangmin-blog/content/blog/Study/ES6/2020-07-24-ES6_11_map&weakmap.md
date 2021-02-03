---
title : "ES6_Map&WeakMap 추가정보를 담은 객체저장"
date : 2020-07-24 00:00:02
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Map, WeakMap
### 배열 -> Set, WeakSet (좀 더 세련된 배열?)
### 객체 -> Map, WeakMap (좀 더 세련된 객체?)

### 특징
* Set, Map : 배열이나 객체에서 기본타입을 저장할 때 사용한다.
* WeakSet, WeakMap : 기본타입을 제외한 모든 경우를 저장할 수 있다.
* set, get, has, delete, claer 메소드 사용 가능.

### 장점
* Set은 중복되는것을 제거할 수 있다.
* Map은 iterable하기때문에, 순회(forEach, for of 등등..)을 사용할수 있다.

### 🤔 이상한점
* WeakMap은 key값이 객체여야만 가능함.(대체 왜..?)

```javascript
let m = new Map([
  ['basic', 'Basic data'],
  ['basic2', 'Basic2 data'],
]); // 이렇게 미리넣는것도 가능
let obj = {
  13 : 'Unlucky Number',
  class : 'Bard',
  undefined : 'I am undefined',
  null :  'I am null'
};
m.set(13, 'Unlucky Number');
m.set('class', 'Bard');
m.set(undefined, 'I am undefined');
m.set(null, 'I am null');
m.forEach((res, key) => {
  console.log(key, res) // 정상적으로 순회함
})
obj.forEach((res, key) => {
  console.log(key, res) // 에러가 발생함
})

// WeakMap
let wm = new WeakMap();
let func = function(){return 'fuck you'};
const key = {};
wm.set(key, func);
console.log(wm) // { {} : function(){return 'fuck you'} }
```

### 😅 결론
안쓸듯 ㅋㅋ;