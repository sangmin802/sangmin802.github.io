---
title : "Vue Computed & Watch"
date : 2020-09-01 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue Computed & Watch"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 
<script src="https://unpkg.com/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>

# Computed & Watch
## Computed
### Computed 정의
템플릿이나 DOM 내에 표현식을 넣으면 편리하긴 하다.

> `<div><% message.split('').reverse().join('') %></div>`

하지만, 너무 많은 연산을 템플릿이나 DOM 내에서 하면 코드가 비대해지고 유지보수가 어려워진다.<br>
복잡한 로직이라면 반드시 Computed속성을 사용해야한다.<br>
메소드로 계산된 data값을 즉시바인딩한다고 생각하자.<br>
Computed에게 감지할 수 있는 data의 값은 필수적이다.

### Computed vs Methods
* computed나 methods 모두 출력되는 결과는 동일하다. 다만, 
  * computed로 연결되어있는 data의 값이 변하지 않는 한, 해당 computed는 절대 실행되지 않는다.
> 즉, DOM이나 템플릿에서 computed를 한번을 쓰든, 백번을 쓰든 연관된 data가 달라지지 않는다면 한번만 실행되고 그 실행된 값을 저장(캐싱)하여 재활용한다.
  * methods는 DOM이나 템플릿에서 입력될 때마다 호출된다.

* 결과적으로 사용자의 요청인 이벤트와 바인딩된 메소드가 필요할 경우, methods를 사용하고 그렇지 않고 이미 가지고있는 data를 기반으로 재가공이 필요하다면 computed를 사용하자.

```javascript
// HTML
<div id="Computed">
  <p>원본 메시지 : <%message%></p>
  <p>역순 메시지 : <%reversedMessage%></p>
</div>

// Script
new Vue({
  el : '#Computed',
  delimiters : ['<%', '%>'],
  data : {
    message : '안녕하세요'
  },
  computed : {
    reversedMessage(){
      return this.message.split('').reverse().join('');
    }
  },
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="Computed">
    <p>원본 메시지 : <%message%></p>
    <p>역순 메시지 : <%reversedMessage%></p>
  </div>
</div>
{:/}

## Watch
### Watch 정의
Vue에서 가장 기본적인 속성으로 데이터의 변경에 반응하는 일반적인 방법이다. 대부분의 경우 computed가 더 적합하지만, 사용자가 만든 감시자가 필요한 경우가 있다.

```javascript
// HTML
<div id="Watch">
  <p>
    입력하기
    <input type="text" v-model="question">
  </p>
  <p><%answer%></p>
</div>
// Script
new Vue({
  el : '#Watch',
  delimiters : ['<%', '%>'],
  data : {
    question : '',
    answer : '질문을 하기 전까지는 대답할 수 없습니다.'
  },
  watch : {
    question(){ // data의 값과 같은 명의 메소드로 설정하여 해당 데이터의 값이 변결될 때마다 실행
      this.answer = '입력을 기다리는중...'
      this.getAnswer();
    }
  },
  methods : {
    getAnswer : _.debounce(
      function(){
        if(!this.question.includes('?')){
          this.answer = '질문에는 일반적으로 물음표가 포함됩니다.';
          return
        }
        this.answer = '생각중...'
        fetch('https://yesno.wtf/api')
        .then(res => res.json())
        .then(data => {
          this.answer = _.capitalize(data.answer)
        })
        .catch((err) => {
          this.answer = err;
        })
      },
      500
    )
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="Watch">
    <p>
      입력하기
      <input type="text" v-model="question">
    </p>
    <p><%answer%></p>
  </div>
</div>
{:/}

## computed vs watch vs methods
### computed
* 특정 data의 값을 기반으로 작동하는 단순 표현식?
* data가 결과값의 초기값을 가질 필요 없이, 메소드명으로 즉시 바인딩 가능.
### watch
* 특정 data를 감시하고 있다가, 변화가 있을 때 해당 data값이 속성명인 함수를 콜백함수로 실행시킨다.
* Vue의 기본적인 기능이기 때문에 꼭 data에 초기값을 가지고 있어야 한다.
* 해당 콜백함수의 첫번째 인자는 바뀐 data값, 두번째 인자는 바뀌기 전 data값이다.
* methods랑 비슷해보이지만, 사용자의 요청이 없어도 data가 바뀌면 스스로 작동한다.
### methods
* 사용자의 요청이 있을 때만 실행이 된다.

## computed vs watch
* 되도록 computed를 사용하도록 하자.

```javascript
// HTML
<div id="Computed_vs_Watch">
  <%fullName%>
</div>
// Script
new Vue({
  el : '#Computed_vs_Watch',
  delimiters : ['<%', '%>'],
  data : {
    // fullName : '',
    firstName : '',
    lastName : ''
  },
  created(){
    setTimeout(() => {
      this.firstName = '박',
      this.lastName = '상민'
    }, 1000)
  },
  // watch : {
  //   firstName(newVal, oldVal){
  //     this.fullName = newVal + this.lastName;
  //   },
  //   lastName(newVal, oldVal){
  //     this.fullName = this.firstName + newVal;
  //   },
  // },
  computed : {
    fullName(){
      return this.firstName+this.lastName;
    }
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="Computed_vs_Watch">
    <%fullName%>
  </div>
</div>
{:/}

## 참조
[Vue.js 공식가이드 computed&watch](https://kr.vuejs.org/v2/guide/computed.html)


<script>
new Vue({
  el : '#Computed',
  delimiters : ['<%', '%>'],
  data : {
    message : '안녕하세요'
  },
  computed : {
    reversedMessage(){
      return this.message.split('').reverse().join('');
    }
  },
})

new Vue({
  el : '#Watch',
  delimiters : ['<%', '%>'],
  data : {
    question : '',
    answer : '질문을 하기 전까지는 대답할 수 없습니다.'
  },
  watch : {
    question(){ // data의 값과 같은 명의 메소드로 설정하여 해당 데이터의 값이 변결될 때마다 실행
      this.answer = '입력을 기다리는중...'
      this.getAnswer();
    }
  },
  methods : {
    getAnswer : _.debounce(
      function(){
        if(!this.question.includes('?')){
          this.answer = '질문에는 일반적으로 물음표가 포함됩니다.';
          return
        }
        this.answer = '생각중...'
        fetch('https://yesno.wtf/api')
        .then(res => res.json())
        .then(data => {
          this.answer = _.capitalize(data.answer)
        })
        .catch((err) => {
          this.answer = err;
        })
      },
      500
    )
  }
})

new Vue({
  el : '#Computed_vs_Watch',
  delimiters : ['<%', '%>'],
  data : {
    // fullName : '',
    firstName : '',
    lastName : ''
  },
  created(){
    setTimeout(() => {
      this.firstName = '박',
      this.lastName = '상민'
    }, 1000)
  },
  // watch : {
  //   firstName(newVal, oldVal){
  //     this.fullName = newVal + this.lastName;
  //   },
  //   lastName(newVal, oldVal){
  //     this.fullName = this.firstName + newVal;
  //   },
  // },
  computed : {
    fullName(){
      return this.firstName+this.lastName;
    }
  }
})
</script>

