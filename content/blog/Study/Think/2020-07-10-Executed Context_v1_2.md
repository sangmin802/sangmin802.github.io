---
title : "실행컨텍스트2(Executed Context)"
date : 2020-07-08 00:00:01
category : "Study"
draft : false
tag : "Think"
---   
> 참조 : <https://poiemaweb.com/js-execution-context>

## 실행 컨텍스트의 생성과정
### 설명을 위한 코드
```javascript
const immuVar = 'immuVar' // const, let은 GO, closure가아니라 script라는 새로운곳에 추가됨.
var x = 'xxx';
function outer(){
  declareFunc();
  var y = 'yyy';
  function inner(){
    var z = 'zzz';
    console.log(immuVar+x+y+z);
    console.dir(inner) // [[Scopes]] 로 GO, outer의 변수(클로저)를 참조할 수 있음.
  };
  inner();
}
outer();
function declareFunc(){
  console.log('함수 선언식')
}
var ExpFunc = function(){
  console.log('함수 표현식')
}
```
1. 전역객체 생성
  - 시작 전 전역객체가 생성되며, 이 객체에는 어떠한 곳에서도 접근할 수 있다.(Global객체인듯 함)
  - 이 초기의 전역객체에는 Math, String, Array등의 windows의 기본객체와 BOM, DOM등이 설정되어 있다.
2. 전역객체 생성 이후, 전역코드 진입 시 GEC 생성후 실행컨텍스트 스택에 쌓임.
3. 해당 GEC의 스코프체인 생성
  - 시작할 때 생성된 전역객체가 GEC의 스코프체인 리스트에 추가됨.
4. 해당 GEC의 (Variable Instantiation)변수 객체화 실행
  - VI는, VO에 프로퍼티와 값을 추가하는것을 의미한다.
  - VI 순서(위의 코드 기준)
    1. (Function Code의 경우에만) 매개변수가 VO의 프로퍼티로, 인수가 값으로 설정된다. 전역이면 아님
    2. 대상 코드 내의 함수선언을 대상으로 함수명이 VO의 프로퍼티로, 생성된 함수 객체가 값으로 설정된다.
        - 이때 생성된 함수객체를 `console.dir(outer)` 혹은 `console.dir(inner)` 를 조회하였을 때, `[[Scopes]]`프로퍼티를 갖게되는데, 자신의 실행환경(Lexical Scope)과 자신을 포함하는 외부함수의 환경, 전역객체를 가리킨다. 자신을 포함하는 외부함수의 실행컨텍스트가 소멸하여도 `[[Scopes]]`프로퍼티를 유지하고있는데, 이것을 <b style="color : tomato">클로저</b>라고한다.
        - 이로서 알 수 있는것. `[[Scopes]]`프로퍼티는, 해당 범위 내에서 참조할 수 있는 스코프체인 리스트를 말하는것 같다.<b style="color : tomato">클로저</b>
            - outer를 조회하였을 때, `[[Scopes]]`의 값으로, GO와 다른 const, let등의 변수를 조회할 수 있다.
    3. 대상 코드 내의 변수 선언을 대상으로 변수명이 VO의 프로퍼티로, `undefined`가 값으로 설정된다.
        - 중요한점! `var`로 선언되었을 경우만 `undefined`의 값을 갖고있으며, const나 let으로 선언되었을 경우 어떠한 값도 갖고있지않는다.
        - x 선언 이전에 `console`로 조회할 때, `var`이면 `undefined`, `const` or` let`이면 `reference error`
        - 이렇듯, `var`의 경우 선언 이전에 조회할 수 있는데 이것을 <b style="color : tomato">호이스팅</b>이라고 한다.
    4. 위의 과정이 끝나면, `window`에 GO의 내용(전역함수 및 전역변수)가 추가되어있는걸 볼 수 있다.
5. this value 결정
  - 기본적으로 this는 전역객체를 가리키고 있지만, 함수 호출 패턴에 의해 this에 할당되는 값이 결정된다. 당연히, 전역코드의 경우 this 는 전역객체인 GO(`window` + 생성한 전역변수, 함수)이다.  

## 후기 😬 솔직히 어려웠다.
추가적으로 이해를 위해 구글링 중, 더 쉽게 설명된 링크가 있어 복습 겸 다시 정리해보았다!