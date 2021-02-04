---
title : "TypeScript로 바꿔보자3"
date : 2020-12-29 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# Loa-Hands
* 이전에 만들었던 앱을 타입스크립트로 바꿔보려한다.
* `reducer`부분의 수정과, `Header`부분을 손봐보았다.

## Reducer
* `RootState`에는 `HomeData`와 `UserData`가 해당 class를 타입으로 갖고있는데, 이전에 지정해주었던 `IInitalState`은 `null`의 타입만을 허용하고 있었다. 따라서, `useSelector`로 해당 `state`를 확인했을 때, `IInitalState`와 `RootState`의 유니온타입들중 유일하게 겹쳐서 유효한 속성은 `isLoading`뿐이라, homeData의 값을 설정할 수 없었다.
* 또한, 이후 하위컴포넌트에 속성으로 homeData를 보내고자 할 때, 유니온타입이 아닌 homeData타입을 갖고 갈 수 있도록, 재지정해주었다.
  <div style="text-align : center">
    <img src="/img/2020/12/25/5.PNG?raw=true" alt="5">
  </div>
  <br>
  <div style="text-align : center">
    변경
  </div>
  <br>
  <div style="text-align : center">
    <img src="/img/2020/12/29/1.PNG?raw=true" alt="1">
  </div>

## HeaderContainer
* 기존 `function`으로 시작하는 컴포넌트에서, `React.FC`의 타입을 갖는 함수로 다시 만들어주었다.
* `useSelector`에서 받아오는 `state`의 타입은 이전에 생성했던 `RootState`를 연결해준다.
* `react-redux`공문을 보니, `dispatch`는 `useDispatch`를 통한 결과값이므로 별도의 타입을 지정해줄 필요가 없다하여 모두 지웠다.
  <div style="text-align : center">
    <img src="/img/2020/12/29/2.PNG?raw=true" alt="2">
  </div>

## Header
* 기존 `function`으로 시작하는 컴포넌트에서, `React.FC`의 타입을 갖는 함수로 다시 만들어주었다.
* 받아오는 속성들의 `interface`를 미리 구현해주었다.
* 실행되는 `dispatcher`들은 실행될 때, 제너릭으로 해당 타입을 `interface`로 보내주도록 했다.
  > 처음에는 해당 메소드가 실행될 때, 해당 메소드가 생성되는 상위의 `HeaderContainer`에 제너릭으로 작성해야된다 생각했는데, 아니였다.
  <div style="text-align : center">
    <img src="/img/2020/12/29/3.PNG?raw=true" alt="3">
  </div>