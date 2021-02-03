---
title : "TypeScript Utility"
date : 2020-12-23 00:00:01
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "유틸리티"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# TS 유틸리티 타입
* 타입스크립트에서 제공하는 여러 전역 유틸리티 타입이 있다.
> 대체로 타입변수는 `T`, 또 다른 타입변수는 `U`, 속성은 `K`로 한다.  
> 좀더 직관적으로 하기 위해 또 다른 타입변수는 `T2`로 카운팅하겠음

## Partial
* TYPE의 모든 속성을 모두 선택적 타입(`?`)로 반환
  * 대표타입 : 인터페이스  
  * 타입변수 : `<T>`

```javascript
  interface IUser {
    name : string
    age : number
  }
  ↓ // 변환
  interface PartialUser {
    name? : string
    age? : number
  }

  const userA : IUser = { // 'age' 속성이 '{ name: string; }' 형식에 없지만 'IUser' 형식에서 필수입니다.ts(2741)
    name : 'A'
  }
  const userB : Partial<IUser> = {
    name : 'B'
  }
```

## Required	
* TYPE의 모든 속성을 필수로 변경한 새로운 타입 반환(선택적타입`?`를 제거)
  * 대표타입 : 인터페이스  
  * 타입변수 : `<T>`

```javascript
  interface IUser {
    name? : string
    age? : number
  }
  ↓ // 변환
  interface RequiredUser {
    name : string
    age : number
  }

  const userA : IUser = {
    name : 'A'
  }
  const userB : Required<IUser> = { // 'age' 속성이 '{ name: string; }' 형식에 없지만 'Required<IUser>' 형식에서 필수입니다.
    name : 'B'
  }
```

## Readonly	
* TYPE의 모든 속성을 읽기 전용으로 변경한 새로운 타입 반환  
  * 대표타입 : 인터페이스	
  * 타입변수 : `<T>`

```javascript
  interface IUser {
    name? : string
    age? : number
  }
  ↓ // 변환
  interface ReadonlyUser {
    readonly name : string
    readonly age : number
  }

  const userA : IUser = {
    name : 'A',
    age : 12
  }
  const userB : Readonly<IUser> = {
    name : 'B',
    age : 13
  }

  userB.name = 'C' // 읽기 전용 속성이므로 'name'에 할당할 수 없습니다.ts(2540)
```

## Record	
* KEY를 속성으로, TYPE를 그 속성값의 타입으로 지정하는 새로운 타입 반환
> `Type Aliases`의 타입들을 속성으로 갖는 인터페이스를 만드는데 사용하는듯 함.
  * 대표타입 : 인터페이스	
  * 타입변수 : `<K, T>`
* 구한 값을 속성으로하는 새로운 인터페이스를 동적으로 생성하는 느낌?

```javascript
  type User = 'sangmin' | 'gildong'
  const user : Record<User, string> = {
    sangmin : 'frontend',
    gildong : 'backend'
  }
  ↓ // 변환
  interface RecordUser {
    sangmin : string
    gildong : string
  }
```

## Pick	
* TYPE에서 KEY로 속성을 선택한 새로운 타입 반환
> Type은 속성을 가지는 인터페이스나 객체여야 함
  * 대표타입 : 인터페이스	
  * 타입변수 : `<T, K>`
* 기존 틀에서, 필요한것만 다시 뽑아서 동적으로 인터페이스를 생성하는 느낌

```javascript
  interface IUser {
    name : string,
    age : number,
    email : string,
    isValid : boolean
  }
  type TKey = 'name' | 'age'
  const user : Pick<IUser, TKey> = {
    name : '상민',
    age : 26
    email : 'sangmin802@naver.com' // 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Pick<IUser, TKey>' 형식에 'email'이(가) 없습니다.ts(2322)
  }
  ↓ // 변환
  interface PickUser {
    name : string
    age : number
  }
```

## Omit	
* TYPE에서 KEY로 속성을 생략하고 나머지를 선택한 새로운 타입 반환
> Type은 속성을 가지는 인터페이스나 객체여야 함
  * 대표타입 : 인터페이스	
  * 타입변수 : `<T, K>`
* `Pick`과 반대로, 기존의 틀에서 지정한 속성들을 제외한 새로운 인터페이스를 생성

```javascript
  interface IUser {
    name : string,
    age : number,
    email : string,
    isValid : boolean
  }
  type TKey = 'name' | 'age'
  const user : Omit<IUser, TKey> = {
    age : 26, // 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Pick<IUser, "email" | "isValid">' 형식에 'age'이(가) 없습니다.ts(2322)
    email : 'sangmin802@naver.com',
    isValid : true
  }
  ↓ // 변환
  interface OmitUser {
    email : string,
    isValid : boolean
  }
```

## Exclude	
* TYPE1에서 TYPE2를 제외한 새로운 타입 반환
  * 대표타입 : 유니언	
  * 타입변수 : `<T1, T2>`

```javascript
  type T = string | number;

  const a : Exclude<T ,number> = 1 // 'number' 형식은 'string' 형식에 할당할 수 없습니다.
  const b : Exclude<T ,number> = '문자열'
  ↓ // 변환
  type ExcludeT = string;
```

