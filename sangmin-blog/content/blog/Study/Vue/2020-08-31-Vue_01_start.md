---
title : "Vue 시작"
date : 2020-08-31 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 특징"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

## 🧐 시작하게 된 계기
* 이번에 학교에서 백엔드 전공을 하고 있는 친구가 움짤제작기라는 웹 어플리케이션을 만드는데, 프론트는 아예 백지인 상태에서 동시에 진행하려다보니 고충을 느껴 도와주게 되었다.  
* 이왕 하는거, 새로운 프레임워크도 공부해볼 겸 Vue로 제작하게 되었다.

## Vue 실행
* 큰 규모의 웹어플리케이션이라면 Vue-cli를 통해 , create-react-app처럼 기본적인것들이 설치된 npm vue 앱도 있지만, 그렇지 않다면 CDN입력을 통해 실행시킬 수 있다.
> `<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>`

## 값 바인딩
### delimiters
* Vue Instance생성을 통해, 타겟이 되는 태그를 지정하고 data객체를 통해 HTML에서 기본적으로 중괄호(`{}`)로 접근을 할 수 있다.
* delimiters 변경을 통해, 중괄호를 다른것으로 바꿀 수 도 있다.

```javascript
// HTML
<div>
  <div id="app1">
  <%message%>
  </div>
</div>

// Script
new Vue({
  el : '#app1',
  delimiters : ['<%', '%>'],
  data : { 
    message : '안녕하세요 Vue!'
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app1">
    <%message%>
  </div>
</div>
{:/}

## Directive
### v-bind
* Vue에서 제공하는 특수속성인 v-접두어가 붙어있고, 렌더링 된 DOM에 특수한 반응형 동작을 한다.
* HTML 태그의 속성에 접근하여 동적으로 값을 지정해 줄 수 있다.

```javascript
// HTML
<div id="app2">
  <span v-bind:title="message">
    마우스를 올리면 바인딩된 message를 볼 수 있습니다. 
  </span>
