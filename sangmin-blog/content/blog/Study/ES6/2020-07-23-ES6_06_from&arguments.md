---
title : "ES6_from과 arguments"
date : 2020-07-23 00:00:02
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## arguments
* 인자의 갯수가 수시로 바뀌는 함수의 경우, 모든 변수를 지정해주는것이 불가능하기 때문에 aurguments를 통해 별도의 변수 필요 없이 배열화 할 수 있다.
* 이전 실행컨텍스트 에서 arguments라는 값이 생성되는것을 생각해보면 된다.

```javascript
function addMark(){
  let newData = [];
  newData = Array.from(arguments).map(res => {
    return res+'!';
  })
  console.log(newData) // ['1!', '2!', '3!', '4!', '5!']
}
addMark(1,2,3,4,5);
```