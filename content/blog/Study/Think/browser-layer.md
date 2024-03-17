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

## 특이점.

한가지 특이한점이 있었는데, 기존 디자인과 동일하게 하기 위해 레이어로 띄워진 요소에 border-radius 속성을 부여하면 다시 문제가 발생하는점이 있었다.

> 왜..?

아래와 같은 ui를 구성하고 safari의 레이어페널을 확인해보았다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/testui.png?raw=true" alt="testui">
</div>

위 사진속 각각의 요소들은 모두 별도의 레이어를 들고있도록 되어있다.

> 위 해결처럼 animation을 준 것은 아니고, `transform: translate3d(0, 0, 0)` 해당 속성을 부여하여 레이어가 생성되도록 브라우저에게 전달해둔 상태

요기서 둥글기가 적용된 파란요소와, word라는 텍스트가 포함된 요소의 레이어들만 다른 레이어들과의 차이가 있는데

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/memory.png?raw=true" alt="memory">
</div>

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/no-memory.png?raw=true" alt="no-memory">
</div>

문제가 발생하는 레이어들은 모두 메모리가 존재했고, 문제가 없는 레이어들은 메모리가 0이였다.

요 메모리에 영향을 주는 부분으로 의심이되는 경우가 있었는데, 사실 지금까지 찾은것들 중에서는 유일한 차이이긴 하다.

타임라인패널에서 일반 색상만 부여된 요소, border-radius나 텍스트가 함께 있는 요소들을 집중적으로 보았다.

### 색상만 있는 경우

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/paintall.png?raw=true" alt="paintall">
</div>

### + border-radius

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/paintround.png?raw=true" alt="paintround">
</div>

### + text

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2024/02/22/painttext.png?raw=true" alt="painttext">
</div>

색상만 있는 요소들은 해당 영역을 함께 잡아 한번의 페인트가 존재하고.

border-radius나 text같이 화면에 보여지는 부분에 변경이 있는 부분들은 각각의 요소들에 한번의 페인트가 더 발생했다.

이 차이로만 보면, 각 요소에 발생한 페인트 횟수마다 레이어에도 메모리가 늘어나는것 같기도 하다..

> 크기, 위치와 같은 기하학적 요소는 layout에서 구성이 되기 때문에 paint에서는 제외되는게 아닐까 싶기도..?

## 메모리가 없는 레이어를 구성하자

결과적으로 메모리가 존재하지 않는 레이어를 구성하는것이 이 문제를 해결하는 핵심이라고 생각이 들었다.

1. 이미지들을 감싼 상위요소를 레이어로 띄울것인데 (이미지태그는 무조건 메모리가 있음), 이미지가 보이지 않을 경우에만 opacity animation 속성을 주어 브라우저가 레이어로 구성하도록 해보자
2. 상위요소의 레이어가 자식으로 갖고있는 이미지태그에 대한 메모리를 가지지 않도록 이미지가 보이지 않다가 보일 때, opacity 조절을 통해 보이게 될 때 자연스럽게 보여지도록 해주자
3. 기존 디자인대로 opacity animation이 있는 레이어가 Rounded 속성을 가져야 하는데, 위의 이유로 메모리가 늘어나면 안되니 rounded가 필요한 경우 상위요소에서 isolate, rounded, overflow-hidden으로 상위요소에서 하위요소의 레이어에 영향을 줄 수 있도록 함.
   > isolate 속성만으로 요소가 레이어로 생성되지는 않고, 부모가 해당속성을 갖고있고 하위의 레이어 요소를 overflow-hidden 같이 보여지는 부분을 자르는 영향을 줄 때 레이어로 구성되는듯 함.

3번의 이슈는 webkit 버그로 꽤 유명한것 같았다..

- [stackoverflow](https://stackoverflow.com/questions/49066011/overflow-hidden-with-border-radius-not-working-on-safari)
- [webkit issue](https://bugs.webkit.org/show_bug.cgi?id=68196)
