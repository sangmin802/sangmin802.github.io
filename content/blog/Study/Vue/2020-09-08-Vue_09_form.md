---
title : "Vue 양식 입력 바인딩"
date : 2020-09-08 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 양식 입력 바인딩"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

# 양식 입력 바인딩
* v-model 디렉티브를 사용하여 폼 input과 textarea 엘리먼트에 양방향 데이터 바인딩을 생성할 수 있다.
* v-model은 내부적으로 서로 다른 속성을 사용하고, 서로 다른 입력요소에 대해 다른 이벤트를 전송한다.
1. text, textarea태그는 value 속성과 input 이벤트를 사용한다.
2. checkbox, radio는 checked속성과 change이벤트를 사용한다.
3. select는 value속성과 change이벤트를 사용한다.

## 문자열

```javascript
// HTML
<div id="text">
  <input type="text" v-model="text">
  <p>메시지 : <%text%></p>
</div>
// Script
new Vue({
  el : '#text',
  delimiters : ['<%', '%>'],
  data : {
    text : null
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="text">
    <input type="text" v-model="text">
    <p>메시지 : <%text%></p>
  </div>
</div>
{:/}

## 여러 줄을 가진 문장

```javascript
// HTML
<div id="textarea">
  <textarea v-model="textarea"></textarea>
  <p>메시지 : <%textarea%></p>
