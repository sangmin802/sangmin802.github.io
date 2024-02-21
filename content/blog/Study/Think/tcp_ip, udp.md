---
title: TCP/IP
date: 2023-06-28 14:31:00
category: 'Study'
draft: false
tag: 'Think'
---

cloudflare에서 http3에 대한 글을 읽다가, 자주 언급되는 몇몇 용어들때문에 이해가 잘 안되어서 조금은 이해해보고자 알아보게 되었다.

> A를 읽다가, A 내부의 B를 알아보게 됨. 늘 이러는것 같음 ㅎ

## TCP/IP

우편물을 보낼 때, 주소, 우표등등을 부착해야 하는것 처럼 컴퓨터 네트워크간 정보를 전송하고 수신할 때 사용되는 일종의 규칙을 TCP(전송)/IP(인터넷) 모델이라 함

TCP는 전송 제어 프로토콜 (Transmission Control Protocol)의 약자이며 한 기기에서 다른 기기로 데이터 전송하는 것을 담당

IP는 인터넷 프로토콜(Internet Protocol)의 약자이며 이 프로토콜은 데이터의 조각을 최대한 빨리 대상 IP 주소로 보내는 역할

- [참고](https://nordvpn.com/ko/blog/tcp-ip-protocol/)

## 네트워크 발전 / 확장 과정

- [주니어개발자 네트워크 이야기](https://yozm.wishket.com/magazine/detail/1875/)
- [스위치, 허브, 라우터](https://www.itworld.co.kr/tags/1354/%EC%8A%A4%EC%9C%84%EC%B9%98/167585)

1. 네트워크 등장
2. 네트워크간 공유를 위한 허브 등장
3. 네트워크간 올바른 형식을 통한 공유를 위해 프로토콜 등장
4. 허브 특징으로, 하나의 요청이 허브에 연결된 모든 네트워크에 전달되는 문제가 있어 특정 네트워크로 보내는 대상을 설정할 수 있는 스위치 등장
5. 1~3 과정으로 지역네트워크 LAN 형성
6. 지역네트워크가 다른 지역네트워크간 요청, 수신을 위한 라우터 등장
7. 5 과정으로 광역 네트워크 WAN 형성

## 표준 프로토콜 TCP/IP 기반의 캡슐화

- [우편을 통한 예시](https://yozm.wishket.com/magazine/detail/1906/)
- [각 계층 예시](https://yozm.wishket.com/magazine/detail/1956/)

요청을 하고, 응답받기까지는 여러번의 캡슐화, 역캡슐화 작업이 동반됨.

> 같은 지역 네트워크인 LAN 내부에서의 통신과 LAN 이상인 지역 네트워크 간인 WAN의 경우 캡술화 과정이 차이가 좀 있음.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/06/28/tcp-ip.png?raw=true" alt="tcp-ip">
</div>￼

### 정확한 주소를 찾기 위한 과정 port < ip < MAC

1. 사용자의 기기 (컴퓨터, 휴대폰 etc..)가 네트워크에 접속하기 위해서는 접속한 고유한 주소를 알려주기 위해 NIC(network interface controller) 기기가 필요함
2. 고유한 NIC 주소를 표기하기 위해 대체로 이더넷 프로토콜(하나의 인터넷 회선에 유/무선 통신장비 공유기, 허브 등을 통해 다수의 시스템이 랜선 및 통신 포트에 연결되어 통신이 가능한 구조)를 사용하며, 이 이더넷 프로토콜은 MAC(media access controller)을 사용하여 주소를 표기함
   1. [MAC 구성](https://velog.io/@moonblue/MAC-%EC%A3%BC%EC%86%8C-Media-Access-Control-Address)
   2. 12자리, 16진수(0-9, A-F)로 표기된다 함 01:23:45:67:89:AB
   3. 이 MAC 주소는 네트워크 장치에도 있다고 함(스위치, 라우터 …)

ip-ip간 통신으로 크게 알고있긴 하지만, ip 주소를 MAC 주소로 바꾸기 때문에 사실 MAC-MAC 통신이라고 함 (이 과정이 캡슐화?)

요청이 전달되기까지

1. 크롬과 같은 응용프로그램에서 프로토콜 규칙에(http) 맞는 요청이 생성됨 `(1단계: 응용 계층) (HTTP)`
2. 생성된 요청을 어떤 포트에 전달할 지 발신포트 / 수신포트 를 명시해주기 위해 응용프로그램 -> 운영체제(윈도우, 맥 etc…)에게 넘겨줌 `(2단계: 전송 계층) (4계층 TCP)`
3. 좀 더 정확한 목적지를 찾기 위해 고유한 IP(네트워크)를 명시해줌 `(3단계: 인터넷 계층) (3계층 IP)`
4. 어떤 NIC 주소를 쓰는지 번호(MAC)를 통해 표기하여 도달해야할 위치를 더 명확히 해줌 `(4단계: 네트워크 엑세스 계층) (2계층 MAC)`
5. 위 단계를 통해 운영체제(윈도우 맥 etc…)가 요청 데이터를 캡슐화 함
6. 캡슐화된 데이터를 유,무선을 통해 네트워크로 전달함
7. 캡슐화된 데이터는 네트워크를 돌아다니며 스위치, 라우터와 같은 네트워크장치에 의해 역캡술화되어 주소를 읽는등의 행위를 거침

- 스위치는 네트워크 엑세스 계층에서 캡슐화 된 MAC 형식의 주소번호 까지 역캡슐화 할 수 있기 때문에 스위치는 2계층장비
- 라우터는 인터넷 계층에서 캡슐화된 ip까지 역캡슐화 할 수 있기 때문에 라우터는 3계층 장비라 함

이게 스위치를 거쳐서 MAC 캡슐이 역캡슐되고 나머지만 라우터로 전달되고는 등은 아니라는것 같음.

- 스위치: MAC 주소를 통해 같은 네트워크 안에서 주소 찾기
- 라우터: IP주소를 통해 다른 네트워크 주소 찾기

MAC 주소는 해당 기기(컴퓨터 etc…)의 NIC 기기를 통해 생성되는 고유 주소이기 때문에 변동될 일 없다는것 같음

ip는 네트워크에 연결된 기기의 운영체제가 가지고있는 주소이기 때문에 변동될 수 있음(wifi 등 연결이 끊기면 ip 검색해도 조회 안됨)

Ipv4 구조에서, 네트워크아이디와 호스트아이디가 조합되는데, a.b.c.d 이런 형식의 Ip 구조에서 abc까지는 네트워크아이디가 될 수 있음. 나머지는 모두 호스트 아이디라 함.

모두 호스트아이디로 개별관리되기에는 어려움이 있어, 네트워크아이디로 그룹을 하고 나머지 호스트아이디만 개별관리하기 위함.

연결된 기기마다 호스트아이디가 다른건 당연한거고, 네트워크아이디가 동일한지를 확인하는게 의미있을듯

> 예로, A 그룹 기준 동일한 네트워크 아이디라면 같은 네트워크상에 있다는 것.

앞 그룹이 얼마나 작냐에 따라 동일 네트워크를 사용하고있는 호스트들을 가질 수 있는 경우의 수가 늘어나는 방식일까..?

앞의 3개반 사용하는 A 그룹이 가장 많이 가질 수 있겠지..?

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2023/06/28/network-id.png?raw=true" alt="network-id">
</div>￼

같은 네트워크 동네라면 MAC 주소를 통해 정확한 위치를 찾을 수 있음. 그런데, 다른 네트워크 동네 라면 MAC주소만으로는 찾기 어려움. 왜? 그 다른 네트워크 동네의 주소를 알아야 그 동네로 들어가서 MAC 주소로 찾으니깐

- [네트워크 아이디, 호스트 아이디 1](https://dlgkstjq623.tistory.com/347)
- [네트워크 아이디, 호스트 아이디 2](https://sjquant.tistory.com/59)

## 정리해보기

- [캡슐화된 네트워크 정보 전달](https://yozm.wishket.com/magazine/detail/2005/)

위 링크와 이전 내용들을 정리해보면

1. 캡슐화된 데이터가 네트워크에 진입을 하면 여러 네트워크 장치들에 의해 역캡슐화되고, 새롭게 캡슐화되는등 하여 주소를 찾아감.
   - 응용(http) > 전송(TCP) > 인터넷(IP) > 네트워크(MAC)
2. 스위치 장치가 데이터캡슐을 확인하면, 본인에게 등록되어있는 MAC 주소인지 확인을 함.(2계층장비이기 때문에, 네트워크 엑세스 계층까지만 역캡슐 가능하여 MAC 주소 확인)
   - 본인에게 등록되어있는 MAC 주소라면, 동일한 네트워크를 사용하고있는 도착지이기 때문에 등록된 MAC 주소로 요청을 전달해줌
   - 본인에게 등록되어있지 않은 MAC 주소라면, 자신과 연결된 게이트웨이(라우터) MAC 주소를 조회하여, 그 라우터로 해당 데이터캡슐을 전달함. 라우터도 스위치와 연결되어있는데, 라우터 자체도 기기이기 때문에 MAC 주소를 갖고있음. 따라서, 스위치가 라우터에게 데이터캡슐을 전달해줄 수 있음.
3. 스위치가 연결된 기기들의 MAC 주소를 테이블화 하야 갖고있는것처럼, 라우터도 본인에게 연결된 네트워크들의 주소를 테이블화 하여 갖고있음.
4. 라우터는 3계층 장비기이 때문에, 자신에게 온 데이터패키지의 목적지 MAC 주소가 본인임을 확인함과 함께, ip 계층까지도 역패키지 가능하여, 최종 목적지의 ip주소를 확인함. 하지만, 이 때 라우터는 목적지의 ip는 알고있지만, 더 정확한 목적지 MAC 주소는 알지 못하는 문제가 있음.(MAC 주소에 라우터 본인의 MAC주소가 있었기 때문)
5. 최종 목적지의 ip를 기준으로 MAC 주소를 찾는 ARP 방식을 사용하는데, 스위치 테이블에 연결된 모든 기기들에게 ARP프레임을 전달하고, 목적지 ip와 동일한 기기만이 MAC주소를 입력하여 다시 돌려줌
   - 이게 가능한것이, 목적지의 ip를 작성해줄 때, 네트워크 아이디, 호스트 아이디를 조합하여 고유한 아이디를 찝어서 요청을 보내기 때문에, 이것을 기준으로 기기의 MAC 주소를 확인할 수 있다 함
6. 정확한 MAC 주소를 전달받았다면, 해당 목적지로 요청을 전달해줌.

- [위 블로그의 마지막 챕터 참고](https://yozm.wishket.com/magazine/detail/2055/)
- [http, tcp](https://velog.io/@sa1341/HTTP%EC%99%80-TCP%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90)

## UDP, quic 관련 링크

`cloudflare http3 프로토콜에서 TCP가 아닌, quic기반의 UDP를 사용한다` 가 위 글의 시작점이였음.

정리를 조금 하고 다시 읽으면 공식문서 자체도 충분히 잘 나와있어서.. 링크만 달아두고자 한다.

> 추후 가능하다면 이것도 정리!?

감히 요약해보자면

- TCP 프로토콜 사용 시, Tcp handshake -> tls handshake 순으로 인증이 먼저 되어야 함.
- 하지만, 기존 tcp, tls handeshake의 과정이 없이 빠른 네트워크 전송 속도를 가진 udp 기반의 quic 프로토콜이 있다 함. http3는 그 방식을 사용함
- tls 인증과정이 없기 때문에 보안문제있는거 아닐까 하지만 tls와 동일한 수준의 보안을 갖고있다 함. 그래서 서버의 포트도 기존 tls인증 기반의 서버와 동일하게 443 포트라는것 같음.

- [quic](https://sol2gram.tistory.com/37)
- [cloudflare http3](https://www.cloudflare.com/ko-kr/learning/performance/what-is-http3/)