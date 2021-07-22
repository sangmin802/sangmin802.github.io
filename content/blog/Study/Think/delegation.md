---
title: ⌛ Event Delegation을 통한 효율적인 이벤트 할당
date: 2021-07-22 15:38:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`에서 하위의 컴포넌트에게 상위에서 비즈니스 로직과 관련된 이벤트 핸들러를 속성으로 전달 받아, 사용했었다.

```js
const Char = ({ setUserData, char }: PropsWithChildren<IChar<IData>>) => {
  const setUserDataEvent = useCallback(() => {
    setUserData(char.name)
  }, [char.name, setUserData])

  return (
    <Styled.Container>
      <Button aria-label="expedition-char">
        <Text type="desc">
          {char.lv} {char.name}
        </Text>
      </Button>
    </Styled.Container>
  )
}
```

`.map`과 같이 동적으로 생성되는 컴포넌트들에게 비슷한 역할을 하는 이벤트가 여러개가 생성이 되는 것이였다.

비단 `React`뿐만 아니라, 바닐라 자바스크립트를 사용하면서 이벤트를 할당해 줄 때에도 마찬가지의 상황이였다.

### useCallback을 통한 메모이제이션

`React`에서는 `useCallback` 훅을 사용하여 의존성 배열이 변하지 않는 한 메소드를 캐싱·메모이제이션 하여 동일한 메소드가 여러번 생성되는것을 개선해주는 방법이 있다.

하지만, 그렇다 하더라도 각각의 `dom`에 다른 의존성 배열을 갖고있는 이벤트들이 할당되는것은 여전하였다.

### 이벤트 사전작업, 후속조치 의 증가

이벤트 할당의 횟수가 100번 1000번 늘어가는것 자체가 해야할 작업이 늘어난 다는 것이고, 그러한 작업 증가는 자연스럽게 성능의 저하를 유발할 수 있다고 생각했다.

또한, 바닐라 자바스크립트를 혹은 `useEffect`로 `dom` 생성 이후에 이벤트를 부여를 할 때에는 대부분 의존성 배열로 인해 `unmount` 혹은 `update`되는 상황에 `removeEventListener`로 연결된 이벤트를 제거해줄 텐데, 이러한 작업또한 그만큼 늘어나는 것이였다.

### 속성의 전달

비즈니스 로직과 관련된 이벤트의 경우, 하위 컴포넌트의 재활용성을 해치지 않기 위해 대부분 `page`와 같은 최상위 컴포넌트에서 생성하여 아래와 같은 방법으로 전달한다.

1. 컴포넌트 조합을 통한 직접 할당
2. `props`를 통해 하위로 전달

1번의 방법이 권장되는 방법이고, 깔끔한 방식이긴 하지만 모든 상황에서 그렇게 처리하기에는 한계가 있다고 생각한다.

## 이벤트 위임 - Event delegation

위와 같은 상황에 사용할 수 있는 방법이 **이벤트 위임**이다.

`이벤트 버블링`의 개념을 생각해보면, 최 하위에서 사용자를 통해 발생하는 이벤트는 최상위인 `document`레벨 까지 거품처럼 올라간다.

따라서, 상위 `element` 에서는 하위에서 호출된 이벤트, 호출이 된 하위 `element`에대해 알 수 있게 된다.

그렇다면, 동적으로 생성되는 `dom`들을 감싸고 있는 하나의 상위 `dom`에만 이벤트를 부여하고, 각각의 하위 `dom`들의 고유한 속성을 조건에 따라 판단하여 이벤트를 호출하게 된다면 위에서 생겼던 고민들이 해결될 수 있는 것이다.

### 예제 - 이전

```js
const UserExpedition = ({
  userData,
  setUserData,
  setDialog,
}: PropsWithChildren<IUserExpedition<IUserData>>) => {
  const {
    expeditionInfo: { expeditionUserWrap },
  } = userData

  const closeHandler = useCallback(() => {
    setDialog(null)
  }, [setDialog])

  return (
    <Styled.Container>
      <Styled.ButtonContainer>
        <Button onClick={closeHandler}>
          <Text>닫기</Text>
        </Button>
      </Styled.ButtonContainer>
      {expeditionUserWrap.map((wrap, index) => (
        <ExpeditionServer
          key={`userExpedition${index}`}
          wrap={wrap}
          setUserData={setUserData}
        />
      ))}
    </Styled.Container>
  )
}
```

해당 컴포넌트에서는 다이얼로그를 비활성화 하는 `setDialog`와, 새로운 검색을 요청하는 `setUserData`라는 비즈니스로직을 `props`로 받아와 사용한다.

심지어 `setUserData`는 동적으로 생성되는 보다 더 하위 컴포넌트에서 각각의 다른 `user.name`속성에 의존하는 `handler`들을 생성하여 이벤트를 할당한다.

즉 각각 다른 의존성 배열을 갖고 있는 여러개의 이벤트가 생성되고 할당이 되는 것이다.

이를 `이벤트 위임`을 사용한다면 보다 효율적으로 처리할 수 있게 된다.

### 예제 - 이후

```js
const UserExpedition = ({
  userData,
  setUserData,
  setDialog,
}: PropsWithChildren<IUserExpedition<IUserData>>) => {
  const {
    expeditionInfo: { expeditionUserWrap },
  } = userData

  const expeditionHandler = useCallback(
    e => {
      const type = e.target.dataset

      if (type.close) return setDialog(null)
      if (type.name) return setUserData(type.name)
    },
    [setDialog, setUserData]
  )

  return (
    <Styled.Container onClick={expeditionHandler}>
      <Styled.ButtonContainer>
        <Button>
          <Text data-close>닫기</Text>
        </Button>
      </Styled.ButtonContainer>
      {expeditionUserWrap.map((wrap, index) => (
        <ExpeditionServer key={`userExpedition${index}`} wrap={wrap} />
      ))}
    </Styled.Container>
  )
}
```

최 상위 컴포넌트에 단 하나의 이벤트를 생성하고 할당한다.

이벤트를 할당받은 `element` 내부에서 사용자의 `click`이벤트가 호출이 될 때, 실제로 클릭이 된 하위 `element`들을 주어진 조건에 따라 판단을 하게 된다.

두가지 종류의 `element`에 새로운 속성을 부여했다.

1. `dialog`를 비활성화 하는 `element` 에는 `data-close`
2. 새로운 유저를 검색하는 `element`에는 `data-name : 유저명`

`dataset` 속성에 따라 각기 다른 이벤트를 호출하게 된다. 물론, 유저명을 검색할 때에는 해당 속성의 값도 인자로 보낸다.

이를 통해 절약된 부분이 있다.

1. 이벤트 속성을 여러번 전달할 필요가 없어짐
2. 이벤트 할당이 여러번 이루어지지 않게 됨

## 느낌

하위에 동일한 이벤트 타입을 사용하는 동적으로 생성될 `element`들이 있다면, 이벤트 위임으로 보다 더 효율적으로 이벤트를 할당해줄 수 있을것 같다.

> 다만, 좀 많은 양의 데이터를 필요로 하는 이벤트의 경우에는 `dataset`에 모든 데이터를 지정하는것이 좋은방법인것같지는 않아서 적합한 상황에만 사용하는것이 좋아보인다.
