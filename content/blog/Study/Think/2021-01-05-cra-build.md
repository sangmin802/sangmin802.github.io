---
title : "React Build index.html파일의 의문"
date : 2021-01-05 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 

# 🙂 발단
* 최근 기존 프로젝트를 타입스크립트로 변환하면서, 컴파일이 잘 되는지 확인하고자 index.html파일을 로컬에서 실행해보았다.

# 😡 문제
* 잘 될꺼라 생각했지만, 각종 파일을 불러오는 주소가 잘못되어있었고, 혹시나 하는 경로를 재설정해보았지만 여전히 `not found`에러가 발생했다.

# 불편한 해결
* [불편한 해결](https://medium.com/@louis.raymond/why-cant-i-open-my-react-app-by-clicking-index-html-d1778f6324cf)
* 위의 참고한 글을 따라서 `package.json`에 `"homepage":"./"`속성을 주면 http통신이 필요없는 정적인 골격이나 style은 적용되어있지만, 그 외의 것들은 일절 적용되어있지 않았다.
> `stackoverflow`에서 대부분 사람들이, 해당 방법은 전혀 추천하지 않는 방법이라 함.

# 😅 해결
* 해결은 했다.
* 빌드를 할 때, `package.json`에 `hompage`속성이 없다면 아래와 같은 문구가 마지막에 뜨면서 정적서버를 운영하라고 나온다.
<div style="text-align : center">
  <img src="/img/2021/01/05/1.PNG?raw=true" alt="1">
</div>

## 해결 이유
* [개발환경 및 `serve -s build 작동 이유](https://medium.com/javascript-in-plain-english/404-react-page-not-found-355b9352041e)
* 개발 및, 위처럼 `serve -s build`의 명령어가 실행되었을 때에는 `webpack`에 작성된것에 따라, `devserver`가 실행이 되고 거의 모든 요청을 `paths.publicUrlOrPath + index.html`로 리다이렉션 한다고 한다.

# 🤔 근데 왜?
* 해결은 했는데, 왜 React로 빌드 한 앱은 index.html만으로 구동이 안될까?

## 예상
* 암만봐도 `React-Router`가 작동되지 않아, 기본골격 외의 컴포넌트들이 생성되지 않는것 같다.
 1. `Header`는 `Route Component`가 아닌 기본적으로 보이는 컴포넌트라 형성이 되는 것. 그 외의, `<Route path Component={}/>` 형식은 일절 생성 안됨  
 2. 확신을 가진 또 다른 이유는, 유저 검색을 하였을 때 `history` 관련 에러가 발생하는것을 보아, `React-Router`에대해 전혀 인지하고있지 못한거 같음
* 정적 서버와 함께 실행했을 때 `http://localhost:3000/loa-hands`, `index.html`파일을 그냥 실행시켰을 때, `file:///..../index.html`이다.
* react와 같이 SPA의 경우 서버에서 초기에 `index.html`을 던져주고 클라이언트 사이드에서 라우팅이 이뤄지는데, 위와같은 `file:///..../index.html`형식의 주소에서는 `react-router`가 `path`를 읽지 못하는게 아닌가 조심스럽게 예상해본다.
> 어디 좀 가려운곳을 깔끔하게 긁어주는 글이 없나..