---
title : "React Loa-Hands S3+CloudFront 배포하기"
date : 2020-11-05 00:00:00
category : "Study"
draft : false
tag : "AWS"
--- 

## S3, CloudFront
만들었던 React App을 S3와 CloudFront를 활용하여 배포하려고 한다.

### S3

* AWS회원가입은 별거 없으니 생략!
  * 첫 회원가입이라면 1년동안 몇몇 기능들을 무료로 사용할 수 있다!(S3, EC2, RDS ...)

* 로그인을 하면, 해당 뷰를 볼 수 있는데, S3를 검색하고 들어가자
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/1.PNG?raw=true" alt="result1">
</div>

* S3 검색 후, 우측 상단의 버킷 만들기를 누른다.
  * 해당 기능을 통해, AWS에 가상의 컴퓨터(AWS에서 제공하는 기본 서버를 운용해주는)를 만들어 주는 듯 하다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/2.PNG?raw=true" alt="result1">
</div>

* 버킷의 이름을 지정해주고, 리전을 서울로 해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/3.PNG?raw=true" alt="result1">
</div>

* 스크롤을 내려보면 모든 퍼블릭 엑세스가 차단되어있을 텐데, 차단을 풀어주자.(해당 웹앱을 외부에서 접속할 수 있도록) 풀어주면 하단에 저런 경고창이 뜨는데 싱경쓰지말고 체크해준다.(조금 위화감이 들긴 하더라.)
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/4.PNG?raw=true" alt="result1">
</div>

* 버킷이 생성된 것을 확인!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/5.PNG?raw=true" alt="result1">
</div>

* 버킷의 이름을 클릭하면 현재는 객체가 비어있는것을 확인할 수 있는데, 저곳에 빌드했던 파일들을 넣어줄 것이다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/6.PNG?raw=true" alt="result1">
</div>

* build 폴더가 아닌 build 폴더 내부의 파일, 폴더들을 넣어준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/7.PNG?raw=true" alt="result1">
</div>

* 다 넣었다면 권한탭으로 이동한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/9.PNG?raw=true" alt="result1">
</div>

* 권한 탭에서 스크롤을 내려보면 버킷정책이라는 항목이 있다.
  * 해당 버킷에 대한 접근 허용 및 제한을 JSON형식으로 설정하는 곳 같다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/10.PNG?raw=true" alt="result1">
</div>

* 버킷ARN을 복사한 뒤, 정책 생성기를 누른다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/11.PNG?raw=true" alt="result1">
</div>

* 사진과 같이 설정을 해주고 복사한 버킷ARN을 /*과 함께 하단에 입력해준다.
  * principal : 외부 모두에게 공개할 것이기 때문에 *
  * Actions : 단순히 해당 웹앱을 보는형태이기 때문에 GetObject. 여러 기능이 있긴 한데... 너무많아서 잘 모르겠다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/12.PNG?raw=true" alt="result1">
</div>

* Add Statement -> Generate Policy를 누르면 완성된 JSON이 나온다. 복사를 하고 버킷정책에 붙여넣기해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/13.PNG?raw=true" alt="result1">
</div>

* 이후 나와서 스크롤을 내려보면 ACL 항목이 나온다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/14.PNG?raw=true" alt="result1">
</div>

* 모든사람 에서 읽기만 체크를 해준다!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/15.PNG?raw=true" alt="result1">
</div>

* 속성탭으로 이동해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/16.PNG?raw=true" alt="result1">
</div>

* 우리는 웹사이트이기 때문에 정적 웹사이트 호스팅항목을 찾는다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/17.PNG?raw=true" alt="result1">
</div>

* 인덱스문서와 오류문서를 설정해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/18.PNG?raw=true" alt="result1">
</div>

* 설정이 완료되면 생성된 http로된 주소가 하나 출력된다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/19.PNG?raw=true" alt="result1">
</div>

* 클릭을 하면 잘 접속되는것을 확인할 수 있다.
  * 만약, 깃허브 페이지를 운용하고 있는 리액트 앱이라면, package.json에서 hompage속성을 지워주고 빌드를 해야 script나 css등의 주소가 정상적으로 설정되니 꼭 확인해봐야한다!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 49%" src="/img/2020/11/05/20.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 49%" src="/img/2020/11/05/21.PNG?raw=true" alt="result1">
</div>

### CloudFront
  * .html, .css, .js 및 이미지 파일과 같은 정적 및 동적 웹 콘텐츠를 사용자에게 더 빨리 배포하도록 지원하는 웹 서비스라고 한다
  * CloudFront를 통해 간단하게 정적인 웹 앱을 Https로 변경하여 배포를 할 수 있다.

* aws에서 cloudfront를 검색해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/22.PNG?raw=true" alt="result1">
</div>

* cloudfront 시작하기!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/23.PNG?raw=true" alt="result1">
</div>

* 우리는 웹앱이기때문에 Web에서 시작을 해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/24.PNG?raw=true" alt="result1">
</div>

* Origin Domain Name을 클릭하면 현재 우리가 S3에서 배포했던 버킷을 확인하고 지정해줄 수 있다.
  * 하단에서 Http에서 Https로 리다이렉션 해주도록 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/25.PNG?raw=true" alt="result1">
</div>

* 배포중인 모습이다. 15분정도? 시간이 걸리고 In Progress가 사라지면 배포가 완료된 것이다. 만약 이 불편한 주소가 싫다면 개인 도매인을 구매하여 Domain Name을 변경해 줄 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/26.PNG?raw=true" alt="result1">
</div>

*6.* 나의 경우, 배포된 웹사이트에 접속을 하였을 때 listbucketresult...만 출력이 되었었는데, 기본 루트를 설정해주지 않아 생기는 오류라고 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/27.PNG?raw=true" alt="result1">
</div>

* 따라서 General 에서 편집기능을 켜, Default Root를 index.html로 설정해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/28.PNG?raw=true" alt="result1">
</div>

* 특정 에러 발생시, 이동되는 파일을 지정해 줄 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/29.PNG?raw=true" alt="result1">
</div>

* 해당 앱의 기준 404.html로 이동해주도록 했다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/30.PNG?raw=true" alt="result1">
</div>

* 모든 설정들이 적용된 웹앱이 배포되었다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/05/31.PNG?raw=true" alt="result1">
</div>

* Https로 잘 배포된 모습을 볼 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 49%" src="/img/2020/11/05/32.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 49%" src="/img/2020/11/05/33.PNG?raw=true" alt="result1">
</div>