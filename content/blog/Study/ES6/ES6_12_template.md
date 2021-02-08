---
title : "ES6_template처리"
date : 2020-07-27 00:00:00
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Template
### Template Literals
```javascript
const data = {
  name : '박상민'
};
console.log(`안녕하세요 ${data.name} 입니다.`)
// 안녕하세요 박상민 입니다.
```
* `` 로 문자열을 감싸고, `${}`를 통해 값을 바로 가져올 수 있다.
* 이전에는 `''`나 `""`로 문자열을 감싸고, 스크립트의 값을 `+'문자열'+`로 해줬어야 했는데, 개선되었다.

### Tagged Template Literals
* 태그가 포함된 템플릿 리터럴을 함수로 분석할 수 있게되었다.
> func`문자열`;
* 해당 함수에 템플릿 리터럴을 보내면, 
  1. 첫번째 인자로 문자열 값들의 배열
  2. 이후로, 문자열이 아닌 스크립트의 값들을 인자로 받는다.
* 바닐라자바스크립트의 경우, 아래의 예제와 같이 template를 생성해서 DOM을 구성할 때 변수에 따라 달라지는 값들을 표현할 수 있게되었다.
> <b style="color : tomato;">React</b>나 <b style="color : tomato;">Vue</b>와 같이 값의 변경에 따라 re rendering을 하는 프레임워크들은 기본적으로 제공하는 기능이라고한다.

#### 예제

<div style="
  width : 30%;
  margin : 0 auto;
  display : flex;
  flex-direction : column;
  align-items : center;
  border : 1px solid #666666; 
  border-radius : 5px;
  padding : 0.5em 0.5em;"
  class="templateLiteralsExp"
>
</div>
<br>

```javascript
const data = [
  {
    name : 'Coffee-Bean',
    order : true,
    items : ['americano', 'milk', 'green-tea']
  },
  {
    name : 'STARBUCKS',
    order : false,
  }
]

function fn(tags, name, items){
  if(items === undefined){
    items = '주문가능한 상품이 없습니다.';
  }
  return tags[0]+name+tags[1]+items+tags[2];
};
console.log(tags)      
// 이러한 배열을 가져옴
// 0: "<div>welcome "
// 1: "!</div><h2>주문가능항목</h2><div>"
// 2: "</div><br><br>"

console.log(name, items)
// 아래의 forEach 메소드의 영향으로, data배열에서 각각의 값들을 순회하여 가져옴
data.forEach(res => {
  const template = fn`<div>welcome ${res.name}!</div><h2>주문가능항목</h2><div>${res.items}</div><br><br>`;
  document.querySelector('body').innerHTML += template;
})
```

<script>
  const data = [
    {
      name : 'Coffee-Bean',
      order : true,
      items : ['americano', 'milk', 'green-tea']
    },
    {
      name : 'STARBUCKS',
      order : false,
    }
  ]

  function fn(tags, name, items){
    if(items === undefined){
      items = '주문가능한 상품이 없습니다.';
    }

    return tags[0]+name+tags[1]+items+tags[2];
  };
  
  data.forEach(res => {
    const template = fn`<div>welcome ${res.name}!</div><h2>주문가능항목</h2><div>${res.items}</div><br><br>`;
    document.querySelector('.templateLiteralsExp').innerHTML += template;
  })
</script>