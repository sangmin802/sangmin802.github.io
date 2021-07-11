---
title: ⚛ AsyncBoundary의 상태별 테스트
date: 2021-07-11 10:41:00
category: 'Study'
draft: false
tag: 'TestCode'
---

`React-Query`, `Suspense`, `ErrorBoundary`를 모두 합쳐서 하나의 `AsyncBoundary`라는 컴포넌트를 이전에 만들었다.

해당 컴포넌트에서는 `React-Query`를 통해 3가지의 상태를 가질 수 있었다.

1. `loading` : 데이터가 `fetching`중인 상태
2. `error` : 하위 컴포넌트 마운트 등의 `lifeCycle`중 발생한 에러 핸들링
3. `success` : 데이터 `fetching` 완료

필요에 따라서는 `error` 상태 이후, `retry` 기능도 가능하도록 하였으니 이 또한 확인이 필요하다.

## mocking 기반으로 setting

`fallback`컴포넌트와 `useQuery`는 속성으로 받거나 내부적으로 포함하고 있고, `data fetching` 진행 시간을 테스트에서 실제로 소비할 이유는 없기 때문에, `mocking`하기로 하였다.

### SuspenseFallback

```js
const SuspenseFallback = () => <span data-testid="loading">로딩중</span>
```

로딩 상태를 표시하는 `fallback` 컴포넌트이다.`AsyncBoundary`에서 상위 컴포넌트의 요청대로 `rendering` 하기 때문에 모두 다르겠지만, 로딩중이라는 표시는 모두 동일함으로 최대한 간단하게 구성하였다.

### ErrorFallback

```js
const ErrorFallback = ({
  error,
  resetBoundary,
}: {
  error?;
  resetBoundary?;
}) => {
  return (
    <>
      <span data-testid="error-message">{error.message}</span>
      <button data-testid="retry-button" onClick={resetBoundary}>
        재시도
      </button>
    </>
  );
};
```

에러 상태를 표시하는 `fallback` 컴포넌트이다. `AsyncBoundary`에서 `error`와 저장되어있는 `queryCache` 삭제 및 `AsyncBoundary`의 상태값을 변경하여 `rerendering`을 시키는 `resetBoundary`라는 속성들을 받아와서 사용한다.

## 실행할때마다 다른 key를 갖고있는 렌더링

```js
const renderAsyncBoundary = (key, mock) => {
  const Component = () => {
    useQuery(key, () => mock())
    return <span data-testid="fetched-data">성공</span>
  }

  return (
    <AsyncBoundary
      errorFallback={<ErrorFallback />}
      suspenseFallback={<SuspenseFallback />}
    >
      <Component />
    </AsyncBoundary>
  )
}
```

`return`되는 부분은 모두 동일하여 여러번 쓸 필요 없이 하나의 함수로 관리하도록 하였다.

또한, `useQuery` 자체가 `key`가 동일하다면 비동기작업을 실행하지 않고 저장되어있는 값을 가져오기 때문에, `key`를 바꿔주지않으면 이전 테스트의 영향으로 다음 테스트가 원활히 진행되는것 같지 않았다.

따라서, 테스트 마다 구분이 되는 `key` 받아오도록 하였다.

`mocking` 함수 또한, `로딩`, `에러`, `재시도` 때 `mockRejectedValueOnce`, `mockResolvedValueOnce`가 다르게 구성되기 때문에, 이전에 만들어서 렌더링하도록 하였다.

## 테스트코드 작성

### 로딩

```js
it('로딩', async () => {
  const { getByTestId } = render(renderAsyncBoundary('로딩', jest.fn()))
  await waitFor(() => expect(getByTestId('loading')).toBeTruthy())
})
```

`로딩` 이라는 키를 받았을 때, `loading`화면이 잘 노출되는지 테스트하는 과정이였다.

딱히 문제될 것은 없었기 때문에 넘어가자

### 에러

```js
describe('에러 발생', () => {
  // 에러 발생과 관련된 테스트
})
```

에러가 발생했을 때에는 `에러 핸들링` 과 `재시도`를 요청했을 때의 결과가 잘 나오는지 테스트를 해봐야 했기 때문에, 하나의 `에러 발생`으로 묶었다.

### 에러 핸들링

```js
describe('에러 발생', () => {
  it('에러 핸들링', async () => {
    const mock = jest.fn().mockRejectedValue(new Error('에러'))
    const { getByTestId } = render(renderAsyncBoundary('에러', mock))

    await waitFor(() => expect(getByTestId('error-message')).toBeTruthy())
  })
})
```

실행을 하였을 때, 비동기 `Error`를 반환하는 `mocking`함수를 만들었다.

해당 비동기 함수를 사용하게 되는 컴포넌트에서 사용을 할 때 `Error`를 발생할 것이다.

또한 이전 `로딩` 키와 다른 `에러` 키를 사용하여 `useQuery`가 다른 키로 인식해 새롭게 작동되도록 해준다.

### 에러 발생 후 retry

```js
describe('에러 발생', () => {
  it('에러 핸들링', async () => {
    const mock = jest.fn().mockRejectedValue(new Error('에러'))
    const { getByTestId } = render(renderAsyncBoundary('에러', mock))

    await waitFor(() => expect(getByTestId('error-message')).toBeTruthy())
  })

  it('에러 발생 후, retry', async () => {
    const mock = jest
      .fn()
      .mockRejectedValueOnce(new Error('에러'))
      .mockResolvedValueOnce({ data: '성공' })

    const { getByTestId } = render(renderAsyncBoundary('retry', mock))

    await waitFor(() => expect(getByTestId('retry-button')).toBeTruthy())

    fireEvent.click(getByTestId('retry-button'))

    await waitFor(() => expect(getByTestId('loading')).toBeTruthy())
    await waitFor(() => expect(getByTestId('fetched-data')).toBeTruthy())
  })
})
```

에러가 발생하고 재시도를 테스트하는 부분을 추가한다.

이번의 `mocking`함수는 첫 요청에는 에러를 반환하지만, 두번째 요청에는 성공하도록 작성한다.

당연히, `key`도 변경해서 `render`를 해준다.

1. 에러가 발생해서 `retry-button`이 화면에 그려짐
2. `retry-button`을 클릭하는 이벤트를 실행
3. `loading` 화면이 그려짐
4. 성공으로 `fetched-data` 화면이 그려짐

### Success

```js
it('데이터 패칭 완료', async () => {
  const mock = jest.fn().mockResolvedValueOnce({ data: '성공' })

  const { getByTestId } = render(renderAsyncBoundary('완료', mock))

  await waitFor(() => expect(getByTestId('loading')).toBeTruthy())
  await waitFor(() => expect(getByTestId('fetched-data')).toBeTruthy())
})
```

데이터 패칭이 성공했을 때의 테스트이다. 당연히 성공을 반환하는 `mocking`함수를 작성해준다.

크게 문제될 부분은 없었다.

## 테스트 결과

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/11/1.PNG?raw=true" alt="1">
</div>

맞게 테스트한것인지는 모르겠지만, 최대한 모든 상황을 테스트해보려하고, `mocking`을 사용하여 적은 시간이 들도록 작성하였다.
