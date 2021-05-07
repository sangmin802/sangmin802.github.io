---
title: 'Web Socket, Socket.io'
date: 2021-05-07 16:44:00
category: 'Study'
draft: false
tag: 'CS'
---

### 📡 응답을 해주는 서버

서버에 요청을 보내고, 요청에 맞는 응답을 해주는 것. 서버와 관련된 것을 조금씩 알아가면서 호기심이 생겼었다.

누군가에게 응답을 받는것. 누군가에게 메시지를 전달받는 것.

> 카카오톡이네?

단순히 생각해보면 내가 보낸 메시지를 서버에서 저장하고, 누군가에게 돌려준다면 그것이 채팅이 아닐까? 라는 생각을 하게 되었다.

### 🐶 한계

하지만, 큰 문제가 있었다.

우리가 흔히 사용하는 HTTP 방식은 내가 요청을 보냈을 때, 그것에 맞는 응답만 서버에서 돌려준다.

즉, 서버가 요청없이 스스로 클라이언트에게 응답하는경우는 존재하지 않는다.

사실 채팅이란것이 내가 아무런 요청을 하지 않아도, 상대방이 메시지를 보내게된다면, 서버에서 그 메시지를 나에게 돌려줘야한다.

마치 **실시간 통신**을 하는 것처럼

## 🍎 Web Socket

`Socket`이란 네트워크 상에서 동작하는 프로그램 간 통신의 종착점이라고 한다. 사실 우리의 입장에서 보면, 두개의 종착점으로 클라이언트와 서버가 되는 것이다.

`Web Socket`은 `HTML5`의 표준 기술로, 클라이언트와 서버 양 측에 모두 `Socket`을 가지고 있고, 성공적으로 `connection`연결이 된다면 , 클라이언트와 서버 사이의 동적인 양방향 채널을 구성한다.

`Web Socket API`를 통해 실시간으로 데이트를 통신할 수 있는 것이다.

### 🍓 Socket.io

`Web Socket`은 `HTML5`의 기술이기 때문에, 오래된 버전의 웹 브라우저에서는 `Web Socket`을 지원하지 않는다고한다.

> 대표적인 `IE`.. 요즘 `IE`에 대한 지원이 대부분 끊기고 있다라는 카더라 통신(feat Youtube)

이처럼 지원하지 않는 브라우저를 위해 생긴것이 `Socket.io`라고 한다.

`Socket.io`는 `Node.js`기반으로 만들어진 기술로, 거의 모든 웹브라우저와 모바일 장치를 지원하는 라이브러리라고 한다.

만약, `Web Socket`을 지원하는 라이브러라면 해당 기술을 사용하고, 그렇지 않은 브라우저라면 기존의 `HTTP`를 이용해서 흉내를 낸다고 한다.

> 어떻게 흉내를 내는거지..?

## 🍭 간단한 채팅 구현

> `Socket.io`는 공식사이트에서 간단한 예제를 통해 체험해 볼 수 있는 코드와, 각종 `API`를 정리해놓은 문서가 있으니 한번 가보는게 좋을듯 하다! - 아래 참고 확인

공식 사이트에 나와있는 간단한 채팅 사이트를 구현해본 경험이다.

> 확인해보고싶은 특정 상황들이 있어, 살짝 수정하였다.

디렉토리 구조

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/07/1.PNG" alt="1">
</div>

### 🥞 server

```js
const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const port = 3000
const { Server } = require('socket.io')
const io = new Server(server)
const basePath = path.join(__dirname, '..', '/')

app.get('/', (req, res) => {
  res.sendFile(basePath + 'public/index.html')
})

app.get('/room', (req, res) => {
  res.sendFile(basePath + 'public/room.html')
})

io.on('connection', socket => {
  // 소킷 연결
  console.log('Socket Connected')

  // 입장 감지·반환
  socket.on('join', name => {
    // 나를 제외한 연결된 모든 사용자에게 전달 - broadcast.emit
    // socket.broadcast.emit("join", name);
    // 나를 포함한 모든 사용자에게 전달 - emit
    io.emit('join', name)
  })

  // 퇴장 감지·반환
  //    현재 접속한 곳이 채팅방이여서, 퇴장하면 소킷 종료시킴
  socket.on('leave', name => {
    io.emit('leave', name)
    // socket.broadcast.emit("leave", name);
    socket.disconnect(true)
  })

  // 채팅 감지·반환
  socket.on('chat', msg => {
    io.emit('chat', msg)
  })

  // 소킷 종료
  socket.on('disconnect', () => {
    console.log('Socket Disconnected ')
  })
})

server.listen(port, () => {
  console.log(`Server is connected on ${port}`)
})
```

