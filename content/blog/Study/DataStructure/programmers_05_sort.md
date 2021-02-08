---
title : "프로그래머스-H-Index"
date : 2021-01-25 00:00:00
category : "Study"
draft : false
tag : Programmers Coding Test
--- 

# H-Index Lv2
H-Index는 과학자의 생산성과 영향력을 나타내는 지표입니다. 어느 과학자의 H-Index를 나타내는 값인 h를 구하려고 합니다. 위키백과1에 따르면, H-Index는 다음과 같이 구합니다.
<br>
어떤 과학자가 발표한 논문 n편 중, h번 이상 인용된 논문이 h편 이상이고 나머지 논문이 h번 이하 인용되었다면 h의 최댓값이 이 과학자의 H-Index입니다.
<br>
어떤 과학자가 발표한 논문의 인용 횟수를 담은 배열 citations가 매개변수로 주어질 때, 이 과학자의 H-Index를 return 하도록 solution 함수를 작성해주세요.

## 제한사항
* 과학자가 발표한 논문의 수는 1편 이상 1,000편 이하입니다.
* 논문별 인용 횟수는 0회 이상 10,000회 이하입니다.
* 정답이 너무 클 수 있으니 문자열로 바꾸어 return 합니다.

## 무슨말이야..
* 처음에는 무슨말인지 전혀 몰랐지만, 중간에 `어떤 과학자가 발표한 논문 n편 중, h번 이상 인용된 논문이 h편 이상이고` 부분이 핵심임을 알게되었다.
* 인정되는논문의 갯수와 인용횟수는 동일하여야한다.

## 해결
* H-index는 인정된 논문의 갯수가아니라 인정하기 위해 필요한 최대 논문 인용 횟수 인듯 함
* 당연히 인용 횟수가 큰순서대로 인정되는 논문의 갯수는 증가함
* 기준이되는 인용횟수 >= 인정된 논문의 갯수지만, 기준이 되는 인용횟수를 우리는 알 수 없기때문에 ++1되는 논문의 갯수가 특정 논문의 인용 횟수보다 커지는 순간 ++1중단이 되고 논문의 갯수가 기준이되는 인용 횟수가 됨

```js
function solution(citations) {
    citations.sort((a, b) => b-a);
    let answer = 0;
    citations.forEach(res => {
        if(res <= answer) return
        answer++;
    })
    return answer
}
```

## 출처
* [프로그래머스 H-Index](https://programmers.co.kr/learn/courses/30/lessons/42747)