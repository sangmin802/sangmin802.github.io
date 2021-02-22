---
title : "Redux-Saga"
date : 2021-02-09 12:57:00
category : "Study"
draft : false
tag : "Think"
--- 
## Redux-Thunk -> Redux-Saga
기존 `Redux`에서 비동기 작업을 수행할 때, `Redux-Thunk`를 사용해왔다.

```ts
export const getUserData_Thunk = (
  name : string, 
  history : _History.History
) => async (
    dispatch
  ) => {
  if(name.replace(/ /g,'')){
    dispatch(loadingToggle(true));
    try {
      const data : UserInfo = await API.getUserData(name.replace(/ /g,''));
      dispatch(getUserData(data, false))
      history.replace(`/userInfo/${name}`)
    } catch(err) {
      alert(err.message);
      dispatch(loadingToggle(false));
      history.replace(`/`)
    }
  }
}
```

내부에서 비동기 작업을 수행할 수 있으며, 다른 `Actions`들을 호출 할 수 있다는 점에 매력을 느꼈다.

하지만, 위처럼 단순하게 이러한 문제만 해결하기 위해서는 `Redux-Thunk`가 접근성도 좋고, 편하게 사용할 수 있지만 다른 여러가지 상황에 대처하는데에는 `Redux-Saga`가 더 유연하다고 하여 한번 공부하고 바꿔보기로 했다.

`Redux-Thunk`보다는 상대적으로 높은 러닝커브를 갖고있다고하는데, 그중 이유가 최신 `ES`시리즈인 제너레이터함수를 사용한다는 점이였다.

이전에, `iterable`한 객체를 만들기 위해 `Generator` 함수를 접해봤던지라 해당 정의를 이해하는데에는 큰 어려움이 없었다.

전체적인 흐름을 보자면,

### 호출
* `Action`을 호출할 때, 별도의 `type`과 각종 변수들을 담고있는 객체를 반환한다.


```ts
// 검색 컴포넌트
const getUserData = (value, history) => {
  dispatch(Actions.getUserData_Saga_Async(value, history))
};

// actions.ts
const GET_USER_DATA_SAGA = 'GET_USER_DATA_SAGA' as const;

export const getUserData_Saga_Async = (
  name, 
  history
) => ({type: GET_USER_DATA_SAGA, name, history})
```

### Saga 감시? 연결?
* 특정 `type`이 호출될 때, 실행되는 `Saga` 메소드들을 맵핑해준다.
> 공식문서를 보니, 감시한다는 느낌으로 설명이 되어있더라.
* `takeLatest`, `takeEvery` 라는 메소드들이 있는데, 아래에서 의미를 다루겠다.
* 첫번째 인자는 감시하는 타입이고, 두번째 인자는 감시하고있는 타입이 호출될 때, 실행되는 메소드이다.
* `put` : `Redux-Thunk`에서의 `dispatch`와 유사하게 다른 `Action`들을 호출한다.
* `call` : 비동기 메소드들을 실행시켜준다. 제너레이터 메소드는 `async` `await` 문법이 적용되지 않기 때문에, 해당 메소드를 이용해야한다. 또한, 두번째 인자로 필요한 변수들을 보낼 수 있는데, 하나가 아닐 경우 객체형식으로 보내야 하더라.
* `select` : 연결되어있는 `store`의 상태를 확인할 수 있다. `useSelector`와 매우 흡사하다.
* `all` : 배열 안의 모든 사가들을 동시에 실행시켜준다.


```ts
// actions.ts
export function* getUserData_Saga(action){
  const name = action.name.replace(/ /g,'');
  const history = action.history;
  if(name){
    yield put(loadingToggle(true));
    try {
      // const store = yield select(state => state);
      const data = yield call(API.getUserData, name);
      yield put(getUserData(data, false))
      history.replace(`/userInfo/${name}`)
    } catch(err) {
      alert(err.message);
      yield put(loadingToggle(false));
      history.replace(`/`)
    }
  }
}

export function* watchSaga() {
  yield takeLatest(GET_USER_DATA_SAGA, getUserData_Saga);
}

export function* rootSaga() {
  yield all([watchSaga()]);
}

// store.ts
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import {rootSaga} from './actions';

const sagaMiddelware = createSagaMiddleware();
export const store = createStore(reducer, applyMiddleware(ReduxThunk, sagaMiddelware))

// 생성된 Saga들을 감시하는 제너레이터? 객체를 실행시켜준다.
sagaMiddelware.run(rootSaga)
```

## takeLatest & takeEvery
`Redus-Saga`를 사용하는 가장 큰 이유라고들 한다.

필요에 따라 새로운 요청 시, 이전의 것을 중지하거나 아니면 누적해서 모두진행시키거나의 차이이다.


### takeLatest
제너레이터 함수 내부에서 가장 마지막으로 호출되는것만 실행시켜 `yield`한다(`return`처럼 반환한다 생각하면 된다.)

자연스럽게 이전의 호출들은 모두 무시된다.

공문이나, 다른 블로그들의 설명들로는 이해가 되지않아 예시를 직접 만들어보니 이런 의미인듯 했다.


```ts
// 호출 컴포넌트
const test = () => {
  dispatch(Actions.takeLatestTest_Saga_Async(1))
  dispatch(Actions.takeLatestTest_Saga_Async(2))
}

// actions.ts
const TAKE_LATEST_TEST = 'TAKE_LATEST_TEST' as const;
const TAKE_LATEST_TEST_CALLER = 'TAKE_LATEST_TEST_CALLER' as const;

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export const takeLatestTest_Saga_Async = (
  num
) => ({type : TAKE_LATEST_TEST, num})

export function* takeLatestTest(action) {
  const val = action.num;
  yield delay(1000*val)
  yield put({type : TAKE_LATEST_TEST_CALLER, val});
}

export function* watchSaga() {
  yield takeLatest(TAKE_LATEST_TEST, takeLatestTest);
}

// reducer.ts
switch(action.type){
  case 'TAKE_LATEST_TEST_CALLER' : {
    console.log('takeLatest' + action.val+'번째 실행')
    return state
  }
  ...

// 콘솔
// takeLatest2번째 실행
```

동일한 `Action`을 두번 호출하고 두가지 모두 비동기작업이지만, 작업의 `delay`시간이 다르다.

사실상 두개의 제너레이터는 비슷하게 생성이되지만, 첫번째 제너레이터가 1초뒤에 완료되더라도 2초뒤에 완료되는 두번째 제너레이터가 존재하기 때문에, 첫번째 제너레이터는 무시되었다.

### takeEvery
예제는 위와 동일하지만, 메소드만 `takeEvery`로 변경을 한다면 콘솔값은 `takeLatest1번째 실행` 이후 `takeLatest2번째 실행` 모두 나오게 된다.