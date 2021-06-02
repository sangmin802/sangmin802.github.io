---
title: 'Jest, React-Test-Library'
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

단위 테스트를 할 때에는 아래의 구조로 시작하는게 국룰인것 같다.

```ts
test('테스트 이벤트 명', () => {})
```

### Matchers

Jest에서 `Matchers`는 결과값을 테스트할 수 있는 여러 `API`들을 의미한다.
기본적으로 `expect().Matcher APIs` 형식으로 진행되는 느낌이다.
`expect()`로 테스트 진행의 대상이 되는 작업(메소드, 컴포넌트)들이 들어가고 해당 메소드는 실제 결과물인 `expection` 객체를 반환한다고 한다.
이후의 `Matcher APIs`를 통해 내가 예상하고 원하는 결과물과 비교하는것 같다.
반환되는 `expection` 객체에 따라 사용되는 `API`가 다른듯 함

여러가지 비교 `API`들이 있고 `promise`, `async await` 과 같은 비동기작업의 테스트도 가능하다.

React의 라이프사이클과 같은 순서가 테스트 파일에도 존재하는것 같다.

- `beforeAll` : 해당 테스트 파일 내 모든 테스트 작업 전에 한번만 실행되는 메소드
- `beforeEach` : 각각의 모든 테스트 작업이 전에 실행되는 메소드
- `afterAll` : 해당 테스트 파일 내 모든 테스트 작업 종료 후에 한번만 실행되는 메소드
- `beforeAll` : 각각의 모든 테스트 작업 종료 후에 실행되는 메소드

또한, 테스트 내에 스코프(영역)을 지정해 줄 수 있는 메소드도 존재했다.
`describe`를 통해, 스코프를 지정해주고 위의 라이프사이클도 내부에서 별도로 동작할 수 있었다,

```ts
beforeAll(() => console.log('1 - beforeAll'))
afterAll(() => console.log('1 - afterAll'))
beforeEach(() => console.log('1 - beforeEach'))
afterEach(() => console.log('1 - afterEach'))
test('', () => console.log('1 - test'))
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'))
  afterAll(() => console.log('2 - afterAll'))
  beforeEach(() => console.log('2 - beforeEach'))
  afterEach(() => console.log('2 - afterEach'))
  test('', () => console.log('2 - test'))
})

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

### Mock

moking은 단위 테스트를 작성할 때, 해당 코드가 의존하는 부분을 가짜(mock)로 대체하는 기법이라고 한다. 아무래도 테스트 하려는 코드가 의존하는 부분을 직접 생성하는것은 부담스럽기 때문에 mocking을 많이 사용한다고 한다.
예로, 데이터베이스의 crud 작업에 대한 테스트를 작성할 때 실제 데이터베이스를 사용하게된다면 여러 불편함과 문제가 있을 수 있다.
이럴 때, 가짜 객체를 생성하여 테스트를 진행하는것이다.

#### jest.fn()

가짜함수를 생성하는 함수이다. `fn()`의 인자로 결과물을 반환하는 작업(메소드를) 보내줄 수 있다.

> `const mockCallback = jest.fn(x => 42 + x);`

생성된 인스턴스에는 `.mock` 속성이 존재한다. 해당 인스턴스는 아래와 같은 속성들을 갖고있다.

```ts
mock = {
  calls, // 실행될때마다 받은 변수 배열
  instances, // 변수가 아닌 바인딩된 객체등의 인스턴스
  invocationCallOrder, // 해당 모의함수(mock) 인스턴스가 실행된 횟수
  results, // 초기 모의함수가 생성될 때 보내진 작업의 결과값
}
```

`mockReturnValue`를 통해 생성된 모의함수의 고정된 결과값을 지정해줄 수 있다.
`mockReturnValueOnce`를 통해 생성된 모의함수의 순차적인 결과값을 지정해 줄 수 있다.

```ts
test('test', () => {
  const myMock = jest.fn()
  myMock.mockReturnValueOnce(false).mockReturnValueOnce(true)

  const result = [11, 12].filter(num => myMock(num))
  console.log(result) // 12
  console.log(myMock.mock)
  //   {
  //    calls: [ [ 11 ], [ 12 ] ],
  //    instances: [ undefined, undefined ],
  //    invocationCallOrder: [ 1, 2 ],
  //    results: [ { type: 'return', value: false }, { type: 'return', value: true } ]
  // }
})
```
