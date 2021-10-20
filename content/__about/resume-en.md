---
title: 'about'
date: 2021-07-29 11:33:13
lang: 'en'
---

<h1>박상민</h1>

<p>저는 <b class="motto">____</b> 하고자 합니다.</p>

<ol>
  <li>모두가 이해할 수 있는 코드를 개발</li>
  <li>보다 효율적인 개발 방식을 찾고자</li>
  <li>경험 및 문제에 대한 해결과정을 기록하고 기억</li>
  <li>문제에 대한 단순 해결이 아닌 이해를</li>
</ol>

<p>저는 <b class="motto">____</b> 문화를 선호합니다.</p>

<ol>
  <li>개발한 코드를 리뷰하여 더 나은 방식에대한 고민을 제안해주는</li>
  <li>문제를 공유하고 함께 고민하는것을 장려하는</li>
  <li>동일한 과제에 대해 다른 업무여도 함께 상황을 공유하는</li>
</ol>

<hr>

<b>GitHub</b> : https://github.com/sangmin802

<hr>

<b>Blog</b> : https://sangmin802.github.io/

<hr>

<b>Mail</b> : sangmin802@(naver || gmail).com

<hr>

<h2>개인 프로젝트</h2>

<h3>🥇 Loa-Hands</h3>

<p>로스트아크 유저 검색 웹 어플리케이션</p>

<hr>

<b>FrontEnd</b>

`React` `Next.js` `TypeScript` `React-Query` `React-Router` `Redux` `Redux-Saga` `Suspense` `ErrorBoundary` `gh-page` `vercel` `heroku` `Node.js` `Express` `Styled-Components` `Jest` `react-testing-library` `Storybook`

<hr>

<b>GitHub directory</b> : https://github.com/sangmin802/loa-hands

<hr>

<b>Deployed Site</b> : https://sangmin802.github.io/loa-hands/

<hr>

<b>GitHub directory `Next.js` </b> : https://github.com/sangmin802/loa-hands-next

<hr>

<b>Deployed Site `Next.js` </b> : https://loa-hands-next.vercel.app/

<hr>

<h3>Description</h3>

📌 CSR

- `gh-pages`로 배포

📌 SSR

- `Next.js`를 사용하여 `SSR`환경으로 개발
- `Vercel`을 사용하여 배포
- `pre-rendering`을 위한 `getStaticProps` `getServerSideProps` 생명주기 사용
  > 현재는 제거된 상태

📌 Server

- `Node.js` `Express` 기반 서버 운용
- 서버 배포는 `heroku`

📌 Front

- 배포된 서버로 `RESTful API` 형식의 요청
- 수신된 `text/html` 형식의 데이터를 가공
- 비동기 로직을 처리하기 위한 방식으로 `react-query`를 사용
  > 기존 `Redux`, `Redux-Saga` 에서 변경. 코드자체는 남겨둠
- `Suspense` `ErrorBoundary`를 사용하여 로딩처리나 에러 핸들링
- 데이터 캐싱을 통해 동일한 값에 대해 서버로 전달되지 않도록 방지
  > 캐싱시간이 지난경우에만 다시 요청
- `TypeScript`를 기반으로하여 기대값 외의 값에 대한 조기 에러 핸들링
- `Storybook`을 통한 `UI` 테스트
- `Jest` `react-testing-library`를 통한 단위테스트
- `style`의 경우 `CSS-in-JS`방식 사용
- `atomic` 디자인 패턴의 `pages` `atom` 성격의 컴포넌트를 사용하여 재활용성 향상
- 컴포넌트에 있어 최대한 조합의 방식 사용
- 불필요한 리렌더링을 막기 위한 메모이제이션
- `useCallback` `useMemo`를 사용하여 메모이제이션

<h3>🥉 Web-Chat</h3>

<p>채팅 웹 어플리케이션</p>

<hr>

<b>FrontEnd</b>

`React` `gh-page` `Socket.io` `heroku` `Node.js` `Express`

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
- 서버 배포는 `heroku`

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

<h3>🥉 DnF Rank</h3>

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

<h2>협업 경험</h2>
<h3>⛔ TwoFastGif</h3>

<p> 움짤 제작 웹 어플리케이션 </p>

> 서버비 유지 불가능으로 인한 중단

<hr>

<b>FrontEnd</b>

`Vue.js` `Vue pre-render`

<h3>Description</h3>

📌 Deploy

- `AWS EC2`

📌 Server

- 백엔드 전공인 학교 친구와 협업

📌 Tool

- `GitHub`를 사용하여 프로젝트 공유
- `Source Tree`를 사용하여 `pull` `push`

📌 Front

- 영상 편집에 대한 옵션 제공
- 제작된 `gif` 다운로드 기능 제공
- 사용 방법에 대한 알림

<h3>⛔ 플라이어스</h3>

<p> 마트 전단 제작 웹 어플리케이션 </p>

> 서버비 유지 불가능으로 인한 중단

<hr>

<b>FrontEnd</b>

`Angular`

<h3>Description</h3>

📌 Deploy

- `AWS EC2`

📌 Server

- 학원 강사였던 백엔드 개발자와 협업

📌 Tool

- `GitHub`를 사용하여 프로젝트 공유
- `Source Tree`를 사용하여 `pull` `push`

📌 Front

- 해당 마트의 데이터를 가공하여 전단 제작
- 제작된 전단을 모바일로 전송

<h3>

이 외 프로젝트들은 `GitHub`에 기록되어 있습니다.

</h3>
