---
title: ⚛ TanstackQuery5 Susepnse
date: 2023-12-21 08:17:00
category: 'Study'
draft: false
tag: 'Think'
---

사실 이전 블로그에서 다뤘던 내용이기도 하지만, TanstackQuery v5, React 18을 통해 Suspense가 정식기능이 되면서 각잡고 한번 해본 내용이다.
주관 듬뿍이라 잘못되었을수도 있다 힣

## 배경

```js
const AComponent = ({
	params,
}: Props) => {
	const { data, isError, isLoading, isFetching } = getQuery(
		params,
		{
			keepPreviousData: true
		},
	);

	const isHasData = !!data?.items.length;

	// rejected
	if (isError)
		return (
      <div>실패</div>
		);

	// pending
	if (isLoading)
		return (
      <div>로딩중</div>
		);

	// data empty
	if (!isHasData)
		return (
      <div>데이터 없음</div>
		);

	return (
		...Render Something
	);
};

export default AComponent;
```

서버의 데이터를 가져와 특정 화면을 그리는 경우, 대부분 이런식으로 처리해온것 같다.

데이터를 요청하고, 요청 상태에 따른 핸들링을 위해 컴포넌트 내부에서 명령형코드로 작성해주는 등..?

```js
<AComponent params={params} />
```

해당 컴포넌트를 사용할 때 위와같이 사용했다.

사용자에게 적절한 UI를 제공하기도하고, 작동상에도 문제 없습니다.

하지만 개인적으로 아쉬운점이 있었다.

어떤 컴포넌트가 사용하는 데이터는 그 내부에서 받아오도록 되어서 조금 더 응집력있는 컴포넌트를 만들었다. 페이지 이동 시 어떤로직 수행되고, 어떤 params를 기준으로 리스트를 받아오는지를 통해 무엇을 수행하는 컴포넌트인지 만을 위한 선언형의 컴포넌트로 추상화를 했다.

1. 그런데 api를 통한 상태의 핸들링은 해당 컴포넌트만 위에서 바라볼때에는 알 수가 없었다... 선언형으로 추상화된 컴포넌트임에도 그 상태에 대해서는 무엇을 하는지에조차 알 수 없는것 같았다. 우리는 모든것을 컴포넌트로 추상화할 수 있지만, api 상태와 관련된 코드는 선언식의 컴포넌트 추상화가 아닌 항상 내부에서 명령형으로 작성되어야 할 것 같다..
2. 해당 컴포넌트에 loading, error 상태에 대한 핸들링을 props로 전달해주면 문제없긴 하지만, PaymentHistoryList 내부에는 항상 상태에 따른 명령형 코드가 가득들어있고, 이러한 핸들링을 위한 분기들이 생기는것 같다. 위의 예시에서는 early return으로 그나마 단순한편이지만, return 내부에서 and연산자나 삼항연산자로 각 상태에 따른 처리가 들어가는 경우 정말.. 너무 싫더라. early return을 하더라도, use prefix가 붙은 hook에 대한 react 규칙인 hook은 조건부로 실행될 수 없어서 (hook들이 순서대로 클로저로서 관리되기 때문에 항상 실행순서가 보장되어야 함)항상 if 구문 위에 존재해야하는 특징으로 useCallback, useEffect같은 hook 내부에서 데이터를 사용하여 무언가를 할 때 존재하지 않는 경우로 옵셔널체이닝이 필수로 함께 사용되거나, 함수 내부에서 데이터가 없는 경우 함수를 종료시키는 등의 처리가 필요했다. 데이터를 상위에서 받으면 문제없지 않을까 싶으면서도 상위컴포넌트도 동일한 상황이 생길 가능성이 높습니다. 그냥 떠넘기기 ㅋㅋ..

결국 api 상태와 관련된 코드는 가독성에 있어서는 항상 아쉬움이 남는것 같았다.

query(api)에 대한 상태에 대한 핸들링을 늘 명령형 코드로 작성했다면, 해당 코드를 선언화된 컴포넌트로 추상화할 수 없을까?

컴포넌트 내부는 항상 데이터가 유효한 상황만을 고려할 수 있도록 해줄 수 없을까?

