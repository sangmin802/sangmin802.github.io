---
title : "Graph ql"
date : 2021-01-08 00:00:00
category : "Study"
draft : false
tag : "Think"
--- 
* 최근 갖고있던 프로젝트를 타입스크립트화 하면서, 그리고 지금까지 모든 프로젝트를 하며 RESTful API를 통해 서버에서 받아오는 데이터에대해 고민을 하게되었었다.
  * 데이터에서 필요하지 않는 부분도 모두 받아오기때문에 데이터가 한눈에 들어오지 않더라.
  * 최근 프로젝트에서 타입스크립트화 하면서, 어떠한 구조의 데이터가 넘어올 지 예상할 수 없고, 인터페이스를 짜기도 좀 어렵더라.
  * URI를 통해 데이터를 요청하게 될 경우, 같은 뷰에서 필요한 데이터더라도 여러번 HTTP통신을 해야 했었다.

## 상황1 - Over-Fetching
* 모든 유저의 이름을 화면에 띄우고 싶음
  * 처음에는 그냥 모든 유저의 이름만 사용하고 싶지만, 기존 우리가 사용하던 `REST API`의 경우, `/users/` 를 `GET` 해오게 되면 이름 사진 주소 등등 관련된 모든 정보가 넘어오게되어 필요하지 않는부분까지 DB에서 찾아 비효율적인 활동이 일어남.
* 이러한 상황을 `over-fetching`이라고 한다.
  > 클라이언트가 요청한 정보보다 많은 정보를 서버에서 가져오는 상황

## 상황2 - Under-Fetching
* 하나의 화면을 구성하기위해 여러번의 `REST` 요청을 하게되는 상황
  * Loa-Hands를 할 때, 유저정보를 띄우는 과정에서 실제로는 유저 수집품정보만 사용하긴 했지만, 원래대로라면 수집품정보, pvp정보 등등을 다 따로따로 요청을 보냈어야 했다. 
* 이러한 상황을 `under-fetching`이라고 한다.


# Graphql
* 위의 두 상황을 `Grpahql`로 해결이 가능하다.
* URI가 아닌 Query를 사용하여 데이터에서 필요한 부분만 가져다 쓸 수 있는 기능이다.
* 클라이언트는 `Graphql서버`와 통신하고 `Graphql서버`는 실제 `DB서버`와 통신한다.

```javascript
// GraphQL 언어
// 쿼리의 구조. 딱 이렇게 요청한 속성의 값들만 서버에서 반환함.
{
  feed {
    comments
    likeNumber
  }
  notifications {
    isRead
  }
  user {
    userName
    profilePic
  }
}
```

## 시작하기
```js
// package.json
{
  "name": "movieql",
  "version": "1.0.0",
  "description": "Movie API with Graphql",
  "main": "index.js",
  "scripts": {
    "start": "babel-node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    // index.js에서 import같은 최신 문법을 사용할 수 있도록
    "@babel/cli": "^7.12.10",
    "@babel/core": "^7.12.10",
    "@babel/node": "^7.12.10",
    "@babel/preset-env": "^7.12.11",
    // graphql 간단 서버
    "graphql-yoga": "^1.18.3",
    // node.js에서 fetch API를 사용할 수 있도록
    "node-fetch": "^2.6.1"
  }
}

// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

### index.js
* `graphql` 서버를 만드는 과정이다.
* 실행하게될 경우, 4000포트에 `graphql playground`라는 화면이 보여진다.
<div style="text-align : center">
  <img src="/img/2021/01/07/1.PNG?raw=true" alt="1">
</div>

* `GraphQLServer`생성자에는 객체가 인자로 보내진다.
  * `typeDefs` : 클라이언트에서 요청한 `Query`나 `Mutation`의 타입을 찾는다.
    > `Query` : DB에서 받아오는 모든것  
    > `Mutation` : DB에 변경을 주는 모든것
  * `resolvers` : `Query`나 `Mutation`으로 왔을 때, 돌려주는 값을 계산?해주는 부분이다. 말 그대로 Query에 대한 해결사

```js
import {GraphQLServer} from 'graphql-yoga';
import resolvers from './graphql/resolvers';

const server = new GraphQLServer({
  typeDefs : "graphql/schema.graphql",
  resolvers
})

