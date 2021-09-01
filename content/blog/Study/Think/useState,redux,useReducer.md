---
title: ⚛ useState, Redux 그리고 useReducer
date: 2021-09-01 15:30:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`에서 기본적으로 제공되는 `useState`를 사용하여 상태값과, 상태값을 업데이트할 수 있는 `setState`메소드를 생성할 수 있다.

아무렇지도 않게 사용해오던 `setState`에 알지못했던 세부적인 내용이 있었고, 이 세부적인 내용이 이전에 개인프로젝트를 하면서 발생했던 에러와 큰 관련이 있어 알아보게 되었다.

## setState는 의존성 배열에서 필요가 없다.

`useCallback`과 같은 메모이제이션 `hook`을 사용할 때 상태값 변경을 위한 `setState`를 의존성배열에 추가하는 경우가 있었는데, `setState`자체로는 `rerender`에 아무런 영향을 미치지 않기 때문에 추가할 필요가 없다고 한다.

> 실제로 추가하지 않아도, `eslint`에서 아무런 에러를 발생시키지 않는다.

## 이벤트 핸들러 내에서 비동기적으로 작동되는 setState

이벤트 핸들러 내에서 `setState`는 비동기 방식으로 작동된다고 한다.

동일한 이벤트 호출을 통해 내부에서 여러번의 `setState`가 호출된다면, 모든 변화를 하나로 합쳐서 호출된 이벤트 핸들러가 종료될 때 단 한번만 `state`에 직접적인 변화가 일어난다.

`class`기반의 `setState`는 이를 동일한 `key`에대해 병합이 이뤄졌고
`hook` 기반의 `setState`는 병합이 아니라 대체의 개념을 갖고있다.

```js
setState(count + 1)
setState(count + 1)
```

위처럼 두번 호출하여 원하는 결과가 `2`일것 같은 방법도 병합 혹은 대체의 과정을 통해 `1`의 결과를 반환한다.

## 함수형 setState

```js
setState((oldState) => {...oldState, newVal})
```

`setState`에 콜백함수를 사용하여 상태값을 업데이트할 수 있다.

이전의 상태값에대한 정보를 조회할 수 있으며, 이를 바탕으로 업데이트 하여 대체할 수 있다.

이 특징에 있어서는 이전에 다뤘던 `useCallback`을 통한 메모이제이션과도 큰 관련이 있을것 같다.

만약, 객체로된 상태값을 `useCallback`의 의존배열에 추가하여 메소드를 생성하고있을 경우, `setState`로 객체에 변경이 있을 때 계속해서 메소드를 재생산하게될 것이다.

하지만, `setState`는 의존성 배열에 추가될 필요가 없다는 특징을 이용해보았을 때 처음에만 메소드를 생성하고, 이후에는 캐싱된 메소드로만 사용 가능할것 같다.

```js
const func = useCallback((state) => {
  setState({ ...states, state })
}, [states])

