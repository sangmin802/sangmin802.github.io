---
title : "ES6_const"
date : 2020-07-17 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6  
---   
## const

* 재선언은 불가능하지만, 배열이나 객체로 선언(참조의 값)된 값을 변경하는것은 가능하다.

```javascript
function home(){
  const list = ['apple', 'orange', 'watermelon'];
  list.push('banana');
  console.log(list);
  // const는 재선언은 불가능하지만, 배열이나 객체로 선언된 값을 변경하는 것은 가능하다.
};
home(); // ["apple", "orange", "watermelon", "banana"]
```

### 불변성

* 객체나, 배열은 참조를 하기 때문에, 값 변경시 모든 값들이 변경되서 새로운 객체나 배열을 만드는것이 좋다.

```javascript
const list = ['apple', 'orange', 'watermelon'];
// list2 = [].concat(list, 'banana');
list2 = list.concat('banana');
console.log(list, list2);
// list : ["apple", "orange", "watermelon"]
// list2 ["apple", "orange", "watermelon", "banana"]

// destructuring 이후, concat보다는..
const obj = {id : 0, name : 'baby'};
const arr = [1,2,3];

const newObj = {...obj};
const newArr = [...arr];

// 값은 동일하지만, 같은 값을 참조하고있지 않다.
console.log(obj === newObj) // false
console.log(arr === newArr) // false
```