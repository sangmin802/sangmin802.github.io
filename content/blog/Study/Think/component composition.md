---
title: 'Component Composition'
date: 2021-04-26 16:26:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`, `Vue` 등 최신의 `Javascript FrameWork` 들은 대부분 컴포넌트 기반으로 설계되고 있다.

이러한 컴포넌트들은 외부의 영향을 받지않아서 재활용성이 뛰어난 특징을 갖고있어야 좋은 컴포넌트라 할 수 있다.

또한, 속성만을 갖는 컴포넌트더라도 필수적인 속성들이 아닌, 내부에서 별다른 로직들을 한번 더 수행해야 해서 잡다한 속성들이 전달되는 컴포넌트라면 재활용은 할 수 있겠지만, 자유로운 컴포넌트라 보기는 어려운 것 같다.

이러한 컴포넌트의 순수함, 자유로움, 재활용성을 위해 `React` 에서는 아예 대놓고 컴포넌트 `조합·합성`을 사용하는것이 좋은 방법이라 설명하고 있다.

### Component 조합·합성

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/26/1.PNG?raw=true" alt="git1">
</div>

본래 왼족처럼 하나의 컴포넌트가 있고, 내부에서 또 다른 컴포넌트로 무수히 많은 속성들이 전달되는 컴포넌트였다.

하지만, 오른족처럼 다른 작은 컴포넌트들을 모무 `children` 속성으로 보내주는 `조합·합성` 방식으로 변경하였다.

이렇게 눈으로만 보면, 오히려 더 복잡해지고 부피가 커진것처럼 보인다.

하지만, 이런 방식을 사용한다면

```javascript
<CharacteristicWrap data={[basic, battle, engrave]} />
```

이와 같은 최 하위 컴포넌트에 필요한 데이터를 여러번 속성전달을 거칠 필요 없이, 최상위 컴포넌트에서 바로 지정해줄 수 있다.

즉, 각각의 작은 컴포넌트들이 불필요한 속성을 가질 필요 없이, 필수적인 속성만 받을 수 있다는 점이다.

### React.Children

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/26/4.PNG?raw=true" alt="git4">
</div>

`조합·합성` 방식으로 변경한 컴포넌트이다. 이전이였다면 색 선으로 구분된 대로 각각의 컴포넌트가 존재하여 `map` 순회를 통해 부여된 `index`로 `isShow`기능을 구현했었다. 하지만, 해당 방식으로 변경되면서 동적인 `index`를 사용할 수 없게 되었다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/26/2.PNG?raw=true" alt="git2">
</div>

이런 경우, `Children` 인터페이스 내부에 있는 `map` 메소드로 `children` 속성의 최상위 자식들에 한해서 `map` 메소드를 수행할 수 있다. 따라서, 동적인 `index` 속성을 통한 구현도 가능해진다.

> 하나의 기존 컴포넌트에 속성을 추가하는 경우 이후 소개되는 `React.cloneElement`가 더 적절해 보인다.

### React.cloneElement

`Vue`의 `isShow` 처럼 따라 다른 스타일을 적용시키는 상황이 필요해서 `index`와 같은 동적인 속성을 사용해야하는 경우가 있다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/26/3.PNG?raw=true" alt="git3">
</div>

위의 예시처럼 다른 속성들이 부여된 상태로 생성된 컴포넌트에 추가적인 속성을 합쳐서 새로운 컴포넌트로 만드는 메소드가 존재하니 필요에 따라 잘 사용하면 될 것 같다.

### 고민

`조합·합성` 형식의 컴포넌트 구조를 통해, 각각의 하위 컴포넌트들은 좀 더 자유로운 상태가 되었지만, 최상위 컴포넌트의 경우 각각의 로직수행과 `조합·합성` 으로 짜여져 부피가 매우 커지게된다.

요즘 이런 문제에 대한 고민을 하고 있다..
