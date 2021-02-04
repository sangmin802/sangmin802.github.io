---
title : "TypeScript로 바꿔보자"
date : 2020-12-24 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
- title : 'TypeScript'
- nav : TypeScript
--- 
# Loa-Hands
* 이전에 만들었던 앱을 타입스크립트로 바꿔보려한다.
* 유저 정보 및, 홈 정보를 받아와서 클래스로 데이터를 관리하는 `Models` 디렉토리를 먼저 손보기로 했다.

## userInfo
* 수집품, 원정대정보, 유저정보를 관리하는 큰 클래스이다.
* 세부 클래스들은 내가 구성한거라, 인터페이스를 만들고 타입을 정의하는데 큰 어려움은 없었다.
* 내부에서 갖고있는 단일 속성들을 모두 정의해주기는 너무 많아서, 인덱싱기능을 사용해보았다.
> 제대로 사용한건진 모르겠지만..
* 인덱싱기능을 사용하면서, 클래스의 모든 속성에 위에서 정의해준 인터페이스도 포함하는지라.. `object`타입도 넣어주긴했다. 맘에 안들긴하지만..
* `AbilityInfo`클래스를 갖는 속성은 그냥 타입을 그것으로 지정해주었다.
<div style="text-align : center">
  <img src="/main/img/2020/12/24/1.PNG?raw=true" alt="1">
</div>

## AbilityInfo
* 능력치정보 클래스에는, 장비정보 및 스킬정보를 가지고있다.
* 장비정보는 장비의 각 부위별(head, weapon, gloves...)등을 key로, 부위 배경이미지와 해당 부위에 착용중인 장비를 갖고있는 객체를 value로 값을 찾아서 갖는다.
> http통신을 한 결과값에서 값을 찾아서 스스로 만드는지라, 장비를 끼고있지 않는 경우도 있어 선택적 옵션을 주었다.
* `IUnknownObj`의 경우, 본래 값으로 `object`를 주었었는데, `IUnknownObj`타입을 갖는 객체의 속성값을 조회하였을 때 `object`에 할당할 수 없다는 에러가 발생하여, 속성값 또한 `IUnknownObj`로 지정하고 타입할당을 `IUnknownObj`로 해주었다.
> 재귀함수같은느낌.. 왠지 위험해보임
<div style="text-align : center">
  <img src="/main/img/2020/12/24/2.PNG?raw=true" alt="1">
</div>

## EquipInfo
* 하나하나의 장비 부위를 구성하는 클래스이다. 크게 문제될건 없었다.
<div style="text-align : center">
  <img src="/main/img/2020/12/24/3.PNG?raw=true" alt="1">
</div>

## SkillInfo
* 유저의 전투스킬, 생활스킬을 담는 클래스이다.
* 최대한 재활용하기 위해, 유니온 타입을 사용하였다.
> 타입도 재귀처럼 자기자신을 사용할 수 있는듯 함..
<div style="text-align : center">
  <img src="/main/img/2020/12/24/4.PNG?raw=true" alt="1">
</div>

## HomeData
* 이벤트나 월간 섬 정보를 관리하는 클래스이다.
* 크게 어려운것은 없었으나, 캘린더에서 이중배열? 을 사용했다.
> 지금생각해보니 저기 `events`내부에 있는 객체또한 인터페이스로 해주는것이 나을 듯 하다.
<div style="text-align : center">
  <img src="/main/img/2020/12/24/5.PNG?raw=true" alt="1">
</div>


## 느낌
* 정말 날것의 데이터를 긁어온것이라, 어떤 형태의 구조를 가지고있는지 알 수 없고, 랜덤한 수준이라 초기에 타입을 잡아주는것이 너무 애매했다..