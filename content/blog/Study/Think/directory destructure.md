---
title: ⚛ 컴포넌트의 역할과 디렉토리 구조
date: 2021-11-04 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`로 개발을 시작하면 기본적인 디렉토리들을 먼저 생성해주고있다.

- `src`
  - `components` : 컴포넌트 관리
  - `hooks` : 훅 관리
  - `constants` : 상수값 관리
  - `layout` : header, footer등의 공통적인 UI를 보유한 하나의 컴포넌트(대체로 App을 여기서 관리했음)
  - `pages` : 페이지 관리

처음에는 하나의 컴포넌트로 시작을 하더라도 많은 이유로 컴포넌트를 분리해내게 된다.

1. 재사용되는 UI를 컴포넌트로 분리하자
2. `useEffect`와 같은 `lifeCycle`을 독립적으로 수행시키고자 하는 경우, 컴포넌트를 분리하자
3. 응집도를 위해 하나의 목표를 하는 로직, UI를 하나의 컴포넌트로 분리하고, 적절한 컴포넌트 네이밍으로 용도를 알 수 있도록 추상화 하자.
4. 그냥, 너무 컴포넌트가 복잡하니깐 잘게 나누자?

이렇게 여러 이유로 인해 생성된 컴포넌트들이 모두 하나의 `components`디렉토리에 위치하게 되었다.

어느순간 `components`디렉토리를 보니 뭔가 잘못되었다는 생각을 하게 되었다.

## 다양한 목적으로 추상화된 컴포넌트

```js
export interface SectionContainerProps {
  title: ReactNode;
}

function SectionContainer({
  children,
  title,
  ...props
}: PropsWithChildren<SectionContainerProps>) {
  return (
    <Styled.Section {...props}>
      {title}
      {children}
    </Styled.Section>
  )
}

export default React.memo(SectionContainer)
```

`title`과, `children`을 받아와 하나의 `section`을 구성해주는 컴포넌트이다.

생성되는 컴포넌트의 위치값, 크기 등은 유연하게 설정될 수 있도록 상위에서 생성된 스타일을 `...props`로 받아와 사용한다.

`title` 또한, 상황에 따라 다른 스타일을 가질 수 있기 때문에, 외부에서 받아오도록 하였다.

해당 컴포넌트가 결정하는 것은, 정렬여부와 같이 여러곳에서 중복되어 사용되는 스타일만을 결정해준다.

```js
export interface ListProps {
  data: any[];
  item:
    | ((...args: any[]) => ReactElement)
    | MemoExoticComponent<(...args: any[]) => ReactElement>;
  dispatcher?:
    | { [key: string]: (...args: any[]) => void }
    | ((...args: any[]) => void);
}

function List({ data, item: Item, dispatcher, ...props }: ListProps) {
  return (
    <Styled.List {...props}>
      {data.map((data, index) => (
        <Item data={data} key={data.id ?? index} dispatcher={dispatcher} />
      ))}
    </Styled.List>
  )
}

export default React.memo(List)
```

`React`에서 자식 엘리먼트들을 생성하는 방법인 `.map`이 특별한 이유가 없다면 비슷한 구조로 생성되는것 같아서, 재사용가능한 컴포넌트로 분리했다.

- `Item` : 생성되는 엘리먼트들을 지칭
- `data` : 생성되는 엘리먼들에 전달될 속성인 `data`
- `dispatcher` : 생성되는 엘리먼트 내부에서 호출될 `dispatcher`. 있을수도, 없을수도 있기에 `nullable`한 속성이다.

이 3가지 혹은, 2가지 핵심적인 속성들만을 외부에서 파악할 수 있고, 구현하는데 필요한 세부적인 로직들은 내부로 숨겨서 하나의 `List` 컴포넌트로 추상화 하였다.

위의 `SectionContainer`와 `List` 컴포넌트 두가지 모두, 범용성 있는 네이밍과, 여러가지 중요한 요소들을 외부에서부터 결정될 수 있도록 하여, 최대한 유연한 컴포넌트가 될 수 있도록 추상화햐였다.

이런 컴포넌트들 사이에 몇몇 이질감있는 컴포넌트들이 존재했다.

```js
interface FetchUserInfoProps {
  match: {
    params: {
      name: string,
    },
  };
}

function FetchUserInfo({
  match: {
    params: { name },
  },
}: FetchUserInfoProps) {
  const [userKey, userCollectionKey] = [
    ['userInfo', name],
    ['userCollection', name],
  ]
  useCancelQuery([userCollectionKey])

  return (
    <ErrorBoundary errorFallback={ErrorFallback} keys={name}>
      <Dialog rerender={userKey}>
        <UserInfo userKey={userKey} userCollectionKey={userCollectionKey} />
      </Dialog>
    </ErrorBoundary>
  )
}

