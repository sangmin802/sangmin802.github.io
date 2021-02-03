---
title : "Vue 템플릿 문법"
date : 2020-08-31 00:00:02
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue Template Syntax"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 

# Template Syntax
* Vue.js는 렌더링 된 DOM을 기본 Vue 인스턴스의 데이터에 선언적으로 바인딩 할 수 있는 HTML 기반 템플릿 구문을 사용한다.

## 보간법
### 보간법 종류
1. 문자열
* 데이터 바인딩이 가진 기본형태는 이중중괄호`{}`를 사용한 텍스트 보간이다.
2. 원시 HTML `v-html`
* v-html은 태그를 그대로 읽어오기 때문에, 해커가 data로 직접접촉하여 바꾸게 되면 XSS에 매우 취약하기 때문에 사용하지 말자!
3. 속성
* `{}`는 HTML 속성에서 사용하는것이 아니다. 속성은 `v-bind` 디렉티브를 사용해야 한다.
4. JavaScript 표현식 사용
* 인라인에서 구문이나, 조건문등은 작동하지 않는다.

```javascript
// HTML
<div id="Interpolation">
  <p>문자열 : <%string%></p>
  <p>중괄호 사용 : <%HTML%></p>
  <p>v-html 사용 : <span v-html="HTML"></span></p>
  <p v-bind:class="bindProp">v-bind로 태그의 속성들 지정</p>
  <p>JavaScript를 포함한 중괄호1 <%count+1%></p>
  <p>JavaScript를 포함한 중괄호2 <%ok ? 'True' : 'False'%></p>
  <p v-bind:class="'list-'+count">JavaScript를 포함한 중괄호3 클래스변수</p>
  <p><%arr.find(res => res===3)%></p>
</div>

// Script
new Vue({
  el : '#Interpolation',
  delimiters : ['<%', '%>'],
  data : {
    string : '문자열 보간법',
    HTML : '<span style="color:red">This should be red.</span>',
    bindProp : 'bindProp',
    count : 0,
    ok : true,
    arr : [1,2,3,4]
  }
})
```
### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="Interpolation">
    <p>문자열 : <%string%></p>
    <p>중괄호 사용 : <%HTML%></p>
    <p>v-html 사용 : <span v-html="HTML"></span></p>
    <p v-bind:class="bindProp">v-bind로 태그의 속성들 지정</p>
    <p>JavaScript를 포함한 중괄호1 <%count+1%></p>
    <p>JavaScript를 포함한 중괄호2 <%ok ? 'True' : 'False'%></p>
    <p v-bind:class="'list-'+count">JavaScript를 포함한 중괄호3 클래스변수</p>
    <p><%arr.find(res => res===3)%></p>
  </div>
</div>
{:/}

## 디렉티브
* v-접두사가 있는 특수 속성이다. 디렉티브의 속성 값은 단일 JavaScript 표현식이 된다.

### 디렉티브 특징
1. 전달인자
* `v-bind`는 HTML의 속성을 갱신하는데 사용되며, DOM 이벤트를 수신하는 `v-on`이 있다.
2. 동적 전달인자
* JavaScript 표현식을 대괄호로 묶어 디렉티브의 인자로 사용하는것도 가능하다.(하단에 사용 예시있음)
3. 수식어
* 수식어는 점으로 표시되는 특수 접미사로, 디렉티브를 특별한 방법으로 바인딩 해야함을 나타낸다.
> `onSubmit.prevent` = `event.preventDefault()`

```javascript
// HTML
<div id="Directive">
  <p v-on:mouseover="seen = !seen">마우스를 올려보세요</p>
  <p v-if="seen">보여요</p>
  <p><a v-bind:href="naverUrl" target="_blank">네이버가기</a></p>
  <p><a v-bind:[url]="naverUrl" target="_blank">네이버가기</a></p>
  <form v-on:submit.prevent>
    <input type="submit" value="제출하지만, 막았음">
  </form>
</div>
// Script
new Vue({
  el : '#Directive',
  delimiters : ['<%', '%>'],
  data : {
    seen : true,
    naverUrl : 'https://www.naver.com/',
    url : 'href'
  },
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="Directive">
    <p v-on:mouseover="seen = !seen">마우스를 올려보세요</p>
    <p v-if="seen">보여요</p>
    <p><a v-bind:href="naverUrl" target="_blank">네이버가기</a></p>
    <p><a v-bind:[url]="naverUrl" target="_blank">네이버가기</a></p>
    <form v-on:submit.prevent>
      <input type="submit" value="제출하지만, 막았음">
    </form>
  </div>
</div>
{:/}

## 약어
* v-접두사는 템플릿의 Vue 특정 속성을 식별하기 위한 시각적인 신호 역할을 한다. 아주 유용하지만, 일부 자주 사용되는 디렉티브는 너무 지저분해진다고 느껴질 수 있다.
1. `v-bind` : `:`
2. `v-on` : `@`

## 예제
* 실제 Vue로 개인적으로 진행했던 프로젝트에서 사용했던 예제가 있다.

### 동적 속성 바인딩
* JavaScript를 통해, 특정 값을 받아와서 동적으로 디렉티브의 값을 지정해주는 방법이다.

```javascript
<span
    v-for="(file, index) of fileinfo"
    :key="'optionTab'+(index+1)" // key라는 속성에 동적으로 값을 바인딩함.
    @click="optionTarget = index+1"
    :class="{target : optionTarget === index+1}"
>
  Video<%index+1%>
</span>
```

### 사용자 지정 디렉티브
* 사용자가 직접 Vue의 디렉티브를 만드는 기능인데, 공문에 따로 기재되어있다. 정확한 사용방법은 공문을 보는걸 추천!

```javascript
// HTML
// 사용자 정의 디렉티브 생성후, 여러이벤트 동시처리
<label for="addFile" class="fileLabel"
  v-multidefault="{evt : ['dragenter', 'dragover', 'dragleave', 'drop']}"
  v-alldrop="{evt : ['dragleave', 'drop']}"

  :style="dragTarget"
>
  <%addfile%> 
</label>

// Script
// data객체와 동일한 위치에 있는 directives 속성이다.
directives : { // 사용자 설정 디렉티브
  multidefault : { // 다수의 이벤트 디폴트
    bind(el, {value : {evt}}, vnode){
      evt.forEach(res => {
        el.addEventListener(res, (e) => {
          vnode.context.dragTarget = {borderStyle : 'solid', color : '#999'};
          if(e.type==='dragover') vnode.context.dragTarget = {borderStyle : 'dashed', color : '#333'};
          e.preventDefault();
          e.stopPropagation();
        });
      });
    }
  },
  alldrop : { // 파일 드롭되었을 때
    bind(el, {value : {evt}}, vnode){
      evt.forEach(res => {
        el.addEventListener(res, ({dataTransfer : {files}}) => {
          vnode.context.shareFileValid(files);
        });
      });
    }
  }
}
```

## 참조
[Vue.js 공식가이드 템플릿 문법](https://kr.vuejs.org/v2/guide/syntax.html)


<script>
new Vue({
  el : '#Interpolation',
  delimiters : ['<%', '%>'],
  data : {
    string : '문자열 보간법',
    HTML : '<span style="color:red">This should be red.</span>',
    bindProp : 'bindProp',
    count : 0,
    ok : true,
    arr : [1,2,3,4]
  }
})

new Vue({
  el : '#Directive',
  delimiters : ['<%', '%>'],
  data : {
    seen : true,
    naverUrl : 'https://www.naver.com/',
    url : 'href'
  },
})
</script>

