---
title : "프로그래머스-기능개발"
date : 2021-01-18 00:00:01
category : "Study"
draft : false
tag : Programmers Coding Test
--- 

# 기능개발 Lv2
프로그래머스 팀에서는 기능 개선 작업을 수행 중입니다. 각 기능은 진도가 100%일 때 서비스에 반영할 수 있습니다.
<br>
또, 각 기능의 개발속도는 모두 다르기 때문에 뒤에 있는 기능이 앞에 있는 기능보다 먼저 개발될 수 있고, 이때 뒤에 있는 기능은 앞에 있는 기능이 배포될 때 함께 배포됩니다.
<br>
먼저 배포되어야 하는 순서대로 작업의 진도가 적힌 정수 배열 progresses와 각 작업의 개발 속도가 적힌 정수 배열 speeds가 주어질 때 각 배포마다 몇 개의 기능이 배포되는지를 return 하도록 solution 함수를 완성하세요.

## 제한사항
* 작업의 개수(progresses, speeds배열의 길이)는 100개 이하입니다.
* 작업 진도는 100 미만의 자연수입니다.
* 작업 속도는 100 이하의 자연수입니다.
* 배포는 하루에 한 번만 할 수 있으며, 하루의 끝에 이루어진다고 가정합니다. 예를 들어 진도율이 95%인 작업의 개발 속도가 하루에 4%라면 배포는 2일 뒤에 이루어집니다.

## 해결
```js
function solution(progresses, speeds) {
    // 남은 작업영역을 계산하고, 작업석도로 나눈 뒤 몫을 올림해준다.
    const arr = progresses.map((res, index) => {
        return Math.ceil((100-res)/speeds[index])
    })
    let prev = arr[0];
    let answer = [0];
    arr.forEach((res, index) => {
        const length = answer.length;
        // 이전의 작업보다 먼저 끝나는 작업일 경우 배열의 가장 마지막에 ++
        if(res <= prev){
            answer[length-1]++;
        }else{
        // 이전의 작업보다 늦게 끝나는 작업일 경우, 기준이되는 prev가 되며 배열에 1 추가
            answer[length]=1;
            prev=res;
        }        
    })
    return answer
}
```

## 다른사람의 풀이
```js
// 작업 시간에대한 배열을 계산하는것까지는 동일하지만, index또한 카운팅 되게 하여 조금 더 효율적으로 짜신 듯 하다.
function solution(progresses, speeds) {
    let answer = [0];
    let days = progresses.map((progress, index) => Math.ceil((100 - progress) / speeds[index]));
    let maxDay = days[0];

    for(let i = 0, j = 0; i< days.length; i++){
        if(days[i] <= maxDay) {
            answer[j] += 1;
        } else {
            maxDay = days[i];
            answer[++j] = 1;
        }
    }

    return answer;
}

```

## 출처
* [프로그래머스 기능개발](https://programmers.co.kr/learn/courses/30/lessons/42586)