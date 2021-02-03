---
title : "ES6_Object.assign"
date : 2020-07-30 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Object.assign
새로운 다른 객체를 복사하는것같지만, 실은 복제를 하는것.
> 같은 객체를 바라보고있음. 불변성에 적합하지않음

```javascript
const obj = {
  name : '박상민',
  showName(){
    console.log(`저의 이름은 ${this.name}`);
  }
};
const newObj = Object.assign(obj)
console.log(newObj === obj) // true
```

## Object.create
인자로 들어오는 객체에게 상속받는 새로운 객체 생성
> 당연히 상속받는 객체의 값들도 사용할 수 있음.

```javascript
const healthObj = {
  name : '이름이야',
  showHealth(){
    console.log(`오늘 운동시간 : ${this.healthTime}`);
  }
};
const myHealth = Object.create(healthObj);
myHealth.healthTime = "11:20"; // 일일이 지정해줘야한다는 불편함
myHealth.resetTime = function(){
  console.log('Fucking Reset');
};

console.log(myHealth.name) // 이름이야
```

## Object.assign + Object.create
`Object.create`의 하나하나 지정해줘야한다는 불편함을 개선하여 상속받는 새로운 객체 생성

* create의 인자로 받는 객체에게 상속받는 새로운객체를 생성하며, 동시에 새로운 값들을 추가함. 이 경우, 상속받으며 새로운 객체를 생성하기때문에, 값이 최신화되지 않고, 상위에 생김(즉, 상위객체, 하위객체에 동일한 키값이 존재할 수 있음). 조회했을 때 잘 뜨긴하는데 좀 기분나쁨

```javascript
const healthObj = {
  name : '이름이야',
  showHealth(){
    console.log(`오늘 운동시간 : ${this.healthTime}`);
  }
};
const myHealth = Object.assign(Object.create(healthObj), {
  healthTime : "11:20",
  name : "Sangmin",
  restTime(){
    console.log('Fucking Reset');
  }
})
console.log(myHealth)
myHealth Obj {
  healthTime : "11:20",
  name : "Sangmin", // 새로운 값으로 name을 넣었지만, 
  restTime(){
    console.log('Fucking Reset');
  },
  __proto__ : {
    name : '이름이야', // 최신화 안됨.
    showHealth(){
      console.log(`오늘 운동시간 : ${this.healthTime}`);
    }
  }
}
console.log(myHealth.name) // Sangmin
```

### Object.assign을 통한 불변객체 복사
복제가 아닌 완전한 새로운 객체를 생성할 수 있음.

```javascript
const healthObj = {
  name : '이름이야',
  showHealth(){
    console.log(`오늘 운동시간 : ${this.healthTime}`);
  }
};
const myHealth = Object.assign({}, healthObj);
console.log(healthObj === myHealth); // false
```

### Object.assign 불변객체 북사 및, 새로운 값 변경
불변객체 복사 및, 값 최신화

```javascript
const healthObj = {
  name : '이름이야',
  showHealth(){
    console.log(`오늘 운동시간 : ${this.healthTime}`);
  }
};
const myHealth = Object.assign({}, healthObj, {
  healthTime : "11:20",
  name : "Sangmin",
  restTime(){
    console.log('Fucking Reset');
  }
});
console.log(healthObj);
// {
//   name : '이름이야',
//   showHealth(){
//     console.log(`오늘 운동시간 : ${this.healthTime}`);
//   }
// };
console.log(myHealth);
// {
//   name : 'Sangmin',
//   healthTime : "11:20",
//   restTime(){
//     console.log('Fucking Reset');
//   },
//   showHealth(){
//     console.log(`오늘 운동시간 : ${this.healthTime}`);
//   }
// };
```

## 다 필요없고 spread operator를 통한 깊은복사. 완벽😜
간편하고 깊은복사이다. 정말 완벽하다. 사랑한다.

```javascript
spread operator를 통한 깊은복사. 이상적.
const healthObj = {
  name : '이름이야',
  showHealth(){
    console.log(`오늘 운동시간 : ${this.healthTime}`);
  }
};
const myHealth = {...healthObj, name : "Sangmin", age : 26};
console.log(healthObj)
// {
//   name : '이름이야',
//   showHealth(){
//     console.log(`오늘 운동시간 : ${this.healthTime}`);
//   }
// };
console.log(myHealth)
// {
//   name : 'Sangmin',
//   age : 26,
//   showHealth(){
//     console.log(`오늘 운동시간 : ${this.healthTime}`);
//   }
// };
```