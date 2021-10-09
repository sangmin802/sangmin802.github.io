---
title: ⚛ HOC와 Custom Hook
date: 2021-10-07 16:31:00
category: 'Study'
draft: false
tag: 'Think'
---

이전에, 컴포넌트들의 추상화 수준에는 정답이 없지만, 동일 컴포넌트 내부에서의 추상화 수준은 통일을 시켜주는것이 좋다는 글을 보고 정리를 했었다.

- [선언적인 컴포넌트로 추상화, 그리고 수준의 통일](https://sangmin802.github.io/Study/Think/abstract%20painting/)

이후, 진행해왔던 프로젝트들을 보면 어느정도 통일은 되어있지만, 비슷한 방식으로 통일됨을 방해하는 구문이 있었다.

```js
{
  condition && <Component />
}
```

많이 사용해온 방법이었다.

사실, 가장 쉽게 해결하기 위해서는 `Component` 내부에서 조건에 맞지 않을 때에는 `return null` 방식으로 해주면 되긴 하다.

```js
function Component({data, ...props}){
  if(!data) return null;

  return (
    // render
  )
}
```

단순하게 데이터를 받아와 렌더링을 진행하는 컴포넌트라면 크게 문제될 것이 없지만, 로직이 추가되기 시작한다면 문제가 생긴다.

```js
function Component({data, ...props}){
  if(!data) return null;

  useEffect(() => {
    // do Something
  }, [data])

  return (
    // render
  )
}
```

문제없어보이는 컴포넌트같지만, 에러가 발생한다.

`useEffect`, `useCallback`과 같은 `hook`들은 조건문 이후에 작성이 될 수 없다.

즉, 조건문들은 모두 `hook`들 내부에서 별도로 진행되어야 한다.

```js
function Component({data, ...props}){

  useEffect(() => {
    if(!data) return
    // do Something
  }, [data])


  if(!data) return null;
  return (
    // render
  )
}
```

결국 위와 같은 방식으로 `hook` 내부에서도 조건을 걸어 구분해줘야 한다.

물론, `data && do Something`이나 `data?.doSomething()` 처럼 비교적 조건문을 편리하게 작성해줄 수 있도록 `ES`시리즈가 도와주고 있긴하지만, 동일한 컴포넌트 내에 비슷한 조건문을 여러번 사용하는것이 과연 맞는 방법일까라는 고민을 하게 되었다.

## HOC, Custom Hook

위에서 겪은 상황을 위한 방법은 아니지만, 해결할 수 있다고 생각되어 고민해보게 되었다.

## Custom Hook

`class`기반 컴포넌트가 아닌 함수형으로 컴포넌트를 구성할 수 있게 되었다.

이를 통해, 비교적 간단하게 기능별로 추상화를 할 수 있고, 쉽게 재사용할 수 있다.

```js
function App() {
  return (
    <Composition>
      <div>Hello!</div>
      <div>I am Sangmin</div>
      <Component data={data} />
    </Composition>
  )
}

function Composition(children) {
  const [state, setState] = useState()

  // some logic

  return (
    <div>
      <div>Introduce</div>
      <div>{children}</div>
    </div>
  )
}
```

생성되는 `UI`, `UI`와 관련된 로직들을 하나의 `Custom Hook`으로 묶어서 사용을 할 수 있게 되었다.

필요한 속성만을 전달하여 컴포넌트의 이름을 통해 어떠한 역할을 하는지만 알 수 있고, 실제로 수행되는 작업들은 하나로 추상화 시킬수 있다.

당연히, `React`에서 권장하는 조합도 완벽히 적용 가능하다.

`UI`와 별개로 재사용되는 로직만을 분리하여 `Custom Hook`을 생성할 수 있다.

위와 같은 상황에서 조금 아쉬운점이 있다면, 로직은 재사용되는것이 맞지만, `UI`를 구성할 때 다른 스타일을 적용하고싶다면, 스타일 관련 속성을 더 전달해줘야하는 불편함이 있다.

속성이 추가된다는것은 점점 결속력이 짖어짐을 의미하기 때문에, 첫 목적이였던 재사용 가능함의 의미가 조금 퇴색될 수 있을것 같다.

```js
function useInterval(time, work) {
  const { startInterval, endInterval } = useMemo(() => interval(time, work), [
    work,
    time,
  ])

  useEffect(() => {
    startInterval()

    return () => {
      endInterval()
    }
  }, [startInterval, endInterval])
}
```

만약, `timer`과 같은 작업을 수행하기 위해 여러 컴포넌트에서 `interval`기능을 사용해야 한다면, 위와 같은 방식으로 `Custom Hook`을 생성하여 재사용할 수 있을것 같다.

> 단순 이해를 위해 급히 작성한 코드라서 안될수도 있다..

`Custom Hook`은 `UI render`를 제외한 오로지 상태값만을 계산하는 기능만을 추상화하는것도 가능하다.

어쩌면, `UI`를 구성하는 `hook`과 비즈니스 로직을 통해 상태값을 계산하는 `hook`을 별도로 관리하는것이 더 좋을것 같기도 하다.

> 역할에 따른 분리를 통한 이점은 +

## HOC - 고차 컴포넌트

이전, `class`기반의 컴포넌트로 `React`를 개발할 때 비슷한 로직이 여러군데에 사용될 때 권장되는 방법이였다고 한다.

새로운 `api`같은것이 아닌, 단순한 개발 기법이다.

```js
// Component
function Component(props) {
  // do Something
}

export default Wrapper(Component)

// Wrapper
export const Wrapper = Component => props => {
  // recycle logic
  return <Component {...props} />
}
```

`Wrapper`함수는 인자로 전달받은 컴포넌트를 새로운 환경에서 다시 생성될 수 있도록 반환하는 함수를 생성한다.

> 약간 데코레이터 함수와 비슷한 역할을 하는 것 같다.

`Component`를 실제로 사용하는 부모 컴포넌트에서는

```js
function WrappedComponent(props) {
  // recycle logic
  return <Component {...props} />
}
```

위와 같은 컴포넌트를 사용하는것이 아닐까 생각된다.

> 이제보니, 클로저의 특징도 이용되는것 같다...

## 문제 해결

다시 처음으로 돌아와서

문제를 해결하는데에 `Custom Hook`은 적합해보이지 않는다.
로직만을 관리하는 `Custom Hook`에서는 `UI`렌더링을 막을 수 없기 때문이다.

### Custom Hook으로 해결

```js
<ConditionalRender
  render={dialog ? true : false}
  Component={Dialog}
  dialog={dialog}
  setDialog={setDialog}
/>
```

```js
import React from 'react'

const ConditionalRender = ({ render, Component, ...props }) => {
  if (!render) return null

  return <Component {...props} />
}

export default React.memo(ConditionalRender)
```

`Custom Hook`을 사용하여 해결할 수 있었다.

### HOC

```js
<Dialog render={dialog ? true : false} dialog={dialog} setDialog={setDialog} />
```

```js
import React from 'react'

const ConditionalRender = Component => ({ render, ...props }) =>
  render ? <Component {...props} /> : null

export default ConditionalRender
```

`HOC`방식으로도 해결은 가능했다.

## 느낌

`HOC`는 단점이 있는데, 여러개가 중첩되어 사용될 때 간혹 속성이 겹치는 경우가 있다고 한다.

> 또한, 그것이 어느곳에서 일어났는지 빠르게 파악하기 어렵다고 한다..

따라서 대부분의 상황에서는 `Custom Hook`을 권장한다고 한다..

이번 고민에서는 `HOC`가 여러번 중첩될 필요가 없었기 떄문에 강력하고 깔끔하게 해결할 수 있었다.

당연한 말이겠지만, 상황에 따라 사용하는것이 좋아보인다.

## 참조

- [Why React Hooks over HOCs](https://www.robinwieruch.de/react-hooks-higher-order-components)
