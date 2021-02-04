---
title : "TypeScript로 바꿔보자4"
date : 2020-12-30 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# Loa-Hands
* 이전에 만들었던 앱을 타입스크립트로 바꿔보려한다.
* `UserInfo`의 일부분을 변경하였다.

## UserInfoContainer
* `userInfo`의 비즈니스로직을 관리하는 컨테이너이다.
* 각종 액션을 호출하는 디스패쳐들이 생성되는 곳인데, `History`변수의 타입을 지정해주기가 애매했다. 따라서, `Parameters`유틸리티를 사용하여, 액션에서 받는 변수의 타입을 가져와서 사용하였다.
  <div style="text-align : center">
    <img src="/img/2020/12/31/1.PNG?raw=true" alt="1">
  </div>
* `react-router`의 `match`속성을 사용하기때문에, 맞는 타입을 지정해줘야하는데, 해당 모듈에서 타입스크립트를 위해 `RouteComponentProps`를 제공하고있더라.
* 구조를 살펴보니 내가 필요한 속성값의 타입을 보낸것을 제너릭 변수로 받아서 적용해주는것 같다.
  <div style="text-align : center">
    <img src="/img/2020/12/31/2.PNG?raw=true" alt="2">
  </div>

## UserInfo & 몇몇 프리젠테이셔널 컴포넌트
* 컨테이너 컴포넌트에서 필요한 인터페이스들을 만들어서 내보내주고 있기때문에, 그대로 가져와서 사용하면 됬다.
  <div style="text-align : center">
    <img src="/img/2020/12/31/3.PNG?raw=true" alt="3">
  </div>
  > 혹시, 타입도 `props`로 보낼 수 있나..?