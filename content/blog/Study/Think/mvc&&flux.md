---
title : "MVC && Flux"
date : 2021-02-11 17:09:00
category : "Study"
draft : false
tag : "Think"
--- 

요즘 프로젝트들의 리팩토링을 고민하면서 자연스럽게 디렉토리의 구조도 생각해보게 되었다. 어찌보면, 비즈니스로직들과 뷰를 구분할 때, 디렉토리를 기반으로 짜면 좋지 않을까라는 생각도 들었다.

## 디자인 패턴
프로젝트를 구성할 때, 정한 디자인패턴에 준하여 구조를 잡는다면 외부의 사람들이 해당 프로젝트를 이해하는 데에도 좋고 이후 기술변경등으로 인한 수정사항이 있을 때, 스파게티코드러처럼 여러곳을 수정할 필요없이 필요한 부분만 수정할 수 있다는 큰 장점이 있다.

## MVC
정말 유명하고 많은 프로젝트들에 사용되고있는 디자인패턴이다.
* **M**odel : 프로젝트의 데이터, 자료를 의미한다.
* **V**iew : 사용자에게 보여지는 부분. `UI`
* **C**ontroller : `Model`과 `View`를 이어주는 다리라고 한다. `UI`에서 발생하는 각종 이벤트처리나, 그로 인한 `Model`의 변경을 관리한다. 즉 각종 로직들을 관리하는 파트

각각의 파트가 관리하는 기능들이 달라서, 수정이 필요할 경우 그 부분만 변경을 해주면 된다. 물론 `Controller`의 경우, 서로 연관되어있어 수정이 필요할 수 있긴 함..

## MVC 동작 순서
1. 사용자의 요청들이 `Controller`에 들어옴.
2. `Controller`는 `View`에게서 사용자의 요청을 확인하고, 필요하다면 `Model`을 업데이트함.
3. `Model`이 변경된다면 `View`는 `Controller`를 거쳐서 변경된 데이터를 사용하여 화면을 그림.

<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2021/02/11/5.png?raw=true" alt="result1">
</div>

> [이미지 출처 : https://medium.com/@jang.wangsu](https://medium.com/@jang.wangsu/%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4-mvc-%ED%8C%A8%ED%84%B4%EC%9D%B4%EB%9E%80-1d74fac6e256)

💢 이후 프로젝트의 규모가 커지게 되면서 문제가 발생하게 된다. 하나의 `Model`이 다수의 `View`에게 영향을 줄 수도 있고, 반대로 다수의 `View`가 하나의 `Model`에 영향을 받을 수 있다. 즉 여러개의 파트들이 서로에게 의존성을 갖게되어, 둘을 이어주는 `Controller`에 복잡하게 연결되어있는 상황이 생길 수 있다.

<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2021/02/11/6.png?raw=true" alt="result2">
</div>

> [이미지 출처 : https://beomy.tistory.com/44](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALrHe%2FbtqBTMSuHfN%2FZlW9i9ET34e90APgCRChk1%2Fimg.png)

## Flux
페이스북에서 개발한 디자인 패턴으로, 무조건 한방향으로만 이뤄지는 디자인 패턴이다.

<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2021/02/11/7.png?raw=true" alt="result3">
</div>

> [이미지 출처 : https://beomy.tistory.com/44](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FALrHe%2FbtqBTMSuHfN%2FZlW9i9ET34e90APgCRChk1%2Fimg.png)

1. `View`에서 사용자의 요청`Action`이 발생
2. `Dispatcher`호출
3. `Dispatcher`에 따른 `Store`상태값 변경
4. `Store` 상태값 변경에 따른 `View` 재구성

사실상 `Redux`는 이러한 `Flux`디자인패턴을 잘 활용한 중앙상태관리툴이라고 볼 수 있는데, 단 하나의 `Store`만을 관리하며 해당 `Store`에 `View`는 직접적으로 영향을 줄 수 없으며 오로지 특정 `Action`에 따른 `Dispatcher`로만 접근할 수 있는점이다.

하지만 요즘 드는 생각이, 디렉토리의 구조를 짤 때, `Redux`를 `MVC`패턴의 모양? 을 기반으로 하여 짤 수 도 있지 않나 생각이 든다.

크기가 커지면서 여러개의 `Model`이 생성되는것을 하나의 `store`로 친다면..

* `View`는 뭐.. 당연히 `Component`들이겠고
* `Model`은 `reducer` + `store` 부분이려나..? 초기 상태인 `initialState`를 사실상 `reducer`에서 생성해서 이렇게 생각했다.
* `Controller`는 `Action`이 될 것 같다.

좀 더 생각을 해봐야겠다.