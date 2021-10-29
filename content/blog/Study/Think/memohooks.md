---
title: ⚛ 메모이제이션 hooks의 오용
date: 2021-09-01 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`는 `state`라는 상태값이 변경되면 `rerendering`이 일어난다.

> 아마 대부분의 최신 프레임워크들은 비슷할 것이다.

이러한 특징이 장점도 있지만, 불필요하게 렌더링이 되거나 동일한 변수 혹은 메소드를 반복해서 생성하는 경우가 있다.

불필요한 재생산이 일어나는것을 예방하기 위해 `React`에서는 메모이제이션 `hook`들을 제공하고 있다.

`useMemo`, `useCallback`, `memo`

캐싱이라는 장점만을 생각하고 이런 `hook`들을 계속해서 사용해왔는데, 그 사용이 잘못된 사용임을 알게되었고, 확실하게 사용하기 위해서 정리해보려고 한다.

### useMemo

변수나 상수를 기억한다. 계산된 속성이라고 보아도 될까?
`useMemo`를 사용한다면 아래와 같이 표현될 수 있다.

```js
const fruits = useMemo(() => ['apple', 'banana', 'peach'], [])
```

> 사실 위의 사용은 매우 부적절한 사용이다.

첫번째 인자로 콜백함수를 사용하여 반환되는 값, 두번째 인자로는 의존하는 배열을 설정한다.

### useCallback

`useMemo`가 변수나 상수에 대한 메모이제이션을 하기 위한 `hook`이라면 `useCallback`은 메소드를 위한 `hook`이다.

> 사실 `useMemo`만으로도 메소드를 메모이제이션 할 수 있다.

```js
const func = useCallback(
  val => {
    // doSomething...
    doSomething()
  },
  [doSomething]
)
```

첫번째 인자로 사용되는 `callback`함수로 변수를 받을 수 있으며, `useMemo`와 동일하게 의존배열이 두번째 인자로 전달된다.

### 또 하나의 비용

두가지 모두 두번째 인자 내의 속성이 변화가 되면 새롭게 생성하는 방법이다.

비어있는 배열이 전달된다면, 처음에만 생성되고 이후에는 저장되어있는 값을 사용한다.

조금 극단적으로 표현이 되긴 했지만, 위처럼 아무런 계산식이 존재하지 않는 콜백함수를 통해 배열을 반환하는것이 굳이 필요할까?

`useMemo`, `useCallback`을 사용하는것 자체도 어찌보면 하나의 비용이소모되는것이다.

위처럼 단순한 변수나 상수를 선언하는데 이러한 `hook`을 사용하는것은 오히려 역효과만 발생하는 오용이라고 볼 수 있을것 같다.

- [Should You Really Use useMemo in React? Let’s Find Out.](https://medium.com/swlh/should-you-use-usememo-in-react-a-benchmarked-analysis-159faf6609b7)

실제로 위의 글을 따르면, `useMemo`로 성능개선을 경험할 수 있는 경우는, 계산되는 로직의 복잡성이 100 미만이면, 오히려 초기 `useMemo`를 사용하는 비용이 더 크게 작용되어 역효과만 난다고 한다.

> 위 글의 복잡도는 `render`를 하기 전, 반복문의 횟수를 기준으로 측정한것으로 보이며, 각각의 횟수에 따라 `useMemo`를 사용했을 때, 사용하지 않았을 때의 `render`완료 시간을 비교한것 같다.

`useCallback`의 경우에도, `render`가 되어 계속해서 생성되는 메소드가 하위 컴포넌트의 `rerender`에 영향을 주는것이 아니라면, 사용할 필요가 없다.

```js
const addOne = (num: number) => num + 1

const callbackSomething = useCallback(() => {
  // do Something...
  addOne(1)
}, [])
```

변화가 있는 상태값과 관련이 없는 부수적인 역할을 하는 함수들은 절대 변할일이 없기 때문에, 처음 생성될 때 참조하는것을 그대로 사용할 수 있어서, 의존성배열에 추가해줄 필요가 없다.

위에 설명된 상황들의 변수, 상수, 함수들은 `useMemo`, `useCallback`을 사용하기보다는 별도의 `constants` 디렉토리나, 외부에서 선언하여 참조하는것처럼 다른 방법을 찾는것이 좋아보인다.

```js
const arr = [1,2,3]
const addOne = (num : number) => num+1;

function Component(){
  const callback = useCallback(() => {
    const res  = addOne(arr[0]);
    // do something...
  }, [])
  return (
    <Child callback={callback}>
  )
}
```

## 적합한 사용

`useMemo`, `useCallback`을 통해 불필요한 렌더링을 줄여줄 수 있을 때 사용하는것이 좋다.

`React`에서는 하위로 속성이 전달이 되면서, 전달받은 속성이 변화가 있을 때 새롭게 렌더링이 된다.

아마 `Javascript`를 사용해왔다면 알 수 있는 특징이 있다.
`참조`

```js
true === true // true
false === false // true
1 === 1 // true
'a' === 'a' // true
{} === {} // false
[] === [] // false
() => {} === () => {} // false
```

문자열, 숫자열과 같은 자료형들은 보여지는대로 같다고 인식되지만, 배열, 객체, 함수와 같은 자료형들은 보여지는 모습이 같더라도 다르다고 인식된다.

이들은 `참조`의 속성을 갖고있기 때문이다.

```js
const a = { id: 'a' }
const b = { id: 'b' }
const c = a
a === c // true
a === b // false
```

이러한 특징들을 생각하고 사용하면 간단하다.

```js
function Parent() {
  const method = () => {
    // doSomething
  }
  return <Children method={method} />
}

React.memo(function Children({ arr, method }) {
  // render
})
```

`Parent`컴포넌트에서는 `Children`컴포넌트에게 `method`이라는 메소드을 속성으로 전달한다.

`Children`컴포넌트에서는 무분별하게 렌더링되는것을 막기 위해 `memo`를 사용하여 `method`이 변경될 때만 렌더링이 되도록 설정을 해주었다.

만약, `Parent`컴포넌트 또한 `rerender`가 일어났을 때 동일한 구조의 메소드 전달하게 되는데, 이러면 `Children`은 `rerender`가 일어나지 않을까?

그렇지 않다. 값은 동일하지만 서로 참조하는 배열이 다르기 때문에 `rerender`가 발생한다.

```js
function Parent() {
  const method = useCallback(() => {
    // doSomething
  }, [])
  return <Children method={method} />
}

React.memo(function Children({ arr, method }) {
  // render
})
```

이러한 상황일 때, 전달이 되는 속성들이 생성이 되고, 캐싱이 되도록 한다면 `Parent`가 `rerender`되더라도 `Children`에 전달되는 속성은 동일하게 참조되는 값들이 전달되기 때문에 `rerender`를 막을 수 있다.

> 만약 재생산될 필요가 있다면, 의존성 배열을 수정해주도록 하자

`useMemo`의 경우 많은 비용이 소모되는 계산을 통해 생성되는 변수나 상수일 때, `useCallback`의 경우, 자신이 의존하고있는 상태값 외의 변경이 잦은 컴포넌트에서 하위로 메소드를 전달할 때 좋다.

## 참조

- [useCallback, useMemo 사용](https://ideveloper2.dev/blog/2019-06-14--when-to-use-memo-and-use-callback/)
- [Should You Really Use useMemo in React? Let’s Find Out.](https://medium.com/swlh/should-you-use-usememo-in-react-a-benchmarked-analysis-159faf6609b7)
