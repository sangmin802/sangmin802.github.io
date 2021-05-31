---
title: '채팅 앱 프로젝트 후기 - 문제 발생과 해결과정'
date: 2021-05-31 13:28:00
category: 'Study'
draft: false
tag: 'Think'
---

얼마전, 일방적인 응답만 가능한 `Http`와 다르게 서버에서 능동적으로 클라이언트에게 응답할 수 있는 `WebSocket`을 알게되었었다.

그리고, `Node.js`기반으로 된 `socket.io`를 사용하여 채팅앱을 만들어보았다.

## 🍏 구성

### 로그인

- 로그인에 있어서는 저장되지 않기 때문에, 종료 시 모든 정보를 제거할 필요가 있었다
  > 추후 이 기능에서 발생했던 문제가 이 후기의 중점이다.

### 귓속말

- 보라색으로 표시
- 해당 글 혹은, 유저 클릭 시 귓속말 사용 가능
- 확인하지 않은 귓속말의 경우 유저 옆에 숫자로 카운팅 기능

### 전체채팅

- 방 입장시에는 전체채팅 이벤트 감지 off

### 채팅 방

- 해당 방에 `join` 된 `Socket instance` 만 메시지 발신 수신 가능
- 카카오톡과 유사한 방식
- 방 나가기 시 해당 방에대한 `leave`
- 로비로 이동 시, `join`된 상태 유지
- `join`된 상태로 로비에 위치해 있다면, 해당 채팅 방에 새로운 메시지가 입력 될 때 우측에 숫자로 카운팅 기능
- 퇴장 시 혼자있는 방이라면 해당 방 삭제

### 로그아웃

- `app` 컴포넌트 언마운트 시 모든 `socket` 이벤트 종료
- 다른 유저에게 종료 알림

자세한 기능 체크리스트는 해당 깃 리포지토리의 Readme에서 확인 가능하다.

