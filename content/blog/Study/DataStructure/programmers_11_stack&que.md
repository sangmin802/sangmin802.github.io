---
title: '다리를 지나는 트럭-Stack&Que'
date: 2021-06-25 15:15:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 다리를 지나는 트럭 Lv2

트럭 여러 대가 강을 가로지르는 일차선 다리를 정해진 순으로 건너려 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 다리에는 트럭이 최대 `bridge_length`대 올라갈 수 있으며, 다리는 `weight` 이하까지의 무게를 견딜 수 있습니다. 단, 다리에 완전히 오르지 않은 트럭의 무게는 무시합니다.

`solution` 함수의 매개변수로 다리에 올라갈 수 있는 트럭 수 `bridge_length`, 다리가 견딜 수 있는 무게 `weight`, 트럭 별 무게 `truck_weights`가 주어집니다. 이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 `return` 하도록 `solution` 함수를 완성하세요.

## 제한사항

- `bridge_length`는 1 이상 10,000 이하입니다.
- `weight`는 1 이상 10,000 이하입니다.
- `truck_weights`의 길이는 1 이상 10,000 이하입니다.
- 모든 트럭의 무게는 1 이상 `weight` 이하입니다.

### 해결 방안

- 길이에 맞는 다리를 생성함
- 대기 트럭이 있다면, 다리 위에는 항상 트럭이 존재함
- 다리위의 트럭이 없을때까지 시간을 잼

1. 다리 위에 트럭이 더 올라설 수 있을 경우
   - 맨 앞의 값을 빼고 뒤에 다음 트럭을 추가함
2. 다리 위에 트럭이 더 올라설 수 없을 경우
   - 맨 앞의 값을 빼고 뒤에 0을 추가함

- 맨 앞의 트럭을 뺄 때, 0이 아니라면 다리의 총 무게에서 해당 무게를 뺌

```ts
function solution(bridge_length, weight, truck_weights) {
  const bridge = new Array(bridge_length - 1).fill(0)
  const trucks = [...truck_weights]
  let bridgeWeight = trucks[0]
  let time = 1

  bridge.push(trucks[0])
  trucks.shift()

  // 다리 위 무게가 0이되면 종료
  while (bridgeWeight) {
    const outSomething = bridge.shift()
    time++
    // 1초가 지나고 한칸 전진하여 맨 앞의 값을 뺌
    if (outSomething !== 0) bridgeWeight -= outSomething

    // 맨 앞의 값이 빠져서 새로운 값이 들어오게됨
    // 트럭이 더 들어올 수 있는지, 없는지
    if (bridgeWeight + trucks[0] <= weight) {
      bridgeWeight += trucks[0]
      bridge.push(trucks.shift())
    } else {
      bridge.push(0)
    }
  }

  return time
}
```

## 아쉬움

위의 해결방안을 보았을 때 조금 아쉬운점이 있다. 좋은 성능을 위해서 알고리즘을 짜는것인데, 크기가 얼마나 되든 다리의 길이를 실제로 구현하여 메모리를 소비하고, 그만큼의 시간이 더 흐른다는 점이다.

시간복잡도와 공간복잡도 측면에서 모두 아쉬움이 있는 해결방법이였다..

본래 이 해결방법은 차선으로 생각했던 문제였고, 처음에 생각했던 방식이 잘 풀리지 않아 일단 해결먼저 하였다.

## 처음의 생각

처음의 생각에서 키포인트는

1. 다리 위의 무게가 여유가 있어서 트럭이 더 들어올 수 있는경우
2. 다리 위의 무게에 여유가 없어서 맨 앞의 트럭이 빠져야 가능한 경우

즉, 무게가 꽉 찼을 때 새로운 트럭이 들어올 수 있는 조건에는 앞의 트럭이 빠져야만 하므로 다리의 길이가 어쨌든 나가는 시간만 계산하면 된다고 생각했다.

> 그런데 쉽지 않네..

## 더 좋은 해결

```ts
function solution(bridge_length, weight, truck_weights) {
  const trucks = [...truck_weights]
  // 트럭의 무게, 다리에서 나가는 시간
  const bridge = [[trucks[0], bridge_length + 1]]
  let bridgeWeight = trucks.shift()
  let time = 1

  while (bridge.length || trucks.length) {
    // 시간이 흐름
    time++
    // 만약 맨 앞의 트럭이 나가는 시간이 현재 시간과 동일하다면 해당 트럭 내보냄
    if (bridge[0][1] === time) bridgeWeight -= bridge.shift()[0]
    // 새로운 트럭이 추가될 수 있다면
    if (bridgeWeight + trucks[0] <= weight) {
      bridgeWeight += trucks[0]
      // 해당 트럭이 다리에서 나가는 시간은 현재 시간 + 다리 길이
      bridge.push([trucks.shift(), bridge_length + time])

      // 새로운 트럭이 추가될 수 없다면
      //      - 더 이상 트럭이 없을 때
      //      - 무게때문에 들어갈 수 없을 때
    } else {
      // 가고있는 트럭이 있다면 강제로 트럭 내보내고 현재 시간을 그 트럭이 나간시간과 동일하게 변경
      // 단, 문제의 조건 상 무게에 문제가 없다면 트럭이 나감과 동시에 들어와야 하므로 loop의 시작에서 추가되는 1초가 존재하지 않기 때문에 미리 -1초를 해줌
      if (bridge[0]) time = bridge[0][1] - 1
    }
  }

  return time
}
```

이 방법을 통해, 확실히 길이가 긴 상황에 있어서는 몇 배 이상의 시간차가 났다.

## 출처

- [프로그래머스 다리를 지나는 트럭](https://programmers.co.kr/learn/courses/30/lessons/42583?language=javascript#)
