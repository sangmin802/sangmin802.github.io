---
title : "ES6_Object.setPrototypeOf"
date : 2020-07-31 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Object.setPrototypeOf
첫번째 인자의 객체가 두번째 인자의 객체에게 상속받도록 한다.
> Object.assign(Object.create{객체}, {~~})랑 동일함

```javascript
  const healthObj = {
    name : '이름이야',
    showHealth(){
      console.log(`오늘 운동시간 : ${this.healthTime}`);
    },
    setHealth(newTime){
      this.healthTime = newTime;
    }
  };
  const myHealth = Object.setPrototypeOf({
    name : 'Sangmin',
    lastTime : '11:20'
  }, healthObj);
  console.log(myHealth); // {name: "Sangmin", lastTime: "11:20"}
  myHealth.setHealth('13:50');
  console.log(myHealth); // {name: "Sangmin", lastTime: "11:20", healthTime: "13:50"}

  // setPrototypeOf를 통해 객체간 체인만들기
  const parentObj = {
    father : '아빠',
    motehr : '엄마',
    setParent(fa = '아빠', mo = '엄마'){
      this.father = fa;
      this.motehr = mo;
    },
    introduce(){
      return `아들 : ${this.son}, 딸 : ${this.daughter}`;
    }
  }
  const childObj = Object.setPrototypeOf({
    son : '아들',
    daughter : '딸',
    setChild(so = '아들', da = '딸'){
      this.son = so;
      this.daughter = da;
    }
  }, parentObj);
  console.log(childObj)
  console.log(childObj.introduce()) // 아들 : 아들, 딸 : 딸 (기본값이라그럼)
```