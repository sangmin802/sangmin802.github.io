---
title : "CustomEvent"
date : 2020-07-08 00:00:00
category : "Study"
draft : false
tag : "Think"
---   
### 🙄 경험
Vue공부중, Component부분에서 부모와 자식Component간의 소통을 보고있었다.  
React를 이미 알고 있었기 때문에 속성을 전달하고, 속성으로 전달된 부모의 이벤트를 호출하는 구조랑 비슷한것 같아 문제는 없었다.  
그런데.. dispatchEvent라는 메소드를 처음보게되었다.  

### 🤔 의문  
Redux상태관리를 할 때, 제공되는 dispatch메소드를 활용하여 state의 변경시켰는데 비슷한건가?   

### 😆 커스텀 이벤트 생성 및 호출(?)!
<div style="
  width : 30%;
  margin : 0 auto;
  display : flex;
  flex-direction : column;
  align-items : center;
  border : 1px solid #666666; 
  border-radius : 5px;
  padding : 0.5em 0;
  "
>
  <p style="margin-bottom : 0.5em">실행예제</p>
  <div class="event1">누가 대신 실행해줘</div>
  <button class="support">대신실행</button>
</div>
<script>
  const event = new CustomEvent('test', {detail : '사용자 지정 이벤트 입니다.'});
  const support = document.querySelector('.support');
  const elem1 = document.querySelector('.event1');
  elem1.addEventListener('test', (e) => {
    alert(e.detail)
  })
  support.addEventListener('click', () => {
    elem1.dispatchEvent(event);
  })
</script>

### HTML
```javascript
<div class="event1">누가 대신 실행해줘</div>
<button class="support">대신실행</button>
```
### JavaScript
```javascript
const event = new CustomEvent('test', {
  detail : '사용자 지정 이벤트 입니다.'
  // 커스텀이벤트 등록 및, 두번째 인자로 data 설정 가능
});
const support = document.querySelector('.support');
const elem1 = document.querySelector('.event1');

elem1.addEventListener('test', (e) => {
  alert(e.detail)
  // elem1에 커스텀이벤트 'event' 등록
})
support.addEventListener('click', () => {
  elem1.dispatchEvent(event);
  // elem1에 등록되어있는 커스텀이벤트 'event'를 실행시켜줘
})
```

### 🧐결론
  * `new CustomEvent()`를 사용하여, 사용자지정 이벤트를 만들 수 있으며, 데이터값도 넣어줄 수 있다.  
  * 해당 이벤트가 연결된 엘리먼트에 직접적으로 사용자의 요청? 호출? 이 가지 않더라도 `엘리먼트.dispatchEvent(이벤트명)`를 통해, 실행시킬 수 있다.