const func = useCallback((state) => {
  setState((oldState) => {...oldState, state})
}, [])
```

## 단일 state? state 분리?

`useState`를 사용하여 상태값을 관리하고자 할 때, 선택할 수 있는 방법이 두가지 있다.

여러 속성을 하나의 `useState`로 묶어서 사용할 것인가?

속성들을 분리하여 각각의 `useState`를 통해 생성할 것인가?

### 분리 state

```js
const [position, setPosition] = useState({ x: 100, y: 50 })
const [size, setSize] = useState({ width: 500, height: 30 })
```

상태값을 분리하여 생성하게 될 경우, 상태값을 대체하는데에 비교적 편리할 수 있다.

사실 가장 큰 이점으로 볼 수 있는 점은, 각각의 `hook`들을 커스텀 훅으로 분리하여 사용할 수 있다는 점이다.

> 추상화에 큰 도움이 된다.

### 단일 state

```js
const [state, setState] = useState({ x: 100, y: 50, width: 500, height: 300 })
```

`x`의 값을 변경하는데에 `width`라는 속성이 필요해서 하나의 `state`로 합쳐서 생성하였다. 서로간 연관되어있는 속성들끼리 함께 묶어서 생성하여 업데이트할 때 참조하는데에 편리함이 있다.

나쁜방법은 아니지만, `useState.setState`는 대체라는 특징으로 인해 꼭 필요한 과정이 추가된다.

```js
setState((oldState) => {...oldState, x : 700})
```

늘 상태값이 대체되기 때문에, 일부분을 변경하게 된다면 이전 값에 대한 복제의 작업이 필요하다.

## 여러 상태값에 대한 참조, 이전 상태값의 필요, 메모이제이션 의존성 문제

웬만한 상황에서는 `useState`를 사용하여 상태값을 구성할 때 하나의 단일 보다는 구분하여 생성하는것이 더 효율적이다.

하지만 예외적인 상황이 있다.

1. 상태값을 업데이트하는데 다른 상태값을 참조해야한다.

이 문제에 있어서는 `useEffect`, 혹은 메모이제이션을 위한 `useCallback`을 사용할 때 더 크게 필요를 느끼게된다.

자신의 상태값이 자주 변동되어서 `setState` 를 함수형식으로 전달하여 내부의 이전 `state`값을 참조하여 생성을 할 수 있어서 `useCallback`, `useEffect`들의 의존성배열을 비워 재생산, 재실행 되는것을 막을 수 있다고 위에서 설명했었다.

하지만, `state`분리를 통해 각각의 상태가 서로를 참조할 수 있는 방법이 의존성배열밖에 없는 상황이라면?

이것을 어쩔수 없는 재생산, 재실행이라고 보는것이 맞을까?

그 비용이 어마어마해진다면 어떨까?

## Redux

위 문제를 보았을 때 생각나는것이 있다.

`Redux`

1. 중앙상태관리를 통해 다른 상태를 참조하여 상태값을 업데이트하는 로직을 생성할 수 있다.
2. 상태값을 업데이트 할 때, 이전의 상태값을 기반으로 업데이트 할 수 있다.
3. `Redux`의 `Dispatch`또한 마찬가지로 `rerender` 에는 영향을 주지 않기 때문에 `useEffect`, `useCallback`의 의존성 배열에 추가될 필요가 없다.

알게모르게 `Redux`가 많은 고민을 해주고 있었다.

하지만 늘 느껴왔지만, `Redux`를 사용하기위해서는 많은 셋팅이 필요하다.

이러한 특징때문에 `Redux`를 개발한 개발자들도 `Redux`를 사용하는데 적합성을 판단하는것이 중요하다고 하더라.

## useReducer

`useReducer hook`을 사용하여 비교적 편리하게 `Redux`의 장점을 가져올 수 있었다.

아마 `Redux`를 사용해보았다면, 빠르게 이해하고 적용해볼 수 있을 것이다.

```js
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const handleDecrese = useCallback(() => {
    dispatch({ type: 'decrement' })
  }, [])
  const handleIncrease = useCallback(() => {
    dispatch({ type: 'increment' })
  }, [])
  return (
    <>
      Count: {state.count}
      <button onClick={handleDecrese}>-</button>
      <button onClick={handleIncrease}>+</button>
    </>
  )
}
```

`React` 공식문서에서 설명되어있는 예제를 살짝 수정해보았다.

1. `dispatch`메소드는 `rerender`에 아무런 영향을 주지 않기 때문에, 의존성 목록에 추가해줄 필요가 없다.
2. 이전의 상태값에 대한 정보를 사용하고 반영할 수 있다.
3. 다른 상태값에 대한 참조가 필요한 경우, 공통된 `state`에서 찾아 사용할 수 있다.
   > 특히나, 기존에 `useEffect`, `useCallback`등이 의존하고 있는 상태값의 변화가 잦을 수록 좋다.
4. 상태값을 업데이트하는 로직의 규모가 커질수록 구분하여 관리하기 좋다.
5. `setState`가 아닌 별도의 `action`으로 구분하여 호출하기 때문에, 여러개의 상태값에 대한 업데이트가 용이하다.

공식문서에서 설명된 특징들과 경험해본 느낌을 간추려본 장점들이다.

대부분의 상황에서는 `useState`와 `custom hook`이 좋아보이지만, 위와같은 상황일 경우에는 `useReducer`가 더 적합할 수 있을것 같다.

특히, 이전에 진행했던 `socket.io`를 통한 실시간채팅과같이 짧은 순간순간에 `setState`가 여러번 발생하여 의존성배열 변경으로 인해 메모이제이션의 의미가 많이 퇴색되는 상황에서는 더 빛을 볼 것 같다.

## 참조

- [React State hook](https://ko.reactjs.org/docs/hooks-state.html)
- [React 하나 또는 여러 state 변수 사용?](https://ko.reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)
- [React 종속성이 자주 변경되는 상황](https://ko.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)
- [React additional hook](https://ko.reactjs.org/docs/hooks-reference.html#additional-hooks)
- [hook, state, reducer](https://adamrackis.dev/state-and-use-reducer/)
