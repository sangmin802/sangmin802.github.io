---
title: 'Event Loop 다시잡기'
date: 2021-03-25 15:23:00
category: 'Study'
draft: false
tag: 'Think'
---

이전에 간단하게 접해봤던 `event loop`에 관련되어서 테스트를 해보던 중, 잘못알고 있었거나 부족했던 점이 있어 추가적으로 정리해보려고 한다.

## Event Loop

자바스크립트언어는 하나의 작업영역을 가지고있는 `single thread`로서, `stack`형식의 자료구조를 갖고 있다.

각각의 작업들은 `stack`에 차곡차곡 쌓여가며, 선입 후출의 방식으로 일이 진행된다.

그러다보니 A 작업이 시작된다면 B 작업은 중간에 끼어들 수 없는 형식이다.

> Run-to-completion 이라고 함. 내 생각에는, 이러한 방식이 동기 적인 프로그래밍이 아닐까 싶음

일반적인 함수와 같은 작업영역의 경우 크게 문제되지 않겠지만, 시간이 오래걸리는 작업의 경우 사용자에게 부정적인 경험을 줄 수 있다.

> 일반적인 경우는, 이전의 `event loop` 포스트에서 다뤘으니 패스

### Web API

`Web API`에는 `setTimeout`이나, `Promise`등이 포함되는 브라우저에서 제공하는 `API`를 의미한다.

중요한것은, `setTimeout`이나, `Promise`, 각각의 이벤트에 바인딩되는 콜백함수들이다.

### Que

`Web API`의 비동기함수들은 자신의 콜백함수들을 종류에 따라, 각각의 `Que` 자료구조에 담기게 된다.

1. `MicroTasks` : `Promise`객체를 통한 콜백함수들이 담기는 곳
   > `.then/catch/finally`와 같은 비동기 메소드들의 내부는 `Promise`가 즉시실행함수로 실행되었다 하더라도, `MicroTasks`로 넘어감
2. `Tasks` : `UI`이벤트 혹은 `setTimeout`의 콜백함수들이 담기는 곳.

`Promise`와 같은 비동기 `API`들은, 현재 `stack`에서 진행중인 작업이 완료되자마자 실행되어야 하기 때문에 `Microtasks`가 `Tasks`보다 높은 우선순위에 있다고 한다.

현재의 `stack`이 마지막 작업을 수행 완료 하였을 때 를 가정해본다면,

1. `Event Loop`는 `MicroTasks`의 상황을 확인함
2. `MicroTasks`에 쌓여있는 작업이 있다면, 선입선출의 방식으로 가져감
3. `MicroTasks`에 쌓여있는 작업이 없다면, `Tasks`에서 선입선출의 방식으로 가져감

### 예제1

```javascript
function microTaskDone(num) {
  console.log(`MicroTask done`)
}

function taskDone() {
  console.log('Task done')
}

function done() {
  console.log('Start Done')
}

function start() {
  Promise.resolve().then(microTaskDone)

  setTimeout(() => {
    taskDone()
  })

  done()
}

start()
console.log('main done')

// 결과
Stack Done
main done
MicroTask done
Task done
```

1. `start` 스택이 쌓임
2. `Promise.resolce().then()`은 `Web API` 비동기 영역으로, 콜백함수는 `MicroTasks`에 저장된 다음, 해당 스택은 사라짐
3. `setTimeout`은 `Web API` 비동기 영역으로, 이후의 콜백함수는 `Tasks`에 저장된 다음, 해당 스택은 사라짐
4. `done` 스택이 쌓이고, `Start Done` 작업을 완료하고 해당 스택은 사라짐
5. `start` 스택이 사라지고, `main done` 작업을 완료함
6. `Stack`이 마지막 작업을 완료함을 감지한 `Event Loop`는 `MicroTasks`를 확인하고, `microTaskDone` 작업이 존재하여 `Stack`으로 작업을 올림.
7. `MicroTask done`작업을 완료하고, 해당 스택은 사라짐.
8. `Event Loop`는 다시한번 `Stack`이 마지막 작업이 완료됨을 감지하고 `MicroTasks`를 확인하지만, 아무런 작업도 존재하지 않아 `Tasks`의 첫번째 작업을 `Stack`으로 올림
9. `Task done` 작업을 완료하고 해당 스택은 사라짐.

### 예제2

예제2의 경우 조금 다른 결과라 맞는 해석일지는 잘 모르겠지만, `Stack`의 작업이 종료될때마다 새로운 작업을 찾아서 올리는 `Event Loop`의 특성과, 즉시실행이아닌 어느정도 시간이 걸리는 비동기 `Web API`들을 고려해보면 맞을것 같음.

```javascript
function promise() {
  return new Promise((res, rej) => {
    fetch('./json/json1.json')
      .then(json => {
        console.log("fetch의 비동기 then1");
        return json.json();
      })
      .then(() => {
        console.log("fetch의 비동기 then2");
        return res();
      });
  })
}

function microTaskDone(num) {
  console.log(`MicroTask done`)
}

function task() {
  setTimeout(() => {
    console.log('Task done')
  })
}

function done() {
  console.log('Stack Done')
}

function start() {
  promise().then(microTaskDone)

  task()

  done()
}

start()
console.log('main done')

// 결과
Stack Done
main done
Task done
fetch의 비동기 then1
fetch의 비동기 then2
MicroTask done
```

1. `start` 스택이 쌓임
2. `Promise.resolce().then()`은 `Web API` 비동기 영역으로, 콜백함수는 `MicroTasks`에 저장된 다음, 해당 스택은 사라짐
   > 단 여기서 콜백함수는 `fetch` 메소드를 의미함
3. `setTimeout`은 `Web API` 비동기 영역으로, 이후의 콜백함수는 `Tasks`에 저장된 다음, 해당 스택은 사라짐
4. `done` 스택이 쌓이고, `Start Done` 작업을 완료하고 해당 스택은 사라짐
5. `start` 스택이 사라지고, `main done` 작업을 완료함
6. `Stack`이 마지막 작업을 완료함을 감지한 `Event Loop`는 `MicroTasks`를 확인하고, `fetch` 작업이 존재하여 `Stack`으로 작업을 올림.
7. `Stack`에 올라간 `fetch` 또한, `Promise` 객체를 반환하는 비동기 `Web API`로, `MicroTasks`에 넘겨주면서 `Stack`의 `fetch`는 사라짐.
8. `Event Loop`는 다시한번 `Stack`이 마지막 작업이 완료됨을 감지하고 `MicroTasks`를 확인하지만, 아직은 아무런 작업도 존재하지 않아 `Tasks`의 첫번째 작업을 `Stack`으로 올림
   > `fetch`라는 비동기 `Web API`는 내부적으로 바로 실행되는것이 아닌, 어느정도 시간이 필요하기 때문에, 바로 콜백함수를 넘겨주진 못하는것 같음
9. `Task done` 작업을 완료하고 해당 스택은 사라짐.
10. `Web API`에서 진행중이던 `fetch`가 완료되고, `.then`의 콜백함수가 `MicroTasks`에 저장됨.
11. `Task done` 작업이 사라지고, `Event Loop`는 다시 반복함.

### 참고

[Line Engineering](https://engineering.linecorp.com/ko/blog/dont-block-the-event-loop/)
