---
title: 'Jest, React-Test-Library'
date: 2021-05-06 15:47:00
category: 'Study'
draft: true
tag: 'TestCode'
---

## Jest

테스트를 위한 여러 라이브러리를 합친 상태로 등장하면서 하나의 테스트 프레임워크라 불리고 있음.

## react-testing-library, Jest

React 컴포넌트의 구성요소까지 DOM으로 만들어서 테스트를 할 수 있게 도와주는 라이브러리 `react-testing-library`와 별도의 여러 라이브러리를 받아올 필요 없이 하나로 합쳐진 `Jest`를 통해 테스트 코드 작성
즉, 서로가 다른 역할을 갖고 있고 도와주는 형태
물론 `react-testing-library`만 갖고 위에 설명된 `Mocha`, `Expect` 같은 라이브러리를 수동으로 받아서 작업할 수 있다고 함. 하지만 `Jest` 만 받으면 모든게 됨 `create-react-app`은 두가지가 설치된 상태로 넘어옴

## Jest APIs

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
또한 Unit Test(단위테스트)는 외부환경에 의존하지 않고 독립적으로 실행되야한다는 점에서 위배된다.
이럴 때, 가짜 객체를 생성하여 테스트를 진행하는것이다.

생성된 mock함수 인스턴스에는 `.mock` 속성이 존재한다. 해당 인스턴스는 아래와 같은 속성들을 갖고있다.

```ts
mock = {
  calls, // 실행될때마다 받은 변수를 담은 이중배열
  instances, // 변수가 아닌 바인딩된 객체등의 인스턴스
  invocationCallOrder, // 해당 모의함수(mock) 인스턴스가 실행된 횟수
  results, // 초기 모의함수가 생성될 때 보내진 작업의 결과값
}
```

#### jest.fn(), jest.spyOn()

`jest.fn()`을 통해 mock 함수를 만들 수 있다. 생성된 mock 함수의 결과값을 지정해 줄 수 있다.

```ts
describe('Mock fn', () => {
  let mockFn = null
  beforeEach(() => {
    mockFn.mockClear()
    mockFn = jest.fn()
  })

  it('mockReturnValue', () => {
    mockFn.mockReturnValue('Mock 함수 입니다.')
    console.log(mockFn()) // 'Mock 함수 입니다.'
  })

  it('mockReturnValueOnce', () => {
    mockFn.mockReturnValueOnce(false).mockReturnValueOnce(true)
    const result = [11, 12].filter(num => mockFn(num))
    console.log(result) // 12
    console.log(mockFn.mock)
    //   {
    //    calls: [ [ 11 ], [ 12 ] ],
    //    instances: [ undefined, undefined ],
    //    invocationCallOrder: [ 1, 2 ],
    //    results: [ { type: 'return', value: false }, { type: 'return', value: true } ]
    // }
  })

  it('mockResolvedValue', () => {
    mockFn.mockResolvedValue('비동기 Mock 함수 입니다.')
    mockFn().then(res => console.log(res)) // '비동기 Mock 함수 입니다.'
  })

  it('mockImplementation', () => {
    mockFn.mockImplementation(name => `I am ${name}`)
    console.log(mockFn('상민')) // 상민
  })

  it('mockFn props', () => {
    mockFn('a')
    mockFn(['b', 'c'])

    expect(mockFn).toBeCalledTimes(2)
    expect(mockFn).toBeCalledWith('a')
    expect(mockFn).toBeCalledWith(['b', 'c'])
  })
})
```

`jest.spyOn`의 경우, 외부 모듈에 감지하는 스파이를 붙여놓는 개념이기 때문에 상호 의존성이 생길 수 있어 `jest.fn()`으로 새로운 가상의 mock 모듈을 만드는 것이 더 좋다고 한다.

`fetch`, `axios` 등의 기본 자바스크립트 `api`에도 사용 가능하다.

> 해당 모듈의 속성에 접근하는 방식

```ts
const calculator = {
  add: (a, b) => a + b,
}

describe('Mock spy', () => {
  it('spy fn', () => {
    const mockSpy = jest.spyOn(calculator, 'add')
    const result = calculator.add(2, 3)
    console.log(mockSpy.mock)

    expect(mockSpy).toBeCalledTimes(1)
    expect(mockSpy).toBeCalledWith(2, 3)
    expect(result).toBe(5)
  })
})
```

비동기 `API`를 테스트 하는 예제이다. `spyOn`을 사용하여 기존의 메소드를 감지하는 방식이기 때문에, 서버 종료나 잘못된 url등 에러가 발생하면 테스트코드가 진행되지 않기 때문에, `fn`으로 새로운 mock 함수를 만들어서 사용하는것이 독립성이 중요한 유닛테스트에 적합하다.

