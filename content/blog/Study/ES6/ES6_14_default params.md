---
title : "ES6_Default Parameters"
date : 2020-07-28 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Default Parameters(기본 변수 설정)
함수의 변수 설정에서, 기본값을 지정해줄 수 있다.

```javascript
// 구버전
function sum(value, size=2){ // 1번방법
  // size = size || 1; // 2번방법
  return value*size;
};
console.log(sum(3)); // 6
```