## Extract	
* TYPE1에서 TYPE2를 추출한 새로운 타입 반환
> 서로 공통적으로 가지고 있는 타입만 반환하는듯 함
  * 대표타입 : 유니언	
  * 타입변수 : `<T1, T2>`

```javascript
  type T = string | number;
  type U = number | boolean;

  const a : Extract<T ,U> = 123
  const b : Extract<T ,U> = false // 'boolean' 형식은 'number' 형식에 할당할 수 없습니다.ts(2322)
  const c : Extract<T ,U> = '문자열' // 'string' 형식은 'number' 형식에 할당할 수 없습니다.ts(2322)
```

## NonNullable	
* TYPE에서 null과 undefined를 제외한 새로운 타입 반환
  * 대표타입 : 유니언	
  * 타입변수 : `<T>`

```javascript
  type T = string | number | undefined | null;

  const a : T = null
  const b : NonNullable<T> = null // Type 'null' is not assignable to type 'string | number'.
  // strictNullChecks": true 사용시 null을 다른타입에서 더이상 인정하지 않아 에러 발생함
```

## Parameters	
* 함수의 매개변수 타입을 새로운 튜플 타입으로 반환
  * 대표타입 : 함수, 튜플	
  * 타입변수 : `<T>`

```javascript
function func(a : string | number, b : boolean){
  return `[${a}, ${b}]`
}

const a : Parameters<typeof func> = [123, true]
const b : Parameters<typeof func> = ['문자열', 123] // 'number' 형식은 'boolean' 형식에 할당할 수 없습니다.ts(2322)
```

## ConstructorParameters	
* 클래스 생성자의 매개변수 타입을 새로운 튜플 타입으로 반환
  * 대표타입 : 클래스, 튜플	
  * 타입변수 : `<T>`

```javascript
class User {
  constructor(public name : string, public ace : number){}
}

const a : ConstructorParameters<typeof User> = ['상민', 26]
const b : ConstructorParameters<typeof User> = ['상민'] // 소스에 1개 요소가 있지만, 대상에 2개가 필요합니다.ts(2322)
```

## ReturnType	
* 함수의 반환 타입을 새로운 타입으로 변경
>반환되는 값의 타입을 다른 함수나 타입을 통해 동적으로 해야 할 때 쓸 듯?
  * 대표타입 : 함수
  * 타입변수 : `<T>`

```javascript
function func(a : string){
  return a;
}
const a : ReturnType<typeof func> = '문자열';
function func2(a : string) : ReturnType<() => number> {
  return a.length;
}
```

## InstanceType	
* 클래스의 인스턴스 타입을 반환
> 잘.. 모르겠음
  * 대표타입 : 클래스
  * 타입변수 : `<T>`

```javascript
class User {
  constructor(public name : string){}
}
const user : InstanceType<typeof User> = new User('sangmin');
↓ // 변환
const instanceTypeUser : User = new User('sangmin');
```

## ThisParameterType	
* 함수의 명시적 this 매개변수 타입을 새로운 타입으로 반환, 없으면 `unknown`타입 반환
* `returnType`은 함수의 반환타입을 타입으로 사용한다면, `ThisParameterType`는 함수의 `this`로 명칭된 매개변수의 타입을 가져와서 사용한다.
> 그로인해 해당 유틸리티의 타겟이 된 함수에 인자를 보내고자할 때에는, `apply`를 사용해야한다.
  * 대표타입 : 함수
  * 타입변수 : `<T>`

```javascript
function toHex(this : number) : string {
  return this.toString(16)
}

function numberToString(n : ThisParameterType<typeof toHex>){
  return toHex.apply(n)
}
```

## OmitThisParameter	
  * 함수의 명시적 this 매개변수를 제거한 새로운 타입을 반환
  > 용도를 잘 모르겠음...
    * 대표타입 : 함수
    * 타입변수 : `<T>`

```javascript
const cat = {
  age : 12
}
const dog = {
  age : '12'
}
function getAge(this : typeof cat) {
  return this.age
}
getAge.apply(cat)
getAge.apply(dog) // Argument of type '{ age: string; }' is not assignable to parameter of type '{ age: number; }'.

const getAgeForDog : OmitThisParameter<typeof getAge> = getAge;
getAgeForDog.apply(dog);
```

## ThisType	
* TYPE의 this 컨텍스트(Context)를 명시, 별도 반환 없음
> 타입스크립트버전 apply인가..?
  * 대표타입 : 인터페이스
  * 타입변수 : `<T>`
* 설명
  * 평소라면, `user`의 인자로 보내지는 `introduce`내부 `this.name`은 에러가 발생함
  * 하지만, 변수로 받을 때 타입을 `ThisType<IUser>`를 통해서, `IUser`영역을 잡아줌.
  * 따라서 위의 `this.name`에서 `this`는 `IUser` 인터페이스를 바라보게 됨
  * 하지만, `ThisType`유틸리티는 아무런 타입도 반환하지 않기 때문에, 해당 함수의 리턴값이 정상적으로 추론되지 않음.
  * 따라서 `as IUser`와 같은 타입단언으로 리턴값의 타입을 지정해줌

```javascript
interface IUser {
  name : string
  introduce : () => string
}

function makeUser(methods : ThisType<IUser>){
  return {name : '상민', ...methods} as IUser;
}

const user = makeUser({
  introduce(){
    return this.name;
  }
});

user.introduce(); // '상민'
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)