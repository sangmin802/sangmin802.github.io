---
title: 'Reudx, Redux-Saga 테스트코드'
date: 2021-06-18 13:11:00
category: 'Study'
draft: false
tag: 'TestCode'
---

이번에는 `Redux`와 `Redux-Saga`의 테스트코드를 다시 복기해보려한다.

## 🍆 테스트 분야

1. [ ] `action`을 잘 생성하는가
2. [ ] `reducer`내부에 로직이 있다면, 해당 로직을 잘 수행하고 적절한 값을 상태값에 반영하는가
3. [ ] `Saga Middlware`를 통해 순차적으로 적절한 이펙트드들을 반환하는가

기본적인 `Redux` 구조는 `Redux Toolkit`을 사용하여 기능별로 `slicer`로 작성되었다.

### 🧅 Action

기본 `Action`도 생성하지만, `fetch`, `axios`와 같은 비동기작업이 있기 때문에 `Saga-Action`또한 생성되는지 확인해보아야 했다.

#### slicer

```ts
import { createSlice } from '@reduxjs/toolkit'

export const GET_USER_DATA_SAGA = 'GET_USER_DATA_SAGA' as const
export const getUserData_Saga_Async = (name, history) => ({
  type: GET_USER_DATA_SAGA,
  name,
  history,
})

export const GET_HOME_DATA_SAGA = 'GET_HOME_DATA_SAGA' as const
export const getHomeData_Saga_Async = (history?) => ({
  type: GET_HOME_DATA_SAGA,
  history,
})

const ajaxSlicer = createSlice({
  name: 'ajax',
  initialState: {
    userData: null,
    homeData: null,
  },
  reducers: {
    getUserData: (state, action) => {
      state.userData = action.payload.userData
    },
    getHomeData: (state, action) => {
      state.homeData = action.payload.homeData
    },
  },
})

export const { getUserData, getHomeData } = ajaxSlicer.actions
export const ajaxReducer = ajaxSlicer.reducer
```

#### 테스트코드

`Saga Action`에 필요한 인자를 보낼 때, `history`와 같은 외부 모듈이 있는 경우 `mocking`함수로 대체하였다.

```ts
import * as Slicer from './index'

describe('Actions', () => {
  describe('일반 Actions', () => {
    it('getUserData 액션 생성', () => {
      const data = { userData: '유저데이터' }
      const expectedAction = {
        type: 'ajax/getUserData',
        payload: { userData: '유저데이터' },
      }

      expect(Slicer.getUserData(data)).toEqual(expectedAction)
    })

    it('getHomeData 액션 생성', () => {
      const data = { homeData: '홈데이터' }
      const expectedAction = {
        type: 'ajax/getHomeData',
        payload: { homeData: '홈데이터' },
      }

      expect(Slicer.getHomeData(data)).toEqual(expectedAction)
    })
  })

  describe('Saga Actions', () => {
    it('getUserData_Saga_Async 액션 생성', () => {
      const name = '상민'
      const history = jest.fn()
      const expectedAction = {
        type: 'GET_USER_DATA_SAGA',
        name: '상민',
        history,
      }

      expect(Slicer.getUserData_Saga_Async(name, history)).toEqual(
        expectedAction
      )
    })

    it('getHomeData_Saga_Async 액션 생성', () => {
      const history = jest.fn()
      const expectedAction = {
        type: 'GET_HOME_DATA_SAGA',
        history,
      }

      expect(Slicer.getHomeData_Saga_Async(history)).toEqual(expectedAction)
    })
  })
})
```

이런 컴포넌트에 무슨 테스트가 필요할까..

### 🌽 Reducer

현재 프로젝트에서는 `Redux-Toolkit`을 사용하여, 각각 기능별로 `slicer`가 나뉘어져 있고 별도의 `Reducer`를 생성하여 `combineReducers`를 통해 합쳐주고 있었다.

처음에는 해당 `slicer`에서 `export`되는 `Reducer`를 사용하여 바로 테스트해볼 수 있지 않나 싶었지만, `combineReducers`를 통해 `RootReducer`를 생성하기전에는 테스트가 안되는것 같았다..

#### 테스트코드

1. `getState`를 통해 초기 상태값을 확인
2. `action`을 호출하였을 때 `state`에 잘 반영되는지 확인
   > 사용자가 `Saga-Action`을 호출했을때의 테스트가 아닌, `Saga`에서 일반 `Redux-Action`을 호출했을때의 상황을 테스트

```ts
import { store } from './index'

describe('Store', () => {
  describe('Reducer', () => {
    it('initial data', () => {
      const state = store.getState()
      const expectedAjax = { userData: null, homeData: null }
      const expectedToggle = { isLoading: false }

      expect(state.ajaxReducer).toEqual(expectedAjax)
      expect(state.toggleReducer).toEqual(expectedToggle)
    })

    it('set loadingToggle', () => {
      let action = {
        type: 'toggle/loadingToggle',
        payload: true,
      }

      store.dispatch(action)

      expect(store.getState().toggleReducer.isLoading).toBe(true)

      action.payload = false

      store.dispatch(action)

      expect(store.getState().toggleReducer.isLoading).toBe(false)
    })

    it('set userData', async () => {
      const fakeUser = {
        name: '상민',
      }
      const action = {
        type: 'ajax/getUserData',
        payload: { userData: fakeUser },
      }

      await store.dispatch(action)

      expect(store.getState().ajaxReducer.userData).toEqual(fakeUser)
    })

    it('set homeData', async () => {
      const fakeHome = {
        name: '홈',
      }
      const action = {
        type: 'ajax/getHomeData',
        payload: { homeData: fakeHome },
      }

      await store.dispatch(action)

      expect(store.getState().ajaxReducer.homeData).toEqual(fakeHome)
    })
  })
})
```

