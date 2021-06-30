---
title: '알고리즘-DFS/BFS'
date: 2021-06-30 16:32:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 단어변환 Lv3

두 개의 단어 `begin`, `target`과 단어의 집합 `words`가 있습니다. 아래와 같은 규칙을 이용하여 `begin`에서 `target`으로 변환하는 가장 짧은 변환 과정을 찾으려고 합니다.

1. 한 번에 한 개의 알파벳만 바꿀 수 있습니다.
2. `words`에 있는 단어로만 변환할 수 있습니다.

예를 들어 `begin`이 `"hit"`, `target`가 `"cog"`, `words`가 `["hot","dot","dog","lot","log","cog"]`라면 `"hit" -> "hot" -> "dot" -> "dog" -> "cog"`와 같이 4단계를 거쳐 변환할 수 있습니다.

두 개의 단어 `begin`, `target`과 단어의 집합 `words`가 매개변수로 주어질 때, 최소 몇 단계의 과정을 거쳐 `begin`을 `target`으로 변환할 수 있는지 `return` 하도록 `solution` 함수를 작성해주세요.

## 제한사항

- 각 단어는 알파벳 소문자로만 이루어져 있습니다.
- 각 단어의 길이는 3 이상 10 이하이며 모든 단어의 길이는 같습니다.
- `words`에는 3개 이상 50개 이하의 단어가 있으며 중복되는 단어는 없습니다.
- `begin`과 `target`은 같지 않습니다.
- 변환할 수 없는 경우에는 0를 `return` 합니다.

### 해결 방안

힌트를 너무 많이봐서 이야기하기도 민망하고 속상하다.
`bfs`, `dfs` 자료구조에 대한 이해가 좀 많이 부족한듯 하다.

```ts
function solution(begin, target, words) {
  const visit = []
  const que = [begin]
  const compare = (root, b) => {
    let dif = 0
    for (let i = 0; i < root.length; i++) if (root[i] !== b[i]) dif += 1
    return dif === 1
  }

  let queSize = 1
  let answer = 0

  while (que.length) {
    // 바꾼 단어
    const targetWord = que.shift()
    // 현재 깊이의 작업들을 수행할 때마다
    queSize -= 1
    // que에서 뺀 단어와 전체 단어 배열을 비교해봄
    for (let i in words) {
      // 차이가 하나라면
      if (compare(targetWord, words[i])) {
        // 확인해 본 단어라면 재시작
        if (visit.includes(words[i])) continue
        // 목표로 하는 단어와 동일하다면 **정답** 임
        if (words[i] === target) return (answer += 1)
        // 아직 확인해보지 않은 단어라면 작업에 추가
        visit.push(words[i])
        que.push(words[i])
      }
    }

    // 현재 단계의 작업들이 모두 완료되고 새로운 단계로 업그레이드
    if (!queSize) {
      answer += 1
      queSize = que.length
    }
  }
  return 0
}
```

## 출처

- [프로그래머스 단어 변환](https://programmers.co.kr/learn/courses/30/lessons/43163#qna)
