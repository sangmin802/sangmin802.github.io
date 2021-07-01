---
title: '알고리즘-DFS/BFS'
date: 2021-07-01 16:12:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 여행경로 Lv3

주어진 항공권을 모두 이용하여 여행경로를 짜려고 합니다. 항상 `"ICN"` 공항에서 출발합니다.

항공권 정보가 담긴 2차원 배열 `tickets`가 매개변수로 주어질 때, 방문하는 공항 경로를 배열에 담아 `return` 하도록 `solution` 함수를 작성해주세요.

## 제한사항

- 모든 공항은 알파벳 대문자 3글자로 이루어집니다.
- 주어진 공항 수는 3개 이상 10,000개 이하입니다.
- `tickets`의 각 행 `[a, b]`는 `a` 공항에서 `b` 공항으로 가는 항공권이 있다는 의미입니다.
- 주어진 항공권은 모두 사용해야 합니다.
- 만일 가능한 경로가 2개 이상일 경우 알파벳 순서가 앞서는 경로를 `return` 합니다.
- 모든 도시를 방문할 수 없는 경우는 주어지지 않습니다.

### 해결 방안

처음에는 간단한 문제라고 생각했었다.
모든 항공권을 사용할 수 있다고 해서 `ICN > 도칙지` 순 으로 정렬을 한 다음, 이어지는 경로의 끝을 찾아야 하므로 `dfs` 방식으로 해결하려고 했다.

하지만, 1번의 테스트케이스만 계속 시간초과라는 오답을 반환했다.

알아보니, **항공권을 모두 사용할 수 있지만, 중간에 연결이 끊길수 도 있다는 점이였다**

결국 정렬은 뒤로하고 모든 항공 경로를 따지기로 하였다. 출발 공항을 강제로 `"ICN"`으로 지정해준다면 중요한 정렬자체는 해결되는 셈이였다.

1. `출발지 = "ICN"`, `사용한 항공권`, `누적 경로`를 변수로 받는 재귀함수를 만든다.
   - `visit`과 `tickets`의 길이가 동일하다면 누적된 경로를 `answers`에 넣고 종료
   - `tickets`를 순회하여 해당 함수를 재귀시켜줌
     - 현재 출발지와 해당 항공권의 도착지가 다르다면 `continue`
     - 이미 사용한 항공권이라면 `continue`
2. `answers`에 담긴 모든 경로들을 한번 정렬해주고, 가장 빠른 0번쨰 경로를 반환한다.
   - 배열 내부의 문자열들또한 고려해서 정렬을 해주는것은 처음알았다.

```ts
function solution(tickets) {
  const answers = []
  const dfs = (depart, visit, path) => {
    if (visit.length === tickets.length) return answers.push(path)
    for (let i in tickets) {
      if (tickets[i][0] !== depart) continue
      if (visit.includes(tickets[i])) continue
      dfs(tickets[i][1], [...visit, tickets[i]], [...path, tickets[i][1]])
    }
  }

  dfs('ICN', [], ['ICN'])

  // 배열 내에서 값들을 빠른순으로 정렬
  return answers.sort()[0]
}
```

## 후기

1. `bfs`, `dfs`자료구조를 해결하는데에는 재귀가 단순하면서도 최고인듯 하다.
2. `sort`는 생각보다 친절했다.

## 출처

- [프로그래머스 여행경로](https://programmers.co.kr/learn/courses/30/lessons/43164?language=javascript)
