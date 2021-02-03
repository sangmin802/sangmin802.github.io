---
title : "Kotlin Coroutine Basic"
date : 2020-09-28 00:00:12
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Coroutine'
  - nav : Coroutine
--- 

## Coroutine 예제
### 예제1

```javascript
fun main() {
   GlobalScope.launch {
       delay(1000)
       println("World!")
   }
  //  Thread { // 결과는 같음
  //      Thread.sleep(1000)
  //      println("World!")
  //  }
   println("Hello, ")
   Thread.sleep(2000) // 2초동안 해당 Thread(Main thread) 잠재움

// Hello, World!
}
```
* `.launch`와 같은 속성들을 코루틴 빌더라고 하며, 해당 코루틴 빌더 이후 중괄호 내부에서 코루틴이 실행된다.
* 이러한 빌더들은 내부적으로 코루틴을 만들어서 반환하며, 앞에 스코프영역이 필요하다.
  > GlobalScope : 수명주기가 프로그램 전체(프론트단에서 GO)로, 해당 앱이 종료될때까지 작동된다.
* 코루틴은 가벼운 `Thread` (별도의 프로그램 진행 코어)라 볼 수 있다.

### 예제2

```javascript
fun main(){
   GlobalScope.launch {
       delay(1000)
       println("World!")
   }
   println("Hello, ")
   runBlocking {
       delay(2000)
   }
   println("runBlocking End")

// Hello, World!
// runBlocking End
}
```
* 위의 예제에서 코루틴 내부에서는 delay메소드가 작동되었지만, 코루틴 외부에서는 delay메소드를 사용하면 에러가 나와서 Thread.sleep을 사용하였다.
* delay는 suspend메소드(중단기능) 이므로, 같은 suspend메소드나 코루틴 내부에서만 작동된다.(코루틴의 장점이였던 중단기능)
  > GlobalScope : 수명주기가 프로그램 전체(프론트단에서 GO)로, 해당 앱이 종료될때까지 작동된다.
* 코루틴은 가벼운 `Thread` (별도의 프로그램 진행 코어)라 볼 수 있다.
* runBlocking이 없다면 코루틴 영역에서 1초뒤 실행되는 World는 출력되지 않고 Main thread가 종료됨
* runBlocking또한 코루틴 빌더로, 코루틴을 생성한다.
* 단 다른 빌더들과 다르게, 해당 빌더는 중괄호 내의 작업들이 수행될 때 까지 현재의 Thread를 중단시킨다.

### 예제3

```javascript
fun main() = runBlocking {
   GlobalScope.launch {
       delay(1000)
       print("World!")
   }
   println("Hello, ")
   delay(2000)
}

// Hello, World!
```
* Main thread 자체를 runBlocing빌더의 코루틴으로 하여 해당 영역 내의 작업들이 모두 끝날때까지 종료를 중단.

### 예제4

```javascript
fun main() = runBlocking {
   val job = GlobalScope.launch {
       delay(1000)
       println("World!")
   }
   println("Hello, ")
   job.join()
}

// Hello, World!
```
* 상식적으로 일을 할 때, 지연되는 시간이 우리의 뜻대로 되지않기때문에 delay는 매우 비효율적이다.
* 코루틴 빌더가 반환하는 코루틴을 변수에 담고, 해당 변수에 담은 뒤, join메소드를 실행시켜서 모든 과정이 완료되 후에 thread가 종료되도록 한다.(launch는 job class를 반환한다)

### 예제5

```javascript
fun main() = runBlocking {
  // this는 생략가능
   this.launch {
       delay(1000)
       println("Kotlin ")
   }
   this.launch {
       delay(2000)
       println("with ")
   }
   this.launch {
       delay(3000)
       println("Coroutine ")
   }
   this.launch {
       delay(4000)
       println("World!")
   }
   println("Hello, ")
}

// Hello, Kotlin with Coroutine World!
```
* 만약, GlobalScope로 여러개의 코루틴 이 생성되었다면, 그만큼 join()을 통해 기다리도록 해야한다.
* 현재 구조적으로 runBlocing으로 코루틴 빌더를 갖고있는 Main thread와 내부에서 GlobalScope.launch의 코루틴빌더는 서로 다른 스코프이기 때문에 서로를 기다려주지않아 join을 사용하는것이다.
* 따라서 모두 같은 스코프영역을 기반으로 하도록 한다면 내부 모든 코루틴들이 완료될때까지 기다려준다.

### 예제5-1

```javascript
fun main() = runBlocking {
   var text = "banana "
   launch {
       delay(2000)
       text = "Chicken "
   }.join()
   launch {
       delay(1500)
       text+="is delicious"
   }.join()
   println(text)
}

// Chicken is delicious!
```
* laucn뒤에 join()메소드로 대기하게하여 순차적으로 프로그래밍을 할 수 있다.

### 예제6

```javascript
fun main() = runBlocking {
   launch {
       doWorld()
       println("World!")
   }
   println("Hello, ")
}

suspend fun doWorld() {
   delay(1000)
   println("Kotlin ")
}

// Hello, Kotlin World!
```
* 만약 내부의 코드를 별도의 함수로 빼고자 할 때, 앞에 suspend를 붙여서 해당 코루틴 내부에서 기다리도록 할 수 있다.

### 예제7

```javascript
fun main() = runBlocking {
   repeat(100_000){
       launch {
           delay(1000)
           println(".")
       }
   }
}

// ................
```
* 10만번을 반복하여 코루틴빌더를 통해 코루틴을 만들어도 잘 작동함
> 코루틴은 매우 가볍다.

### 예제8

```javascript
fun main() = runBlocking {
   GlobalScope.launch {
       repeat(1000){i ->
           println("I'm sleeping $i ...")
           delay(500)
       }
   }
   delay(1300)
}

// I'm sleeping 0 ... I'm sleeping 1 ... I'm sleeping 2 ... 종료
```
* 서로 다른 코루틴 스코프이기 때문에, Main thread는 기다려주지않음.

### 예제9

```javascript
fun main() = runBlocking {
   launch {
       repeat(5) {
           println("Coroutine A, $it")
       }
   }
   launch {
       repeat(5) {
           println("Coroutine B, $it")
       }
   }
   println("Coroutine Outer")
}

fun <T>println(msg : T) {
   kotlin.io.println("$msg [${Thread.currentThread().name}]")
}

// Coroutine A, 0 [main] ...
```
* println을 개조하여 어떤 thread에서 작동되는지 볼 수 있음

## 참조
[새차원 코틀린 코루틴](https://www.youtube.com/watch?v=14AGUuh8Bp8&list=PLbJr8hAHHCP5N6Lsot8SAnC28SoxwAU5A&index=2)