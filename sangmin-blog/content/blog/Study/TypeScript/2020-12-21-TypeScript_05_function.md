---
title : "TypeScript Function"
date : 2020-12-21 00:00:02
category : "Study"
draft : false
tag : "TypeScript"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 함수

## 오버로드(Overloads)
* 오버로드는 이름은 같지만 매개변수 타입과 반환 타입이 다른 여러 함수를 가질 수 있는것.
> 내가 선언한 함수들이 중첩되는느낌?
* 원하는 만큼의 함수 선언 및 필수적으로 하나의 함수 구현을 가지고 있어야 하며, 함수 구현에서의 타입은 대게 `any`가 사용된다.
```javascript
  function add(a : string, b : string) : string; // 함수 선언
  function add(a : number, b : number) : number; // 함수 선언
  function add(a : any, b : any) : any { // 함수 구현
    return a + b;
  };

  add('타입', '스크립트');
  add(1, 2)
  add('타입', 2)
  // 이 호출과 일치하는 오버로드가 없습니다.
  // 오버로드 1/2('(a: string, b: string): string')에서 다음 오류가 발생했습니다.
  // 오버로드 2/2('(a: number, b: number): number')에서 다음 오류가 발생했습니다.
```

* 인터페이스나 타입별칭에서도 사용할 수 있다.
```javascript
  interface IUser {
    name : string
    age : number
    getData(x : string) : string[] // 함수 선언
    getData(x : number) : string // 함수 선언
  }

  const user : IUser = {
    name : 'sangmin',
    age : 26,
    getData(data : any) : any { // 함수 구현
      if(typeof data === 'string') return data.split('');
      if(typeof data === 'number') return data.toString();
      return null;
    }
  }
  console.log(user.getData('타입스크립트'));
  console.log(user.getData(123));
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)