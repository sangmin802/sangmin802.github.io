---
title : "자료구조 Data Structures Tree"
date : 2020-12-04 00:00:00
category : "Study"
draft : false
tag : Data Structures
toc_label: "Stack"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Tree 트리
* 단순히 나무를 뒤집어놓은것처럼 생겨서 트리이다.
> DOM에서 태그를 조회하였을 때, 자식노드들이 쭈르륵 있는것을 생각하면 편할듯

## 용어
* Root : 첫 시작이 되는 노드
* Leaf : 마지막노드
* Branch || Edge : 노드와 노드를 이어주는 것
  > 그래프도 Edge로 이어져있었다.
* Height : 시작이 되는 노드에서 끝이되는 노드 사이의 Edge 갯수
* 이진트리(Binary Tree) : 자식노드를 최대 2개까지만 가질수 있는 트리
* 완전한이진트리(Full Binary Tree) : Leaf들을 제외한 모든 노드가 2개의 자식노드를 가지고있고, 모든 Leaf들이 값을 가지고 있는 트리
* 이진탐색트리(Binary Search Tree, 이진검색트리) : 현재 노드의 오른쪽에있는 노드는 반드시 현재노드보다 큰 값이며, 왼쪽은 작은 값이다.

## 자바스크립트로 트리 구현하기
* 이번에 재귀함수가 더 익숙해진 느낌이다
  > 탈출구가 필요함(최종값의 결과물이나, 메소드가 한번 실행되었을 때 결과물을 반환)
  > 자식?느낌의 값이 기준이되도록 자식자신과 비교값등등을 인자로 재귀함수 진행
* 삽입은 큰 어려움 없으니 패스
* 삭제하려는 노드의 자식노드가 둘다 없을 때 -> 그냥 지우면된다.
* 삭제하려는 노드의 왼쪽자식이나 오른쪽자식만 있을 때 -> 그 자식을 끌어올려준다.

### 삭제하려는 노드의 자식노드가 둘 다 있을 때
1. 삭제하려는 노드(현재노드라고 하겠음)를 찾고, 해당 노드의 왼쪽자식노드를 기준으로 가장 오른쪽에있는노드를 찾는다.(삭제하려는 노드 다음으로 큰 노드)
2. 둘의 값을 바꿔준다.
3. 현재노드의 왼쪽자식노드를 기준으로, 삭제하려는 노드의 값을 찾아 지워주도록 하여(재귀함수를 다시 실행시켜 자동으로 세가지 조건에 맞는 과정을 거치도록 함) 왼쪽자식노드를 새롭게 만들어준다.

```javascript
class Node {
  constructor(value){
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(){
    this.root = null;
  }

  insert(value){
    const newNode = new Node(value);
    if(!this.root) return this.root = newNode;
    return this.insertRecursive(this.root, newNode);
  }
  
  delete(value){
    if(!this.root) return this.root;
    return this.deleteRecursive(this.root, value);
  }

  insertRecursive(node, newNode){
    if(!node) return newNode; // 왼쪽이나 오른쪽 자식노드가 없다면 그냥 노드 넣기
    if(node.value > newNode.value) node.left = this.insertRecursive(node.left, newNode); // 새 노드의 값이 더 작다면, 왼쪽노드의 값과 비교해보기위해 재귀함수 전달
    if(node.value <= newNode.value) node.right = this.insertRecursive(node.right, newNode); // 새 노드의 값이 더 크거나 같다면, 오른쪽노드의 값과 비교해보기위해 재귀함수 전달
    return node;
  }

  deleteRecursive(node, value){
    if(!node) return; // 노드가 없다면 그냥 종료
    if(node.value > value){ // 지우려는값보다 현재노드의 값이 더 크다면, 왼쪽노드의 값과 비교하기위해 재귀함수 전달
      node.left = this.deleteRecursive(node.left, value);
      return node; // 재귀함수 탈출구
    }
    if(node.value < value){ // 지우려는값보다 현재노드의 값이 더 작다면, 오른쪽노드의 값과 비교하기위해 재귀함수 전달
      node.right = this.deleteRecursive(node.right, value);
      return node; // 재귀함수 탈출구
    }

    // 지우려는 값과 현재 노드의 값이 동일하여 지우려는 대상일 경우
    if(!node.left && !node.right) return node = null; // 자식이 없을때는 그냥 삭제
    if(!node.left && node.right) return node = node.right; // 오른쪽자식만 있다면, 오른쪽자식 끌어올리기
    if(node.left && !node.right) return node = node.left; // 왼쪽자식만 있다면, 왼쪽자식 끌어올리기

    // 둘다 가지고있을 경우
    let changeTarget = node.left; // 현재 노드의 왼쪽자식을 기준으로 가장 오른쪽에있는 Leaf노드를 찾음(현재 노드의 값보단 작은 두번째로 큰 값)
    while(changeTarget.right) changeTarget = changeTarget.right;
    node.value = changeTarget.value; // 현재 노드의 값을 찾은 값으로 변경
    changeTarget.value = value; // 찾은 값을 현재노드의 값으로 변경
    node.left = this.deleteRecursive(node.left, value); // 현재 노드의 왼쪽자식을 기준으로 하여 지우려는 값을 삭제하는 재귀함수 진행 후, 새롭게 왼쪽자식트리 생성
    return node; // 재귀함수 탈출구
  }
}

const tree = new Tree();
tree.insert(6);
tree.insert(10);
tree.insert(7);
tree.insert(4);
tree.insert(12);
tree.insert(15);
tree.insert(1);
tree.insert(3);
tree.insert(2);
tree.insert(5);
tree.delete(6)
console.log(tree);
```

## 느낌
* 삭제때문에 많이 애먹었다.