---
title : "Vue Instance"
date : 2020-08-31 00:00:01
category : "Study"
draft : false
tag : "Vue.js"
toc: true
toc_label: "Vue Instance"
sidebar : 
  - title : 'Vue.js'
  - nav : Vue    
--- 
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script> 

## 정의
* CDN이든 Vue cli든 모든 Vue 앱은 Vue 인스턴스를 만드는 것부터 시작된다.
### 속성과 메소드
* 각 Vue 인스턴스는 data 객체에 있는 모든 속성을 참조한다.
* 다른 사용자 지정 속성과 구분을 위해 $접두어를 사용할 수 있다.
> $emit, $refs 등등 Vue에서 기본적으로 사용하는 속성들
* 데이터의 값이 변경되면 화면은 다시 렌더링된다.(React처럼)
* 하지만 data가 보유하고 있는 값들만 위의 렌더링 조건에 해당되며, 값이 추가되는것에는 새롭게 렌더링되지 않는다.
> 따라서 null, [] 등의 초기값을 설정해주어야 한다.

```javascript
const data = {a : 1};
const vm = new Vue({
  data
})
console.log(vm.a === data.a) // true
console.log(vm.data === data) // false
console.log(vm.$data === data) // true
vm.a = 2;
console.log(data.a) // 2
data.a = 3;
console.log(vm.a) // 3
```

### 인스턴스 라이프사이클 훅
* Vue 인스턴스는 생성될 때, 일련의 초기화 단계를 거치며, 아래의 4가지의 경우 라이프사이클 훅도 호출된다.
1. 데이터 관찰 설정이 필요한 경우
2. 템플릿을 컴파일 하는 경우
3. 인스턴스를 DOM에 연결하는 경우
4. 데이터가 변경되어 DOM을 업데이트 하는 경우

```javascript
new Vue({
  el : '#lifeCycle',
  data : {
    text : null,
  },
  created(){ // Vue 인스턴스가 생성되었을 때
    // 여기서, 추가적인 data를 설정합니다.
    console.log('인스턴스가 생성되었습니다.');
  },
  mounted(){ // 인스턴스나 컴포넌트가 DOM에 추가되었을 때
    // 하지만, 모든 컴포넌트가 추가되었다고는 보장할 수 없음
    this.$nextTick(() => { // 모든 컴포넌트가 추가되고 화면이 렌더링
      this.text = 'DOM이 생성되었습니다.'
      console.log('DOM이 생성되었습니다.');
    })
  },
  updated(){ // DOM이 재 랜더링 된 후 실행
    // mounted와 마찬가지로, 재 랜더링이 끝났다는것이 보장된 상태는
    this.$nextTick(() => {
      console.log('DOM이 업데이트되었습니다.')
    })
  },
  destroyed(){ // 컴포넌트가 제거될 때

  }
})
```

## 참조
[Vue.js 공식가이드 인스턴스](https://vuejs.org/v2/guide/instance.html)

