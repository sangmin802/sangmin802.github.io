---
title : "오리지널 깃"
date : 2020-11-30 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 

# 깃
* 버전관리시스템 깃을 꾸준히 사용해오고있지만, 처음부터 GUI인 깃허브데스크탑을 사용하여 터미널을 활용하는 오리지널은 잘 모른다..
* 또한, 터미널을 사용하지 않고 GUI를 사용할 경우, 편리하지만 실제로 어떻게 작동하는지를 잘 모르며 기능사용에 있어 한정적이기 떄문에 터미널을 사용하는 오리지널 버전을 공부해보기로했다.

## 시작하기
* pc에 기본적으로 내장되어있는 터미널을 사용해도 되지만, 더 편리한 기능을 제공하는 터미널을 사용하고싶다면
  * 맥 : iTerm2
  * 윈도우 : Cmder (깃이 기본적으로 설치되어있음)

## 기본설정
* `git config ~~` 커맨드로 현재 깃의 설정을 할 수 있다.
  * `git config --list` : 리스트로 확인
  * `git config --global -e` : 파일로 확인
  * `git config --global user.name` : 유저명 설정
  * `git config --global user.email` : 유저이메일 설정
  * `git config --global core.autocrlf` : 운영체제마다 에디터에서 줄바꿈을 할 때, 삽입되는 문자열이 다른데(\r, \n), 이러한 차이점때문에 하나의 리포지토리를 다양한 운영체제로 사용할 때 에러가 생길 수 있다. 이것을 통일화시켜주는 명령어다.

## 깃 생성과 제거
* `mkdir git` : 만들 프로젝트 내부에 깃 폴더를 만든다.
* `git init` : 깃을 설치해준다. 깃에 관련된 모든 정보들이 담기는 폴더이다.
* `rm -rf .git` : 깃을 삭제하여, 깃 기능을 제거한다.

## 깃의 WorkFlow
* 깃 히스토리는 로컬에만 저장되기 때문에, Github라는 서버에 push 명령어를 통해 업로드 가능하며, pull로 다운받을 수 있다.

### Working directory 
* `git status` : 현재 진행중인 작업을 표시해준다.
* 현재 작업중인 영역
  * `git add 파일명` : Staging area로 넘긴다
  * `echo 파일명 > .gitignore` : 깃에 저장하고싶지 않은 파일 혹은 폴더
  * `git diff` : 현재 변경된 파일의 내용을 보여준다.
```javascript
  diff --git a/b.txt b/b.txt
  index 12a8798..ec9d6e4 100644
  --- a/b.txt
  +++ b/b.txt
  // 이전버전(Staging area에 있거나, 푸시된) b 파일과, 현재버전의 b 파일을 비교
  ... // 변경된 사항 나옴
```
* `tracked` : 깃이 정보를 알고있는 파일
  * `modified` : 수정이 된 파일 (해당 파일만 Staging area로 넘겨질 수 있다.)
  * `unmodified` : 수정이 되지 않은 파일
* `untracked` : 깃이 정보를 모르고있는 파일
* 처음 파일이 만들어지면 모두 `untracked` 파일이다
* 한번 Staging area로 `add`된 파일은, `tracked`파일이 되서, 이후 수정사항이 생기면 `modified`가 된다.

### Staging area
* 어느정도 작업하다가, 버전 히스토리에 저장할 준비가 되어있는 파일을 옮기는 영역
  * `git rm --cached 파일` : Staging area에 있는 파일을 다시 Working directory로 이동시킬 수 있다.
  * `git commit` : Git directory로 이동시킨다.

### Git directory
* 버전별로 히스토리를 가지고있는 영역
* commit을 통해, Staging area -> Git directory로 옮길수 있다.
  * 해당 commit에는 작성자, 메시지, 날짜, 시간, 버전등이 포함되어있다.
* checkout기능을 통해, 언제든지 특정 버전을 작업중인 영역으로 가져올 수 있다.
* `git log` : commit된 정보를 볼 수 있다.
* `commit`은 부품별로 하는게 좋으며, 같은 내용만 담아야한다
> 이전에, 협업할 때 여러기능 수정한것을 한번에 커밋했었는데, 정말 큰 문제가 있었다 ㅎㅎ



# 참조
* [드림코딩 by엘리 깃, 깃허브 제대로 배우기](https://www.youtube.com/watch?v=Z9dvM7qgN9s)
* 전체적인 흐름을 정리한 것으로, 더 많은 팁은 영상을 통해 확인할 수 있다!