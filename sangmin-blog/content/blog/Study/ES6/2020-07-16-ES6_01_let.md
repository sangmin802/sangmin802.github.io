---
title : "ES6_let"
date : 2020-07-16 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6
---   
## let

* 기존 우리가 알던 `var` 변수선언과 다르게, 두번 선언될 수 없다.  

  ```javascript
  var variable = 'var 변수';  
  console.log(variable) // var 변수
  var variable = 'var 변수2';  
  console.log(variable) // var 변수2
  // 대체된다.

  let newlet = 'let 변수';
  let newlet = 'let 변수2';
  // Identifier 'newlet' has already been declared
  // 동일한 변수명으로 두번 선언(let ...)될 수 없다.

  // 아래의 상황은 가능하다.
  let letChange = '기존 let';
  console.log(letChange) // 기존 let
  letChange = '바뀐 let';
  console.log(letChange) // 바뀐 let
  ```

* `let`은 스코프단위로 서로 다른 변수이지만, `var`는 함수단위이다.  

  ```javascript
  function home(){
    var homevar = 'homevar';
    for(let i=0; i<100; i++){
    }
    console.log(i)
    // var의 경우 : 100
    // let의 경우 : i is not defined at home

    // var의 경우, for 안의 스코프에서만 선언된 i더라도, 함수단위로 인식되기 때문에 i가 찍힌다.
    // 하지만 i를 let으로 선언했을 때, for문 안에서만 i를 인식할 수 있다.
  }
  home();
  ```

* `let` & `closure` & `scope`
클릭해보세요.
  ```javascript
    <ul>
      <li class="ES6_let" data-action="HTML">HTML</li>
      <li class="ES6_let" data-action="CSS">CSS</li>
      <li class="ES6_let" data-action="JavaScript">JavaScript</li>
      <li class="ES6_let" data-action="ECMA Script">ECMA Script</li>
    </ul>

    var list = document.querySelectorAll('.ES6_let');
    console.log(list)
    for(let i=0; i<list.length; i++){
      list[i].addEventListener('click', function(){
        alert(`${i}번째 리스트 입니다.`);
      })
    }
    // var i로 할 경우, 모두 4번째 리스트라고 나온다.
    // -> for문 함수 안, 콜백함수인 console.log의 i는 외부함수의 i로서, 클로저 역할을 한다. 
    // 따라서 i를 기억할 수 있다. 그런데 var는 특성상 이전의 값에다 덮어씌워지기때문에(참조) 
    // 가장 마지막인 4가남지만, let은 그렇지 않기 때문에 let i를 할 경우 정상출력된다.
  ```
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
  <ul>
    <li class="ES6_let" data-action="HTML">HTML</li>
    <li class="ES6_let" data-action="CSS">CSS</li>
    <li class="ES6_let" data-action="JavaScript">JavaScript</li>
    <li class="ES6_let" data-action="ECMA Script">ECMA Script</li>
  </ul>
</div>
<script>
  var list = document.querySelectorAll('.ES6_let');
  for(let i=0; i<list.length; i++){
    list[i].addEventListener('click', function(){
      alert(`${i}번째 리스트 입니다.`);
    })
  }
</script>

  * scope
    어떤 변수들에 접근할 수 있는지 정의하는 것
    1. 전역스코프 : 전역변수
    2. 지역스코프 : 함수스코프와 블록스코프가 있다. var는 함수스코프. let은 {}인 블록스코프