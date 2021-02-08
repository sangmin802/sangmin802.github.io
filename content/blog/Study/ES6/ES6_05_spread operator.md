---
title : "ES6_spread operator"
date : 2020-07-23 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## spread operator : 펼침연산자.
* 해당 기능을 사용하여, 참조가 아닌 복사된 객체와 배열을 만들수 있다.

```javascript
let pre = ['apple', 'orange', 100];
let newData = [...pre];
console.log(pre, newData); // 모양은 같지만, 서로 다른 배열

let arr = [100,200,'hello',null];
let newArr = [0,1,2,3, ...arr ,4];
console.log(arr, newArr); // arr의 값을 갖고있으며, 추가함

let test = [100,200,300];
function sum(a,b,c,d){
  console.log(a,b,c,d)
  return a+b+c;
}
console.log(sum(...test)) // 알아서 풀어라.
```