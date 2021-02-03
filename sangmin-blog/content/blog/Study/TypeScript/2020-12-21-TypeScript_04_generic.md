---
title : "TypeScript Generic"
date : 2020-12-21 00:00:01
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "제네릭(Generic)"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 제네릭(Generic)
* 재사용을 목적으로 함수나 클래스의 <b>선언 시점</b>이 아닌, <b>사용 시점</b>에 타입을 선언할 수 있다.
> 타입을 변수로 받아서 사용한다고 이해하기
> `+`등의 경우, T라는 타입은 사용할수 없는 연산이므로 에러가 생김, 극히 일부의 타입만 사용할 수 있는 연산같은 경우는 피하는것이 좋은듯 하다..
> 여러 예제를 검색해본 결과 동일한 타입의 값들이 채워지는 배열을 만드는 함수가 자주 사용될 때, 많이 이용되는듯 하다.
* `number`타입만 허용하는 함수로, 그 이외의 타입은 에러를 발생시킴
```javascript
  function toArray(a : number, b : number) : number[] {
    return [a, b];
  }
  toArray(1,2); // 정상작동
  toArray('1','2'); // 타입에러 발생
```

* 좀 더 범용적으로 사용하기 위해 `Union`을 사용하지만, 가독성이 떨어짐
```javascript
  function toArray(a: number | string, b: number | string): (number | string)[] {
    return [a, b];
  }
  toArray(1, 2); // 정상작동
  toArray('1', '2'); // 정상작동
```

* `Generic`을 사용하여 해결.
```javascript
  // T는 변수로, 원하는 이름 아무거나 상관없음
  function toArray<T>(a : T, b : T) : T[]{
    return [a, b]
  }
  toArray<number>(1,2)
  toArray(1,2) // 타입추론으로 number로 추론
  toArray<string>('1','2')
  toArray('1','2') // 타입추론으로 string로 추론
  toArray<string | number>('1',2)
  toArray('1',2) // 해당 함수에서 T라는 하나의 타입만 변수로 있기 때문에, '1'로 문자열로 추론하고, 2에서 타입에러가 발생함
```

* `Generic`을 사용한 클래스
```javascript
  interface BaseInfo {
    className : string
    grade : number
  }

  class User<T> implements BaseInfo {
    className = '프론트엔드학과'
    grade = 2
    constructor(
      public lecture : T
    ){
    }
  }

  const user = new User<string[]>(['JavaScript', 'TypeScript'])
```

## 제약조건
* 인터페이스나 타입 별칭에서도 제너릭을 사용할 수 있다.
* `extends`키워드를 사용하여 조건을 걸 수 있다.
```javascript
  type CustomType<T> = string | T; // 타입별칭 + 제너릭
  interface MyType<T extends CustomType<number>> { // 인터페이스 + 제너릭 + 제약조건
    name : string,
    value : T
  }

  const dataA : MyType<string> = {
    name : 'Data A',
    value : 'Hello World'
  }
  const dataB : MyType<number> = {
    name : 'Data B',
    value : 1234
  }
  const dataC : MyType<boolean> = { // 타입에러
    name : 'Data C',
    value : true
  }
  const dataD : MyType<number[]> = { // 타입에러
    name : 'Daca D',
    value : [1,2,3,4]
  }
```

## 조건부 타입(Conditional Types)
* 제약조건(`<>` 내부)에서 사용하는 `extends`키워드와 다르게 타입구현 영역에서 사용하는 `extends`는 삼항 연산자를 사용할 수 있다.
* 삼항연산자를 연속해서 사용할 수 있다.
* 이를 조건부 타입이라고 한다.
```javascript
  // 타입별칭
  // T로 받은 타입이 U 타입으로 허용(?)된다면 string 타입이고 아니면 never이다.
  type U = string | number | boolean;
  type MyType<T> = T extends U ? string : never;
  let test1 : MyType<number> = 1 // 'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)
  let test2 : MyType<string> = 1 // 'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)
  let test3 : MyType<'문자열'> = '안녕' // 타입 추론으로 정상작동
  let test4 : MyType<[]> = '안녕' // 'string' 형식은 'never' 형식에 할당할 수 없습니다.ts(2322)

  // 인터페이스
  interface IUser<T extends boolean> {
    name : string
    isManager : T
    managerId : T extends true ? number : string
  }

  const bool1 : boolean = true;
  const bool2 : boolean = false;

  const manager : IUser<typeof bool1> = { // true일 때
    name : 'sangmin',
    isManager : true,
    managerId : 3
  }
  const user : IUser<typeof bool2> = { // false 일 때
    name : 'gildong',
    isManager : false,
    managerId : '매니저 권한이 없습니다.'
  }
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)