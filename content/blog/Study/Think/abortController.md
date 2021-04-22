---
title: 'AbortController'
date: 2021-04-21 15:47:00
category: 'Study'
draft: false
tag: 'Think'
---

`throttling`이나 `debouncing`과 같이 이벤트 등이 무수히 중첩되는것으 방지하여 성능을 개선하는 기능들이 있다.

하지만, 이러한 것들은 사실 `fetch`와 같은 `api`들이 실행되는것 자체를 막는 개념인것 같다.

사실 위의 두 개념이 아니더라도, 별도의 로딩 레이아웃등을 통하여 사용자가 이벤트 자체를 실행시키지 못하도록 할 수도 있긴하다.

하지만, `fetch api`가 이미 진행된 상태라면 어떻게 중첩되는것을 막을 수 있을까 라는 고민을 하게 되었다.

`Redux Saga`를 사용한다면 `takeLatest api`를 통해 이전의 요청은 무시하고 가장 최근의 요청만 수행할 수 있도록 설정할 수 있다.

## AbortController

자바스크립트에서 기본적으로 제공하는 생성자이다. 해당 생성자를 통해 만들어지는 인터페이스를 활용하여 `request`의 옵션에 생성된 `signal` 인터페이스를 전달하게 된다면, `abort` 메소드로 `signal` 인터페이스를 갖고 있는 `fetch api`는 종료시킬 수 있는 기능을 갖고 있는것 같다.

> 자세한 내용은 MDN 참조

## 예제

```html
<button class="fetch">Fetch</button>
```

`fetch`를 실행시키는 버튼이 있음

```ts
const $fetch = document.querySelector('.fetch')

let controller = null
let signal = null

$fetch.addEventListener('click', () => {
  controller?.abort()
  controller = new AbortController()
  signal = controller.signal
  fetch('주소는 비공개', {
    signal,
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
    .catch(e => {
      console.log(e.message)
    })
})
```

`fetch api`가 실행이 되면, 이전의 `fetch`는 중단시키도록 함. 초기에는 저장된 인터페이스가 존재하지 않아, 아무런 변화가 없다.

중단 시킨 다음, 새로운 `AbortController` 인터페이스를 생성하고, 기억하도록 저장을 해 놓은 다음, `request` 옵션값으로 전달을 함.

> 이를 `A` 라고 하겠음

만약, `A`가 완료되기 전 다시 한번 클릭된다면, 저장되었던 인터페이스를 통해 `A`를 중단시키고 새로운 인터페이스를통해 `B`를 실행시킴

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/04/22/1.PNG?raw=true" alt="abortcontroller">
</div>

두번 빠르게 클릭했을 때, 처음에는 `catch` 구문에서 `abort` 되었다는 에러를 확인할 수 있고, 두번째는 정상적으로 진행됨을 알 수 있다.

> `json`이 아니라 `text`로 받아야하는 주소였기 때문에, 위처럼 나온것임 원래는 잘 나옴

기존의 방법으로 사용자의 이벤트를 사전에 막아서 성능상에 문제가 발생하는것을 막을 수 있지만, 이런 방법도 있음을 알 수 있었다.

## 참고

- [AbortController - MDN](https://developer.mozilla.org/ko/docs/Web/API/AbortController)
