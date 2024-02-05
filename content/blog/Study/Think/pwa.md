---
title: 'PWA'
date: 2023-05-24
category: 'Note'
draft: false
---

토이프로젝트에 pwa를 적용해보기 전, ms에서 관련된 영상을 챕터별로 올려줬길래 보고, 정리해보았다.

사실 완전히 내것 이라고 말은 못하겠고.. 아 이런거구나 하는 정도로만

아래 만드는 1,2 단계수준은 모노레포에 적용해볼 수 있을것 같음

영어를 내 나름대로 해석해본것이라.. 잘못해석, 이해 되었을 수 도 있음 ㅎㅎ.. (이게 제일 걱정)

# PWA-Progressive Web Apps

- [유튜브 링크](https://www.youtube.com/watch?v=BByUknfLTuA&list=PLlrxD0HtieHjqO1pNqScMngrV7oFro-TY&index=1)

하나의 웹 코드베이스로 각 디바이스 환경을 지원하는 기능. 웹 기반의 하나의 코드베이스로 모든 디바이스(웹, iOS, Android)를 개발 / 빌드하기 위함

### 질문) PWA vs Native App

#### Native App

- 각 디바이스별 고유한 언어를 사용함
- 각 디바이스별 컴파일과정, 실행과정이 다름
- 각 디바이스별 다른 코드베이스를 작성, 관리

#### PWA

- 하나의 웹 기술을 사용
- 하나의 컴파일과정, 실행과정
- 하나의 코드베이스, 관리
- 웹브라우저에서 url접근이 가능하여, 다른사람에게 url 전달만으로 접근할 수 있으며, Native App만 가능했던 앱스토어 등록도 가능해짐

### 질문) PWA vs Website

PWA는 일반 website와 거의 동일. 같은 기술, 같은 환경을 공유함

다만 아래의 추가적인 이점이 있음

#### PWA

- 고유한 앱 아이콘을 가질 수 있어 taskbar나 Mac 아이콘으로 등록될 수 있음
- window에서도 standalone 하게 단독적으로 실행될 수 있음
- 전통적인 website에서 할 수 없었던 더 고급 기능들을 사용할 수 있음(앱에서만 가능했던 기능 가능)
  - 모바일 디바이스에 설치되어있는 다른 앱들과 서로 공유하는 행동등이 가능(앨범에서 사진 공유 등..?)
  - 전통적인 website와 달리 다른 일반적인 앱처럼 오프라인(비행기같은..?) 환경에서 흰 화면이 아니라 일부 기능(캐시, 서비스워커, 스토리지)이 유지될 수 있음
    - 물론 다른 앱 들과 동일하게 설치할 때에는 온라인 상태여야 함

### 질문) PWA가 정말 Native App처럼 잘 작동될 수 있나요?

PWA도 결국 기반이되는 기술, 환경은 웹이기 때문에 Native App과 온전히 대등할수는 없을것 같다.

하지만 이러한시도가 계속해서 가속화되고있기 떄문에 앞으로 web / native App 둘간의 차이는 계속해서 줄어들것이다.

- Web Assembly
  - Native 코드를 웹에서 실행시켜주기 위한 도구
- Low-level hardware access(..? 이게 뭘까)

### 질문) PWA를 만드는 방법

1, 2단계만 수행 / 빌드 되어도 pwa 앱이긴 함

1. 일반 website와 동일하게 유저인터페이스를 구성하는 html, css, js 구성
2. 1. Paw manifest.json 구성(앱 아이콘, 앱 이름, 앱 설명, 운영체제에 어떻게 접근할지 등)
   2. Service worker 챕터1에서 상세설명하고자 함. 조금 더 복잡한 파일이긴 하지만, 오프라인 지원에 대한 설정(오프라인과 같은 상태일 때 클라이언트 요청 시 네트워크요청이 아닌 캐시데이터를 뒤져서 클라이언트에게 보여주도록 하는등)
   3. Https. service worker는 https 환경에서만 사용 가능
3. 조금 더 흥미롭고, 특별하게 하기 위한 방향 / 깊이 얘기는 안해준듯..
   1. Device adaptation 디바이스 장치 호환성
   2. OS integration OS통합
   3. 오프라인 지원

### 질문) PWA가 앱스토어에 배포될 수 있나요?

pwa는 그래도 웹사이트이기 때문에, 도움없이 직접 앱스토어에 배포는 불가능하다. 다만, pwa builder 를 통해 url을 scan하여 문제가없는지 파악하고, package를 반환해주는데, 이것을 앱스토어에 배포 가능하다.

# CH1 service workers

## service workers 소개

단순한 js코드를 담고있는 파일이며, 앱의 최초에 해당 파일을 Regist 하여 브라우저가 우리가 작성한 Serviceworker를 읽도록 해야함

### 질문) 왜 service worker라고 불리나요?

애플리케이션과 온전히 분리된 환경에서 실행되기 때문 그렇기 때문에 애플리케이션의 캐시 관리 등이 별도로 가능함.

대부분의 website는 하나의 싱글스레드를 통해 작동되지만, 별개로 작동되기 때문에 웹 작업 동시에 별개의 일을 수행 가능

- 다만, 별개이기 때문에 DOM 접근 불가능, 윈도우 객체 접근 불가능, notification같은 web api는 사용 가능 애플리케이션과 별도의 환경에서 수행되기 때문에, 애플리케이션이 비활성화된 오프라인상태 등에서도 유지되고 있음
- 오프라인 상태에서도 유지되기 때문에, 푸시알림을 날려줄 수 있게됨 애플리케이션에서의 네트워크 요청을 인터셉트하여 응답값을 내려줄 수 있어 캐싱된 값이 있다면 오프라인 상태일때에도!!!! 요청받아왔던 데이터를 보여줄 수 있음
  - [service worker](https://so-so.dev/web/service-worker/)

### 질문) 어떻게 오프라인 상태에서 애플리케이션이 작동되게 할 수 있나요?

Native app들은 오프라인상태더라도 네트워크가 끊겼습니다라는 메시지를 애플리케이션이 유지된 상태에서 보여주게 됨

Service worker의 특징(앱 별도로 관리되어 종료되지 않음, 캐시를 유지시킬 수 있음, 인터셉트 가능)을 통해 처음 앱을 설치하고, 소스들을 받아와서 충분히 캐시되어 있다면 다음애 앱을 다시켰을 때에는 캐싱된 소스를 보여주게 될 것임

만약 오프라인상태더라도, service worker가 프록시 역할로서 캐싱된것들을 응답으로 내려줄것이기 때문에, 무언가를 보여줄 수 있음

### 질문) 어떻게 Service worker를 시작할 수 있나요?

시간이 지날수록 많고 복잡한 로직들이 추가될 것이기 때문에 간단한것부터 시작해보는것이 좋다.

1. 정적인 자원들에 대한 캐싱
2. Native 앱처럼 애플리케이션이 오프라인상태(네트워크 끊김 등..)에 대한 Redirect 페이지 또는 메시지를 통한 빈화면 보이지 않도록 하기
3. 이후.. 좀 더 복잡한 오프라인 처리 로직
   > 정말 많은 service worker 리소스들 및 Workbox(service worker 코드를 정말 많이 간소화해주는) 서드파티라이브러리를 통해 도움을 받자.

### 질문) service worker가 다른것들도 수행 가능할까요?

하단 2,3번기능은 iOS에서는 16이 되면서 추가됨.(1번은 직접은 안되고 APNs를 통해서만 가능)

- 오프라인상태에서도 유지되기 때문에 native app의 푸시메시지같은것들을 사용할 수 있음
  > notification은 can I use를 보니깐 되긴 할듯..?
- 애플리케이션이 활성화되어있지 않더라도 service worker는 서버의 요청을 들을 수 있기 때문에, 서버의 요청을 추가해줄 수 있다
  > 굳이 따져보자면 카카오톡 같은 메신저에서 비활성화 상태일 때 상대방의 메시지 수신하고 숫자띄워주는것 그런걸까?
- 주기적인 업데이트가 가능함. 주기적으로 새로운 데이터를 받아오도록 하던지 등.. 애플리케이션을 키지 않더라도 매일매일 뉴스 갱신같은?
  > 캐시된 데이터의 재검증?

## 웹 적응 및 네이티브 앱 통합

### 질문) 웹 기술에 기반된 pwa가 웹 브라우저에서 제공되는 모든 기능들을 사용할 수 있는걸까?

> ㅇㅇ

웹 결제, 웹 인증 등등.. 되려, 인증에 있어서는 앱에서 가능했던 사용자 손가락 인증 등등이 추가로 가능해짐

### 질문) 어떻게 PWA가 운영체제에 통합될 수 있는걸까?

다른 애플리케이션과 상호작용이 가능하고 navigator.setAppBadge등과 같이 Pwa 앱에 뱃지를 달아줄 수 있음(카카오톡 새로운 메시지 뱃지같은..) 이런 native app의 기능들이 가능해짐.

특별한 링크를 통해 브라우저의 링크로 이동되는것이 아닌 pwa 애플리케이션이 켜지도록 할 수 있음(이 특별한 링크란것이 이해가 잘 안됨..)

> pwa 앱을 설치하면 아래와 같은 기능이 활성화되는데 이 링크를 말하는걸까? 원래에는 요기에 데스크탑 모양 아이콘으로 pwa앱을 설치할 수 있음

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/05/24/pwa-link.png?raw=true" alt="pwa-link">
</div>

타이틀바와 같은 기본영역들을 제거하여 풀 영역을 구성할 수 있다는것 같음(window-controls-overlay) 조만간 pwa를 위젯으로 구현될 수 있도록 한다 함

## PWA Demo

- [유튜브](https://www.youtube.com/watch?v=XnavBDElaac&list=PLlrxD0HtieHjqO1pNqScMngrV7oFro-TY&index=4)

- 적용 사례: [pwa 적용 사이트](https://www.pwastats.com/)

- Twitter도 주소바 우측의 다운로드 아이콘을 통해 pwa 앱을 다운로드 받을 수 있음.

  - Mac
    ￼<div style="margin : 0 auto; text-align : center">
    <img src="/img/2023/05/24/twitter-pwa-mac.png?raw=true" alt="twitter-pwa-mac">
    </div>
  - Window
    ￼￼<div style="margin : 0 auto; text-align : center">
    <img src="/img/2023/05/24/twitter-pwa-window.png?raw=true" alt="twitter-pwa-window">
      </div>

- 유튜브 또한 PWA를 지원하는것으로 보임. 지원을 해온지는 꽤 된듯..?
  - [youtube pwa](https://www.androidpolice.com/2021/01/26/youtube-is-now-a-pwa-making-it-easy-to-install-on-desktops/)

### PWA 개발 팁

- Service worker를 직접 구성해보고 만들어보기
- website와 PWA를 구분하여 생각하기
- 기존 전통의 website처럼 copyright이 포함된 큰 푸터, 큰 헤더를 모두 제거하여 앱친화적으로 보이도록 하기
- 오프라인 기능 등등 PWA로 가능한 기능들을 자주 시도해보기

## 왜 PWA를 통해 빌드해야할까요?

소프트웨어 개발에 여러 방법이 있고, 유감스럽게도 PWA만이 은화살(절대적 최고의방법을 의미하는듯..?)은 아닐것이다. 특정 사용에 따라 PWA의 장단점을 고려해야 함

이러한 선택 과정에서 PWA는 하나의 코드베이스만으로 여러 디바이스를 지원할 수 있다, 웹기능을 통해 구성할 수 있다(css를 사용하여 여러 디바이스 크기에 맞는 디자인), 앱처럼 아이콘을 갖고 설치될 수 있는점 등등..의 이점으로 충분히 흥미로운 선택이 될 것

# CH2 Building PWAs with Developer Tools

## Service Workers의 기본

이전 챕터에서 깊이 이야기했으니 간단히

- Service workers는 우리의 PWA 앱에서의 네트워크 요청을 가로챌 수 있는 `프록시 레이어`이다.
- Service workers는 우리의 앱에서 별도로 분리된 환경에 비동기적으로 작동된다.
- Service workers는 네트워크가 유효하지 않을 때 요청에 대한 행동을 정의할 수 있다. 오프라인 상태에서도 앱이 기능될 수 있도록

## Service Workers와 개발한다는 것은?

- 고유한 Js 파일로 작성됩니다(ex/ sw.js)
- 파일의 위치는 작업영역 하위라면 어디든 상관없다
- Service Worker를 등록하는 코드가 필요하다.
  ￼<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/05/24/register.png?raw=true" alt="register">
    </div>
- Service workers는 이벤트 중심이고, 이벤트 리스너를 통해 함수를 실행시킨다
  ￼<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/05/24/wailt-until.png?raw=true" alt="wailt-until">
  </div>
  ￼

Service workers에는 두개의 생명주기가 존재한다.

1. Install: 최초에 service workers가 설치될 때 실행된다. 이 때 셋업, pre-caching과 같은 핸들러가 추가되기 좋다.
2. Activate: Install 이후 준비가 완료되어 기능될 수 있는 상태.

Fetch Event가 존재하고, 핸들러를 할당해줄 수 있는데, 이 이벤트는 PWA 애플리케이션이 소스를 받기 위해 네트워크 요청이 전달되었을 때 실행되며 해당 요청에 대해 커스텀할 수 있다.(아마 이때 인터셉팅하여 응답을 내려주고 하는게 아닐까.. 싶은)

따라가보면 Service worker가 최초 생성될 때, install, active 두개의 생명주기가 돌며 생성이 됨.

- 이후 동적인 네트워크 요청 포함 실행된다면 fetch 핸들러가 작동됨.
- 두번째 진입부터는 service worker가 등록되어있기 때문에, 자유롭게 fetch 핸들러가 작동됨
- 정적인 자원(html, css …)은 Install 단계에서 Event 객체를 통해 저장 가능하다는것 같음.
  ￼

## Service Workers를 사용하여 캐싱과 패칭해오기

Fetch 이벤트를 통해 받아온 소스들에 대한 다양한 캐싱 전략들이 있고 각각 장단점이 존재한다.

### 질문) 어떻게 자산들이 항상 사용 이용할 수 있는 상태임을 알 수 있나요?

precaching (cache.addAll?)은 우리가 이전의 자원들이 필요할 때(네트워크가 불완전한 상태 등등)를 위해 캐싱하고있는다. event.withUntil은 내부의 비동기로직을 기다려줌. 이벤트 핸들러 내부에서 동기적으로 작동되도록 함(이벤트 핸들러에 대한 await 인가봄)

￼<div style="margin : 0 auto; text-align : center">
<img src="/img/2023/05/24/cache.png?raw=true" alt="cache">

  </div>

기본 캐시 전략 === 그냥 캐시된게 있으면 그거 주세요.

요청에 대한 유효한 캐시값이 조회하여 존재한다면, 캐시된 값을 응답으로 내려주고 그렇지 않으면 네트워크 요청을 진행시킨다. 전반적으로 정적 자원에 대해서는 기본캐시전략도 많이 좋을듯.

￼<div style="margin : 0 auto; text-align : center">
<img src="/img/2023/05/24/default-cache.png?raw=true" alt="default-cache">

  </div>
￼

조금 심화된 캐시 전략 === 오래된 캐시에 대한 재검증
캐시가 존재하는지 체크하고, 캐시값을 service worker단에서 갱신한다.

나머지는 위와 동일함

￼<div style="margin : 0 auto; text-align : center">
<img src="/img/2023/05/24/revalidate-cache.png?raw=true" alt="revalidate-cache">

  </div>

그냥 캐시되어있는거 주는 대신, 기다리지 않는 요청을 보내서 갱신만 하는듯

￼

## Service Workers가 캐시를 넘어서 무엇을 할 수 있을까

가장 대표적인 push notification, 주기적인 데이터 패칭(매일 뉴스 갱신)… 등등 native app의 경험을 줄 수 있는점

- Push notification / 이게 웹, 안드로이드 애플리케이션에서의 푸시알림까지는 ok인듯 한데, 다른 글들 보니 iOS는 아직 혼자서는 불가능하고 APNs를 함께 써야 iOS 앱푸시가 가능하다는것 같음.
￼
￼<div style="margin : 0 auto; text-align : center">
<img src="/img/2023/05/24/notification.png?raw=true" alt="notification">

  </div>

# CH3 PWA Advanced capabilities

## PWA 개발 도구 소개

### 질문) PWA 왜 만들었어요?

웹과 native App의 좋은 기능, 경험들을 결합한 하나의 도구를 만들고자 했다.

## PWA 시작해보기

그냥 PWA starter에 대한 이야기..

PWA에 대해 첫 시작이라면 Vscode 기준 PWABUILDER STUDIO extension 도구를 통해 도움받을 수 있다.

- [PWA starter](https://github.com/pwa-builder/pwa-starter)

## PWA 디버깅

대체로 네트워크 탭에서 오프라인상태를 하였을 때를 체크하면 될 듯

Service workers 설정이 잘 된 애플리케이션이라면 오프라인상태더라도 흰 네트워크없음 화면이 아닌 캐싱된 데이터 기반의 뭔가를 보여줄것임(twitter 테스트해보니 그럼)

애플리케이션 탭에 PWA manifest, service workers, storage 정보가 보임

## PWA 배포하기

1. 전 챕터에서 언급되었던 pwabuilder.com에 접근하여 생성한 pea website url을 입력한다.
   > PWA앱으로서 문제 없는지 체크하는듯 함. 무엇이 부족한지 action itmes 섹션에서 알려줌
2. Service worker, security 평가가 이루어짐
3. 문제가 없다면, store 배포를 위한 패키징을 요청할 수 있음. 각 디바이스 별(window, android, iOS …) 패키지를 생성할 수 있음.
4. 추가적인 요청사항에 대한 입력이 완료된다면, 패키지를 다운로드 받을 수 있음.
5. 생성된 패키지 내부에는, install 파일이 존재하는데 해당 파일을 실행시켜 생성된 PWA를 개발환경에서 테스트해볼 수 있음.
6. 생성된 패키지를 원하는 store에 배포하면 끝!

# CH4 PWA Native Integrations in Depth (PWA와 Native 기능에 대한 심층적 통합)

## PWA 에서 더 나은 UX

- 앱 관리
  - Edge://apps 로 이동하면 현재 설치되어있는 모든 PWA 애플리케이션들을 리스트로 볼 수 있음.(구글은 뭘까)
- OS Theming
  - 다크모드 등 지원 가능. 현재의 브라우저 테마와 동기화시킬 수 있음
- Window controls overlay
  - Window contorller가 있는 title bar를 제거가능
  - 크로미움105 이상

## 사용자의 OS 기반의 더 많은 통합(그냥 더 많은 기능을 의미하는것 같기도)

- Run on os login
  - 내 컴퓨터가 활성화 / 로그인 되었을 때 설치된 앱 자동 실행
- Shortcuts
  - 태스크바, 바탕화면 등의 아이콘으로 등록하여 바로 실행시킬 수 있음
- File system access
  - 플랫폼의 파일시스템에 접근할 수 있음
- Protocol handling
  - Manifest 설정을 통해 나만의 규칙을 정의하고 사용할 수 있다는것 같음
- Link handling
  - Manifest start_url 항목을 통해 다른 사람에게 해당 PWA 애플리케이션을 실행시킬 수 있도록 url을 줄 수 있음
- File handling
  - 특정 파일이 깔렸을 때, 해당 파일을 실행시킬 앱으로 PWA를 등록할 수 있다는것 같음. 파워포인트 파일을 클릭했을 때, 파워포인트 소프트웨어가 실행되는것처럼, 만약 .test라는 확장자의 파일이 클릭되어 실행되거나, 깔렸을 때 manifest에 .test 확장자의 파일을 수용하도록 해두면 해당 PWA 앱이 실행되는 그런걸까..?
- Web share
  - 애플리케이션과 공유할 수 있음
  - 설명하는것 듣다보니, 약간 그런것 같음. 앱에서 어떤 메시지를 작성하고 카카오톡 공유하기 gMail 공유하기처럼 공유할수 있는 앱들을 쭈루룩 나열해주고 사용자가 선택해서 공유
- Web share target
  - Web share처럼 다른 앱과 공유하는것은 동일하나, Web Share는 나열된 앱 중 사용자가 하나를 선택하는것이라면, 얘는 PWA가 고정시킨 앱에만 공유하는 것

## 참고자료

- [PWA on Microsoft Edge documentation](https://learn.microsoft.com/ko-kr/microsoft-edge/progressive-web-apps-chromium/)
- [Learn PWA in 30 days](https://aka.ms/learn-pwa/30Days-blog)
- [새로운 api](https://fugu-tracker.web.app/)
- [새로운 기능에 대한 blog](https://web.dev/blog/)
- [Service Workers 생명주기](https://velog.io/@hancihu/%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%9B%8C%EC%BB%A4%EC%9D%98-%EC%83%9D%EB%AA%85-%EC%A3%BC%EA%B8%B0%EC%99%80-%EC%BA%90%EC%8B%9C-%EA%B4%80%EB%A6%AC)

### manifest 생성 도움 사이트

- [Paw manifest generator](https://www.simicart.com/manifest-generator.html/)
