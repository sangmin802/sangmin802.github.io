---
title: 'View transition을 적용하며 겪은 이슈(?)'
date: 2025-04-11 18:00:00
category: 'Study'
draft: false
tag: 'Think'
---

## view transition

- [View Transition](https://developer.chrome.com/docs/web-platform/view-transitions/same-document?hl=ko)

spa에서 path가 변경되어 페이지가 전환될 경우, 단조롭지않게 애니메이션을 부여하기 위해서 script로 많은 코드를 작성해야했지만, 고맙게도 document api가 제공되고있다.

어떻게 사용하는지가 아닌.. 적용하면서 알게된것들? 추측하게된것들이 있어 정리해보고자 한다.

> 되돌아보니 모두 레이어와 관련되긴 했네..

### 쌓임스택 뭔가 다른데...?

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/view-transition.gif" alt="view-transition">
</div>

일단 많이 간소화되긴 하였지만.. 위처럼 path가 변경될 때, 같이 바뀔 content영역에만 애니메이션을 부여하고, gnb, lnb, footer는 이 애니메이션의 영향을 받지 않도록 처리를 해둔 상태이다.

```js
.content {
  // 애니메이션 적용되어있음
	view-transition-name: content;
}

// 나머지는 영향을 주지도, 받지도 않도록 그냥 껍데기
.gnb {
	view-transition-name: gnb;
}
.lnb {
	view-transition-name: lnb;
}
.footer {
	view-transition-name: footer;
}
```

각 요소들은 내부에 써져있는대로 position, z-index가 부여된 상태이다.

이 상태에서, content에 position: fixed인 요소를 하나 띄워보았다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/footer-up.png?raw=true" alt="footer-up">
</div>
뭐지..?

content, footer는 모두 position: static한 값으로 쌓임스택에는 관련이 없었다. 따라서 생성된 fixed 요소가 999의 z-index를 가지고있어서 footer보다 높은 위치에 보여질것이라고 생각했으나 달랐다..

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/fixed-up.png?raw=true" alt="fixed-up">
</div>
기가막히게 footer에 view-transition-name 이 스타일속성을 제거해주면 기대했던대로 보여진다.

위 두가지의 조건에서 요소들이 어떤식으로 레이어가 쌓여있는지 확인해보기로 했다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/fixed-up-layer.png?raw=true" alt="fixed-up-layer">
</div>

> footer에 view-transition-name 속성이 적용되지 않았을 때

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/footer-up-layer.png?raw=true" alt="footer-up-layer">
</div>

> footer에 view-transition-name 속성이 적용되어있을 때

view-transition-name 속성이 적용되었을 경우, 마치 position: static이 아닌 다른 값이 부여된것 마냥 기본 상태와 다르게 레이어를 띄워높고있었다.

> 내가 문서상 어떤 부분을 놓친건가.. 이런내용은 못봤던것 같은데..

content영역에 z-index값을 1만 주더라도 자식위치에 있는 저 fixed 요소가 더 높은 쌓임스택을 갖게되면서 문제가 해결되긴 하나, 저 방식을 써야했던 이유가 모달이였기 때문에 그냥 app에서 독립적일 수 있도록 외부 root로 빼주기로 했다.

### 전환 시 화면이 잠깐 깜빡이는데..?

페이지 전환 시 컨펌이나 외부 root의 ui가 보여지고 전환이 되는 경우가 있다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/navigate-ui-error.gif" alt="navigate-ui-error">
</div>

영상을 보면 아주 잠깐 화면 전환 시, view-transition-name 속성을 가지고있는 요소들이 그렇지 않은 요소인 dimmed영역 위에 보여지면서 깜빡이는 느낌을 준다.

이 전환을 개발자도구로 천천히 진행시키며 그 지점을 딱 찍어보면

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/navigate-ui-error-capture.png?raw=true" alt="navigate-ui-error-capture">
</div>

얘는 이 api의 특징임이기에 어렵지 않게 확인할 수 있었는데

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/navigate-ui-error-element.png?raw=true" alt="navigate-ui-error-element">
</div>

전환이 발생했을 때, view-transition-name 속성을 가지고있는 요소들을 캡쳐하여 이전과 이후 사진(사진 이라고해야하나..?)을 가지고 애니메이션을 보여주는 과정에서

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2025/04/11/navigate-ui-error-layer.png?raw=true" alt="navigate-ui-error-layer">
</div>

이렇게 위의 group, image-pair, old, new 모두 레이어가 잠시 활성화되는것을 볼 수 있다.
레이어 위치를 보면 gnb, footer, content, lnb 모두 있는걸 볼 수 있다.

저기 잘 보면 이 레이어들 아래에 dimmed 컨펌이 껴있음..

잘은 모르겠으나.. 이 순서를 계산하는것은 지나치게 큰 비용이 든다는것 같다..

외부 root를 가지고 ui를 구성하는것들도 하나의 root로 묶고 위 스타일을 주어 동일한 조건을 가지도록 변경해주었다..

단순하게 생각했으나, 예상하지 못한것들이 꽤나 많았던..
