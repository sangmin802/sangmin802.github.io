---
title: 'webSocket Protocol'
date: 2021-05-07 16:44:00
category: 'Study'
draft: false
tag: 'Think'
---

> 21-12-03 업데이트

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

## 🍎 webSocket

두개의 프로그램간 데이터를 주고받는것.

> 클라이언트와 서버간 데이터를 주고받는것.

`http`통신이랑 같아보이지만, 클라이언트 요청이 전달되어야만 서버가 응답을 하는 수동적인 것이 아닌, 서버에서도 능동적으로 클라이언트에게 무언가를 전달할 수 있음.

> 노마드코더 영상에서는, 요청을 전달하고 수신하였을 때 연결이 끊기는것이 아닌 첫 `connection`을 통해 연결 상태를 유지하고 서로 교환한다고 얘기하심.

1. 양방향 통신이 가능함.
   위에서 설명된 특징

2. 실시간 네트워킹
   채팅, 주식과 같이 정해진 시간이 아닌 랜덤한 시간에 발생하는 데이터를 그때마다 클라이언트에 반영이 되는 것이 가능함

`WebSocket`이전, 위의 양방향 통신, 실시간 네트워킹이라는 특징이 필요한 프로그램에서 사용했던 방법이 있다고 함.

### HTTP Polling

일정 주기마다 클라이언트에서 서버상으로 요청을 송신함. 하지만, 채팅과 같은 프로그램에서 정해진 시간에 새로운 데이터가 형성되는것이 아니기 때문에, **불필요한 요청**이 생길수 있고, **실시간이라고 하기엔 애매**함.

### HTTP Long Polling

정해진 시간에 요청을 보내어 불필요한 요청이 발생하거나, 변경된 새로운 데이터가 생기자마자 클라이언트에게 보낼 수 없다는 문제를 개선하기 위해서 처음 서버에 요청이 전달되었을 때, 변화가 생길때까지 대기하다가 생기면 클라이언트로 응답.

> 어찌되었든, 많은 양의 메시지가 발생한다면 그 주기가 짧아지면서 `Polling`과 다를것이 없게된다 함.

### HTTP Streaming

서버에 요청을 보내고 연결을 끊지 않은 상태에서 데이터를 계속해서 받아옴.

클라이언트에게 영상정보를 보내는것이 대표적이라고 함.

> 아마 유튜브, 트위치와 같은 인터넷 방송 플랫폼에서 이와같은 특징이 이용되는것이 아닐까 생각해봄

다만 처음 클라이언트에서 요청이 전달된 이후에는 별다른 요청없이 연결된 상태로 서버에서 클라이언트상에 조금씩 계속해서 데이터를 전달하는것이기 때문에 클라이언트에서 서버로 데이터송신이 어렵다고 함.

> 그래서 클라이언트상으로 영상을 잘개 나누어서 전송하는데에 주로 쓰이는것 같음.

모두 공통적으로 `HTTP`통신을 사용하는 환경에서 데이터를 빠르게, 실시간을 목적으로 주고받아야 하다보니 규모가 큰 `header`가 자주 교환되는 상황이라고 한다.

### 연결

`WebSocket`도 일반 서버와의 통선치럼 **핸드쉐이킹**의 과정을 거친다고 함

> 핸드쉐이킹. 처음보지만 대략적으로 의미를 알아보니, 클라이언트에서 서버로 연결 요청을 보내고, 서버에서는 연결 응답을 클라이언트에 보내어서 서로의 연결 과정을 핸드쉐이킹이라고 하는것 같다. 더 알아보자.

`http(80)`, `https(443)` 프로토콜을 사용하여 서버에 요청을 전달하는데, 핵심 `header` 속성들이 있다고 한다.

```js
// GET /chat
const header = {
  Host: javascript.info
  Origin: https://javascript.info
  Connection: Upgrade
  Upgrade: websocket
  Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
  Sec-WebSocket-Version: 13
}
```

`Origin` : `webSocket`연결을 할 클라이언트 주소
`Connection`: 클라이언트 측에서 프로토콜을 변경하고싶다는 요청
`Upgrade` : 클라이언트 측에서 변경하고싶은 프로토콜
`Sec-WebSocket-Key` : 연결되는 프로토콜의 보안을 위한 키

이렇게 전송이 되면 서버에서는 `webSocket`이 연결되었다는 응답을 클라이언트로 전송한다.

이 이후에는 `http`프로토콜이 아닌 `ws80` 혹은 `wss(443)` 프로토콜이 적용된다고 한다.

> `wss`는 `https`처럼 `SSL` 보안 인증이 적용된 프로토콜이라고 함

### 데이터 전송

`webSocket` 프로토콜로 연결된 클라이언트와 서버간 데이터를 주고받는 구조를 `webSocket frame`라고 한다.

`frame`은 `header`와 `payload`로 구성되어있다고 함.

전달되는 `frame`의 크기에 따라 `frame header`가 다른 구조를 갖는다는것 같다.

`header`의 `OPCODE`를 통해 해당 `frame`이 텍스트 프레임인지, 이진 데이터 프레임인지 아니면 `webSocket`커넥션을 종료하는 프레임인지 구분한다고 함.

> 가장 많이 사용한다는 것들만을 골라봄..

이후에 함께 전달된 `UTF-8` 형식의 `payload`를 알아볼수 있는 일반 텍스트로 디코딩하는것 같다

### webSocket 프로토콜 특징

1. 처음 접속에서만 `http` 프로토콜을 사용하여 핸드쉐이킹을 하기 위해 한번만 `http header`를 사용한다.
2. 다른 포트가 아닌 기존의 `http`, `https` 프로토콜을 사용함
3. `webSocket`연결간 데이터를 교환하는 구조는 `webSocket frame`을 사용함

### 한계

`HTML5`부터 소개된 기술로 이전의 버전에서는 호환되지 않는 상황이 발생함.

`Socket.io`, `SockJS`와 같은 방법을 사용하여 `webSocket`을 호환하지 못하는 버전에서 특징인 실시간 웹을 구현하도록 도와줌

브라우저와 웹 서버의 종류, 버전을 파악하여 적합한 기술을 선택하여 사용하는 방식

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
- [우테코 webSocket](https://www.youtube.com/watch?v=MPQHvwPxDUw)
- [MDN webSocket](https://developer.mozilla.org/ko/docs/Web/API/WebSockets_API/Writing_WebSocket_servers)
- [webSocket Protocol](https://swiftymind.tistory.com/104)
- [javascript webSocket](https://ko.javascript.info/websocket)