</div>
// Script
new Vue({
  el : '#app2',
  data : {
    message : `이 페이지는 ${new Date}에 로드되었습니다.`
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app2">
    <span v-bind:title="message">
      마우스를 올리면 바인딩된 message를 볼 수 있습니다. 
    </span>
  </div>
</div>
{:/}

### v-on
* 사용자가 앱과 상호작용할 수 있게 하기 위해 v-on 디렉티브를 사용하여 Vue인스턴스에서 메소드를 호출하는 이벤트를 추가할 수 있다.
* 간단하다면, DOM에 직접 메소드를 추가하는것도 가능하다.

```javascript
// HTML
<div id="app5">
  <p v-on:mouseover="alertMessage"><%message%></p>
  <div>
    <p v-if="seen">제가 보이나요?</p>
    <button v-on:click="seen = !seen">토글버튼</button>
  </div>
</div>
// Script
new Vue({
  el : '#app5',
  delimiters : ['<%', '%>'],
  data : {
    message : '보여요!',
    seen : true
  },
  methods : {
    alertMessage(){
      this.seen = !this.seen;
      this.message = this.message === '보여요!' ? '안보여요!' : '보여요!';
    }
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app5">
    <p><%message%></p>
    <div>
      <p v-if="seen">제가 보이나요?</p>
      <button v-on:click="alertMessage">토글버튼</button>
    </div>
  </div>
</div>
{:/}

### v-model
* input 양식에 대한 입력과 앱 상태를 양방향으로 바인딩하는 v-model 디렉티브를 가지고 있다.

```javascript
// HTML
<div id="app6">
  <input v-model="message">
  <div><%message%></div>
</div>
// Script
new Vue({
  el : '#app6',
  delimiters : ['<%', '%>']
  data : {
    message : '입력해보세요',
  },
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app6">
    <input v-model="message">
    <div><%message%></div>
  </div>
</div>
{:/}

## 조건문과 반복문
### 조건문
* 텍스트뿐만 아니라, DOM 구조 자체에도 데이터를 바인딩 할 수 있으며, 해당 데이터를 통해 DOM 구조 변경 및 트랜지션 효과를 적용시킬 수 있다.(이후 다룰 예정)

```javascript
// HTML
<div id="app3">
  <p v-if="seen">이제 나를 볼 수 있어요</p>
</div>
// Script
new Vue({
  el : '#app3',
  data : {
    seen : true // false 하면 안보임
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app3">
    <div v-if="seen">이제 나를 볼 수 있어요</div>
  </div>
</div>
{:/}

### 반복문
* 배열의 데이터를 바인딩하여, 순회 - 표시할 수 있다.

```javascript
// HTML
<div id="app4">
  <ol>
    <li v-for="todo in todos">
      <%todo.text%>
    </li>
  </ol>
</div>
// Script
new Vue({
  el : '#app4',
  data : {
    todos : [
      { text: 'JavaScript 배우기' },
      { text: 'Vue 배우기' },
      { text: '무언가 멋진 것을 만들기' }
    ]
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app4">
    <ol>
      <li v-for="todo in todos">
        <%todo.text%>
      </li>
    </ol>
  </div>
</div>
{:/}

## 컴포넌트 활용하기
### Component
* Vue에서 컴포넌트는 미리 정의된 옵션을 가진 Vue 인스턴스이다.
* CDN이 아닌 Vue cli를 사용하면 컴포넌트로 구성된 Vue앱을 제작하게 된다.

```javascript
// HTML
<div id="app7">
  <todo-item
    v-for="item in groceryList"
    v-bind:text="item.text"
    v-bind:id="item.id"
    v-bind:key="item.id"
  ></todo-item>
</div>
// Script
Vue.component('todo-item', {
  props : ['text', 'id'],
  delimiters : ['<%', '%>'],
  template : `<p>No<%id%>. <%text%></p>`
})
new Vue({
  el : '#app7',
  delimiters : ['<%', '%>'],
  data : {
    groceryList : [
      {id : 0, text : 'Vegetables'},
      {id : 1, text : 'Cheese'},
      {id : 2, text : 'Porkbelly'}
    ]
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="app7">
    <todo-item
      v-for="item in groceryList"
      v-bind:text="item.text"
      v-bind:id="item.id"
      v-bind:key="item.id"
    ></todo-item>
  </div>
</div>
{:/}


<script>
new Vue({
  el : '#app1',
  delimiters : ['<%', '%>'],
  data : { 
    message : '안녕하세요 Vue!'
  }
})

new Vue({
  el : '#app2',
  data : {
    message : `이 페이지는 ${new Date}에 로드되었습니다.`
  }
})

new Vue({
  el : '#app3',
  data : {
    seen : true
  }
})

new Vue({
  el : '#app4',
  delimiters : ['<%', '%>'],
  data : {
    todos : [
      { text: 'JavaScript 배우기' },
      { text: 'Vue 배우기' },
      { text: '무언가 멋진 것을 만들기' }
    ]
  }
})

new Vue({
  el : '#app5',
  delimiters : ['<%', '%>'],
  data : {
    message : '보여요!',
    seen : true
  },
  methods : {
    alertMessage(){
      this.seen = !this.seen;
      this.message = this.message === '보여요!' ? '안보여요!' : '보여요!';
    }
  }
})

new Vue({
  el : '#app6',
  delimiters : ['<%', '%>'],
  data : {
    message : '입력해보세요',
  },
})

Vue.component('todo-item', {
  props : ['text', 'id'],
  delimiters : ['<%', '%>'],
  template : `<p>No<%id%>. <%text%></p>`
})
new Vue({
  el : '#app7',
  delimiters : ['<%', '%>'],
  data : {
    groceryList : [
      {id : 0, text : 'Vegetables'},
      {id : 1, text : 'Cheese'},
      {id : 2, text : 'Porkbelly'}
    ]
  }
})
</script>


## 참조
[Vue.js 공식가이드 소개](https://vuejs.org/v2/guide/)