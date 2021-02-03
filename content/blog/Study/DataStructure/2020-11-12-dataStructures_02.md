---
title : "자료구조 Data Structures List"
date : 2020-11-12 00:00:02
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "List"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# List 리스트
* 처음 끝 중간에 엘리먼트를 추가/삭제할 수 있으며, 배열과 다르게 삭제된 값의 빈 공간을 남기지 않고 없앤다.
* List또한 index를 가지고 있긴 하지만, 현재 데이터의 다음에 위치하고있는 데이터 혹은 이전에 위치하고있는 데이터처럼 데이터의 순서가 더 중요하다.

## Array.splice로 가능한거 아니야?
* 잘 생각해보면, splice와 같은 메소드로 리스트처럼 앞의 값이 삭제되면 자동으로 뒤의 값으로 채워지게 할 수 있다.
* 자바스크립트와 파이썬은 개발자들이 쉽게 프로그래밍을 할 수 있도록 설계된 언어이기 때문에, 이 언어에서의 배열은 동적이며 리스트의 기능도 포함하고있다고 한다. 따라서, splice와 같은 메소드로 자동으로 값이 채워지게할수도 있고, `array[3] = null`과 같은 방법으로 정적이게 할수도 있다 한다.

## 언어별 차이
* C
  * Array는 제공되지만, List는 사용자가 직점 구현해야 한다.

* JavaScript, Python
  * Array와 List가 융합되어있다.

* JAVA
  * Array와 List와 완전히 분리되어있으며, List에도 LinkedList와 ArrayList로 나뉘어져 있다.

* Array
  * Array의 가장 큰 특징은 저장되어있는 위치인 index가 있으며, 해당 index를 통해 값을 바로 조회할 수 있다.

## Array? List?
* Array와 List는 순서대로 저장된다는 점, 중복 저장이 가능하다는점에 유사한부분이 많지만 차이점도 있다.
* JavaScript에서는 융합되어있으니, 잘 모르지만 JAVA기준으로 해당 자료구조의 특성만 이해해보자.

### Array vs List 값 추가
* index 3인 위치에 값을 추가한다고 가정해보았을 때, 
* Array
  * Array의 경우 추가가 아닌 해당 index의 값이 교체된다.

* List
  * List의 경우 해당 인덱스에 값이 추가가되고, 기존의 값은 4의 인덱스로 밀려난다.

### Array vs List 값 제거
* index 3인 위치에 값을 제거한다고 가정해보았을 때, 
* Array
  * Array의 경우 해당 index의 값이 제거되더라도, 빈 공간인채로 남아있기때문에 배열의 크기는 변하지 않는다.

* List
  * List의 경우 해당 index에 값이 제거되면, 다음에 있는 값이 해당 index의 값이 되서 땡겨진다. 즉, 배열의 크기가 유동적으로 줄어든다.

### 결론
* Array는 초기에 크기를 지정해주고 이후 변화가 거의 없으므로 정적이지만, List는 추가 제거등 변화를 줄수 있기 때문에 유동적인듯 하다.

## JAVA에서 ArrayList, LinkedList
* 솔직히 JAVA는 아예 모르는수준이다. 하지만, Kotlin은 경험이 있고 ArrayList는 간단한 Kotlin 프로젝트를 하면서 상당히 자주 다뤄보았기 때문에 한번 알아보기로 했다.
* 두가지 모두 동일한 List관련 메소드와 기능, 특징을 가지고 있지만, 유일하게 Array와 List를 분리한것처럼 List에서도 ArrayList와 LinkedList를 분리했다.
* JAVA이기 때문에, 모르는 문법이 나오더라도 당황하지말고 해당 자료구조가 어떤특징을 가지고있는지를 이해하자.

