---
title: 'IntersectionObserver'
date: 2021-03-11 15:46:00
category: 'Study'
draft: false
tag: 'Think'
---

## IntersectionObserver

프론트엔드 개발을 해오다보면 사용자의 스크롤에 따라 특정 조건을 감지해야하는 경우들이 정말 많다.

- 컨텐츠의 최 하위 높이에 도달했을 경우 콜백 실행
  > 대표적으로 `infinite scroll`
- 특정 높이에 되었을 때, 해당 컨텐츠에 속성 부여
  > `dataSet`에 값을 갖고 있다가 조건이 되는 높이가 되었을 시, `src`속성 부여하는 `lazy loading`

위와 같은 경우, 대부분 수동으로 높이를 구해서 작업을 하였는데, 스크롤 이벤트 이후 실행되는 콜백메소드의 경우는 `throttling`방식으로 끊어줄 수 있지만, 해당 이벤트 자체는 계속 감지되는지라 불필요한 소요가 존재하기도 했다.

그러던 중 해당 `API`를 발견하였다.

`MDN`의 말을 내 느낌대로 줄여본다면, `target`이 되는 엘리먼트의 경계를 넘나들 때, 콜백함수가 실행되는것 같다.

## 예시

```js
// dom
  <div class="div1 div"></div>
  <div class="div2 div"></div>

// script
  const options = {
    root: null
    rootMargin: "0px 0px 80px 0px",
    threshold: 0,
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        // 모습을 드러냈으니, 원하는 로직 실행
        console.log(entry.target, "활성화");
      } else {
        // 모습을 감춘상태
        console.log(entry.target, "비활성화");
      }
    });
  }, options);

  const els = document.querySelectorAll(".div");
  els.forEach(el => io.observe(el));
```

해당 생성자에 있어서 첫번째 인자로는 콜백함수, 두번째 인자로는 옵션을 보내줄 수 있다.

옵션의 속성으로는

1. `root` : 지정해 주지 않으면 기본값으로, 감지를 할 범위를 의미하는것 같다. 기본값은 `window` 전체인듯 하다.
2. `rootMargin` : `css`의 `margin`과 같은 구조로, 감지를 하는 `target`요소 + `margin`값에 도달할 때, 콜백함수를 실행시킨다.
3. `threshold` : 0~1사이의 값으로 보여지는 %를 의미한다고하는데, 사실상 대부분 보여지자마자 실행시키도록 하니깐 0으로 두면 될듯..?

콜백함수의 첫번째 변수에는 `target`이 하나의 요소든 여러개의 요소든 배열의 구조인것 같다. 따라서, `forEach`와 같은 순회 메소드로 관리하는것이 좋아보인다.

크게 신경쓸 속성으로는 `target`과, `intersectionRatio`가 있는것같다.

1. `target` : 해당 `API`에 영향을 받는 요소들
2. `intersectionRatio` : 해당 요소가 감지?되기위한 기준 으로 0보다 클경우 해당 요소가 조건에 해당되고, 0이면 해당되지 않는다.

## 예시 Infinite scroll

`oberver` 요소가 `target`이 되고, 해당 요소가 화면에 보일때 새로운 `div`를 추가해주는 방식이다.

`unobserve` 메소드를 통해, 첫번째 인자로 요소를 받으며, 요소에 대한 감지를 제거할 수 있다.

`disconnect` 메소드는 `unobserve`랑 비슷한 것 같은데, 아무런 요소도 받지 않는것 보아 전부를 해제하는 느낌이다.

```js
// dom
    <div class="divWrap">
      <div class="div1 div"></div>
    </div>
    <div class="observer"></div>

// script
    let options = {
      rootMargin: "0px 0px 0px 0px",
      threshold: 0,
    };
    const divWrap = document.querySelector(".divWrap");
    const callback = entries => {
      entries.forEach((entry, index) => {
        if (entry.intersectionRatio > 0) {
          divWrap.innerHTML += `<div class="div${index + 2} div"></div>`;
        }
      });
    };
    let observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(".observer");
    observer.observe(target);

    // observer.unobserve(target);
    // observer.disconnect();
```

## 느낌

`scroll`이벤트의 경우 어쩔수없이 꾸준히 발생하고, 이후에 높이를 각각 계산하여야 했었는데, 모든것을 한번에 처리해주니 참 좋은듯 하다.

물론 `AJAX`통신에 있어서 `throttling`이나 `debouncing`은 여전히 해줘야하지만, 귀찮은점이 많이 줄은것은 사실인듯..?

게다가 이벤트 탈부착도 가능하니 오..
