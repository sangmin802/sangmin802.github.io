---
title : "TypeScript Type Aliases"
date : 2020-12-21 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 타입 별칭(Type Aliases)
* `type`키워드를 사용해 새로운 타입 조합을 만들 수 있다.
* 하나 이상의 타입을 조합해 별칭을 부여하며, 정확히는 조합한 각 타입들을 참조하는 별칭을 만드는 것이다. 일반적으로 둘 이상의 조합을 구성하기 위해 `Union`을 많이 사용한다.
```javascript
  type CustomType1 = string;
  type CustomType2 = string | number | boolean;
  type CustomType3 = {
    name : string,
    age : number,
    isValid : boolean
  } | [string, number, boolean];

  let user1 : CustomType3 = {
    name : 'sangmin',
    age : 26,
    isValid : true
  };
  let user2 : CustomType3 = ['sangmin', 26, true];

  function func(val : CustomType1) : CustomType2 {
    switch(val){
      case 'string' : return val.toUpperCase();
      case 'number' : return parseInt(val);
      default : return true;
    }
  }
```
> `Union`인 타입들이 여러번 사용될 때, 특정한 변수에 담아서 사용하는 느낌? `const`, `let`과 비슷한 듯 하다.

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)