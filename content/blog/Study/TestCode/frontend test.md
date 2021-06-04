---
title: 'Frontend, Testcode'
date: 2021-06-03 16:07:00
category: 'Study'
draft: false
tag: 'TestCode'
---

요즘 리팩토링에 관심이 많다. 불필요하거나 중복되는 코드뭉치를 제거하는것 또한 중요하다.

하지만, 제거를 할 때 실제 실행 시 에러가 발생하지 않을까 라는 두려움때문에 과감하게 제거하지 못하는것 같다.

또한, 모든 코드를 작성하고 실행을하면서 그때 그때 에러를 발견하고 수정을 해오고있었다. 이 기능이 제대로 작동이 되는지, 원하는 결과값을 반환을 하는지는 늘 실행을 해보아야 알 수 있었다. 실제 앱을 실행시키기 전이 미리 확인할 수 있는 방법은 없을까?

## 🍍 프론트엔드 테스트 코드

앱을 실행시키지 않더라도 개발자가 생성한 코드가 사용자의 입장에서 제대로 작동이 되는지 확인해볼 필요가 있다. 어떠한 요청을 통해 개발자가 예상한 대로 스타일이 변경이 되는지 혹은, 받아온 데이터를 제대로 가공하여 실제 DOM을 구성을 하는지 알고싶은 경우가 있다.

작성하는 코드의 규모가 커지게 되면서 작업물에 확신을 갖고싶어하게 되었다. 그러면서 자연스럽게 보게된 것이 테스트코드이다.

> TDD - 이후에 다뤄볼예정

테스트코드를 작성하게 된다면 필요하지 않은 코드뭉치를 제거했을 때 실제로 실행을 해보지 않더라도 테스트코드에서 에러 여부를 사전에 파악할 수 있어 좀더 과감하게 리팩토링을 할 수 있다고 하니 고민도 해결되는 부분이다!

### 🥥 Static Test 정적 테스트

별도의 테스트코드가 아닌 실제 코드에서 발생할 수 있는 에러를 미연에 방지할 수 있도록 도움을 주는 것. `TypeScript`로 변수의 타입을 검사하거나 `ESLint`로 사용하지 않는 변수를 찾는것이 대표적이다.

사실 알게모르게 나도 간단한 테스트는 해오고 있던것이다.

> ㄷㄷ

### 🥝 Unit Test 단위 테스트

작성한 애플리케이션에서 가장 작은 단위의 코드를 테스트하는 기법이다. 각각의 테스트를 통해 참, 거짓을 판단하기 때문에 어느곳에서 잘못되었는지 빠르게 알 수 있다. `React`, `Vue`와 같은 프레임워크들의 기반이 되는 컴포넌트들을 테스트하는 좋은 방법이라고 한다.

### 🍅 Integration Test 통합 테스트

애플리케이션에서 두가지 이상의 요소가 서로 상호작용할 때, 테스트하는 기법이라고 한다.

> 설명만으로는 잘 모르겠다. 부모 자식간 컴포넌트가 주고받는 속성에 대해 테스트할 수 있는 것일까...?

> 그냥 각각의 컴포넌트가 받는 속성에 따라 테스트 하는게 아닐까..?

### 🥑 End to End Test E2E테스트

위의 테스트들 처럼 부품 부품별 테스트하는것이 아닌 각각의 부품들로 구성된 하나의 애플리케이션을 처음부터 끝까지 테스트하는 방법이라고 한다. 사용자가 직접 사용하는것처럼 동작되도록 테스트를 작성하고, 실행시키면서 예상하는대로 작동되는지 검증할 수 있다고 한다.
`cypress`가 대표적인 도구인듯 하다.

## 🍆 테스트 대상

프론트엔드 분야에서 테스트가 필요한 항목들을 생각해보았다.

1. [ ] 시각적 요소인 `UI`가 잘 그려지는지

   - 개발자가 `HTML`, `CSS`등을 통해 생성한 컴포넌트의 구조가 의도한 대로 나타나는지를 테스트하기 위해 `Jest`로 스냅샷테스트로 만들어진 구조를 확인하고, `StoryBook`으로 실제 스타일을 확인한다.

2. [ ] 사용자의 이벤트가 잘 실행되는지

   - 해당 컴포넌트에서 사용되는 이벤트들을 임의로 실행시켜보고 반환하는 결과와 원하는 결과를 비교하여 검증해 볼 수 있다.

3. [ ] `API`통신에 있어서 원하는 결과를 반환하는지
   - 실제 `API`서버를 구축하는것 보다는 가짜 메소드·객체를 생성하여 결과를 받아왔을 때 이후의 작업을 제대로 수행하는지 확인해본다.

## 🥒 react and testcode

`React`에서는 아예 테스트 항목을 따로 구분하여 관리할정도로 중요하게 생각하고있는것 같다.
실제로 `facebook`에서는 `react-testing-library`를 통해 테스트코드를 작성하고 있다고 한다.

## 🥬 react-testing-library ? react-test-renderer ?

