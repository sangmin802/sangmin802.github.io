---
title : "config와 env"
date : 2021-03-01 16:56:00
category : "Study"
draft : false
tag : "Think"
--- 

## .config
특정 프로그램에 대한 기본설정값들이 배치되는 `JSON`형식의 파일이다.  


any의 사용 여부 등 타입스크립트 설정 관련 `tsconfig.json`
<div style="text-align : center">
  <img src="/img/2021/03/01/1.PNG?raw=true" alt="1">
</div>


프로젝트의 번들링 설정을 해주는 `webpack.config`
<div style="text-align : center">
  <img src="/img/2021/03/01/2.PNG?raw=true" alt="12">
</div>


`Gatsby`의 헤더 값들 및 각종 설정을 해주는 `gatsby-config *`
<div style="text-align : center; display : flex;">
  <img style="display : inlne-block; width : 49.5%; margin-right : 1%;" src="/img/2021/03/01/3.PNG?raw=true" alt="3">
  <img style="display : inlne-block; width : 49.5%;" src="/img/2021/03/01/4.PNG?raw=true" alt="4">
</div>


## env
`Node.js`를 사용하게 된다면, 갖게되는 환경변수이다. 기본적으로 여러가지의 값들을 갖고있는 `JSON` 형식인데, 추가적으로 값을 설정할 수 있다.

<br><br>

<div style="text-align : center">
  <img src="/img/2021/03/01/5.PNG?raw=true" alt="12">
</div>


콘솔로 `process.env`를 찍어본다면 위의 결과값이 나온다.


<br><br>

```ts
// package.json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "set WORK_TYPE=production&& node server.js"
},
```

위와 같이 해당 프로젝트가 실행될 때, 일시적으로 값을 추가해줄 수 있다.


<br><br>

```ts
// dev.env
name=개발용 DB 입니다
pw=12345
// pro.env
name=배포용 DB 입니다
pw=67890
```

`.env`파일을 사용하여, `WORK_TYPE`에 따라 다른 값들을 사용하도록 설정해준다.

<br><br>

```ts
// server.js
const dotenv = require('dotenv');

dotenv.config({
  path : process.env.WORK_TYPE == 'production' ? 'pro.env' : 'dev.env'
})

app.listen(port, () => {
  console.log(process.env)
  console.log(`DB명 : ${process.env.name}, DB비번 : ${process.env.pw}`);
});
```


<div style="text-align : center; display : flex;">
  <img style="display : inlne-block; width : 49.5%; margin-right : 1%;" src="/img/2021/03/01/6.PNG?raw=true" alt="6">
  <img style="display : inlne-block; width : 49.5%;" src="/img/2021/03/01/7.PNG?raw=true" alt="7">
</div>


`detenv`를 통해, 실행되고 나서 `process.env`에 해당 값들이 추가되도록 하는 방식이다.


## 의문
하지만 좀만 생각해본다면 의아한점이 있는데, `config.js`나 방금의 `.env`방식 둘다 결국은 비밀번호와 같은 중요한 값들을 파일로 관리하게 되지만 결국 해당 파일은 깃허브 같은곳에서 `.gitignore` 파일로 지정해놓으면 문제 없지 않나 생각하게된다.


하지만, 사실 위의 `env`사용 방식은 전 - 혀 추천되지 않는 방식이다.



## process.env
프로젝트를 실행하기 전, `Node.js`환경에 변수를 추가시키는 방식이다.  



이러한 특징때문에, 굳이 `.gitignore`에 파일을 추가해줄 필요도 없고, 좀 더 감춰진 환경에서 값을 사용할 수 있다.  



해당 값은 **생성한 터미널** 내부라면 어디에서든 사용할 수 있다.  


계속해서 테스트 해보았는데, 외부 윈도우터미널에 `set key=value` 형식으로 직접 추가 하더라도 VS코드 내부의 윈도우터미널에서는 해당 값을 찾을 수 없었다.

<div style="text-align : center">
  <img src="/img/2021/03/01/8.PNG?raw=true" alt="8">
</div>

<br><br>

단, 동일하게 내부 터미널 이라면 윈도우에서 생성하더라도 `bash`환경에서 조회하는것은 가능했다. 도대체 왜지..?
> 어차피 `EC2`와 같은 환경에서는 외부터미널에서 모든 명령어로 수행되기 때문에, 전혀 문제없을듯 하다.


<div style="text-align : center">
  <img src="/img/2021/03/01/9.PNG?raw=true" alt="9">
</div>

<br><br>

위와 같은 방법으로, `EC2`로 배포될 때에는 배포용 값들을, 로컬에서 개발용으로 사용할 때에는 개발용 값들을 따로 저장해 놓으면 파일도 필요하지 않고 좀 더 노출을 막을 수 있다.


<div style="text-align : center">
  <img src="/img/2021/03/01/10.PNG?raw=true" alt="10">
</div>



### 환경변수 등록 방식
* `CMD` : `set key=value`
> 윈도우의 경우 띄어쓰기를 하면, 띄어쓰기 또한 값으로 판단되니 사용하면 안된다.
* `bash` : `export key=value`
> 리눅스 환경에서도 해당 방식을 사용한다고 함.
