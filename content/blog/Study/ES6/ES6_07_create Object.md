---
title : "ES6_객체만들기"
date : 2020-07-23 00:00:03
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
1. 객체 내에서 메소드를 정의할 때에는 arrow function을 사용하면 안된다.
  * 위의 방법을 사용하면, this가 객체가 아닌 window를 지칭하게 된다.

```javascript
function setUser(){
  const name = '입력되지 않았습니다.';
  const getName = function(){
    return name;
  };
  const setName = function(newName){
    this.name = newName;
  }
  return {name, nation : 'Korea', getName, setName};
}
const user = setUser();
user.setName('sangmin');
console.log(user) // {name : 'sangmin', nation : 'Korea', getName, setName}
```