## 목표

tanstack/query의 메이저버전이 5로 한단계 상승하면서, 오랜기간 실험모드로만 자리잡혀있던 Suspense 기능이 정식 기능으로 변경되었다!

단순 라이브러리만의 혼자가 아닌, 이전 먼저 정식 기능으로 제공된 React 18의 Suspense, 기존에도 있던 ErrorBoundary와 함께 사용하여 기존에 작성하고있던 api상태에 대한 핸들링이 아닌 다른방법으로도 가능하게 되었기 때문에 한번 해보려 한다.

## React Suspense, ErrorBoundary

Suspense는 React 18 부터 정식기능으로 릴리즈되었다.

동적으로 컴포넌트를 받아오고, 그 동안 사용자에게 대신할 UI를 제공한다. 라는 방법으로 기존에도 많이 사용해왔다.

아마 전 블로그에도 있었던 내용이긴 하지만, 이번 목표를 위해 첫번째로 중요한 기능이기 때문에, 다시한번 깔끔하게 정리하구 가자

```js
async function runPureTask(task: any) {
  for (;;) {
    try {
      const a = task()
      return a
    } catch (x) {
      // throw를 거른다
      if (x instanceof Promise) {
        await x // 중요
      } else {
        throw x // 중요
      }
    }
  }
}

const cache = new Map()
const pending = new Map()

function createResolver(id: string) {
  if (cache.has(id)) {
    return cache.get(id) // 캐시 맵객체
  }
  if (pending.has(id)) {
    throw pending.get(id) // Pending Promise throw
  }

  // api 호출이라 가정
  const promise = new Promise(res => {
    a = res
  }).then(text => {
    pending.delete(id)
    cache.set(id, text)
  })

  pending.set(id, promise) // 팬딩 객체에 팬딩인거 표시
  throw promise
}

let a: any = null

setTimeout(() => {
  a('its me')
}, 1000)

runPureTask(() => createResolver('hello')).then(a => console.log(a))
```

Suspense core 로직이라 하면 접할 수 있는 코드조각으로 쉽게 검색되더라. React Suspense가 동일한 코드를 갖고있는것은 아니지만 핵심이 되는 요소를 이해하기에는 충분한 코드로 제공되고있는것 같다. 위 코드는 링크의 코드베이스 중 아주 조금 수정하여, 로컬환경에서 조금 더 쉽게 확인해볼 수 있도록 변경해보았다.

React 패키지 내부에서 찾아보고자 했지만.. Suspense가 컴포넌트가 아닌 단순 심볼값으로 코드가 컴파일 될 때 결정되는건지... 아직 내가 패키지를 뜯는 능력이 부족한건지 ㅎㅎ.. 못찾겠다..

핵심은 이런것 같다.

1. RULE1 각 api 요청에 대한 결과값을 캐싱함
2. RULE2 각 api 요청에 대한 promise를 캐싱함
3. api 호출 시, 해당 api의 결과값이 캐싱되어있다면 그 값을 그냥 반환함
4. api 호출 시, 해당 api가 아직 pending상태로 존재한다면 그 상태의 promise를 반환함
5. 1, 2에 해당되지 않다면, 해당 api 호출이 완료되었을 때 @RULE1 에 캐싱하고, @RULE2 에서 해당 api 호출에 대한 promise를 제거하도록 해당 api 로직을 가공함
6. 3에서 보수된 api 요청 로직을 @RULE2 에 저장함
7. 해당 api 요청 로직을 throw(중단)로 던짐. **매우중요**
8. 위 가공이 완료된 api 요청을 옵저빙할 수 있도록 함
9. while 조건문으로는 종료되지 않는 비동기 무한루프 while 구문을 생성함
10. try로 api 요청을 실행함
11. 처음에는 api 요청이 완료되지 않은 상태라 가공된 api 요청을 중단으로 던짐
12. catch에서 던져진 값이 promise라면 해당 api 요청의 결과를 대기함
13. catch에서 던져진 값이 error라면 다시 throw 하여 ErrorBoundary로 전달
14. 11번의 api 요청이 fulfilled로 완료되면, 가공해준 로직인을 수행하고 종료되며, 다시 while 구문이 반복수행됨
15. try로 api 요청을 실행함
16. 이번에는 캐싱된 결과값이 있어 api 요청을 중단하며 던지는것이 아닌 정적인 값을 그냥 return 함
17. 비동기 무한루프 while이 try return에서 값을 반환하면서 종료함.

