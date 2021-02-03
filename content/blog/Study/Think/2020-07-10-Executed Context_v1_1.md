---
title : "실행컨텍스트1(Executed Context)"
date : 2020-07-10 00:00:00
category : "Study"
draft : false
tag : "Think"
toc: true
toc_label: "정의 및 구조"
---   
> 참조 : <https://poiemaweb.com/js-execution-context>

## 정의
### Execution Context : 실행컨텍스트
* 실행 가능한 코드가 실행되기 위해 필요한 과정
* scope, hoisting, this, function, closure등의 동작원리를 담고있는 자바스크립트의 핵심원리이다.
* 자바스크립트 엔진은 코드를 실행하기 위해 필요한 여러가지 정보를 알고있어야 한다.
  - 변수 : 전역, 지역, 매개변수, 객체의 속성
  - 함수선언
  - 변수의 유효범위(Scope)
  - this

 이처럼 실행에 필요한 정보를 형상화, 구분하기위해 실행컨텍스트를 물리적 객체의 형태로 관리함.

### 자바스크립트의 코드 3가지
  1. 전역 코드 : 전체 영역에 존재하는 코드 - 실행가능
  2. Eval 코드 : eval 함수로 실행되는 코드
  3. 함수 코드 : 함수 내에 존재하는 코드 - 실행가능

  * GEC(Global Execution Context) : 전역실행컨텍스트
  * FEC(Function Execution Context) : 함수실행컨텍스트

### 실행컨텍스트 쌓이는 과정
  1. 전역 코드로 컨트롤(제어권)이 진입하면, GEC가 생성되고 실행컨텍스트에 쌓인다. GEC는 앱이 종료될 때(페이지에서 나가거나, 브라우저를 닫을 때)까지 유지된다.
  2. 함수 호출시, 해당 함수의 FEC가 생성되며, 이전 EC위에 쌓임.
      - 현재는 GEC만 쌓여있으니 그 위에 쌓이겠지 피라미드처럼?
  3. 함수의 실행이 끝나면, 해당 함수의 FEC를 제거하고, 바로 아래 쌓여있는(직전의) EC에 컨트롤을 넘겨준다.
      - 현재는 GEC위에 FEC가 쌓여있으니, 함수종료시 해당 FEC가 제거되고, GEC에게 컨트롤이 넘어옴.

## 실행 컨텍스트의 3가지 객체
```javascript
const Execution_Context = {
  Variable_Object : {
    // vars, function_declarations, arguments, etc
  },
  Scope_Chain : [
    // Variable_Object, all_parant_scopes
  ],
  thisValue : 'Context_Object'
}
```
### Variable Object(VO/변수객체)
  실행 컨텍스트가 생성되면, 자바스크립트 엔진은 실행에 필요한 여러 정보들을 담은 객체를 생성한다. 이를 Variable Object(VO/변수객체)라고 한다. VO는 코드가 실행될 때 엔진에 의해 참조되며, 코드에서 접근할 수 없다.
  * VO의 구성
  1. 변수
  2. 매개변수(parameter), 인수(arguments)
  3. 함수 선언(함수 표현식은 제외)

  VO는 실행 컨텍스트의 속성(위 객체를 보삼)으로, 객체의 값을 갖는다.  
  그런데, 전역코드로 생성되는 GEC의 VO와 함수로 생성되는 FEC의 VO가 가리키는 객체가 서로 다르다.

* GEC일때 VO의 값
```javascript
const Globl_Execution_Context = {
  Variable_Object : { // Global Object(Go) 라고 함.
    foo : function(){console.log('전역함수 foo')},
    var : '전역변수 var'
  },
  // ... 이하동일
}
```
  - VO는 유일하며(단 하나뿐. 당연하지), 최상위위치하고 모든 전역변수, 전역함수 등을 포함하는 전역객체(Global Object/GO)를 가르킨다.

<br>

* FEC일때 VO의 값
```javascript
const Function_Execition_Context = {
  Variable_Object : { // Actibation Object(AO) 라고 함.
    arrguments : {
    },
    innerFunction : function(){'내부함수'},
    innerVar : '지역변수 innerVar'
  },
  // ... 이하동일   
}
```
  - VO는 Activation(AO/활성객체)를 가리키며, 해당 함수의 매개변수와 인수들의 정보를 배열의 형태로 담고있는 객체인 argumetns object가 추가된다.


### Scope Chain(SC/스코프체인)
  전역 또는 함수가 참조할 수 있는 변수, 함수선언 등의 정보를 담고있는 전역객체(GO) 또는 활성객체(AO)의 리스트를 가리킨다.
  - FEC의 SC는 자신의 VO인 AO와 GEC의 VO인 GO 두개를 리스트화 하여 갖고있다.
  - 함수의 경우, 전역의 변수도 사용할 수 있는 특징이기 때문!
    GEC의 SC는 자신의 VO인 GO만 리스트에 갖고있다.

자바스크립트는 스코프 체인을 통해 렉시컬 스코프(해당 변수/함수의 위치)를 파악한다.  
함수가 중첩되어있을 경우, 가장 내부의 함수는 부모함수와 전역의 변수를 참조할 수 있다. 함수실행중, 변수를 만나면 현재Scope에서 탐색하고, 없으면 상위로 올라가면서 찾는다.

```javascript
function outerScope(){
  let variable = '외부변수';
  function innerScope(){
    variable = '내부변수' // 지우면 외부변수가 출력됨
    console.log(variable);
  }
  innerScope();
}
outerScope();
```

### this value
  this 프로퍼티에는 this의 값이 할당된다.