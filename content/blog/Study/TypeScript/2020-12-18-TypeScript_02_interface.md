---
title : "TypeScript interface"
date : 2020-12-18 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "인터페이스(Interface)"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 인터페이스(interface)
* `interface`는 타입스크립트의 객체를 정의하는 일종의 규칙 및 구조이다.
* `interface`는 클래스에서 구현부가 빠졌다고 이해하면 편하다. 즉, 어떠한 객체가 이러이러한 프로퍼티 혹은 메소드를 가진다고 선언하는 것이다. 실질적인 구현은 이를 구현한다고 선언하는 클래스에 맡긴다.
```javascript
  interface User {
    name : string,
    age : number
  }

  const user : User = {
    name : 'sangmin',
    age : 26
  }
```

## 선택적 속성(Optional properties)
* 속성뒤에 `?`를 사용하면 선택적 속성(필수가 아닌 속성)으로 정의할 수 있다.
```javascript
  interface User {
    name : string,
    age : number,
    isAdult? : boolean
  }

  // isAdult속성이 없어도, 오류가 발생하지 않음
  const user : User = {
    name : 'sangmin',
    age : 26
  }
```

## 읽기 전용 속성(Readonly Properties)
* 모든 속성에 `readonly`기능을 적용하고싶다면, `Utility`나 타입 단언을 활용할 수 있다.
```javascript
// Readonly 각각 지정
  interface User {
    readonly name : string,
    readonly age : number
  }
  let user : User = {
    name : 'sangmin',
    age : 26
  }
  user.name = 'gildong' // 읽기 전용 속성이므로 'name'에 할당할 수 없습니다.

  // Readonly Utility 지정
  interface User {
    name : string,
    age : number
  }
  let user : Readonly<User> = {
    name : 'sangmin',
    age : 26
  }
  user.name = 'gildong' // 읽기 전용 속성이므로 'name'에 할당할 수 없습니다.

  // 각각 속성들을 const로 타입 단언
  let user = {
    name : 'sangmin',
    age : 26
  } as const

  user.name = 'gildong' // 읽기 전용 속성이므로 'name'에 할당할 수 없습니다.
```
> `Utility`는 이후 다룰 예정

## 함수 타입
* 함수 타입을 인터페이스로 정의할 때, 호출 시그니처(Call signature)라는것을 사용한다. 호출 시그니처는 다음과 같이 함수의 매개 변수와 반환 타입을 지정한다.
```javascript
  interface funcInterface {
    (PARAM : TYPE) : RETURN_TYPE // 변수의 타입, 리턴값의 타입
  }
```
* 예제
```javascript
  interface User {
    name : string
    age : number
  }
  interface GetUser {
    // 문자열의 변수를 받고, User 타입의 결과를 리턴함
    (param1 : string) : User
  }

  const getUser : GetUser = (n) => {
    // n을 통해 유저정보 찾기
    // age : 26이라는 정보를 받음
    const user : User = {name : n, age : 26};
    return user;
  }
```

## 클래스 타입
* `interface`를 사용하여 클래스를 정의할 때에는 `implements`키워드가 필요하다.
* `interface`를 타입으로 지정해줄 때에는 구조를 지정해주는것이기 때문에, `interface`에서 지정해준 속성만 갖고있을 수 있다(물론 선택적 옵션으로 예외도 있음). 하지만 클래스에 `implements`로 지정해주는 경우는 구조 지정이 아닌, 구성 요소중 하나이므로 `interface`외의 속성들을 가질 수 있다.
```javascript
  interface LoaClass {
    group : string
    job : string
    name : string
    introduce() : string
    optionalFunction?() : void // 선택적 옵션 `?`로 인해 없어도 됨
  }

  class Warrior implements LoaClass {
    group : string = 'Warrior'
    job : string
    name : string
    constructor(job : string, name : string){
      this.job = job;
      this.name = name;
    }
    introduce() : string {
      return `UserName : ${this.name} Class : ${this.job} - ${this.group}`;
    }
  }

  const user = new Warrior('워로드', '워로드는뒤로점프');
```

### 구문 시그니처(Construct signature)
* 클래스를 변수로 받아서 사용할 경우
* 잘못된 사용
```javascript
  interface LoaClass {
    group : string
    job : string
    name : string
    introduce() : string
    optionalFunction?() : void
  }

  class Warrior implements LoaClass {
    group : string = 'Warrior'
    job : string
    name : string
    constructor(job : string, name : string){
      this.job = job;
      this.name = name;
    }
    introduce() : string {
      return `UserName : ${this.name} Class : ${this.job} - ${this.group}`;
    }
  }

  class Magician implements LoaClass {
    group : string = 'Magician'
    job : string
    name : string
    constructor(job : string, name : string){
      this.job = job;
      this.name = name;
    }
    introduce() : string {
      return `UserName : ${this.name} Class : ${this.job} - ${this.group}`;
    }
  }

  function createClass(c : Function, name : string, job : string) : Function {
    return new c(name, job); // 이 식은 생성할 수 없습니다.'Function' 형식에 구문 시그니처가 없습니다.ts(2351)
    // class또한 생성자 함수라 생각하여 타입을 Function으로 해주었지만, 일반 함수는 new와 함께 호출될 수 없어 발생되는 에러이다.
  }

  const user1 = new Warrior('워로드', '워로드는뒤로점프');
  const user2 = new Magician('바드', '모여요꿈동산');
```