### ArrayList
* 배열 형식을 이용하여 리스트를 구현한 것.
> [1,2,3]
* 데이터가 늘어나면 늘어날수록 추가 및 삭제에 있어서 시간적 효율이 떨어지지만, 데이터의 index를 통해 빠르게 값을 조회할 수 있다. 정적인 리스트
> 이전에, Kotlin으로 Loa-Hands를 할 때, Recycler View를 사용했었는데, 이 때에는 index를 조회하여 View를 구성하고, 초기에 List를 지정해주면 변할일이 없기 때문에, ArrayList가 적합했다.

#### 데이터 추가
* 특정 인덱스에 데이터를 추가하면, 해당 인덱스에 빈 공간을 만들고, 기존의 인덱스에있던 데이터는 뒤로 밀려난다. 그리고 그 빈공간에 데이터가 들어가게된다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="https://s3.ap-northeast-2.amazonaws.com/opentutorials-user-file/module/1335/2886.png" alt="result1">
</div>

#### 데이터 삭제
* 특정 인덱스의 데이터를 삭제하면, 이후의 값들이 앞으로 밀고들어와 빈공간을 채워넣는다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="https://s3.ap-northeast-2.amazonaws.com/opentutorials-user-file/module/1335/2887.png" alt="result1">
</div>

#### 데이터 가져오기
* 배열의 형식이기 때문에, 인덱스를 가지고 있어서 값을 조회하기에는 매우 효율적이다.

#### 느낌
* 데이터를 추가하고 삭제하는 과정에서 하나씩 미루고 땡기는 과정이 필요한 것을 보아, 비교적 좋지않은 시간복잡도를 가지고 있을 것 같다.

### LinkedList
* ArrayList와 다르게 배열형식이 아닌, 요소와 요소간 연결을 이용해 리스트를 구현한 것이다.
* 데이터가 얼마나 늘어나든 추가 및 삭제에있어 시간적 효율이 비교적 우월하지만, 데이터를 찾는데에는 연결된 순서를 따라 찾아야 하기 때문에 비교적 비효율적이다.

#### 연결, 구조
* ArrayList의 경우 내부 데이터들이 하나하나 배열의 요소였지만, LinkedList의 경우, 배열이아니라 서로 연결되어있기 때문에 요소라는 표현보다는 노드라고 많이 말한다.
* 해당 노드에는 데이터필드와 링크필드를 가지고있는데, 데이터필드에는 값이 저장되고 링크필드는 다음 노드를 찾을수 있는 값을 next라는 변수에 담아 사용한다.
* LinkedList에서는 첫번째 노드가 무엇인지 꼭 알아야 한다.
> 처음을 알아야 예상한대로 다음으로 넘어갈수 있기 때문
* 따라서 첫번째 노드가 무엇인지 알려주는 Head라는 변수를 가져야 한다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="https://s3.ap-northeast-2.amazonaws.com/opentutorials-user-file/module/1335/2939.png" alt="result1">
</div>

#### 데이터 시작부분에 추가
* 새로운 노드가 시작부분에 추가된다면, 기존의 Head가 되는 노드는 뒤로 밀리고, 새로운 노드가 Head노드가 된다. 그리고, 새롭게 Head가 된 노드는 다음 노드를 이전의 Head노드를 가리킨다.

#### 데이터 중간부분에 추가
* 시작이되는 노드를 찾는다.
* 원하는 인덱스번째의 값을 찾아간다.
* 해당 값을 찾으면, 새로운 데이터를 추가하고 기존에있던 데이터를 다음 노드로 잡는다.
* 새로운 데이터 앞의 노드는 다음 노드로 새롭게 추가된 노드를 잡는다.

#### 데이터 삭제
* 시작이되는 노드를 찾는다.
* 삭제하려는 값의 인덱스 전의 노드(cur이라 치겠음)를 찾고, 그 노드 다음의 노드(삭제할 노드)를 변수에 담는다.
* 삭제할 노드의 다음노드를 cur의 다음노드로 변경하고, 삭제할 노드를 delete로 지워준다.

