---
title : "React Loa-Hands"
date : 2020-11-02 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 

## Loa-Hands
React-Hook, redux-hook등 기존과 다른 방법으로 웹앱을 만드는 과정에서 여러가지 시행착오를 가졌었고, 그것들을 기록해보려 한다.
* [Loa-Hands 이동](https://sangmin802.github.io/loa-hands/)

### redux-hook / shallwoEqual
기존 Redux를 사용할 때에는, 해당 컴포넌트에 connect 메소드를 활용하여 연결을 하였었다. 한때는 이것이 직관적이고 좋아서 편하다 생각했는데, 확실히 redux-Hook을 원활하게 사용할 줄 만 안다면, 비교적 더 간단하게 구현 가능한것 같다.

* useDispatch : 각종 액션들을 통해 스토어에 변경을 요청할 수 있는 메소드
* useConnect : 스토어에서 필요한 값을 가져오는 메소드이다.

그런데, 사용중 문제가 생겼었는데, 해당 컴포넌트에서는 isLoading속성을 받아오지 않음에도 불구하고, 아래의 디스패치로 isLoading가 변경되었을 때, 다시 렌더링을 했었다.
<br>
그것을 막기 위해 react-redux에서 shallowEqual라는 메소드를 받아오고 두번째 인자로 보내주어 내가 받아오기로 한 속성들만 변경이 있을 때 렌더링을 하도록 해줄 수 있다.

<br>
물론, 두번째 콜백함수는 직접 등록도 가능하여, 두개의 인자를 받고 두개의 인자를 비교하여 렌더링할것인지(false) 하지 않을것인지(true) 지정할 수 있다.

<br>
또한, 자식컴포넌트의 경우 React Hook으로 인해 부모가 다시 렌더링 되었을 때, 이유없이 불필요한 렌더링이 될 수 있기 때문에 React.memo로 자식컴포넌트를 감싸 무조건 true를 혹은 조건부 true를 반환시켜 렌더링이 안되도록 막는게 좋은듯 했다.

```javascript
  const
    dispatch = useDispatch(),
    {userData, expeditionPop, userInfoMainTab} = useSelector(state => ({
      userData : state.userData,
      expeditionPop : state.expeditionPop,
      userInfoMainTab : state.userInfoMainTab,
    }), shallowEqual);

// dispatch
 dispatch(Actions.expeditionPopToggle(true));
```

### Can not update a component while rendering a different component...
솔직히 아직도 이해가 되지 않는 에러였다.<br>
화면상으로는 문제없이 구현되지만, 콘솔창에는 해당 에러가 출력이 된다.<br>
App컴포넌트 안에 UserInfo와 Home컴포넌트가 있으며 react-router로 연결되어있다. UserInfo 컴포넌트에서 헤더의 로고를 클릭하면 다시 Home컴포넌트가 출력되는 방식인데, 평소에는 문제없지만 새로고침을 하여 스토어에 HomeData가 없어진다면 HomeDate의 디스패쳐가 작동되어 다시 받아오도록 설정되어있다.<br>
그런데 그 과정에서 해당 에러가 지속적으로 발생한다.<br>
이유는 Home컴포넌트가 렌더링되는 과정에 디스패쳐에서 변경되늰 isLoading때문에 App컴포넌트도 렌더링되어 발생하는 문제라는데..

* 로고를 클릭했을 때 바로이동이 아닌 router-hook을 통해, UserInfo컴포넌트에서 모든 정보를 받은 뒤, Home으로 이동하게하여 순차적으로 렌더링하게 했더니 에러는 안생긴다.

아니근데 이해가 좀 안되는게, 처음 앱이 켜질때에도 같은 조건인데 그때는 아무 에러 없다가 이 경우에만 저 에러가생기는게 참;

```javascript
export const setHomeData_Thunk = (history) => (dispatch, getState) => {
  dispatch(loadingToggle(true));
  API.getHomeData()
  .then(homeData => {
    dispatch(setHomeData(homeData, false))
    if(history) history.replace(`/`);
  })
}
```

### 깃허브페이지와 BrowserRouter
브라우저 라우터를 사용하여 깃허브페이지를 띄울 때, 쿼리문이 있다면 새로고침을 하였을 때 404오류가 발생한다. 아무래도 새롭게 주소를 찾는것때문에 그런듯 하다.
브라우저 라우터를 사용하여 깃허브페이지를 띄울 때, 쿼리문이 있다면 새로고침을 하였을 때 404오류가 발생한다. 아무래도 새롭게 주소를 찾는것때문에 그런듯 하다.
* 404페이지에서 원점으로 돌아가는 스크립트를 즉시실행시키고, index.html에서 다시 path를 통해 이동하는 방식이 있었다.
* [404->index.html](https://github.com/rafgraph/spa-github-pages)
