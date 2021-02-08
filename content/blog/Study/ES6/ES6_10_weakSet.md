---
title : "ES6_WeakSet을통한 효과적으로 객체타입저장"
date : 2020-07-24 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## WeakSet : 기본타입이 아닌것들만 저장가능하다.
* 문자열, 숫자열, null, undefined, boolean을 제외한 모든것
* 객체타입을 중복없이 저장하고자 할 때 유용하다.

```javascript
let arr = [1,2,3,4];
let arr2 = [5,6,7,8];
let arr3 = [1,2,3,4];
let obj = {arr, arr2};
let ws = new WeakSet();
ws.add(arr); // 배열 삽입
ws.add(arr2); // 배열 삽입
ws.add(obj); // 객체 삽입
ws.delete(arr2) // arr2를 지워주세요
ws.add(111); // invalid type error
ws.add('111'); // invalid type error
ws.add(null); // invalid type error
ws.add(function(){}); // 함수객체 삽입

arr = null;

console.log(ws) // { 0 : obj, 1 : function..., 2 : arr }
console.log(ws.has(arr)); // false
```
* WeakSet은 처음 넣을 때, 참조타입이였는데 기본타입이 되었다면 그 값을 없애버린다.
* console에는 있는것처럼 보이지만, 갖고있는지 has 여부를 물어보면 false가 나옴