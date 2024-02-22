---
title: 'iOS Safari Layer'
date: 2024-02-22
category: 'Study'
draft: false
tag: 'Think'
---

작업 도중, 꽤 흥미로웠던 고민을 하게 되었고, 추후에 비슷한 문제가 생겼을 때, 이 방법으로도 접근해보고자 기록한다.

내용자체가 많지도 않고, 디테일하게 기록할 수 없는 내용이라(회사 내 작업) 한줄노트로 기록하고자 했지만.. 앞으로도 이런 방향으로 고민해야할 경우가 많을것 같아 빠르게 검색될 수 있도록 일반 포스트로 남기기로 했다.

## 발단

네이티브 앱 내부, 탭과같은 네티이브 앱 일부가 살아있으면서 이미지, 텍스트 등(일종의 상품카드로 보면 될듯..?)으로 구성된 리스트가 웹뷰로 제공되는곳이 있는데 아래와 같은 문제가 있었다.

1. 안드로이드 문제 없음
2. iOS의 경우, 빠르게 위 혹은 아래로 스크롤 시 흰 화면이 종종 노출됨

> 웹 safari 는 덜한데, 웹뷰 iOS safari에서는 눈에 보일정도임..

상황을 따져보기로 했다.

## 접근

1. safari의 버전문제로 특정 기능을 사용할 수 없다면, 처음부터 뻑갔을 것
2. 안드로이드는 발생하지 않음
3. **빠르게** 스크롤 시, 잠시 흰 화면이 노출되고 이후에 화면을 잘 그림

safari 웹뷰에서 빠르게 스크롤 시 화면을 잘 못그리는것으로 초점을 잡게 되었다.

예~ 전에 블로그에 올렸던 글 중, chrome 기반의 브라우저에서 렌더링하는 과정을 다뤘었는데 그것 기준으로 생각을 해보게 되었다.

- [브라우저 시각화 단계](https://sangmin802.github.io/Study/Think/browser-operation/)

chrome 기준으로 생각해보면 브라우저에서 메인스레드가 아닌 별도의 컴포지터스레드로 레이어를 분리, 관리하고, 스크롤 할 때마다 합성해주는것으로 알고있다.

> 근데 이거 이번에 chrome에서 레이어 패널 확인해봤는데, 저 속성없이도 잘 구분해주고 있더라.. 그래서 안드로이드에서는 문제없었던거 아닐까

safari 에서는 위처럼 되어있지 않다면 많은 이미지, 텍스트들을 재구성하는데 어려움이 있을 수 도 있을것 같았다.

친절하게도 개발자도구의 레이어패널에서, 어떻게 레이어가 생성되어있는지 확인할 수 있는데,

- chrome
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/chrome_before_layer.png?raw=true" alt="chrom_before_layer">
</div>

- safari
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/safari_before_layer.png?raw=true" alt="safari_before_layer">
</div>

각 상품별 이미지, 문구들이 각각의 레이어로 따로 구성되어있고, 합성되어 하나의 화면을 구성하는것을 보인다.

두개의 브라우저가 눈에띄게 다른데, 각 이미지, 텍스트들을 별도의 레이어로 생성하고 관리하는 chrome과 다르게, safari는 통으로 하나만 관리하는것으로 보였다.

> 두개의 브라우저가 레이어를 생성하는 기준이 다를 수도..

chrome developers를 보면, 브라우저에서 내부 기준으로 분리하는 레이어 외, 개발을 하면서 레이어로 분리될 요소를 지정해줄 수 있는데, opacity, transform과 같은 스타일 속성을 부어햐여 애니메이션을 통해 변경될 수 있는 요소임을 알려주거나, `will-change` 스타일 속성을 주어서 알려줄 수 있다.

> 다만, will-change 속성은 브라우저에 내부에서 판단하는 기준외에 강하게 명령하는것이기 때문에, 권장하는것 같지는 않음

> [최후의 수단 will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

## 혹시 safari도 동일 기준이라면..

safari 브라우저도 별도의 레이어로 구분해줄 수 있는 기준이 chrome과 동일하다면, 내가 직접 명령해줄 수 있지 않을까로 접근을 해보았고, 화면에 보이지 않는 이미지인 경우 skeleton ui 와 유사하게 opacity가 조절되는 ui가 남도록 스타일을 추가하였다.

결과는?

- chrome
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/chrome_after_layer.png?raw=true" alt="chrom_after_layer">
</div>

- safari
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/safari_after_layer.png?raw=true" alt="safari_after_layer">
</div>

기존 레이어를 잘 분리하던 chrome은 이미지쪽에 하나의 레이어가 더 생성되었고, safari는 이전에 없던 이미지 레이어들이 별도로 관리되는것을 볼 수 있었다.

배포된 ios safari 웹뷰 환경에서도, 이전과 같이 빠르게 스크롤할 때에도 흰 화면에 아닌 별도로 관리되고있는 레이어들인 skeleton ui 와 유사하게 opacity가 조절되는 ui가 남아있었다.

결괄물과 소스코드를 같이 올리고 싶지만.. 회사에서 관리하고 제공하는 코드, 화면을 함부로 보여주기가 ㅎㅎ..