* `Construct signature`를 사용하여 해결
```javascript
  interface LoaClass {
    group : string
    job : string
    name : string
    introduce() : string
    optionalFunction?() : void
  }

  // Construct signature 생성
  //  new 키워드를 가지고있는 함수, 즉 생성자함수를 정의해주는데, 생성되는 클래스가 필요한 변수를 받고 참조할 interface를 반환해준다.
  interface ClassContructor {
    new (job : string, name : string) : LoaClass;
  }

  class Warrior implements LoaClass {
    group : string = 'Warrior'
    job : string
    name : string
    constructor(job : string, name : string){
      this.job = job;
      this.name = name;
    }
    introduce() : string {
      return `UserName : ${this.name} Class : ${this.job} - ${this.group}`;
    }
  }

  class Magician implements LoaClass {
    group : string = 'Magician'
    job : string
    name : string
    constructor(job : string, name : string){
      this.job = job;
      this.name = name;
    }
    introduce() : string {
      return `UserName : ${this.name} Class : ${this.job} - ${this.group}`;
    }
  }

  function createClass(c : ClassContructor, name : string, job : string) : LoaClass {
    return new c(name, job);
  }

  const user1 = createClass(Warrior, '워로드', '워로드는뒤로점프');
  const user2 = createClass(Magician, '바드', '모여요꿈동산');
  console.log(user1.introduce()) // "UserName : 워로드는뒤로점프 Class : 워로드 - Warrior"
  console.log(user2.introduce()) // "UserName : 모여요꿈동산 Class : 바드 - Magician"
```
> return하는 타입을 LoaClass로 하였는데, `implements`가 약간 상속.. 같은건가? 따라서 `number`타입에 `null`도 포함되어 되는것처럼 타입을 약간 범위처럼 생각해보면 생성되는 클래스도 `LoaClass`타입의 범위 내라서 가능한건가..?

## 인덱싱 가능 타입(Indexable types)
* `interface`를 통해 속성의 타입을 정의할 수 있지만, 수많은 속성을 가지거나 단언할 수 없는 임의의 속성이 포함되는 구조에서는 한계가 있다.
* `arr[2]`처럼 숫자로 인덱싱하거나 `obj[name]`처럼 문자로 인덱싱하는 타입이 있다. 인덱스의 타입은 문자열과 숫자열만 가능하다.
```javascript
  interface Name {
    [INDEX_NAME : INDEX_TYPE] : RETURN_TYPE
  }
```

* 동적인 `key`를 사용할 때 
```javascript
  // 자바스크립트에서는 잘 돌아가지만, 타입스크립트에서는 컴파일 중 에러가 발생함
  //  console.log()에서 인자의 타입을 몰라서 any로 지정하기 때문
  //   -> noImplicitAny가 true라면 에러 안생김
  const user = {
    name : 'sangmin',
    age : 26
  };

  Object.keys(user)
  .forEach(res => console.log(user[res]));

  // Index Signature를 사용해 key의 타입을 지정해주어 해결
  interface Indexable {
    [key : string] : string | number; // return을 any로 해도 됨
  }

  const user : Indexable = {
    name : 'sangmin',
    age : 26
  };

  Object.keys(user)
  .forEach(res => console.log(user[res]));
```

* `interface`에 정의되지 않은 속성들을 사용할 때
```javascript
  interface User {
    [prop : string] : string | number | boolean // 해당 줄 없어지면, age, isMale속성이 존재하지 않아 아래에서 에러가 발생한다.
    name : string
  }

  const user : User = {
    name : 'sangmin',
    age : 26,
    isMale : true
  }
```

* 특정한 타입의 값들이 사용되는 객체나 배열이 여러개 있을 경우, 하나의 `interface`를 생성하여 반복적으로 해당 객체나 배열의 타입을 입력해주는 수고를 덜 수 있다.
```javascript
  // 객체
  interface Iobject {
    [key : string] : string | number | Array<any>
  }
  const obj : Iobject = {
    id : 1,
    name : 'sangmin',
  }
  // 배열
  interface Iarray {
    [key : number] : string | number
  }
  const arr : Iarray = [1,2,'타입',3,'스크립트']
```

## keyof
* 인덱싱 가능 타입(숫자열 문자열) 에서 `keyof` 를 사용하면 속성 이름을 타입으로 사용할 수 있다.
* 아직은 존재의 이유를 전 - 혀 모르겠다.
```javascript
  interface Countries {
    KR : '대한민국'
    US : '미국'
    UK : '영국'
  }
  let country : keyof Countries; // KR | US | UK
  country = 'KR'; // ok
  country = 'RU'; // '"RU"' 형식은 '"KR" | "US" | "UK"' 형식에 할당할 수 없습니다.
```

* keyof를 통한 인덱싱으로 타입의 개별 값에도 접근할 수 있다.
```javascript
  interface Countries {
    KR : '대한민국',
    US : '미국',
    UK : '영국'
  }
  let country: Countries[keyof Countries]; // Countries['KR' | 'US' | 'UK']
  country = '대한민국'; // ok
  country = '러시아'; // '"러시아"' 형식은 '"대한민국" | "미국" | "영국"' 형식에 할당할 수 없습니다.
```

## 인터페이스 확장
* `interface`도 클래스처럼 `extends` 키워드를 활용해 상속할 수 있다.
```javascript
  interface Animal {
    name? : string
  }
  interface Crying extends Animal {
    meow() : string
  }

  class Cat implements Crying {
    meow(){
      return '야옹'
    }
  }
```

* 같은 이름의 `interface`를 생성하여, 내용을 추가할 수 있다.
```javascript
  interface User {
    name : string
    age : number
  }
  interface User {
    gender : string
  }

  const user1 : User = {
    name : 'sangmin',
    age : 26,
    gender : 'male'
  }
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)
* [HyunSeob 클래스와 인터페이스](https://hyunseob.github.io/2016/10/17/typescript-interface/)