#### 데이터 조회
* 인덱스만큼 노드마다 next를 호출해가며 값을 찾아야 한다.

### Doubly LinkedList 이중연결리스트
* 기존 LinkedList와 다르게, 다음의 노드의 위치를 찾을수 있는 변수 뿐 아니라, 이전의 노드또한 찾을수 있는 변수를 가지고있다.
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="https://s3.ap-northeast-2.amazonaws.com/opentutorials-user-file/module/1335/2949.png" alt="result1">
</div>

#### 장점
* LinkedList의 데이터 조회를 좀 더 효율적으로할 수 있다는 점인데, 앞의 노드또한 조회할 수 있기 때문에 총 데이터의 사이즈를 통해 만약 찾고자하는 노드의 인덱스가 사이즈의 절반보다 크다면, 마지막에서부터 앞의 노드를 찾는 등 할 수 있다.

#### 데이터 추가, 제거
* LinkedList와 동일하지만, next뿐만 아니라 previous또한 지정해주어야 한다.


# JavaScript로 이중연결리스트 구현
* 이게 맞는지는 모르겠다.
* 그냥 LinkedList의 경우, prev만 없어지면 된다.
* 자바스크립트의 경우, splice로 리스트의 동적인 입력 삭제가 가능하지만, 시간복잡도의 경우 O(n)이므로 직접구현한 리스트보다 비효율적이라고 한다.

```javascript
class LinkedList {
constructor(value){
  this.head = {
    value : value,
    next : null,
    prev : null,
  }
  this.tail = this.head;
  this.cur = this.head;
  this.length = 1;
}

append(value){
  const newNode = {
    value : value,
    next : null,
    prev : this.tail
  }
  this.tail.next = newNode;
  this.tail = newNode;
  this.length++;
}

preAppend(value){
  const newNode = {
    value : value,
    next : this.head,
    prev : null
  }
  this.head.prev = newNode;
  this.head = newNode;
  this.length++;
}

shift(){
  this.head = this.head.next;
  this.head.prev = null;
  this.length--;
}

pop(){
  this.tail = this.tail.prev;
  this.tail.next = null;
  this.length--;
}

insert(index, value){
  this.cur = this.head;
  if(index >= this.length){
    this.append(value);
  }else if(index === 0){
    this.prAppend(value);
  }else{
    let count = 1;
    while(count !== index){
      this.cur = this.cur.next;
      count++;
    }
    const newNode = {
      value : value,
      prev : this.cur,
      next : this.cur.next
    }
    this.cur.next = newNode;
    newNode.next.prev = newNode;
    this.length++;
  }
}

delete(index){
  const half = Math.ceil(this.length/2);
  if(index === 0){
    this.shift()
  }else if(index === this.length-1){
    this.pop()
  }else{
    if(index <= half){
      this.cur = this.head;
      let count = 1;
      while(count !== index){
        this.cur = this.cur.next;
        count++;
      }
      this.cur.next = this.cur.next.next;
      this.cur.next.prev = this.cur;
    }else{
      this.cur = this.tail;
      let count = this.length;
      while(count !== index){
        this.cur = this.cur.prev;
        count--;
      }
      this.cur.next = this.cur.next.next;
      this.cur.next.prev = this.cur;
    }
    this.length--;
  }
}

getArray(){
  this.cur = this.head;
  let 
    count = 0,
    array = [];
  while(count !== this.length){
    array.push(this.cur.value);
    this.cur = this.cur.next;
    count++;
  }
  return array;
}
}

linkedList = new LinkedList(1);
linkedList.append(2)
linkedList.append(4)
linkedList.append(5)
linkedList.append(6)
linkedList.insert(2,3)
linkedList.append(7)
linkedList.delete(2)
console.log(linkedList)
```
# 참조
* [생활코딩 자료구조 List](https://opentutorials.org/module/1335/8636)