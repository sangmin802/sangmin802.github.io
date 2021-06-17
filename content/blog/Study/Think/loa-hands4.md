---
title: '컴포넌트 테스트코드'
date: 2021-06-17 16:53:00
category: 'Study'
draft: false
tag: 'Think'
---

`loa-hands`앱에 있어서, 컴포넌트들의 단위테스트를 위한 테스트코드들을 모두 작성해보았다.

전반적인 작성 흐름이나, 작성을 하면서 발생했던 상황에 대해 복기해보려고 한다.

## 🍆 테스트 분야

테스트를 할 수 있는 분야들을 먼저 생각해보고, 불필요할것 같은 테스트들은 빼기로했다.

1. [ ] 렌더링이 잘 되는가
2. [ ] `UI`, 비즈니스 로직을 통한 상수나 변수가 잘 계산되어 나오는가
3. [ ] 상위 컴포넌트에서 전달되는 메소드들이 정상적으로 호출이 되는가
4. [ ] 사용자의 이벤트에 따라 적절한 렌더링을 하는가

물론 현재 프로젝트에서는 `Redux`, `Redux-Saga`를 사용했기 때문에, 해당 기능에 대한 테스트코드도 작성하였다. 다만, 다음포스트에서 정리해보는걸로.

### 🧅 최소단위의 컴포넌트

`Button`, `Text`와 등의 최소단위의 컴포넌트들에 있어서는 별도의 테스트코드를 작성하지 않았다.

비즈니스로직은 존재하지 않을 뿐더러, 단순 `UI`에 영향을 주는 로직또한 상위컴포넌트에서 존재하고 미리 계산된 속성들만 받아서 렌더링을 하기 때문이다.

```ts
import React, { HTMLAttributes, ReactNode } from 'react'
import * as Styled from './index.style'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  type?: string
  color?: string
}

const Text = ({ children, ...props }: Props) => (
  <Styled.Text {...props}>{children}</Styled.Text>
)

export default Text
```

이런 컴포넌트에 무슨 테스트가 필요할까..

### 🌽 단순 렌더링을 진행하는 컴포넌트

최소단위의 컴포넌트는 아니지만, 구조를 잡는 역할에대한 차이만 있을 뿐, 받은 속성을 그대로 렌더링하는 컴포넌트의 경우에도 별다른 테스트코드를 작성하지 않았다.

```ts
import React from 'react'
import Lodash from 'lodash'
import * as Styled from './index.style'
import { Text } from 'components/'

const Collection = ({ size, index }) => {
  return (
    <Styled.Container>
      <Styled.Background position={index} />
      <Styled.Size>
        <Text>{size}</Text>
      </Styled.Size>
    </Styled.Container>
  )
}

export default React.memo(Collection, (left, right) =>
  Lodash.isEqual(left, right)
)
```

### 🥕 UI로직이 포함된 컴포넌트

비즈니스 로직이 아닌 `UI`와 관련된 단순한 로직을 갖고있는 컴포넌트 라도, 예상하는 결과값을 반환하는지 테스트는 하기로 하였다.

#### 🥗 컴포넌트

```ts
import React, { cloneElement, useMemo } from 'react'
import Lodash from 'lodash'
import { ItemPartBox, IndentString, TripodSkillCustom, Image, Text } from '../'
import * as Styled from './index.style'

const Detail = ({ data, children }: { data?; children? }) => {
  const { backSrc, detail } = data
  const {
    src,
    grade,
    title,
    subTitle,
    itemPartBox,
    indentStringGroup,
    tripodSkillCustom,
  } = detail

  const titleColor = useMemo(() => (grade ? `color${grade}` : 'white'), [grade])

  return (
    <>
      <Styled.Top>
        <Styled.Container>
          <Image
            role="gradient"
            src={src ?? backSrc}
            color={`gradient${grade}`}
          />
          <Styled.Desc>
            {subTitle.map(res => (
              <Text type="subTitle" key={res}>
                {res}
              </Text>
            ))}
            <Text type="title" color={titleColor}>
              {title}
            </Text>
          </Styled.Desc>
        </Styled.Container>
      </Styled.Top>
      <Styled.Children>
        {children && cloneElement(children, { data })}
      </Styled.Children>
      <>
        {itemPartBox && <ItemPartBox data={itemPartBox} />}
        {indentStringGroup && <IndentString data={indentStringGroup} />}
        {tripodSkillCustom && <TripodSkillCustom data={tripodSkillCustom} />}
      </>
    </>
  )
}

export default React.memo(Detail, (left, right) => Lodash.isEqual(left, right))
```

