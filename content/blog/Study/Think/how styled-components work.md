---
title: '🎨 styled-components의 작동원리'
date: 2021-11-17 12:47:00
category: 'Study'
draft: false
tag: 'Think'
---

요즈음에는 스타일링 기법에 있어서 `CSS-IN-JS`방식을 조금 더선호하게 된 것 같다.

무엇보다도 스크립트 환경에 더 친화적이여서 서로간 공유가 원활하게 이뤄질 수 있다는점이 매력있었고, 컴포넌트를 디자인 할 때, 유연한 컴포넌트를 만들기 위해 상위에서 많은것을 결정해서 속성으로 넘겨주는 과정에서 `React`의 속성을 전달하는 특징과도 잘 융화된 느낌이였기 때문이다.

그렇게 사용하게된 `styled-components`는 자바스크립트에서 어떠한 기능 어떠한 특징때문에 작동될 수 있는것일까

## styled-components

```js
const Box =
  styled.div <
  { color: string } >
  `
  background : ${({ color }) => color};
`
```

`styled-components`를 사용해오던 방식이다.
위처럼, 특정 태그를 사용할 수 도 있고

```js
import Component from '...'

const Box =
  styled(Component) <
  { color: string } >
  `
  margin-right : 10px;
`
```

이와 같이 특정 재사용 가능한 컴포넌트의 유연함을 유지하기 위해 위치값과 같은 요소들을 상위에서 정해서 전달해주기도 한다.

> 많이 사용하는 방식

이와 같이 `styled-components`를 사용하는 방식을 보면 눈에 띄는 자바스크립트 문법이 존재한다.

## template literals

기존의 문자열에 변수나 상수등을 표현하기 위해서는 이와 같은 방법으로 처리해야 했다.

```js
const hello = '안녕하세요'
const say = hello + '접니다'
```

이후 `ES2015`에서는 아래와 같은 방식으로 문자열 내에 표현식을 넣을 수 있게 되었다.

```js
const hello = '안녕하세요'
const say = `${hello} 접니다`
```

## tagged template literals

기존의 `template literals`에서 더욱 발전한 것이 `tagged template literals`이다.

```js
tagFunction`hello`
```

위와 같은 함수를 `tagged function`이라고 하는데, `template literlas`를 인자로 받아서 사용하는 함수를 `tagged function`이라고 하는것 같다.

이 `tagged function`은 생각보다 많은 기능을 제공하는데,

```js
function tagFunction(string, ...funcs) {
  console.log(string, funcs)
}

tagFunction`hello, ${() => 'I am Sangmin'}. who are you?`

// [ 'hello, ', '. who are you?' ] [ [Function (anonymous)] ]
```

`tagged function`이 전달받은 `template literals`를 내부 표현식을 기준으로 분리하는것 같다.

첫번째 인자로는 문자열을, 두번째 인자로는 내부의 표현식들을 받아오게 된다.

```js
function tagFunction(string, ...funcs) {
  console.log(string, funcs)
}

tagFunction`hello, ${() => 'I am Sangmin'}`
// [ 'hello, ', '' ] [ [Function (anonymous)] ]
```

만약, 표현식 뒤에 별다른 문자열이 없다면, 비어있는 문자열을 반환하게 되는것 같다.

또한, 문자열 -> 표현식의 순서가 보장되는것 같다.

이를 특징으로 `React`에서 자주 생성한 `styled-components`를 구현해볼 수 있다.

## 직접구현

```js
const styled = type => (strs, ...liters) => props => {
  let result = ''
  strs.forEach((str, i) => {
    let literRes = ''
    if (liters[i]) {
      literRes = typeof liters[i] === 'function' ? liters[i](props) : liters[i]
    }
    result = result + str + literRes
  })

  // React라면 createElement
  console.log(type, result)
}

const StyldDiv = styled('div')`
  font-size: ${({ title }) => (title ? '16px' : '14px')};
  color: ${({ color }) => color};
`

StyldDiv({ type: 'div', color: 'red' })
// div
// font-size: 14px;
// color: red;
```

1. `div`라는 태그 타입을 인자로 받고, `template literals`를 받는 `tagged function`을 반환한다.
   - 이 때, `div`라는 태그도 가능하지만, `Component`들도 가능하다.
   - `React`라면 이 때 전달받은 인자를 통해 마지막에 `createElement`를 통해 `React Element`를 생성할 것 같다.
2. 전달받은 `template literals`를 분석하여, 문자열과 표현식을 분리해서 갖고있는 함수를 반환하는데, 해당 함수는 `props`를 전달받을 수 있다.
   - `React`에서의 특징
3. `props`를 전달받을 수 있고, 전달받은 `props`를 통해 표현식을 실행시켜 하나의 스타일을 완성시키고, `1`의 단계에서 생성한 태그 혹은 `components`에 해당 스타일을 적용시키는 함수를 반환한다
   - 이것이 `StyldDiv` 컴포넌트

아마 위와같은 방식으로 `styled-components`가 작동되는것이 아닐까 생각해본다.

## 느낌

생각해보면 자주 사용하는 모듈들은 모두 자바스크립트의 환경에서 생성되고, 사용되고있다.

이를 보면, 자바스크립트가 갖고있는 고유한 특징을 기반으로 작동된다고 생각해볼 수있는데, 최근에 들었던 조언을 생각해보면 적어도 내가 자주사용하는것들에 있어서는 어느정도 이해를 해보는것이 좋을것 같다.

최근에는 `React Hook`자체의 원리에 대해 이해해보려고 하는데, 아직 몇몇부분에 대해서는 궁금증이 해소되지 않고 있다.. 이해하고 정리하는날을 기대해보자.
