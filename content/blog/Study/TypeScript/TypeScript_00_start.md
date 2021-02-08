---
title : "TypeScript 시작"
date : 2020-12-15 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# TypeScript
* 프론트엔드 개발자들이 가장 선호하는 정적언어라고 한다. 실제로, 대부분 구인글의 우대사항에 TypeScript가 포함되어있는것을 확인해볼 수 있다.
* TypeScript가 생소한언어인것은 전혀 아니다. 이전에 Angular를 사용하면서 접해보았었고, Kotlin에서도 비슷하게 타입을 지정해주는 문법을 사용했었기때문..
> 그때의 TypeScript 느낌은 JavaScript보다 더 내가 예상 가능한 범위에서 작동한다는 느낌? 특히나 Kotlin은 함수의 return값마저 타입을 지정해줄 수 있어, 결과값마저 예상 가능했다.
* Java, C와 같이 타입시스템을 사용하는 언어들은 신텍스오류나 타입오류가 런타임이 아닌 컴파일 환경에서 먼저 발생하기때문에, 사전에 해결할 수 있다.
* VScode에서는 TS파일을 기본적으로 지원하기 때문에, 별도의 설치 없이 인식이 가능하다. 하지만, 리액트 등에서 자바스크립트로 컴파일(번들링)하기위해선 별도의 설치가 필요하다.


## TypeScript와 JavaScript
* 공식문서에 따르면 TypeScript는 JavaScript를 포함하는 영역인듯 하다.
* 큰 차이점은 유형을 지정해주냐 아니냐 이다.
* 리액트에서는, TypeScript로 만들어진 파일을 JavaScript로 번들링 하고, 이후에 읽는듯 하다.
> TypeScript는 버그 가능성을 낮추어서 개발자들만을 위한 언어인듯 하다.

## 용어
* 런타임 : 실제 프로그램이 실행되고 있는 때
* 컴파일 : 개발자가 프로그래밍한 코드를 컴퓨터언어로 바꾸는 때

## 참조
* [타입스크립트 공식문서](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)