#### 🥔 테스트코드

렌더링을 할 때, 굳이 모든 속성을 보내줄 필요 없이 로직에 필요한 속성만 부여해주었다.

```ts
import React from 'react'
import { render, screen } from 'utils/test'
import Detail from './index'

const initialData = {
  backSrc: '',
  detail: { src: '', grade: 4, title: '', subTitle: [] },
}

describe('Detail', () => {
  it('title color 로직 테스트', () => {
    render(<Detail data={initialData} />)

    expect(screen.getByRole('gradient').getAttribute('color')).toBe('gradient4')
  })
})
```

### 🍠 메소드 체크

비즈니스 로직을 상위컴포넌트에서 받아왔을 때, 해당 메소드가 잘 호출이 되는지 테스트해볼 필요가 있었다.

또한, 해당 호출로 인해 내부 `UI`가 변경된다면 함께 테스트를 진행하였다.

#### 🥜 컴포넌트

```ts
import React, { useCallback, useEffect } from 'react'
import * as Styled from './index.style'

const Dialog = ({ dialog, setDialog }) => {
  const closeDialog = useCallback(() => {
    setDialog(null)
  }, [setDialog])

  useEffect(() => {
    const body = document.querySelector('body')
    const top = window.pageYOffset
    if (dialog) {
      const style = `
        position: fixed;
        top: -${top}px;
        left: 0px;
        right: 0px;
      `
      body.setAttribute('style', style)
    }
    return () => {
      if (dialog) {
        body.setAttribute('style', '')
        window.scrollTo(0, top)
      }
    }
  }, [dialog])

  return (
    <>
      {dialog && (
        <>
          <Styled.Background
            onClick={closeDialog}
            role="close-dialog"
          ></Styled.Background>
          <Styled.Container role="dialog-content">{dialog}</Styled.Container>
        </>
      )}
    </>
  )
}

export default Dialog
```

#### 🍯 테스트코드

지금 생각해보면, 그냥 `mocking`함수가 몇번 실행됬는지만 체크해보아도 됬을듯 하다..

```ts
import React from 'react'
import { render, screen, fireEvent } from 'utils/test'
import Dialog from './index'

describe('Dialog', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Dialog 마운트, 언마운트', async () => {
    const setDialog = jest.fn()
    let expectBodyStyle = 'position:fixed;top:-0px;left:0px;right:0px;'

    const { rerender } = render(
      <Dialog dialog="다이얼로그 등장!" setDialog={setDialog} />
    )

    expect(document.body.getAttribute('style').replace(/(\s)*/gi, '')).toBe(
      expectBodyStyle
    )
    expect(screen.getByRole('dialog-content').textContent).toBe(
      '다이얼로그 등장!'
    )

    const closeDialog = screen.getByRole('close-dialog')

    expect(setDialog.mock.calls[0]).toBe(undefined)

    fireEvent.click(closeDialog)

    expect(setDialog.mock.calls[0]).toEqual([null])

    rerender(<Dialog dialog={null} setDialog={setDialog} />)

    expect(document.body.getAttribute('style')).toBe('')
    expect(screen.queryByRole('dialog-content')).toBe(null)
  })
})
```

### 🍞 최상위 컴포넌트의 테스트코드

최상위 컴포넌트를 테스트하면서는 의문이 좀 생겼었다.

비즈니스 로직에 관련된 메소드들도 하위 컴포넌트의 단위테스트에서 `mocking`을 통해 테스트했고, `UI`와 관련되어 렌더링되는 것 또한, 하위 컴포넌트에서 확인해 볼 수 있었기 때문이다.

마치 동일한 테스트를 각각 나누어서 하위 컴포넌트의 단위테스로 진행을 하고, 최 상위 컴포넌트에서 합쳐서 한번 더 진행하는 느낌..?

#### 🥐 컴포넌트

