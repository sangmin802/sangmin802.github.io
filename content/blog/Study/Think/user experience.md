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
