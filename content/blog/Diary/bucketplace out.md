---
title: '버킷플레이스 - 오늘의 집 불합격'
date: 2021-03-08
category: 'Diary'
draft: false
---

<div style="margin : 0 auto; text-align : center">
  <img src="http://www.bloter.net/wp-content/uploads/2018/10/open_graph_icon_2-2.jpg" alt="bucketplace">
</div>

## 불합격!

2월 23일 오늘의 집 프론트엔드 개발 서류전형 통과.
<br>
2월 25일 과제제출
<br>
3월 2일 불합격 통보.

<br>

이전 `Class101`에서 받은 피드백을 기억하며, 최대한 디렉토리 구조나 독립적인 컴포넌트를 사용하려고 노력했다.

그리고, 과제물을 완료했을 때, 확실히 이전보다 가독성도 좋고 몇몇 필수적인 이유가 아니라면 대부분 의존성이 없는 컴포넌트로 구성되어있었다.

> 음음 확실히 좋아졌다.

한편으로 자신있었기 때문에, 자신감이 있었지만 결과는

<div style="margin : 0 auto; text-align : center">
  <img src="/img/share/ddang.jpg?raw=true" alt="ddang">
</div>

아쉽다. 자신있었는다.

당연하게도 피드백 요청을 부탁드렸다.

말 그대로 **부탁**이다. 사실상 떨어진 지원자에게 기업이 굳이 피드백을 해줄 필요는 없었기 때문에..

> 그래서 이전 `Class101` 개발팀 분들에게는 너무 감사함을 느끼고 있음

## 피드백을 받았다

3월 8일 피드백 메일이 도착했다. 사실 한 1주일가량 지났기 때문에, 아 안되나보다 했지만 늦어서 죄송하단 말과 함께 피드백이 도착했다.

> 의무가 아니였는데 뭐가 죄송하시다는건지.. 그저 감사할 따름이다.

<div style="margin : 0 auto; text-align : center">
  <img src="/img/2021/03/08/2.PNG?raw=true" alt="bucketplace_feedback">
</div>

## 피드백 정리

1. 컨벤션이 일정하지 않고 안티패턴으로 네이밍 되어 있습니다.
2. `InfiniteScroll`은 재활용 할 수 없도록 구현되어 있습니다.
3. 사진 컴포넌트 키에 `index`를 사용하고 있습니다. `index`보다는 사진 아이디를 사용하는것이 더 나은 방법입니다.
4. `action`과 `saga`는 서로 의미가 다르모르 분리되는게 더 나아보입니다.
5. 시멘틱 마크업으로 작성되어 있지 않습니다.
6. `Redux`를 사용하였지만 책임에 대한 분리가 제대로 되어있지 않습니다.

대략적으로 문제를 보면, 자주 사용되어욌지만, 사실상 가독성이나 이후를 생각해보았을 때, **좋지않은 프로그래밍 습관**

> `;`을 빼먹는다거나 `if`문 등에서 중괄호 뒤에 소괄호를 사용하지 않는다거나 .. 등등

`Redux`에있어서, 소규모 프로젝트에서는 괜찮겠지만 규모가 커지게 된다면 발생할 수 있는 가독성 문제

대체적으로 가독성을 위한 **코딩스타일** 혹은 **기능별 분리**인듯 하다.

아 이게 참 쉽지않네..