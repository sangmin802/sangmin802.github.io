---
title: ⚛ 비동기 작업 분리를 통한 사용자 경험 향상 및 Suspense에 대한 고민
date: 2021-08-06 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

개인 프로젝트를 배포할 때, 대부분 `gh-pages`를,`SSR`기반이라면 `vercel`을 사용해서 배포를 하였다.

또한 서버가 필요할 때에는 `heroku`를 사용해오고 있었다.

> 무료의 노예

아무래도 무료로 배포할 수 있는 서버리스 방식이기 때문에 `AWS`를 통해 직접 배포를 하는것 보다는 좀 많이 성능의 차이가 있는것 같긴 하다.

> 시간이라던지 ..

`heroku`로 배포된 서버는 아무래도 람다식이라서 `freeze`타임또한 존재하는것 같았다.

## 비동기 pending 시간

위와 같은 상황으로 인해 시간이 더 걸린다는점 + 외부 `api`로부터 정보를 받아와야 하는 경우이기 때문에, `cors origin`에러로 인한 `proxy`서버를 거쳐야 한다는 점 + 기본 작업시간

어마어마하다..

심지어는, `async` `await`을 통해 동기식으로 일을 처리하는 과정에서 처음 비동기 작업을 통한 결과값이 있어야만 다음 비동기작업이 진행될 수 있는 경우도 있었다.

```js
const data = await fetchSomething()
const data2 = await fetchSomething2(data.id)
```

대략 이런느낌?

`freeze` 시간을 고려하여 계산해보았을 때, 첫 비동기작업이 완료되기까지의 시간은 `3초`였다.

> 사실 `3초`도 매우 긴시간..

게다가 다음 비동기작업의 평균 완료시간은 `2초`였다

두번째 비동기작업으로 얻어오는 결과값이 화면을 렌더링하는데 필수적인 값이라면, 어쩔수 없는 시간이겠지만 그렇지 않은상황이였다.

## 사용자에게 우선순위가 낮은 렌더링을 위한 비동기작업

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/08/06/1.PNG?raw=true" alt="abortcontroller">
</div>

위의 화면을 구성하는 요소들 대부분은 하나의 비동기작업으로 모두 처리되지만, 유일하게 `수집형포인트`에 대한 항목을 렌더링 하기 위해서는 첫 비동기작업의 결과값을 `query`변수로 하여 새롭게 비동기 요청을 해야 했다.

하지만, 굳이 저 작업을 함께 해야 하는 생각이 들었다.

1. 수집형 포인트의 항목은 처음에 바로 보여야 하는것이 아닌, 사용자의 이벤트로 해당 항목이 활성화 되어야 화면에 보여짐
2. 레이아웃에서 필수 항목이 아닌 선택적인 항목으로 사용자는 해당 데이터를 확인하지 않을 수 있음

### 렌더링 이후, 비동기 요청으로 변경

화면에 필수적으로 보여야 하는 첫 렌더링이 완료된다면, 화면을 그리고 사용자가 컨텐츠를 확인하는 동안 `수집형포인트`에 대한 비동기작업을 실행하기로 하였다.

이후, 비동기 작업이 완료되었다면, 데이터를 받고 화면을 그린다.

이미 `AsyncBoundary`와 `React-Query`를 통한 비동기작업 로직들을 컴포넌트로 관리하고 있었기 때문에, 추가하는것 자체는 어려움이 없었다.

또한, 당연하게도 `수집형포인트`를 얻어오기 위한 비동기작업이 진행중인 상태에 새로운 유저 검색을 하게 된다면, 진행중인 작업은 `cancel`되도록 하기로 했다.

> 이전, `Event`, `Calendar`에 대한 `abort` 작업에 이어서

## 터져버린 Suspense 돌려막기

이전에 `React-Query`의 `suspense`모드와 `React`의 `Suspense`를 사용하여 비동기작업에 있어 `loading` 구간을 외부에서 처리하도록 하였다.

하지만, 두가지 모두 아직 실험단계라서 실제로 배포를 하는데에는 사용하지 말라는 경고가 있었다.

실제로 적용을 하면서 모든 상황에는 괜찮지만, `성공 -> 사용자의 요청 -> 실패`와 같은 상황에서는 `query`가 무한히 작동되고 에러를 포착하지 못하는 버그가 있었는데, `React-Query`의 내부적인 문제라는 이슈를 확인할 수 있었다.

이에 대한 돌려막기로 `queryClient`의 `prefetch`를 사용하여 `useQuery`가 작동되기 전 `key`를 캐싱하도록 하고, 이후에 데이터를 받아오도록 하였다.

> 돌려막기

### Suspense로 인한 cancel 방식 변경

사실, `Suspense`를 사용하게 되면서 이전에 진행중인 `fetch`를 `cancel`하는 방식또한 개조해서 사용하였다.

원래대로라면, `useQuery`가 `loading`, `error`등의 상태를 포함한 인스턴스에 `cancel` 메소드를 포함하여 `return` 할 때 `queryClient.cancelQueries`를 통해 `cancel`을 호출하여 `abort`시키는 것이 공식문서에서 제안된 방법이였다.

하지만 `Suspense`모드의 특성상 성공할 경우에만 `return`을 하기 때문에 중간에는 어떠한 방법으로도 `cancel`을 호출할 수 없었다.

따라서, `queryCancel`, `abort`를 분리하여 별도로 실행시켜주었었다.

