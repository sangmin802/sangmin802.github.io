---
title: ⚛ React-Query cancel과 Fetch cancel(feat debounce)
date: 2021-08-03 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

웹 어플리케이션을 구현하다보면 거의 대부분 `Web API`를 사용하여 서버로 요청을 보내고, 응답을 받아온 데이터를 사용하게 된다.

이 때, 서버로 요청을 보낼 때에는 특정 조건에 자동으로 실행될 수 도 있고, 사용자의 요청으로 실행될 수 도 있다.

사용자의 요청으로 실행이 될 경우, 그 요청이 무수하게 중첩이 되는 상황이 생길 수 있다.

예로, 검색창에 타이핑을 할 때마다 자동완성을 해오는 기능을 구현하고자 할 때,

`고기` 라는 검색어를 입력하게 된다면 `ㄱ`>`고`>`곡`>`고기` 이런식으로 여러번 자동완성을 하게 된다.

사실 궁금한것은 `고기` 라는 단어가 담긴 다른 단어들이 자동완성되는것을 원하는 상황인데도 그렇다.

가장 마지막 요청만 실제로 서버에 전달할 수는 없을까?

## 그래서 사용해온 debounce

사용자의 가장 마지막 요청만 수행하도록 하는 개념이 바로 `debounce`이다.

```js
export function debounce() {
  let timer
  function debounceAct(cb, t?) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(cb, t)
  }
  return debounceAct
}
```

`React`에서 `debounce`기능이 필요로 할 때마다 사용하는 함수이다.
해당 함수로 생성되는 `return`값을 `useMemo`로 메모이제이션 하여 내부 `timer`를 클로저방식으로 접근해 사용해왔다.

1. `debounceAct`가 한번 실행되면서 지정된 `t` 시간 이후에 `cb` 콜백함수가 호출된다.
2. 해당 콜백함수는 클로저 변수인 `timer`에 담긴다.
3. `t` 시간 내에 `debounceAct`가 다시 실행된다면, 클로저 변수 `timer`의 `setTimeout`을 초기화하고, 새로운 `cb` 콜백함수를 `setTimeout`내부 콜백함수로 지정하여 다시 `timer`에 담는다.
4. `t` 시간 내에 `debounceAct`가 다시 실행되지 않는다면 정상적으로 `setTimeout`이 진행된다.

## React-Saga takeLatest

`React-Saga`를 사용할 때에는 모듈에서 제공하는 `takeLatest`를 사용하여 위와 비슷하게 최근의 요청만 수행하도록 할 수 있었다.

```js
import { put, takeLatest, call } from 'redux-saga/effects'

// ... 로직

export function* userDataSaga() {
  yield takeLatest(GET_USER_DATA_SAGA, getUserData_Saga) // 가장 마지막으로 디스패치된 액션만을 처리
}
```

## 비동기작업의 중첩

비동기 작업을 작성하는데 `Redux-Saga`에서 `React-Query`방식으로 변경하게 되면서, 위와같은 `debounce`기능을 새롭게 구현해줄 필요가 있었다.

물론 상황은 조금 달랐는데,

1. 처음 화면에서 데이터를 `query`로 받아오기 시작
2. 데이터를 다 받아오기 전, 사용자가 새로운 요청을 함
3. `query`를 포함하는 `page`가 `unmount` 됨
4. 다른 `page`에서 새로운 `query`가 실행 됨

이 때, 첫 `query`가 취소되지 않아서 해당 데이터를 받아오는 비동기 작업이 완전히 종료되어야 사용자의 요청으로 인한 비동기작업이 실행되는 것이다.

사용자의 요청이 들어왔다면 그 요청으로인 한 비동기작업이 무조건 1순위가 되어야 사용자에게 좋은 경험을 전달할 수 있기 때문에, 이러한 상황이라면 처음의 `query`는 취소될 필요가 있었다.

### Query Cancellation

방법은 간단했다.

`React-Query`에서도 `query`를 취소할 수 있는 방법 이있었다.

#### axios

```js
import axios from 'axios'

const query = useQuery('todos', () => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const promise = axios.get('/todos', {
    cancelToken: source.token,
  })

  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query')
  }

  return promise
})
```

#### fetch

```js
const query = useQuery('todos', () => {
  const controller = new AbortController()
  const signal = controller.signal

  const promise = fetch('/todos', {
    method: 'get',
    signal,
  })

  promise.cancel = () => controller.abort()

  return promise
})
```