error의 경우 위에서 편의상 ErrorBoundary라는 표현을 사용하였지만, 사실은 class 기반의 컴포넌트 내부에서만 사용될 수 있는 getDerivedStateFromError 생명주기에서 해당 중단요청을 잡게된다.

```js
static getDerivedStateFromError = (error: Error) => {
	return {
	  ... next state
	};
};
```

간단하게 React에서 어떤 컨셉으로 pending 상태가 변환됨을 감지하고 어떤 조건에 상단 Suspense 혹은 getDerivedStateFromError 생명주기에서 중단을 구분하여 잡는지 알 수 있었다.

결과적으로

Promise 객체와 함께 throw 된다면, Suspense에서 중단요청을 잡게되고,

Error 객체와 함께 throw 된다면, getDerivedStateFromError에서 중단요청을 잡게 된다.

이 두가지가 핵심!

이어서, 위의 두가지 핵심을 정식기능으로 변경한 Tanstack/query에서는 어떻게 사용하는지 한번 보는것도 좋을것 같다.

## Tanstack/query v5 useSuspenseQuery

v5 버전에 맞도록 수정하는 과정에서 기존과의 차이가 있어서 이것 먼저 기록하는게 좋을것 같다.

- query에 객체인자를 전달할 때에도 UseQueryOptions에 queryKey값이 필수값으로 변경되었다(기존 optional) 따라서, useQuery를 한번 wrapping하여 사용할 때, wrapping된 custom hook을 사용하는곳에서는 queryKey를 꼭 넣어달라는 타입에러가 반환되더라. queryKey가 omit된 유틸리티타입을 사용하는 등 별도처리가 필요할듯..?
- keepPreviousData -> placeholderData로 변경되면서 값의 타입이 boolean에서 함수로 변경.
  - false -> (prevData, prevQuery) => prevData

이전 React가 어떻게, 어떠한 기준으로 pending, error 상태를 잡게 되는지 알 수 있었는데, 그러면 이러한 규격에 맞게 Tanstack/query에서는 어떠한 방식으로 저 기능을 활성화시키는지 알아보기 위해 간단하게 query 작동흐름을 한번 보자.

```js
export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> {
  return useBaseQuery(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: defaultThrowOnError,
    },
    QueryObserver,
    queryClient,
  ) as UseSuspenseQueryResult<TData, TError>
}
```

기존 useQuery가 아닌, useSuspenseQuery를 사용한다.

정식 릴리즈 이전에는 suspense, errorBoundary 옵션이 별도로 존재했던것같은데.. 정식 릴리즈 이후에는 해당 옵션이 사라지고 지정된 hook을 사용하도록 유도하는것 같다.눈 에 띄는 점이 있는데, enabled값또한 항상 true로 고정이다. 즉, 우리가 커스텀하게 활성화, 비활성화를 조절해줄 수 없다.

공식적인 입장으로는

> 모든 쿼리에 Suspense 기능이 도입되게 될 경우, 특정 값에 의존하여 실행되는 query또한 그 값을 받아오는 과정의 pending동안은 컴포넌트가 중단상태이기 때문에, 해당 query가 호출되지 않기 때문에 필요하지 않다

이지만, 상황에따라서는 적합한사용처이거나 필요한 데이터가 확실히 보장되도록 코드를 작성한 후에 함께하는것이 아직은 필요할듯..?

```js
  const [observer] = React.useState(
    () =>
      new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
        client,
        defaultedOptions,
      ),
  )
```

useBaseQuery에 전달된 옵션, 옵저버클래스를 기준으로 새로운 쿼리를 생성한다.

