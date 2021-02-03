---
title : "ES6_Class객체 생성"
date : 2020-07-30 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Class
기존 `함수` 를 통한 객체생성이 아닌, `Class` 를 통한 객체생성이 가능하게 되었다.
> 실제로 React, Vue를 사용하다보면 Class기반 컴포넌트들을 쉽게 볼 수 있다.

```javascript
// 기존의 function을 통한 객체생성
function Health(name){
  this.name = name;
}

Health.prototype.showHealth = function(){
  console.log(this.name);
};

const user = new Health('이름이야');
user.showHealth(); // 이름이야

// Class 객체
class Health {
  constructor(name, lastTime){
    this.name = name;
    this.lastTime = lastTime;
  }

  showHealth(){
    console.log(this.name);
  }
}

class HeatlPlus extends Health {
  constructor(name, lastTime, gender){
    super(name, lastTime);
    this.gender = gender;
  }

  additionalMethod(){
    console.log('Fuck added');
  }
}

const user = new HeatlPlus('추가이름이야', null, 'male');
console.log(user)
// HealthPlus obj {
//  gender : 'male',
//  lastTime : null,
//  name : '추가이름이야'
// }
}
user.additionalMethod(); // Fuck added
user.showHealth(); // 추가이름이야
```