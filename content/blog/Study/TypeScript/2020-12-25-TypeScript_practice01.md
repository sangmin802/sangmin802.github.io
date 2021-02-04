---
title : "TypeScript로 바꿔보자2"
date : 2020-12-25 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# Loa-Hands
* 이전에 만들었던 앱을 타입스크립트로 바꿔보려한다.
* 중앙 상태를 관리하는 `Redux Hook` 파트를 손보기로 했다.

## Actions
* 각각의 액션을 구성하는 부분이다.
* `ReturnType`유틸리티의 편리함을 크게 느꼈다.
  > 액션의 결과값들을 본래는 하나하나 인터페이스를 구성해야하지만, 해당 유틸리티를 사용하여 결과값 구조를 자동으로 만들어지게 했다.
* `as const`에 대해 좀더 잘 알게되었다
  > 이론상으로 할 때에는 무슨용도인지 잘 몰랐지만, `const 단언`을 통해 객체 내부에 들어가게 되더라도 대체됨을 막아하는 경우에 있어 꼭 필요함을 느끼게 됬다.
  <div style="text-align : center">
    <img src="/img/2020/12/25/3.PNG?raw=true" alt="2">
  </div>
* `Lodash`나 `react-router`와 같이 자주사용되는 모듈은 타입스크립트에서 인터페이스를 만들어주는? 것 같다.
  > `history`의 경우, `@types` 디렉토리에 만들어져있는 인터페이스를 사용해보았다.  
  <div style="text-align : center">
    <img src="/img/2020/12/25/1.PNG?raw=true" alt="1">
  </div>
  > `dispatch`의 경우, `useDispatch`의 `ReturnType`을 사용해보았다.
  <div style="text-align : center">
    <img src="/img/2020/12/25/3.PNG?raw=true" alt="3">
  </div>
* 리듀서에서 변수로 받는 `action`의 타입을 유니온으로 하여 관리하였다.
<div style="text-align : center">
  <img src="/img/2020/12/25/4.PNG?raw=true" alt="4">
</div>


## Reducer
* 초기 상태의 인터페이스를 정의해주었다.
* 앞서, 유니온타입으로 각각의 액션들의 리턴 인터페이스들이 묶인것을 `import` 하여, 타입으로 사용하였다.
<div style="text-align : center">
  <img src="/img/2020/12/25/5.PNG?raw=true" alt="5">
</div>

## Store
* 크게 다를것은 없지만, 리듀서의 타입을 사용해 앞으로 있을 `useSelector`에서 받아오는 `state`의 타입을 마련했다.
<div style="text-align : center">
  <img src="/img/2020/12/25/6.PNG?raw=true" alt="6">
</div>

## 느낌
* 내가 예상할 수 있는 범위라면 하나하나 인터페이스나 타입을 만드는것이 아닌, 유틸리티등을 활용하여 동적으로 인터페이스를 구성하는것이 중요한 듯 하다.