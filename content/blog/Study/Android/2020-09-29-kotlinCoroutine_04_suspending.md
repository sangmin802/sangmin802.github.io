---
title : "Kotlin Coroutine Suspending"
date : 2020-09-29 00:00:14
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Coroutine'
  - nav : Coroutine
--- 

## Coroutine Suspending 예제
### 예제1

```javascript
fun main() = runBlocking {
//    예제1
//      서로 의존성있는 메소드일 때
//      코루틴 내부에서 중단메소드를 활용하면 꿈의 코드처럼 순차적으로 작동된다.
    var one = 0
    var two = 0
    val time = measureTimeMillis {
        one = doSomethingUsefulOne() // 첫번째 중단
        two = doSomethingUsefulTwo(one) // 두번째 중단
        println("The answer is ${one+two}")
    }
    println("Completed in $time ms")
}

suspend fun doSomethingUsefulTwo(_one : Int): Int {
    delay(1000)
    return _one+13
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000)
    return 29
}

// The answer is 71
// Completed in 2010 ms
```
* 서로 의존성있는 메소드일 때 코루틴 내부에서 중단메소드를 활용하면 꿈의 코드처럼 순차적으로 작동된다.

### 예제2

```javascript
fun main() = runBlocking {
   val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() } // 첫번째 중단
        val two = async { doSomethingUsefulTwo() } // 두번째 중단
        println("The answer is ${one.await()+two.await()}")
    }
    println("Completed in $time ms")
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000)
    return 13
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000)
    return 29
}

// The answer is 42
// Completed in 1026 ms
```
* 예제 1과 동일하게 스레드 내부에서 중단함수가 있기 때문에 메인스레드를 읽는것은 중단하긴 하지만, 서로 연관되어있지 않기 때문에 각기 동시에 실행시키고 결과값만 기다림
* launch 빌더는 job 클래스를 반환하지만, async는 job에게 상속받는 deferred클래스를 반환받음음 따라서 cancel, join 모두 사용가능하지만 await이라는게 생김

### 예제3

```javascript
fun main() = runBlocking {
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() } // 첫번째 중단
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() } // 두번째 중단
        one.start()
        two.start()
        println("The answer is ${one.await()+two.await()}")
    }
    println("Completed in $time ms")
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000)
    return 13
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000)
    return 29
}

// The answer is 42
// Completed in 1017 ms
```
* 기존 async만 있었을 경우, async 구문이 읽히자마자 해당 코루틴이 실행되지만, 아래와같이 변수를 보내주게되면 바로실행시키지않고 이후 start나 await 메소드로 호출할때 실행된다.

### 예제4

```javascript
fun main() = runBlocking<Unit> {
   try {
       failedConcurrentSum()
   } catch (e : ArithmeticException) {
       println("Computation failed with ArithmetickException")
   }
}

suspend fun failedConcurrentSum() : Int = coroutineScope {
   val one = async {
       try {
           delay(Long.MAX_VALUE)
           42
       } finally {
           println("First child was cancelled")
       }
   }
   val two = async<Int> {
       println("Second child throws an exception")
       throw ArithmeticException()
   }
   one.await() + two.await()
}

// Second child throws an exception
// First child was cancelled
// Computation failed with ArithmetickException
```
* two에서 exception이 발생하게되어 일정시간뒤 실행되는 one또한 종료됨 그리고 최종 catch에서도 catch로 exception이 발생되었다 나옴

## 참조
[새차원 코틀린 코루틴](https://www.youtube.com/watch?v=0viswXto028&list=PLbJr8hAHHCP5N6Lsot8SAnC28SoxwAU5A&index=4)