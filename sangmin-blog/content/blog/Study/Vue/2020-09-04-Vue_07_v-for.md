---
title : "Vue 리스트 렌더링"
date : 2020-09-04 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 리스트 렌더링"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 

# 리스트 렌더링
## v-for
* v-for 디렉티브를 사용하여 배열을 기반으로 리스트 렌더링을 할 수 있다.
* item in items(item of items)형태의 특별한 문법이 필요하며, items는 원본 데이터의 배열이고 item은 반복되는 배열 엘리먼트의 별칭이다.
* 첫번째 인자로 해당 배열의 값을 받고, 두번째로 index값을 받는다.

```javascript
// HTML
<div id="vfor">
  <div v-for="({message}, index) of items">
    <%index%>_<%message%>
  </div>
</div>
// Script
new Vue({
  el : '#vfor',
  delimiters : ['<%', '%>'],
  data : {
    items : [
      {message : 'Foo'},
      {message : 'Bar'}
    ]
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="vfor">
    <div v-for="({message}, index) of items">
      <%index%>_<%message%>
    </div>
  </div>
</div>
{:/}

## v-for-object
* v-for를 활용하여 객체의 속성을 반복할 수 있다.
* 첫번째 인자로 값, 두번째 인자로 key를 조회할 수 있으며 세번째 인자로 index를 조회할 수 있다.

```javascript
// HTML
<div id="vforobject">
  <div v-for="(value, key, index) in object">
    <%index%>. <%key%> : <%value%>
  </div>
