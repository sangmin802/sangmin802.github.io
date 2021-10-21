---
title: ⚛ React state batch updating 이슈
date: 2021-10-21 18:14:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`에서 `render`에 영향을 주는 `setState`를 통해 `state`에 대한 업데이트 요청은 비동기로 전달된다.

또한, `React`는 상태값을 업데이트 할 때 모든 요청에 따라 바로바로 `rerender`가 되는것이 아닌 변경사항을 모아서 한번에 일괄 처리한다고 한다.

모든 요청에 각각 반응하여 `rerender`를 하는것보단, 단 한번의 `rerender`를 통해 성능 향상을 위함이라고 한다.

`React`공문 에서는 `setState`에 대해 이런식으로 표현했다.

> **상태 업데이트는 비동기식일 수 있습니다.**
> React는 setState()성능을 위해 여러 호출을 단일 업데이트로 일괄 처리할 수 있습니다 .

```js
import './styles.css'
import React from 'react'

export default function App() {
  const [state, setState] = React.useState(0)
  const [state2, setState2] = React.useState(0)

  React.useEffect(() => {
    for (let i = 0; i < 10; i++) {
      setState(i)
      setState2(i)
    }
  }, [])

  React.useEffect(() => {
    for (let i = 10; i < 20; i++) {
      setState(i)
      setState2(i)
    }
  }, [])

  console.log(state, state2)

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}

// console
// 0 0
// 19 19
```

이전 `class`에서 동일한 이벤트 내에서 여러번의 `setState`는 병합의 방식으로, `hook`을 사용한 `setState`는 대체의 방식으로 진행된다.

### 예외적인 상황

`intersectionObserver`는 사용자의 스크롤이 어느 지점을 넘어섰을 때 발생하는 이벤트이다.

기존 스크롤 이벤트는 여러번 이벤트가 호출 될 수 있다는 점에서 `throttling`을 함께 사용했었는데, 이를 대신해주어서 `infinite scroll`을 구현할 때 사용하곤 한다.

`intersectonObserver`의 조건에 도달했을 때, 아래와 같은 함수가 호출되도록 작성을 하였다.

> 실제로 이런 코드는 아니였고.. 간단하게 수정하였다.

```js
const [state, setState] = useState(0)

const handleGetData = useCallback(() => {
  console.log('setState 1')
  setState(1)
  console.log('setState 2')
  setState(2)
}, [])

console.log(state)
```

가장 아래에 작성된 `console`은 `rerender` 작동 여부를 파악하고자 작성을 했는데 예상하지 못한 결과를 보였다.

`setState`를 통한 요청은 비동기로 전달되기 때문에, 아래와 같은 결과를 반환한다고 생각했다.

```js
// 'setState 1'
// 'setState 2'
// 2
```

하지만 작동을 하였을 때 실제로 보인 결과는 이러했다.

```js
// 'setState 1'
// 1
// 'setState 2'
// 2
```

각각의 `setState`요청들이 비동기로 전달되어 `batch`로 병합을 통해 단 한번의 `rerender`만 발생하는것이 아니라, 각각의 `setState`요청에 대해 변경되는 상태값에 대해 바로바로 `rerender`가 발생했다.

비슷한 결과를 보였던 예제가 한가지 더 있다.

```js
const [testState, setTestState] = useState(0)
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const async = useCallback(async () => {
  setLoading(true)
  setTestState(1)
  try {
    const data = await (function() {
      return new Promise(res => {
        setTimeout(() => {
          res('done')
        })
      })
    })()
    setData(data)
    setLoading(false)
  } catch (error) {
    setError(error)
    setLoading(false)
  }
}, [])

useEffect(() => {
  async()
}, [async])

console.log(testState, data, loading)

console.log(testState, data, loading)
```

`React-Query`나 `Redux-Saga`를 사용하지 않고, `React Hook`만을 사용하여 비동기작업을 처리하고자 할 때 이런식으로 작성할 것이다.

위의 결과를 미리 보자면

```js
// 0 null false
// 1 null true
// 1 "done" true
// 1 "done" false
```

`setLoading(false)`와 `setTestState(1)`은 비동기로 전달이 되고, 한번의 `rerender`를 위해 잘 병합되어 상태값이 업데이트 되었다.

하지만, `await`이후의 `setState`들은 각각의 요청에 별도의 `rerender`를 갖고있다.

위의 두가지 상황에 있어서는 공통점을 하나 갖고있다.

## state batch updating의 예외상황

1. `intersectionObserver`
2. `Promise.then`

`intersectionObserver`는 `element`가 보이는지 안보이는지에 따라 **비동기**로 이벤트를 처리해준다.

`await`은 `Promise.then`으로 대표적인 **비동기** 작업이다.

`async/await`, `then/catch`, `setTimeout`, `fetch`와 같은 비동기 동작을 사용하는 핸들러 내부의 `setState`들은 `batch`작업이 이뤄지지 않는다고 한다.

따라서, `await`이전의 `setState`들은 `batch`가 정상적으로 진행되었지만, `.then`이후의 콜백함수에 해당되는 `setState`들은 비동기작업과 관련된 핸들러 내부에 위치하고 있기 때문에 `batch`가 작동되지 않았던것 같다.

## React18

`React`의 18버전에는 모든 경우에 `batching` 에 대해 많은 이슈가 있는것 같다.

- [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)

> React 18 adds automatic batching for all use cases to improve performance even further. Now, React batches state updates in React events handlers, promises, setTimeout, native event handlers and so on.

## 느낌

`setState`가 작동되는 방식에 있어서 생각보다 많은부분에서 성능을 고려해주는것 같다.

사실, 위의 2번째 상황과 같은 비동기작업 처리에 있어서는 여러개의 상태값이 변화될수 있다는 점이나, 에러핸들링과 같이 로직이 길어질 수 있다는 점을 고려해보았을 때 `useReducer`를 사용하는것이 더 적합해보이기도 한다.

> `SUCCESS`, `FAIL`라는 액션으로 분리하고, 그에 맞는 복수의 상태값변경 및 로직 작성

최근 `React`나 `React Hook`등의 작동원리같은 디테일한 부분에 호기심이 생겨서 더 알아보는 중이다.

적어도 내가 사용하는 프레임워크, 모듈에 대해서는 깊은 이해를 갖고 있어야겠다는 생각을 하고 있다.

## 참조

- [state batch updating](https://medium.com/swlh/react-state-batch-update-b1b61bd28cd2)
- [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)
- [React 18 introduces Automatic Batching](https://www.bigbinary.com/blog/react-18-introduces-automatic-batching)
