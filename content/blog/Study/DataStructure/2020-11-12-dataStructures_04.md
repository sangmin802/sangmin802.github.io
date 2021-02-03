---
title : "자료구조 Data Structures Stack"
date : 2020-11-12 00:00:04
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "Stack"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Stack 스택
* 이전에 봤던 `Queue`와 유사하게 선형자료구조라고 한다. 다만, 둘의 차이로는 데이터 출력의 방식이다.
* `Queue`가 `FIFO (First In First Out)`라면, `Stack`은 `LIFO (Last In First Out)`으로 나중에 입력된 데이터가 먼저 출력된다.

## 실행컨텍스트에서의 스택
* 컨텍스트를 공부하면서, 함수들이 실행 될 때,(선언말고) `스택`이 쌓이게 되고, 내부함수가 실행되면 내부함수가 먼저 종료된다고 나와있었다.

## 배열의 Pop과 Push
* 자바스크립트에서는 배열의 입력 `push`와 마지막 인자 출력인 `pop`을 사용하면 쉽게 구현이 가능하다.
* 두가지 메소드 모두, 마지막 인자만 활용하기 때문에 O(n)의 시간복잡도를 가지고있다.

```javascript
class Stack {
  constructor(){
    this.store = [];
  }

  push(item){
    this.store.push(item);
  }

  pop(){
    this.store.pop();
  }
}
```
