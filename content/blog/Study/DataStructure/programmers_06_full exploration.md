---
title : "프로그래머스-모의고사"
date : 2021-01-27 00:00:00
category : "Study"
draft : false
tag : Programmers Coding Test
--- 

# 모의고사 Lv1
수포자는 수학을 포기한 사람의 준말입니다. 수포자 삼인방은 모의고사에 수학 문제를 전부 찍으려 합니다. 수포자는 1번 문제부터 마지막 문제까지 다음과 같이 찍습니다.
<br>
1번 수포자가 찍는 방식: 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, ...
<br>
2번 수포자가 찍는 방식: 2, 1, 2, 3, 2, 4, 2, 5, 2, 1, 2, 3, 2, 4, 2, 5, ...
<br>
3번 수포자가 찍는 방식: 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, 3, 3, 1, 1, 2, 2, 4, 4, 5, 5, ...
<br>
1번 문제부터 마지막 문제까지의 정답이 순서대로 들은 배열 answers가 주어졌을 때, 가장 많은 문제를 맞힌 사람이 누구인지 배열에 담아 return 하도록 solution 함수를 작성해주세요.

## 제한사항
* 시험은 최대 10,000 문제로 구성되어있습니다.
* 문제의 정답은 1, 2, 3, 4, 5중 하나입니다.
* 가장 높은 점수를 받은 사람이 여럿일 경우, return하는 값을 오름차순 정렬해주세요.

## 해결
* 각각의 패턴을 기록함
* 동일할때마다 카운트를 늘려줌
* 제일 큰 카운트의 인덱스만 남기거나, 동일하다면 다음 공간에 채움

```js
function solution(answers){
    const arr = [0,0,0];
    const one = [1,2,3,4,5];
    const two = [2,1,2,3,2,4,2,5];
    const three = [3,3,1,1,2,2,4,4,5,5];

    answers.forEach((res, index) => {
        if(one[index%one.length] === res) arr[0]++;
        if(two[index%two.length] === res) arr[1]++;
        if(three[index%three.length] === res) arr[2]++;
    })
    
    const answer = [1];
    let val = arr[0];
    arr.forEach((res, index) => {
        if(index===0) return;
        if(res === val) answer[answer.length] = index+1;
        if(res > val){
            val = res;
            answer[0] = index+1;
        }
    })
    
    return answer.sort((a, b) => a-b)
}

// 다른 사람의 답
// filter로 동일한 경우 담은 뒤, 갯수만 체크함
// max api로 최대값을 찾고, 각각의 갯수가 담긴 변수를 체크하여 반환함.

// 어차피 경우는 3가지로 정해져있기 때문에, 이처럼 각각 변수에 할당하는 방법이 좋은듯 함.
function solution(answers){
    const one = [1,2,3,4,5];
    const two = [2,1,2,3,2,4,2,5];
    const three = [3,3,1,1,2,2,4,4,5,5];
    const answer = [];
    const nOne = answers.filter((res, i) => res === one[i%one.length]).length;
    const nTwo = answers.filter((res, i) => res === two[i%two.length]).length;
    const nThree = answers.filter((res, i) => res === three[i%three.length]).length;
    const max = Math.max(nOne, nTwo, nThree);
    
    if(nOne === max) answer.push(1);
    if(nTwo === max) answer.push(2);
    if(nThree === max) answer.push(3);
    return answer;
}
```

## 출처
* [프로그래머스 모의고사](https://programmers.co.kr/learn/courses/30/lessons/42840)