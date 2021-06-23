---
title: '프로그래머스-베스트앨범'
date: 2021-06-23 15:40:00
category: 'Study'
draft: false
tag: Programmers Coding Test
---

# 베스트앨범 Lv3

스트리밍 사이트에서 장르 별로 가장 많이 재생된 노래를 두 개씩 모아 베스트 앨범을 출시하려 합니다. 노래는 고유 번호로 구분하며, 노래를 수록하는 기준은 다음과 같습니다.

1. 속한 노래가 많이 재생된 장르를 먼저 수록합니다.
2. 장르 내에서 많이 재생된 노래를 먼저 수록합니다.
3. 장르 내에서 재생 횟수가 같은 노래 중에서는 고유 번호가 낮은 노래를 먼저 수록합니다.

노래의 장르를 나타내는 문자열 배열 genres와 노래별 재생 횟수를 나타내는 정수 배열 plays가 주어질 때, 베스트 앨범에 들어갈 노래의 고유 번호를 순서대로 return 하도록 solution 함수를 완성하세요.

## 제한사항

- `genres[i]`는 고유번호가 i인 노래의 장르입니다.
- `plays[i]`는 고유번호가 i인 노래가 재생된 횟수입니다.
- `genres`와 `plays`의 길이는 같으며, 이는 1 이상 10,000 이하입니다.
- 장르 종류는 100개 미만입니다.
- 장르에 속한 곡이 하나라면, 하나의 곡만 선택합니다.
- 모든 장르는 재생된 횟수가 다릅니다.

## 고민

두가지 정렬 조건이 명시되어 있었다.

1. 총 노래 재싱 횟수가 많은 순으로 장르 정렬
2. 장르 내에서 많이 재생된 횟수 순으로 노래 정렬
3. 동일한 장르, 동일한 재생횟수라면 고유번호가 낮은 순서대로 정렬

### 해결 방안

1. 장르별 총 노래 횟수를 계산한다.
2. 장르의 배열을 `map api`를 통해 `genre : 장르`, `play : 재생횟수`, `i : 고유번호`를 속성으로 담은 객체를 반환한다.
3. 위의 객체가 담긴 배열을 고만에 있던 3가지 조건에 따라 정렬을 진행한다.
4. `filter api`를 사용하여 상위 두개의 노래만 남기고 모두 소멸시킨다.
5. `map api`를 통해 `i` 값만 반환한다.

조건 자체에 `정렬` 이라는 키워드를 명시해주었기 때문에, 정렬 내부 조건만 잘 작성한다면 크게 어려운점은 없었다.

```ts
function solution(genres, plays) {
  const totalRank = {}
  genres.forEach((genre, i) => {
    totalRank[genre] = totalRank[genre] ? totalRank[genre] + plays[i] : plays[i]
  })

  const maxDouble = {}
  return genres
    .map((genre, i) => ({ genre, play: plays[i], i: i }))
    .sort((a, b) => {
      if (a.genre !== b.genre) return totalRank[b.genre] - totalRank[a.genre]
      if (a.play !== b.play) return b.play - a.play
      if (a.play === b.play) return a.i - b.i
    })
    .filter(({ genre, play, i }) => {
      if (maxDouble[genre] >= 2) return false
      maxDouble[genre] = maxDouble[genre] ? maxDouble[genre] + 1 : 1
      return true
    })
    .map(({ i }) => i)
}
```

## 출처

- [프로그래머스 베스트앨범](https://programmers.co.kr/learn/courses/30/lessons/42579)
