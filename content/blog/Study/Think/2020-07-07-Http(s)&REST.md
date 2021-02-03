---
title : "Http(s)? REST?"
date : 2020-07-07 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 
## HTTP(Hypertext Transfer Protocol)  
브라우저(클라이언트)와 서버간 데이터를 주고받기위한 방식(나는 이렇게 줄 테니, 넌 이렇게 받아) HTTP로 데이터를 주고받기 위해서는 Request, Response가 있어야한다.  
### URL을통해 데이터를 요청하는데, 요청하는 데이터에 특정 동작을 수행할 수 있다.  
1. GET : 존재하는 자원에 대한 요청  
2. POST : 새로운 자원을 생성  
3. PUT : 존재하는 자원에 대한 변경
4. DELETE : 존재하는 자원에 대한 삭제
### 기타 요청 method  
1. HEAD : 서버 헤더 정보를 획득. GET과 비슷하나, Response Body를 반환하지 않는다.  
2. OPTIONS : 서버 옵션들을 확인하기 위한 요청. CORS에서 사용 

## HTTPS(Hypertext Transfer Protocol Secure)  
기본적으로 HTTP와 하는 기능은 동일하지만, 정보를 주고받을 때 암호화하여 민감한 정보를 도난당하는 것을 막아준다.  
지난 2014년 Google에서는, 모든 http기반 웹사이트들을 https로 전환하도록 https기반 웹사이트들에게 검색순위에서 약간의 가산점을 주기시작했다.  
### HTTPS 특징
1. HTTPS와 HTTP의 가장 큰 차이점으로는 SSL인증서 사용 유무로, 클라이언트에서 서버에 제공하는 정보를 암호화해준다. 따라서, 중간에 도난당하더라도, 알수없는 문자열로 암호화되어있기때문에 해독할 수 없다.  
2. TLS(전송 계층 보안)프로토콜을 통해서, 데이터 무결성을 제공하여 전송중에 수정되거나 손상되는것을 방지하고 클라이언트가 자신이 의도하는 서버와 통신하고있음을 입증하는 인증기능도 제공하고 있다.
3. 보안상 가산점 및, 안전성 보장으로 SEO에 있어서도 큰 혜택을 본다.

## REST(REpresentational State Transfer)  
웹을 구성하는 자원(resources)들을 고유한 이름으로 구분하여 해당 자원의 정보를 주고받는 것.  
1. HTTP URL(어쩌면 URI가 맞을수도)을 통해 고유한 이름으로 자원을 명시하고,
2. HTTP Method(POST, GET, DELETE, PUT)을 통해 해당 자원에 대한 CRUD를 적용  

### URL vs URI  
  1. URL : 클라이언트가 서버에 요청한 파일!의 디렉토리(위치)  
  2. URI : 해당 자원의 고유 식별값  
예시) http://clooo.loooooo.net/lectures.html(URL) vs http://clooo.loooooo.net/lectures/114(URI)

#### URI는 URL을 포함하고있다.  

### RESTful API  
REST한 방식의 API란, 잘 설계된 API를 말한다.  
  1. 웹을 근간으로 하는 HTTP 기반이다.  
  2. 자원은 URI로 표현하며 말 그대로 고유해야한다.  
  3. URI는 단순하고 직관적인 구조여야 한다.  
  4. 자원의 상태는 HTTP Methods를 활용해 구분한다.  

### API Design  
1. 복수명사를 사용한다(/movies)  
2. 필요하면 URL에 하위 자원을 표현(/movies/23) => URI  
3. 필터조건을 허용할 수 있다(/movies?state=active) => URI  

### 예제

|URI|Methods|설명|
|---|---|---|
|/movies|GET|모든 영화리스트 가져오기|
|/movies|POST|영화추가|
|/movies/:title|GET|title 해당영화 가져오기|
|/movies/:title|DELETE|title 해당 영화 삭제|
|/movies/:title|PUT|title 해당영화 업데이트|
|/movies?min=9|GET|평점이 최소 9 이상인 영화|
  
## HTTP 통신중 CORS ERROR  
API를 활용해 AJAX를 통신하는 과정에서 서로다른 도메인 또는 포트끼리의 요청일 경우 동일출처정책에 의해 CORS ERROR가 발생하게 된다.  
fetch등으로 request가 발생하면, 해당 Api를 제공하는 서버에서(입력한 url) response값을 반환하는데, 해당 서버에서 접속가능한 도메인을 *로 설정하지 않았다면, CORS ERROR가 발생함.  
하지만, 외부 서버를 내가 조작하는것은 불가능하기때문에! 다른방법을 찾아야함  
### 해결방법  
1. 두개의 다른 도메인 혹은 포트의 서버를 자신이 관리하는 경우, 응답해줄 때 header의 Access-Control-Allow-Origin값을 * 또는 특정 도메인을 입력해주면 된다.(*는 모든 도메인으로부터의 요청을 허용이므로 비추천)  
2. JSONP방식. jQuery랑 관련된 것 같아 안쓸생각  
3. Proxy서버를 통한 거쳐오는 방식. react의 cra는 package.json에 proxy서버만 따로 입력해줘도 작동함. 기본적으로 webpack이 구성되어있기 때문.(webpack의 devserver로 proxy설정을 통해 해줄 수 있다는데, node.js로 서버가 연동되어있는 상태에서도 가능한지는 모르겠음. 지금까지는 안되는것같음)  
4. open proxy서버 활용 깃허브에 open proxy서버가 있는데(CORS Anywhere) 해당 주소를 fetch url 앞에 함께 실행시키면 됨.(보안상 문제가 있다고 한다.)  