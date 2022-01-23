---
title: '🌿git flow 브랜치 전략을 사용하여 안전하게 프로젝트 관리해보기'
date: 2021-08-30 12:53:00
category: 'Study'
draft: false
tag: 'Think'
---

프로젝트는 첫 제작이 완료되었을 때 종료되는것이 아니라, 새로운 시작이라고 보는것이 맞는것 같다.

새로운 기능이 추가되고, 버그를 수정하고, 성능향상을 위해 보수작업을 하는점에서 말이다.

하나의 프로젝트에 여러 사람이 함께 작업을 하다보면 각각의 생각과 습관 스타일들이 코드에 묻어나게 되는데 그러한 차이를 나쁘다고 하는것이 아니라 하나의 공통된 규칙을 갖고, 코드를 리뷰해볼 필요도 있다.

여러 변경사항을 하나의 프로젝트에 병합하고, 이전 코드들에 대한 기록을 남기는 등 개발 환경에 있어 협업을 위해 큰 도움을 주는것이 로컬 저장소의 `Git` 원격 저장소인 `Github`이다.

## Git flow

깃 플로우를 검색하면 가장 많이 나오는 그림이 있다.

<div style="text-align : center">
  <img src="/img/2021/08/30/1.png?raw=true" alt="1">
</div>

처음에 그림을 보았을 때에는 무엇을 의미하는지 이해가 되지 않았지만, 실제로 적용해보니 어느정도 감이 잡히는것 같았다.

### master

실제로 배포되고 있는 소스가 저장되어있는 브랜치 이다.

### develop

실제로 배포되고 있는 소스가 아닌, 새로운 기능들이 추가되고있는 브랜치이다.

> 불완전하지만, 가장 최신의 소스라고 보는것이 맞는것 같다.

### feature

`develop`브랜치가 새로운 기능들이 추가되고있는 하나의 굵은 소스라고 보았을 때, 그 새로운 기능들이 실제로 생성 되는 브랜치라고 보면 될 것 같다.

> 로그인기능 개발, 팝업기능 개발 등등

### hotifx

배포가 되고 있는 `master` 브랜치의 소스에서 긴급한 버그가 발생하였을 때, 급하게 수정을 하여 반영하는 브랜치 라고 한다.

생각해보면, 갑자기 발생한 에러를 `develop`에서 반영한다고 하면, 다음 업데이트가 있을 때 까지 버그가 수정되지 못할 뿐더러, 바로 수정하더라도 작업중인 기능들이 완성되지 못한 채로 남을 수 있기 때문인것 같다.

### release

`develop`브랜치로 새롭게 업데이트 되는 소스들이 모두 정리된다면, 테스트 등을 진행하는 브랜치라고 한다.

## 과정대로 진행해보기

<div style="text-align : center">
  <img src="/img/2021/08/30/2.PNG?raw=true" alt="2">
</div>

글로 기록하기 전, 실제로 반영을 해본 결과물이다. 간단한 수정을 통해 과정을 다뤄보도록 하자.

명령어 위주가 아닌 과정을 중점으로 알아보기위해 소스트리를 사용하였다.

### master, develop 따오기

<div style="text-align : center">
  <img src="/img/2021/08/30/3.PNG?raw=true" alt="3">
</div>

만약, 개인 프로젝트라면 개인 프로젝트를 연결해주고, 이미 생성되어있는 프로젝트가 있다면, `fork`, `clone`의 과정을 거쳐서 가져오도록 한다.

> 이미 진행중인 프로젝트라면 이 첫 과정이 진행된 상태일 수 도 있다.

진행중인 프로젝트가 아니라면 처음에는 `master` 브랜치만 존재하는 상태일 것이다.

소스트리의 우측 상단에 있는 깃 플로우를 눌러서 기본 브랜치들을 생성해주도록 하자.

<div style="text-align : center">
  <img src="/img/2021/08/30/4.PNG?raw=true" alt="4">
</div>