- 전반적으로 보았을 때, `.on` 이라는 `API`가 클라이언트 `Socket` 에서의 요청을 서버의 `Socket`에서 받을 때 사용하는것 같다.
- `.emit`은 `.on`과 반대로, 서버의 `Socket`에서 클라이언트의 `Socket`으로 보내주는 역활을 한다.
- `connection`, `disconnect`와 같이 `Socket`에서 정한 네이밍도
  있지만, `join`, `leave`와 같은것은 커스텀한 네이밍이다.
  > 커스텀 이벤트처럼 이 네이밍이 이후의 콜백함수를 실행하는 이벤트 키라고 보는게 좋을듯 하다.
- 현재는, `Socket`에 접속하면 바로 채팅에 참여하는구조이지만, `Room`이라는 개념과 `.to` `API`를 통해 상호작용에대한 것을 구분지을수? 있는것 같았다.
  > 일종의 카카오톡 대화방 같은?

### 🍖 index.html

```js
<a href="room">방으로 이동</a>
```

- `connection`에 대한 결과를 보고싶어, `Socket`이 실행되는 경로를 구분지어놓기 위해 추가하였다.
  > 별 의미는 없음..

### 🍔 room.html

```js
// Socket CDN
<script src="/socket.io/socket.io.js"></script>

// html
<div class="bar">
  <button id="out">Out</button>
</div>
<div id="messages"></div>
<form id="form" class="bar" action="">
  <input id="input" autocomplete="off" /><button>Send</button>
</form>

// script
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const messages = document.querySelector("#messages");
const out = document.querySelector("#out");
const name = "상민";

// 소킷 연결
const socket = io();

// 나의 입장을 모두에게 알림
socket.emit("join", name);

// 누군가 입장했을 때 알림 받음
socket.on("join", name => {
  recordChat(`${name} 님이 입장하셨습니다.`);
});

// 채팅 입력
form.addEventListener("submit", e => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat", { name, msg: input.value });
    input.value = "";
  }
});

// 누군가의 채팅 받아옴
socket.on("chat", ({ name, msg }) => {
  recordChat(`${name} : ${msg}`);
});

// 내가 떠나기 위한 버튼
out.addEventListener("click", e => {
  e.preventDefault();
  socket.emit("leave", name);
});

// 누군가 떠났을 때 알림 받아옴
socket.on("leave", name => {
  recordChat(`${name} 님이 퇴장하셨습니다.`);
});

function recordChat(msg) {
  const item = document.createElement("p");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}
```

- 서버의 `Socket`과 동일하게, `on`으로 특정 이벤트 키에 대한 감지를 하고, `.emit`으로 특정 이벤트 키에 대한 요청을 보낸다.
- `const socket = io();` 이 부분에서, `url`을 인자로 보내 동일 포트가 아닌 다른 포트로 요청을 보낼 수 도 있는것 같았다.
  > 물론, 서버에서 `cors`와 관련되어 허용 주소로 지정해줘야 함.
- 현재는 바로 `Socket`에 접속하도록 되어있지만, 필요에 따라 사용자가 원할 때 `connect`를 할 수 있도록 할 수 있다고 한다.

## 🌮 결과

### 🥧 채팅 참여 - 퇴장 / 클라이언트

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/07/2.gif" alt="2">
</div>

- 원래대로라면, 퇴장하였을 때 다시 `index.html`로 돌아가지만, 퇴장했다는 문구가 잘 뜨는지 확인하기 위해 이동하진 않았다.

### 🍷 채팅 참여 - 퇴장 / 서버

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/05/07/3.gif" alt="3">
</div>

- 이게 뭔가 싶겠지만, `room.html`로 이동하였을 때, `Socket Connected`가 서버에서 호출되고, 클라이언트에서 나가기를 눌렀을 때, 서버에서 `Socket Disconnected`가 호출된다.
- 당연히, `Socket Disconnected`가 호출된 뒤로는 클라이언트에서 무슨 채팅을 처도 아무런 변화가 없다.

## 🥮 후기

정말 재미있는것 같다. 카카오톡이랑 비유를 해본다면

1. 카카오톡 로그인 - `Socket Connect`
2. 대화방 - `Socket Room`

   - 대화방의 이전 대화내용은 `DB`로 저장하고, 해당 방에 입장했을 때 기록을 불러오는 방식
   - 각각의 대화방에 대한 변화(같은 `id`의 대화방을 사용하고있는 사람의 채팅)를 서버에서는 `.emit`으로 보내고, 클라이언트에서는 `.on`으로 감지함
     > 만약 `React`라면, `.on`으로 받아온 횟수를 카운팅하여 누적된 새로운 메시지 갯수 출력?
     > 가장 최신의 대화만 `thumbnail`로 노출

3. 카카오톡 로그아웃 - `Socket disConnect`

이런 느낌이지 않을까..?

> 건방지게 감히 예상을 해보았다.

## 🍩 참고

- [Socket 이란](https://medium.com/@yeon22/term-socket%EC%9D%B4%EB%9E%80-7ca7963617ff)
- [Web Socket 이란](https://edu.goorm.io/learn/lecture/557/%ED%95%9C-%EB%88%88%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-node-js/lesson/174379/web-socket%EC%9D%B4%EB%9E%80)
- [Soket.io](https://socket.io/)
