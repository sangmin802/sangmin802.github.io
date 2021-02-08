---
title : "Node.js, Mysql, EC2, RDS"
date : 2020-11-07 00:00:00
category : "Study"
draft : false
tag : "AWS"
--- 

## EC2, RDS
* EC2는 AWS의 가상의 PC를 만들어 내가 만든 서버 및 웹사이트를 배포하는 역할을 하는것 같다.
* RDS는 AWS에 데이터베이스를 올리는듯한 느낌?

## 결과
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="/img/2020/11/07/ec2.PNG?raw=true" alt="result1">
</div>

## 후기
* EC2 인스턴스를 생성하면 접근할수 있는 key가되는 pem파일을 하나 준다. 
* 해당 파일을 통해 생성된 EC2 인스턴스에 접속할 수 있게 되더라. 여기서 Ubuntu라는것을 처음 접하게되었는데, 좀 알아봐야할듯.. 무슨역할을 하는지 모르겠다.. 그냥 커맨드이 있어서 따라 쳤을 뿐..
* 해당 인스턴스는 현재 비어있는 PC이기때문에 node.js, npm, mysql등을 설치해줘야 한다.
* 그리고 나는 파일질라를 통해 있던 앱들을 인스턴스로 옮겼는데, ftp? 방식도 있는듯 하다. 옮길 때에는 인스턴스의 public ip를 활용하여 연결하니, 해당 인스턴스의 내부를 볼 수 있더라.
> 여기서 정말로 원격으로 가상의 PC를 하나 운영한다는 느낌을 받았다.
* 그리고 nginx를 사용하여 중간 프록시 역할을 하도록 했는데, 이 nginx를 통해 http -> https 리다이렉션도 가능하다고 한다. 다음에 처음부터 다시 구현하면서 해봐야 겠다.
* 해당 웹 앱은 mysql이 연동되어있었기 때문에, RDS 인스턴스도 생성했는데, 종종 ec2에 그냥 mysql을 설치하는 경우도 있다고 한다.
* RDS를 생성하는것은 크게 어려움이 없지만 ec2와 RDS에 올라간 db를 연동할 떄 보안설정이 매우 중요하더라(동일하게 해줘야 했음).. 이것때문에 많이 애먹은...
* 당연히 node.js에서 db 커넥트 설정부분 또한 host나 name들을 ec2 설정에 맞게 변경해줘야 하더라

> 모든 과정을 처음부터 다시 해봐야 겠다

## 낯선 용어들
* ssh, Ubuntu 처음들어봤다. 알아봐야할듯..?


## 참고한 사이트들
* [node.js ubuntu nginx](https://velog.io/@pinot/AWS-Ubuntu%EB%A1%9C-nginx-reverse-proxy-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)
* [node.js ubuntu nginx](https://velog.io/@rheey90/AWS-EC2-Node.js-%EC%84%9C%EB%B2%84-%EB%B0%B0%ED%8F%AC)
* [node.js ubuntu nginx](https://velog.io/@new_wisdom/AWS-EC2%EC%97%90-Node.jsExpress-pm2-nginx-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)
* [rds mysql 인스턴스 생성](https://hoons-up.tistory.com/44)
* [rds ec2 보안설정및 연동](https://developer88.tistory.com/303)
* [rds ec2 보안설정및 연동](https://hoontae24.github.io/posts/10)
* [rds ec2 보안설정및 연동](https://blog.naver.com/zion830/221396511803)