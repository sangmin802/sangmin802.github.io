---
title : "loa-hands refactoring"
date : 2021-02-26 13:14:00
category : "Study"
draft : false
tag : "Think"
--- 

예~ 전에 모 기업에서 피드백을 받고, `Loa-Hands`또한 리팩토링을 하였었다.

그때 비즈니스 로직과 뷰를 구성하는 컴포넌트를 분리해야한다 라는 말에 `Presentational Component`, `Container Component`를 사용하여 `dispatch`를 통한 상태값은 `Container Component`에서 모두 처리하고 속성들을 통해 `Presentational Component`를 그리는 방식으로 모두 바꿨었다.

하지만 수정을 하고나서도 이해가 안가는점이 있었다.

## Redux가 의미있나
`Redux Hook`을 왜쓴거지..? 라는 생각이 떠나질 않았다.

이렇게되면 최상위 컴포넌트에서 `useState`를 사용하고, 모든 `dispatcher`와 `state`값들을 그냥 속성으로 보내주는거랑 뭐가다른거지..

어쩌면 위의 두가지를 분리한다는점을 내가 잘못이해한게 아닌가 싶었다.

위와 다른 기준으로 리팩토링을 다시해보기로 했다.

1. 재사용 가능한 컴포넌트를 위해 `chldren`기능을 좀 더 잘 사용해보자.
> 재사용 가능한 컴포넌트를 사용한다는점에서, 최대한 부품부품별로 잘게 나누는것도 중요할 것 같다.
2. 비즈니스 로직을 생성하는 훅을 만들고, 필요한 컴포넌트에서는 생성된 훅을 가져다 사용한다.
> 사실, 이 방법이 올바른 방법인지는 잘 모르겠지만, `useDispatch`나 `useSelector` 등도 이와같이 하면, 해당 훅으로 생성되는 함수만 컴포넌트에서 받아오기때문에, 추후 기술스택이 업데이트되거나 바뀌더라도 해당 파일의 훅만 수정해주면 된다는 점이다.
3. 특정 컴포넌트에서만 사용되거나 뷰를 구성할 때 필요한 훅들 `useEffect`, `useState`또한 재사용할 수 있도록 분리하자.
4. `Redux`의 경우, 사실상 `Redux`를 사용한 순간 데이터 흐름 방식은 `Flux` 패턴이지만 디렉토리 구조는 `MVC`패턴을 따르기로 했다.

## 디렉토리 구조
### Before
<div style="text-align : center">
  <img src="/img/2021/02/26/1.PNG?raw=true" alt="1">
</div>

### after
* 이전의 `Presentational Component`, `Container Component`로 나눈것이 아닌, 최대한 부품으로 나눠서 사용
* 재사용 목적인 컴포넌트`_name` 와 그렇지 않은 컴포넌트 `part-name`를 구분함. 다만 디렉토리의 경우 가독성을 위해 `Kebab case`를 사용
> 각각의 컴포넌트별 필요한 값, 속성명, 값을 구하기 위한 로직들이 다르기때문에 재사용목적이 아닌 컴포넌트도 존재하게 됨... 
* 추후 확장 가능성을 위해 기능별로 디렉토리를 꼭 갖도록 함

<div style="text-align : center">
  <img src="/img/2021/02/26/2.PNG?raw=true" alt="1">
</div>

## 재사용 가능한 Hook

<div style="text-align : center">
  <img src="/img/2021/02/26/3.PNG?raw=true" alt="1">
</div>
<div style="text-align : center">
  <img src="/img/2021/02/26/4-1.PNG?raw=true" alt="1">
</div>
<div style="text-align : center">
  <img src="/img/2021/02/26/4-2.PNG?raw=true" alt="1">
</div>
<div style="text-align : center">
  <img src="/img/2021/02/26/4-3.PNG?raw=true" alt="1">
</div>

위와 같은 재사용가능한 컴포넌트를 최대한 만들었다(?) 유지했다(?).

속성 값들만 받아와서 생성하는 부분이다. 물론, `Nullalbe`을 통해 없는속성이라면 생성하지 않는다.

당연하게도, 재사용을 하더라도 `CSS`는 다르게 필요한 경우가 있는데, 이러한 경우 해당 컴포넌트를 부품으로 사용하는 상위컴포넌트의 클래스명에 상속시켜서 `CSS`를 덮어씌우는 방식으로 하였다.
> 사실상 이런식으로 하게된다면 `SCSS`가 더 나을듯 함

붉은 원들은 모두 동일한 컴포넌트임


<div style="text-align : center">
  <img src="/img/2021/02/26/5.PNG?raw=true" alt="1">
</div>


위의 컴포넌트도 재사용 가능한 컴포넌트인데, 조금은 규모가 크다.

<div style="text-align : center">
  <img src="/img/2021/02/26/6-1.PNG?raw=true" alt="1">
</div>

해당 라우트에서 저 부분은 모두 두개의 기둥?이 서있는 형식을 갖고있다.

다만, 모양은 모두 같아보여도 외부에서 받아오는 `JSON`의 `key`, `value`가 다르고, 해당 `value`를 파싱하는 과정도 모두 다르다.

왜 파싱이 필요한가 싶겠지만.. 내가 만든 `JSON`이 아니라 어쩔수가..

물론 `GrpahQl`을 사용한다면 해당 서버에서 통일화하여 클라이언트단으로 넘어와 사용하기때문에 좀 더 컴포넌트를 단순하게하고 줄일 수 있겠지만 그럴수있는 상황이 아니니깐..

