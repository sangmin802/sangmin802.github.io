---
title: '알고리즘-DFS/BFS'
date: 2021-06-28 16:19:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 타겟 넘버 Lv2

`n`개의 음이 아닌 정수가 있습니다. 이 수를 적절히 더하거나 빼서 타겟 넘버를 만들려고 합니다. 예를 들어 `[1, 1, 1, 1, 1]`로 숫자 `3`을 만들려면 다음 다섯 방법을 쓸 수 있습니다.

1. `-1+1+1+1+1 = 3`
2. `+1-1+1+1+1 = 3`
3. `+1+1-1+1+1 = 3`
4. `+1+1+1-1+1 = 3`
5. `+1+1+1+1-1 = 3`

사용할 수 있는 숫자가 담긴 배열 `numbers`, 타겟 넘버 `target`이 매개변수로 주어질 때 숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 방법의 수를 `return` 하도록 `solution` 함수를 작성해주세요.

## 제한사항

- 주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
- 각 숫자는 1 이상 50 이하인 자연수입니다.
- 타겟 넘버는 1 이상 1000 이하인 자연수입니다.

### 해결 방안

1. 하나의 숫자를 `+`, `-` 두가지 방식으로 연산하여 뿌리를 이어나가도록 재귀함수를 작성

```ts
function solution(numbers, target) {
  let answer = 0

  function recursive(i, total) {
    if (numbers.length === i) {
      if (total === target) answer += 1
      return
    }

    recursive(i + 1, total + numbers[i])
    recursive(i + 1, total - numbers[i])
  }

  recursive(0, 0)

  return answer
}
```

## 출처

- [프로그래머스 타겟 넘버](https://programmers.co.kr/learn/courses/30/lessons/43165/solution_groups?language=javascript&type=my)
