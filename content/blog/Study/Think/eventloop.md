---
title: 'EventLoop'
date: 2020-10-22 00:00:00
category: 'Study'
draft: false
tag: 'Think'
---

### 🤔 복습이란

이전에 봤던 실행컨텍스트 스택을 다시 보는데, 이벤트루프라는 용어를 보게되었다.

### Event Loop

뭐야..?
좋은 그림이 있어서 가져와봄

<div style="display : flex; justify-content : center;">
  <img style="display : inlneblock; width : 50%" src="https://miro.medium.com/max/2048/1*4lHHyfEhVB0LnQ3HlhSs8g.png" alt="img">
</div>

### 용어

- `Memory Heap`은 우리가 선언한 변수나 함수들이다. 특정한 구조를 가지고 있지 않은 데이터 더미들이라고 한다.
- `JavaScript`는 싱글스레드로 하나의 작업수행공간을 가지고있다
- `Web APIs`는 일종의 비동기 함수들이라 생각하면 된다
- `Callback Queue`는 `Web APIs`에서 특정 시간이나 작업이 끝난 뒤 콜백함수들이 담기는 공간이다

### 진행과정

```javascript
function fun1() {
  console.log('함수1')
}
function fun2() {
  fun3()
  console.log('함수2')
}
setTimeout(fun1, 0)
function fun3() {
  console.log('함수3')
}
fun1()
fun2()
fun3()
// 함수1 함수3 함수2 함수3 함수1
```

1. 특정 함수들이 호출되면서 `Call Stack`에 쌓이게됨.
2. `fun1`이 먼저 실행되고, 내부함수가 없기 때문에 종료되자마자 `fun1`은 스택에서 빠짐
3. `fun2`가 실행되어 컨텍스트에 쌓이고, 종료되기전 내부함수인 `fun3`이 실행되면서 그 위에 `fun3`이 쌓임.
4. `fun3`이 종료되고, 해당 스택이 사라지면서 `fun2` 또한 마저 마무리하고 스택에서 사라짐
5. `setTimeout`이 스택에 쌓이지만, 비동기이기때문에 `Web APIs`인 백그라운드로 해당 함수가 넘어가고 바로 스택에서 사라짐
   > 여기서 중요한점은, 지연시간이 0초더라도, `Web API영역`으로 넘겨짐
6. 이후 `fun3`이 스택에 쌓이고 실행되자마자 스택에서 사라짐
7. `Web APIs`에서 시간이 흐른 뒤(모든 비동기 작업이 완료된뒤) `setTimeout`의 콜백함수인 `fun1`이 `Callback Queue`에 넘어감
8. 실행스택에 아무것도 아무것도 없는것을 확인한 `Event Loop`가 `Callback Queue`에 있는 `fun1`을 실행스택으로 넘겨주고, 해당 함수는 쌓이자마자 실행되고 사라짐.
