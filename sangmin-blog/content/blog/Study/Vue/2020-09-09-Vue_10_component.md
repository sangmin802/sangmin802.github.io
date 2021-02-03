---
title : "Vue 컴포넌트"
date : 2020-09-09 00:00:00
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue 컴포넌트"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<style>
  .tomato {
    color : tomato;
  }
</style>

# 컴포넌트
* 기존 HTML 엘리먼트를 확장하여 재사용 가능한 코드를 캡슐화하는 데 도움이 된다. 경우에 따라 특별한 is 속성으로 확장된 원시 HTML 엘리먼트로 나타낼 수 있다.
*  Vue 컴포넌트는 Vue 인스턴스 이기도 한다. 그러므로 대부분의 옵션을 사용할 수 있다.

## 컴포넌트 사용하기
* 컴포넌트 명으로 지정한 태그에 template에 지정한 태그로 교체됨

### 전역등록
* 모든 인스턴스에서 사용 가능하다.

```javascript
// HTML
<div id="component1">
  <my-component></my-component>
</div>
// Script
Vue.component('my-component', {
  template : `
    <div>사용자 정의 전역 component 입니다</div>
  `
})
new Vue({
  el : '#component1',
}) 
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="component1">
    <my-component></my-component>
  </div>
</div>
{:/}

### 지역등록
* 해당 인스턴스에서만 사용할 수 있다.

```javascript
// HTML
<div id="component2">
  <my-component></my-component>
</div>
// Script
const component2 = {
  template : `
    <div>사용자 정의 지역 component 입니다</div>
  `
}
new Vue({
  el : '#component2',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : component2
  }
}) 
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="component2">
    <my-component></my-component>
  </div>
</div>
{:/}

### DOM 템플릿 구문 분석 경고를 위한 is
* DOM을 템플릿으로 사용할 때 ul, ol, table, select와 같은 일부 엘리먼트들은 자식 엘리먼트를 갖는데 제한사항이 있다.
* 해당 태그에 기존방식처럼 template으로 지정한 태그를 넣게되면, 렌더링시 에러를 발생시킨다. 이를 해결하기위해 is 특수속성을 사용한다.

```javascript
// HTML
<ul id="component3">
  <li is="my-component"></li>
</ul>
// Script
const component3 = {
  template : `<li>특수속성 is</li>`
}
new Vue({
  el : '#component3',
  components : {
    'my-component' : component3
  }
}) 
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <ul id="component3">
    <li is="my-component"></li>
  </ul>
</div>
{:/}

### data는 반드시 함수여야 한다.
* DOM을 템플릿으로 사용할 때 ul, ol, table, select와 같은 일부 엘리먼트들은 자식 엘리먼트를 갖는데 제한사항이 있다.
* 해당 태그에 기존방식처럼 template으로 지정한 태그를 넣게되면, 렌더링시 에러를 발생시킨다. 이를 해결하기위해 is 특수속성을 사용한다.

```javascript
// HTML
<div id="component4">
  <my-component></my-component>
  <my-component></my-component>
  <my-component></my-component>
</div>
// Script
const component4 = {
  delimiters : ['<%', '%>'],
  template : `<button @click="counter++"><%counter%></button>`,
  data(){
    return {
      counter : 0
    }
  }
}
new Vue({
  el : '#component4',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : component4
  },
}) 
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="component4">
    <my-component></my-component>
    <my-component></my-component>
    <my-component></my-component>
  </div>
</div>
{:/}

## 컴포넌트 작성
* 컴포넌트는 부모-자식 관계에서 가장 일반적으로 함께 사용하기 위한 것이며, 필연적으로 서로 의사소통이 필요하다.

### Props
* React처럼 부모는 자식에게 props값들을 보내고, 자식은 그 props중의 이벤트(`$emit`)를 활용해서 부모에게 알린다.
* camelCase vs kebab-case
  * HTML 속성은 대소문자를 구분하지 않기 때문에, 대문자가아닌 -를 사용하자.

