---
title: '카펫-Exploration'
date: 2021-06-28 16:19:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 카펫 Lv2

`Leo`는 카펫을 사러 갔다가 아래 그림과 같이 중앙에는 노란색으로 칠해져 있고 테두리 1줄은 갈색으로 칠해져 있는 격자 모양 카펫을 봤습니다.

`Leo`는 집으로 돌아와서 아까 본 카펫의 노란색과 갈색으로 색칠된 격자의 개수는 기억했지만, 전체 카펫의 크기는 기억하지 못했습니다.

`Leo`가 본 카펫에서 갈색 격자의 수 `brown`, 노란색 격자의 수 `yellow`가 매개변수로 주어질 때 카펫의 가로, 세로 크기를 순서대로 배열에 담아 `return` 하도록 `solution` 함수를 작성해주세요.

## 제한사항

- 갈색 격자의 수 `brown`은 8 이상 5,000 이하인 자연수입니다.
- 노란색 격자의 수 `yellow`는 1 이상 2,000,000 이하인 자연수입니다.
- 카펫의 가로 길이는 세로 길이와 같거나, 세로 길이보다 깁니다.

### 해결 방안

1. `yellow` 카펫을 감싸기 위해서 최소 `x`축, `y`축의 길이는 `[3,3]`
2. 남은 `brown`과 `yellow`가 없을 때 까지 반복
3. 어떠한 상황이든 `brown`은 2개씩 소비
4. 기본적으로 `x`축으로 증가시킴

   - `x`축으로 증가할 때에는, `x`축 길이에서 양 모서리를 빼준 값인 `y += carpet[1] - 2`

5. 남은 `brown`이 나열될 수 있는 횟수와 남은 `yellow`가 나열될 수 있는 횟수가 동일하지 않다면 `y`축으로 증가
   - `y`축으로 증가할 때에는 `y`축 길이에서 양 모서리를 빼준 값인 `y += carpet[0]-2`

```ts
function solution(brown, yellow) {
  const carpet = [3, 3]
  let b = 8
  let y = 1

  while (brown - b > 0 || yellow - y > 0) {
    const restB = brown - b
    const restY = yellow - y
    b += 2

    if (restB / 2 !== restY / (carpet[1] - 2)) {
      y += carpet[0] - 2
      carpet[1] += 1
      continue
    }

    y += carpet[1] - 2
    carpet[0] += 1
  }

  return carpet
}
```

### 더 나은 해결

문제를 해결하고, 다른 사람의 풀이를 보니 보다 더 좋은 방법이 있었다.

`양 모서리를 제외하여야 한다.` 와 `최소 3칸을 가져야 한다.` 라는 두가지 규칙은 찾았지만, 아주 간단하고 기본적인 한가지를 생각하지 못해서 조금 돌아서 푼 느낌이였다.

바로,

`생성된 카펫은 총 카펫 수의 두개의 인수를 곱한 값이다.`

직사각형모양은 `x*y`로 해당 도형의 크기를 짐작할 수 있는 점!

```ts
function solution(brown, red) {
  const total = brown + red
  let answer = []

  // total의 두개의 인수를 구하기 위한 식
  for (let a = 3; total / a >= a; a++) {
    const b = total / a
    // red의 갯수는 x축 - 양 모서리 * y축 - 양 모서리
    if ((a - 2) * (b - 2) === red) {
      // 더 큰 값이 x
      answer = [b, a]
      break
    }
  }
  return answer
}
```

## 출처

- [프로그래머스 카펫](https://programmers.co.kr/learn/courses/30/lessons/42842?language=javascript)
