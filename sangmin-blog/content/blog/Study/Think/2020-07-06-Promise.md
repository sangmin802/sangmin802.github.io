---
title : "Promise"
date : 2020-07-06 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 
## 동기함수
  동기함수는 처음 실행된 함수가 종료될때까지, 이후의 함수는 실행되지 않는다. 따라서 비동기함수를 활용하는 경우가 많다.  

### 🙄 경험
Node.js 할 때, readFile에 경로랑, 탐색 후 실행 콜백함수를 적고, 해당 콜백 함수 안에서 writeFile 기억남?
그때는 두번만 하면 됬던거라 짧았는데, 더 길어지면 위와같은 애로사항이 발생함

### 🤔 의문  
  만약 처음함수가 실행되는데 오랜시간이 걸린다면?  
  대표적으로 콜백함수. 
  ```javascript
    ex) function('원하는 인자', function('...'));  
  ```
  함수가 실행되고, 해당함수가 종료되면 콜백함수를 실행시켜라. 난 다른일을 하고 있을게.  

### 😡 문제발생
  이러한 콜백함수가 무수히 중첩되게되면  
  1. 코드가 길어져서 반환되는 값을 찾기가 어려움.  
  2. 해당 콜백함수를 실행시킨 함수는 이미 종료되고 사라져, 오류를 못찾을 수도 있음.  

## 😆 해결! Promise의 등장
  * Promise를 통한 비동기처리함수는, 콜백함수안에서 자체적으로 Promise객체를 생성하여, 성공(resolve), 실패(reject)의 경우를 파악할 수 있음.
  * 즉, 내가 선언한 비동기함수의 결과값을 통해 실행되는 콜백함수의 실패나, 성공 이유를 알 수 있도록 해당 비동기함수가 선언되었을 때 Promise객체를 생성하게하는것
    

### Promise의 인자 resolve, reject
  * 첫번째 인자 resolve : 특정 조건 성공시 then메소드로 조회
  * 첫번째 인자 reject : 특정 조건 실패시 catch메소드로 에러조회

```javascript
const loading = (text) => {
  return new Promise((resolve, reject) => {
    if(text === 'Fuck you'){
      reject('Fuck you too!')
    };
    resolve('Hello!')
  })
};

loading('Hello').then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(`${error}나 처먹어`)
})
```

## 사용예제
### 예제1
  * 1초뒤 계산되고, 값을 넘겨주는 함수

```javascript
function func(num){
  return new Promise((res, rej) => {
    setTimeout(() => {
      console.log(num++);
      res(num)
    }, 1000)
  })
}
function func2(num){
  console.log(num)
  return new Promise((res, rej) => {
    setTimeout(() => {
      num = num*2
      console.log(num);
      res(num);
    }, 1000)
  })
}
function func3(num){
  console.log(num)
  return new Promise((res, rej) => {
    setTimeout(() => {
      num = num*10;
      console.log(num);
      res(num);
    }, 1000)
  })
}
func(1)
.then(num => func2(num))
.then(num => func3(num))
```

### 예제2
  * 같은 함수를 반복적으로 사용

```javascript
function promise(num){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(num++);
      resolve(num++);
    }, 1000)
  })
}
promise(1)
.then(num => promise(num))
.then(num => promise(num))
.then(num => promise(num))
.then(num => promise(num))
```

### 결론
  * .then 메소드를 통해 순차적으로(동기) 실행하고자 하는 함수들은 모두 Promise객체를 반환해야 한다!

## 참조사이트
1. <https://velog.io/@rohkorea86/Promiseis-%EB%B9%84%EB%8F%99%EA%B8%B0%EB%8F%99%EA%B8%B0%EC%97%90%EC%84%9C-Promise%EA%B9%8C%EC%A7%80>
2. <https://blog.naver.com/jhc9639/221072563346>
3. <https://velog.io/@cyranocoding/2019-08-02-1808-%EC%9E%91%EC%84%B1%EB%90%A8-5hjytwqpqj>
>
4. ⭐<https://codevkr.tistory.com/53>