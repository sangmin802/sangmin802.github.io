---
title: '네트워크-DFS/BFS'
date: 2021-06-29 15:23:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 네트워크 Lv3

네트워크란 컴퓨터 상호 간에 정보를 교환할 수 있도록 연결된 형태를 의미합니다. 예를 들어, `컴퓨터 A`와 `컴퓨터 B`가 직접적으로 연결되어있고, `컴퓨터 B`와 `컴퓨터 C`가 직접적으로 연결되어 있을 때 `컴퓨터 A`와 `컴퓨터 C`도 간접적으로 연결되어 정보를 교환할 수 있습니다. 따라서 `컴퓨터 A, B, C`는 모두 같은 네트워크 상에 있다고 할 수 있습니다.

컴퓨터의 개수 `n`, 연결에 대한 정보가 담긴 2차원 배열 `computers`가 매개변수로 주어질 때, 네트워크의 개수를 `return` 하도록 `solution` 함수를 작성하시오.

## 제한사항

- 컴퓨터의 개수 `n`은 1 이상 200 이하인 자연수입니다.
- 각 컴퓨터는 0부터 `n-1`인 정수로 표현합니다.
- `i`번 컴퓨터와 `j`번 컴퓨터가 연결되어 있으면 `computers[i][j]`를 1로 표현합니다.
- `computer[i][i]`는 항상 1입니다.

### 해결 방안

1. `체크가 필요한 컴퓨터 배열`, `모든 컴퓨터의 배열`이 남아있다면 작업 계속 진행
2. `체크가 필요한 컴퓨터 배열`이 비어있다면, `모든 컴퓨터의 배열`의 첫번째 컴퓨터를 받아옴
   - 아래의 작업 중, 아무런 컴퓨터와도 연결되지 않은 컴퓨터일 경우, 다음 컴퓨터를 받아오도록 하기 위함 + 초기 값
   - `index` 카운팅
3. `체크가 필요한 컴퓨터 배열`의 첫번째 배열의 첫번째 값이 체크한 컴퓨터이거나, 존재하지 않다면 처음부터 진행
4. 3번의 조건이 아니라면, 현재 연결된 컴퓨터의 `index`
   - `체크가 필요한 컴퓨터 배열`에 해당 컴퓨터 배열을 기존 앞에 풀어넣음
   - 연결중인 네트워크 선 -1
   - 체크한 컴퓨터 배열에 해당 `index`의 컴퓨터 추가

```ts
function solution(n, computers) {
  const arr = [...computers]
  const CComputer = [] // Checked Computer
  let NCComputer = [] // Need Check Computer
  let index = 0
  let answer = n

  function returnIndex(arr, me) {
    const newArr = []
    arr.forEach((r, i) => {
      if (r === 1 && i !== me) newArr.push(i)
    })
    return newArr
  }

  while (NCComputer.length || arr.length) {
    if (!NCComputer.length) {
      NCComputer.push(...returnIndex(arr.shift(), index))
      CComputer.push(index)
      index += 1
    }

    const target = NCComputer.shift()
    if (CComputer.includes(target)) continue
    if (!target) continue

    NCComputer = [...returnIndex(computers[target], target), ...NCComputer]
    answer -= 1
    CComputer.push(target)
  }

  return answer
}
```

최대한 모든 상황을 확인하려 했고, 어떠한 컴퓨터와도 연결되지 않은 컴퓨터에는 접근할 수 없기 때문에, 모든 컴퓨터를 네트워크 수라고 가정한 다음, 연결되어있을 때마다 -1을 해주었다.

### 더 나은 해결방안

실제로 컴퓨터의 갯수만큼 공간을 생성하고, 체크를 한 컴퓨터인지와 네트워크 갯수를 동시에 처리하는 방식이다.

1. `n`개 의 `false`속성인 배열을 만든다.
2. 그 갯수만큼 재귀함수를 실행시킨다.
   - 이때 재귀함수는 네트워크 수를 반환한다.
3. 만약 체크를 한 컴퓨터라면 0을 반환
4. 체크하지 않은 컴퓨터일 경우
   - `true`로 변경
   - 해당 컴퓨터 배열을 순회하여 연결되어있는 다른 `index`의 컴퓨터들을 재귀함수의 인자로 보냄
     > 서로가 연결되어있다면, 이미 `true`로 되어있기 때문에 0으로 조기종료됨
   - 연결한 컴퓨터이기 때문에 1을 반환

```ts
function solution(n, computers) {
  let answer = 0
  let visit = new Array(n).fill(false)

  for (let i = 0; i < n; i++) {
    answer += recursive(i)
  }

  function recursive(i) {
    const visited = visit[i]
    if (visited) return 0
    visit[i] = true

    for (let a = 0; a < computers[i].length; a++) {
      // 연결이 된 컴퓨터인 경우만 재귀함수 진행
      if (computers[i][a] === 1) recursive(a)
    }

    return 1
  }

  return answer
}
```

## 출처

- [프로그래머스 네트워크](https://programmers.co.kr/learn/courses/30/lessons/43162?language=javascript)
