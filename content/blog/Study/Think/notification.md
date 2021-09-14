---
title: '🔔 Notifiaction으로 사용자에게 알림 전달'
date: 2021-09-14 17:00:00
category: 'Study'
draft: false
tag: 'Think'
---

진행했던 개인 프로젝트인 `Loa-Hands`, `Web Chat`모두 웹 앱에서 어떠한 반응이 생기고 변경되는 정보를 사용자가 습득하는것이 주 이다.

대부분의 앱들도 마찬가지겠지만, 웹 앱을 활성화 시켜놓고 계속 그 화면만 보는 사용자들은 없다.

다른 활동을 한다거나, 잠시 자리를 비운다거나.

그래서 `Loa-Hands`에서 타이머로 계산되고있는 컨텐츠들이 특정 시간에 도달했다거나 `Web Chat`에 새로운 메시지가 전달된다면 다른화면을 보고있는 사용자에게 알림을 전달할 수 없을까? 라는 고민을 하였다.

사실 다이얼로그같은 컴포넌트가 생성된다고 하더라도, 활성화되어있는 브라우저가 다르다면 확인할 수 없기 때문에 앱 내부에서의 기능으로는 한계가 있었다.

즉, 브라우저에서 제공하는 `Web API`에서 알아볼 필요가 있었다.

## Notification

당연히 `Web API`이다. 대부분의 브라우저들에서 제공되는 기능이고, `chrome`에서는 스타일링 된 기능도 모듈처럼 제공하는것 같았다.

`Notification` 생성자를 통해 인터페이스를 생성할 수 있다.

### 권한

사용자의 브라우저를 조작하는 `API`이기 때문에, 사용자의 권한이 먼저 필요하다.

```js
this.requestPermission = async () => {
  const permission = await Notification.requestPermission(res => res)

  if (permission === 'granted')
    return new Notification('알림이 허용되었습니다.')
}
```

`Notification.requestPermission`메소드를 통해 사용자에게 권한을 요청하는 알림이 간다.

> `prompt`와 유사함

1. `granted` 권한 승인
2. `dennied` 권한 미승인
3. `default` 권한을 요청할 수 있는 상태

2번의 `dennied`상태는 권한을 요청할 수 조차 없다.
따라서, 만약 사용자의 브라우저에서 모든 웹 앱에서의 요청을 `dennied`한 상태라면, 사용자가 권한을 `default`상태로 변경하여야만 요청이 전달되는것 같았다.

> 기본적으로 `https`, 인증서로 인증된 사이트 에서는 자물쇠를 클릭하여 상태를 선택할 수 있다.

비동기로 작동이 되기 때문에, 사용자의 선택을 담고있는 `promise`객체를 반환한다.

`.then`으로 응답 데이터를 받아서 처리하도록 공문에는 나와있지만,
비교적 최신 방식인`async await`으로 해도 작동은 되더라.

### 권한 상태 확인

현재 사용자에게 알림을 전달할 수 있는 권한이 어떤 상태인지 확인해볼 필요가 있을 것이다.

```js
this.checkPermission = () => {
  const permission = Notification.permission
  if (permission === 'granted') return true
  if (permission === 'default') return false
  if (permission === 'denied') return false
}
```

`Notification.permission`으로 권한을 확인해 볼 수 있으며, 해당 속성은 오로지 읽기전용이기 때문에, 값 할당과같은 방식으로는 값을 변경할 수 없다.

> 사용자의 권한 영역이기 때문에, 당연하다고 본다.

### 알림 전달

만약 권한이 승인되었다면, 아래와 같은 방법으로 알림을 전달할 수 있다.

```js
new Notification('제목', { body: '내용' })
```

첫번째로는 타이틀, 두번째로는 옵션객체를 전달할 수 있는데, 옵션 객체에는 `세부 내용`, `이미지`등을 추가할 수 있었다.

### Loa-Hands 사용