저 `DoubleColumnList`에 각기 다른 컴포넌트를 내부에 갖게된다.

<div style="text-align : center">
  <img src="/img/2021/02/26/6-2.PNG?raw=true" alt="1">
</div>

대략적인 생김새는 이렇게 생겼다. 이런것들이 각각 필요한 값들, 파싱과정을 갖고있는 컴포넌트에 맞춰 할당된다. 이부분이 참 애매하고 더 개선할 수 있는지 고민해봐야될것 같다..

어쨌든 이런 컴포넌트들이 `DoubleColumnList`에게 보내지게되는데, 저 `data`라는 속성은 어떻게 받아오냐면

<div style="text-align : center">
  <img src="/img/2021/02/26/6-3.PNG?raw=true" alt="1">
</div>

이런식으로 `children`객체를 디스트럭쳐링하여 직접부여해준다.

사실상 이런방식을 사용하면 `DoubleColumnList`는 `children`에 따라 다른 화면을 생성하는 재사용가능한 컴포넌트가 된다.

<div style="text-align : center">
  <img src="/img/2021/02/26/6-4.PNG?raw=true" alt="1">
</div>

`ColumnList`또한, 받아오는 `children`에 따라 리스트가 다르게 생성됨.
> 누구는 `hoverComponent`가 있고, 누구는 `Text`만 있고 등등..

<div style="text-align : center">
  <img src="/img/2021/02/26/7.PNG?raw=true" alt="1">
</div>

각종 훅들 또한 별도로 관리하도록 하였다. 특정 훅들은 다른 컴포넌트에서도 재활용 될 수 있다고 생각하였는데, 그런 과정에서 수정이 필요하다면 하나의 훅만 수정하면 되기 때문!

## Layout과 Pages
사실상 이 구조는 `Next.js`를 하는도중 괜찮다고 생각해서 가져왔다.

`Next.js`에서는 `pages`가 `path`에 따라 보여지는 화면들이기 때문에 `React`에서도 라우트별 컴포넌트를 관리하게 하였다.

<div style="text-align : center">
  <img src="/img/2021/02/26/8.PNG?raw=true" alt="1">
</div>


## Redux - Flux와 MVC
<div style="text-align : center">
  <img src="/img/2021/02/26/9.PNG?raw=true" alt="1">
</div>
데이터 흐름 방식 자체는 `Flux`패턴이지만, 디렉토리 구조는 `MVC`를 따라갔다.

메인 데이터가 되는 `model` 디렉토리에는 `Initial State`나, 이후 컨트롤러로 변경된 값을 `State`에 합쳐주는 역할을 하는 `reducer`와, `Saga`등의 각종 미들웨어나 `reducer`를 병합해주는 `store`가 있다.

`model`에 변경을 주거나 변경된 값을 가져오는 기능들은 모두 `controller`디렉토리에 넣었다.

<div style="text-align : center">
  <img src="/img/2021/02/26/9-1.PNG?raw=true" alt="1">
</div>
<div style="text-align : center">
  <img src="/img/2021/02/26/9-2.PNG?raw=true" alt="1">
</div>

위에서 다시 정한 두번째 기준에 따라 만든것인데, `dispatch`나 `selector` 기능을 하는 값을 생성하는 훅이 혹여나 바뀔수도 있다고 생각해서, 해당 `dispatchers`폴더에서 생성하고 다른 컴포넌트에서 생성된 것만 사용하게 했다.

이를 통해, 이 하나만 수정해주면 모두를 바꿀 필요가 없게된다.

## React의 깜빡임이 싫어
사실상 이거는 리팩토링보다는 그냥 내가 불편해서..

`state`에 따라서 그때마다 컴포넌트를 생성하는 방식을 사용하면 편하긴 하지만 처음 컴포넌트를 생성하게 될 때, 생성하는 시간이 있어 한번 깜빡이는? 느낌이 들더라
> 깜빡인다기 보다는 컨텐츠가 한번 사라졌다가 다시 생성되는 느낌

물론 새롭게 데이터를 받아와야 하는 구조라면 적당한 로딩화면을 노출시키고 컨텐츠를 감싸는 부모에게 최소높이를 지정해주면 쉽게 해결되긴 하지만, 이미 갖고있는 데이터에 양이 많은것도아니라 굳이 이렇게 해야할 필요가 있나 생각했다.

<div style="text-align : center">
  <img src="/img/2021/02/26/10-1.gif?raw=true" alt="1">
</div>

따라서, 미리 생성을 해두고, `display`기능을 통해 컴포넌트 전환을 하게 하였다.

`Vue`의 `isShow`처럼.

<div style="text-align : center">
  <img src="/img/2021/02/26/10-2.gif?raw=true" alt="1">
</div>

확실히 훠 얼 씬 자연스러움

## 느낌
절대로 이것이 정답이 아니다.

더 좋은 방법도 있을것이고 더 효율적으로 구성할 수 도 있을것 같다.

다만, 이전에 받았던 피드백의 `추후 기술 스택이 변경될 수 있으니 비즈니스로직과 뷰를 구성하는 컴포넌트는 분리하는것이 좋습니다.`

라는 말에는 이번 리팩토링이 이전 리팩토링보다 더 적합하다고 느껴진다.




아 그리구 디자인도 좀 바꿈 


찡긋 😉