```js
export const useCancelQuery = queryKey => {
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      queryKey.forEach(key => {
        // key의 query 중단
        if (queryClient.isFetching(key)) queryClient.cancelQueries(key)

        // key에 대한 캐싱된 값 초기화
        if (!queryClient.getQueryData(key))
          queryClient.resetQueries(key, { exact: true })
      })
    }
  }, [queryClient, queryKey])
}
```

`업데이트` 되거나, `언마운트` 될 때캐싱된 `key`에 대한 `fetching` 중단및 저장된 `undefined`값을 초기화 해주는 `hook`이다.

이것을 통해 `query`의 작업을 막을수는 있지만 호출된 비동기작업을 막을수는 없기 때문에

```js
export const getUserData = async (name): Promise<UserInfo> => {
  cancel?.();
  //...
```

위와 같은 방식으로 중단을 시켜주었었다.

> `axios` 사용으로 `cancelToken`을 이용함

## 알 수없는 버그

진행을 하던 중, 알 수 없는 버그가 발생했다.

모든 상황에서는 괜찮지만, `수집형포인트` 데이터를 받아오기 위한 비동기작업이 취소되고 새로운 유저검색을 할 때, `useQuery`의 비동기작업이 완료되기 전 `prefetch`로 저장된 값이 렌더링되는것이다.

정말 많은시간 고민을 하였다. 여러가지 상황을 적용해보고 결과를 확인해보았는다, 예상하는대로 진행되는 방법은 두가지였다.

1. `prefetch` 제거
2. 비동기 작업 취소 로직 제거

아이러니한것인지, 딩연한것인지 `suspense`모드를 사용하기 위해 임시방편으로 추가한 것들이 모두 문제였다.

`prefetch`야 제공하는 기능 자체를 추가한것이라 어쩔 방법이 없지만, 비동기 작업 취소 로직같은 경우는 내가 만든것이기 때문에 집중적으로 파혜쳐보았다.

### `cancelQueries`, `resetQueries`때문일까?

이전에 사용되었던 `key`만을 대상으로 진행되는것이기 때문에, 새로운 요청에 대해서는 영향을 미치지 않을것 같았다.

혹여나 잘못전달되는것이 아닌가 확인해보기도 했지만 아니였다.

### `cancel` 과정에서 문제가 있나?

`cancel token`또한, 이전에 실행된 비동기작업에서 바로 생성되는 방식으로 사용하였다.

```js
const { data } = await axios({
  url: `...`,
  method: 'post',
  data: { member },
  cancelToken: new CancelToken(c => (cancel = c)),
})
```

따라서 해당 비동기작업만 취소가 된다.

사실 이 로직 자체에는 문제가 없음이 확신시되는점이, 비동기작업이 중단되는것이 아니다. 다만, `prefetch`로 캐싱된 값을 가져오는것이 비동기작업 완료보다 먼저 `query`가 진행했기 때문이다.

## 경고를 받아들이는 순간

해결방법을 찾지 못하고 결국 `prefetch`를 빼기로 하였다.

> 사실, 비동기작업이 두번 호출되는것도 좀 불편하긴 했음

`prefetch`를 뺀다는것은 `suspense`모드를 사용하지 않겠다는 결론과도 같다.

아 물론, 모든 상황에서 빼지는 않을것이다.

현제 버그가 발생하는 `성공 -> 실패`와 같은 상황이 발생할 수 있는 부분이 아니라면 `suspense`는 유지하기로 하였다.

> 즉, 유저 검색에 있어서만 `suspense` 제거

```js
return (
  <ErrorBoundary errorFallback={<ErrorFallback />} keys={name}>
    <FetchUserInfo userKey={userKey} userCollectionKey={userCollectionKey} />
  </ErrorBoundary>
)
```

`Errorboundary`자체에는 문제가 없기 때문에 사용을 유지하였다.

```js
const { status, data: userData } = useUser(userKey)
// ...
if (status === 'loading') return <SearchLoading />

return (
  // ...
)
```

`suspense`모드 사용을 제거한 부분에서는 위와 같이 `loading`상태일 때의 렌더링을 정의해줄 필요가 있었다.

이것이 내부에서 이뤄지는것아 참 아쉽긴하지만..

## 비동기 작업 분리를 통한 사용자 경험 향상

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/08/06/4.png?raw=true" alt="abortcontroller">
</div>

기존, 유저를 검색하고 `suspense`기간을 지나 화면을 보게되는데 까지의 걸리는 시간이다.

첫 `유저정보`를 받는 비동기작업 + `수집형포인트`를 이어서 받는 비동기작업 모두 합쳐서 `3초`정도의 시간이 지나야 렌더링이 된다.

> 진짜 시간 미쳤다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/08/06/5.png?raw=true" alt="abortcontroller">
</div>

`수집형포인트`에 대한 비동기 작업을 첫 `유저정보`화면이 렌더링 된 이후에 진행되도록 한 결과물이다.

`2초` 정도의 시간이 소요 되었다.

> 회색부분은 `수집형포인트` 비동기 작업이 진행중에 `cancel`된 상태

사용자가 `suspense`기간을 지나 첫 렌더링 화면을 접하게 되는데 `1초` 정도의 시간이 줄게되었다.

적어보이는 수치같지만, 사용자에게 있어 `1초`는 매우 긴시간이니 의미있는 개선작업이 아니였나 싶다.
