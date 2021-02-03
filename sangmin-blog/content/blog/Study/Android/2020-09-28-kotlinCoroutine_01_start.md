---
title : "Kotlin Coroutine"
date : 2020-09-28 00:00:11
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Coroutine'
  - nav : Coroutine
--- 
## Coroutine
### 🧐왜?
* 얼마전 `Kotlin` 앱을 하나 만들어보는 과정에 `Http`통신을 하게되었는데, 알수없는 에러가 계속 뜨더라..

### 😬이런이유가..
* 앱에서 `Http`통신을 할 때에, `Main thread`에서 진행을 할 수 없기때문에 콜백등을 활용하여 다른 별도의 `thread`에서 작업을 해야한다더라..
* 근데 프론트에서 많이 겪어보았듯이.. 콜백지옥.. 그러던중 `Promise객체`처럼 동기, 비동기작업을 도와주는것이 있지않을까 알아보던중 `Coroutine`을 알게되었다.

### Coroutine?
* 여러개의 루틴들이 협동하여 모여있는것이 코루틴이다.
* 코루틴은 이전에 자신의 샐행이 마지막으로 중단되었던 지점 다음장소에서 실행을 재개한다.

1. 일반루틴 : 진입한번, 종료한번
2. 코루틴 : 진입, 중단 - 재개, 중단 - 재개, 종료

### Coroutine 등장배경
1. 꿈의코드1

```javascript
  val user = fetchUserData()
  textView.text = user.name
```
* `Http`통신을 통해 값을 받아오고, 그 값을 토대로 작업 진행.
> 당연히 작동안됨. 통신과정에 시간이 필요하지만 코드를 읽을 때 별다른 코드가 없다면 기다려주지않음.

2. 꿈의코드2

```javascript
  thread {
    val user = fetchUserData()
    textView.text = user.name
  }
```
* 별도의 작업영역을 만들어서 통신은 되지만, UI관련작업은 `main thread`에서만 가능하기 때문에 에러가 발생함

3. 꿈을 포기한 현실적인 코드

```javascript
  fetchUserData { user ->
      textView.text = user.name
  }
```
* fetchUserData메소드에 콜백함수를 보낸 뒤, fetchUserData의 작업을 완료하고 나오는 데이터값을 콜백함수의 인자로 보내서 작업을 진행한다.
> 문제없이 작동되지만 콜백지옥과 메모리문제 발생

4. 코루틴을 통한 꿈 실현

```javascript
  suspend fun loadUser(){
      val user = api.fetchUser()
      show(user)
  }
```
* `suspend`는 중단 메소드로, 코루틴 영역이거나 같은 중단메소드 안에서 해당 메소드를 만나면 해당 메소드가 완료될때까지 이후의 코드는 읽히지 않는다.
> 마치 동기화된 코드같음

## 참조
[새차원 코틀린 코루틴](https://www.youtube.com/watch?v=Vs34wiuJMYk&list=PLbJr8hAHHCP5N6Lsot8SAnC28SoxwAU5A)