앞으로 생성되는 브랜치들의 기본 접두어를 설정해줄 수 있다.

딱히 뭘 수정할 필요 없이 확인을 눌러주자.

<div style="text-align : center">
  <img src="/img/2021/08/30/5.PNG?raw=true" alt="5">
</div>

`master`, `develop` 브랜치가 생성됨을 확인해 볼 수 있다.
이때, `master`는 원격과 로컬 둘 다 존재하는 상태이지만, `develop`은 로컬에만 생성된 것이니 `push`를 통해 나의 원격에도 브랜치를 생성해주도록 하자.

### 기능 추가를 위한 feature

현재 배포되고 있는 소스인 `matser`와 개발이 이뤄지고 있는 `develop`브랜치를 모두 로컬에서 확인할 수 있게 되었다.

앞으로 우리는 `develop`브랜치에서 필요한 기능들을 추가적으로 개발을 하기 위해 `feature` 브랜치를 생성해야 한다.

아까와 마찬가지로 우측 상단의 `깃 플로우` 버튼을 누르면 이번에는 예상된는 동작을 제시해주는 팝업이 활성화 된다.

<div style="text-align : center">
  <img src="/img/2021/08/30/6.PNG?raw=true" alt="6">
</div>

새로운 기능을 추가하기 위함이기 때문에, `새 기능 시작`을 눌러주고 적합한 기능명을 작명해주도록 하자.

<div style="text-align : center">
  <img src="/img/2021/08/30/7.PNG?raw=true" alt="7">
</div>

확인을 누르면 `feature`브랜치에 작명한 세부 브랜치가 생성된것을 볼 수 있다.

> `feature`브랜치는 여러 개발자가 함께 비슷한 기능을 개발하기 위해 원격에 생성되어있을 수 도 있고, 로컬에만 생성될 수 도 있다고 한다.

<div style="text-align : center">
  <img src="/img/2021/08/30/8.PNG?raw=true" alt="8">
</div>

새로운 기능을 위한 소스코드를 작성하고, 필요아 따라 구분지어 해당 로컬 브랜치에 커밋을 할 것이다.

<div style="text-align : center">
  <img src="/img/2021/08/30/9.PNG?raw=true" alt="9">
</div>

새로운 기능 추가 및 커밋까지 완료가 되었다면 해당 브랜치는 역할을 마무리하였기 때문에 아까의 `깃 플로우` 버튼을 눌러 기능 마무리를 시켜주도록 하자.

<div style="text-align : center">
  <img src="/img/2021/08/30/10.PNG?raw=true" alt="10">
</div>

### develop 병합

로컬 `develop`과 `feature`을 병합해주기 전, 나보다 먼저 작업이 완료된 다른 개발자들의 변경사항이 반영된 원격 `develop`에 반영되었을 수 있기 때문에, `pull`을 사용하여 로컬 `develop`을 최신화 시켜주고 병합 하도록 하자.

위에서 마무리를 시켜주게 될 경우, 로컬의 `develop`에 `feature` 브랜치의 작업내용들이 병합되고, 해당 브렌치는 자동으로 제거가 된다.

<div style="text-align : center">
  <img src="/img/2021/08/30/11.PNG?raw=true" alt="11">
</div>

아직 로컬의 `develop`에만 병합이 이루어졌기 때문에, 나의 원격에있는 `develop`에도 병합된 커밋들을 반영시켜줄 필요가 있다.

<div style="text-align : center">
  <img src="/img/2021/08/30/12.PNG?raw=true" alt="12">
</div>

나의 원격 `develop`에 변경사항을 `push`해준다.

<div style="text-align : center">
  <img src="/img/2021/08/30/13.PNG?raw=true" alt="13">
</div>

### pull request 작성

나의 원격 `develop` 브랜치에는 로컬에서 작업한 새로운 기능들이 추가된 상태이다.

따라서 아래와 같이 변경사항에 대해 `pull request`를 작성할 수 있는 알림이 뜰 것이다.

