---
title: '알고리즘-Hash'
date: 2021-05-31 17:10:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 위장 Lv2

스파이들은 매일 다른 옷을 조합하여 입어 자신을 위장합니다.

예를 들어 스파이가 가진 옷이 아래와 같고 오늘 스파이가 동그란 안경, 긴 코트, 파란색 티셔츠를 입었다면 다음날은 청바지를 추가로 입거나 동그란 안경 대신 검정 선글라스를 착용하거나 해야 합니다.

스파이가 가진 의상들이 담긴 2차원 배열 clothes가 주어질 때 서로 다른 옷의 조합의 수를 return 하도록 solution 함수를 작성해주세요.

## 제한사항

- clothes의 각 행은 [의상의 이름, 의상의 종류]로 이루어져 있습니다.
- 스파이가 가진 의상의 수는 1개 이상 30개 이하입니다.
- 같은 이름을 가진 의상은 존재하지 않습니다.
- clothes의 모든 원소는 문자열로 이루어져 있습니다.
- 모든 문자열의 길이는 1 이상 20 이하인 자연수이고 알파벳 소문자 또는 `_` 로만 이루어져 있습니다.
- 스파이는 하루에 최소 한 개의 의상은 입습니다.

## 잘못된 해결

```js
function solution(clothes) {
  let answer = 0
  const compusition = []
  //   의류 타입들 정리
  const clothTypes = clothes.reduce((prev, cur) => {
    if (!prev.includes(cur[1])) prev.push(cur[1])
    return prev
  }, [])

  //   각각 의류 타입들의 조합을 구하는 함수
  function recursive(arr, res) {
    if (arr.length === 0) return
    for (let i = 0; i < arr.length; i++) {
      const newRes = [...res]
      const newArr = [...arr]
      newRes.push(arr[i])
      newArr.splice(0, i + 1)
      compusition.push(newRes)
      recursive(newArr, newRes)
    }
  }
  recursive(clothTypes, [])

  //  각각 의류의 타입별 갯수
  const obj = {}
  clothes.forEach(([cloth, type]) => {
    if (!obj[type]) return (obj[type] = 1)
    obj[type]++
  })

  //  하나의 의류면 갯수 그대로, 그렇지 않다면 조합된 의류들과 곱해서 반환
  const arr = compusition.map(res => {
    if (res.length === 1) return obj[res]
    let count = 1
    for (let i = 0; i < res.length; i++) {
      count = obj[res[i]] * count
    }
    return count
  })

  arr.forEach(res => {
    answer = answer + res
  })

  return answer
}
```

처음에 문제를 접했을 때, 각각의 의류들을 곱해주고 아무것도 안입은 상태만 `-1` 해주면 되는거 아닌가..?

라는 생각을 했는데 아니였다.

그래서, 생길수 있는 모든 조합을 구하고, 그 조합에 맞게 계산하여 더해주도록 하였다.

제출후 채점을 하면서 다른 문제들은 모두 정답이 나왔지만, 1번문제만 시간초과라는 오답이 발생하였다.

질문하기를 보니 1번 문제는 가장 많은 경우의 수가 발생하는 30가지의 의류를 계산하는것이였다.

시간이 오래걸릴수밖에 없도록 코드를 구성하였으니 당연한 결과였다.

## 정답

```js
function solution(clothes) {
  let answer = 1
  const obj = {}
  clothes.forEach(([cloth, type]) => {
    if (!obj[type]) return (obj[type] = 1)
    obj[type]++
  })
  const vals = Object.values(obj)
  vals.forEach(size => {
    answer = answer * (size + 1)
  })

  return answer - 1
}
```

각각 의류별 갯수를 구하는것은 동일히다. 하지만, 모든 경우를 따지는 방법이 아닌 다른 방법으로 해결할 수 있었다.

각각의 의류에 한가지 경우가 더 추가되었어야 했다.

> 해당 타입의 의류를 입지 않은 경우

1. `모자A 모자B 모자C`에 아무런 모자를 쓰지 않은 경우가 추가되어야 한다.
2. `모자A 모자B 모자C 투명모자`
   > `상의A 상의B`가 있다면, `투명모자+상의A`도 고려대상인 것
3. `투명의류`를 포함한 모든 의류 타입을 곱해주고 아무것도 입지 않은 경우를 위해 `-1`해준다.

## 출처

- [프로그래머스 위장](https://programmers.co.kr/learn/courses/30/lessons/42578?language=javascript)
