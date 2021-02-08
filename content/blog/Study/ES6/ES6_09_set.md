---
title : "ES6_Set으로 유니크한 배열 만들기"
date : 2020-07-24 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Set
* 중복없이 유일한 값을 저장하고자 할 때, 이미 존재하는지 체크할 때 유용하다.

1. `has` 메소드로 해당 값을 가지고있는지 확인할 수 있다.
2. `delete` 메소드로 해당 값을 지울 수 있다.

```javascript
let mySet = new Set();
const arr = [1,1,2,3,4];
console.log(Array.from(new Set(arr))); // [1,2,3,4]

mySet.add('crong');
mySet.add('harry');

console.log(mySet.has('crong')); // true

mySet.delete('crong');

console.log(mySet.has('crong')); // false
```