이후 새로운 쿼리객체를 생성하고 리스너에 등록, 쿼리 데이터의 변경이 생겼을 때 내부 reducer를 통해 각각의 액션을 수행하고 상태별 쿼리데이터를 class에 저장, 리스너에 등록된 쿼리들을 일괄 변경하여 rerender를 발생시키는 과정을 거친다.

위에서 새로운 쿼리의 옵저버를 생성했는데요, 한가지 이상한점이 있다.

state처럼 만들긴 했는데, rerender를 시켜주기 위한 dispatcher가 없다.

```js
React.useSyncExternalStore(
  React.useCallback(
    onStoreChange => {
      const unsubscribe = isRestoring
        ? () => undefined
        : observer.subscribe(notifyManager.batchCalls(onStoreChange))

      // Update result to make sure we did not miss any query updates
      // between creating the observer and subscribing to it.
      observer.updateResult()

      return unsubscribe
    },
    [observer, isRestoring]
  ),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult()
)
```

useSyncExternalStore가 해당 역할을 대신해줄것인데(종종 사용하고있는데 이게 정말 괜찮은듯..), 이 hook을 사용하여 옵저버의 현재 쿼리데이터값에 대한 스냅샷을 찍어준다.해당 hook이 하는 역할은, class같이 외부 저장소들이 변경될 때 React에 rerender를 발생시킬 수 있도록 한다. 이름 그대로 외부 저장소와 동기화시켜줌

결국, 옵저버 내부에서는 fetch 상태별로 다양하게 데이터를 가지고 있는데 위 hook의 도움으로 React state가 아닌 일반 저장소임에도 변경되었을 때 rerender를 일으켜 새롭운 값을 반환해줄 수 있도록 해준다.

생성된 쿼리 하단, 익숙한것이 보이는데,

```js
if (shouldSuspend(defaultedOptions, result, isRestoring)) {
  throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
}

// oberver.fetchOptimistic을 던짐
function fetchOptimistic(
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
): Promise<QueryObserverResult<TData, TError>> {
  const defaultedOptions = this.#client.defaultQueryOptions(options)

  const query = this.#client
    .getQueryCache()
    .build(this.#client, defaultedOptions)
  query.isFetchingOptimistic = true

  return query.fetch().then(() => this.createResult(query, defaultedOptions))
}
```

suspense모드이며, 현재 내부 쿼리의 상태가 pending인지 확인을 하고, 값 return이 아닌 무언가와 함께 중단한다.

api fetch 이후, 쿼리데이터를 생성하는 promise객체를 함께 던지게 된다.

이 던져진 promise를 React Suspense가 잡게되는 개념!

바로 아래구문에 비슷한게 하나 더 있다

```js
if (
  getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query: observer.getCurrentQuery(),
  })
) {
  throw result.error
}

// query dispatch
const onError = (error: TError | { silent?: boolean }) => {
  // Optimistically update state if needed
  if (!(isCancelledError(error) && error.silent)) {
    this.#dispatch({
      type: 'error',
      error: error as TError,
    })
  }
}
```

쿼리의 에러옵션이 활성화되어있고, 중단하며 던지는 값에대한 추적을 하다보면 fetch가 실패하였을 때, 쿼리 내부에서 error action dispatch를 통해 Error 객체를 내부에 저장하게 된다.

그리고, 저 생성되는 result.error로 던진다.

이로서 에러상태 또한, getDerivedStateFromError생명주기에서 잡을 수 있게 되었다.

```js
return !defaultedOptions.notifyOnChangeProps
  ? observer.trackResult(result)
  : result
```

위의 중단에 걸리지 않는다면, 일반적으로 기대하는 쿼리 리턴값을 받게된다. (데이터와 상태 등등.. 이 포함된)

## 적용하기

React에서 어떤것을 기준으로 pending, error 중단을 판단하는지와 이 기준을 Tanstack/query에서는 어떻게 사용하는지 간단하게 확인해보았으니, 한번 적용해보자.

```js
export const useGetQuery = (
  params: IParams,
  options?: Partial<UseSuspenseQueryOptions<IResponse>>
) => {
  const query = useSuspenseQuery({
    queryKey: [KEY, params],
    queryFn: () => getApi(params),
    ...options,
  })

  return query
}
```

