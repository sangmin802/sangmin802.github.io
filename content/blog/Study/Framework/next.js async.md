---
title: ⚛ Next.js(SSR)에서의 Suspense, ErrorBoundary
date: 2021-07-20 14:10:00
category: 'Study'
draft: false
tag: 'Think'
---

클라이언트사이드에서 `React.js`를 사용하여 비동기작업을 좀 더 효율적으로 작성해보았었다. `React-Query`를 사용하여, 해당 컴포넌트는 데이터를 받아왔을 때의 상태만을 고려하여 구성할 수 있었고

`Suspense`와 `ErrorBoundary`를 사용하여 데이터 패칭, 혹은 에러상황에서의 에러 핸들링을 컴포넌트 외부에서 처리할 수 있었다.

이번에는 렌더링 시 서버사이드에서 한번 클라이언트사이드에서 한번 실행되는 `SSR` 기반인 `Next.js`에도 한번 사용해보려고 한다.

## 이전에 발생했던 문제

이전에도 `React.js`로 만들었던 코드를 `Next.js`에서 대부분 가져와서 `Next.js`방식으로 일부분만 수정해서 사용했었다. 그 때에도 발생했던 문제가 있었다.

**`new DOMParser`는 서버사이드에서 실행될 수 없는 점.**

따라서 서버사이드에서 렌더링을 할 때에는 `jsdom`을 사용하고, 클라이언트사이드에서 렌더링을 할 때에는 `new DOMParser`를 사용하도록 하였다.

> 물론, `next.config`파일을 통해 서버상태가 아니라면 `jsdom`과 같이 서버전용 모듈을 `null` 상태로 바꿔주기도 했었다.

```js
module.exports = withCSS({
  webpack: (config, { isServer }) => {
    // ... other codes

    if (!isServer) {
      config.node = {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      }
    }

    // ... other codes
    return config
  },
})
```

이번에도 `Suspense`와 `ErrorBoundary`를 가져오면서 비슷한 문제가 생겼었다.

## 일단 비동기작업을 useQuery로 변경

일단 `Redux`, `Redux-Saga`기반으로 돌아가던 비동기작업을 모두 `useQuery`로 변경해주기로 했다.

```js
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      suspense: true,
      useErrorBoundary: true,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 3,
    },
  },
})

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={THEME}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
```

`QueryClientProvider`로 `query`들이 실행될 백그라운드의 를 생성하고, 기본적인 옵션들을 설정한 다음 할당해준다.

이러한 과정은 앱의 최초단계에 실행되어야 하므로 `pages/_app`에서 설정해주었다.

## query를 사용하여 initialData 생성

`SSR`특성상 서버상에서 비동기 작업을 통해 사용해야할 데이터를 미리 받고, 사용자에게 넘겨줄 수 있다.

```js
export async function getStaticProps() {
  const eventData = JSON.stringify(await getEventData())
  const calendarData = JSON.stringify(await getCalendarData())
  return { props: { eventData, calendarData } }
}
```

다만, `getStaticProps`를 통해 생성된 `data`는 문자열로 읽혀야 하기 때문에, 문자열로 변환을 해주고, `useQuery`에서 다시 `parse`하여 사용해주었다.

```js
export function useEvent(initialData) {
  const { data: eventData } = useQuery('fetchEventData', () => getEventData(), {
    initialData: JSON.parse(initialData),
    refetchOnWindowFocus: false,
  })

  return eventData
}
```

## 문제의 시작 Suspense

`useQuery`로 변경하고, 실행을 할 때에는 문제없겠지라는 생각을 했었다.

하지만 그렇지 않았다.

**Suspense는 아직 ReactDOMServer에서 지원되지 않습니다.**

`Suspense`는 비교적 최신의 기술이고, 아직 `React`, `React-Query` 두가지 공문에서도 불완전한 부분이 있다고 설명되어있었다.

그래서, `Next.js(SSR)`에서 처음 서버사이드에서도 한번 렌더링을 진행할 때, `Suspense`라는 모듈을 이해하지 못하는 것이였다.

따라서 해당 `Suspense` 모듈이 하는 작업을 커스텀 방식으로 만들어 줄 필요가 있었다. 한참 고민을 하던 중, `jbee`님의 블로그에서 좋은 방법을 찾을 수 있었다.

서버사이드에서 `Suspense`가 작동되지 않는다면 `Suspense`를 서버사이드에서 렌더링 할 때에는 거치지 않도록 하면 되는것이였다.

### CustomSuspense

기존에 사용하고 있던 `AsyncBoundary`에서 `Suspense`를 내가 만든 `CustomSuspense`로 변경을 해줄 것이다.

```js
import { PropsWithChildren, ReactElement, useCallback } from 'react'
import { useQueryErrorResetBoundary } from 'react-query'
import { ErrorBoundary, CustomSuspense } from 'components/'

interface IAsyncBoundary {
  suspenseFallback: ReactElement;
  errorFallback: ReactElement;
  children: ReactElement;
}

const AsyncBoundary = ({
  suspenseFallback,
  errorFallback,
  children,
}: PropsWithChildren<IAsyncBoundary>) => {
  const { reset } = useQueryErrorResetBoundary()
  const resetHandler = useCallback(() => {
    reset()
  }, [reset])

  return (
    <ErrorBoundary resetQuery={resetHandler} errorFallback={errorFallback}>
      <CustomSuspense fallback={suspenseFallback}>{children}</CustomSuspense>
    </ErrorBoundary>
  )
}

export default AsyncBoundary
```

