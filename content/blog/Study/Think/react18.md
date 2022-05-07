---
title: 'React 18 준비하기'
date: 2022-05-07 12:34:00
category: 'Study'
draft: false
tag: 'Think'
---

## React18 등장

현재 개인 토이프로젝트도 `Susepnse` 기능을 사용하고 있다. 해당 기능은 사실 `React18` 버전 출시 이전에 실험용으로 제공되는 기능으로 표시되어 있었다.

> 근데 개인적으로 사용하는데에 큰 문제는 없었음

그리고 얼마전 `React18`버전이 `동시성`이라는 키워드와 함께 정식적으로 릴리즈되었다.

그것에 대해 알아보고, 기록하고자 한다.

> 충분시 수정될 여지가 많은 기록

## 동시성

대략적으로 이해한 바로는 화면을 그리기 위해 데이터를 받아오는 등의 작업을 수행할 때 사용자는 일시적으로 사용자가 작업을 수행할 수 없지만, 그러한 작업 중에도 사용자의 작업을 동시에 수행하고, 즉시 응답할 수 있어야 사용자에게 좋은 경험을 제공해준다.

> 비동기랑 뭐가 다르지 라는 생각도 든다..

`React` 공식문서에서의 표현이 있다.

1. CPU 바운드 업데이트(예를 들어 DOM 노드 만들기 및 컴포넌트 코드 실행)의 경우 Concurrency는 더욱 긴급한 업데이트가 이미 시작한 렌더링을 “중단” 할 수 있음을 의미합니다.
2. IO 바운드 업데이트(예를 들어 네트워크에서 코드나 데이터를 가져오는 것)의 경우 Concurrency는 모든 데이터가 도달하기 전에 React가 메모리에서 렌더링을 시작할 수 있으며 빈 로딩 state표시를 무시할 수 있음을 의미합니다.

