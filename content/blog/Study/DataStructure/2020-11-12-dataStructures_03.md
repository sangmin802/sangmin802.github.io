---
title : "자료구조 Data Structures Queue"
date : 2020-11-12 00:00:03
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "Queue"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Queue 큐
* 먼저 입력된 데이터가 먼저 출력되는 `FIFO (First In First Out)`구조로 저장되는 형식이다.
* 데이터 입력(Enqueue), 데이터 출력(Dequeue) 두가지 작업이 있다.

## 이벤트루프의 Queue
* 이전에 이벤트루프를 공부하면서, `Stack`과 `Queue`를 봤었는데, 비동기함수의 작업들이 끝나고 `Queue`에 입력되면서, 메인의 `Stack`이 비었을 때 순서대로(먼저 입력된게 먼저 출력되는) 넘겨진다고 했었다.

## 배열의 Shift와 Push
* 자바스크립트에서는 `Queue`라는 자료구조가 배열처럼 있지는 않지만, 배열의 입력 `push`와 첫번째 인자 출력인 `shift`를 사용하면 쉽게 구현이 가능하다.
* 단, `push`는 그냥 추가하는것이기 때문에 O(1)의 시간복집도지만, `shift`는 앞의 값을 제거하고, 하나하나 index를 다시 조정해줘야하기 때문에, O(n)의 시간복잡도를 가지고있다.

```javascript
class Queue {
  constructor(){
    this.store = [];
  }

  enqueue(item){
    this.store.push(item);
  }

  dequeue(){
    return this.store.shift();
  }
}

const queue = new Queue();
queue.enqueue('치킨'); 
console.log(queue.store)
queue.enqueue('피자');
console.log(queue.store)
console.log(queue.dequeue());
```

## 이중연결리스트를 활용한 Queue
* `push`나 `shift`를 사용하지 않는, 선입선출 방식의 데이터구조
* 하나하나 순회하며 index를 다시 잡아주는 `shift`를 사용하지 않아, 시간복잡도에있어서 더 효율적이다. O(1)

```javascript
class Node {
  constructor(value){
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}
class Queue {
  constructor(){
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  enqueue(value){
    const newNode = new Node(value);
    if(this.size === 0){
      this.first = newNode;
      this.last = newNode;
    }else{
      newNode.prev = this.last;
      this.last.next = newNode;
      this.last = newNode;
    }
    this.size++;
    return this;
  }

  dequeue(vlaue){
    if(this.size===0){
      return this;
    }else{
      this.first.next.prev = null;
      this.first = this.first.next;
    }
    this.size--;
    return this;
  }
}

const queue = new Queue();
queue.enqueue(1)
queue.enqueue(2)
queue.enqueue(3)
queue.enqueue(4)
console.log(queue)
queue.dequeue(4)
console.log(queue)
```