기존의 useQuery가 아닌 useSuspenseQuery를 사용하도록 변경하였다.

내부에서 명령형으로 관리되고 있던 api 상태에 따른 핸들링을 이제 컴포넌트 외부에서 추상화해줄 수 있기 때문에 모두 제거!

```js
const AComponent = ({
	params,
}: Props) => {
	const { data, isError, isLoading, isFetching } = useGetQuery(
		params,
		{
			placeholderData: (prevData) => prevData,
		},
	);

	const isHasData = !!data.items.length;

	// data empty
	if (!isHasData)
		return (
      <div>데이터 없음</div>
		);

	return (
		...Render Something
	);
};

export default AComponent;
```

여기서 한가지 더 바뀐게 있는데,

기존 useQuery의 응답데이터값과 다르게 데이터가 항상 존재함이 보장된다. 즉, 데이터 존재여부를 위한 옵셔널체이닝이 필요가 없다.

> 데이터 존재여부 분기 필요 없음

데이터가 존재하지 않는 경우에 대해 이후 코드에 대한 렌더링 자체가 중단되기 때문에 useSuspenseQuery hook으로 반환된 데이터는 undefined의 경우가 존재하지 않음을 인지하고 있는것 같다.

```js
const { reset } = useQueryErrorResetBoundary()
```

위 컴포넌트를 감싸고 있는 상위컴포넌트에서 에러상태에 대한 플래그값을 초기화해주기위한 reset 메소드를 생성해준다.

```js
<ErrorBoundary
  onReset={reset}
  resetKey={resetKey}
  errorFallback={errorFallback}
>
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
</ErrorBoundary>
```

하단에서 ErrorBoundary와, Suspense를 생성하고 각각 필요한 props를 한다.

```js
import { Component, ComponentType, createElement, ReactElement } from 'react'

interface IErrorBoundaryProps {
  fallback: ComponentType<{ error?: Error, onReset: () => void }>;
  onReset: () => void;
  resetKey: unknown;
  children: ReactElement;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const initState = { hasError: false }

export default class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = initState
  }

  resetBoundary = () => {
    this.props.onReset()
    this.setState(initState)
  }

  componentDidUpdate = (prevProps: IErrorBoundaryProps) => {
    if (
      JSON.stringify(prevProps.resetKey) !== JSON.stringify(this.props.resetKey)
    )
      this.resetBoundary()
  }

  static getDerivedStateFromError = (error: Error) => {
    return { hasError: !!error, error }
  }

  render = () => {
    if (this.state.hasError) {
      return createElement(this.props.fallback, {
        error: this.state.error,
        onReset: this.resetBoundary,
      })
    }

    return this.props.children
  }
}
```

중단되며 던져진 Error 객체를 받기위한 생명주기가 class 기반 컴포넌트에서 존재하기 때문에 이와 같은 작성이 필요합니다.
이전 관련된 블로그에서 큰 차이는 없을것 같다.

직접 다뤄보고, 커스텀도 필요해서 만들긴 했는데, 라이브러리도 잘 나와있더라..!

아래에서 중단이 되면 getDerivedStateFromError 요기에서 잡구,

내부 state를 에러발생상태로 변경한다.

render될 때, 에러상태라면 전달된 errorFallback을 렌더링 하게 된다.

이 때, 쿼리상태는 error로 고정되어있기 때문에 이후의 retry를 위해 props로 전달된 reset 메소드와, 해당 class를 rerender 시켜줄 핸들러를 묶어 fallback으로 전달해준다.

사용자가 reset을 직접호출하는것이 아닌, 필터변경으로 쿼리가 호출되어야 하는 경우 또한 쿼리 내부에서 error로 고정된 상태를 변경해줘야 하기 때문에 resetkey로 params를 전달하여 params 변경 시, 쿼리의 상태가 초기화되도록 해줘야 할 것 같다.

class 내부 상태가 error이기 때문에 쿼리호출부까지 도달 못하기 때문도 있는듯..?

여기까지, React의 Suspense, ErrorBoundary와 Tanstack/query v5를 통해

