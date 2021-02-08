---
title : "EC2+NGINX+RDS"
date : 2020-11-11 00:00:00
category : "Study"
draft : false
tag : "AWS"
--- 

## EC2+NGINX+RDS
* EC2로 가상의 컴퓨터를 만들어서, 서버를 구동시키고 AWS의 RDS로 Mysql 데이터베이스를 만든 뒤, EC2 인스턴스와 연결 그리고 NGINX를 프록시서버로 활용하여 80포트로 요청이 들어왔을 때, 숨겨져있는 서버에서 값을 보내주도록 설정해보려고 한다.

### AWS에 로그인 후, EC2 서비스를 검색한다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/1.PNG?raw=true" alt="result1">
</div>

### 가상의 컴퓨터를 인스턴스라고 하며, 인스턴스 시작을 눌러준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/2.PNG?raw=true" alt="result1">
</div>

### 처음 AWS에 가입한 계정이라면, 1년간 프리티어로서 무료로 체험을 해볼 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/3.PNG?raw=true" alt="result1">
</div>

### 가상의 PC(인스턴스) 성능을 설정하는데, 프리티어 전용으로 설정해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/4.PNG?raw=true" alt="result1">
</div>

### 상단의 보안 그룹 구성을 클릭해준다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/5.PNG?raw=true" alt="result1">
</div>

### 각각의 포트를 지정해 준다.(지금생각해보니, Https는 해줄 필요 없었던것 같다..)
* SSH - EC2 인스턴스에 접근을 위한 보안 포트
* HTTP, HTTPS 접근을 위한 포트
* 사용자지정포트 - Node.js 실행 테스트를 위한 3000포트
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/6.PNG?raw=true" alt="result1">
</div>