- [동시성에 대한 글](https://programming119.tistory.com/242)

## 신규기능

### useTransition - 전환

```js
const [isDelay, setTransition] = useTransition()

// 단일로 사용 시
// 다만 isDelay라는 지연중인 상태를 따로 제공하지 않음. 공식문서에서는 useTransition 권장
startTransition(...)
```

`setTransition`으로 감싼 ★상태 업데이트★는 비교적 긴급하지 않은 이벤트로 전환시켜준다.

만약 사용자의 `input` 이벤트가 호출이 되고 그 값을 저장하는 `setState`가 있다고 가정 `setState`를 위의 `hook`으로 전환시켜주면 사용자의 `input` 이벤트가 계속 진행중일 때에는 `setState`가 중단된다는것 같음.

다른 페이지로 이동하거나, 특정 컴포넌트를 렌더링하는데 데이터가 준비되자 않았을 경우 로딩스피너를 통해 사용자에게 준비중을 알림.

이것이 최선의 방법이라고 생각하여 사용해왔지만 때로는 이전의 데이터를 보여주는것이 더 바람직한 경우가 있음

> 테이블 리스트를 보여주고 페이지네이션으로 이동하는 등

이 때 `useTransition`을 사용하여 새로운 데이터를 불러오는 로직 자체를 긴급하지 않음으로 설정하여 이전의 `ui`를 유지시킬 수 있음.
한가지 궁금한점은, 비동기를 효율적으로 관리하기 위해 사용되는 `React-Query`에는 이전의 데이터를 유지할 수 있는 기능과 `isFetching`으로 기존의 `ui`는 유지하고 최신의 데이터를 받아오는 중임을 상태를 알려주는데, 이와 `useTransition`이 어떤 차이가 있을지 궁금

> 아예 데이터가 존재하지 않아서 보여줄 `ui`가 없을 때에는 `Suspense.fallback`으로 로딩스피너를, 이전의 `ui`가 존재한다면 그것을 유지하는

- [전환을 사용하여 ui 작업을 동시에](https://www.youtube.com/watch?v=Kd0d-9RQHSw)

### useDeferredValue - 외부에서 관리하는 상태에 대한 전환

`redux`같은 다른 라이브러리나 `props`로 전달받은 상태에 전환을 부여하고자 할 때는

```js
const 전환상태 = useDeferredValue(상태)
```

위처럼 사용할 수 있음. 이 또한 `isDelay`가 제공되는것 같지는 않음

### useTransition 전환 훅 느낌

10000개의 리스트를 검색값에 대한 filter를 통해 렌더링을 진행할 때 123을 쳤다가 블락잡아서 한번에 지웠을 경우를 생각

그러면 10000개의 리스트를 다시 계산하느라 렌더링이 중단되고 사용자가 지웠다는 행위도 반영되지 않았다가 리스트 계산이 종료되면 지웠다는 행위가 ui에 반영되고, 리스트도 같이 반영됨

만약, 전환기능을 사용했다면 123을 블락잡아서 지웠을 때 바로 지워진 ui가 반영되고 10000개의 리스트가 계산되어 따로따로 ui에 반영됨

마치 두개가 서로 다른 스레드에서 계산되고 ui에 반영되는것처럼 보여짐

> 동시성이 한번에 이해되는 결과

그런데, `useEffect`로 관리하는것도 따로 구현을 해보았는데 그거랑 결과가 유사하게 보이기는 함

아마 `useEffect`와 리스트를 갱신하는 `setState` 둘다 비동기라서 ui 렌더링 이후에 작동되어서 그런게 아닐까 싶음

결과는 유사하게 보이긴 하는데 `useEffect`가 `ui`를 그리는것과 로직을 수행하는것이 동시에 수행되는것은 아니라서 `useTransition`의 `ui`를 동시에 그린다라는것은 뭔가 차이가 있을것 같긴 함.

> 중간에 `isDealy`를 통해 `ui`를 추가할 수 있는것은 위처럼 10000개의 무거운 작업을 수행하는 메인스레드와 별개로 수행되는것 처럼

- [10000개의 리스트와 전환](https://www.youtube.com/watch?v=lDukIAymutM)

### Suspense

컴포넌트 중단을 통해 준비되지 않은 컴포넌트가 마운트되고 언마운트 되는 렌더링 비용을 줄일 수 있음

- [깃 suspense를 사용한 로딩처리에 대한 변경점](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md#behavior-change-committed-trees-are-always-consistent)

## 별도

### Reac18-TypeScript

`React`의 버전이 18로 올라가면서, 이에 타입스크립트도 변화가 생겼음.

대부분은 큰 문제가 없지만, 조금 수정이 필요했던것이 `React.FC`에 내부적으로 처리를 해주고 있던 `PropsWithChildren` 제너릭 타입이 사라졌다.

`React.FC`타입을 지정해주면 자연스럽게 사용할 수 있었던 `children`속성이 이제는 에러를 반환한다.

> `children`속성을 사용할 경우 직접 타입을 명시해주는것이 더 올바르다고 생각하는 것 같다. - 그런것 같기도

- [React18 타입 이슈](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46691)
- [React18 타입 변경 커밋](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/55dc209ceb6dbcd59c4c68cc8dfb77faadd9de12#diff-32cfd8cb197872bcba371f5018185d2e75fa540b52cda2dd7d8ac12dcc021299L500)

위와 같은 방식으로 제공되는 모듈이 있었는데, `React-Query`

`React18`의 타입을 맞추면 `QueryProvider`에서 `children` 속성의 에러가 반환되었었다.

`React-Query` 또한 내부적으로 이전의 `React.FC`를 사용하고 있었고, 그것의 `PropsWithChildren`에 의존하고 있던것!

`v3`에서 바로 수정되었다

- [수정사항이 담긴 커밋](https://github.com/tannerlinsley/react-query/pull/3520/files)

## 참고

- [공식문서 동시성](https://ko.reactjs.org/docs/concurrent-mode-intro.html)
- [공식문서 변경사항](https://reactjs.org/docs/react-dom-client.html#createroot)
- [공식문서 useTransition](https://reactjs.org/docs/hooks-reference.html#usetransition)
