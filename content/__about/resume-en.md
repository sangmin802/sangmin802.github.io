---
title: 'about'
date: 2021-07-29 11:33:13
lang: 'en'
---

<h1>박상민</h1>

<b>GitHub</b> : https://github.com/sangmin802

<hr>

<b>Blog</b> : https://sangmin802.github.io/

<hr>

<b>Mail</b> : sangmin802@(naver || gmail).com

<hr>

<h2>현재</h2>

<p>딜리셔스 근무중: 2022.01.03 ~ </p>

<h2>개인 프로젝트</h2>

<h3>sono-repo</h3>

<p>🥇 모노레포 프로젝트</p>

<hr>

<b>FrontEnd</b>

`React` `Next.js` `TypeScript` `vite` `rollup` `esbuild` `turborepo` `storybook` `pnpm` `yarn`

<hr>

<b>GitHub directory</b> : https://github.com/sangmin802/sono-repo

<hr>

<h3>Description</h3>

- loa-hands-next 배포중(vercel)
  - pwa
  - next14 data cache revalidate
- packages:
  - 하위 config package
  - storybook 배포중(chromatic)
  - reactTimerHook 배포중(npm)

<h3>🥉 Web-Chat (2021/fin)</h3>

<p>채팅 웹 어플리케이션</p>

<hr>

<b>FrontEnd</b>

`React` `Socket.io` `heroku` `Node.js` `Express`

<hr>

<b>GitHub directory</b> : https://github.com/sangmin802/web-chat

<hr>

<b>GitHub directory `Server` </b> : https://github.com/sangmin802/web-chat-server

<hr>

<b>Deployed Site</b> : https://sangmin802.github.io/web-chat/

<hr>

<h3>Description</h3>

📌 CSR

- `gh-pages`로 배포

📌 Server

- `Node.js` `Express` 기반 서버 운용
- `Socket.io`로 `Socket`서버 생성
- 서버 배포는 `heroku` (중단됨)

📌 Front

- 로그인 시, 해당 유저정보 서버에서 기억
- 전체 채팅 기능 사용
  > 유저접속, 유저퇴장 알림
- 귓속말 기능 사용
  > 카카오톡과 유사하게 확인하지 못한 메시지에 대한 표시
  > 해당 사용자의 `userID`만 `join`하여 서로간 공유
- 채팅방 사용

  > 카카오톡과 유사하게 참여한 채팅방에 한해서만 `room join` 하여 채팅 내용 표시

- 상태값을 업데이트 하는데에 있어, 이전 상태값과 다른 상태값을 참조할 필요가 있어 `useReducer`를 사용하여 상태관리 진행

<h3>🥉 DnF Rank (2021/fin)</h3>

<p>게임사에서 제공하는 open api를 활용한 앱</p>

<hr>

<b>FrontEnd</b>

`JavaScript` `Webpack` `Babel`

<hr>

<b>GitHub directory</b> : https://github.com/sangmin802/dnfrank

<hr>

<h3>Description</h3>

📌 Server

- `Node.js` `Express` 기반 서버 운용
- `MySQL` 데이터베이스를 사용하여 로그인 기능

📌 Front

- 프레임워크, 라이브러리의 도움 없이 `Javascript`만을 사용하여 개발
- 회원가입을 사용하여 사용자에 대한 기록을 남길 수 있음
- `Webpack`을 사용하여 실제 배포환경 구성
- `Webpack`에 대한 이해 위한 프로젝트로 완성도는 매우 낮음