</div>
// Script
new Vue({
  el : '#vforobject',
  delimiters : ['<%', '%>'],
  data : {
    object : {
      title : 'How to do lists in Vue',
      author : 'Jane Doe',
      published : '2016-04-10'
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="vforobject">
    <div v-for="(value, key, index) in object">
      <%index%>. <%key%> : <%value%>
    </div>
  </div>
</div>
{:/}

## Maintaining State
* Vue에서 개별 DOM 노드들을 추적하고, 기존 엘리먼트를 재사용, 재 정렬 하기 위해서 v-for의 강 항목들에 고유한 key 속성을 제공해야 한다.
* 쉽게말해서, 사용자 정의 template을 만들 때, item of items의 하위 컴포넌트의 속성으로 전달되어 하위컴포넌트가 반복생성되야 할 할 경우(하위 컴포넌트가 v-for로부터 받은 item에게 의존할 때), key를 지정해줘야한다.
* 그냥 v-for 할 때 key를 해주는게 정석이다.

## 배열 변경 감지
* Vue는 감시중인 배열의 변이 메소드(push, pop, shift, splice 등등)를 래핑하여 다시 렌더링한다.

```javascript
// HTML
<div id="maintainingstate">
  <div v-for="({id, name, classValue}) of arr" :user_id="id" :key="id">
    name : <%name%> class : <%classValue%>
  </div>
  <button @click="reverse">reverse</button>
  <button @click="mainChar">본캐 찾기</button>
</div>
// Script
new Vue({
  el : '#maintainingstate',
  delimiters : ['<%', '%>'],
  data : {
    userData : {
      id : 'sangmin802',
      name : '박상민'
    },
    arr : [
      {id : 1, name : '모여요꿈동산', classValue : '바드'},
      {id : 2, name : '퐁메라니안', classValue : '서머너'},
      {id : 3, name : '한대만칠겡', classValue : '디스트로이어'},
    ]
  },
  methods : {
    reverse(){
      const newArr = [...this.arr].reverse(); // 최대한 immutable
      this.arr = newArr;
    },
    mainChar(){
      const newArr = [...this.arr].map(res => {
        return {...res} || [...res];
      });
      newArr.map(res => {
        if(res.id === 1){
          return res.name="★모여요꿈동산"
        }
      })
      this.arr = newArr;
    },
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="maintainingstate">
    <div v-for="({id, name, classValue}) of arr" :user_id="id" :key="id">
      name : <%name%> class : <%classValue%>
    </div>
    <button @click="reverse">reverse</button>
    <button @click="mainChar">본캐 찾기</button>
  </div>
</div>
{:/}

## 필터링 / 정렬된 결과 표시하기
* 때로는 원본 데이터를 변경하지 않고, 필터링된 버전이나 정렬된 버전을 표시해야할 필요가 있다. 이경우, computed를 이용할 수 있다.

## Range v-for
* v-for는 숫자를 사용할 수 있다. 템플릿을 특정 횟수만큼 반복할 때 사용한다.

```javascript
// HTML
<div id="computedArr">
  <div v-for="{id, name} of onSale" :key="id">
      <%id%>. <%name%>
  </div>
  <div>
    <span v-for="n of 10"><%n%></span>
  </div>
</div>
// Script
new Vue({
  el : '#computedArr',
  delimiters : ['<%', '%>'],
  data : {
    arr : [
      {id : 1, name : '사과', sale : true},
      {id : 2, name : '포도', sale : false},
      {id : 3, name : '오렌지', sale : false},
      {id : 4, name : '바나나', sale : true}
    ]
  },
  computed : {
    onSale(){
      const newArr = [...this.arr].filter(res => res.sale);
      return newArr;
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="computedArr">
    <div v-for="{id, name} of onSale" :key="id">
        <%id%>. <%name%>
    </div>
    <div>
      <span v-for="n of 10"><%n%></span>
    </div>
  </div>  
</div>
{:/}

## v-for과 v-if
* v-for는 v-if보다 높은 우선순의를 갖고있다. 즉, v-if는 v-for 루프가 반복될 때마다 실행되며, 일부 템플릿만 렌더링하려는 경우 유용하다.

```javascript
// HTML
<div id="vforvif">
  <div v-for="todo of todos" v-if="!todo.complete"><%todo.id%>. <%todo.text%></div>
</div>
// Script
new Vue({
  el : '#vforvif',
  delimiters : ['<%','%>']
  data : {
    todos : [
      {id : 1, text : 'Vue 공부하기', complete : false},
      {id : 2, text : 'JavaScript 공부하기', complete : true},
      {id : 3, text : 'React 공부하기', complete : true},
      {id : 4, text : 'TypeScript 공부하기', complete : false},
    ]
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="vforvif">
    <div v-for="todo of todos" v-if="!todo.complete"><%todo.id%>. <%todo.text%></div>
  </div>
</div>
{:/}

## v-for과 컴포넌트

```javascript
// HTML
<div id="vforcomponent">
  <my-component v-for="({id, name}, index) of items"
    :key="id"
    :id="id"
    :name="name"
  ></my-component>
</div>
// Script
Vue.component('my-component', {
  props : ['id', 'name'],
  delimiters : ['<%', '%>'],
  template : `
    <div>
      <%id%>. <%name%>
    </div>
  `
})
new Vue({
  el : '#vforcomponent',
  delimiters : ['<%', '%>'],
  data : {
    items : [
      {id : 1, name : '사과'},
      {id : 2, name : '포도'},
      {id : 3, name : '오렌지'},
      {id : 4, name : '바나나'}
    ]
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="vforcomponent">
    <my-component v-for="({id, name}, index) of items"
      :key="id"
      :id="id"
      :name="name"
    ></my-component>
  </div>
</div>
{:/}

## component, v-for를 활용한 todolist

```javascript
// HTML
<p>TodoList</p>
<div id="todoList">
  <form @submit.prevent="add">
    <input type="text" v-model="newTodo" placeholder="할 일을 적으세요">
    <input type="submit" value="등록하기">
  </form>
  <ul>
    <li
      // HTML DOM에서 ul태그의 자식으로는 li가 오는데, Todo태그를  직접넣으면 오류가 발생할 수 있으므로, li로 써준다음 is="Todo"라고 정의해준다. 해석하면, li는 Todo 입니다 이런식.
      is="Todo"
      v-for="({id, text}, index) of todoList"
      :remove="remove"
      :key="id"
      :id="id"
      :text="text"
    ></li>
  </ul>
</div>
// Script
Vue.component('Todo', {
  props : ['id', 'text', 'remove'],
  delimiters : ['<%', '%>'],
  template : `
    <li>
      <%id%>. <%text%>
      <button @click="remove(id)">지우기</button>
    </li>
  `
})
new Vue({
  el : '#todoList',
  delimiters : ['<%', '%>'],
  data : {
    newTodo : null,
    nextTodoId : 5,
    todoList : [
      {id : 1, text : 'Vue 공부하기'},
      {id : 2, text : 'JavaScript 공부하기'},
      {id : 3, text : 'React 공부하기'},
      {id : 4, text : 'TypeScript 공부하기'},
    ]
  },
  methods : {
    add(){
      const newTodoList = [...this.todoList];
      newTodoList.push({id : this.nextTodoId, text : this.newTodo});
      this.todoList = newTodoList;
      this.nextTodoId++;
      this.newTodo=null;
    },
    remove(_id){
      const newTodoList = [...this.todoList].filter(res => res.id!==_id);
      this.todoList = newTodoList;
    }
  }
})
```

### 결과값
{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <p>TodoList</p>
  <div id="todoList">
    <form @submit.prevent="add">
      <input type="text" v-model="newTodo" placeholder="할 일을 적으세요">
      <input type="submit" value="등록하기">
    </form>
    <ul>
      <li
        is="Todo"
        v-for="({id, text}, index) of todoList"
        :remove="remove"
        :key="id"
        :id="id"
        :text="text"
      ></li>
    </ul>
  </div>
</div>
{:/}

## 참조
[Vue.js 공식가이드 리스트 렌더링](https://kr.vuejs.org/v2/guide/list.html)


<script>
new Vue({
  el : '#vfor',
  delimiters : ['<%', '%>'],
  data : {
    items : [
      {message : 'Foo'},
      {message : 'Bar'}
    ]
  }
})

new Vue({
  el : '#vforobject',
  delimiters : ['<%', '%>'],
  data : {
    object : {
      title : 'How to do lists in Vue',
      author : 'Jane Doe',
      published : '2016-04-10'
    }
  }
})


new Vue({
  el : '#maintainingstate',
  delimiters : ['<%', '%>'],
  data : {
    userData : {
      id : 'sangmin802',
      name : '박상민'
    },
    arr : [
      {id : 1, name : '모여요꿈동산', classValue : '바드'},
      {id : 2, name : '퐁메라니안', classValue : '서머너'},
      {id : 3, name : '한대만칠겡', classValue : '디스트로이어'},
    ]
  },
  methods : {
    reverse(){
      const newArr = [...this.arr].reverse(); // 최대한 immutable
      this.arr = newArr;
    },
    mainChar(){
      const newArr = [...this.arr].map(res => {
        return {...res} || [...res];
      });
      newArr.map(res => {
        if(res.id === 1){
          return res.name="★모여요꿈동산"
        }
      })
      this.arr = newArr;
    },
  }
})


new Vue({
  el : '#computedArr',
  delimiters : ['<%', '%>'],
  data : {
    arr : [
      {id : 1, name : '사과', sale : true},
      {id : 2, name : '포도', sale : false},
      {id : 3, name : '오렌지', sale : false},
      {id : 4, name : '바나나', sale : true}
    ]
  },
  computed : {
    onSale(){
      const newArr = [...this.arr].filter(res => res.sale);
      return newArr;
    }
  }
})

new Vue({
  el : '#vforvif',
  delimiters : ['<%', '%>'],
  data : {
    todos : [
      {id : 1, text : 'Vue 공부하기', complete : false},
      {id : 2, text : 'JavaScript 공부하기', complete : true},
      {id : 3, text : 'React 공부하기', complete : true},
      {id : 4, text : 'TypeScript 공부하기', complete : false},
    ]
  }
})

Vue.component('my-component', {
  props : ['id', 'name'],
  delimiters : ['<%', '%>'],
  template : `
    <div>
      <%id%>. <%name%>
    </div>
  `
})
new Vue({
  el : '#vforcomponent',
  delimiters : ['<%', '%>'],
  data : {
    items : [
      {id : 1, name : '사과'},
      {id : 2, name : '포도'},
      {id : 3, name : '오렌지'},
      {id : 4, name : '바나나'}
    ]
  }
})

Vue.component('Todo', {
  props : ['id', 'text', 'remove'],
  delimiters : ['<%', '%>'],
  template : `
    <li>
      <%id%>. <%text%>
      <button @click="remove(id)">지우기</button>
    </li>
  `
})
new Vue({
  el : '#todoList',
  delimiters : ['<%', '%>'],
  data : {
    newTodo : null,
    nextTodoId : 5,
    todoList : [
      {id : 1, text : 'Vue 공부하기'},
      {id : 2, text : 'JavaScript 공부하기'},
      {id : 3, text : 'React 공부하기'},
      {id : 4, text : 'TypeScript 공부하기'},
    ]
  },
  methods : {
    add(){
      const newTodoList = [...this.todoList];
      newTodoList.push({id : this.nextTodoId, text : this.newTodo});
      this.todoList = newTodoList;
      this.nextTodoId++;
      this.newTodo=null;
    },
    remove(_id){
      const newTodoList = [...this.todoList].filter(res => res.id!==_id);
      this.todoList = newTodoList;
    }
  }
})
</script>

