---
title: 'Jest, Reac-Test-Library'
date: 2021-05-06 15:47:00
category: 'Study'
draft: true
tag: 'CS'
---

## react-testing-library

리액트에서 만들어진 DOM들을 테스트할 수 있도록 도와주는 도구인것 같음.
React 컴포넌트의 구성 요소들에 대해 렌더링과 같은 테스트를 진행할 수 있도록 도움

테스트 코드를 작성할 때에는 각각의 역할을 갖고있는 여러 라이브러리가 함께 사용되어야 한다고 함.
Test Runner - Mocha, Jasmin
Test Matcher - Chai, Expect
Test Mock - Sinon, Testdouble
해당 라이브러리들은 유사하지만, 살짝식 다른 API를 갖고있어서 혼선을 주었었다 함

이러한 불편함을 줄이기 위해 등장한것이 Jest

## react-test-renderer

`react-test-renderer`를 사용하면 React 컴포넌트를 순수한 Javascript 객체로 렌더링 하여 사용할 수 있다고 함. 따라서, 결과물의 변경감지, 특정 노드 테스트등이 네이티브 환경에서도 가능하다고 함

## Jest

테스트를 위한 여러 라이브러리를 합친 상태로 등장하면서 하나의 테스트 프레임워크라 불리고 있음.

## react-testing-library, Jest

React 컴포넌트의 구성요소까지 테스트 위한 라이브러리 `react-testing-library`와 별도의 여러 라이브러리를 받아올 필요 없이 하나로 합쳐진 `Jest`를 통해 테스트 코드 작성
즉, 서로가 다른 역할을 갖고 있고 도와주는 형태
물론 `react-testing-library`만 갖고 위에 설명된 `Mocha`, `Expect` 같은 라이브러리를 수동으로 받아서 작업할 수 있다고 함. 하지만 `Jest` 만 받으면 모든게 됨 `create-react-app`은 두가지가 설치된 상태로 넘어옴

## Jest APIs

### Matchers

Jest에서 `Matchers`는 결과값을 테스트할 수 있는 여러 `API`들을 의미한다.
기본적으로 `expect().Matcher APIs` 형식으로 진행되는 느낌이다.
`expect()`로 테스트 진행의 대상이 되는 작업(메소드, 컴포넌트)들이 들어가고 해당 메소드는 실제 결과물인 `expection` 객체를 반환한다고 한다.
이후의 `Matcher APIs`를 통해 내가 예상하고 원하는 결과물과 비교하는것 같다.
반환되는 `expection` 객체에 따라 사용되는 `API`가 다른듯 함
