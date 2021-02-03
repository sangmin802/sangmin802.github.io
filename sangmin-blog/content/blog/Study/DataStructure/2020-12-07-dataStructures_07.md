---
title : "자료구조 Data Structures Hash Table"
date : 2020-12-07 00:00:00
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "Stack"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Hash Table 해시 테이블
* 특정 값을 받으면, 그 값을 해시함수에 통과시켜 나온 Index에 저장하는 자료구조
> 배열과 비슷한데, Index를 사용자지정함수를 통해 정하는것 같다.

## 직접주소테이블
* `해시테이블`의 초기는 `직접주소테이블`이라는 자료구조에서 출발한다. 입력받은 value가 곧 key가된다.
* Index를 통해 관리하기 때문에, 값을 찾는데 O(1)의 시간복잡도를 가지고있다.
* value를 통해 key를 지정하기 때문에 아래의 예시처럼 값의 차이가 크다면 중간중간 값은 비어있지만 메모리가 할당되어있는 공간적으로의 효율은 떨어지게된다.

```javascript
class DirectAddressTable {
  constructor(){
    this.table=[];
  }

  setValue(value){
    this.table[value] = value;
  }

  getValue(value){
    return this.table[value];
  }

  getTable(){
    return this.table;
  }

}
const myTable = new DirectAddressTable();
myTable.setValue(3);
myTable.setValue(10);
myTable.setValue(90);

console.log(myTable.getTable());
}
```

## 직접주소테이블과 해시함수

```javascript
function hashFunction (key) {
  return key % 10;
}

console.log(hashFunction(102948)); // 8
console.log(hashFunction(191919191)); // 1
console.log(hashFunction(13)); // 3
console.log(hashFunction(997)); // 7
```

* value를 바로 key로 사용하는것이 아닌, 해시함수라는 것에 한번 통과시켜 사용한다. 해시함수는 임의의 길이를 가지는 임의의 데이터를 고정된 길이의 데이터로 매핑하는 함수이다. 이 함수를 통해 얻는 결과값을 해시라고 한다.
* `191919191`, `102948` 등 임의의 길이를 가지는 데이터를 우리가 예상할 수 있는 `0~9` 고정된 길이의 데이터로 바꾼다.
* 해시를 봐서는 어떤 임의의 값을 받았는 지 알 수 없기때문에 암호적인 측면에서도 좋다고 한다..

```javascript
const size = 5;
const hashTable = new Array(size);

function hashFunc(key){
  return key % size;
}

hashTable[hashFunc(1991)] = 1991;
hashTable[hashFunc(1234)] = 1234;
hashTable[hashFunc(5678)] = 5678;
console.log(hashTable); // [empty, 1991, empty, 5678, 1234]
```
* 만약, 해시함수가 없었다면 몇천개의 비어있는 공간이 생겼을 것이다.

## 해시의 충돌
* 단순히 해시함수를 통해 공간적힌 효율을 챙긴것 같지만, 잘 생각해보면 문제가 있다.
* 만약, 해시함수를 통해 나온 해시의 값이 동일하다면 어떻게되는걸까?
* 해시함수를 짤 때 위와같은 문제가 생기지 않도록 하는것이 중요하지만 절대라는것은 존재하지 않는다..

## 개방주소법
* 해시 충돌이 발생했을 때, 테이블 내의 새로운 주소를 찾고, 비어있는 곳에 충돌된 데이터를 입력하는 방식이다. 해시함수를 통해 얻은 Index가 아닌, 다른 Index를 허용하여 할당하기때문에 개방주소라고 한다..

### 선형 탐사법
* 순차적으로 탐사하는 방법
* 충돌이 일어났을 때, 한칸씩 밀려서 저장된다.
* 임시적으로 해결된것 같지만, 이럴경후 무한히 밀리는 문제가 있다고 한다.

|0|1|2|3|4|5|
|:-:|:-:|:-:|:-:|:-:|:-:|
| |1991| | | | |

|0|1|2|3|4|5|
|:-:|:-:|:-:|:-:|:-:|:-:|
| |1991|<b style="color : tomato;">6</b>| | | |

### 제곱 탐사법
* 선형 탐사법과 비슷해보이지만, 한칸씩이 아닌 제곱만큼 밀려서 저장된다.
* 솔직히 선형탐사법과 같은 문제를 최대한 늦게 발생시키는 수준인듯 하다..

### 이중해싱
* 위의 두 방법으로는 깨끗하게 해결되지 않아 생긴게 이중해싱이라고 한다.
* 하나는 기존과 마찬가지로 해시함수를 통해 나온것과, 다른 하나는 충돌이 났을 경우 탐사 이동폭을 얻기 위해 사용한다. 이러면 최초 해시로 같은 값이 나오더라도, 다른 해시 함수를 거치면서 다른 값이 나올 확률이 높기때문에 다른공간에 골고루 저장될 확률도 높아진다.

```javascript
const tableSize = 10;
const table = [];

const getSaveHash = value => value % tableSize;
const getStepHash = value => 7 - (value % 7);

const setValue = value => {
  let index = getSaveHash(value);
  let targetValue = table[index];
  while (true) {
    if (!targetValue) {
      table[index] = value;
      console.log(`${index}번 인덱스에 ${value} 저장! `);
      return;
    }
    else if (table.length >= tableSize) {
      console.log('풀방입니다');
      return;
    }
    else {
      console.log(`${index}번 인덱스에 ${value} 저장중 해시충돌!`);
      index += getStepHash(value);
      index = index > tableSize ? index - tableSize : index;
      targetValue = table[index];
    }
  }
}
```

## 분리 연결법
* 해쉬 테이블의 key 하나에 하나의 value가 아닌 링크드리스트나 트리를 넣어주는 것이다.
* 단, 처음 해시함수를 통해 key를 지정해줄 때, 잘 분배되게 하지 않는다면 특정 key만 어마어마하게 길어진 링크드리스트 혹은 트리 데이터를 갖게될 수 있으니 조심해야한다.

|0|1|2|3|4|5|
|:-:|:-:|:-:|:-:|:-:|:-:|
| |[1,2,68,165,3,865,6584,9864,65,5,48,2,46...]| | | | |

## 참조
* [Evan Moon님 Javascript와 해시테이블](https://evan-moon.github.io/2019/06/25/hashtable-with-js/)