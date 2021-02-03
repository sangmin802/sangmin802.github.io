---
title : "ES6_for of"
date : 2020-07-23 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## data 순회하기

* 예제를 위한 임의의 상위 메소드 생성

```javascript
let data = [1,2,undefined,NaN,null,'ㅋ'];
Array.prototype.getIndex = () => {}
```

### forEach 등등.. map도 가능
```javascript
data.forEach(res => {
  console.log(res);
})
```

### for in 매우비추천
```javascript
for(let i in data){
  console.log(data[i]);
}
```
  1. for in의 경우, 개발자가 임의로 Array.prototype을 통해 공용 메소드를 만들었다면, 그 메소드또한 console로 찍혀나온다.
  2. 즉, 상위에서 생성된 값 또한 순회됨.

### for of
```javascript
for(let a of data){
  console.log(a);
}
```
  1. for in의 대체제로, 자신이 갖고있는 값들만 순회시키는데다, 출력할 때, index조회 필요 없이 그냥 순서대로 출력시킴
  2. for of는 배열전용이 아닌 일반 문자열또한 순회가능하다.
