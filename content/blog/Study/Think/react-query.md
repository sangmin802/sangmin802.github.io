---
title: ⚛ React-Query를 사용하여 효율적인 비동기 처리하기
date: 2021-07-07 13:18:00
category: 'Study'
draft: false
tag: 'Think'
---

프론트엔드 개발을 하다보면, 거의 필수적으로 하게되는 작업이 있다.

**비동기 작업**

사용자에게 `UI`를 보여줄 때 대부분 이 비동기 작업을 하여 데이터를 받아오고 필요한 작업을 한 다음 완성된 화면을 보여줬었다.

`React`에서 이러한 비동기 작업을 도와주는 `Redux-Saga`와 같은 모듈이 있을 정도로 중요하게 자리잡고 있는 부분이다.

> 사실 `Redux-Saga`를 사용하지 않고 기본 `Hook`들 만으로도 가능해지긴 했다.

## 🍝 늘 작업해오던 대로

아래와 같은 방식 혹은 종종 `Redus-Saga`로 늘 비동기 작업을 해왔었다.
사실 두가지 방법 또한, 필수·수동적으로 해줘야 하는 작업이 있었다.

1. `pending` 상태일 때, 사용자에게 보여질 `UI` 구성
2. `catch`로 에러의 상태가 넘어갔을 때의 에러 핸들링
3. 작업 완료 후, 상태값 변경

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

useEffect(() => {
  fetchData()
}, [fetchData])
```

또한, 위의 비동기작업을 겨처서 받아오는 데이터를 사용하는 컴포넌트에서도 늘 동일하게 보이는 코드들이 있었다.

```js
if(isLoading) return <LoadingSpinner />

return (
  <감싸는 태그>
    {data ? <정상 렌더링 /> : <비정상 렌더링 />}
  </감싸는 태그>
)
```

데이터를 사용하여 만드는 컴포넌트에서 데이터가 존재하지 않고있음에 따른 렌더링도 별도로 해줘야 하는 점.

물론 `data?.something` 과 같이 최근 `ES`시리즈를 통해 비교적 양호해지긴 했지만, 기본 컴포넌트의 목적에 벗어나는 다른 상황의 렌더링도 고려해야하는것은 여전히 존재했다.

심지어, 비동기작업을 통해 발생하는 에러에 있어서는 핸들링을 하는데에 매우 불편함이 있었다.

따라서 `React` 기본 모듈과 그 외부 모듈들을 통해 이 불편함을 해소해보려 한다.

## 🥪 React-Query

`React-Query`의 공식문서에서 설명되는 바로는 `React`에서 서버상태를 가져오고, 캐싱, 동기화, 업데이트하는 작업을 쉽게 수행할 수 있도록 도와주는 모듈이라고 나와있다.

기본적으로 `React`에서는 지금까지 위에서 해왔던 것처럼 개발자가 직접 비동기 작업 환경을 구성해주었어야 했다.

아직 어마어마하게 큰 규모의 애플리케이션을 제작하고, 운영해본 경험은 없었어서 위의 방법도 크게 불편하다는 생각을 느끼지는 못했었다.

하지만, 이후 추가적인 장점들이 있었는데

1. 캐싱
2. 오래된 데이터 업데이트
3. 데이터의 유효기간 설정

위의 기능들에 큰 매력을 느끼게 되었다.

### 🌮 Setting

기본적인 사용으로는 `Redux`, `Router`, `StyledComponent`의 `Provider`처럼 상위 `App`을 감싸주고 `client` 속성을 부여해준다.

`React-Query` 비동기 작업들이 실행될 백그라운드를 생성해주는 작업이라고 한다.

또한, `ReactQueryDevtools`을 통해 생성된 `query`들의 상태들을 확인해 볼 수 있는 개발도구도 제공해주고 있었다.

```js
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      suspense: true,
    },
  },
})

<QueryClientProvider client={queryClient}>
  <ReactQueryDevtools initialIsOpen={false} />
  <App />
