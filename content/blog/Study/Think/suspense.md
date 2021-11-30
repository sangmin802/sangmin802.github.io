---
title: ⚛ React.Suspense를 사용하여 비동기 Pending 관리하기
date: 2021-07-07 15:48:00
category: 'Study'
draft: false
tag: 'Think'
---

이전에 `React-Query`를 사용하여, 비동기 작업을 통해 얻은 데이터를 캐싱하고, 지정한 시간에 따라 최신 여부를 파악하고 업데이트하여 사용자에게 좋은 유저경험을 줄 수 있도록 프로그래밍을 하였다.

이번에는 비동기작업에 마찬가지로 자주 사용해왔던 `isLoading`과 같은 `Pending`상태일 때의 관리를 해보려고 한다.

## 🍜 React Suspense

이전에 `React-Query`의 `suspense` 속성을 통해 데이터가 받아지지 않았다면 이후 렌더링을 중지시켜주기 까지는 성공하였다. 하지만, 그 중지상태일 때의 렌더링에 대해서는 해결하지 못했었다.

`React`에서는 `Suspense`라는 기능을 제공하는데, 해당 기능을 사용하여 `기다리기` 라는 키워드를 갖고있는 상황에 사용을 할 수 있다.

대표적으로, 비동기작업을 진행하면서 발생하는 로딩시간을 **기다리면서** 처리할 작업들을 대체하는 것이다.

### 🥘 useState를 통한 loading

이전까지는 늘 이렇게 비동기 작업을 수행하기 이전에 `loading`이라는 상태값을 변경하여 `UI`를 띄워왔었다

```js
const fetchData = useCallback(async () => {
  try {
    setLoading(true)
    const data = await callback()
    setState(data)
  } catch (error) {
    throw new Error(err)
    setLoading(false)
  }
}, [setLoading, callback, setState])
```

### 🍲 React.Suspense를 통한 loading

비동기로 작업되는 컴포넌트를 `Suspense`로 감싸고, 로딩 때 보여줄 화면을 `fallback` 속성으로 전달한다.

로딩화면을 생성하기 위한 `useState`와 같은 `hook`들이 생성될 필요가 없어졌다.

```js
<Suspense fallback={<LoadingSpinner />}>
  <Event />
</Suspense>
```

> 21-11-30 업데이트

어떻게 가능한것일까?

`React`의 `repository`에 `Suspense`에 대한 세세한 로직을 찾을 수는 없었다.

하지만, `Suspense`를 소개하는 항목에서 한가지 특징을 확인할 수 있는것이 `getDerivedStateFromError` 라는 생명주기이다.

해당 생명주기를 갖고있는 컴포넌트 하위에서 발생한 에러를 포착하고, 다시 `render`를 호출할 수 있다.

그리고 여러 테스트를 해본 결과 단 한가지의 값에는 다른 결과를 보였다.

```js
import React from 'react'

let data = null
let resolve = null

const promise = new Promise(res => {
  resolve = res
}).then(() => {
  data = 'success data'
})

function async() {
  if (!data) throw promise
  return data
}

export default function App() {
  return (
    <div className="App">
      <React.Suspense
        fallback={
          <button
            onClick={() => {
              resolve?.()
            }}
          >
            resolve!
          </button>
        }
      >
        <InnerApp />
      </React.Suspense>
    </div>
  )
}

function InnerApp() {
  const data = async()

  return <>{data}</>
}
```

> `CodeSandbox`에서 실행 가능

임시로 작성해본 코드이긴 하지만 위처럼 하위 컴포넌트에서 `throw`와 같이 이후가 **중단**될 때, 값으로 `Promise`객체가 전달된다면 `fallback` 컴포넌트를 렌더링 하였다.

핵심은 `throw`라는 **중단**과, 완료되지 않은 `Promise` 객체인것 같다.

중단이 되었기 때문에 해당 컴포넌트를 렌더링하는것이 완료되지 않는 상태를 유지한다.

마치, `resolve`가 아직 호출되지 않은 `await` 이후의 로직 혹은 `.then`의 콜백함수를 보는것 같다.

중단이라는 의미를 더 쉽게 이해할수 있도록 보여지는것이, 위와 같이 `throw`된 컴포넌트는 `useEffect`와 같이 `render`가 완료된 이후에 호출되는 생명주기가 호출되지 않는다.

> `mount` 되지 않는상황

위와 같이 실행될 수 있는 조건은, 외부에서 데이터를 받아오는 비동기로직이 즉각적으로 `Promise` 객체를 반환하는것이 아닌 클로저를 통해 상태 변수를 갖고있는 함수가 반환되어야 하는것 같다.

> 공식문서에도 그렇게 설명되어있음!!

그리고, 그러한 일을 대신해주는것이 아래에 소개될 `React-Query`이다.

## 🍣 React-Query + Suspense

```js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      suspense: true,
    },
  },
})
```

`suspense`옵션이 활성화 된 `query`는 비동기 작업에서 `pending`상태일 경우 `React Suspense`에 보내진 `fallback` 컴포넌트를 화면에 띄우게된다.

### 🍱 실제 사용 예시

`Suspense`로 `suspense : true` 상태인 `useQuery`를 포함한 컴포넌트를 감싸주고, `fallback`속성으로 `pending`동안 보여질 컴포넌트를 보내준다.

```js
<Suspense fallback={<LoadingSpinner />}>
  <Event />
</Suspense>
```

`Event`컴포넌트는 `useQuery`를 통해 이벤트 데이터를 받아오게되는데, `query`의 특성상 데이터가 존재하는 경우만을 고려하기 때문에 데이터가 받아지기 전 까지는 컴포넌트가 마운트 되지 않는다.

즉, 여기서 비동기작업이 `pending`상태일 때, `React-Query`를 사용하지 않았다면, `data`가 존재하지 않다는 에러가 뜨거나 로딩여부를 파악할 수 없는 비어있는 화면이 떴었을 것이다.

어떻게 달라지는지 확인해보자

```js
const Event = () => {
  const eventData = useQuery('fetchEventData', () => API.getEventData(), {
    // 화면이 포커싱될 때 데이터를 자동으로 받는기능은 false
    // 개인 취향..
    refetchOnWindowFocus: false,
  })

  return (
    <Styled.Content type="event">
      {eventData.events.map((event, index) => (
        <Styled.Event key={`event${index}`}>
          <Event event={event} />
        </Styled.Event>
      ))}
    </Styled.Content>
  )
}
```

<div style="text-align : center">
  <img src="/img/2021/07/07/2.gif?raw=true" alt="2">
</div>

데이터가 `fetching`중일 때에는, `Suspense`로 보내진 `fallback` 컴포넌트인 `LoadingSpinner`가 노출되다가, `fetching`이 완료되고 `fresh`상태일 때에는, `Event`컴포넌트를 정상적으로 렌더링한다.

## 🍛 에러 핸들링과 불완전함

`React`의 `Suspense`와 `React-Query`를 적절히 사용하여, 데이터의 로딩 상태를 간단하게 구현해낼 수 있었다.

하지만 아직 비동기 작업에서 발생하는 에러에 대한 핸들링에 대해서는 해결하지 못다.

또한, `React`, `React-Query` 모두 `suspense`기능에 있어서는 아직 실험단계라서 불완전한 상태라고 한다.

실제로, 적용한 프로젝트에서도 비슷한 에러가 있었는데 에러 핸들링, 그리고 발생했던 오류에 있어서는 다음에 다시 복기해보자.
