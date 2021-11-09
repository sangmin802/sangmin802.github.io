---
title: 'DOM 과 Virtual Dom'
date: 2020-10-21 00:00:00
category: 'Study'
draft: false
tag: 'Think'
---

### 🤔 의문

이전 `Kotlin`으로 간단한 로스트아크 유저검색 앱을 만든 뒤, 취미? 개념으로 `React`를 써서 조금 더 규모있게 웹 앱을 만들고 있다. 물론.. 공식적으로 제공되는 API가 아니라 완성된 DOM을 하나하나 뜯어서 정보를 추출하고 있기때문에 시간은 좀 걸리더라 ㅎㅎ; 그래도 재미는 있으니 다행

구글링 중 `React`와 관련이 깊다는 `Virtual DOM`이라는 용어를 보았는데, `React`를 사용하는데도 해당 용어가 낯설어서 알아보기로 했다.

### DOM

기본적으로 우리는 View 화면을 구성할 때, HTML Elements등을 활용하여 구조를 짜면 브라우저가 그것을 읽고 렌더링을 하게된다.

<br>
<br>
이후 우리는

```javascript
document.getElementById('Hello').innerHTML = '안녕' // 첫번째 렌더링
document.body.style.background = 'tomato' // 두번째 렌더링
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

위처럼 사용자에 의해 변경사항이 있다면 `DOM`에 직접수정하는것이 아니라 중간단계로 `Virtual DOM`을 수정하고, `Virtual DOM`에서 기존의 값과 변경된 값을 감지하여 필요한 부분만 변경을 시킨다.

이 때, `React`는 업데이트를 할 때, 노드간의 속성 비교 등으로 구분을 하는데, `map`과 같은 메소드로 비슷한 구조의 노드가 여러개 생성될 경우 고유한 값을 `key`로 하여 구분짓는다.

생성되는 `DOM`노드들의 변화가 없이 정적이라면 `map`에서 제공하는 `index`를 사용해도 무방하지만, 변화가 있는 경우에는 `id`같은 고유한 값을 사용해주어야 한다.

> 예제를 살펴보니, `input text`와 같은 노드들의 `index`가 바뀌니 입력한 값들은 이동되지 않고 아래로 누락되는? 에러가 발생했음

어쩄든, `Virtual DOM`은 `SPA` 특성상 `DOM`에 렌더링이 지속적으로 자주 발생하는점에 대해 `reflow`가 여러번, 많이, 모든 노드에 발생하는 성능상의 문제를 개선하기 위해, 필요한부분만, 변화를 모아서 일괄처리해주어 성능개선에 도움을 준다고 한다.

### 영상

- [VirtualDOM and React](https://www.youtube.com/watch?v=muc2ZF0QIO4)
- [why virtual dom](https://velopert.com/3236)
- [react virtual dom](https://programmingwithmosh.com/react/react-virtual-dom-explained/)
