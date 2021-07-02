---
title: '이중우선순위큐-Heap'
date: 2021-06-28 14:16:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 이중우선순위큐 Lv3

이중 우선순위 큐는 다음 연산을 할 수 있는 자료구조를 말합니다.

- `I 숫자` : 큐에 주어진 숫자를 삽입합니다.
- `D 1` : 큐에서 최댓값을 삭제합니다.
- `D -1` : 큐에서 최솟값을 삭제합니다.

이중 우선순위 큐가 할 연산 `operations`가 매개변수로 주어질 때, 모든 연산을 처리한 후 큐가 비어있으면 `[0,0]` 비어있지 않으면 `[최댓값, 최솟값]`을 `return` 하도록 `solution` 함수를 구현해주세요.

## 제한사항

- `operations`는 길이가 1 이상 1,000,000 이하인 문자열 배열입니다.
- `operations`의 원소는 큐가 수행할 연산을 나타냅니다.
  - 원소는 “명령어 데이터” 형식으로 주어집니다.- 최댓값/최솟값을 삭제하는 연산에서 최댓값/최솟값이 둘 이상인 경우, 하나만 삭제합니다.
- 빈 큐에 데이터를 삭제하라는 연산이 주어질 경우, 해당 연산은 무시합니다.

### 해결 방안

```ts
function solution(operations) {
  const que = []

  operations.forEach(order => {
    const [a, b] = order.split(' ')
    if (a === 'I') {
      que.push(b)
      return que.sort((a, b) => a - b)
    }
    if (b === '1') return que.pop()
    if (b === '-1') return que.shift()
  })

  if (!que.length) return [0, 0]
  return [Math.max(...que), Math.min(...que)]
}
```

## 출처

- [프로그래머스 이중우선순위큐](https://programmers.co.kr/learn/courses/30/lessons/42628?language=javascript)