</QueryClientProvider>
```

이후, 필요한 곳에서 `hook`처럼 가져다 사용을 하면 되는데 필요한 인자들이 있다.

1. `key` : 해당 `query`가 갖게되는 고유한 `key`인데, 이후 해당 `query`에 직접 접근할 때 필요하니 `유저 검색`과 같이 다른 값들이 참조되는 경우에 꼭 구분되도록 해주는게 좋다.
2. `asyncFunction` : 실제 작업될 비동기 함수.
3. `options` : 재시도횟수, 캐싱 시간, 최신 데이터로 인정하는 시간 등 을 설정해 줄 수 있다.

```js
const { data } = useQuery(key, () => asyncFunction(), {
  retry: false,
})
```

해당 `query`는 캐싱되어있는 데이터가 오래되거나, 참조하고 있는 `key`가 변경될 때 재실행되어 비동기작업을 다시 호출한다.

신기한점이, `suspense: true` 라는 속성을 통해서 **비동기작업이지만 데이터가 존재하지 않는 상황은 고려하지 않게된다**

다소 이해가 안되는 말일수 있는데 위에서 불편하다고 생각했던 컴포넌트가 사용하는 데이터가 존재하지 않는 경우 별도로 진행하는 렌더링 구문을 작성할 필요가 없어지는 것이다.

### 🌯 컴포넌트 렌더링 외의 상황에대한 고려 제거

```js
export function useEvent() {
  const { data: eventData } = useQuery(
    'fetchEventData',
    () => API.getEventData(),
    {
      refetchOnWindowFocus: false,
    }
  )

  return eventData
}
```

이벤트 데이터를 사용해야 하는 컴포넌트이다.

본래 이전과 같았다면, 첫 렌더링 때에는 `eventData`가 존재하지 않기 때문에 그에 따른 렌더링을 따로 정의해주거나, `eventData?.events`와 같은 처리를 해주었어야 했지만 `useQuery`의 `suspense`를 사용하여 그러한 구문들을 사용하지 않아도 에러가 발생하지 않는다.

```js
const Event = () => {
  const eventData = useEvent()

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

기본적으로 `useQuery`를 사용하게 될 경우, 해당 `query`를 통해 데이터가 완전히 받아와지지 않았다면 컴포넌트 자체를 `mount` 하지 않아서 데이터가 존재하지 않는 상황이 아예 없게 구성하는것 같았다.

> 데이터가 없는 상황이 고려대상에서 사라짐

### 🥙 데이터 캐싱 및 최신화

데이터를 처음 받게되면 두가지 3가지의 상태를 가질수 있게 된다.

1. `fresh` : 아직 최신의 데이터로 데이터를 새로 받아올 필요 없음
2. `stale` : 오래된 데이터라서 특정 상황에 새로운 데이터를 받아와야 함
3. `cache` : 새로운 데이터를 받아올 때, 보여줄 캐싱된 데이터

위 상태로 전환되는 시간들 또한 직접 조절할 수 있다.

- `cachTime` : 캐싱시간
- `staleTime` : `fresh`에서 `stale`상태로 넘어가게되는 최소시간

모든 시간은 밀리세컨드를 기준으로 작성해야한다.

```js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      suspense: true,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 3,
    },
  },
})
```

지금은 테스트를 위해 `staleTime`을 `1초`로 바꿔서 진행해보았다.

<div style="text-align : center">
  <img src="/img/2021/07/07/1.gif?raw=true" alt="1">
</div>

1. 데이터를 받아와서 `fresh`
2. 1초 경과
3. 데이터가 오래되었다 판단되어 `stale` 상태로 변환
4. 사용자의 `focus`가 외부에서 해당 앱 내부로 들어왔을 때 다시 `data fetching`
   > 해당 옵션은 `false`, `true`로 변경 가능
5. 새로운 데이터를 받아오지만 `caching`되어있는 데이터가 있어서 해당 컴포넌트가 데이터 없음을 감지하지 않고 바로 리렌더링

위의 순서를 거치게 되는데, 주목할 점은

- 데이터가 스스로 오래됨을 분류하고 특정 조건에 새롭게 데이터를 받아온다.
- 새롭게 데이터를 받아오는 동안에는 컴포넌트가 오작동되는것이 아닌 이전 `caching`된 데이터를 노출하면서 새로운 데이터를 받아오면 자연스럽게 리렌더링 한다.

만약, 늘 최신의 상태를 유지해야 하는 데이터가 아니라면, 사용자에게 불필요한 로딩시간을 줄여주고 계속해서 화면을 볼 수 있다는점은 정말 좋은 유저경험을 제공하게 될 것 같다.

간단한 예시로 `useQuery`만을 사용했는데, 해당 공식문서에는 `infiniteScroll`과 같은 스크롤 할 때마다 새로운 데이터를 받아와 기존 데이터와 합쳐서 렌더링하는 `infiniteQuery`와 같은 여러 상황에 맞는 `query`들이 있어서 필요에 따라 사용하면 좋을것 같다.

## 🧆 에러 핸들링과 pending UI

비동기작업이여도 캐싱을 통해 사용자에게 좋은 경험을 줄 수 있는 `React-Query`를 경험해 보았다.

또한 데이터를 받을 때, `suspense : true` 속성을 통해 아직 데이터를 받지 못한 `pending` 상태라면 이후의 렌더링을 중지하는 듯한 기능을 사용할 수 있었다.

하지만, 아직 그 `pending`상태로 렌더링이 중지되었을 때 이후의 처리와 에러핸들링에 대한 고민은 남아있었다.

이 또한, `React-Query`와 `React`에서 새롭게 소개되고있는 `Suspense`, `ErrorBoundary`로 해결 할 수 있었다.

따라서 다음에 기존 프로젝트에 이 기능들을 반영한 경험을 복기하며 다시 정리해볼 생각이다.
