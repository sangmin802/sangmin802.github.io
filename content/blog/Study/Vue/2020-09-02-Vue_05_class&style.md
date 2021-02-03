---
title : "Vue Class & Style"
date : 2020-09-02 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue Class & Style"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 
<style>
  .active {
    font-weight : bold;
  }
  .text_danger {
    color : tomato;
  }
</style>

# Class & Style 바인딩
* 데이터 바인딩은 엘리먼트의 클래스목록과 인라인 스타일을 조작하기 위해 일반적으로 사용된다.
* 두 속성은 v-bind를 사용하여 처리할 수 있다.
* 표현식으로 해당 속성의 값을 문자열로 입력해주면 되는데 일반 속성과 헷갈릴 수 있어서 Vue는 class와 style에 v-bind를 사용할 때, 문자열 이외에 객체나 배열을 사용할 수 있도록 해준다.

## HTML 클래스 바인디하기
### 객체구문
* 클래스를 동적으로 toggle하기 위해, v-bind:class에 객체를 전달할 수 있다.
* 인라인으로 해도 되며, 인스턴스 내부에서 정해줘도 된다.
* computed도 가능하다.

```javascript
// CSS
<style>
  .active {
    font-weight : bold;
  }
  .text_danger {
    color : tomato;
  }
</style>
// HTML
<div id="objClass" >
  <p class="static" :class="{active : isActive, text_danger : hasError}">인라인 동적 class</p>
  <p class="static" :class="instanceClass">인스턴스 data 동적 class</p>
  <p class="static" :class="computedClass">computed 동적 class</p>
</div>

// Script
new Vue({
  el : '#objClass',
  data : {
    isActive : true,
    hasError : false,
    instanceClass : {
      active : false,
      text_danger : true
    }
  },
  computed : {
    computedClass(){
      return {
        active : this.isActive,
        text_danger : this.hasError
      }
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="objClass" >
    <p class="static" :class="{active : isActive, text_danger : hasError}">인라인 동적 class</p>
    <p class="static" :class="instanceClass">인스턴스 data 동적 class</p>
    <p class="static" :class="computedClass">computed 동적 class</p>
  </div>
</div>
{:/}

### 배열구문
* 배열을 전달하여 클래스 목록을 지정할 수 있다.
* 삼항 조건부 기능을 통해 클래스를 동적으로 제어할 수 있다.
* 삼항 조건부가 길어지게되면 복잡해질 수 있기 때문에, 배열 내에서 객체구문을 사용할 수 있다.

```javascript
// CSS
<style>
  .active {
    font-weight : bold;
  }
  .text_danger {
    color : tomato;
  }
</style>

// HTML
<div id="arrClass">
  <p :class="[acitveClass, errorClass]">배열 class</p>
  <p :class="[isActive ? activeClass : '', errorClass]">배열 삼항 조건부 class</p>
  <p :class="[{active : isActive}, errorClass]">배열 내 객체구문 class</p>
</div>

// Script
new Vue({
  el : '#arrClass',
  data : {
    acitveClass : 'active',
    errorClass : 'text_danger',
    isActive : false,
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="arrClass">
    <p :class="[acitveClass, errorClass]">배열 class</p>
    <p :class="[isActive ? activeClass : '', errorClass]">배열 삼항 조건부 class</p>
    <p :class="[{active : isActive}, errorClass]">배열 내 객체구문 class</p>
  </div>
</div>
{:/}

### 컴포넌트와 함께 사용

```javascript
// CSS
<style>
  .active {
    font-weight : bold;
  }
  .text_danger {
    color : tomato;
  }
</style>

// HTML
<div id="componentClass">
  <my-component :class="{active : isActive}"></my-component>
</div>

// Script
Vue.component('my-component', {
  template : '<p class="foo bar">Hi</p>'
})
new Vue({
  el : '#componentClass',
  data : {
    isActive : true
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="componentClass">
    <my-component :class="{active : isActive}"></my-component>
  </div>
</div>
{:/}

## 인라인 스타일 바인딩

```javascript
// CSS
<style>
  .active {
    font-weight : bold;
  }
  .text_danger {
    color : tomato;
  }
</style>

// HTML
<div id="inlineStyle">
  <p :style="{color : activeColor, fontSize : fontSize+'px'}">인라인 스타일 바인딩</p>
  <p :style="styleObj">data 객체 스타일 바인딩</p>
  <div :style="[styleObj, styleObj2]">data 배열 스타일 바인딩</div>
</div>

// Script
new Vue({
  el : '#inlineStyle',
  data : {
    activeColor : 'green',
    fontSize : 30,
    styleObj : {
      color : 'blue',
      fontSize : '20px',
    },
    styleObj2 : {
      width : '100px',
      height : '100px',
    }
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="inlineStyle">
    <p :style="{color : activeColor, fontSize : fontSize+'px'}">인라인 스타일 바인딩</p>
    <p :style="styleObj">data 객체 스타일 바인딩</p>
    <div :style="[styleObj, styleObj2]">data 배열 스타일 바인딩</div>
  </div>
</div>
{:/}

## 실제 사용 예제
* Vue 프로젝트를 하면서, class를 동적으로 했던 경우

```javascript
// 예제1
<div id="app"
  :class="{overflowHidden : isPop || !isShownMain}"
  v-touch:start.passive="touchStart"
  v-touch:end.passive="touchEventReset"
  v-touch:moving.passive="touchMove"
  @mouseleave.passive="touchEventReset"
></div>

// 예제2
<span
  v-for="(file, index) of fileinfo"
  :key="'optionTab'+(index+1)"
  @click="optionTarget = index+1"
  :class="{target : optionTarget === index+1}"
>
  Video<%index+1%>
</span>
```

## 참조
[Vue.js 공식가이드 class&style](https://kr.vuejs.org/v2/guide/class-and-style.html)


<script>
new Vue({
  el : '#objClass',
  data : {
    isActive : true,
    hasError : false,
    instanceClass : {
      active : false,
      text_danger : true
    }
  },
  computed : {
    computedClass(){
      return {
        active : this.isActive,
        text_danger : this.hasError
      }
    }
  }
})

new Vue({
  el : '#arrClass',
  data : {
    acitveClass : 'active',
    errorClass : 'text_danger',
    isActive : false,
  }
})

Vue.component('my-component', {
  template : '<p class="foo bar">Hi</p>'
})
new Vue({
  el : '#componentClass',
  data : {
    isActive : true
  }
})


new Vue({
  el : '#inlineStyle',
  data : {
    activeColor : 'green',
    fontSize : 30,
    styleObj : {
      color : 'blue',
      fontSize : '20px',
    },
    styleObj2 : {
      width : '100px',
      height : '100px',
    }
  }
})
</script>

