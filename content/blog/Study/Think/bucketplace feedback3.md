---
title: '버킷플레이스 피드백 분석4, 6'
date: 2021-03-09 15:55:00
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

### Redux Toolkit

`Redux`를 사용하게 된다면 `reducer`, `action`, `action creator` 등등 생성하고 관리해야 할 것들이 많아진다.

사실상 늘 비슷한 기본셋팅을 수동으로 해야하는데, 그것을 기본적으로 제공해주는 모듈을 `Redux`에서 만들었다고 한다.

전반적으로 수정하고, 해당 모듈도 써봐야 겠음..

## 참고

- [Redux reducer](https://ko.redux.js.org/recipes/structuring-reducers/structuring-reducers)
- [리디의 Redux 관리](https://ridicorp.com/story/how-to-use-redux-in-ridi/)
