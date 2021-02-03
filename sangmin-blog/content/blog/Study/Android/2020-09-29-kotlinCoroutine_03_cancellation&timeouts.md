---
title : "Kotlin Coroutine Cancellation & Timeouts"
date : 2020-09-29 00:00:11
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Coroutine'
  - nav : Coroutine
--- 

## Coroutine Cancellation & Timeouts 예제
* 코루틴을 활용하여 비동기 처리를 할 때, 불필요하게 메모리가 소모되는 것을 막기 위해 진행 취소 또한 매우 중요하다.
### 예제1

```javascript
fun main() = runBlocking {
   val job = launch {
       repeat(1000) { i ->
           println("job : I'm sleeping $i ...")
           delay(500)
       }
   }
   delay(1300)
   println("main : I'm tired of waiting!")
   job.cancel()
   println("main : Now I can quit.")
}
// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// main : Now I can quit.
```
* 생성되는 코루틴을 변수에 담고, cancel메소드를 통해 해당 코루틴을 중단시킬 수 있다.

### 예제2

```javascript
fun main() = runBlocking {
//      위의 에제에서는 코루틴 내부에 delay라는 suspend함수가 존재하지만 예제2는 없음
   val startTime = System.currentTimeMillis()
   val job = launch(Dispatchers.Default) {
       var nextPrintTime = startTime
       var i = 0
       while(i < 5) {
            // 현재 밀리초가 초기값보다 크다면 진행하고, 초기값에 0.5초 더해줌
            // 현재 밀리초가 초기값보다 더 작다가 시간이 흐르면 초기값보다 커져서 다시 진행
            // 즉, 0.5초마다 반복이 됨
           if(System.currentTimeMillis() >= nextPrintTime) {
               println("job : I'm sleeping ${i++} ...")
               nextPrintTime += 500
           }
       }
   }
   delay(1300)
   println("main : I'm tired of waiting!")
   job.cancelAndJoin()
   println("main : Now I can quit.")
}

// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// job : I'm sleeping 3 ...
// job : I'm sleeping 4 ...
// main : Now I can quit.
```
* 위의 예제1과 비슷하게 코루틴을 작동을 중단시켰지만, 1.3초 이후에도 4, 5라는  모든 결과값을 진행하고 종료됨.
* 위의 에제에서는 코루틴 내부에 delay라는 suspend함수가 존재하지만 예제2는 없음
* 해당 thread에서 코루틴을 중단시키더라도, 코루틴 내부에서 협조적이지 않으면(suspend함수가 없다면) 모든 결과를 보여주고 종료된다

### 예제2-1

```javascript
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        try {
            var nextPrintTime = startTime
            var i = 0
            while(i < 5) {
                if(System.currentTimeMillis() >= nextPrintTime) {
                    yield()
                    println("job : I'm sleeping ${i++} ...")
                    nextPrintTime += 500
                }
            }
        }catch (e : Exception) {
            println("Suspended by $e")
        }
    }
    delay(1300)
    println("main : I'm tired of waiting!")
    job.cancelAndJoin()
    println("main : Now I can quit.")
}

// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// Suspended by kotlinx.coroutines.JobCancellationException: StandaloneCoroutine was cancelled; job=StandaloneCoroutine{Cancelling}@4f591ba8
// main : Now I can quit.
```
* 코루틴 내부에서도 delay로 시간을 부여하여 중단이 아닌 yield()를 통해 메인스레드에서 중단을 요청했을 때, 즉시 중단 가능하다.
* 단, yield()를 통해 중단했을 때 중단 사유를 알 수 없기 때문에 try catch 구문을 통해 catch의 e 인자로 확인할 수 있다.
* 해당 thread에서 코루틴을 중단시키더라도, 코루틴 내부에서 협조적이지 않으면(suspend함수가 없다면) 모든 결과를 보여주고 종료된다

### 예제2-2

```javascript
fun main() = runBlocking {
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while(isActive) {
            if(System.currentTimeMillis() >= nextPrintTime) {
                yield()
                println("job : I'm sleeping ${i++} ...")
                nextPrintTime += 500
            }
        }
    }
    delay(1300)
    println("main : I'm tired of waiting!")
    job.cancelAndJoin()
    println("main : Now I can quit.")
}

// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// main : Now I can quit.
```
* 조건에 isActive를 통해 suspend함수 없이도 중단시킬 수 있다.

### 예제3

```javascript
fun main() = runBlocking {
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job : I'm sleeping $i ...")
                delay(500)
            }
        } finally {
            println("job : I'm running finally")
        }
    }
    delay(1300)
    println("main : I'm tired of waiting!")
    job.cancelAndJoin()
    println("main : Now I can quit.")
}

// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// job : I'm running finally
// main : Now I can quit.
```
* 네트워크 오류 등 코루틴 진행이 중단되었을 때, finally 내부에서 중단 이후 처리를 할 수 있다.

### 예제4

```javascript
fun main() = runBlocking {
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job : I'm sleeping $i ...")
                delay(500)
            }
        } finally {
            withContext(NonCancellable) {
                println("job : I'm running finally")
                delay(1000)
                println("job : And I've just delayed for 1 sec because I'm non-cancellable")
            }
        }
    }
    delay(1300)
    println("main : I'm tired of waiting!")
    job.cancelAndJoin()
    println("main : Now I can quit.")
}

// job : I'm sleeping 0 ...
// job : I'm sleeping 1 ...
// job : I'm sleeping 2 ...
// main : I'm tired of waiting!
// job : I'm running finally
// job : And I've just delayed for 1 sec because I'm non-cancellable
// main : Now I can quit.
```
* 코루틴이 중단된 시점에 다른 코루틴을 한번 더 작동시키고자 할 경우

### 예제5

```javascript
fun main() = runBlocking {
    val result = withTimeoutOrNull(1300) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500)
        }
        "Done"
    }
    println("Result is $result")
}

// I'm sleeping 0 ...
// I'm sleeping 1 ...
// I'm sleeping 2 ...
// Result is null
```
* 지정시간 종료 시, 지정한 값을 반환

## 정리
* runBlocking = 자식 코루틴(스레드)들이 모두 완료될때까지 현재 스레드가 종료되는것을 미룸
* launch = 위에서 순차적으로 읽어오면서 해당 launch 코루틴이 있다면 외부 신경쓰지말고 그냥 실행시킴 특별한 명령 없으면 멈추지않음
* suspend = 코루틴(스레드)내부에서 suspend함수를 만나는 순간 해당 메인 스레드를 읽는것을 중지하고 그 suspend함수먼저 실행시킨다음 suspend함수 완료되면 다음꺼 읽음

## 참조
[새차원 코틀린 코루틴](https://www.youtube.com/watch?v=GmVv98LUa0k&list=PLbJr8hAHHCP5N6Lsot8SAnC28SoxwAU5A&index=3)