---
title : "Vue 이벤트 처리"
date : 2020-09-07 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 이벤트 처리"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<style>
  .set {
    width : 100%;
    height : 500px;
  }
</style>

# 이벤트 처리
## 이벤트 청취
* v-on (@) 디렉티브를 사용하여 DOM 이벤트를 듣고, 트리거 될 때 JavaScript를 실행할 수 있다.

```javascript
// HTML
<div id="event1">
  <button @click="counter++">Add</button>
  <p>총 클릭 횟수는 <%counter%>번 입니다.</p>
</div>
// Script
new Vue({
  el : '#event1',
  delimiters : ['<%', '%>'],
  data : {
    counter : 0
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event1">
    <button @click="counter++">Add</button>
    <p>총 클릭 횟수는 <%counter%>번 입니다.</p>
  </div>
</div>
{:/}

## 메소드 이벤트 핸들러
* 많은 이벤트 핸들러의 로직은 더 복잡할 것이므로, JavaScript를 v-on 속성값으로 보관하는 인라인 이벤트는 간단하지 않다. 이때문에, 메소드의 이름을 받는다.

```javascript
// HTML
<div id="event2">
  <button @click="greet">Greet</button>
</div>
// Script
new Vue({
  el : '#event2',
  delimiters : ['<%', '%>'],
  data : {
    name : 'Vue.js'
  },
  methods : {
    greet(){
      alert(`Hello, ${this.name}!`);
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event2">
    <button @click="greet">Greet</button>
  </div>
</div>
{:/}

## 인라인 메소드 핸들러
* 매개변수를 전달할 수 있다.
* 매개변수를 지정하지 않을 때에는 인스턴스의 methods에서 e를 통해 직접조회 가능하지만, 아닐경우 `$event`를 통해 조회할 수 있다.

```javascript
// HTML
  <div id="event3">
    <button @click="say('Hi', $event)">Hi</button>
    <button @click="say('Hello', $event)">Hello</button>
  </div>
// Script
new Vue({
  el : '#event3',
  delimiters : ['<%', '%>'],
  methods : {
    say(text, e){
      alert(`${text}! Event Type is ${e.type}`);
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event3">
    <button @click="say('Hi', $event)">Hi</button>
    <button @click="say('Hello', $event)">Hello</button>
  </div>
</div>
{:/}

## 이벤트 수식어
* 이벤트 핸들러 내부에서 event.preventDefault() 또는 event.stopPropagation()을 호출하는 것은 매우 보편적인 일이다. 이것을 더 편리하게 사용할 수 있도록, v-on이벤트에서는 이벤트 수식어를 제공한다.(여러개 연달아 사용도 가능)
1. .stop : 이벤트 전파를 중지(자신의 영역을 포함하고있는 부모의 메소드를 받지 않음)
2. .prevent : 고유 이벤트 제거(대표적으로 페이지 리로드 차단)
3. .capture : 하위 엘리먼트보다 먼저 이벤트 호출(기본적으로는 버블링으로 자식의 이벤트 먼저 실행하지만, 해당 선언으로 부모의 이벤트가 먼저 실행되도록 함. 근데 쓸 일 없을듯)
4. .self : 오직 자신에게 바인딩된 이벤트만 처리(약간 stop과 다르게, 자식이 부모의 이벤트를 받는게아닌 부모가 이벤트를 안주는느낌. 캡처링 차단?)
5. .once : 한번만 실행됨. 이후 요청은 싹 다 무시
6. .passive : 해당 이벤트의 기본동작과 바인딩된 이벤트를 동시실행(어케 써야하는지 잘 모르겠음..)


```javascript
// HTML
<div id="event4">
  <div class="parent" @click="parent">
    부모
    <div class="child" @click.stop="child">자식</div>
  </div>
  <br>
  <form @submit.prevent>
    <input type="submit" value="제출">
  </form>
  <br>
  <div class="parent" @click.self="parent">
    부모
    <div class="child" @click="child">자식</div>
  </div>
  <br>
  <div class="parent" @click.capture="parent">
    부모
    <div class="child" @click="child">자식</div>
  </div>
  <br>
  <div class="parent" @click.once="parent">
    부모
    <div class="child" @click="child">자식</div>
  </div>
  <br>
  <div class="set" :style="{'background' : `rgba(0,0,${last})`}" @wheel="scroll">
  </div>
</div>
// Script
new Vue({
  el : '#event4',
  delimiters : ['<%', '%>'],
  data : {
    last : 0
  },
  methods : {
    parent(){
      alert('I am parent method')
    },
    child(){
      alert('I am child method')
    },
    scroll(e){
      this.last++;
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event4">
    <div class="parent" @click="parent">
      부모
      <div class="child" @click.stop="child">자식</div>
    </div>
    <br>
    <form @submit.prevent>
      <input type="submit" value="제출">
    </form>
    <br>
    <div class="parent" @click.self="parent">
      부모
      <div class="child" @click="child">자식</div>
    </div>
    <br>
    <div class="parent" @click.capture="parent">
      부모
      <div class="child" @click="child">자식</div>
    </div>
    <br>
    <div class="parent" @click.once="parent">
      부모
      <div class="child" @click="child">자식</div>
    </div>
    <br>
    <div class="set" :style="{'background' : `rgba(0,0,${last})`}" @wheel="scroll">
    </div>
  </div>
</div>
{:/}

## 키 수식어
* 키보드 이벤트를 청취할 때, 종종 키 코드를 확인해야 한다. 키코드 수식어를 추가할 수 있다.
1. Key Codes
  * `@keyup.13` 과같이 키코드를 직접 등록할 수 있다.
2. 여러개를 동시입력을 통해 이벤트를 호출할 수 있다.
  * `@keyup.alt.67` -> Alt+c를 동시에 놓았을 때
3. exact
  * 다른 시스템 수식어와 조합해 그 핸들러가 실행되기 위해 정확한 조합이 눌려야 한다.

```javascript
// HTML
<div id="event5">
  <input type="text" @keyup.enter="enter" placeholder="enter">
  <input type="text" @keyup.page-down="pageDown" placeholder="page-down">
  <input type="text" @keyup.alt.67="alt67" placeholder="alt67">
  <button @click.ctrl="withCtrl">ctrl눌려있어야 실행</button>
  <button @click.ctrl.exact="onleCtrl">ctrl만눌려있어야 실행</button>
  <button @click.exact="nokey">아무키도 안눌려있어야</button>
</div>
// Script
new Vue({
  el : '#event5',
  delimiters : ['<%', '%>'],
  methods : {
    enter(){
      alert('enter')
    },
    pageDown(){
      alert('pageDown')
    },
    alt67(){
      alert('alt67')
    },
    withCtrl(){
      alert('withCtrl');
    },
    onleCtrl(){
      alert('onlyCtrl');
    },
    nokey(){
      alert('nokey');
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event5">
    <input type="text" @keyup.enter="enter" placeholder="enter">
    <input type="text" @keyup.page-down="pageDown" placeholder="page-down">
    <input type="text" @keyup.alt.67="alt67" placeholder="alt67">
    <button @click.ctrl="withCtrl">ctrl눌려있어야 실행</button>
    <button @click.ctrl.exact="onleCtrl">ctrl만눌려있어야 실행</button>
    <button @click.exact="nokey">아무키도 안눌려있어야</button>
  </div>
</div>
{:/}

## 마우스 수식어
* 보드처럼 마우스 또한, left, right, middle을 조회할 수 있다.

```javascript
// HTML
<div id="event6">
  <button @click.left="left">좌클릭</button>
  <button @click.right="right">우클릭</button>
  <button @click.middle="middle">휠클릭</button>
</div>
// Script
new Vue({
  el : '#event6',
  delimiters : ['<%', '%>'],
  methods : {
    left(){
      alert('left')
    },
    right(){
      alert('right')
    },
    middle(){
      alert('middle')
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="event6">
    <button @click.left="left">좌클릭</button>
    <button @click.right="right">우클릭</button>
    <button @click.middle="middle">휠클릭</button>
  </div>
</div>
{:/}

## 참조
[Vue.js 공식가이드 이벤트 처리](https://vuejs.org/v2/guide/events.html)


<script>
new Vue({
  el : '#event1',
  delimiters : ['<%', '%>'],
  data : {
    counter : 0
  }
})

new Vue({
  el : '#event2',
  delimiters : ['<%', '%>'],
  data : {
    name : 'Vue.js'
  },
  methods : {
    greet(){
      alert(`Hello, ${this.name}!`);
    }
  }
})

new Vue({
  el : '#event3',
  delimiters : ['<%', '%>'],
  methods : {
    say(text, e){
      alert(`${text}! Event Type is ${e.type}`);
    }
  }
})

new Vue({
  el : '#event4',
  delimiters : ['<%', '%>'],
  data : {
    last : 0
  },
  methods : {
    parent(){
      alert('I am parent method')
    },
    child(){
      alert('I am child method')
    },
    scroll(e){
      this.last++;
    }
  }
})

new Vue({
  el : '#event5',
  delimiters : ['<%', '%>'],
  methods : {
    enter(){
      alert('enter')
    },
    pageDown(){
      alert('pageDown')
    },
    alt67(){
      alert('alt67')
    },
    withCtrl(){
      alert('withCtrl');
    },
    onleCtrl(){
      alert('onlyCtrl');
    },
    nokey(){
      alert('nokey');
    }
  }
})

new Vue({
  el : '#event6',
  delimiters : ['<%', '%>'],
  methods : {
    left(){
      alert('left')
    },
    right(){
      alert('right')
    },
    middle(){
      alert('middle')
    }
  }
})
</script>

