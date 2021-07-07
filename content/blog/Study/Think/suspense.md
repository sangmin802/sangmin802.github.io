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