현재, `Loa-Hands`에서는 아래와 같은 하나의 이벤트 생성자로 관리해서 사용해보았다.

앱 특성상, 동일한 시간에 여러 알림이 전달될 수 있기 때문에, 그러한 상황이라면 각각의 알림들을 `que`배열에 저장해 두었다가, 특정 시간 이내에 새로운 요청이 없다면 일괄 처리해주는 방식을 사용하였다.

```js
export function NotificationHandler(createNotification) {
  let notificationWorks = []
  let timeout = null

  this.requestPermission = async () => {
    const permission = await Notification.requestPermission(res => res)

    if (permission === 'granted')
      return new Notification('알림이 허용되었습니다.')
  }

  this.checkPermission = () => {
    const permission = Notification.permission
    if (permission === 'granted') return true
    if (permission === 'default') return false
    if (permission === 'denied') return false
  }

  this.removeTimeout = () => clearTimeout(timeout)

  this.activeNotification = data => {
    // 권한 승인상태가 아니면 종료
    if (!this.checkPermission()) return

    this.removeTimeout()
    notificationWorks.push(data)

    timeout = setTimeout(() => {
      const { title, option } = createNotification(notificationWorks)
      notificationWorks = []
    }, 300)
  }
}
```

또한 전달하게 될 알림에 대한 `data`들을 계산하는 방식은 모두 다를 수 있기 때문에, 함수를 생성하기 전 전달해주도록 하였다.

> `React`의 특성상 메모이제이션 되어있기 때문에, 절대로 `notification`은 재생성되지 않는다.

```js
const notification = useMemo(
  () => new NotificationHandler(계산 함수),
  [createNotification]
)
```

### 테스트

잘 작동되는지 확인해보자

<div style="text-align : center">
  <img src="/img/2021/09/14/1.PNG?raw=true" alt="1">
</div>

사용자에게 먼저 권한을 요청하는 알림이 간다.

> 단, 사용자의 권한 상태가 `dennied`라면 요청이 전달되지 않는다.

<div style="text-align : center">
  <img src="/img/2021/09/14/2.PNG?raw=true" alt="2">
</div>

요청을 승인하고, 요청을 승인했다는 첫 알림이 전달된 모습이다.

<div style="text-align : center">
  <img src="/img/2021/09/14/3.PNG?raw=true" alt="3">
</div>

타이머가 적용된 컨텐츠의 특정 시간에 도달하자, 여러 요청들을 하나로 병합하여 알림을 전달한 모습이다.

### 고민

위의 상황에서는 여러 요청을 하나로 병합해주기 위해 `0.3`초라는 시간 뒤에 알림이 전달되도록 하였다.

만약, `Web Chat`처럼 실시간이 중요하고, 모든 요청들이 각각전달되어야 한다면?

> 카카오톡처럼

```js
알림.close.bind(알림)
```

기본적으로 전달된 알림은 브라우저에서 기본적으로 설정한 시간 이후에 자동으로 사라진다.

만약, 요청이 중첩되어있다면 사라진 다음에 다음 요청이 알림으로 생성된다.

위의 `close`메소드를 사용하여 생성된 알림을 즉시 사라지도록 할 수 있는데, 이 방법을 사용하여 이전 알림을 하나의 변수에 캐싱해두고, 새로운 요청이 들어올 때 이전 알림을 `close`해주는 방식으로 처리해주면 될 것 같다.

비교적 최근에는 브라우저가 활성화 되어있지 않더라도, 알림을 전달해 줄 수 있는 `Web Push API`가 생겼다고 한다.

> 마치 모바일의 알림처럼

하지만, 해당 `API`는 `IOS`의 기본 브라우저인 `Safari`에서는 제공하지 않겠다고 선을 그은 `API`라고 한다.

브라우저에서 `native`에서만 구현할 수 있는 방법들이 계속 생겨나게 되면 `native`개발자들의 입지가 줄어들지 않을까..? 라는 점

아.. 충분히 이해가 가는 문제이다.
