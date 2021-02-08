---
title : "Closure, 클로저"
date : 2020-07-14 00:00:00
category : "Study"
draft : false
tag : "Think"
---   

😂 해당 스코프(영역)에서, 자신이 참조할 수 있는 변수를 클로저라하는것 같더라.

## Closure(클로저)
`Scope`는 함수가 호출될 때가 아니라, 선언했을 때 정해진다고 했었음.

### 렉시컬 스코핑
스코프는 함수를 호출할 때가 아니라, 함수를 어디에 선언했는지에 따라 결정된다.
```javascript
// 1번
function outerFunc(){
  var x = 10;
  var innerFunc = function(){console.log(x)}
  innerFunc();
}
// innerFunc는 함수의 위치가 outerFunc의 내부이기 때문에, outerFunc의 변수 x를 클로저로 가져올 수있으며, innerFunc자신을 참조할 수 있다.
outerFunc();
```
### 클로저의 장점
1. 상태유지 : 현재 상태를 기억하고, 변경된 최신 상태를 유지할 수 있다.
2. 전역 변수의 사용 억제 : 전역변수가 아닌, 즉시실행함수의 지역변수를 클로저를 참조할 수 있게 하여, 다양한 오류를 사전에 방지할 수 있다.

### 예제
<div style="
  width : 30%;
  margin : 0 auto;
  display : flex;
  flex-direction : column;
  align-items : center;
  border : 1px solid #666666; 
  border-radius : 5px;
  padding : 0.5em 0;"
>
  <button class="toggle">toggle</button>
  <div class="box" style="width: 100px; height: 100px; background: red;"></div>
</div>
<br>
<script>
var box = document.querySelector('.box');
var toggleBtn = document.querySelector('.toggle');
var toggle = (function () {
  var color = false;
  // ① 클로저를 반환
  return function () {
    box.style.background = color ? 'red' : 'blue';
    // ③ 상태 변경
    color = !color;
  };
})();
toggleBtn.onclick = toggle;
</script>

```javascript
var box = document.querySelector('.box');
var toggleBtn = document.querySelector('.toggle');

var toggle = (function () {
  var color = false;
  // ① 클로저를 반환
  return function () {
    box.style.background = color ? 'red' : 'blue';
    // ③ 상태 변경
    color = !color;
  };
})();

// 즉시실행함수로, 영구적으로 toggle 이벤트는 return 된 함수임.
// 하지만, closure 속성상, color라는 변수는 존재하고 있음.

// ② 이벤트 프로퍼티에 클로저를 할당
// console.dir(toggle) // closure로 color의 값 갖고있음
toggleBtn.onclick = toggle;
```
출처 : [클로저, 스코프 서진규님 블로그](https://velog.io/@jakeseo_me/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%9D%BC%EB%A9%B4-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%A0-33%EA%B0%80%EC%A7%80-%EA%B0%9C%EB%85%90-6-%ED%95%A8%EC%88%98%EC%99%80-%EB%B8%94%EB%A1%9D-%EC%8A%A4%EC%BD%94%ED%94%84-%EB%B2%88%EC%97%AD-dijuhrub1x)