---
title: 'React Forget 과거부터 지금까지'
date: 2025-03-20 19:34:00
category: 'Study'
draft: false
tag: 'Think'
---

## 오늘 이전의 React

state가 변경되면 rerender가 된다.
익숙하고 당연하게 생각해온 React 이다.

하지만 이러한 특징으로 항상 고민을 하게 되는 부분.

원시자료형이 아닌 참조자료형과 같이 주소를 기준으로 값의 변경을 감지하는 자료형들이 rerender로 인해 새롭게 생성되는 경우.

특히 이러한 값들이 의존성배열에 추가가 되어야 하는 경우 어떤식으로 처리해야 할 지 고민을 하게 된다.

대안으로 useMemo, useCallback과 같이 계산된 값을 기억하도록 도와주는 hook을 사용하는것으로 생각이 좁혀지게 되는데, 위와 같은 값들은 모두 useMemo를 써준다? 아니면 주소를 기억해준다 하면 useMemo를 그냥 다 쓰는게 좋지 않을까? 생각할 수 있지만 useMemo도 공짜는 아님.

초기 값이 생성될 때, 이 값을 기억하기위한 메모리를 추가로 할당하고 이후 매 렌더링 때 마다 의존성 배열 내 값의 변화를 위해 비교를 한다.
그래서, 이 과정과 실제로 useMemo 내부에서 실행되는 로직의 시간복잡도를 비교해서 useMemo의 과정보다 내부에서 실행되는 로직을 메모하여 시간을 줄이는 시점을 고려하는게 권장되기도..