사실 `axios`모듈을 쓰던, `Web API`의 `fetch`를 쓰던 원리는 비슷했다.

1. `query`를 사용하는 컴포넌트에 `promise`객체를 반환한다.
2. `promise`객체에는 `cancel`이라는 커스텀 메소드가 필요하다.
3. `cancel`커스텀 메소드에는 `AbortController`나 `CancelTocken`등으로 생성되는 인스턴스 키를 갖고있는 비동기작업을 종료하는 로직을 내재하고 있어야 한다.
4. `query`를 사용하는 컴포넌트가 언마운트 되는 등 비활성화 되는 순간, `promise.cancel`이 호출된다.

당연히 사용자의 요청으로 취소도 가능하다.

위와같은 로직은 동일하게 사용되어야 하며,

```js
const queryClient = useQueryClient()

return (
  <button
    onClick={e => {
      e.preventDefault()
      queryClient.cancelQueries(queryKey)
    }}
  >
    Cancel
  </button>
)
```

취소시킬 `query`의 `key`를 `cancelQueries`의 인자로 보내어 실행시킨다.

`cancelQueries`가 실행되면, 처음 `query`에서 반환한 `promise`객체의 `cancel`을 자동으로 호출한다고 한다.

간단한데?

## 예상치 못한 변수

하지만 취소되지 않았다.

정확히 말하면, `query` 자체는 `cancel`이 되는것 같았지만, 정작 중요한 `fetch`와 같은 비동기작업이 취소가 되지 않았다.

왜일까?

`React-Query`를 사용하여 비동기 작업을 작성할 때, `Suspense`와 `ErrorBoundary`를 사용하여 오로지 데이터를 수신 성공 상태에 대해서만 고려하도록 하였다.

그래서, `promise` 객체가 처음 반환되는 순간은 데이터 수신 성공된 상태이다.

하지만, 위에서 반환된 `promise`객체의 `cancel` 메소드가 호출하는 순간은 그 이전인 `query`의 `status` 가 `loading`인 상태이다.

즉, `Suspense` 기능을 사용한 순간, `promise`객체의 `cancel`메소드가 호출될 수 있는 방법이 없다.

> 아마 위와 같은 이유인것 같다.

따라서 다른 방법으로 처리하기로 했다.

### cancelTocken 생성 후 할당

```js
const CancelToken = axios.CancelToken

let cancel

export const afterAsync = async (): Promise<any> => {
  cancel?.()
  try {
    // ...
  } catch {
    // ...
  }
}

export const beforeAsync = async (): Promise<any> => {
  try {
    const { data } = await axios({
      url:...
      method: "get",
      cancelToken: new CancelToken(c => (cancel = c)),
    });
    // ...
  } catch () {
    // ...
  }
};
```

1. 처음 `beforeAsync`가 호출되면, `cancel` 메소드를 `cancel`변수에 할당해준다.
2. 사용자의 요청으로 `afterAsync`가 호출되면, `cancel`메소드가 호출되어 `beforeAsync`가 취소된다.

여기까지는 정석적인 비동기 취소 방식이다.

하지만 이 상태로 마무리하게 된다면, `React-Query`의 캐싱기능으로 인해, 다시 처음의 `beforeAsync`가 호출될 때 해당 `key`로 저장되어는 취소된 데이터를 반환하게 되었다.

### key 초기화

```js
useEffect(() => {
  return () => {
    queryKey.forEach(key => {
      const queryData = queryClient.getQueryData(key)

      // key의 query 중단
      queryClient.cancelQueries(key)

      // key에 대한 캐싱된 값 초기화
      if (!queryData) queryClient.resetQueries(key, { exact: true })
    })
  }
}, [queryClient, queryKey])
```

`page`내부의 하위 `component`에서 `query`가 작동되고, 새로운 요청에는 해당 `page`가 `unmount`되기 때문에 위와 같은 방식으로 처리해주었다.

여기서 중요한점은, 해당 `key`로 캐싱된 값이 없다면 그 `key`들의 값을 초기화해주는것이다.

그렇게된다면, 새롭게 데이터를 받아오게 된다.

## 참고

- [React-Query Cancellation](https://react-query.tanstack.com/guides/query-cancellation#_top)
