---
title: '💻 브라우저 렌더링의 시작'
date: 2021-07-26 14:44:00
category: 'Study'
draft: false
tag: 'Think'
---

`naver.com`, `youtube.com` 정말 많은 사람들이 url입력창에 다양한 사이트 주소를 입력하고 접속을 한다.

우리가 입력하는것은 한 줄의 영어 주소인데, 어떻게 브라우저는 하나의 웹 사이트를 만들어내는걸까?

## naver.com -> 10.20.215.....

사실 우리가 입력하는 `naver.com`이런 도메인 자체로는 아무런 힘을 갖고 있지 않는다.

웹 어플리케이션들은 본인만의 고유한 `IP`를 갖고있는데, 이 규칙성없는 숫자집합을 우리는 외우기도 힘들고 입력하는데도 불편하니 우리의 입맛에 맞게 새로운 이름을 붙여준것이 `naver.com`이런 것들이다.

그래서, `naver.com`을 입력했을 때 서버에 이대로 요청을 하는 것이 아닌 도메인 주소와 매칭된 웹 어플리케이션의 `IP`를 연결해주는 누군가의 도움이 필요하다.

그러한 역할을 해주는것이 `DNS 서버`였다.

> 저번 DNS와 IP를 비교한 글을 통해 배웠었다.

어쨌든, 매칭된 `IP`주소를 사용하여 해당 `IP`주소를 찾아가게 된다.

## 필요한 기초자원 수집

요청이 잘 전달되었다면, 해당 서버에서는 `HTML`, `CSS`와 같이 웹 어플리케이션을 구성하기위한 기초 자원들을 브라우저에게 전달해준다.

## 렌더링 엔진

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/07/27/1.png" alt="1">
</div>

브라우저의 구조에는

- 사용자 인터페이스 : URL 입력창, 뒤로가기등의 기능들
- 브라우저 엔진 : 사용자 인터페이스와 렌더링 엔진 사이의 동작 제어
- 렌더링 엔진 : 서버로부터 받아온 `HTML`, `CSS`를 브라우저가 해석할 수 있는 언어로 파싱하여 표시하는 역할
- 자바스크립트 해석기 : 자바스크립트 코드 해석
  > 브라우저 단독으로는 자바스크립트를 해석할 수 없기 때문에, 별도의 자바스크립트 엔진을 갖고있다.
  > 동일한 자바스크립트 코드더라도, 브라우저마다 호환 여부가 다른 이유는 사용하는 자바스크립트 엔진이 브라우저마다 다르기 때문이다.

전달받은 `HTML`, `CSS`자원들은 브라우저의 렌더링 엔진이 내부적으로 작업을 하면서 최종화면을 띄우게 된다.

추가적으로 렌더링 엔진은 하나의 브라우저에서 여러개 생길 수 있다고 한다.

우리가 브라우저를 활성화 하였을 때, 상단에 탭으로 각기 다른 페이지를 요청, 확인할 수 있는데 이 때의 작업을 해주는 것들이 각각탭의 렌더링엔진들이라고 한다.
