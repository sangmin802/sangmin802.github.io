---
title: ⚛ ErrorBoundary와 비동기 에러 핸들링
date: 2021-07-07 16:36:00
category: 'Study'
draft: false
tag: 'Think'
---

`React-Query`와 `React.Suspense`를 사용하여 로딩처리, 캐싱, 데이터 업데이트와 같은 부분을 해결하여 많은부분의 코드가 절약되었다.

하지만, 두가지만으로는 비동기작업에서 발생하는 에러를 핸들링할 수 없었다.

`throw Error`로 에러가 발생하면, 똑같이 에러 자체를 상태값에 보관해서 다이얼로그를 띄우는 등으로 해결해왔었다.

## ErrorBoundary

사실 이전 `React.Suspense`공문을 읽다보면 하단에 `ErrorBoundary`와 관련된 내용을 확인해 볼 수 있다.

특정 부분부분의 비동기작업으로 발생하는 에러가 앱 전제의 작동을 멈추게 해서는 안된다. 따라서 에러의 경계를 정하여 에러를 부분적으로 포착·관리하는 `ErrorBoundary`가 등장하였다.

중요한 점은 렌더링 도중 하위 있는 전체 트리의 생명주기에서 발생하는 에러를 포착한다는 점이다. 즉, 컴포넌트를 마운트 할 때 발생할 수 있는 에러들과 같은점을 말하는것 같다.

> 컴포넌트를 마운트 하기 전, data가 존재하지 않다거나 그런것들을 의미하는 것일까?

### 기본 구조

`ErrorBoundary`의 기본 구조이다.

```js
<ErrorBoundary fallback={<ErrorComponent />}>
  <MyWidget />
</ErrorBoundary>
```

`getDerivedStateFromError`를 통해 하위에서 발생하는 에러를 포착하고, 변수로 받아와서 렌더링을 하기 전 상태값을 변경한다.

만약 에러가 존재한다면, 에러에 맞는 `fallback` 컴포넌트를 반환하고 그렇지않다면 감싸고 있는 자식들을 정상적으로 렌더링한다.

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

## 실 사용 예제

실제 사용을 할 때에는 `ErrorBoundary`와 `Suspense` 두가지 모두 비동기작업을 수행하면서 거쳐야 하는 과정들이다.

에러와 로딩 상황 모두 구현해야 하기 때문이다.

### 두가지를 갖고있는 AsyncBoundary

`Suspense`와 `ErrorBoundary`는 사실 늘 함께 사용될 것 같아서 하나의 컴포넌트로 묶고, 정상적인 렌더링을 하는 경우를 조합형식으로 하여 `children`을 받아서 사용하였다.

```js
import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Suspense,
  useCallback,
} from 'react'
import { useQueryErrorResetBoundary } from 'react-query'
import { ErrorBoundary } from 'components/'

interface Props {
  errorFallback: ReactElement;
  children: ReactElement;
}

const AsyncBoundary = ({
  suspenseFallback,
  errorFallback,
  children,
}: PropsWithChildren<Props>) => {
  const { reset } = useQueryErrorResetBoundary()
  const resetHandler = useCallback(() => {
    reset()
  }, [reset])

  return (
    <ErrorBoundary resetQuery={resetHandler} errorFallback={errorFallback}>
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default AsyncBoundary
```

종종 그런경우가 있다. 에러가 발생했지만, 사용자의 요청으로 데이터를 다시 받아오도록 하는 상황

이런 경우, `query`에 저장이 되어있는 에러를 제거하고 새로운 에러를 저장할 수 있도록 해야 한다더라.

따라서, `useQueryErrorResetBoundary` `hook`의 `rest` 메소드를 속성으로 보내서 요청을 다시 하게되야하는 경우에 호출되도록 설정하였다.

`errorFallback`과 `fallback`은 말 그대로 에러 혹은 로딩 상태일 때 보여질 컴포넌트를 뜻한다.

```js
function App() {
  return (
    <Styled.Container>
      <AsyncBoundary
        suspenseFallback={<SearchLoading />}
        errorFallback={<HeaderLayout children={<ErrorFallback />} />}
      >
        <HeaderLayout>
          <Styled.Main>
            <Route exact path="/" component={Home} />
            <Route path="/userInfo/:name" component={UserInfo} />
          </Styled.Main>
        </HeaderLayout>
      </AsyncBoundary>
    </Styled.Container>
  )
}

function HeaderLayout({ children, ...props }) {
  return (
    <Styled.InnerContainer>
      <Styled.HeaderContainer>
        <Header {...props} />
      </Styled.HeaderContainer>
      {cloneElement(children, { ...props })}
    </Styled.InnerContainer>
  )
}
```