1. query(api)에 대한 상태에 대한 핸들링을 늘 명령형 코드로 작성했다면, 해당 코드를 선언화된 컴포넌트로 추상화할 수 없을까?
2. 컴포넌트 내부는 항상 데이터가 유효한 상황만을 고려할 수 있도록 해줄 수 없을까?

의 목표를 일 부 이룬것 같다.

여기까지가 위의 라이브러리들이 제공해주는 범위이다.

하지만 아직 완료되지 못하거나, 아쉬운부분이 있는것같다...

1. pending, rejected의 경우 api를 호출한다면 항상 존재하는 상태이고, 필요한 핸들링입니다. reset hook을 계속해서 생성해줄 필요 없이 하나의 목표를 가진 컴포넌트로 한번 더 추상화해줄 수 있을것 같습니다.
2. api 상태에 따른 핸들링을 외부 선언식의 컴포넌트로 추상화하면서 뺄 수 있게 되었습니다. 하지만, 데이터가 존재하지 않는 경우에 대해서도 유사한 핸들링이 필요하지만 여전히 남아있습니다.
3. React Suspense 릴리즈 당시, 메인 토픽은 동시성모델이였습니다. 사용자에게 끊기지 않고 지속적인 UI를 제공하고 자연스러운 전환을 하는 것이 목표였는데요. Suspense로 중단을 잡게되면서 보여줄 데이터가 존재함에도 pending 상태일 경우 사용자가 보고있는 데이터들을 한번 비활성화하였다가 다시 제공합니다. 메인 토픽과는 거리가 좀 있어보이는것 같습니다.

## 추가 개선하기

pending, rejected의 경우 api를 호출한다면 항상 존재하는 상태이고, 필요한 핸들링이다. reset hook을 계속해서 생성해줄 필요 없이 하나의 목표를 가진 컴포넌트로 한번 더 추상화해줄 수 있을것 같다.

```js
<AsyncBoundary
  errorFallback={PaymentError}
  loadingFallback={PaymentLoading}
  emptyFallback={PaymentEmpty}
  resetKey={params}
>
  <AComponent params={params} />
</AsyncBoundary>
```

```js
const AsyncBoundary: FC<IAsyncBoundaryProps> = ({
  loadingFallback: LoadingFallback,
  errorFallback,
  emptyFallback: EmptyFallback,
  children,
  resetKey,
}) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      resetKey={resetKey}
      errorFallback={errorFallback}
      emptyFallback={EmptyFallback && <EmptyFallback />}
    >
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
```

비동기 상태를 관리해주는 컴포넌트로 추상화된 컴포넌트에 Suspense, ErrorBoundary를 함께 관리하도록 변경했다.

내부에서 queryReset과 관련된 hook도 함께 관리된다.

query의 상태에 따른 핸들링을 담당하는 하나의 컴포넌트로 변경하면서, 각 상태별 무엇을 하는지에만 집중한 선언형 컴포넌트로 한번 더 추상화만 해줬다.

api 상태에 따른 핸들링을 외부 선언식의 컴포넌트로 추상화하면서 뺄 수 있게 되었습니다. 하지만, 데이터가 존재하지 않는 경우에 대해서도 유사한 핸들링이 필요하지만 여전히 남아있다.

throw될 때 던져지는 값에 따라 어떻게 핸들링할 수 있는지 확인하고, 이해했기 때문에 응용을 해볼 수 있을것 같다.

queryData가 받아진 이후, 데이터가 정말 존재하지 않는 경우, query뿐 아니라 우리 또한 Error객체를 통해 중단해볼 수 있을것 같다.
api 요청에 대한 에러는아니지만.. 우리가 에러를 만들어서 던져볼 수 있지 않을까..?

```js
export const useGetQuery = (
  params: IPrams,
  options?: Partial<UseSuspenseQueryOptions<IResponse>>
) => {
  const query = useSuspenseQuery({
    queryKey: [KEY, params],
    queryFn: () => getApi(params),
    ...options,
  })

  if (!query.data.items.length) throw new Error('no data')

  return query
}
```

ErrorBoundary 내부도 약간의 변경이 필요해보인다.

중단을 잡는 생명주기에서, 전달되는 Error객체의 출처를 확인할 필요가 있어보인다.

