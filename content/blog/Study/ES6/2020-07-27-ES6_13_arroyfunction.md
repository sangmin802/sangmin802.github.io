---
title : "ES6_Arrow function(화살표함수)"
date : 2020-07-27 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Arroy function(화살표함수)
* 콜백함수나, 몇몇의 함수를 입력할 때 function을 다시쓰는것은 너무나도 귀찮다. 따라서, 이런 경우 `() =>`로 축약할수 있게 되었다.

```javascript
// 구버전
setTimeout(function(){
  console.log('fuckyou')
}, 1000)

// 화살표함수
setTimeout(() => {
  console.log('fuckyou')
}, 1000)

let newArr = [1,2,3,4,5].map((res, index, object) => {
  return res*2;
})
console.log(newArr) // [2,4,6,8,10]
```

## 화살표함수의 this
1. 기본적으로 객체 내에서는 메소드를 정의하게될 경우, 해당 메소드의 `this`는 객체를 지칭한다. <b style="color : tomato; font-">하지만</b>
메소드를 화살표함수로 정의한다면, `this`는 객체가 아닌 `window`를 지칭하게된다.
2. 콜백함수로 일반함수를 사용했을 때, 객체 내부더라도 window를 지칭한다. 이럴경우, 이전까지는 `.bind(this)`를 통해 해결해왔지만, 화살표함수로 해결 가능해졌다.
> 실제로, React에서 컴포넌트 내부의 메소드를 호출하려 할 때, `this.method`처럼 직접연결할 경우, 뒤에 `.bind(this)`를 써줬어야 했는데, 직접연결이 아닌 `() => {this.method}`는 써줄 필요가 없었다.

```javascript
const myObj = {
  name : 'apple',
  arrowThis : () => { // 객체 내 화살표함수
    console.log(this) // window
  },
  normalThis(){ // 객체 내 일반메소드
    console.log(this) // myObj
  },
  arrowCallback(){ // 객체 내 화살표 콜백함수
    setTimeout(() => {
      console.log(this) // myObj
    }, 100)
  },
  normalCallback(){
    setTimeout(function(){ // 객체 내 일반 콜백함수
      console.log(this) // window
    }, 100)
  },
};
myObj.arrowThis();
myObj.normalThis();
myObj.arrowCallback();
myObj.normalCallback();
```

## 🧐결론
  * 화살표함수는 편리하지만, 사용할 때 this가 지칭하는것이 바뀔 수 있다는점을 알고 사용해야겠다.