유저검색을 할 때에도 에러가 발생할 수 있는데, 에러가 발생할 경우, `Header`의 `Input`에도 `errorCache`를 초기화해줘야 했었다.

따라서 `HeaderLayout` 에도 `reset` 메소드를 전달하도록 했다.

기존 `ErrorBoundary`또한 `react-error-boundary`라는 `npm`으로 배포되고 있지만, 이해하기 그렇게 어렵지 않고, 위의 개인 프로젝트상 특수한 상황으로 인해 커스터마이징 할 필요가 있어 기존 껍데기에 조금 수정하는 방식으로 사용하였다.

```js
import React, { cloneElement, ReactElement } from 'react'

interface Props {
  resetQuery?: () => void;
  errorFallback: ReactElement;
  children: ReactElement;
}

interface States {
  hasError: boolean;
  error?: Error;
}
const initialState = { hasError: false, error: null }

export default class ErrorBoundary extends React.Component<Props, States> {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  resetBoundary = () => {
    this.props.resetQuery?.()
    this.setState(initialState)
  }

  render() {
    if (this.state.hasError) {
      const { errorFallback } = this.props
      const { error } = this.state
      return cloneElement(errorFallback, {
        error,
        resetBoundary: this.resetBoundary,
      })
    }

    const newChildren = cloneElement(this.props.excludeSuspense, {
      resetBoundary: this.resetBoundary,
    })

    return this.props.children
  }
}
```

처음에는 최 하단의 정상 렌더링을 진행하겠지만, 하위에서 `useQuery`의 비동기 작업중 에러가 발생하게 되면 `getDerivedStateFromError`를 통해 에러를 캡쳐하고, `this.state.hasError` 상태의 렌더링을 하게 된다.

이 때, 사용자의 요청으로 인해 다시 `fetching`을 해야하는 상황이 발생하게 될 경우, `cached`된 에러를 제거해주고 `ErrorBoundary`를 다시 렌더링하여 하위에 존재하고 있는 `useQuery`를 실행시켜줘야 한다.

```js
resetBoundary = () => {
  this.props.resetQuery?.()
  this.setState(initialState)
}
```

해당 메소드가 그러한 역할을 하는것이고, 그것을 `errorFallback`에 전달을 해준다.

만약 사용자의 요청이 아닌 스스로 다시 렌더링을 하도록 원한다면,
`AsyncBoundary`에서 속성을 받아와 해당 속성을 변경하여 다시 렌더링하는 방식으로 해도 된다.

```js
  // 부모 컴포넌트에서의 props 변경 감지를 통한 리렌더링
  componentDidUpdate(prev) {
    if (prev.keys !== this.props.keys) {
      this.resetBoundary();
    }
  }
```

상황에 맞게 사용하면 될 것 같다.

`errorFallback`는 여러 상황에 따라 다르게 구성될 수 있기 때문에 속성으로 전달하도록 하였다.

단, 재시도라는 기능을 위해서 `resetBoundary`를 통해 `cached`된 `error`를 제거하고 `ErrorBoundary`를 다시 렌더링하도록 하는속성은 공통적으로 필요할것 같다.

```js
import React from 'react'
import { Text, Button, Image } from 'components/'
import * as Styled from './index.style'

interface Props {
  error: Error;
  resetBoundary: () => void;
}

const ErrorFallback = ({ error, resetBoundary }: Partial<Props>) => {
  return (
    <>
      <Styled.TextContainer>
        <Text>{error.message}</Text>
      </Styled.TextContainer>
      <Styled.ButtonContainer>
        <Button onClick={resetBoundary}>
          <Text>재시도</Text>
        </Button>
      </Styled.ButtonContainer>
      <Styled.ImageContainer>
        <Image src={`${process.env.PUBLIC_URL}/img/emoticon_3.gif`} />
      </Styled.ImageContainer>
    </>
  )
}

export default ErrorFallback
```

### Event 비동기 작업

지금까지 쭉 등장했던 `Event` 컴포넌트를 생성된 `AsyncBoundary`에 적용해보았다.