api 상태에 대한 Error는 http status를 들고있고, 우리가 발생시킨 Error는 message만 들고있기 때문에 status 값을 갖고있는 response 키의 타입가드를 통해 response가 존재한다면 ERROR, 그렇지 않다면 EMPTY로 구분하여 적절한 UI를 그려줄 수 있을것 같다.

```js
import { Component, ComponentType, createElement, ReactElement } from 'react';
import { AxiosError } from 'axios';

enum StateType {
	'DEFAULT',
	'ERROR',
	'EMPTY',
}

interface IErrorBoundaryProps {
	errorFallback: ComponentType<{ error?: Error; onReset: () => void }>;
	emptyFallback?: ReactElement;
	onReset: () => void;
	resetKey: unknown;
	children: ReactElement;
}

interface IErrorBoundaryState {
	type: StateType;
	error?: Error;
}

const initState = { type: StateType.DEFAULT };

export default class ErrorBoundary extends Component<
	IErrorBoundaryProps,
	IErrorBoundaryState
> {
	constructor(props: IErrorBoundaryProps) {
		super(props);
		this.state = initState;
	}

	resetBoundary = () => {
		this.props.onReset();
		this.setState(initState);
	};

	componentDidUpdate = (prevProps: IErrorBoundaryProps) => {
		if (
			JSON.stringify(prevProps.resetKey) !== JSON.stringify(this.props.resetKey)
		)
			this.resetBoundary();
	};

	static getDerivedStateFromError = (error: Error | AxiosError) => {
		return {
			type: 'response' in error ? StateType.ERROR : StateType.EMPTY,
			error,
		};
	};

	render = () => {
		const { type } = this.state;

		if (type === StateType.ERROR) {
			return createElement(this.props.errorFallback, {
				error: this.state.error,
				onReset: this.resetBoundary,
			});
		}

		if (type === StateType.EMPTY && this.props.emptyFallback) {
			return this.props.emptyFallback;
		}

		return this.props.children;
	};
}
```

자연스럽게 이전에 api 요청은 성공했지만, 정말 데이터가 없는 경우에 대한 분기도 뺴볼 수 있을것 같다

```js
const AComponent= ({
	params,
}: IAComponentProps) => {
	const { data, isError, isLoading, isFetching } = useGetQuery(params);

	return (
		...Render Something
	);
};

export default AComponent;
```

React Suspense 릴리즈 당시, 메인 토픽은 동시성모델이였다. 사용자에게 끊기지 않고 지속적인 UI를 제공하고 자연스러운 전환을 하는 것이 목표였던것 같은데... Suspense로 중단을 잡게되면서 보여줄 데이터가 존재함에도 pending 상태일 경우 사용자가 보고있는 데이터들을 한번 비활성화하였다가 다시 제공한다.

> 뭔가 좀 아쉬운걸..?

React 18에는 동시성모델을 소개하며, Suspense와 같은 하위기능으로 또 다른 hook을 제공하고있다.

useTransition, useDefferedValue로 상태의 변경이 현재의 UI에 영향을 주지 않도록 명령해줄 수 있다.필터가 변경되어 query가 재호출되더라도, 현재 유지되고있는 UI가 전환되지 않은 채로 새롭게 데이터를 갱신할 수 있게 된다.

```js
const handpeUpdate = (type: 'date' | 'target' | 'type') => (item: ISwitch) => {
  startTransition(() => {
    setState(prevState => ({ ...prevState, [type]: item }))
  })
}
```

직접 지연시켜줄 수 있는 상태변화라면, useTransition을 사용하고, 외부 라이브러리의 상태값만을 반환받을 수 있는 상황이라면 useDefferedValue를 권장하고 있다.

## 후기

두가지 라이브러리에서 Suspsense가 정식기능이 되고, 처음 Suspense가 소개되었을 때부터 해보고싶었던 방법을 시험삼아 해보았다. 아직은 개인 토이프로젝트에만 해보고.. 상용에서는 기존 enabled를 사용하고있는 query들 꽤 있어 작은 프로젝트부터 조금씩 적용해볼만한것 같다.