export default FetchUserInfo
```

`UserInfo`는 `React Router`의 `pages`로서 하나의 도메인으로 판단되어 `pages/userInfo` 디렉토리에 위치하고 있다.

외부 데이터를 받아오는 비동기 로직을 `React-Query`를 통해 구현하였는데, `React-Query`와 관련된 에러핸들리이나, 캔슬링 등은 `UserInfo`내부에서 `userData`를 `UI`로 표현하는것과는 전혀 관계가 없기 때문에, 별도의 컴포넌트로 분리를 해주었다.

그 외, `Dialog`같이 `viewPort` 고정이나, `dialog`상태값, `UI`등을 관리하는 컴포넌트를 하나로 응집, 추상화하여 감싸주고 있다.

## 잡동사니가된 components 디렉토리

위와 같이 생성된 컴포넌트들이 `components`디렉토리에 저장되면서 점점 이상해지기 시작했다.

재사용가능하고 유연한 컴포넌트들만 있을것이라고 생각했던 디렉토리에 특정 `pages`만을 위한 컴포넌트들이 자리잡기 시작했고, 빠르게 혼잡해지기 시작했다.

정말 필요한 컴포넌트들을 빠르게 찾는것이 어려워졌다.

또한, 특정 `pages`에서 분리된 컴포넌트들을 찾기 위해 다른 `pages`들에서 사용되는 컴포넌트, 재사용가능한 컴포넌트들에서 찾아야하는것이 문제가되기 시작했다.

## 컴포넌트의 용도에 따라 재배치하기

이전에는 그냥 컴포넌트라는 이유, 용도만으로 `components`디렉토리에 저장하였지만, 다른 방법이 필요하다.

1. 특정 `pages`에서만 사용되는 분리된 컴포넌트는 그 하위에서 바로관리하자.
2. 모든 `pages`, 모든 컴포넌트에서 재사용 가능할 수 있도록 유연하게 설계된 컴포넌트들만 `components`디렉토리에서 관리하자.

최종적으로 `components` 디렉토리에 남게 된 컴포넌트들이다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/11/04/1.PNG?raw=true" alt="components">
</div>

그 외, `pages`와 강력하게 연결되어있는 컴포넌트들은 아래와 같이 관리해주기로 했다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/11/04/2.PNG?raw=true" alt="components">
</div>

## 컴포넌트를 분리하는 약속

컴포넌트를 관리하는 디렉토리를 확실하게 구분하게 되면서, 컴포넌트의 용도, 목적에 대해 확실히 할 필요가 있어졌다.

1. 재사용 가능하도록 설계할 컴포넌트의 경우에는, 최소한의 고유한 코드를 제외하고 변동될 가능성이 높은 요소들은 외부에서 정해주어서 유연한 상태를 유지하도록 한다.
2. 단순하게 `UI`가 길어진다는 이유로 컴포넌트를 분리하여 불필요한 속성 전달, 파일 이동등을 강요하는 상황을 만들지 말자.
   > `UI`의 상태값을 관리하는 로직을 `hook`등을 통해 추상화 하는것을 먼저 고려해보자

컴포넌트를 목적에 따라 추상화 하는 내용은 아래의 링크에서 너무 잘 설명해주셔서 많은 도움이 되었다.

- [jbee - 변경에 유연한 컴포넌트](https://jbee.io/web/components-should-be-flexible/)

## 고민

### 추상화 단계의 통일

이전에, 하나의 컴포넌트 내부에서 추상화단계를 통일해주는것이 좋다는 글을 보았고, 정리를 했었다.

그렇다면, `tab menu`와 같이 중간단계의 추상화를 갖게되는 로직을 별도로 분리하는것이 좋을까?

`tab menu`와 같이 특정 상태값에 따라 다른 `UI`를 보여주는 로직을 별도의 컴포넌트로 분리해서 관리하는 방법도 고려해볼 수 있을것 같다.

> 해당 컴포넌트를 만들어보긴 했는데, 실제로 사용하는데 있어서는 조금 고민이 된다..

### 추상화와 유연한 컴포넌트

디테일한 로직, 구현과정은 숨기고 핵심적인 요소들만 외부에 표현하여 마치 선언형의 프로그래밍을 하도록 도와주는 추상화 작업의 결과물이 절대적으로 모두 재사용 가능하다는것은 아닐것 같다는 생각이 든다.

그렇다면 정말, 정말로 문뜩 든 생각이지만 반복적으로 사용되는 코드들을 분리하여 하나의 핵심적인 네이밍으로 여러곳에서 재활용할 수 있도록 유연한 컴포넌트로 분리해 만드는것은 추상화 작업과 동일선상이 아니라, 추상화 작업 중 하나의 방법 아닐까..?

당연히 정답이 아닌 오로지 개인적인 생각일 뿐이다..