* 만약 초기에 보내진 props의 값을 수정하고 싶다면?
  * data 메소드를 통해 자신만의 data 값으로 만들고, 그것을 수정/적용한다. 단, 객체나 배열을 변경할 경우, 참조라는 특성때문에 부모의 것도 바뀔 수 있으니 복사해서 사용하자

```javascript
// HTML
<div id="props1">
  <props 
  :message="message"
  :obj="obj"
  ></props>
</div>
// Script
new Vue({
  el : '#props1',
  delimiters : ['<%', '%>'],
  data : {
    message : 'Props 전달!',
    obj : {
      text : '객체전달!',
      boolean : false
    }
  },
  components : {
    delimiters : ['<%', '%>'],
    props : {
      props : ['message', 'obj'],
      template : `<div><%message%>,<%obj.text%>,<%obj.boolean%></div>`
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="props1">
    <props 
    :message="message"
    :obj="obj"
    ></props>
  </div>
</div>
{:/}

```javascript
// HTML
<div id="props2">
  <props 
  :num="num"
  ></props>
</div>
// Script
new Vue({
  el : '#props2',
  delimiters : ['<%', '%>'],
  data : {
    num : 30
  },
  components : {
    props : {
      props : ['num'],
      template : `<button @click="math" :class="{tomato : childNum===15}"><%childNum%></button>`,
      data(){
        return {
          childNum : this.num
        }
      },
      methods : {
        math(){
          this.childNum = this.childNum/2;
        }
      }
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="props2">
    <props 
    :num="num"
    ></props>
  </div>
</div>
{:/}

### Prop 검증
* 컴포넌트가 받는 prop에 대한 요구사항을 지정할 수 있다. 요구사항이 충족되지 않을경우, 경고를 보낸다. 근데 출력은 되네..?
* props속성을 문자열로 구성된 배열이 아닌 유효성 검사 요구사항이 있는 객체를 사용해야한다.
* props 검증은, 컴포넌트 인스턴스가 생성되기 전에 실행되므로, methods, computed와 같은 속성을 사용할 수 없다.

```javascript
// HTML
<div id="props3">
  <props 
    :propa="propA"
    :propb="propB"
    :propc="propC"
    :propd="propD"
    :prope="propE"
    :propf="propF"
  ></props>
</div>
// Script
new Vue({
  el : '#props3',
  delimiters : ['<%', '%>'],
  data : {
    propA : 30,
    propB : '문자열과 숫자열 가능',
    propC : '문자열이여야하고 꼭 필요',
    propD : 80,
    propE : {id : 1, text : '객체이고, 기본값은 메소드로 반환'},
    propF : 8
  },
  components : {
    props : {
      props : {
        // 기본단일타입
        propa : Number,
        // 여러개 가능한 타입
        propb : [String, Number],
        // 문자열이여야하며 꼭 필요함
        propc : {
          type : String,
          required : true
        },
        // 숫자타입이여아하며 기본값이 있음
        propd : {
          type : Number,
          default : 100
        },
        // 객체타입이며, 기본객체는 메소드를 통해 반환됨
        prope : {
          type : Object,
          default(){
            return {message : 'default'}
          }
        },
        // 사용자 정의 검사기능
        propf : {
          validator(value){
            return value > 10
          }
        }
      },
      template : `
        <div><%propa%>, <%propb%>, <%propc%>, <%propd%>, <%prope%>, <%propf%></div>
      `
    },
  }
});
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="props3">
    <props 
      :propa="propA"
      :propb="propB"
      :propc="propC"
      :propd="propD"
      :prope="propE"
      :propf="propF"
    ></props>
  </div>
</div>
{:/}

## Props가 아닌 속성
### Props 검증
1. 존재하는 속성 교체/병합
  * 만일, template이 type="date"라는 속성을 갖고있는데, 부모 태그에게서 type="large"를 전달받게된다면 type의 값은 large로 바뀔것이다. 그럼 에러가 생길것!(다행이, css는 두개 합쳐짐)

2. v-on을 이용한 사용자 지정 이벤트
  * $on(eventName)을 사용하여 이벤트를 감지한다
  * $emit(eventName)을 사용하여 이벤트를 트리거한다
  * 부모컴포넌트는 자식컴포넌트의 템플릿에서 직접 v-on을 사용하여 자식컴포넌트에서 실행된 이벤트를 감지할 수 있다.
  * $on은 자식에서 실행된 이벤트를 감지하지 못하며, v-on을 템플릿에 반드시 지정해줘야 한다.

3. 자식컴포넌트에 보내진 사용자 지정 이벤트(커스텀이벤트)가 아닌, 진짜 그냥 부모의 이벤트를 실행시키고자 할 때 .native를 붙인다.

* 간단 설명
  1. 컴포넌트는 @이벤트명="실행되는 메소드" 를 통해 커스텀이벤트를 즉시제작함. 해당 커스텀이벤트는 부모의 메소드를 호출함
  2. 자식컴포넌트의 template에서 이벤트가 실행될 때 마다, this.$emit으로 컴포넌트에 지정된 커스텀이벤트를 실행시킴(해당 커스텀이벤트는 부모의 메소드를 호출하는것)(dispatchEvent 트리거 같은 역할)
  3. 고맙게도. $emit의 두번째 이후 인자로, 자식 컴포넌트의 data값을 매개변수로 보낼수 있으며, 커스텀 이벤트로 연결된 부모의 메소드 인자로 받는다.

```javascript
// HTML
<div id="customEvent">
  <p><%total%></p>
  <button-counter
    @increment="incrementTotal"
    @click.native="nativeEvent"
    :num="total"
  ></button-counter>
  <button-counter
    @increment="incrementTotal"
    @click.native="nativeEvent"
    :num="total"
  ></button-counter>
</div>
// Script
new Vue({
  el : '#customEvent',
  delimiters : ['<%', '%>'],
  data : {
    total : 0
  },
  methods : {
    incrementTotal(text){
      alert(text)
      this.total++;
    },
    nativeEvent(){
      alert('커스텀이벤트가 아니라 진짜 그냥 눌렀을 때 실행되는 부모의 메소드')
    }
  },
  components : {
    'button-counter' : {
      props : ['num', 'setparaentdata'],
      template : `
        <button @click="incrementCounter"><%counter%></button>
      `,
      data(){
        return {
          counter : this.num
        }
      },
      methods : {
        incrementCounter(){
          this.counter++;
          const childCount = this.counter;
          this.$emit('increment', childCount)
        }
      }
    },
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="customEvent">
    <p><%total%></p>
    <button-counter
      @increment="incrementTotal"
      @click.native="nativeEvent"
      :num="total"
    ></button-counter>
    <button-counter
      @increment="incrementTotal"
      @click.native="nativeEvent"
      :num="total"
    ></button-counter>
  </div>
</div>
{:/}

### .sync
* 자식 컴포넌트의 .sync 수식어를 붙인 속성은 부모와 양방향 바인딩이되어, 자식 컴포넌트의 값을 변경하면 부모도 변경된다.
* 자식컴포넌트에서 해당 값을 data로 설정해 줄 필요 없으며, 변경 요청시 update:속성명으로 설정한다.

```javascript
// HTML
<div id="sync">
  <%text%>
  <child
    :text.sync="text"
  ></child>
</div>
// Script
new Vue({
  el : '#synctest',
  delimiters : ['<%', '%>'],
  data : {
    text : 'Hello'
  },
  components : {
    child : {
      props : ['text'],
      delimiters : ['<%', '%>'],
      template : `
        <button @click="change"><%text%></button>
      `,
      methods : {
        change(){
          this.$emit('update:text', 'Hi')
        }
      }
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="synctest">
    <%text%>
    <child
      :text.sync="text"
    ></child>
  </div>
</div>
{:/}

### 사용자 정의 이벤트를 사용하여 폼 입력 컴포넌트 만들기
* 커스텀이벤트는 v-model 에서 작동하는 커스텀입력을 만드는데에도 사용할 수 있다.
* 기존 v-model은 value 속성과 input 이벤트를 함께 사용하는것같다. 즉, input 이벤트가 발생했을 때, value의 값을 변경하는 것.

```javascript
// HTML
<div id="sync">
  <div id="v-model1">
    <custom-input
      v-model="text"
    ></custom-input>
    <%text%>
  </div>
</div>
// Script
// v-model을 갖는 컴포넌트의 인스턴스는 template에 :value로 부모로부터 v-model로 보내진 값을 초기값으로 설정하며, 
// @input이라는 커스텀이벤트를 생성할 수 있는데, 해당 커스텀이벤트로 input의 value를 조회하여 부모에게 방출해줄 수 있다.
new Vue({
  el : '#v-model1',
  delimiters : ['<%', '%>'],
  data : {
    text : '초기값'
  },
  components : {
    'custom-input' : {
      props : ['value'],
      template : `
        <input type="text"
          :value="value" 
          @input="$emit('input',$event.target.value)"
        >
      `,
      methods : {
        inputEvent(value){
          this.$emit('input', value)
        }
      }
    },
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="v-model1">
    <custom-input
      v-model="text"
    ></custom-input>
    <%text%>
  </div>
</div>
{:/}

### 컴포넌트의 사용자 정의 v-model
* 대부분 컴포넌트의 v-model은 value를 input의 초기값으로 사용하고, 사용자정의이벤트 input을 사용하지만, 체크박스나 라디오버튼과 같은 일부타입은 다른목적으로 value 속성을 사용할 수 있다.
* model옵션을 사용하면 충돌을 피할 수 있다.

```javascript
// HTML
<div id="v-model2">
  <checkbox
    v-model="boolean"
  >
  </checkbox>
  <%boolcheck%>
</div>
// Script
new Vue({
  el : '#v-model2',
  delimiters : ['<%', '%>'],
  data : {
    boolean : true
  },
  computed : {
    boolcheck(){
      return this.boolean ? '하겠습니다' : '하지않겠습니다'
    }
  },
  components : {
    checkbox : {
      model : {
        prop : 'checkbool', // v-model로 받는 값
        event : 'change' // 사용자지정 이벤트는 기본 input이자만 change로 하겠음
      },
      props : {
        checkbool : Boolean,
      },
      template : `
        <input 
          type="checkbox"
          :checked="checkbool"
          @change="change($event.target.checked)"
        >
      `,
      methods : {
        change(value){
          this.$emit('change', value)
        }
      }
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="v-model2">
    <checkbox
      v-model="boolean"
    >
    </checkbox>
    <%boolcheck%>
  </div>
</div>
{:/}

### 관련이 없는 컴포넌트간 통신
* 비어있는 Vue 인스턴스를 통해 중앙 이벤트 버스로 사용할 수 있다.
* 이벤트를 방출하는 컴포넌트에서 $emit, 받는 컴포넌트에서 $on을 정의해놓는다.
* 보다 복잡한 경우, 상태관리패턴(vuex?)을 사용해야한다.

```javascript
// HTML
<div id="exportmethod">
  <button @click="exportMethod">이벤트 내보내기</button>
</div>
<div id="importmethod">
</div>
// Script
const bus = new Vue()
new Vue({
  el : '#exportmethod',
  delimiters : ['<%', '%>'],
  methods : {
    exportMethod(){
      bus.$emit('exportedEvent', 1)
    }
  }
})
new Vue({
  el : '#importmethod',
  delimiters : ['<%', '%>'],
  created(){
    bus.$on('exportedEvent', (num) => {
      alert(num)
    })
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="exportmethod">
    <button @click="exportMethod">이벤트 내보내기</button>
  </div>
  <div id="importmethod">
  </div>
</div>
{:/}

## 슬롯을 사용한 컨텐츠 배포
* 슬롯은 컴포넌트의 재사용성을 높이기 위한 기능이다.

### 범위 컴파일
 * 상위 템플릿(DOM)의 모든 내용은 상위 범위에서 컴파일 되며, 하위 템플릿의 모든 내용은 하위 범위에서 컴파일 된다.
  > 즉, 컴포넌트에 v-show나 v-if등 디렉티브로 어떤 속성을 묶었을 때, 해당 속성이 상위 범위의 속성이면 작동하지만, 해당 하위컴포넌트 고유의 속성이면 작동되지 않습니다. 왜냐, 상위범위에서부터 렌더링 하는데, 상위범위는 하위컴포넌트의 속성을 알지 못하기 때문이다.

### 단일슬롯
* 하위 컴포넌트 템플릿에 최소한 하나의 `<slot>` 콘텐츠가 포함되어있지 않으면, 부모컨텐츠는 삭제된다.
* `<slot>` 태그 안의 내용은 대체콘텐츠로 간주되며, 대체콘텐츠는 하위 범위에서 컴파일 되고 호스팅 엘리먼트가 비어있어 삽입할 콘텐츠가 없는 경우에만 표시됩니다.
* 쉽게 정리.
  * 컴포넌트 template에서 `<slot>`태그는 자신의 부모영역에서 컴포넌트 태그 내부에 컨텐츠를 만들었을 때 해당 컨텐츠들을 유지하기 위해서 존재하는 태그이다.
  * 만약, `<slot>`태그가 없다면, 부모영역에서 생성된 컨텐츠들은 제거되고, `<slot>`태그는 있는데, 부모영역에서 생성된 컨텐츠들이 없다면 해당 컴포넌트의 템플릿 내부 `<slot>`태그의 기본값이 노출된다.(v-if의 경우도 동일 적용됨. 단, v-show는 display : none의 형식이므로, 모두 노출안됨. 슬롯은 부모영역의 컨텐츠가 존재하기때문에 안보이고, 컨텐츠는 그냥 스타일상 안보이기때문)

* 2.6 업데이트로 slot, slot-scope가 삭제되고 v-slot:(#)으로 통합되었다.
  * 해당 속성은 꼭 template 안에 있어야 하며, `v-slot:(슬롯name)="slot-scope된 값"` 이렇게 한번에 입력할 수 있게 되었다.

```javascript
// HTML
<div id="slot1">
  <p>부모 컴포넌트 제목</p>
  <my-component>
    <p v-if="isShow">원본 컨텐츠</p>
    <p v-if="isShow">원본 중 추가 컨텐츠</p>
  </my-component>
</div>
// Script
new Vue({
  el : '#slot1',
  delimiters : ['<%', '%>'],
  data : {
    isShow : false
  },
  components : {
    'my-component' : {
      template : `
      <div>
        <p>나는 자식 컴포넌트의 제목입니다</p>
        <slot>
          제공된 컨텐츠가 없는 경우에만 보실 수 있습니다.
        </slot>
      </div>
      `
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="slot1">
    <p>부모 컴포넌트 제목</p>
    <my-component>
      <p v-if="isShow">원본 컨텐츠</p>
      <p v-if="isShow">원본 중 추가 컨텐츠</p>
    </my-component>
  </div>
</div>
{:/}

### 이름을 가지는 슬롯
* 슬롯 엘리먼트는 특별한 속성인 name을 가지고 있다.
* 이 속성은 내용을 어떻게 배포해야하는지를 더 설정하는데 사용할 수 있다.
* 기본적으로 부모 영역에서의 slot속성값과, 컴포넌트의 템플릿에서 슬롯의 name 속성이 같은 부분이 엮이며 name속성이 없다면, 없는 모든부분이 엮이게된다.

```javascript
// HTML
<div id="slot2">
  <my-component>
    <template #title>
      <p>여기에 페이지 제목 위치</p>
    </template>
    <template #main>
      <p>메인 컨텐츠</p>
      <p>메인 컨텐츠</p>
      <p>메인 컨텐츠</p>
    </template>
  </my-component>
</div>
// Script
new Vue({
  el : '#slot2',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : {
      template : `
        <div>
          <slot name="title">페이지 타이틀이 없습니다.</slot>
          <slot name="main">메인컨텐츠1이 없습니다</slot>
          <slot name="banner">중간광고가 없습니다</slot>
          <slot>메인컨텐츠2이 없습니다</slot>
          <slot name="footer">연락처 정보가 없습니다/</slot>
        </div>
      `
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="slot2">
    <my-component>
      <template #title>
        <p>여기에 페이지 제목 위치</p>
      </template>
      <template #main>
        <p>메인 컨텐츠</p>
        <p>메인 컨텐츠</p>
        <p>메인 컨텐츠</p>
      </template>
    </my-component>
  </div>
</div>
{:/}

### 범위를 가지는 슬롯
* 이미 렌더링 된 엘리먼트 대신 재사용 가능한 템플릿으로 작동하는 특별한 유형의 슬롯이다. prop을 컴포넌트에게 전달하는 것처럼, 하위 컴포넌트에서 슬롯에게 전달할 수 있다.
* 부모에게서 특별한 속성 slot-scope(대체되는 slot의 속성을 감지하는 속성)를 가진 템플릿 태그가 있어야 한다.(vue 특성상, 템플릿 태그는 DOM에 노출되지 않음.) slot-scope의 값은, 컴포넌트로부터 전달된 props객체 변수이다.
* 업데이트 이후, 템플릿태그뿐만아니라 컴포넌트에도 가능하다.

* 쓰는 이유 예상
  * 만약, 재사용하거나, 다른사람에게 배포를 할 때 각기 용도나 사람마다 최종적으로 렌더링을 원하는 데이터의 갯수가 다를 수 있다. 따라서, 해당 컴포넌트 내부의 템플릿에서 가상의 slot을 만들고, 사용자가 원하는 몇개의 데이터를 넣든 매칭된 slot에 값이 들어가도록 하는 것. 만약 이렇게 하지 않는다면, 2개의 태그로 값이 나오길 원하면 템플릿에서도 두개의 태그를 만들어야하는 수동적인 불편함
  * 즉, 같은 구조에 사람마다 넣고자하는 데이터의 갯수가 다를수 있기 때문

```javascript
// HTML
<div id="slot3">
  <my-list
    :items="arr"
  >
    <template #item="{item : {id, text}}">
      <li><%id%>. <%text%></li>
    </template>
  </my-list>
</div>
// Script
new Vue({
  el : '#slot3',
  delimiters : ['<%', '%>'],
  data : {
    arr : [
      {id : 1, text : 'banana'},
      {id : 2, text : 'apple'},
      {id : 3, text : 'grapes'},
    ]
  },
  components : {
    'my-list' : {
      props : ['items'],
      template : `
        <ul>
          <slot
            name="item"
            v-for="item in items"
            :item="item"
          >
          </slot>
        </ul>
      `
    }
  }
})
// 정리.
// (1) 부모영역에서 컴포넌트에 순회시킬 값을 보내줌
// (2) 해당 컴포넌트에서 보내진 배열 값을 속성으로 받고, 슬롯태그 내부에 v-for순회를 시켜줌. 그리고, :로 순회 된 낱개의 객체를 속성으로 남긴다.
// (3) 남겨진 낱개객체속성은, slot으로 대체되는 부모영역의 태그가 slot-scope로 감지할 수 있으며, 형식은 {속성명 : 객체}이런식이다(물론 v-for가 아니라면 그냥 일반 값도 가능).
// (4) 따라서, 해당 컴포넌트를 배포할 때, 컴포넌트 내부의 template을 수정할 필요 없이, 부모영역에서 모든 설정 및, 렌더링되는 DOM의 구성을 짤 수 있으므로 재사용성이 높아진다.
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="slot3">
    <my-list
      :items="arr"
    >
      <template #item="{item : {id, text}}">
        <li><%id%>. <%text%></li>
      </template>
    </my-list>
  </div>
</div>
{:/}

## 동적 컴포넌트
* 같은 인스턴스 안에 있는 components들을 동적으로 교체할 수 있고, is로 바인드 할 수 있다.
* Vue-cli에서 컴포넌트 교체를 이런식으로 함.
* component태그를 keep-alive태그로 감싸서, 동적으로 교체되더라도 재 렌더링하지않고 이전의 값들을 유지할 수 있다.

```javascript
// HTML
<div id="activeComponent">
  <component :is="currentComp"></component>
</div>
// Script
new Vue({
  el : '#activeComponent',
  delimiters : ['<%', '%>'],
  data : {
    currentComp : 'posts'
  },
  components : {
    home : {
      template : `<p>Hi, I am home</p>`
    },
    posts : {
      template : `<p>Hi, I am posts</p>`
    },
    archive : {
      template : `<p>Hi, I am archive</p>`
    }
  }
})
```

{::nomarkdown}
<div style="width : 80%; margin : 0 auto; border : 1px solid #999; border-radius : 1em; padding : 1em;">
  <div id="activeComponent">
    <component :is="currentComp"></component>
  </div>
</div>
{:/}

## 기타
* 태그의 ref속성과, $refs 호출을 통해 태그를 직접 조회할 수 있다.(document.querySelector처럼)  단, ref는 컴포넌트가 렌더링 된 이후에만 작동되며, 반응적이지 않는다.

## 참조
[Vue.js 공식가이드 컴포넌트](https://kr.vuejs.org/v2/guide/components.html)


<script>
Vue.component('my-component', {
  delimiters : ['<%', '%>'],
  template : `
    <div>사용자 정의 전역 component 입니다</div>
  `
})
new Vue({
  el : '#component1',
  delimiters : ['<%', '%>'],
}) 

const component2 = {
  template : `
    <div>사용자 정의 지역 component 입니다</div>
  `
}
new Vue({
  el : '#component2',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : component2
  }
}) 

const component3 = {
  template : `<li>특수속성 is</li>`
}
new Vue({
  el : '#component3', // ul태그
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : component3
  }
}) 

const component4 = {
  delimiters : ['<%', '%>'],
  template : `<button @click="counter++"><%counter%></button>`,
  data(){
    return {
      counter : 0
    }
  }
}
new Vue({
  el : '#component4',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : component4
  },
}) 

new Vue({
  el : '#props1',
  delimiters : ['<%', '%>'],
  data : {
    message : 'Props 전달!',
    obj : {
      text : '객체전달!',
      boolean : false
    }
  },
  components : {
    props : {
      delimiters : ['<%', '%>'],
      props : ['message', 'obj'],
      template : `<div><%message%>,<%obj.text%>,<%obj.boolean%></div>`
    }
  }
})

new Vue({
  el : '#props2',
  delimiters : ['<%', '%>'],
  data : {
    num : 30
  },
  components : {
    props : {
      props : ['num'],
      delimiters : ['<%', '%>'],
      template : `<button @click="math" :class="{tomato : childNum===15}"><%childNum%></button>`,
      data(){
        return {
          childNum : this.num
        }
      },
      methods : {
        math(){
          this.childNum = this.childNum/2;
        }
      }
    }
  }
})

new Vue({
  el : '#props3',
  delimiters : ['<%', '%>'],
  data : {
    propA : 30,
    propB : '문자열과 숫자열 가능',
    propC : '문자열이여야하고 꼭 필요',
    propD : 80,
    propE : {id : 1, text : '객체이고, 기본값은 메소드로 반환'},
    propF : 8
  },
  components : {
    props : {
      props : {
        // 기본단일타입
        propa : Number,
        // 여러개 가능한 타입
        propb : [String, Number],
        // 문자열이여야하며 꼭 필요함
        propc : {
          type : String,
          required : true
        },
        // 숫자타입이여아하며 기본값이 있음
        propd : {
          type : Number,
          default : 100
        },
        // 객체타입이며, 기본객체는 메소드를 통해 반환됨
        prope : {
          type : Object,
          default(){
            return {message : 'default'}
          }
        },
        // 사용자 정의 검사기능
        propf : {
          validator(value){
            return value > 10
          }
        }
      },
      delimiters : ['<%', '%>'],
      template : `
        <div><%propa%>, <%propb%>, <%propc%>, <%propd%>, <%prope%>, <%propf%></div>
      `
    },
  }
});

new Vue({
  el : '#customEvent',
  delimiters : ['<%', '%>'],
  data : {
    total : 0
  },
  methods : {
    incrementTotal(text){
      alert(text)
      this.total++;
    },
    nativeEvent(){
      alert('커스텀이벤트가 아니라 진짜 그냥 눌렀을 때 실행되는 부모의 메소드')
    }
  },
  components : {
    'button-counter' : {
      delimiters : ['<%', '%>'],
      props : ['num', 'setparaentdata'],
      template : `
        <button @click="incrementCounter"><%counter%></button>
      `,
      data(){
        return {
          counter : this.num
        }
      },
      methods : {
        incrementCounter(){
          this.counter++;
          const childCount = this.counter;
          this.$emit('increment', childCount)
        }
      }
    },
  }
})

new Vue({
  el : '#synctest',
  delimiters : ['<%', '%>'],
  data : {
    text : 'Hello'
  },
  components : {
    child : {
      props : ['text'],
      delimiters : ['<%', '%>'],
      template : `
        <button @click="change"><%text%></button>
      `,
      methods : {
        change(){
          this.$emit('update:text', 'Hi')
        }
      }
    }
  }
})

new Vue({
  el : '#v-model1',
  delimiters : ['<%', '%>'],
  data : {
    text : '초기값'
  },
  components : {
    'custom-input' : {
      delimiters : ['<%', '%>'],
      props : ['value'],
      template : `
        <input type="text"
          :value="value" 
          @input="$emit('input',$event.target.value)"
        >
      `,
      methods : {
        inputEvent(value){
          this.$emit('input', value)
        }
      }
    },
  }
})

new Vue({
  el : '#v-model2',
  delimiters : ['<%', '%>'],
  data : {
    boolean : true
  },
  computed : {
    boolcheck(){
      return this.boolean ? '하겠습니다' : '하지않겠습니다'
    }
  },
  components : {
    checkbox : {
      model : {
        prop : 'checkbool', // v-model로 받는 값
        event : 'change' // 사용자지정 이벤트는 기본 input이자만 change로 하겠음
      },
      props : {
        checkbool : Boolean,
      },
      delimiters : ['<%', '%>'],
      template : `
        <input 
          type="checkbox"
          :checked="checkbool"
          @change="change($event.target.checked)"
        >
      `,
      methods : {
        change(value){
          this.$emit('change', value)
        }
      }
    }
  }
})

const bus = new Vue()
new Vue({
  el : '#exportmethod',
  delimiters : ['<%', '%>'],
  methods : {
    exportMethod(){
      bus.$emit('exportedEvent', 1)
    }
  }
})
new Vue({
  el : '#importmethod',
  delimiters : ['<%', '%>'],
  created(){
    bus.$on('exportedEvent', (num) => {
      alert(num)
    })
  }
})

new Vue({
  el : '#slot1',
  delimiters : ['<%', '%>'],
  data : {
    isShow : false
  },
  components : {
    'my-component' : {
      template : `
      <div>
        <p>나는 자식 컴포넌트의 제목입니다</p>
        <slot>
          제공된 컨텐츠가 없는 경우에만 보실 수 있습니다.
        </slot>
      </div>
      `
    }
  }
})

new Vue({
  el : '#slot2',
  delimiters : ['<%', '%>'],
  components : {
    'my-component' : {
      template : `
        <div>
          <slot name="title">페이지 타이틀이 없습니다.</slot>
          <slot name="main">메인컨텐츠1이 없습니다</slot>
          <slot name="banner">중간광고가 없습니다</slot>
          <slot>메인컨텐츠2이 없습니다</slot>
          <slot name="footer">연락처 정보가 없습니다/</slot>
        </div>
      `
    }
  }
})

new Vue({
  el : '#slot3',
  delimiters : ['<%', '%>'],
  data : {
    arr : [
      {id : 1, text : 'banana'},
      {id : 2, text : 'apple'},
      {id : 3, text : 'grapes'},
    ]
  },
  components : {
    'my-list' : {
      props : ['items'],
      template : `
        <ul>
          <slot
            name="item"
            v-for="item in items"
            :item="item"
          >
          </slot>
        </ul>
      `
    }
  }
})

new Vue({
  el : '#activeComponent',
  delimiters : ['<%', '%>'],
  data : {
    currentComp : 'posts'
  },
  components : {
    home : {
      template : `<p>Hi, I am home</p>`
    },
    posts : {
      template : `<p>Hi, I am posts</p>`
    },
    archive : {
      template : `<p>Hi, I am archive</p>`
    }
  }
})
</script>

