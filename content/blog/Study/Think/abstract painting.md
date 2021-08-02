---
title: ⚛ 선언적인 컴포넌트로 추상화, 그리고 수준의 통일
date: 2021-08-02 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`를 기반으로 개발을 하다보면, 고민이 되는 부분이 있다.
컴포넌트 추상화의 수준을 정하는 것.

## 선언형 컴포넌트로 추상화

`React`에서는 상위 컴포넌트가 하위 컴포넌트에게 속성을 전달하여 오로지 전달받은 속성만을 사용하여 렌더링하는것이 가능하다.

```js
<Title title="타이틀1" handleTitle={handleTitle} />
```

위와 같은 속성전달을 통해 하위 컴포넌트 내부에는 비즈니스 로직을 생성하지 않아 재활용성을 높일 수 있게 된다.

또한, 해당 컴포넌트에서 사용하게 될 로직이나, 필수적으로 보여질 데이터들만을 속성으로 보내서 다른 역할을 빠르게 알 수 있다.

`무엇을 하는지`만 외부에서 보여지고, `어떻게 하는지`는 컴포넌트 내부에서 처리한다.

이와같은 방식을 선언적인 코드라고 한다.
그리고 중요 개념만을 남기고 `Title`이라는 컴포넌트로 추상화 한 것이다.

추상화 과정에서 하위로 전달되야하는 속성들이 많아서, 컴포넌트의 재활용성이 떨어지는것 같다면 **조합**을 사용할 수 있었다.

```js
<Styled.Form onSubmit={handleSubmit}>
  <Styled.InputText>
    <Input type="text" ref={textInput} autoComplete="off" />
  </Styled.InputText>
  <Styled.InputSubmit>
    <Button>
      <Text>검색</Text>
    </Button>
  </Styled.InputSubmit>
</Styled.Form>
```

1. 하나의 일 만을 수행하는 컴포넌트를 위해 필요한 속성만을 전달받을 수 있다.
2. 상위에서 생성된 비즈니스로직들을 하위로 여러번 전달할 필요가 없이 한번에 전달할 수 있다.

어쩌면, 조합 또한 이 컴포넌트가 `무엇을 하는지`에만 집중하여 추상화 될 수 있도록 도와주는 방법이 아닐까 싶다.

## 추상화의 수준

### 높은 추상화

```js
<Title type="title" title="리스트" />
```

해당 컴포넌트 내부에서 어떤 작업, 어떤 마크업을 갖고 렌더링하는지는 신경쓰지 않고, `무엇을 사용할지`만 전달하여 역할을 빠르게 알 수 있도록 높은 수준으로 추상화 할 수 있다.

### 중간 추상화

```js
{
  !data && <Button handleClick={handleFetchData}>불러오기</Button>
}
```

`React`에서 많이보던 조건부 렌더링일 것이다. 이 또한, 높은 추상화와 유사하게 `무엇을 할 지`와 관련된 속성만을 전달하여 렌더링한다.

하지만, `data`에 따라서 다른 렌더링을 해야 하기 때문에, 추상화된 컴포넌트 외부의 조건 로직도 함께해야한다.

> 아마 그 때문에 중간 추상화 단계가 아닐까 싶다..

### 낮은 추상화

```js
<div>
  {data.map(res => (
    <Item data={res} />
  ))}
</div>
```

처음 높은 추상화와 비교해보았을 때 정말 큰 차이가 있다. `무엇을 할 지`가 중심이 아닌 `어떻게 할 지`가 중심이된 코드이다.

## 추상화 수준의 정답

사실 추상화 수준을 정하는 데에 정답은 없다고 한다.

각각의 조직에서 선택한 수준에 따라가면 될 것 같다.

하지만, 이러한 상황들이 있다.

```js
<Container>
  <Text type="title">리스트</Text>
  <div>
    {data.map(res => (
      <Item data={res}/>
    ))}
  </div>
  <Button handleClick={handleClick}>버튼<Button>
  {!data && <div>데이터가 없습니다.</div>}