물론 해당 `CustomSuspense`에서는 서버인지 클라이언트인지 구분을 하고, 사로 다른 방식으로 렌더링을 해줘야 한다.

평소 `Next.js`에서 클라이언트사이드인지 서버사이드인지를 구분할 때, `typeof window`를 자주 사용했었는데, 이번에 새로운 방법또한 배우게 되었다.

> 항상 감사합니다 jbee님

```js
import { Suspense, useEffect, useState, ComponentProps } from 'react'

function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default function CustomSuspense(props: ComponentProps<typeof Suspense>) {
  const isMounted = useMounted()

  if (isMounted) {
    return <Suspense {...props} />
  }
  return <>{props.fallback}</>
}
```

서버사이드에서는 `React`의 `LifeCycle`들이 작동되지 않는다고 한다.

조금 있다가 확인해 볼 `ErrorBoundary`에서도 서버사이드에서는 `getDerivedStateFromError` 생명주기가 작동되지 않는것을 알 수 있었다.

생각해보면 간단한데, `useEffect (componentDidMount etc...)`등의 생명주기들은 렌더링 이후에 실행되기 때문이다. 서버사이드에서도 먼저 렌더링을 하지 않나 라는 생각을 할 수 있지만, 여기서의 렌더링 이후는

> “after we’re done converting the React app into a HTML string”

`React app`을 `HTML`로 변환을 한 이후 라고 한다.

따라서, `useEffect`가 실행되기 전이라 `isMoundted === false` 인 상태에서는 그냥, `loadingFallback`을 렌더링 하게 되고,

이후에 `useEffect`가 실행이 된다면, 클라이언트 사이드에서 `HTML`로 변환이 완료된 상태라는것을 의미하고, 그 때 `React`의 `Suspense`모듈이 사용되는 것이다.

### ErrorBoundary

위에서 서버사이드 렌더링 때에는 생명주기가 호출되지 않는다는점으로 발생하게된 하나의 문제가 더 있다.

`ErrorBoundary`에서 하위 컴포넌트의 생명주기 중, 발생하게되는 에러를 감지하고 호출되는 `getDerivedStateFromError`또한 실행되지 않는다.

특히 해당 문제는, `getStaticProps`와 같이 `prerendering`을 진행하는 과정에서 비동기 작업중 발생하는 에러에 있어서 설정해놓은 에러핸들링의 과정을 거치지 않고, 그냥 서버상에서 `Error`를 띄워버린다.

즉, 이전과는 다른 방식으로 에러를 처리해줄 필요가 있었다.

`root` 라우트에서는 `eventData`와 `calendarData`를 서버상에서 미리 데이터를 패칭하고, 초기 데이터를 클라이언트에서 컴포넌트를 구현할 때 전달을 해줘서 클라이언트사이드 상에서는 데이터 패칭이 없이 바로 형성되도록 하였다.

```js
export async function getStaticProps() {
  const eventData = JSON.stringify(await getEventData())
  const calendarData = JSON.stringify(await getCalendarData())
  return { props: { eventData, calendarData } }
}
```

하지만, 여기서의 비동기 작업에서 발생하는 에러에 있어서는 기존의 설정갖고는 처리를 할 수가 없었다.

그래서 생각한 것이, 위의 `Suspense`처럼 에러가 발생한 이후의 후속조치와 같은 작업들을 모두 클라이언트상으로 넘겨버리는 것이다.

> 마치 그냥 `React.js`를 사용하는 것 처럼

`getStaticProps`와 같은 메소드들은 `return`하는 값들이 필수적인데, 이러한 점을 활용하였다.

```js
export async function getStaticProps() {
  try {
    const eventData = JSON.stringify(await getEventData())
    const calendarData = JSON.stringify(await getCalendarData())
    return { props: { eventData, calendarData } }
  } catch {
    return { props: { eventData: null, calendarData: null } }
  }
}
```

먼저 해당 메소드에서 에러가 발생하게 되면 초기 데이터를 `null`로 하여 반환하였다.

그리고, `useQuery`에서 이 서버에서 미리 받아온 데이터가 `null`이라면, `initialData`속성을 제거해서 `option`을 할당해주고, 데이터가 존재하다면 `initialData`속성을 추가해서 할당해주었다.

```js
import { getEventData } from 'api/api'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export function useEvent(initialData) {
  const option = useMemo(() => {
    const root = { refetchOnWindowFocus: false }

    if (initialData) return { ...root, initialData: JSON.parse(initialData) }
    return root
  }, [initialData])

  const { data: eventData } = useQuery(
    'fetchEventData',
    () => getEventData(),
    option
  )

  return eventData
}
```

만약 서버에서 `null`의 데이터를 받아와 `initialData`가 없이 렌더링 된다면 자연스럽게 해당 데이터를 받아오는 과정을 수행을 할 것이고, 그렇게된다면 이전에 설정해 놓은 클라이언트상의 `ErrorBoundary`가 정상적으로 실행되는 것이다.

`null`이 아닌 정상적인 데이터를 받아오게된다면, `ErrorBoundary`가 실행될 필요가 없으니 상관 없다.

이 방법이 정답이라고 생각하진 않는다. 다만, 현재 나의 생각으로 최대한 원리들을 파악하며 해결해본 방법이다.

이번에 `Next.js`로 해당 프로젝트를 업데이트 하면서 여러가지 새로운 시도를 해보았고, 몰랐던 점들도 많이 알게되어 좋은 경험이였던것 같다.
