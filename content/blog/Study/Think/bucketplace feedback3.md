---
title: '버킷플레이스 피드백 분석4, 6'
date: 2021-03-09 17:26:00
category: 'Study'
draft: false
tag: 'Think'
---

## action과 saga는 서로 의미가 다르므로 분리하는게 나아보입니다.

해당 문제는 6번과 함께 해결!

## Redux를 사용하였지만 책임에 대한 분리가 제대로 되어있지 않습니다.

처음 피드백을 읽었을 때에, 이해가 가지 않았다.

현재 `Redux`를 관리하는 디렉토리 구조가, 크게 `reducer`, `action(action type, action create)`, 미들웨어를 합쳐주는 `store` 이런 식이였다.

따라서 생각해보았을 때, 위처럼 나누는것을 의미하는건 아닌것 같았다.

더군다나, `Redux Duck`패턴으로 동일한 기능끼리 `reducer`, `action`을 한곳에 모아 관리하는 방식이 부상하고 있기 때문이기도 했다.

여기서는, `Redux`공문을 보고 이건가 싶었던 것이,

```ts
export const reducer = (
  state: IinitalState = initalState,
  action: ActionType
) => {
  switch (action.type) {
    case 'SET_DATA': {
      const data = state.data
        ? [...(state.data as IPost[]), ...action.data]
        : action.data
      return {
        ...state,
        data,
      }
    }
    case 'SCRAP_FILTER_TOGGLE': {
      return {
        ...state,
        showScrapped: !state.showScrapped,
      }
    }
    case 'SET_SCRAPPED_DATA': {
      const scrappedData = filterScrappedData(state.scrappedData, action.post)
      return {
        ...state,
        scrappedData,
      }
    }
    default:
      return state
  }
}
```

현재 `reducer`의 모습인데, 잘 보면 모든 `action`들을 하나의 `reducer`에서 관리하고 있다.

공식문서에도 그렇고, `reducer`또한 각각의 책임에 따라, 도메인에 따라 분리해서 관리하는것을 추천하고, 이후에 하나의 `root reducer`로 합치라고 나와있다.

`Redux Duck`패턴을 생각해보았을 때에도, 위처럼 나누는 것이 필수적이긴 하다.

- `SET_DATA` : 데이터를 갖고오는 `AJAX` 통신을 위한 과정.
  > 미들웨어로 Saga를 거쳐옴.
- `SCRAP_FILTER_TOGGLE` : 네비게이션이나 토글버튼과 같은 기능.
- `SET_SCRAPPED_DATA` : 몇몇의 데이터를 저장하는 기능.

위의 세가지 `action`들은 서로 다른 기능을 하는 `reducer`로 분리하여 각각에 요구되는 `action`도 함께 `ducks`패턴으로 관리하는것이 좋을 듯 하다.

## 수정 후

1. 이것은 피드백 외의 내용인데, `useState` 훅을 사용하는 것처럼, `useSelector`, `useDispatch` 모두 하나의 폴더에서 관리하는것이 아닌, 기능별로 나눠서 훅으로 관리하도록 했다. 또한, 해당 `state`를 사용하거나 비슷한 기능인 `useEffect` 도 해당 훅 내부에서 실행시키도록 함.

```ts
// Home
  const { data, setData } = DataHooks();
  const { showScrapped, setShowScrapped } = ScrapFilterHooks();
  const { scrappedData, selectData } = ScrappedDataHooks();

  const scrollEvent = useCallback(() => {
    return ScrollFetching(setData);
  }, []);

  InfiniteScroll(scrollEvent, showScrapped);
  return (
    // ...
  )

// dataHooks
const DataHooks = () => {
  const dispatch = useDispatch();

  const data = useSelector(
    (state: RootState) => {
      return state.ajaxReducer.data
    },
    (left, right) => {
      if (_.isEqual(left, right)) return true
      return false
    }
  );

  const setData = useCallback(
    i => {
      dispatch(getData(i))
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(getData(1))

    return () => {
      // 필요하다면 컴포넌트 언마운트시 모두 초기화
    }
  }, []);

  return { data, setData };
}
```

> 확실히 가독성도 좋고, 기능별로 묶여있는 느낌. 당연히, 비즈니스 로직들이 훅 디렉토리에 모여있어 관리하기도 편함

2. 리덕스의 경우도, `middleware`, `ducks` 디렉토리로 나누고, `saga`를 분리, `action, reducer`는 기능별로 `ducks`로 분리하였다. 이후, `index`에서 `combineReducer`로 각각의 `ducks`에서 나오는 `reducer`들을 병합하여 관리하게 하였다.
   > 기능별로 관리하기 때문에, 수정할 때 이리저리 옮겨다닐 필요가 없어서 좋음

### Redux Toolkit

`Redux`를 사용하게 된다면 `reducer`, `action`, `action creator` 등등 생성하고 관리해야 할 것들이 많아진다.

사실상 늘 비슷한 기본셋팅을 수동으로 해야하는데, 그것을 기본적으로 제공해주는 모듈을 `Redux`에서 만들었다고 한다.

```ts
import { createSlice } from '@reduxjs/toolkit'

// Thunk까지만 기본지원 한다고 함..
// saga
export const GET_DATA_SAGA = 'GET_DATA_SAGA' as const

// saga creator
export const getData = i => ({ type: GET_DATA_SAGA, i })

// 리듀셔, 액션, 액션크리에이터 묶음
const ajaxSlice = createSlice({
  name: 'ajax',
  initialState: {
    data: [],
  },
  reducers: {
    setData: (state, action) => {
      const data = state.data
        ? [...state.data, ...action.payload.data]
        : action.payload.data

      state.data = data
    },
  },
})

// 디스패쳐 호출을 위한 액션
export const { setData } = ajaxSlice.actions
// 콤바인을 위한 리듀서 내보내기
export const ajaxReducer = ajaxSlice.reducer
```

`switch`, `case` 구문을 사용하지 않아서 확실히 보기도 편하고 액션을 자동으로 생성해주기때문에, 기본작업이 확실히 줄어든 느낌!

## 참고

- [Redux reducer](https://ko.redux.js.org/recipes/structuring-reducers/structuring-reducers)
- [리디의 Redux 관리](https://ridicorp.com/story/how-to-use-redux-in-ridi/)