<div style="text-align : center">
  <img src="/img/2021/08/30/14.PNG?raw=true" alt="14">
</div>

개발한 기능에 대해 간략하게 설명하는 글들을 작성하고 `request`를 보내도록 한다.

> 현재는 개인 프로젝트라서 바로 나의 원격 `master` 브랜치에 보내도록 하였다.

> 아마, 협업을 하여 `clone`해온 상태라면 나의 원격 `develop`에서 원본 원격 `develop`으로 요청을 보내는 형태일 것이다.

<div style="text-align : center">
  <img src="/img/2021/08/30/15.PNG?raw=true" alt="15">
</div>

요청한 `request`는 아래와 같이 확인을 할 수 있고, 적절한 코드리뷰등을 통해 최종 승인권한자가 `pull request`를 승힌하게 될 것이다.

<div style="text-align : center">
  <img src="/img/2021/08/30/14.PNG?raw=true" alt="14">
</div>

최종적으로 승인이 된 `request`를 확인할 수 있다.

### merge 종류

- [git merge 종류](https://meetup.toast.com/posts/122)
  - merge : 브랜치에 기록된 모든 커밋을 유지한 채로 병합함
  - squash : 브랜치에서 작업한 커밋들을 단 하나의 커밋으로 묶어서 병합함.
    > 브랜치에 기록된 지저분한? 누적된 커밋들을 정리하여 병합하는 느낌

`dev` -> `master`는 일반머지나 rebase머지가 좋다고 함.
장기 유지중인 브랜치 간 squash는 conflict가 발생한다는것 같음.

- [squash and merge conflicts](https://stackoverflow.com/questions/55113672/git-conflicts-after-squash-merge/55113815)

### 로컬 최신화

만약 `fork`를 통해 루트 프로젝트를 가져와서 개발을 하는 상황일 경우, 내 로컬의 개발 환경을 최신상태로 유지할 필요가 있다.

> 작업을 완료 하고, 나의 `origin`으로 `push`하기 전

이런 상황의 루트 프로젝트를 `upstream`이라고 부르며 해당 저장소를 원격 저장소에 추가를 해줄 필요가 있다.

1. 저장소 - 원격저장소에 경로 추가
   - 대부분 이름을 `upstream`이라고 한다 함
2. 좌측 원격탭의 `upstream`에서 가져오기 진행
   - `upstream repository`에 생성되어있는 브랜치들도 하위에 모두 표시되니, 현재 브랜치에 맞는 `upstream` 브랜치에서 `pull` 해야함
   - 개인 프로젝트라면 프로젝트에서 최신 개발환경을 갖고있는 브랜치
3. 만약, `upstream`에서 가져오려는 중, 작업해놓은 코드들이 커밋 대기중인 상태라면 작업해놓은 코드들을 `stash`에 저장해놓은 다음 `upstream`에서 `pull`한다.
   - 커밋을 해도 무방한것 같음. 단 `push`는 절대 ㄴㄴ
   - 이전 커밋과, `pull`하여 추가될 커밋중 충돌되는 부분이 있다면 해결이 필요한 부분이라고 보여줌
4. 이후 `stash`에 저장해놓은 코드를 다시 현재 브랜치로 가져오고, 충돌 파일은 직접 합치기
   - `stash`에 저장을 하고 최신 개발 환경을 `pull`하던, 커밋을 먼저 하고 `pull`하던 상관없지만, `origin`에 `push`하기 전에 최신 개발 환경을 `pull`하는것이 정말 중요한듯.
   - 동일 파일 내 변경사항이 있거나, `pull`한 브랜치에서 업데이트된 내용이 있다면 충돌이 발생할 텐데(대부분 생기는 듯), 잘 병합해주면 큰 문제 없음
5. 업데이트 한 `branch`를 `origin branch`으로 `push`한다음, 최종적으로 병합되어야 할 브랜치에 `pull request`를 생성하여 전달함.
   - `pull request`를 생성할 때, `upstream`의 브랜치, 자신의 브랜치 등 모든 브랜치를 선택할 수 있음
   - 당연히, 동일 `branch`로는 전달 x, 대상 브랜치랑 차이가 없을 경우에도 변화가 `pull request`가 작성되지 않는다.

### merge

`git merge branchname` 현재 브랜치에 이후에 기재된 브랜치의 변경된 커밋내용들을 하나로 묶어서 병합한다.

이 때, 이후의 브랜치와 `fast-forward`의 관계라면 그냥 따라가는 형식으로 동등한 위치에 서게되어 병합되었다는 커밋메시지를 남길 수 없기 때문에(새로운 커밋추가가 아니라 그냥 따라가는 느낌) 대부분 의도적으로 `git merge --no-ff branchname`를 통해 한단계 추가된 커밋을 남기는 편 이라고 한다.

#### fast-forward

별다른 커밋이 추가될 필요 없이 이후 커밋의 위치에 동등하게 이동할 수 있는 상태를 의미하는것 같다.

대체로 병합과 같은 작업을 수행하였을 때 있는 일인데, 병합을 하였다는 커밋 메시지를 남기기 위해 `--no-ff`를 통해 `fast-forward`작업이 아닌 커밋을 남길 수 있도록 한다는것 같다.

### rebase

`git rebase branchname` 현재 브랜치에 있었던 변경된 커밋내용들을 이후에 기재된 브랜치의 커밋 변경사항들 뒤에 이어붙인다.

마치 이후에 기재된 브랜치에서만 작업을 한 것 처럼 보여진다.

> 솔직히 아직까지 필요를 잘 모르겠다.

## release

변경된 모든 작업이 반영된 `develop`브랜치를 기준으로 `release`브랜치를 `checkout`한다.

이때 발생하는 버그들은 `release` 브랜치에 바로 반영하고, 마찬가지로 `develop`브랜치에도 `merge` 해준다.

```js
;`git checkout devlop` || ;`git checkout release`
;`git merge --no-ff release/fixes`
```

`release`브랜치의 작업이 완료되면 `master`브랜치에서 `merge`해간다.

```js
;`git checkout master`
;`git merge --no-ff release`
```

배포용 `release`가 병합된 `master`브랜치에 해당 `release`의 번호인 `tag`를 달아주도록 한다.

## hotFix

만약, 배포된 상태에 긴급한 버그가 발생했다면, `master` 브랜치에서 바로 `hotfixes`라는 브랜치를 따서 작업을 하고, `master`브랜치에 직접 병합하고 소수를 추가하여 태그명을 업데이트한다

> 1.1, 1.2 ...

당연히 `hotfixes` 브랜치는 개발중인 `develop`브랜치에도 병합된다.

## 아쉬웠던 점

개인 프로젝트를 가지고 진행하였기 때문에 중간중간 정확하지 않은 부분이 있을 수 있다.

> 특히 `pull request` 단계의 경우, 외부 블로그의 글이나 다른 방식으로 테스트해본걸 기반으로 작성되었다.

이러한 과정을 통해 최대한 원본의 소스코드에 직접적인 수정이 바로바로 이뤄지는것을 막아서 최대한 안전하게 작업을 진행하고자 하는 느낌이 들었다.

또한, 최종 소스코드에 병합하기 전 기존의 규척이나, 적합하지 않은 방식으로 생성된 코드를 리뷰하여 사전에 수정과정을 거칠수 있다는 점 또한 큰 이점인것 같다.

완벽히 동일한 환경에서 해보지 못한점은 아쉽지만, 흐름에 대한 이해에는 큰 도움이 된 것 같다.

## 참고

- [git flow 적응기](https://jeong-pro.tistory.com/196)
- [우아한 형제들 git flow](https://techblog.woowahan.com/2553/)
- [git flow 생활코딩](https://www.youtube.com/watch?v=EzcF6RX8RrQ)
