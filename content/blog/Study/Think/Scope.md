---
title : "Scope, 영역"
date : 2020-07-13 00:00:00
category : "Study"
draft : false
tag : "Think"
---   

😂 이전 실행컨텍스트를 공부하면서, `Scope`라는 용어를 접하게 되었다. 그렇게 어려운 용어는 아니였지만, 지금생각해보니` Scope`를 먼저 알고 실행컨텍스트를 공부했다면 더 수월했을 듯 하다.

## Scope(영역)
`Scope`는 함수가 호출될 때가 아니라, 선언했을 때 정해진다고 했었음.
```javascript
// 1번
var name = 'zero';
function wrapper(){
  var name = 'nero';
  function log(){
    console.log(name);
  }
  log();
}
wrapper(); // nero

// 2번
var name = 'zero';
function log(){
  console.log(name);
}
function wrapper(){
  var name = 'nero';
  log();
}
wrapper(); // zero
```
### 1번
1번에서 `function log`인 함수선언식은, `wrapper` 함수 안에있기 때문에, `wrapper`의 내부까지가 `Scope`영역임. 따라서, `var name="nero"` 라는 변수가 담긴<b style="color : tomato;">클로저</b>에 접근할 수있음.

### 2번
2번에서 `function log`인 함수선언식은, 전역에 위치하고있기 때문에, 참조할 수 있는 것이 전역변수인 `var name="zero"`뿐이여서 값이 다르다.

## 전역변수의 위험성
전역변수는 `window` 객체에 추가되기때문에, 앱의 규모가 커질수록 사용하면 안된다.  
var 는 `window`객체에 포함되지만, `let`, `const는` 별도의 객체에 추가됨. 따라서, `const` `let은` 괜찮은것 같더라.
  * 네임스페이스 : 변수를 보관하는 껍질 제작.
```javascript
var param = {
  text : 'local',
  alertText : function(){
    console.log(this.text);
  }
}
```
하지만, 위의 경우, 추가적으로 `script`를 추가하여, x와 y를 고의적으로 변경할 수 있다. `obj.text = 'fuck'` 이런식으로

## 😆 해결방안
비공개변수로 만들어서 해결할 수 있다.
```javascript
const param = (() => { // 1. param이라는 변수에, 비공개변수를 Closure로 갖는 메소드를 포함한 객체를 반환한다.
  let text = 'local';
  return { 
    alertText : function(){
      console.log(text);
    }
  }
})();
param.alertText(); // 2. 필요할때 사용한다.
```

## 🧐 의문
실행컨텍스트와 이번 스코프를 하면서 컨텍스트에서 생성되는 `[[Scopes]]`객체에서 `closure`라는 값을 보았고, 이번에도 스코프 영역 내의 변수를 `closure`라고 하는걸 보았다. 다음번에는 `closure`가 정확히 무엇인지 알아보아야 겠다.