```js
<AsyncBoundary
  suspenseFallback={<LoadingSpinner />}
  errorFallback={<ErrorFallback />}
>
  <Event />
</AsyncBoundary>
```

에러가 발생하는 상황을 체크해야 하기 때문에, 한번은 강제로 에러를 발생시키고, 다음에는 정상적으로 진행되도록 하였다.

```js
const API = {
  count: 0,
  async getEventData(): Promise<EventData> {
    try {
      const { data } = await axios({
        url: `${PROXY}loa-hands/homeData`,
        method: 'get',
      })

      if (this.count === 0) {
        this.count = 1
        throw null
      }

      return new EventData(data)
    } catch (err) {
      const message = err?.response?.data?.message ?? '네트워크 에러입니다.'
      throw new Error(message)
    }
  },
}
```

처음 비동기 작업에서는 에러로 인해 `errorFallback`이 생성되지만, `재시도하기`를 클릭할 경우, 정상적인 렌더링이 되는 모습이다.

<div style="text-align : center">
  <img src="/img/2021/07/07/3.gif?raw=true" alt="3">
</div>

## React.Suspense와 React-Query - suspense모드의 에러

위처럼 잘 사용되는 경우도 물론 많다.

하지만, 예상하지 못한 에러가 발생하는 상황도 있었다.

성공적인 유저검색을 마치고, 이후의 검색에서 비동기 작업상 에러가 발생하면, 에러를 캐치하지 못하고 계속해서 `useQuery`가 `refetching`이 되었다.

<div style="text-align : center">
  <img src="/img/2021/07/07/4.gif?raw=true" alt="4">
</div>

여기서 `suspense`옵션을 비활성화를 하게될경우에는 정상적으로 에러를 포착하였다.

오랜 구글링 끝에 해결하게 되었는데, `prefetchQuery`를 사용하여 실제 비동기작업을 `return` 하기 전에 미리 한번 실행하는 것이다.

```js
const { data: userData } = useQuery(
  key,
  async () => {
    queryClient.prefetchQuery(key, () => {
      API.getUserData(name)
    })

    return API.getUserData(name)
  },
  {
    refetchOnWindowFocus: false,
  }
)
```

해당 방법을 사용하여 위의 문제는 해결하였지만, 마치 돌려막기를 한 듯 한 느낌이라 좀 찝찝했다.

<div style="text-align : center">
  <img src="/img/2021/07/07/5.gif?raw=true" alt="5">
</div>

그래서 `React-Query` 깃의 이슈들에 질문을 해보려고 들어갔는데

<div style="text-align : center">
  <img src="/img/2021/07/07/1.PNG?raw=true" alt="1">
</div>

비슷한 에러를 겪고있는 사람들이 꽤나 많았다. 가장 최근의 이슈들의 사진이지만, 이 이후에도 비슷한 `suspense+infiniteFetch`와 관련된 이슈들이 더 있었다.

그리고, 모든 이슈들이 `React-Query`의 `contributer` 한 분의 멘트로 링크가 되어있었는데,

<div style="text-align : center">
  <img src="/img/2021/07/07/2.PNG?raw=true" alt="2">
</div>

아아..

`React.Suspense`, `React-Query suspense` 모두 공문에 나와있던 말처럼 아직 테스트 버전이기 때문에 예외적인 상황들이 발생할수 있음을 알 수 있었다.

## 테스트중인 부분도 있지만 충분히 좋은걸

캐싱, 에러핸들링, 로딩프로세스등 잘 사용한다면 비동기 작업이 개발자에게는 많은 양의 코드를 줄일 수 있고, 에러핸들링을 하는등의 장점과 사용자에게는 좋은 경험을 줄 수 있다는 점에서 큰 매력이 있는것 같다.

아직, `suspense`와 같이 불완전한 상태의 기능들도 존재하지만, 충분히 사용할 가치가 있는것 같다.

`useState`, `useReducer` 등으로 `Redux`를 충분히 대체할 수 있겠다라는 생각이 들고, 실제로 `Redux`를 잘 사용하지 않게 되었었다.

하지만, `Redux-Saga`와 같이 비동기작업에 있어서는 큰 이점이 있다고 생각하여 필요하다면 `Redux`와 함께 사용해왔었는데,

`React-Query`로 어느정도 대체할 수 있다고 생각이 들었다.

상황에 맞는 기술을 선택하는것도 개발자의 능력이 아닐까.. 라는 생각이든다.
