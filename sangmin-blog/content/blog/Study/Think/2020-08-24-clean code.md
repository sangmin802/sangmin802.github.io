---
title : "깨끗한 코드를 위한 5가지 팁!"
date : 2020-08-24 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 
## 깨끗한 코드의 필요성
* 협업을 할 때에, 추가적인 설명이 없어도 다른사람이 한번에 용도를 이해할 수 있도록  
* 개인 프로젝트더라도 오랜 시간 이후, 내가 나의 코딩 의도를 쉽게 알 수 있도록  

### 검색이 가능한 이름을 사용하기
해당 값의 용도를 예상하여 검색할 수 있도록 한다.  

* 😡 BAD!
```javascript
setInterval(eatKimchi, 86400);
```

* 😁 GOOD!
```javascript
const SECONDS_IN_A_DAY = 86400;
setInterval(eatKimchi, SECONDS_IN_A_DAY);
```

### 함수명은 동사로 사용하기 + 하나의 함수는 하나의 주요한 기능만 수행하기
명사로 함수명을 짓는것 보다 동사로 함수명을 짓게되면, 코드를 짜면서 해당 함수가 너무 많은 기능을 갖는것이 아닌지 확인을 할 수 있다.  
기본적으로 함수는 한개의 기능만 잘해야하는것이 중요하기때문!  
사전에 정했던 동사로된 함수명과 관련이 먼 기능을 가진 함수라면 분리하는것이 좋다!  

* 😡 BAD!
```javascript
// cookie를 찾는것과, userData를 불러오는것을 같이갖고있는 함수
function userData(){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_id=`);
  if(parts.length === 2){
    const cookie = parts.pop().split(';').shift();
    // 이후, cookie를 사용하여 userData를 불러오는 코드들
  }
}
const data = userData();
```

* 😁 GOOD!
```javascript
// cookie를 찾는 함수 분리
function getCookie(){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; user_id=`);
  if(parts.length === 2){
    return parts.pop().split(';').shift();
  }
}
// 가져온 cookie를 활용해 userData를 불러오는 함수 실행
function loadUserData(){
  const cookie = getCookie();
  // 이후, cookie를 사용하여 userData를 불러오는 코드들
}
const userData = loadUserData();
```

### 인수는 되도록 적게, 필요하다면 객체로
인수는 최대 3개가 적당하지만, 많은 인수를 보내야 한다면 객체를 사용하는게 좋다.  
> like arguments, destructuring

* 😡 BAD!
```javascript
function makePayment(price, productId, size, quantity, userId){
  // Payment 작성
};
makePayment(35, 5, 'xl', 2, '니꼬');
```

* 😁 GOOD!
```javascript
function makePayment({ price, productId, size, quantity, userId }){
  // Payment 작성
}
makePayment({
  price : 35,
  productId : 5,
  size : 'xl',
  quantity : 2,
  userId : '니꼬',
});
```

### boolean을 함수의 값으로 보내는것을 방지하기
boolean을 함수의 값으로 보낸다는 것은, 해당 함수에 조건문이 있는 경우일 것이다.  
그럴 때에는, 해당 조건에 따라 다른 함수를 만들어서 진행하는것이 좋다.  
함수는 하나의 기능만 하는것이 좋기 때문!  

* 😡 BAD!
```javascript
function sendMessage(text, isPrivate){
  if(isPrivate){
    // 비밀 메시지
  }else{
    // 공개 메시지
  }
}
sendMessage('hello', false)
sendMessage('this is a secret', true)
```

* 😁 GOOD!
```javascript
function sendPrivateMessage(text){
  // 비밀 메시지
}
function sendPublicMessage(text){
  // 공개 메시지
}
sendPublicMessage('hello');
sendPrivateMessage('this is a secret');
```

### 짧은 변수명이나 축약어는 절대 금지
a, b, c 등 짧은 변수명이나 축약어는 절대사용하면 안된다.  
당장 내일이 되면 나도 모를수있다!  

* 😡 BAD!
```javascript
allUsers.forEach((u, i) => {
  sendEmail(u);
  addToCount(i);
});
```

* 😁 GOOD!
```javascript
allUsers.forEach((user, currentNumber) => {
  sendEmail(user);
  addToCount(currentNumber);
});
```

### Tip!
우리는 개발을 할 때에 미친?상태이기 때문에 처음부터 이쁘고 깨끗한 코드를 쓰려고하지는 말자.  
일단, 원하는 기능이 잘 작동되로고 코드를 작성하고 마지막에 대청소를하는것이 좋다.  

### 출처
* [노마드코더 유튜브](https://www.youtube.com/watch?v=Jz8Sx1XYb04)