server.start(() => console.log('Graphql Server Running'));
```

### schema.graphql - typeDefs
* 요청이 들어오는 쿼리에 대한 반환되는 값의 구조? 인듯 하다.
  > 타입스크립트처럼
* !는 필수로 반환. 따라서, 값이 존재하지 않을 경우에는 !가 없음
* 타입 지정해줄 때, 무조건 첫글자는 대문자로 해야 에러안생김..
* 몇개의 타입을 가지고있든 상관 없지만, `Query`나 `Mutation`은 하나씩만 존재할 수 있다.

### resolvers.js - resolvers
* `schema.graphql`의 쿼리 구조에 맞는 응답을 해주는 부분이다.
* 여러 데이터베이스에 접촉해서 곳곳의 값을 가져올 수 있도록 함수도 가능한것 같다.

## 예제 - 파일구성 및 간단 문자열 반환하기
* `GraphQLServer`의 인자로 필요한 `schema`파일과 `resolvers`파일을 만든다
<div style="text-align : center">
  <p>
    schema파일은 클라이언트로부터 오는 Query를 찾는 파일이다.
  </p>
  <p>
    resolvers파일은 schema에서 찾은 타입의 해결을 맡는다.
  </p>
  <img src="/img/2021/01/07/2.PNG?raw=true" alt="2">
</div>

* `schema.graphql`에서 `Query`를 생성한다.
<div style="text-align : center">
  <p>
    클라이언트에서 user라는 query가 왔을 때, 반환해주는 값의 타입을 지정해준다.
  </p>
  <img src="/img/2021/01/07/3.PNG?raw=true" alt="3">
</div>

* `resolvers`에서 찾은 `Query`에 대한 해결을 한다.
<div style="text-align : center">
  <p>
    user Query에서 문자열을 꼭 반환한다고 schema에서 찾았기 떄문에, 그에 맞는 결과물을 리턴해준다.
  </p>
  <img src="/img/2021/01/07/4.PNG?raw=true" alt="4">
</div>

* 4000포트의 `playground`에서 user Query로 요청을 보내면 `resolvers`에서 지정한 값이 반환된다.
<div style="text-align : center">
  <img src="/img/2021/01/07/5.PNG?raw=true" alt="5">
</div>

## 예제 - 객체의 원하는 속성만 받아오기
* `schema.graphql`에서 `User`타입을 반환하는 `Query`를 생성한다.
<div style="text-align : center">
  <p>
    타입스크립트와 유사하게, 객체형식일 경우 커스텀 타입을 생성할 수 있다.
  </p>
  <p>
    users가 아닌 user입니다. 오타가 있네요
  </p>
  <img src="/img/2021/01/07/6.PNG?raw=true" alt="6">
</div>

* `resolvers`에서 찾은 `Query`에 대한 해결을 한다.
<div style="text-align : center">
  <p>
    user Query는 User타입을 꼭 반환한다 하였으니, resolvers에서도 그에 맞는 객체를 반환해준다.
  </p>
  <img src="/img/2021/01/07/7.PNG?raw=true" alt="7">
</div>

* 4000포트의 `playground`
<div style="text-align : center">
  <p>
    user Query로 요청을 보낼 때, 반환되는 값이 객체라면 꼭 원하는 속성을 함께 보내주어야 한다.
  </p>
  <p>
    resolvers에서 클라이언트가 요청한 속성들만 보내주는것을 확인할 수 있다.
  </p>
  <img src="/img/2021/01/07/8.PNG?raw=true" alt="8">
</div>

* `playground`의 장점
<div style="text-align : center">
  <p>
    schema에서 어떤 타입이 있고, 각 속성들이 어떠한 타입을 요구하는지 확인할 수 있다.
  </p>
  <img src="/img/2021/01/07/9.PNG?raw=true" alt="9">
</div>

## 예제 - 실제 DB와 유사한 다수의 데이터
* 다수의 데이터 관리
<div style="text-align : center">
  <p>
    실제 DB를 연동한 것과 같이, 다수의 데이터를 관리해보자.
  </p>
  <img src="/img/2021/01/07/10.PNG?raw=true" alt="10">
</div>

* `schema.graphql`에서 `Query`를 생성한다.
<div style="text-align : center">
  <p>
    이전과 다르게 두개의 Query를 가지고있다. 잘 보면, 타입스크립트와 매우 유사하다는것을 알 수 있다.
  </p>
  <p>
    users : User타입의 객체가 담긴 배열을 반환하는 Query
  </p>
  <p>
    user(id : Int) : Query에 보내어진 인자에 맞는 User타입의 객체 반환
  </p>
  <img src="/img/2021/01/07/11.PNG?raw=true" alt="11">
</div>

* `resolvers`에서 찾은 `Query`에 대한 해결을 한다.
<div style="text-align : center">
  <p>
    위의 배열이 DB데이터라고 생각하자
  </p>
  <p>
    users : 해당 DB를 그대로 반환하는것
  </p>
  <p>
    user(id : Int) : Query에 보내어진 id와 동일한 객체만 반환
  </p>
  <img src="/img/2021/01/07/12.PNG?raw=true" alt="12">
</div>

* 4000포트의 `playground`
<div style="text-align : center">
  <p>
    모든 유저정보가 담긴 배열의 DB더라도, 필요한 속성만을 지정해서 받을 수 있다.
  </p>
  <p>
    Query를 보낼 떄, 인자를 같이 보내어서 조건에 맞는 데이터만 찾을 수 있다.
  </p>
  <img src="/img/2021/01/07/13.PNG?raw=true" alt="13">
</div>

* `playground`의 장점
<div style="text-align : center">
  <p>
    schema에서 어떤 타입이 있고, 각 속성들이 어떠한 타입을 요구하는지 확인할 수 있다.
  </p>
  <img src="/img/2021/01/07/14.PNG?raw=true" alt="14">
</div>

## 예제 - 영화 DB 관리하기
* `schema.graphql`에서 `Query`와 `Mutation`을 생성한다.
<div style="text-align : center">
  <p>
    Query는 같지만 Mutation이라는 타입이 추가되었다.
  </p>
  <p>
    Query는 DB에서 가져오는거라면, Mutation은 DB에 변화를 주는 타입이다.
  </p>
  <p>
    addMovie(name : String!, score : Int!) : 이름과 점수 인자를 보내 영화를 DB에 추가하는 Mutation이다.
  </p>
  <p>
    deleteMovie(id : Int!) : 해당 id의 영화를 DB에서 제거하는 Mutation이다.
  </p>
  <img src="/img/2021/01/07/15.PNG?raw=true" alt="15">
</div>

* `resolvers`에서 찾은 `Query`와 `Mutation`에 대한 해결을 한다.
<div style="text-align : center">
  <p>
    Query와 Mutation에 두번째 인자로 Query의 변수들이 넘어가는점을 알아야 한다.
  </p>
  <img src="/img/2021/01/07/16.PNG?raw=true" alt="16">
</div>

* Movie DB
<div style="text-align : center">
  <p>
    DB와, 각종 로직들이다.
  </p>
  <img src="/img/2021/01/07/17.PNG?raw=true" alt="17">
</div>

* 영화 추가
<div style="text-align : center">
  <p>
    필요한 인자를 Mutation으로 보내서 영화를 추가할 수 있다.
  </p>
  <img src="/img/2021/01/07/18.PNG?raw=true" alt="18">
</div>
<div style="text-align : center">
  <img src="/img/2021/01/07/19.PNG?raw=true" alt="19">
</div>

* 영화 제거
<div style="text-align : center">
  <p>
    id를 보내어 영화를 제거할 수 있다.
  </p>
  <img src="/img/2021/01/07/20.PNG?raw=true" alt="20">
</div>
<div style="text-align : center">
  <img src="/img/2021/01/07/21.PNG?raw=true" alt="21">
</div>

## 예제 - 외부 API와 Graphql 연동
* `schema.graphql`에서 `Query`를 생성한다.
<div style="text-align : center">
  <p>
    해당 API에서 제공하는 속성들 중, 반환하고자하는 속성들만 뽑아서 type을 만들어준다.
  </p>
  <p>
    movies Query의 인자들은 API에서 queryString으로 데이터의 필터링을 하는 값들이다.
  </p>
  <img src="/img/2021/01/07/22.PNG?raw=true" alt="22">
</div>

* `resolvers`에서 찾은 `Query`에 대한 해결을 한다.
<div style="text-align : center">
  <img src="/img/2021/01/07/23.PNG?raw=true" alt="23">
</div>

* API
<div style="text-align : center">
  <p>
    각 변수들을 사용하여 fetch API로 데이터를 받아서 반환한다.
  </p>
  <p>
    위의 예제들 처럼 클라이언트에서는 받고자 하는 속성들만 받을 수 있다.
  </p>
  <p>
    이를 통해, 클라이언트는 Graphql서버와 query로 소통하고, Graphql서버가 DB서버와 RESTful API로 소통하는것을 알 수 있다. 
  </p>
  <img src="/img/2021/01/07/24.PNG?raw=true" alt="24">
</div>

## 생각
* 별도의 두개의 서버를 운용을 하는것일까..? 아니면 express 서버 내부에서도 graphql을 운용할 수 있는건가..?
* 확실히 클라이언트단에서 생각해보았을 때, 넘어오는 데이터를 완전히 예상할 수 있고, 필요한 데이터만 받을 수 있다는점에서는 엄청난 매력이 있는듯 함.

## 참고
* [노마드코더 Graphql](https://nomadcoders.co/courses)