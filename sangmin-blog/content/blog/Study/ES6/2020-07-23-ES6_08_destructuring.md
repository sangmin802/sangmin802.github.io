---
title : "ES6_Destructuring"
date : 2020-07-23 00:00:04
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Destructuring
### Destructuring Array
  * 배열에 변수를 할당할 때에, 좀 더 편하게 할 수 있다.

```javascript
let Arr = ['모여요꿈동산', '한대만칠겡', '퐁메라니안'];
let [mainCharacter,,subCharacter] = Arr;
console.log(mainCharacter, subCharacter) // '모여요꿈동산', '퐁메라니안'
```

### Destructuring Object
  * 객체에서 특정 값만 출력하고자 할 때(많이 사용했었음)

```javascript
let obj = {
  id : 1,
  class : 'Bard',
  userName : '모여요꿈동산'
}
const {id, userName} = obj;
console.log(id, userName); // 1, '모여요꿈동산'

// 아래와 같이 변수명을 지정해주는것도 가능하다.
// const {id:uid, userNmae:name} = obj;
// console.log(uid, name);
```

### 활용
```javascript
const json = [
  {
    "title" : "MapleStroy",
    "imgurl" : 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg',
    "newslist" : [
      "옛날 직업군들 이펙트 리뉴얼 제발",
      "보우마스터 직업군 심각한 오류 다수 해결부탁 제발",
      "재미없는 일일퀘스트 제발 더 간소화좀",
      "특정 잘나가는 bj들만 혜택받는 스틸신고",
    ]
  },
  {
    "title" : "LostArk",
    "imgurl" : 'http://static.naver.net/newsstand/2017/0313/article_img/9033/220451/001.jpg',
    "newslist" : [
      "바드 사숔낙인 유지시간 6초로 제발 변경좀",
      "안타레스, 업화 토큰경매방식 개편부탁",
      "카던3회 -> 1회 3배보상 변경",
      "모코코아바타 동일 직업내 이동가능 개편",
    ]
  }
];

const [MapleStroy, LostArk] = json;
const {title, imgurl} = LostArk;
console.log(title, imgurl) // 'LostArk', 'http://static.naver.net/newsstand/2017/0313/article_img/9033/220451/001.jpg'

function getNewsList([, {newslist}]){
  console.log(newslist);
}

getNewsList(json);
// [
//   "바드 사숔낙인 유지시간 6초로 제발 변경좀",
//   "안타레스, 업화 토큰경매방식 개편부탁",
//   "카던3회 -> 1회 3배보상 변경",
//   "모코코아바타 동일 직업내 이동가능 개편",
// ]
```