```ts
describe('Mock function example', () => {
  it('get some async data with axios', async () => {
    axios.get = jest.fn().mockResolvedValue({ data: { id: 1, name: '상민' } })
    const user = await axios.get('some url').then(res => res.data)
    console.log(user) // { id: 1, name: '상민' }

    axios.get.mockClear()
  })

  it('get some async data with fetch', async () => {
    // console.log(global.fetch); -> [Function: fetch]
    global.fetch = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, name: '상민' } })
    global.fetch.mockClear
    // console.log(global.fetch); ->  [Function: mockConstructor]
    const { data } = await fetch('url')
    console.log(data) // { id: 1, name: '상민' }

    global.fetch.mockClear()
  })
})
```

mock 함수를 만들기 전에는 원본의 메소드로 존재하지만, mock 함수를 만들고 난 뒤에 해당 원본 메소드를 검색하면 `[Function: mockConstructor]`라는 결과값이 나온다.

> 즉, 이 테스트 에서는 해당 메소드가 mock 함수로 변경되었다는것을 의미한다고 한다.

따라서, 작업이 끝난 다음에는 해당 mock 인스턴스를 초기화시켜주도록 하자.
`jest.clearAllMocks()`로 모두 초기화하거나, `global.fetch.mockClear()`로 개별 초기화도 가능하다.

```ts
// 초기화 전
global.fetch = {
  calls: [['url']],
  instances: [undefined],
  invocationCallOrder: [2],
  results: [{ type: 'return', value: [Promise] }],
}

// 초기화 후
global.fetch = {
  calls: [],
  instances: [],
  invocationCallOrder: [],
  results: [],
}
```

#### jest.mock()

위에서 `fetch`, `axios`를 mock 함수로 만들어서 사용을 했다. 즉, 모듈 내부에 있는 메소드가 제대로 정의되어있지 않거나 모르더라도 원하는 결과값을 진행하여 이후의 과정을 테스트 할 수 있었다.

하지만, 만약 모듈 내부에 있는 **여러개** 의 메소드를 mock 해야한다면 `jest.fn()`을 여러번 반복하여 만들어줘야 할 것이다.

이를 도와주기 위한 메소드가 `jest.mock(모듈)`이다. 인자로 보내지는 모듈 전체를 mock 함수로 만들어주는것이다.

> `jest.mock(axios)`, `jset.mock(../utils.ts)`
> 해당 모듈 내부의 모든 메소드가 mock 인스턴스화 된다.

이전에 `axios.get = jest.fn()...` 방식으로 mock 한 경우, axios에서 get 속성만 mock 인스턴스가 되었는데, 이 방식으로 하게될 경우 axios 내부의 모든 속성들이 모두 mock 인스턴스화 된다.

```ts
axios = {
  delete: [Function: wrap] {
    _isMockFunction: true,
    getMockImplementation: [Function (anonymous)],
    mock: [Getter/Setter],
    mockClear: [Function (anonymous)],
    mockReset: [Function (anonymous)],
    mockRestore: [Function (anonymous)],
    mockReturnValueOnce: [Function (anonymous)],
    mockResolvedValueOnce: [Function (anonymous)],
    mockRejectedValueOnce: [Function (anonymous)],
    mockReturnValue: [Function (anonymous)],
    mockResolvedValue: [Function (anonymous)],
    mockRejectedValue: [Function (anonymous)],
    mockImplementationOnce: [Function (anonymous)],
    mockImplementation: [Function (anonymous)],
    mockReturnThis: [Function (anonymous)],
    mockName: [Function (anonymous)],
    getMockName: [Function (anonymous)]
  },
  get: [Function: wrap] {
    _isMockFunction: true,
    getMockImplementation: [Function (anonymous)],
    mock: [Getter/Setter],
    mockClear: [Function (anonymous)],
    mockReset: [Function (anonymous)],
    mockRestore: [Function (anonymous)],
    mockReturnValueOnce: [Function (anonymous)],
    mockResolvedValueOnce: [Function (anonymous)],
    mockRejectedValueOnce: [Function (anonymous)],
    mockReturnValue: [Function (anonymous)],
    mockResolvedValue: [Function (anonymous)],
    mockRejectedValue: [Function (anonymous)],
    mockImplementationOnce: [Function (anonymous)],
    mockImplementation: [Function (anonymous)],
    mockReturnThis: [Function (anonymous)],
    mockName: [Function (anonymous)],
    getMockName: [Function (anonymous)]
  },
}
```