- [UserInfo](https://github.com/sangmin802/loa-hands/blob/master/src/pages/user-info/index.tsx)

#### 🥖 테스트코드

```ts
import {
  fireEvent,
  render,
  screen,
  waitFor,
  getByRole,
  queryAllByText,
} from 'utils/test'
import UserInfo from './index'

const navigation = (type, regex) => {
  const [prev, , next] = screen.getAllByRole(`${type}-nav`)

  expect(getByRole(prev, 'nav-text').getAttribute('color')).toBe('white')
  expect(getByRole(next, 'nav-text').getAttribute('color')).toBe('#666')

  fireEvent.click(getByRole(next, 'button'))

  expect(getByRole(prev, 'nav-text').getAttribute('color')).toBe('#666')
  expect(getByRole(next, 'nav-text').getAttribute('color')).toBe('white')

  expect(queryAllByText(screen.getByRole(`${type}-content`), regex)).not.toBe(
    null
  )
}

describe('UserInfo', () => {
  const name = '모여요꿈동산'

  beforeEach(() => {
    window.scrollTo = jest.fn()
    window.alert = jest.fn()

    render(<UserInfo match={{ params: { name } }} />)
  })

  describe('UserInfo Data', () => {
    it('userInfo route에서 userData는 없고, url에 검색 기록이 있다면 fetch 하기', async () => {
      expect(screen.queryByRole('user-info')).toBe(null)

      await waitFor(() =>
        expect(screen.queryByRole('user-info')).not.toBe(null)
      )

      expect(screen.queryByRole('user-info').dataset.user).toBe(name)
    })
  })

  describe('navigation', () => {
    it('main navigation', () => {
      const regex = /섬의 마음/i
      navigation('main', regex)
    })

    it('sub navigation', () => {
      const regex = /기본 특성/i
      navigation('sub', regex)
    })
  })

  describe('원정대 이벤트', () => {
    it('원정대 팝업 활성화, 비활성화', () => {
      const button = screen.getByRole('button', { name: 'expedition-button' })
      fireEvent.click(button)

      expect(screen.queryByRole('dialog-content')).not.toBe(null)

      const closeButton = screen.getByRole('close-dialog')
      fireEvent.click(closeButton)

      expect(screen.queryByRole('dialog-content')).toBe(null)
    })

    it('원정대 내 다른 캐릭터 검색', async () => {
      const otherClass = '블레이드'
      const otherName = '백어택시너지있어요'
      const button = screen.getByRole('button', { name: 'expedition-button' })

      fireEvent.click(button)

      expect(screen.queryByRole('dialog-content')).not.toBe(null)

      const char = screen.getAllByRole('button', {
        name: 'expedition-char',
      })[0]

      fireEvent.click(char)

      await waitFor(() => screen.getByText(otherClass))
      expect(screen.getByRole('user-info').dataset.user).toBe(otherName)
      expect(screen.queryByRole('dialog-content')).toBe(null)
    })
  })
})
```

### 🥨 테스트 체크리스트

여러 상황을 고려해보았을 때, 내가 테스트해보기로 결정한 조건들은 이러하다.

1. [ ] 렌더링이 잘 되는가
2. [x] `UI`, 비즈니스 로직을 통한 상수나 변수가 잘 계산되어 나오는가
3. [x] 상위 컴포넌트에서 전달되는 메소드들이 정상적으로 호출이 되는가
4. [x] 사용자의 이벤트에 따라 적절한 렌더링을 하는가

## 🥯 예상치 못한 변수

1. 실제 코드에서 비동기작업을 진행하는 경우에는, 테스트코드에서 `beforeEach`로 매 테스트 전에 실행하더라도 `render`된 값을 기억하여 다음 테스트에도 반영되는것 같았다.

   > 실제로 구글링 해보니, 비동기 작업이 이전에 포함될 경우 `render`가 누출되는 상황이 있다는것 같음

2. `react-testing-library`의 `query`는 생성된 `jsdom`에 접근하기 때문에, `display : none`과 같은 시각적으로 영향을 주게 된다면 없다고 나온다. 하지만, `query`로 접근하더라도 `children`과 같이 해당 `Node`에 직접 접근하면, 시각적 영향에 상관없이 만들어져있는 모든 `dom`에 접근할 수 있었다.

## 🥞 결론

개인적으로 외부 모듈이나, 메소드들을 굳이 구현할 필요 없이 `mocking`을 만들어서 제대로 호출이 되는지 테스트해볼 수 있어서 좋았다.

다만, 그러한 메소드들을 직접 생성하는 최상위 컴포넌트에서는 위의 장점은 유지하기 어려운듯 하였다.

다음에는 `Redux`와 `Redux-Saga`를 테스트해본것을 복기해보기로!
