---
title : "실행컨텍스트(Executed Context) 더 쉽게!"
date : 2020-07-08 00:00:02
category : "Study"
draft : false
tag : "Think"
---   
> 참조 : <https://www.zerocho.com/category/Javascript/post/5740531574288ebc5f2ba97e>

😖 실행 컨텍스트를 이전에 공부했지만.. 아직 확신이 가지 않는 부분이 많아서 더 구글링 해 보았고, 조금 더 쉽게 설명된 글이 있었다!

## 실행컨텍스트 : 문맥이라 생각하자. 코드의 실행환경.
### 설명을 위한 코드
```javascript
var name = 'zero';
function wow(word){
  console.log(word+' '+name)
};
function say(){
  var name = 'nero';
  console.log(name);
  wow('hello');
};
say();
```

### 시작!
1. 전역변수객체 생성(window에 전역변수들 추가)
2. 전역컨텍스트 생성. 함수선언식의 경우, 속성으로 함수명, 값으로 함수가 추가되고, 변수의경우 속성으로 변수명, 값은 `undefined`로 할당됨.
```javascript
let GEC = {
  VO : { // GO라고도 함
    name : undefined,
    wow : function wow(){'위의 함수내용'},
    say : function say(){'위의 함수내용'}
  },
  scopeChain : ['전역 변수객체'],
  this : window
}
```

3. 코드를 위에서부터 읽어내려오면서 각 변수들에게 값을 할당해줌.
```javascript
GEC = {
  VO : { // GO라고도 함
    name : 'zero',
    wow : function wow(){'위의 함수내용'},
    say : function say(){'위의 함수내용'}
  },
  scopeChain : ['전역 변수객체'],
  this : window
}
```
4. `say()` 호출시, `say` 함수컨텍스트 생성
```javascript
let FEC_say = {
  VO : { // FO라고도 함
    arguments : null,
    variable : {
      name : undefined
    }
  },
  scopeChain : ['say 변수객체', '전역 변수객체'],
  this : window
}
```
* `wow('hello')`도 say함수 내부에 있는데, 왜 `say` 실행컨텍스트에없나 할 수 있는데, `say`함수 내부의 wow는 변수가아니라 호출된 함수임. 따라서, 함수의 호출위치가 아닌 선언 위치에 따라 스코프(영역)이 설정되기 때문에 wow의 정보는 함수선언식으로 표현되었을 때, 전역변수객체에 담겨있음.
5. `undefined`였던 변수`name` 값 할당.
```javascript
FEC_say = {
  VO : { // FO라고도 함
    arguments : null,
    variable : {
      name : 'nero'
    }
  },
  scopeChain : ['say 변수객체', '전역 변수객체'],
  this : window
}
```
6. wow('hello') 호출시, wow 실행컨텍스트 생성
```javascript
let FEC_wow = {
  VO : { // FO라고도 함
    arguments : [{word : 'hello'}], // 변수로 보내진것을 인자로 받음
    variable : null // 해당 스코프 내에서, 갖고있는 변수 없음.
  },
  scopeChain : ['wow 변수객체', '전역 변수객체']
}
```
* `say`변수객체는 `closure`로 존재하지않는다. 왜냐? 처음 함수가 선언될 때, 전역에 선언되었기 때문.(위에서 말했지만, 스코프(영역)은 호출이 아닌 선언됬을 때 형성됨) 
    
### 결과 = hello zero;
`hello`는 `arguments`에서 찾고, `name`의 값은, `variable`에 없기때문에, `scopeChain`을 따라올라가 전역변수객체에서 찾는다.

### 🤔 결론
이번 실행컨텍스트를 공부하면서 `closure`, `scope라는` 용어를 자주보게되었다. 이것도 한번 다뤄봐야겠다.