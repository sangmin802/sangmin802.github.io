---
title: '프린터-Stack&Que'
date: 2021-06-24 14:24:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 프린터 Lv2

일반적인 프린터는 인쇄 요청이 들어온 순서대로 인쇄합니다. 그렇기 때문에 중요한 문서가 나중에 인쇄될 수 있습니다. 이런 문제를 보완하기 위해 중요도가 높은 문서를 먼저 인쇄하는 프린터를 개발했습니다. 이 새롭게 개발한 프린터는 아래와 같은 방식으로 인쇄 작업을 수행합니다.

1. 인쇄 대기목록의 가장 앞에 있는 문서`(J)`를 대기목록에서 꺼냅니다.
2. 나머지 인쇄 대기목록에서 J보다 중요도가 높은 문서가 한 개라도 존재하면 `J`를 대기목록의 가장 마지막에 넣습니다.
3. 그렇지 않으면 `J`를 인쇄합니다.

예를 들어, 4개의 문서`(A, B, C, D)`가 순서대로 인쇄 대기목록에 있고 중요도가 `2 1 3 2` 라면 `C D A B` 순으로 인쇄하게 됩니다.

내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 알고 싶습니다. 위의 예에서 `C`는 1번째로, `A`는 3번째로 인쇄됩니다.

현재 대기목록에 있는 문서의 중요도가 순서대로 담긴 배열 `priorities`와 내가 인쇄를 요청한 문서가 현재 대기목록의 어떤 위치에 있는지를 알려주는 `location`이 매개변수로 주어질 때, 내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 `return` 하도록 `solution` 함수를 작성해주세요.

## 제한사항

- 현재 대기목록에는 1개 이상 100개 이하의 문서가 있습니다.
- 인쇄 작업의 중요도는 1~9로 표현하며 숫자가 클수록 중요하다는 뜻입니다.
- `location`은 0 이상 (현재 대기목록에 있는 작업 수 - 1) 이하의 값을 가지며 대기목록의 가장 앞에 있으면 0, 두 번째에 있으면 1로 표현합니다.

### 해결 방안

1. 최대값이 첫 값과 동일하지 않은 경우

   - 해당 값을 배열의 맨 뒤로 이동
   - 단, 해당 값이 나의 작업일 경우, 나의 작업 `location`은 배열의 길이로 변경
     > 슬라이드에서의 `count`를 생각함

2. 최대값이 첫 값과 동일한 경우 - 선입선출 `que`에 작업 저장 후 배열에서 소멸

3. 동일조건
   - 나의 작업의 앞 순서들이 하나씩 사라지기 때문에 작업을 진행할 때마다 `location-= -1`
     > 예외의 상황 `location`이 0인경우 위에서 해결
   - 만약 `location`이 -1이 된다면 작업 종료

```ts
function solution(priorities, location) {
  const que = []
  const arr = [...priorities]
  let count = location

  while (arr.length !== 0) {
    const max = Math.max(...arr)
    if (max !== arr[0]) {
      arr.push(arr.shift())
      // if 내부 if는 코딩컨벤션에 적합하지 않은 방식이지만.. 그게중요한게 아니니깐
      if (count === 0) count = arr.length
    } else {
      que.push(arr.shift())
    }

    count -= 1
    if (count === -1) break
  }

  return que.length
}
```

## 출처

- [프로그래머스 프린터](https://programmers.co.kr/learn/courses/30/lessons/42587)