- [When not to use the useMemo React Hook - LogRocket Blog](https://blog.logrocket.com/when-not-to-use-usememo-react-hook/)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

의존성 배열에 추가된 참조자료형의 값에는 useMemo 등으로 기억된 값이 전달되어야 의도한대로 작동이 된다.

하지만, 안타깝게도 외부에서 이 값이 전달되어야 하는 경우 강제해줄 수 없는것 같다.
hook, component 내부에서 useEffect등을 사용할 때 추가되는 의존성배열에 담길 값에 typescript로 `memoization된 값이 전달되어야 한다` 를 지정해줄 수 가 없다.

> 이 경우를 피하는게 최선일까..?

위와같은 코드를 생성한 개발자는 알 수 있지만, 사용을 하는 경우에는 알 기 어렵다. 알려줄 수 있으면 좋을텐데..

## React Forget의 시작

- [RFC: useEvent by gaearon · Pull Request #220 · reactjs/rfcs](https://github.com/reactjs/rfcs/pull/220)
- [rfcs/text/0000-useevent.md at useevent · reactjs/rfcs](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md)

useEvent hook에 대한 rfc이다.

> 22년 5월에 올라온 글 이나, 내부 최초 이슈를 보면 18년으로 더 오래전에 시작된 고민으로 볼 수 있을듯..?

단순히 생각해서 useEffect와 같이 의존성배열을 필요로 하는 hook이 rerender의 영향을 받아 새롭게 생성된 참조자료형이 영향을 받지 않도록 도와주는 hook이라는것 같음.

하지만..

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-event-out.png?raw=true" alt="use-event-out">
</div>

요약하면, useEvent의 생성이 useCallback보다 강력한 메모이제이션 hook을 만드는것과 같았고, 모든 값에 useEvent가 사용될 것 같았다

→ 이미 그 유사하게 사용될 수 있는 hook은 있었고, 더 개선된 방식이라는 이유로 무분별한 사용만 될 것 같아 이런식의 대응할 수 있는 hook을 만드는것이 해결되지는 않을것으로 판단한 것 같다.

이런 방식이 아닌 React Compile을 통해 개선할 수 있는 방식을 고민하고있는 글을 통해 종료되었음을 알렸으며
이 React Compile을 통해 개선할 수 있는 방식을 개발하는 프로젝트가

`React Forget`

## React Forget

- [React Forget Youtube](https://www.youtube.com/watch?v=lGEMwh32soc)

> 사실 위 영상이 2021년 말로, 위 rfc보다 먼저 나오긴 했지만.. rfc 중단의 근거이기 때문에 후순서로..

원하지 않는 상황에서 useMemo, useCallback, memo 등 메모이제이션을 고려하지 않도록 해주는 compiler라는것 같다.

이후로도 매 해 마다 React forget 프로젝트에 대한 진행상황, 결정된 방향등을 공유해주었다

> 이런게 참 좋은듯..

- [React Labs: What We've Been Working On – June 2022 – React](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler)
- [React Labs: What We've Been Working On – March 2023 – React](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)

특히 2023년에 공유해준 내용에는 꽤나 흥미로운것들이 많았다.

최초 공개가 되었을 때, 아 위 메모이제이션 hook들을 대신해주는 compiler가 나오겠구나 정도로만 생각했는데 이 생각을 잡아주는 내용이 있었다.

The core idea of React is that developers define their UI as a function of the current state. You work with plain JavaScript values — numbers, strings, arrays, objects — and use standard JavaScript idioms — if/else, for, etc — to describe your component logic. The mental model is that React will re-render whenever the application state changes. We believe this simple mental model and keeping close to JavaScript semantics is an important principle in React’s programming model.

The catch is that React can sometimes be too reactive: it can re-render too much. For example, in JavaScript we don’t have cheap ways to compare if two objects or arrays are equivalent (having the same keys and values), so creating a new object or array on each render may cause React to do more work than it strictly needs to. This means developers have to explicitly memoize components so as to not over-react to changes.

→ React작동의 핵심 원리는 일반적인 javascript 요소인 함수, 배열 등등을 사용하여 상위에서 발생하는 rerender를 기반으로 ui 등의 로직을 구성한다 이고, 이 원칙은 유지할 것이나 이 rerender로 원하지 않는 상황에 영향을 주는것은 개선하고자 함

From an implementation perspective this means automatically memoizing, but we believe that the reactivity framing is a better way to understand React and Forget. One way to think about this is that React currently re-renders when object identity changes. With Forget, React re-renders when the semantic value changes — but without incurring the runtime cost of deep comparisons.

→ 모두 자동으로 메모이제이션 해주는것이 아니라, 의미있는 값들(실제로 변경이 된)만 감지하도록 해주는것이 react forget의 핵심

그리고 작년말, 올해 초 React 프로젝트 root에서 한 개의 babel compiler가 공개되었다.

- [npm: babel-plugin-react-compiler](https://www.npmjs.com/package/babel-plugin-react-compiler)
- [npm: eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)

## babel plugin react compiler

추가된 compiler로 react를 실행시켰을 때 무엇이 달라지는지를 확인해보고자 함.

### 일반 객체

```js
const [state, setState] = useState(0)

const basicObject = {
  id: 1,
}

const stateObject = {
  id: state,
  name: '이름',
}

useEffect(() => {
  console.log('basicObject render', basicObject)
}, [basicObject])

useEffect(() => {
  console.log('stateObject render', stateObject)
}, [stateObject])
```

위와 같은 코드에서 button 클릭을 통해, state를 변경시켰을 때 기존의 기대결과는 모든 useEffect의 console이 매번 찍혔지만, 위 compiler로 변환된 결과물이 실행된 경우에는

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/normal-object-console.png?raw=true" alt="normal-object-console">
</div>

위와같이 실제 값이 변경된 state를 가지고있는 object만 useEffect에서 변경되었다고 판단하여 console이 찍혔다.

모두 자동으로 메모이제이션 해주는것이 아니라, 의미있는 값들(실제로 변경이 된)만 감지하도록 해주는것을 확인하기 위해 조금 더 보기로 함.

### useMemo

```js
const Test2 = () => {
	const [state, setState] = useState({ name: 'test2', count: 0 });

	const memoized = useMemo(() => {
		console.log('state 변경으로 memo call', state);
		return { memoName: state.name, key: 'memo' };
	}, [state]);

	useEffect(() => {
		console.log('memo로 계산된 값 변경으로 useEffect call', memoized);
	}, [memoized]);
	return (
		<>
			<button
				onClick={() => setState((prev) => ({ ...prev, count: prev.count++ }))}
			>
				{memoized.memoName} add
			</button>
			<Test2Child data={memoized} />
		</>
	);
};

const Test2Child = ({ data }: { data: { memoName: string; key: string } }) => {
	console.log('Test2Child rerender', data);

	return <div>test2 child</div>;
}
```

1. state를 의존하여 memoized된 값을 하지만, 새로운 값을 생성할 때 state에 변경되는 값을 사용하지는 않도록 함.
2. 생성된 memoized를 useEffect가 의존하고있고. Test2Child 컴포넌트가 props로 전달받음.

기존 compiler로 생성된 코드 결과물을 실행시키면 아래와 같은 결과가 나온다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-console-prev.png?raw=true" alt="use-memo-console-prev">
</div>

memoized 값 내에서는 실제로 사용되지 않는 state이지만, 변경되었다는 이유로 useMemo의 dependency에서 통째로 변경을 인정하여 새롭게 값을 생성하고, 그 영향을 받아 useEffect까지 실행된 모습이다.

> 익숙한 결과..

Test2Child는 별다른 memo처리를 해주지 않았기 때문에, 당연히 렌더링이 되었다.

사실 생각해보면 Test2Child도, useEffect도 얼떨결에 참조된 사용하지도 않는 값의 변경으로 호출, rerender가 된 셈 이다.

추가된 compiler로 생성한 코드를 실행시켜보았다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-console-after.png?raw=true" alt="use-memo-console-after">
</div>

useMemo에 참조되고있는 state의 주소가 변경되었기 때문에, useMemo까지는 실행이 되었다.

하지만, 해당 값이 구성될 때 state의 변경된 값이 사용되지는 않기 때문에 최초 생성되었던 원본을 그대로 반환하여 useEffect가 호출되지는 않았다.

추가적으로, compiler 적용 효과로 전달되는 memoized props의 주소가 변경되지 않았기 때문에 컴포넌트 자체도 memo가 되어 상위 rerender에 영향을 받지 않았다.

어떻게 달라졌을 지 빌드 결과물을 직접 보는것도 좋을것 같다.

### 일반 객체 빌드 결과 (신규 compiler)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/normal-object-build-after.png?raw=true" alt="normal-object-build-after">
</div>

맨 처음 예시였던 일반 객체가 compile 되었을 때, 이전에는 그냥 객체를 생성하였지만 변경된 후로는 컴포넌트에 값 혹은 주소를 저장해둘 메모리를 생성한다.

저 이미지 내 에서 $ 표시로 객체형식으로 값을 저장하고, 조회하는곳이 초기에 생성해둔 메모리이다.

객체 내에서 사용하는 값과 이전 저장된 값과 다르다면(최초이거나, 변경되었거나) 객체를 생성하고, 이후 비교를 위해 사용하는 값과 함께 각각의 공간에 저장한다.

이후에 rerender가 발생하여 다시 해당 코드에 도달하였을 때 에는 이전에 저장해둔것과 동일한 경우 저장되어있는 값을 그대로 반환한다.

이러한 과정들이 각각의 변수들에 적용되었을 때, 사용하는 값이 변경되지 않았다면 주소가 변경되지 않았다고 판단하게되는 원리로 보인다.

### useMemo 빌드 결과 (이전)

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-before1.png?raw=true" alt="use-memo-build-before1">
</div>

이전 compiler로 변환한 결과물을 보면 compile 이전의 작성된 코드와 크게 다른점은 없다.

값의 변경을 확인하는 useMemo만 체크해보면

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-before2.png?raw=true" alt="use-memo-build-before2">
</div>
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-before3.png?raw=true" alt="use-memo-build-before3">
</div>

useMemo에 전달된 deps의 비교를 할 때, 실제 사용되는 값이 아닌 deps에 전달된 각각의 값을 비교한다.

객체와같은 값이 전달되었을 때, 객체 내부의 값의 변경보다는 객체 자체의 변경을 기준으로 비교하기 때문에 현재 알고있는것 처럼 useMemo의 deps에 전달된 객체의 사용하지 않는 값이 변경되더라도 useMemo는 항상 변경되었다 감지하여 새로운 값을 계산하게 된다.

동일한 코드로 compiler를 변경하였을 때의 결과물을 보면

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-after1.png?raw=true" alt="use-memo-build-after1">
</div>

위의 일반 객체가 생성될 때 실제 사용하는 값 만을 비교하여 새롭게 객체를 생성할 지, 이전것을 반환할 지 판단한다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-after2.png?raw=true" alt="use-memo-build-after2">
</div>
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/03/20/use-memo-build-after3.png?raw=true" alt="use-memo-build-after3">
</div>

useEffect, jsx를 생성하는 부분 모두 이전 compiler의 결과물과 다르게 실제 사용되는 값의 변경만을 참조하여 이전에 저장했던 값을 반환해줄 지 새롭게 생성할 지 결정을 한다.

이를 통해서 더 이상 주소를 기준으로 값을 비교하는 경우에 대해 컴포넌트의 memo, 혹은 dependency에 추가하기 위해서 memoization을 어떤식으로 해야할 까에 대한 고민은 많이 해소된 것 같다.

근데 위 compile 결과물을 보면, useMemo를 사용했다 하더라도 compile 이후로는 모두 풀어내어서 일반적인 객체 변수와 동일하게 사용되는 값들의 변경 여부만 판단하여 이전에 저장했던 값을 반환할 지, 새롭게 생성해줄 지 동일한 절차를 거치게 된다.

useMemo의 내부에서 고비용 연산을 통해 생성된 값 또한 compile 이후로는 동일한 방식으로 값을 확인하기 때문에 useMemo를 사용하는 일 도 많이 줄 것 같긴 하다... 아마도..?

meta에서 제공하고있는 react 기반의 많은 서비스들은 이미 위 compiler를 사용하고 있다고는 하나, 아직 beta라서 조금은 어려울 것 같지만 DX 향상에 꽤나 많은 기여를 할 수 있을것 같아 기대가 되는 변경점 일 것 같다.
