---
title : "Vue 조건부 렌더링"
date : 2020-09-02 00:00:01
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 조건부 렌더링"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 

# 조건부 렌더링
* Vue에서는 v-if, v-else, v-else-if 디렉티브를 사용하여 조건부 렌더링을 할 수 있다.
## v-if
* v-if는 기준이 되는 하나의 엘리먼트에 추가되어야 한다. 하지만 추가하고싶지 않다면 최종 렌더링 결과에 추가되지 않는 `<template>`를 사용하면 된다.
> `React.Fragment`와 비슷한듯 함

### v-else
* v-else를 통해, v-if가 아닌 모든 경우에 대한 렌더링을 할 수 있다.

```javascript
// HTML
<div id="ifElse">
  <template v-if="ok">Yes</template>
  <template v-else>No</template>
</div>

// Script
new Vue({
  el : '#ifElse',
  data : {
    ok : true
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="ifElse">
    <template v-if="ok">Yes</template>
    <template v-else>No</template>
  </div>
</div>
{:/}

### v-else-if
* v-else-if를 통해, v-if가 아닌 조건을 생성할 수 있다.

```javascript
// HTML
<div id="ifElseIf">
  <button @click="menu = 1">menu1</button>
  <button @click="menu = 2">menu2</button>
  <button @click="menu = 3">menu3</button>
  <template v-if="menu === 1">
    <h1>Menu1</h1>
    <p>paragraph1</p>
    <p>paragraph2</p>
  </template>
  <template v-else-if="menu === 2">
    <h1>Menu2</h1>
    <p>paragraph1</p>
    <p>paragraph2</p>
  </template>
  <template v-else="menu === 3">
    <h1>Menu3</h1>
    <p>paragraph1</p>
    <p>paragraph2</p>
  </template>
</div>

// Script
new Vue({
  el : '#ifElseIf',
  data : {
    menu : 1
  }
})
```

### 결과값

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="ifElseIf">
    <button @click="menu = 1">menu1</button>
    <button @click="menu = 2">menu2</button>
    <button @click="menu = 3">menu3</button>
    <template v-if="menu === 1">
      <p>Menu1</p>
      <p>paragraph1</p>
      <p>paragraph2</p>
    </template>
    <template v-else-if="menu === 2">
      <p>Menu2</p>
      <p>paragraph1</p>
      <p>paragraph2</p>
    </template>
    <template v-else="menu === 3">
      <p>Menu3</p>
      <p>paragraph1</p>
      <p>paragraph2</p>
    </template>
  </div>
</div>
{:/}

## key를 이용한 재사용 가능 엘리먼트 제어
* Vue는 가능한 효율적으로 엘리먼트를 렌더링하기 위해 처음부터 렌더링하는것이 아닌 재활용을 한다.
* 완전 별개의 것으로, 재활용하지 않기 위해 key 속성을 사용한다

```javascript
// HTML
// key 속성을 지우면, 입력했을 때 그값이 계속 유지된다.
<div id="key">
  <template v-if="loginType === 'username'">
    <span>사용자 이름</span>
    <input type="text" placeholder="사용자 이름을 입력하세요" key="username">
  </template>
  <template v-else>
    <span>이메일</span>
    <input type="text" placeholder="이메일 주소를 입력하세요" key="email">
  </template>
  <p>
    <button @click="loginType = loginType === 'username' ? null : 'username'">로그인 유형 변경</button>
  </p>
</div>

