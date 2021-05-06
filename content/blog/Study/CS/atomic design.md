---
title: 'Atomic Design'
date: 2021-05-06 15:47:00
category: 'Study'
draft: false
tag: 'CS'
---

## 🙌 Container, Presentational 안녕.. Hook 안녕!

이전에는 디렉토리의 구조를 잡을 때, `Container Component`, `Presentational Component`를 통하여 비즈니스로직을 담당하는 컴포넌트와 뷰를 담당하는 컴포넌트를 구분하여 관리하였었다.

하지만, `Hook`이 개발되고, `Class`기반 컴포넌트가 아닌 `Function`기반의 컴포넌트를 주로 사용하게 되면서 이러한 구조는 더이상 사용하지 않게 되었다.

`Class`가 아니더라도 `Hook`을 통해 쉽게 `state`를 형성하고, 연결할 수 있으며 분리하여 관리하는것 또한 가능해졌기 때문이다.

이로서 비즈니스 로직과 뷰를 구분할 수 있다는 점은 유지되었다.

## 🥊 컴포넌트 구조와 고민

`React`와 같은 컴포넌트 기반 프레임워크(라이브러리)의 특징은 잘 설계된 컴포넌트라면 재활용이 용이하다는 점이다. 반복되는 구조나, 스타일을 사용하는 컴포넌트 뿐만 아니라, 다른 프로젝트에서도 충분히 사용할 수 있는 경우가 있다.

따라서, `React`에서는 컴포넌트 상속보단 **조합**이나 **합성**을 추천하고 있고, 최대한 작은 단위의 컴포넌트를 구성하는것이 좋다고 한다.

하지만, 컴포넌트를 구성하다보면 재활용성을 위해 어느정도 수준으로 컴포넌트를 잘게 나눠야 하는지 고민을 하는 경우가 많다.

> 심지어 낱개의 `div` 수준으로도 나눠야 하나 고민한적도 있다.

사실 생각해보면 모든 컴포넌트가 재활용할 수 있다는것은 조금 무리가 있지 않나 생각이 든다. 그러한 점을 막기 위해 최상위 컴포넌트에서 최대한 조합을 사용하게 된다면 부피가 어마어마하게 커져서 처음 코드를 보았을 때 부담스럽지 않을까? 라는 이유 때문

이를 보았을 때, 작은 단위의 컴포넌트들이 모여 서로 다른 구조를 형성하는 경우, 재활용은 사실상 불가능하지 않을까..?

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/1.png" alt="1">
</div>

`components` 디렉토리에 여러가지 컴포넌트들이 저장되어 있지만, 저중에는 재활용성을 고려한 컴포넌트와 그렇지 않고 구조를 잡고있는 컴포넌트가 함께 존재한다.

> 이러할 때에, 그 둘을 어떻게 구분해주는게 좋을까? 라는 고민도 하게되었다.

## ⚛️ Atomic design

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/atomic-design.png" alt="atomic-design">
</div>

기존 프로젝트를 생성하는 방식과는 조금 다르게 `Atomic pattern`은 최 하위 컴포넌트에서 상위컴포넌트로 이동하며 프로젝트를 만든다고 한다.

총 5가지의 컴포넌트 수준이 존재한다.

### 🍎 Atoms - 원자

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/atoms.jpg" alt="atoms">
</div>

- `Atomic pattern`에서 가장 작은 단위의 컴포넌트이다.
- `img`, `input`, `button`, `label`과 같은 `HTML`태그들이 대부분이다.
- 어떠한 속성값을 받아오더라도, 컴포넌트가 생성되어야 한다.
- `color`, `font`과 같은 스타일은 갖고있을 수 있지만, `margin`, `position`등 구조에 방해가 될 수 있는 위치를 지정하는 스타일은 가질 수 없다.
- 자기 자신만으로는 아직 아무것도 할 수 없는 단위이다.

### 🍊 Molecules - 분자

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/molecule.jpg" alt="molecule">
</div>

- 여러개의 원자가 섞여있는 단위이다.
- 자기 자신만으로 무언가를 할 수 있게되는 최소단위이다.
- 분자만의 속성을 가질 수 있으며, 자신의 원자에 위치값을 지정해줄 수 있다.
- 비즈니스 로직이 아닌, 단순 UI를 그리는 로직을 갖고 있을 수 있다.

### 🍌 Organisms - 유기체

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/organism.jpg" alt="organism">
</div>

- 원자나 분자가 조합된 단위이다.
- 어느정도 생성하고자 하는 컴포넌트의 모습을 갖춘 상태이다.
- 원자나 분자의 위치값을 조정할 수 있다.

### 🍇 Templates - 템플릿

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/template.jpg" alt="template">
</div>

- `page`에서 전달받는 유기체 이하의 컴포넌트들이 자리잡게될 구조를 정하는 단위이다.
- `color`와 같은 스타일이 아닌, 위치를 지정해주는 구조를 잡아주는 스타일만 존재한다.

### 🍓 Pages - 페이지

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/06/page.jpg" alt="page">
</div>

- 비즈니스로직이 관리되는 컴포넌트이다.
- 구조가 잡힌 템플릿에 유기체 이하의 `UI`를 형성하는 컴포넌트를 부여, 조합·합성 하는 단위이다.
- 원자, 분자, 유기체등에서 필요한 상태값(비즈니스로직)들은 모두 해당 단위에서 속성으로 전달된다.

### 🎓 전반적인 느낌

- 유기체 이하의 컴포넌트에서는 여러 속성을 받을 수 있기 때문에, `Typescript`와 같은 정적 언어로 가능한 속성들만 지정해주는게 좋아보인다.
- 자기 자신의 구조를 결정하는 스타일은 무조건 상위에서 형성되는 느낌이다.
  > 그외의 색상, 폰트 등의 스타일은 상관없음
- 좀더 상위의 단위로 갈 수록 재사용성은 비교적 떨어지는느낌이다.
- 최소단위인 원자가 아닌 경우, `UI`를 위한 로직은 갖고 있을수 있는것 같다.
- 템플릿에서는 필요한 속성값을 할당받은 여러 단위의 컴포넌트들을 페이지에게서 받아, 구조에 넣는 역할을 하는것 같다.
- `Naver Line`에서 `Atomic Design`을 사용한 컨퍼런스를 영상으로 보았는데, 필요에 따라서는 비슷한 역할을 하는 단위를 합쳐서 사용하기도 하는것 같다.

### 📚 자매품 StoryBook

`UI`를 구성하는 컴포넌트를 좀 더 효율적으로 관리할 수 있도록 도와주는 오픈소스도구라고한다.

간단하게 사용을 해보았는데, 해당 컴포넌트를 프로젝트에서 실행시키지 않고, 별도의 화면에서 확인할 수 있었다.

아무래도 최소단위 컴포넌트를 각각 관리하기 때문에, 해당 도구를 같이사용하는경우가 많다고 한다.

## 참고

- [리액트 어플리케이션 구조 - 아토믹 디자인](https://ui.toast.com/weekly-pick/ko_20200213)
- [리액트와 아토믹 디자인 패턴](https://tech.madup.com/atomic-design/)
- [bradfrost-Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/#atoms)
- [(우아한테크캠프 3기) Atomic Design Pattern이 뭐지?](https://zoomkoding.github.io/%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4/%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84/2020/07/09/atomic-design-pattern.html)
- [아토믹디자인 for React](https://medium.com/@inthewalter/atomic-design-for-react-514660f93ba)
- [StoryBook](https://storybook.js.org/)