- [Web-Chat Readme](https://github.com/sangmin802/web-chat)

아무래도 별도의 서버가 필요했기 때문에, `heroku`의 무료 서버를 사용했다.

## 🍎 문제 발생

전반적인 진행 과정에서는 큰 문제가 없었다.

하지만, 특정 유저가 종료하는 시점에 아래의 조건에 해당될 경우 예상하지 않은 에러가 발생했다.

1. 종료한 유저만 `join`되어있는 여러개의 방이 있는상태에서 방을 일괄 제거할 때.

서버에서 `disconnect` 바로 전에 실행되어 미들웨어와 비슷한 역할을 하는 `disconnecting` 에서 위 조건의 방들을 모두 지워주도록 하였다.

```ts
// 접속 종료 미들웨어
socket.on('disconnecting', reason => {
  const joinedRooms = [...socket.rooms]
  // 가입되어있는 방들에게 leaveRoom
  joinedRooms.forEach(roomID => {
    if (socket.userID === roomID) return
    leaveRoom(roomID)
  })
  socket.broadcast.emit('user disconnected', {
    userID: socket.userID,
    userName: socket.userName,
  })
  userStore.removeUser(socket.userID)
})

async function leaveRoom(roomID) {
  socket.leave(roomID)
  const usersID = [...(await webChat.in(roomID).allSockets())]
  const users = await usersID.map(id => {
    const { userName, userID } = userStore.findUser(id)
    return { userName, userID }
  })
  // 해당 방들에 퇴장 알림
  webChat
    .to(roomID)
    .emit('leave room', { users, userName: socket.userName, roomID })

  // 만약 혼자있는 방이라면 제거
  if (usersID.length === 0) return deleteRoom(roomID)
}

function deleteRoom(roomID) {
  roomStore.removeRoom(roomID)
  webChat.emit('delete room', roomID)
}
```

그 과정에서 이벤트가 여러번 중첩되면 클라이언트에서 해당 상태값이 반영되기 전에 빠르게 요청이 중첩되어 작업이 누락되는 경우가 있었다.

> 다른 유저들에게는 제거된 방이 존재하는 상태

서버에서 일괄 처리하고 제거된 상태값을 전달해주거나, 복수의 방일 경우 일괄 클라이언트에게 보내서 처리를 하는등

이 문제를 돌려서 해결하는 방법은 여러가지가 있었을 것이다.

하지만, 이렇게 실시간으로 커뮤니케이션 하는 과정에 있어서 위처럼 빠르게 작업이 중첩되는 상황은 언제든지 존재할 것 같다고 생각하여 현재 문제를 직접 해결해보고자 했다.

## 🍐 클로져를 활용한 작업 저장

```ts
// debounce class
export class Debounce {
  timer: any
  newState: any
  setState: any
  arr: any[] = []
  time: number = 0

  constructor(state: any, setState: Function, t: number) {
    this.newState = state
    this.setState = setState
    this.time = t
  }

  doWork() {
    this.arr.forEach(work => {
      work()
    })
    this.setState(this.newState)
  }

  debounceAct(work: any) {
    if (this.timer) {
      console.log('새로운 작업이 추가되었습니다.')
      clearTimeout(this.timer)
    }
    this.arr.push(work)
    this.timer = setTimeout(() => {
      this.doWork()
      this.arr = []
    }, this.time)
  }
}

// debounce instance
const roomsDebounce = useMemo(() => new Debounce(rooms, setRooms, 0), [
  rooms,
  setRooms,
])
```

클래스명은 `Debounce`라고 지정하였지만, 사실 `Debounce`와 조금은 다른 방식이다.

### 🍊 기존

특정 시간 내에 실행된 최신의 작업만을 실행

### 🍋 변경

특정 시간 내에 실행된 최신의 작업을 작업영역에 추가하여 이후에 진행

키포인트는 새로운 작업을 저장하여 이후에 동일한 상태값에 일괄적으로 진행을 해준다는 점이다.

```ts
// 실제 사용 work 하나
const onRoomCreated = useCallback(
  (room: IRoom) => {
    roomsDebounce.debounceAct(() => {
      if (room.creater === socket.userID) joinRoom(room.roomID)
      const newRooms = { ...roomsDebounce.newState, [room.roomID]: room }
      roomsDebounce.newState = newRooms
    })
  },
  [roomsDebounce, joinRoom]
)
```

누적된 작업들이 모두 처리되도록 실행이 되면 클로저로 기억하고 있는 변수를 순차적으로 수정한 다음, 일괄 `setState`로 상태값을 변경하도록 하였다.

이후, 변경된 상태값을 감지하여 `Debounce` 인스턴스를 다시생성하는것이다.

## 🍌 예상되는 문제

아직 테스트중에 발생하지는 않고있지만, 혹시나 이런문제도 생길수 있지 않나 생각해본다.

누적된 작업을 처리하는 아주 짧은 시간에 새로운 작업이 또 들어옴
아직 상태값이 완전히 변경되지 않은 상태에서 또 작업이 쌓이게 됨
상태값이 변경되면서 새로운 인스턴스를 생성하여 쌓이 작업들이 초기화되거나 혹은, 구형의 상태값을 사용하여 작업을 함

### 🍇 예상 해결

반영 x

1. 상태값 할당을 인스턴스 생성단계가 아닌, 생성된 인스턴스에 상태값이 변경될 때 마다 최신화하도록 함. 방법은 인스턴스 내부 함수를 통해 진행. 이 내부함수에는 상태값을 최신화하는 구문과, 상태값이 최신화 되었다는 `boolean` 속성을 `true`로 변경함.

   > 인스턴스 자체는 재생성되는 경우가 없게되므로, 누적되는 작업배열이 초기화되지 않음.

2. 여러 요청들로 작업들은 누적되지만, 만약 `boolean`속성이 `false`라면 `setTimeout`을 실행시키지 않고, 작업만 누적시킴.
3. 작업들이 진행되면 `boolean`은 `false`로 변경
4. 이전의 work배열에 담긴 작업들이 완료되고, `setState`를 통해 상태값이 변경되면 내부함수가 최신화 된 상태값을 받아오고, `boolean`속성을 `true`로 변경하고, 아무것도 실행시키지 않는 빈 작업으로 인스턴스를 깨워서 `setTimeout`이 실행되도록 함.

## 🍓 결론

아마 내가 해결한 방법은 가장 효율적인 해결방안이 아닐 수 있다.

하지만, 특정 문제에 대해 회피하지 않고 직접 해결해보려고 고민해본것은 좋은 경험이였던것 같다.