// Script
new Vue({
  el : '#key',
  data : {
    loginType : 'username'
  }
})
```

### 결과값

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="key">
    <template v-if="loginType === 'username'">
      <span>사용자 이름</span>
      <input type="text" placeholder="사용자 이름을 입력하세요" key="username">
    </template>
    <template v-else>
      <span>이메일</span>
      <input type="text" placeholder="이메일 주소를 입력하세요" key="email">
    </template>
    <p>
      <button @click="loginType = loginType === 'username' ? null : 'username'">로그인 유형 변경</button>
    </p>
  </div>
</div>
{:/}

## v-show
* 엘리먼트를 조건부로 표시하기 위한 또 다른 옵션은 v-show디렉티브이다. 사용법은 거의 동일하다
* 차이점은 v-show가 있는 엘리먼트는 항상 렌더링되고 DOM에 남아있는다. 단순히 display css속성을 토글한다.

```javascript
// HTML
<div id="vshow">
  <p v-show="ok">안녕하세요!</p>
</div>

// Script
new Vue({
  el : '#vshow',
  data : {
    ok : true
  }
})
```

### 결과값

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="vshow">
    <p v-show="ok">안녕하세요!</p>
  </div>
</div>
{:/}

## v-if vs v-show
  1. `v-if` : 조건이 걸려있는 블럭 안의 이벤트 리스너와 자식 컴포넌트가 재활용가능한부분은 나두고 바뀌는 부분만 제거되었다 다시 만들어지기 때문에, 진짜 조건부 렌더링을 한다. 따라서, 초기에는 빠르지만, 조건이 바뀔때마다 새롭게 렌더링 하므로 부담이 간다.
  2. `v-show` : 렌더링은 모두 한다음, 조건에 해당되는 부분만 displa : block으로 노출시킨다. 따라서 초기에만 시간이 걸리고, 이후에는 부담이없다.

## v-if와 v-for
* `v-if`, `v-for` 함께 사용하는 경우, `v-for`는 `v-if`보다 높은 우선순위를 갖는다(리스트렌더링에서 자세히 다룸)

## v-if 사용중 치명적 문제 예제
### 문제발생
본래, http통신 로딩중이되면 $emit을 통해 `OptionsComponent`를 안보이도록 v-if가 false가 되도록 했었는데, 그렇게되다보니 아예 해당 컴포넌트가 사라지게되면서 자식으로 보내진 이벤트가 모두 없어지게되어 $emit이 작동되지 않더라.
### 해결
따라서, 그냥 css만 변경해주는 방법으로 진행했었다. v-show로도 해봤는데, undefined에러를 막을수가 없었다.

```javascript
// parent component 옵션팝업 컴포넌트 부분
<OptionsComponent
  class="optionPopup"
  v-if="optionPopup"

  :style="{display}"
  :filetype="compNav"
  :fileinfo="fileInfo"
  @offoptionpop="optionPopup=false"
  @callalert="onAlert"
  @setgiffiles="getGifFiles"
  @gifing="gifIng=!gifIng"
  @hideoption="hideOption"
  v-touchstop
>
</OptionsComponent>

// child component http통신 부분
axios.post(url, AjaxObj)
.then(({data}) => {
  this.$emit('setgiffiles', data); // 부모 data에 gif파일들 전달
})
.catch(err => {
  const {response} = err;
  if(!response){
    this.$emit('callalert', err, 'httpError');
  }else{
    const {status} = response;
    if(status===400){
      data['err_message']==='overTotalLength' ?
        this.$emit('callalert', null, 'overTotalLength')
      :
        this.$emit('callalert', data['err_message'], 'ajaxError')
    }else{
      this.$emit('callalert', err, 'httpError');
    }
  }
  this.$emit('gifing');
  this.$emit('hideoption'); // 옵션팝업, bg 다시생성
});
```

## 참조
[Vue.js 공식가이드 조건부 렌더링](https://kr.vuejs.org/v2/guide/conditional.html)


<script>
new Vue({
  el : '#ifElse',
  data : {
    ok : true
  }
})
new Vue({
  el : '#ifElseIf',
  data : {
    menu : 1
  }
})
new Vue({
  el : '#key',
  data : {
    loginType : 'username'
  }
})

new Vue({
  el : '#vshow',
  data : {
    ok : true
  }
})
</script>