`react`에는 두가지의 테스트 모듈을 소개하고있다. 처음에는 이 두가지가 뭘 의미하는것인지 몰라 헷갈렸다. 그래서, 예제로 있는 컴포넌트를 각각 두가지의 방식으로 테스트코드를 작성해보았다.

```ts
import React, { useCallback, useState } from 'react'

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
}

// 귀찮아서 any로 해놓았다 신경쓰지말기..
interface Props {
  page: any
  children: any
}

const Link = ({ page, children }: Props) => {
  const [status, setStatus] = useState(STATUS.NORMAL)

  const onMouseEnter = useCallback(() => {
    setStatus(STATUS.HOVERED)
  }, [setStatus, STATUS])

  const onMouseLeave = useCallback(() => {
    setStatus(STATUS.NORMAL)
  }, [setStatus, STATUS])

  return (
    <a
      className={status}
      href={page || '#'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  )
}

export default Link
```

테스트가 진행될 컴포넌트이다. 두개의 사용자 이벤트가 존재하고, 해당 이벤트에 따라 `className`이 변경된다.

1. `status` 속성이 변경이 잘 되어 `className`에 반영이 되는지 확인
2. 두개의 이벤트가 잘 실행이 되는지 확인

### 🥦 react-testing-library

```ts
import React from 'react'
import Link from './index'
import { fireEvent, render, screen } from '@testing-library/react'

describe('Link', () => {
  beforeEach(() => {
    render(<Link page="http://www.facebook.com">Facebook</Link>)
  })

  it('Link component mount', () => {
    // screen.debug();
  })

  it('onMouse Toggle', () => {
    const target = screen.getByText('Facebook')
    fireEvent.mouseEnter(target)
    screen.debug()

    fireEvent.mouseLeave(target)
    screen.debug()
  })
})
```

`render`를 사용하여 해당 컴포넌트를 미리 만들어볼 수 있다. 해당 모듈의 큰 특징인 마치 실제 `DOM`에 접근한것과 같은 메소드들을 사용할 수 있다는 점이다. 컴포넌트가 생성이 되면 `screen`에 담기게(?) 되고 각종 `DOM API`를 사용하여 접근할 수 있다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/06/03/testing-library.PNG" alt="testing-library">
</div>

결과물을 보아도 완성되어있는 `DOM`이 있고, `className`이 잘 변경된것을 보아 테스트도 예상한대로 진행되었다.

> 여기서 `React`의 경우 `className`이지만, `class`로 결과값이 나온것을 보아 해당 모듈은 컴포넌트 자체를 보여준다기보다 완성된 `DOM`을 기준으로 하는것 같다.

### 🧄 react-test-renderer

```ts
// Link.react.test.js
import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Link from './index'

describe('Link', () => {
  let renderedComponent = null
  let tree = null
  it('Link component mount', () => {
    renderedComponent = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    )
    tree = renderedComponent.toJSON()
    console.log(tree.props.className)
  })

  it('click onMouseEnter', () => {
    act(() => {
      tree.props.onMouseEnter()
    })
    tree = renderedComponent.toJSON()
    console.log(tree)
  })

  it('click onMouseLeave', () => {
    act(() => {
      tree.props.onMouseLeave()
    })
    tree = renderedComponent.toJSON()
    console.log(tree)
  })
})
```

딱히 설명할 필요도 없이 결과물이 모든것을 보여준다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/06/03/test-renderer.PNG" alt="test-renderer">
</div>

`render`된 컴포넌트를 `DOM`으로 보여주는것이 아니라, 객체 인스턴스화 하여 테스트를 진행한다.

### 🌽 느낌

서로 테스트를 진행하는 컴포넌트의 형태는 다르지만, 공통적인점이 한가지 있는것같다.
두가지 모두 개발자의 시선이아닌 사용자의 시선으로 테스트가 진행이된다.

해당 컴포넌트가 렌더링 되기전 어떠한 속성을 갖고있고 전달받는등의 과정은 전혀 보이지않는것 같다.

## 🥕 결론

프론트엔드에서의 테스트코드와 간단한 예제를 두가지 방법으로 테스트를 진행해보았다.
두가지 방법 모두 사용자의 시점에서 진행이 되는것같은 점은 동일하지만 `DOM`을 기준으로하는지 아니면 객체인스턴스를 기준으로하는지에 차이가 있어 용도에 맞게 잘 사용한는것이 중요해보인다.

이후에 테스트를 도와주는 라이브들이 종합된 프레임워크인 `jest`와 테스트 기반 개발론이라 하는 `TDD`에대해 알아보고 기존의 프로젝트들에 테스트코드도 한번 추가해봐야겠다.

## 🥗 참고

- [react testing library](https://blog.rhostem.com/posts/2020-10-14-beginners-guide-to-testing-react-1)
- [react testing library not using screen](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen)
- [react testing library vs react test renderer](https://stackoverflow.com/questions/58653872/react-test-renderers-create-vs-testing-library-reacts-render)
