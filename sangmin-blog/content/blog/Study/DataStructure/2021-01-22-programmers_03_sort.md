---
title : "프로그래머스-K번째수"
date : 2021-01-22 00:00:00
category : "Study"
draft : false
tag : Programmers Coding Test
--- 

# K번째수 Lv1
배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.
<br>

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면
1. array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
2. 1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
3. 2에서 나온 배열의 3번째 숫자는 5입니다.

<br>
배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때, commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 배열에 담아 return 하도록 solution 함수를 작성해주세요.

## 제한사항
* array의 길이는 1 이상 100 이하입니다.
* array의 각 원소는 1 이상 100 이하입니다.
* commands의 길이는 1 이상 50 이하입니다.
* commands의 각 원소는 길이가 3입니다.

## 해결
```js
function solution(array, commands) {
    var answer = [];
    return commands.map(res => {
        let arr = [];
        let i = res[0]-1;
        let k = res[1]-1;
        // 시작인덱스와 종료인덱스를 파악하여, 내부의 값들만 담기
        while(i <= k) {
            arr.push(array[i])
            i++
        }
        // 순서대로 정렬 후 반환
        return arr.sort((a, b) => a-b)[res[2]-1]
    })
}
```

## 다른사람의 풀이
```js
function solution(array, commands) {
    return commands.map(command => {
        const [sPosition, ePosition, position] = command
        // commands순회를 돌려서, 시작인덱스 종료인덱스 파악 후, 숫자배열을 filter를 사용해 시작인덱스와 종료인덱스 사이인 인덱스를 갖고있는 값만 반환
        const newArray = array
            .filter((value, fIndex) => fIndex >= sPosition - 1 && fIndex <= ePosition - 1)
            .sort((a,b) => a - b)    

        return newArray[position - 1]
    })
}
// 원리는 내가 한것과 비슷하지만, 변수생성을 최소화하여 불필요한 공간을 줄인듯 하다.
```

## 출처
* [프로그래머스 K번째수](https://programmers.co.kr/learn/courses/30/lessons/42748)