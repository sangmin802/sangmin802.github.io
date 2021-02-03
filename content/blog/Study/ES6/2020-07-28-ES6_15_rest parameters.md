---
title : "ES6_Rest Parameters"
date : 2020-07-28 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Rest Parameters(가변인자)
* 가변인자 arguments는 유사배열이므로, Array 메소드를 사용할 수 없다.
* 기존 Array.from도 가능하지만, 변수로 받을 때 spread operator로 더 편하게 받을 수 있다.

```javascript
function checkNum(...argArr){
  // const argArr = Array.from(arguments);
  console.log(argArr)
  const result = argArr.every(res => typeof res === 'number');
  console.log(result);
}

checkNum(17,1,"24"); 
// [17,1,'24'], false
checkNum(10,2,3,4,5,55);
// [10,2,3,4,5,55], true
```