---
title : "프로그래머스-완주하지 못한 선수"
date : 2021-01-18 00:00:00
category : "Study"
draft : false
tag : Programmers Coding Test
--- 

# 완주하지 못한 선수 Lv1
수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.
<br>
마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

## 제한사항
* 마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
* completion의 길이는 participant의 길이보다 1 작습니다.
* 참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
* 참가자 중에는 동명이인이 있을 수 있습니다.

## 해결
```js
function solution(participant, completion) {
    const all = {};
    participant.forEach(res => {
        // 참여자들에게 모두 1점씩 부여함
        // 단, 동일한 이름의 참여자일 경우 1점씩 추가
        if(all[res]) return all[res]++;
        all[res] = 1;
    })
    completion.forEach(res => {
        // 완주자들에 한하여 1점씩 삭감
        all[res]--;
    })
    
    // 점수를 가지고있는 선수 반환
    const keys = Object.keys(all);
    const values = Object.values(all);
    const i = values.indexOf(1);
    return keys[i]
}
```

## 다른사람의 풀이
```js
// sort
// 맞네.. 정렬을 통해 인덱스를 따라가며 다른 값이 나오는 순간 완주못한 선수..
// 해싱개념을 생각해보았을 때 이 방법이 제일 적합한듯 하다.
function solution(participant, completion) {
    participant.sort();
    completion.sort();
    for(let i in participant) {
        if(participant[i] !== completion[i]) return participant[i];
    }
}


// 번외
// ??
var solution=(_,$)=>_.find(_=>!$[_]--,$.map(_=>$[_]=($[_]|0)+1))
```

## 출처
* [프로그래머스 완주하지 못한 선수](https://programmers.co.kr/learn/courses/30/lessons/42576)

