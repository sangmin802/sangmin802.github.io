---
title : "자료구조 Data Structures Graphs"
date : 2020-12-02 00:00:05
category : "Study"
draft : false
tag : Data Structures
toc: true
toc_label: "Stack"
sidebar : 
  title : '자료 구조'
  nav : DataStructures
--- 

# Graphs 그래프

<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 100%" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fpuzc4%2FbtqzrWYUh0F%2F9OGKTFwewWdUivuDupPKM0%2Fimg.gif" alt="result1">
</div>

* 각 노드들이 서로 연결되어있는 자료 구조형으로, 아주 커다란 자료 구조형의 범위 중 하나라고 한다.
  > 실제로, `Trees`자료구조가 포함되어있고, 그 안에는 `Linked List`가 포함되어있다고 함..
* 상하위 개념이 없이 노드들간의 간선을 하나로 모아놓은 자료구조라고 한다.

## 구현방식
* 인접리스트 : 노드를 키로 사용하여 해당 노드의 이웃들을 리스트에 저장한다.
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2020/12/02/graph2.PNG?raw=true" alt="graph">
</div>

* 인접행렬 : 행렬의 각 항목이 두 노드간에 연결얼 나타내는 행렬이다.
<div style="margin : 0 auto; text-align : center">
  <img src="/img/2020/12/02/graph1.PNG?raw=true" alt="graph">
</div>

```javascript
class Graph {
  constructor(){
    this.vertexes = {};
  }

  addVertex(vertex){
    this.vertexes[vertex] = {value : vertex};
  }

  addEdge(vertex1, vertex2, weight){
    this.vertexes[vertex1][vertex2] = weight;
    this.vertexes[vertex2][vertex1] = weight;
  }
}

const graph = new Graph;
graph.addVertex('일산서구')
graph.addVertex('일산동구')
graph.addVertex('덕양구')
graph.addEdge('일산서구', '일산동구', 1)
graph.addEdge('일산서구', '덕양구', 1)
graph.addEdge('일산동구', '덕양구', 2)
```

## 용어
* Vertex : 그래프에서는 노드를 벌텍스라고함
* 간선(엣지) : 노드들을 연결하는 선
* 차수 : 하나의 노드에 닿는 간선의 수
* 인접 : 간선을 한번만 통해 갈 수 있는 경우
* 무방향 그래프(쌍방향) : 페이스북과 같이, 친구를 맺으면 상호 친구가 됨
* 단방향 그래프 : 인스타는 다른사용자를 팔로우 한다고 해서 서로 상호팔로우 되지는 않음
* 가중치 : 간선의 길이? 즉, A노드에서 B노드까지의 거리
  > ex) A지역에서 B지역까지의 거리