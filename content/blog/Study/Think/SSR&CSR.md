---
title : "SSR? CSR?"
date : 2020-07-06 00:00:01
category : "Study"
draft : false
tag : "Think"
--- 
## SSR(서버 사이드 렌더링) 대표예시 MPA(멀티 페이지 어플리케이션)  
  * 장점
    + SEO(검색엔진환경)에 적합하다.  
    + 초기화면 로딩이 빠르다.  
  * 단점
    + 요청값이 있으면, 웹서버에서 해당 View를 새로 만들어서 보여주기때문에, 로딩(하얀)화면이있다.  
    + CSR보다 비교적 개발이 복잡해진다.  
    + 클라이언트와 서버가 상호작용하는 기능은 사라짐.(해당 내용은 개선되었음)  
    * `TTV`와 `TTI`가 적용되는 시간이 달라서, 화면은 완성되었지만 사용자의 반응을 인식못하는 경우가 많음.
  * 배포과정  
    - 기존 MPA방식  
      1. bundling(webpack)을 통해 build된 static folder가 생성됨.  
      2. 배포를 하면, 서버에서 bundle된 js파일을 통해 View화면을 생성함.  
      3. 생성된 View를 브라우저에 던져줌.  
    - SPA + SSR (서버와 클라이언트간 상호작용이 강점인 SPA 및, SEO개선을위한 SSR 병합. 아래 과정정리에서 설명하겠음)

## CSR(클라이언트 사이드 렌더링) 대표예시 (싱글 페이지 어플리케이션)
  * 장점  
    + 브라우저 환경에서 View를 생성하고, 일부분만 수정하여 로딩되는 화면이 없다.  
    + 1번의 이유와, 이후 추가 요청 시 서버에서는 Json파일만 res해주기 때문에, 서버의 부담이 적어진다.  
    + 비교적 개발 및 배포가 수월해진다.  
    + `TTV`와 `TTI`가 거의 동시에 이뤄지기 때문에, 화면이 그려짐과 동시에 사용자의 반응을 인식함.
  * 단점  
    + 구글을 제외한 대부분의 검색엔진에서 노출되지 않는다.  
  * 배포과정  
    1. bundling(webpack)을 통해 build된 static folder가 생성됨.  
    2. 배포를 하면, static folder의 HTML파일(static file)을 서버에서 브라우저에게 던져줌.  
    3. 해당 HTML파일에는 root가 되는 비어있는 div태그 하나만 있으며, 하단에 script호출로 bundle된 스크립트를 불러오게 되어있음.  
      - 3번의 이유로, 구글 브라우저의 검색엔진크롤러는 javaScript언어를 읽어 출력할 수 있지만, 대부분 브라우저들의 검색엔진크롤러들은 javaScript언어를 읽지못해 View화면을 생성하지 못함.(검색엔진에서는 생성된 View화면(HTML)데이터를 긁어서 노출시키는 특성)  
      - 헷갈리면 안됨! 브라우저는 script파일을 읽을 수 있음! 다만, 검색해서 웹사이트등을 노출시키고자 할 때, 모든 검색엔진크롤러들은 html부분의 데이터를 긁어서 노출시키는데, 구글검색엔진크롤러를 제외한 대부분은 script를 읽지 못해, html을 생성하지 못하거나 데이터의 양이 부족해 노출에 우선순위가 밀림.
      - 따라서, View를 생성하는데에 여러 과정을 거치기 때문에, 시간이 걸림. 만약, bundle script를 읽고 기본 셋팅을 위해 fetch를 통해 http통신을 한다면 더 걸림  
    4. 클라이언트의 요청을 받으면, 서버에서 값만 받아와 해당 부분만 즉각 수정시킴. 

## 정리  
  * SSR, CSR 둘 다 빌드 이후, 서버로 배포(서비스)가 가능하지만, View화면을 서비스하는 방법이 다르다.  
  * SSR !== MPA, CSR !== CPA 이다.  
  * CPA는 DOM의 일부분만 수정하며 View화면을 구성하는것이 목적이기에 CSR방식을 택한것이고, MPA는 정적인 화면 여러개를 미리 생성한 뒤 View화면을 구성하는것이 목적이기에 SSR방식을 택한것이다.  
  *  서버버전의 경우, 별도로 만든 Node.js서버에서, rendertostring을 통해, App내부의 모든 코드를 문자열로 바꿔서, root태그 안에 삽입한다.

## SSR화하기  
  1. 별도의 Node.js서버를 만들고, (서버버전)build된 index.html파일과, React의 시작이되는 App파일을 불러온다.  
  2. 서버에서, 불러온 index.html파일의 root부분 내부에, React의 메소드인 rendertostring(App)을 해줘서, App컴포넌트부터 최 하위 컴포넌트까지 모두 문자열로 바꿔 넣도록 한다.  
  3. 완성된 View를 클라이언트에게 넘겨준다.
    - 동적이지않고, 정적임. 즉, 클라이언트와 소통할 수 있는 React의 장점 소멸.

## React(CSR)+SSR === UR(Universal Rendering)  
  1. (SSR + SPA인 US일 경우)React앱을 최초 렌더링할 서버버전(SSR)과, 이후 요청에 따라 필요한 웹버전(CSR)으로 두개 build를 할 수 있도록, webpack을 설정한다.  
  2. 별도의 Node.js서버를 만들고, (서버버전)build된 index.html파일과, React의 시작이되는 App파일을 불러온다.  
  3. 서버에서, 불러온 index.html파일의 root부분 내부에, React의 메소드인 rendertostring(App)을 해줘서, App컴포넌트부터 최 하위 컴포넌트까지 모두 문자열로 바꿔 넣도록 한다.  
  4. 완성된 View를 클라이언트에게 넘겨준다.  
  5. React의 index.js에서 ReactDOM.render -> ReactDOM.hydrate로 변경해준다.
    - render는 DOM에 React Element를 렌더링 해주는 함수인데, SSR의 경우, 서버에서 이미 마크업을 하기 때문에, 해줄 필요가 없다.  
    - hydrate은 SSR로 마크업을 할 경우, React의 장점인 동적임이 사라진 다음, 클라이언트에게 배포가 된다. 이후, script 파일이 읽어지면서 hydrate 메소드를 통해, HTML과 State를 동적으로 변환시켜준다.
  6. 브라우저가 bundle된 js파일을 읽으면서 hydrate메소드를 통해 interactive하게 바꾼다.

## 예제  
  * [CRA로 SSR하는게아닌, 아예 생 React를 Webpack부터 다 SSR가능토록 하는방법1](https://medium.com/@minoo/)
  * [CRA로 SSR하는게아닌, 아예 생 React를 Webpack부터 다 SSR가능토록 하는방법2](next-js-%EC%B2%98%EB%9F%BC-server-side-rendering-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-7608e82a0ab1)
  * [비교적 간단하게 React + SSR1](https://www.josephk.io/react-ssr-from-scratch/)
  * [비교적 간단하게 React + SSR2](https://medium.com/@donggyu9410/%EA%B0%80%EC%9E%A5-%EC%89%AC%EC%9A%B4-%EB%B0%A9%EB%B2%95%EC%9C%BC%EB%A1%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EC%84%9C-%EC%84%9C%EB%B2%84%EC%82%AC%EC%9D%B4%EB%93%9C-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-966702610664)