</div>
// Script
new Vue({
  el : '#textarea',
  delimiters : ['<%', '%>'],
  data : {
    textarea : null
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="textarea">
    <textarea v-model="textarea"></textarea>
    <p>메시지 : <%textarea%></p>
  </div>
</div>
{:/}

## 체크박스
* 하나의 체크박스는 단일 boolean값을 가진다.
* 여러개의 체크박스는 같은 배열을 바인딩 할 수 있다.

```javascript
// HTML
<div id="checkbox">
  <input type="checkbox" id="check" v-model="checked">
  <label for="check"><% checked %></label>
  <br>
  <input type="checkbox" id="sangmin" value="상민" v-model="checkedNames">
  <label for="sangmin">상민</label>
  <input type="checkbox" id="jichan" value="길동" v-model="checkedNames">
  <label for="jichan">길동</label>
  <input type="checkbox" id="wonbin" value="뺑덕" v-model="checkedNames">
  <label for="wonbin">뺑덕</label>
  <p><%checkedNames.join(', ')%></p>
</div>
// Script
new Vue({
  el : '#checkbox',
  delimiters : ['<%', '%>'],
  data : {
    checked : true,
    checkedNames : []
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="checkbox">
    <input type="checkbox" id="check" v-model="checked">
    <label for="check"><% checked %></label>
    <br>
    <input type="checkbox" id="sangmin" value="상민" v-model="checkedNames">
    <label for="sangmin">상민</label>
    <input type="checkbox" id="jichan" value="길동" v-model="checkedNames">
    <label for="jichan">길동</label>
    <input type="checkbox" id="wonbin" value="뺑덕" v-model="checkedNames">
    <label for="wonbin">뺑덕</label>
    <p><%checkedNames.join(', ')%></p>
  </div>
</div>
{:/}

## 라디오

```javascript
// HTML
<div id="radio">
  <input type="radio" id="45fps" value="45" v-model="FPS">
  <label for="45fps">45FPS</label>
  <input type="radio" id="60fps" value="60" v-model="FPS">
  <label for="60fps">60FPS</label>
  <p>FPS : <%FPS%></p>
</div>
// Script
new Vue({
  el : '#radio',
  delimiters : ['<%', '%>'],
  data : {
    FPS : null
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="radio">
    <input type="radio" id="45fps" value="45" v-model="FPS">
    <label for="45fps">45FPS</label>
    <input type="radio" id="60fps" value="60" v-model="FPS">
    <label for="60fps">60FPS</label>
    <p>FPS : <%FPS%></p>
  </div>
</div>
{:/}

## 셀렉트

```javascript
// HTML
<div id="select">
  <select v-model="selected">
    <option disabled>Please select one</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <p>Selected : <%selected%></p>
  <select v-model="selectedArr" multiple>
    <option v-for="option of options">
      <%option%>
    </option>
  </select>
  <p>Selected : <%selectedArr.join(', ')%></p>
</div>
// Script
new Vue({
  el : '#select',
  delimiters : ['<%', '%>'],
  data : {
    selected : 'Please select one',
    options : ['Chicken', 'Pizze', 'Hamburger'],
    selectedArr : []
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="select">
    <select v-model="selected">
      <option disabled>Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    <p>Selected : <%selected%></p>
    <select v-model="selectedArr" multiple>
      <option v-for="option of options">
        <%option%>
      </option>
    </select>
    <p>Selected : <%selectedArr.join(', ')%></p>
  </div>
</div>
{:/}

## 값 바인딩
* 라디오, 체크박스 및 셀렉트 옵션의 경우 v-model 바인딩 값은 보통 문자열 (체크박스는 boolean. 문자열로 해주고싶으면 value값 지정 혹은 true false일때의 값을 별도로 지정할 수 있다) 이다.

```javascript
// HTML
<div id="binding">
  <input type="radio" v-model="radioValue" :value="A">
  <p>radio 값 : <%radioValue%></p>
  <input type="checkbox" v-model="boolean" true-value="하겠습니다" false-value="안하겠습니다">
  <p>checkbox 값 : <%boolean%></p>
  <select v-model="selected">
    <option :value="upperLower">ABC</option>
  </select>
  <p>selected 값 : <%selected%></p>
</div>
// Script
new Vue({
  el : '#binding',
  delimiters : ['<%', '%>'],
  data : {
    radioValue : null,
    boolean : null,
    selected : null,
    A : '에이',
    upperLower : {upper : 'ABC', lower : 'abc'}
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="binding">
    <input type="radio" v-model="radioValue" :value="A">
    <p>radio 값 : <%radioValue%></p>
    <input type="checkbox" v-model="boolean" true-value="하겠습니다" false-value="안하겠습니다">
    <p>checkbox 값 : <%boolean%></p>
    <select v-model="selected">
      <option :value="upperLower">ABC</option>
    </select>
    <p>selected 값 : <%selected%></p>
  </div>
</div>
{:/}

## 수식어
1. .lazy
  * 기본적으로 v-model은 각 입력 이벤트 후 데이터를 동기화 합니다. .lazy수식어를 사용하여 change 이벤트 이후(입력이 종료되고, 다른 이벤트 실행시)에 동기화 할 수 있다.
2. .number
  * 문자열로 들어오기전 숫자열로 바꿔준다.
3. .trim
  * 자동으로 앞 뒤 공백을 지워준다

```javascript
// HTML
<div id="sub">
  <input type="text" v-model.lazy.trim="msg" @change="change">
  <p>msg : <%msg%></p>
  <input type="number" v-model.number="num">
  <p>type of : <%typeof num%></p>
</div>
// Script
new Vue({
  el : '#sub',
  delimiters : ['<%', '%>'],
  data : {
    msg : null,
    num : null,
  },
  methods : {
    change(){
      console.log(`입력완료 ${this.msg}`)
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="sub">
    <input type="text" v-model.lazy.trim="msg" @change="change">
    <p>msg : <%msg%></p>
    <input type="number" v-model.number="num">
    <p>type of : <%typeof num%></p>
  </div>
</div>
{:/}

## 참조
[Vue.js 공식가이드 양식 입력 바인딩](https://vuejs.org/v2/guide/forms.html)


<script>
new Vue({
  el : '#text',
  delimiters : ['<%', '%>'],
  data : {
    text : null
  }
})
new Vue({
  el : '#textarea',
  delimiters : ['<%', '%>'],
  data : {
    textarea : null
  }
})
new Vue({
  el : '#checkbox',
  delimiters : ['<%', '%>'],
  data : {
    checked : true,
    checkedNames : []
  }
})
new Vue({
  el : '#radio',
  delimiters : ['<%', '%>'],
  data : {
    FPS : null
  }
})
new Vue({
  el : '#select',
  delimiters : ['<%', '%>'],
  data : {
    selected : 'Please select one',
    options : ['Chicken', 'Pizze', 'Hamburger'],
    selectedArr : []
  }
})
new Vue({
  el : '#binding',
  delimiters : ['<%', '%>'],
  data : {
    radioValue : null,
    boolean : null,
    selected : null,
    A : '에이',
    upperLower : {upper : 'ABC', lower : 'abc'}
  }
})
new Vue({
  el : '#sub',
  delimiters : ['<%', '%>'],
  data : {
    msg : null,
    num : null,
  },
  methods : {
    change(){
      console.log(`입력완료 ${this.msg}`)
    }
  }
})
</script>

