---
title : "DOM 과 Virtual Dom"
date : 2020-10-21 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 

### 🤔 의문
이전 `Kotlin`으로 간단한 로스트아크 유저검색 앱을 만든 뒤, 취미? 개념으로 `React`를 써서 조금 더 규모있게 웹 앱을 만들고 있다. 물론.. 공식적으로 제공되는 API가 아니라 완성된 DOM을 하나하나 뜯어서 정보를 추출하고 있기때문에 시간은 좀 걸리더라 ㅎㅎ; 그래도 재미는 있으니 다행

### Virtual DOM
구글링 중 `React`와 관련이 깊다는 `Virtual DOM`이라는 용어를 보았는데, `React`를 사용하는데도 해당 용어가 낯설어서 알아보기로 했다.

### DOM
기본적으로 우리는 View 화면을 구성할 때, HTML Elements등을 활용하여 구조를 짜면 브라우저가 그것을 읽고 렌더링을 하게된다.

<br>
<br>
이후 우리는

```javascript
document.getElementById('Hello').innerHTML = '안녕'; // 첫번째 렌더링
document.body.style.background = 'tomato'; // 두번째 렌더링
```
이런식으로 사용자가 어떠한 요청을 하였을 때, `DOM`에 직접적으로 변화를 줘 왔다.

<br>
<br>
그런데 만약에..

```javascript
document.getElementById('Hello').innerHTML = '안녕';
document.body.style.background = 'tomato';
document.getElementById('Hello').innerHTML = '안녕하';
document.body.style.background = 'blue';
document.getElementById('Hello').innerHTML = '안녕하세';
document.body.style.background = 'yellow';
...
```
이렇게 100개의 변경이 있다고하면 `DOM`은 몇번 렌더링이 되는걸까..?

### Virtual DOM
`Virtual DOM`이란 `DOM`을 추상화한 가상의 객체를 메모리에 만들어놓는것이다.

<br>

위처럼 사용자에 의해 변경사항이 있다면 `DOM`에 직접수정하는것이 아니라 중간단계로 `Virtual DOM`을 수정하고, `Virtual DOM`에서 기존의 값과 변경된 값을 감지하여 `DOM`을 한번만 렌더링 시킨다.

### 영상
* [VirtualDOM and React](https://www.youtube.com/watch?v=muc2ZF0QIO4)