### 🥕 Saga Middleware

비동기 작업을 수행함에 따라, 순차적으로 여러 `action`들을 호출하게 되는데, 이것이 잘 진행되는지를 테스트 해볼 수 있었다.

#### 🥗 컴포넌트

```ts
import { put, takeLatest, call } from 'redux-saga/effects'
import { loadingToggle } from '../../ducks/toggle-slicer'
import Api from 'api/api'
import { GET_USER_DATA_SAGA, getUserData } from '../../ducks/ajax-slicer'

export function* getUserData_Saga(action) {
  const name = action.name.replace(/ /g, '')
  const history = action.history
  if (name) {
    yield put(loadingToggle(true))
    try {
      const userData = yield call(Api.getUserData, name)
      yield put(getUserData({ userData }))
      yield put(loadingToggle(false))
      history.replace(`/userInfo/${name}`)
    } catch (err) {
      alert(err.message)
      yield put(loadingToggle(false))
      history.replace(`/`)
    }
  }
}

export function* userDataSaga() {
  yield takeLatest(GET_USER_DATA_SAGA, getUserData_Saga)
}
```

#### 🥔 테스트코드

별다른 모듈 없이, 이펙트의 `next()` 메소드를 통해 테스트를 해볼 수 있지만, `Saga` 공식문서에 보면 여러 도움을 주는 모듈들이 설명되어 있다.

그중에 설명상으로는 가장 다재다능 하다는 `redux-saga-test-plan`를 사용해보았다.

`provide`를 통해 내부에서 실행되는 메소드중 외부 모듈의 영향을 받거나 비동기로 진행되어 일정 시간이 걸리는 작업일 경우, `mocking` 하여 결과값을 지정해줄 수 있다.

별다른 시간 없이 바로 매칭된 결과값을 반환하는 것이다.

또한, `withReducer`를 통해 `Reducer`와 함께 테스트를 진행하여 각각 이펙트로 호출되는 `action`에 따라 `Reducer`에서 업데이트 되고, `hasFinalState`로 최종적인 값을 확인해 볼 수 있었다.

다만 조금 아쉬운점이, 각각의 이펙트 이후에 단계별로 `state`를 확인해보지는 못했던 것이다.

```ts
import * as Saga from './index'
import * as matchers from 'redux-saga-test-plan/matchers'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { rootReducer } from '../../index'
import Api from 'api/api'

describe('getUserData_Saga', () => {
  const name = '상민'
  const replaceMock = jest.fn()
  const history = {
    replace: replaceMock,
  }
  const action = { name, history }
  const fakeUser = { name, age: 27 }

  beforeEach(() => {
    jest.spyOn(global, 'alert').mockImplementation(null)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('userData_Saga 정상 진행', async () => {
    await expectSaga(Saga.getUserData_Saga, action)
      .withReducer(rootReducer)
      .put({
        type: 'toggle/loadingToggle',
        payload: true,
      })
      .provide([[matchers.call.fn(Api.getUserData), fakeUser]])
      .put({
        type: 'ajax/getUserData',
        payload: { userData: fakeUser },
      })
      .put({
        type: 'toggle/loadingToggle',
        payload: false,
      })
      .hasFinalState({
        ajaxReducer: { userData: fakeUser, homeData: null },
        toggleReducer: { isLoading: false },
      })
      .run()

    expect(replaceMock).toBeCalledTimes(1)
    expect(replaceMock).toHaveBeenCalledWith('/userInfo/상민')
  })

  it('userData_Saga 에러 반환', async () => {
    await expectSaga(Saga.getUserData_Saga, action)
      .withReducer(rootReducer)
      .put({
        type: 'toggle/loadingToggle',
        payload: true,
      })
      .provide([
        [matchers.call.fn(Api.getUserData), throwError(new Error('모의 에러'))],
      ])
      .put({
        type: 'toggle/loadingToggle',
        payload: false,
      })
      .hasFinalState({
        ajaxReducer: { userData: null, homeData: null },
        toggleReducer: { isLoading: false },
      })
      .run()

    expect(global.alert as jest.Mock).toBeCalledTimes(1)
    expect(global.alert as jest.Mock).toHaveBeenCalledWith('모의 에러')
    expect(replaceMock).toBeCalledTimes(1)
    expect(replaceMock).toHaveBeenCalledWith('/')
  })
})
```

### 🥨 테스트 체크리스트

1. [x] `action`을 잘 생성하는가
2. [x] `reducer`내부에 로직이 있다면, 해당 로직을 잘 수행하고 적절한 값을 상태값에 반영하는가
3. [x] `Saga Middlware`를 통해 순차적으로 적절한 이펙트드들을 반환하는가

## 🥞 결론

컴포넌트와 `Redux` 관련된 파일은 모두 테스트코드를 통해, 진행과정이나 사용자의 이벤트 등의 이후 렌더링된 상태를 테스트해볼 수 있었다.

다만, 이전 최소단위의 컴포넌트같은 경우는 단순 렌더링이기 때문에 테스트코드가 없었고, 또한 스타일과 같은 `UI`로직을 통한 테스트코드의 경우 이 방법 만으로는 조금 아쉬움이 있었다.

이를 위해 `UI`와 관련된 테스트 라이브러리인 `StoryBook`를 찾을 수 있었고, 이 또한 한번 적용해볼 생각이다.