</Container>
```

하나의 컴포넌트에 여러 추상화수준이 사용되었을 때.

실제로 위와 같은 코드들이 프로젝트에 있어서 이번에 모두 수정해보았다.

대표적인 상황이 두가지가 있었다.

### 동적으로 생성되는 컴포넌트 추상화

`.map`과 같이 동적으로 컴포넌트를 생성할 때 위처럼 높은 추상화 수준인 컴포넌트와 함께 있는 경우에는 구분해주기로 하였다.

```js
const MapContainer = ({
  data = [],
  dataKey = 'data',
  children,
}: PropsWithChildren<IMapContainer>) => (
  <>
    {data.map((data, i) =>
      cloneElement(children, { [dataKey]: data, key: i, i })
    )}
  </>
)
```

컴포넌트의 이름과 전달되는 속성들을 통해 내부에서 `어떻게 수행될 지`가 아닌 `어떤 일을 하는 지` 바로 이해할 수 있도록 추상화하였다.

동적으로 생성되는 컴포넌트에 실제 데이터들이 전달되야하는 경우가 대부분이기 때문에, `React.cloneElement`를 사용하여 이후에 컴포넌트가 합성되도록 하였다.

```js
<Container>
  <Text type="title">리스트</Text>
  <MapContainer data={data}>
    <Item />
  </MapContainer>
  <Button handleClick={handleClick}>버튼<Button>
  {!data && <div>데이터가 없습니다.</div>}
</Container>
```

위에서의 예시 상황을 수정해보았을 때, 우리는 `MapContainer`는 내부에서는 어떤 일을 하는지 알 필요 없이 `data`를 순회하여 `Component`를 동적으로 생성함을 알 수 있다.

### 조건부 렌더링 컴포넌트 추상화

어떠한 속성을 기반으로하여 조건부로 렌더링되는 컴포넌트들이 있다.

```js
{
  dialog && <Dialog dialog={dialog} setDialog={setDialog} />
}
```

이와 같은 상황일 때, 그냥 `dialog`의 상태를 파악하는 로직을 `Dialog`컴포넌트 내부에 넣어서 처리할 수 있긴 하다.

```js
if (!dialog) return null
```

컴포넌트 추상화를 통해 어떠한 일을 하는지만 알수 있고 하나의 일만을 수행하는 컴포넌트를 생성하고자 했다.

현재 수정중인 `Loa-Hands`또한 그러한 특징을 중요하게 생각해 `React-Query`를 사용하여 `Suspense`나 `ErrorBoundary`를 통해 로딩이나 에러와 같은 용도에 조금 엇나가는 기능들은 외부로 뺐었다.

`Dialog`컴포넌트는 오로지 `Dialog`컴포넌트를 생성하는 일만 생각하도록 하기 위해 생성되지 않는 상황은 밖으로 빼는것이 맞다고 생각했다.

그리고, `useMemo`, `useEffect`와 같은 라이프사이클 훅들은 조건문 이후에는 들어올 수 없어서, 천상 `render`이전에 위와같은 조건문이 들어가야 하는데, 이 때문에 아래와 같은 상황이 많았다.

```js
useMemo(() => {
  if(dialog)
  // ...
}, [dialog])

useEffect(() => {
  if(dialog)
  // ...
}, [dialog])

if(!dialog) return null;
render (
// ...
)

```

> 나만 그랬나..?

```js
const ConditionalContainer = ({
  isRender,
  children,
}: PropsWithChildren<IConditionalContainer>) => {
  if (!isRender) return null

  return children
}
```

`ConditionalContainer`는 말 그대로, `isRender`속성에 따라 생성할지 말 지 **대신** 결정해주는 컴포넌트이다.

전달되는 컴포넌트들은 자신이 생성되지 않는 예외적인 상황을 고려할 필요 없이 생성되는 경우만을 따져서 역할을 수행하면 될 뿐이다.

```js
<Container>
  <Text type="title">리스트</Text>
  <MapContainer data={data}>
    <Item />
  </MapContainer>
  <Button handleClick={handleClick}>버튼<Button>
  <ConditionalContainer isRender={data!==null}>
    <Text type="desc">데이터가 없습니다.</Text>
  </ConditionalContainer>
</Container>
```

처음 여러 수준의 추상화가 섞인 컴포넌트를 최종적으로 수정해보았다.

실제로 `Loa-Hands`에서도 위와 같은 방식으로 추상화 수준을 통일해주었다.

확실히, 컴포넌트가 각각의 역할만을 수행하도록 확실하게 분리되어, 어떠한 역할을 수행하는지 알 수 있었다.

## 참고

- [Toss 실무에서 바로 쓰는 Frontend Clean Code](https://toss.im/slash-21/sessions/3-3)
