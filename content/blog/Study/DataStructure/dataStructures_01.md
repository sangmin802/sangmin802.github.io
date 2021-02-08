---
title : "자료구조 Data Structures Array"
date : 2020-11-12 00:00:01
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "Array"  
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Array 배열
* 데이터를 나열하여 각 데이터를 인덱스에 대응해주고, 인덱스로 데이터를 조회할 수 있다.

## 장점
* 같은 종류의 데이터를 효율적으로 관리
* 데이터를 순차적으로 저장
* 배열 생성 시, 크기를 정해주기 때문에 공간적인 활용이 좋다고 함
  > 자바나 다른 언어에서는 그렇다는데.. 자바스크립트에서는 크기를 변경할 수 있다. 내가 알고있는것과 조금.. 다른건가..?

## 단점
* 미리 배열의 크기를 설정해줘야 하기 때문에, 데이터를 추가하는것이 어렵다.
* 데이터를 삭제할 경우, 뒤에있는 데이터를 앞으로 당겨와야 한다.
  > 특정 데이터 삭제 시, 자동으로 앞으로 당겨지는것이 아닌, 비어있는 값으로 남아있는다고 함.
  > 이 또한, 자바스크립트에서는 `splice`메소드 사용 시, 자동으로 크기가 줄어들고 해당 값은 영구소멸되는듯 한데.. 좀 다른가보다.
  > 추가적으로 알아보았는데, 자바스크립트는 동적 배열을 사용하기 때문에 가능하다고 한다.

## 배열의 선언방법
```javascript
const array1 = new Array(); // []
array1[0] = 1; // [1]
const array2 = new Array(1,2,3); // [1,2,3]
const array3 = [1,2,3]; // [1,2,3]
```

## 배열의 내장 메소드
```javascript
// indexOf
const arrayIndexOf = [1,2,3];
console.log(arrayIndexOf.indexOf(2)); // 1
console.log(arrayIndexOf.indexOf(5)); // -1

// push
// 배열의 마지막 요소 추가
const arrayPush = [1,2,3];
arrayPush.push(4);
console.log(arrayPush); // [1,2,3,4]

// pop
// 배열의 마지막 요소 제거
const arrayPop = [1,2,3];
arrayPop.pop();
console.log(arrayPop); // [1,2]

// length
const arrayLength = [1,2,3];
console.log(arrayLength.length); // 3

// unShift
// 배열의 첫번째 요소 추가
const arrayUnshift = [1,2,3];
arrayUnshift.unshift(0);
console.log(arrayUnshift); // [0,1,2,3]

// shift
// 배열의 첫번째 요소 제거
const arrayShift = [1,2,3];
arrayShift.Shift(0);
console.log(arrayShift); // [2,3]

// concat
// 두개의 배열을 합쳐서 새로운 배열로 변환
//  기존의 배열을 바꾸지 않는다.
const arrayConcat = [1,2,3];
console.log(arrayConcat.concat(4)); // [1,2,3,4]
console.log(arrayConcat.concat(['A', 'B', 'C'])); // [1,2,3,'A','B','C']
console.log(arrayConcat); // [1,2,3]

// join
// 배열의 요소 사이에 문자를 삽입하여 문자열로 반환
const arrayJoin = [1,2,3,4,5];
console.log(arrayJoin.join('/')) // 1/2/3/4/5

// reverse
// 배열을 뒤집음
const arrayReverse = [1,2,3];
arratReverse.reverse();
console.log(arrayReverse); // [3,2,1]

// sort
// 배열을 정렬
//  콜백함수를 인자로 보내어 조금더 디테일하게 정렬할 기준을 정해줄 수 있다.
const arraySort = [5,1,2];
arraySort.sort();
console.log(arraySort); // [1,2,5]

// slice
// 배열의 일부를 새 배열로 반환
//  기존의 배열을 바꾸지 않는다.
const arraySlice = [1,2,3];
console.log(arraySlice.slice(0, 1)); // [1]
console.log(arraySlice); // [1,2,3]

// splice
// 기존 배열의 요소를 제거하거나 새로운 요소로 변경
const arraySplice = [1,2,3,4];
arraySplice.splice(0,1,7);
console.log(arraySplice); // [7,2,3,4]
arraySplice.splice(1,2);
console.log(arraySplice); // [7,4]
arraySplice.splice(1,0,9);
console.log(arraySplice); // [7,9,4]
arraySplice.splice(0,2,6,8);
console.log(arraySplice); // [6,8,4]
```

## 후기
* 너무나도 익숙한 배열이기때문에.. 별 느낌이 없없다.