### 인스턴스 생성을 누르면 키 페어를 생성하는 창이 나온다. 해당 파일을 다운로드 받고, 인스턴스 시작을 눌러준다.
* 인스턴스에 접근을 위한 키인데, 일반 비밀번호 형식이 아닌 `.pem` 파일이다. 이후, 로컬의 터미널에서 접근을 할 때, `permission too open` 이라는 오류가 생길 수 있는데, 해당 피일의 보안에서 권한을 수정해주어야 한다.
* 고급에서 모든 상속을 해제시켜준 뒤, `system`, `administrators`, `owner`(나는 sangmin802로 되어있었다)만 추가하고 이 셋의 권한을 읽기, 읽기 및 실행만 열어준다.
* [.pem파일 권한 에러 해결 Window](https://swiftcoding.org/lightsail-from-window10)
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/7.PNG?raw=true" alt="result1">
</div>

### 생성된 파일의 모습.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/8.PNG?raw=true" alt="result1">
</div>

### 아직 인스턴스가 생성중이라 대기중으로 뜨지만, 생성되면 실행중으로 나올것 이다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/9.PNG?raw=true" alt="result1">
</div>

### 인스턴스 생성.
  * 인스턴스 생성후, 클릭을 하면 퍼블릭 IPv4 DNS(도메인 네임 시스템)과 퍼블릭 IPv4 주소를 잘 기억해주도록 하자.
  * 두가지로 인스턴스에 연결된 웹사이트에 접근할 수 있으며, 로컬 PC로 인스턴스에 접속할 때 DNS주소가 필요하다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/10.PNG?raw=true" alt="result1">
</div>

### 인스턴스 접속
  * 터미널에서 `ssh -i .pem파일 위치 -ㅣ ubuntu IPv4 DNS`를 입력해주고 실행하면 인스턴스에 접속된다.
  * 여기서 위에 pem파일의 권한 문제로 접속이 안될 수 있는데, 위에서 링크해준 주소를 확인해보면 해결방법이 잘 나와있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/11.PNG?raw=true" alt="result1">
</div>

### 확인
  * 주저리주저리 말이 많지만 yes를 입력해 준다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/12.PNG?raw=true" alt="result1">
</div>

### 접속 완료!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/13.PNG?raw=true" alt="result1">
</div>

### Ubuntu 업데이트, Nginx 설치
* `sudo apt-get update`
* `sudo apt-get upgrade -y`
* `sudo apt-get install nginx `
* 위의 설치를 다 하고, 테스트로 nginx를 실행시킨 뒤, 인스턴스의 ip주소 혹은 dns로 접속 시 nginx에서 임시로 제공하는 화면이 나온다.
* `sudo service ngnix start`
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/14.PNG?raw=true" alt="result1">
</div>

### 빌드된 폴더 및 서버 옮기기
* 깃허브 주소를 통해 clone도 가능하지만, 기본적으로 서버의 db는 ignore파일로 안올라가게 설정하기 때문에... FTP를 활용한다고 한다. 
* 나는 더 쉽게 할 수 있는 파일질라가 깔려있어서, 파일질라를 활용했다.
* 세팅에서 SFTP로 들어온다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/15.PNG?raw=true" alt="result1">
</div>

### pem 키 추가
* .pem 키 파일을 추가해준다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/16.PNG?raw=true" alt="result1">
</div>

### 사이트 매니저 설정
* 사진처럼 설정을 해주면 되는데, 이 과정을 통해 pem키를 수동으로 넣어줄 수 있어서 위의 pem 키 추가는 해줄 필요 없더라..
* 그리고 연결!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/17.PNG?raw=true" alt="result1">
</div>

### 파일질라 연결 완료
* 해당 인스턴스의 상태를 확인해볼 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/18.PNG?raw=true" alt="result1">
</div>

### 배포할 서버 및 빌드를 하나의 디렉토리로 묶어서 올려준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/19.PNG?raw=true" alt="result1">
</div>

### Node.js, Npm 설치
* Ubuntu에서 node.js나 npm을 설치하면 구버전으로 설치가 되어, npm install 했을 때 오류가 생길 수 있다.
* `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash`
* `nvm install 10.16.3`
* 해당 명령어를 통해 nvm을 설치해준 뒤, 버전을 확인해보면 높은 버전으로 깔린것을 확인할 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/20.PNG?raw=true" alt="result1">
</div>

### 배포된 서버 실행
* 현재는 node server.js로 실행시켜, 서버가 상시 켜져있지는 않다. 따라서, PM2또한 다운받아, 실행시키면 서버가 상시 켜져있는다.
* 어쨌든, 인스턴스의 ip주소의 3000포트에 잘 실행되고있는것이 보인다.(물론 DNS도 된다.)
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/21.PNG?raw=true" alt="result1">
</div>

### RDS 인스턴스 만들기
* Aws에서 제공하는 데이터베이스 인스턴스이다. 이 또한, 프리티어로 무료로 사용해 볼 수 있다고한다.(근데 11원 청구와있던데)
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/22.PNG?raw=true" alt="result1">
</div>

### 데이터 베이스 생성
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/23.PNG?raw=true" alt="result1">
</div>

### MySQL
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/24.PNG?raw=true" alt="result1">
</div>

### 프리티어
* 이상하게, RDS만 들어오면 좀 렉이 있다. 프리티어 체크 항목 또한 좀 기다리다보면 나온다..
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/25.PNG?raw=true" alt="result1">
</div>

### 설정
* 마스터 사용자 이름과 마스터 암호는 꼭 기억해주도록 하자.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/26.PNG?raw=true" alt="result1">
</div>

### 연결
* 퍼블릭 엑세스 가능을 예 로 바꿔줘야한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/27.PNG?raw=true" alt="result1">
</div>

### DB 포트
* DB 포트는 3306으로 기본적으로 설정되어있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/28.PNG?raw=true" alt="result1">
</div>

### DB 생성
* DB 생성중이며 시간이 좀 걸린다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/29.PNG?raw=true" alt="result1">
</div>

### 보안그룹
* DB가 생성중인 동안, 연결할 EC2 인스턴스의 보안그룹을 수정해주어야 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/30.PNG?raw=true" alt="result1">
</div>

### 인스턴스의 보안그룹
* 사용할 인스턴스의 id와 연결 된 보안그룹을 클릭한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/31.PNG?raw=true" alt="result1">
</div>

### 인바운드 규칙
* 내부에서 접속할 보안포트? 라는것 같다. 외부에서 접속하는것은 아웃바운드라고 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/32.PNG?raw=true" alt="result1">
</div>

### 인바운드 규칙 추가
* MySQL 접속 포트가 될 3306을 추가해준다. 저부분의 소스는 자기만 가능하거나, 저런 입력을 통해 모두 접속 가능하게 할 수 있다.
* 개인 pc ip를 어떠한 공식을 통해 산출된 값을 입력하는것이라고한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/33.PNG?raw=true" alt="result1">
</div>

### DB 인스턴스
* 생성된 DB 인스턴스에서 엔드포인트를 꼭 기억해주도록 하자.
* 우측 보안 그룹을 보면 현재 de로시작하는 보안그룹이 설정되어있다
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/34.PNG?raw=true" alt="result1">
</div>

### 보안그룹 수정
* 보안 그룹 수정을 통해, 연결할 인스턴스와 같은 보안그룹을 사용하도록 설정해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/35.PNG?raw=true" alt="result1">
</div>

### 보안그룹 수정2
* 즉시 변경하기를 누르면 일정시간이 지난 후, 변경된것을 확인할 수 있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/36.PNG?raw=true" alt="result1">
</div>

### DB 확인하기
* 만약, MySQL 워크벤치가 있다면 잘 연결되었는지 확인해볼 수 있다.
* Hostname은 엔드포인트를 입력해주며, Username은 RDS 생성시 입력했던 마스터이름을 써준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/37.PNG?raw=true" alt="result1">
</div>

### DB 접속하기
* RDS생성시 입력했던 비밀번호를 쳤을 떄, 잘 접속이 된다면 통과!
* 만약, 에러가 뜬다면, 오타가 있거나 높은 확률로 보안그룹에서 문제가 있는것이니 잘 확인해보도록 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/38.PNG?raw=true" alt="result1">
</div>

### DB 접속하기 Ubuntu
* `sudo apt-get install mysql-server`
* Ubuntu에 mysql 설치 후
* `mysql -h 엔드포인트 -u -마스터이름 -p`를 입력해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/39.PNG?raw=true" alt="result1">
</div>

### DB 접속 완료
* 아마, 비밀번호를 쳐도 출력이 안될텐데, 눈으로만 안보이는것 뿐이니, 다 쳐주고 엔터를 누르면 접속이 된다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/40.PNG?raw=true" alt="result1">
</div>

### DB 테이블 구성
* DB에서 사용할 테이블을 간단하게 구성해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/41.PNG?raw=true" alt="result1">
</div>

### 인스턴스 DB 설정
* 기존 로컬에서 테스트했던 DB 설정값들을 인스턴스에 맞게 수정해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/42.PNG?raw=true" alt="result1">
</div>

### 확인
* 이후, 서버를 실행해보면
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/43.PNG?raw=true" alt="result1">
</div>

### 확인
* DB연결까지 아주 잘되었다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/44.PNG?raw=true" alt="result1">
</div>
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/45.PNG?raw=true" alt="result1">
</div>

### NGINX 설정
* 해당 위치로 들어간다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/46.PNG?raw=true" alt="result1">
</div>

### NGINX 설정2
* 기본값이 적힌 파일이 있는데, 해당 파일을 지워주고 새롭게 작성해준다.
* 기본값의 내용을 보면, 80포트로 받는 내용밖에 안써져있더라..
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/47.PNG?raw=true" alt="result1">
</div>

### NGINX 설정3
* NGINX는 80포트로 접속이 되고, 해당 포트로 들어왔을 때, 3000포트로 바로 연결해주는 뜻인것 같다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/48.PNG?raw=true" alt="result1">
</div>

### NGINX 설정4
* 문법상 문제가 없는지 확인을 해준다.
* 만약, 문법상에 아무런 문제가없는데도 에러가 생길 수 있다. 그러면 나도모르게 해당 폴더에 다른 설정파일들이 저장했을 수 있으니, `ls`를 통해 확인해보고 나머지는 지워준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/49.PNG?raw=true" alt="result1">
</div>

### NGINX 재실행
* NGINX를 재실행해준다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/50.PNG?raw=true" alt="result1">
</div>

### 완료
* 다시 배포될 폴더에 돌아와, 서버를 실행시켜본다.
* ip주소와, DNS 모두 별도의 포트 입력 없이 바로 화면이 보이게 된다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/51.PNG?raw=true" alt="result1">
</div>
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/11/52.PNG?raw=true" alt="result1">
</div>

### 후기
* NGINX의 리버스프록시 활용이라고 하는데 더 알아봐야 겠다.
* HTTPS 변경은, 도메인 구매 이후 AWS에서 SSH인증을 통해 설정할 수 있다고한다.
* 해당 인스턴스의 IP주소 및 DNS는 인스턴스 새롭게 시작될때 마다 바뀐다. 따라서 탄력적 IP를 생성후 연결하면 고정적인 IP주소를 갖는다.
* NGINX문법이 좀 낯선것 같다..