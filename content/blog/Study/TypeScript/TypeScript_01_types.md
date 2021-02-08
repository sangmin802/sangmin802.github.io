---
title : "TypeScript 타입 기본(Type)"
date : 2020-12-16 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "타입 기본(Types)"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 타입 기본(Types)

## 타입 지정
* 타입스크립트는 변수, 매개변수, 속성등에 `: types`와 같은 형태로 타입을 지정해줄 수 있다.
```javascript
// 코틀린때처럼, 리턴값의 타입도 정해줄 수 있는듯 하다.
// 별도로 정해주지 않는다면, 알아서 설정하는 듯 함.
function func(a : string, b : string) : string {
  return a+b;
}
const string : string = func('타입', '스크립트');
```

* 자바스크립트로 컴파일할 경우, 타입들이 모두 사라진다.
```javascript
function func(a, b){
  return a+b;
}
const string = func('타입', '스크립트');
```

## 타입 에러
* 만약, 지정해준 타입이 아닌 다른 타입의 값이 들어오게 된다면, 바로 에러가 발생한다.
```javascript
function add(a : number, b : number) : number {
  return a+b;
}
const result : string = add(1,2);
// 'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)
```

## 타입선언
### 불리언 : Boolean
* true, false로 값을 나타낸다.
```javascript
let bool : boolean;
let bool2 : boolean = false;
```

### 숫자 : Number
* 소숫점을 포함한 숫자와 2진수 및 8진수 리터럴도 적용할 수 있다.
```javascript
let num : number;
let six : number = 6;
let pie : number = 3.14;
let hex: number = 0xf00d; // 61453
let binary: number = 0b1010; // 10
let octal: number = 0o744; // 484
let infinity: number = Infinity;
let nan : number = NaN;
```

### 문자 : String
* 템플릿 리터럴을 포함한 문자열을 나타낸다.
```javascript
let str : string;
let myName : string = '상민';
let myAge : number  = 26;
let introduce : string = `내 이름은 ${myName} 입니다. 나이는 ${myAge} 입니다.`;
```

### 배열 : Array
* 배열을 나타내며 두가지 방법으로 타입을 선언할 수 있다.
* 특정 타입만을 가지고있는 배열
```javascript
// 1. 타입[]
let number : number[] = [1,2,3,4,5,6];
// 2. Array<타입> - 코틀린을 할 때에는 이 방법을 썼다.
let classes : Array<string> = ['바드', '워로드', '블래스터', '디스트로이어', '서머너', '아르카나'];
```

* 여러개의 타입을 가지고 있는 배열
```javascript
// 1. (타입1 | 타입2 ...)[]
let array1 : (string | number | object)[] = [1, '타입', {type : '객체'}];
// 2. Array<타입1 | 타입2 ...>
let array2 : Array<string | number | Array<number>> = [2, '스크립트', [1,2,3]];
```

* 너무 많은 타입을 가지고있거나, 타입을 단언할 수 없을 때
```javascript
let array3 : Array<any> = [0,2,{},[],'타입',true];
let array4 : any[] = [1,2,{},[],'스크립트',false];
```

* interface나 사용자지정 타입을 사용할 수 있다.
```javascript
interface Classes {
  name : string,
  class : string,
  level : number
}
let classesArr : Array<Classes> = [
  {
    name : '모여요꿈동산',
    class : '바드',
    level : 1369
  },
  {
    name : '워로드는뒤로점프',
    class : '워로드',
    level : 1031
  }
]
```
> 코틀린에서 내가 만든 클래스들을 타입으로 사용했었다.

* 읽기전용 배열을 생성할 수 있다. 데이터를 추가, 변경등을 할 수 없다.
```javascript
let array5 : readonly number[] = [1,2,3,4];
let array6 : ReadonlyArray<number> = [1,2,3,4];
```

### 튜플 : Turple
* 배열과 매우 유사하지만, 지정해준 타입이 배열의 고정된 길이 이다.
* 타입의 위치가 정해진 배열이라 생각하면 될듯?
```javascript
let turple : [string, number];
turple = ['타입스트립트', 1];
turple = [1, '타입스크립트']; // 타입 에러
turple = ['타입스트립트', 1, 5]; // 타입 에러 + 갯수 에러
```

* Turple타입인 이차원 배열을 만들 수 있다.
```javascript
let turple2 : [number, string, boolean][];
turple2 = [[1, '타입', true], [2, '스크립트', false]]
```

* Turple은 정해진 타입의 고정된 길이의 배열을 제공하지만, 할당에 국한되므로 push나 splice와 같은 행위는 막을 수 없다.
```javascript
let turple3 : [string, number]
turple3 = ['a', 1];
turple3 = ['b', 2];
turple3.push(3); // 가능
turple3.push(true); // 첫 Turple 지정에 문자열과 숫자만 가능하도록 설정되어있기 때문에, 타입 에러가 발생함
```

### 열거형 : Enum
* 숫자 혹은 문자열 값 집합에 이름을 부여할 수 있는 타입으로, 값의 종류가 일정한 범위로 정해져있는 경우 유용하다
```javascript
enum Week {
  Sun, // (enum member) Week.Sun = 0
  Mon, // (enum member) Week.Sun = 1
  Tue, // (enum member) Week.Sun = 2
  Wed, // (enum member) Week.Sun = 3
  Thu, // (enum member) Week.Sun = 4
  Fri, // (enum member) Week.Sun = 5
  Sat // (enum member) Week.Sun = 6
}
```
> 암만해봐도 숫자는 안되는것 같다.<br>
> 순차적으로 증가할 경우 사용할 수 있을것같긴한데.. 솔직히 아직은 왜있는지 모르겠다.

* 수동으로 값을 지정해줄 수 있으며, 지정해준 값으로부터 다시 1씩 증가한다.
```javascript
enum Week2 {
  Sun, // (enum member) Week.Sun = 0
  Mon, // (enum member) Week.Sun = 1
  Tue = 30, // (enum member) Week.Sun = 30
  Wed, // (enum member) Week.Sun = 31
  Thu, // (enum member) Week.Sun = 32
  Fri, // (enum member) Week.Sun = 33
  Sat // (enum member) Week.Sun = 34
}
```

* 역방향 매핑을 지원하여, 키를 통해 값을 조회할 수 있으며 값을 통해 키를 조회할 수도 있다.
```javascript
Week.Sun // 0
Week[0] // Sun
```

### 모든 타입 : Any
* Any는 모든 타입을 의미한다.
* 일반 자바스크립트처럼 모든 타입의 값들을 할당해 줄 수 있다.
* 외부 자원을 활용해 개발할 때, 타입을 알 수 없을 경우 유용하게 사용할 수 있다.
```javascript
let any : any = 123
any = '타입스크립트'
any = {};
any = null;
```

* 다양한 타입의 값을 가지고 있는 배열을 만들 때 사용할 수 있다.
```javascript
const arr : Array<any> = [1, '타입스크립트', {}, [], true];
const arr2 : any[] = [1, '타입스크립트', {}, [], true];
```

* 타입시스템을 좀 더 강하게 사용하기 위해 Any타입을 막고 싶다면 컴파일 옵션에서 `"noImplicitAny": true`를 통해 Any 사용시 에러를 발생시킬 수 있다.
> 그치만.. 난 any가 좋은걸..

### 알 수 없는 타입 : Unknown
* Any처럼 어떤 타입의 값도 할당할 수 있지만, Unknown을 다른 타입에 할당할 수는 없다.
```javascript
let a : any = 123;
let u : unknown = 123;
let v1 : boolean = a; // Any는 어디든 가능
let v2 : number = u; // unknown 형식은 any를 제외한 다른 타입에는 할당이 불가능함
let v3 : any = u; // Any는 unknown을 할당할 받을 수 있음
let v4 : number = u as number; // unknown중에서 특정 타입을 단언하면 할당할 수 있다.
```
> Unknown타입은 타입단언이나 타입가드를 필요로 한다고 함. 이후 포스트에서 다룰예정

* Any처럼 다양한 타입을 반환하는 외부 API에서 유용할 수 있지만, 되도록 명확한 타입을 사용하는것이 좋다.
```javascript
  interface User {
    id : string,
    password : string
  }
  interface Result {
    success : boolean,
    value : unknown
  };

  function Login(user : User) : Result {
    if(user.id) return {
      success : true, 
      value : {
        id : 'sangmin802',
        name : '상민이'
      }
    }
    return {
      success : false, 
      value : new Error('없는 아이디입니다.')
    }
  }
```

### 객체 : Object
* typeof 연산을 하였을 때, object로 반환하는 모든 타입
* 여러 타입의 상위 타입이기 때문에, 정확도는 떨어진다.
```javascript
let obj : object = {};
let arr : object = [];
let func : object = function(){};
let nullValue : object = null;
let date : object = new Date();
```

* 보다 정확하게 타입을 지정하기 위해, `object`로 지정하기보단, 객체 속성들의 타입을 개별적으로 지정해준다.
```javascript
  let user : {name : string, age : number} = {
    name : 'sangmin',
    age : 26
  }
```

* 반복적인 사용을 할 경우, `interface`나 `type`을 사용한다.
```javascript
  interface User {
    name : string,
    age : number
  }

  let user : User = {
    name : 'sangmin',
    age : 26
  }
```

### Null과 Undefined
* `Null`과 `Undefined`는 모든 타입의 하위 타입으로, 대부분의 타입에 할당될 수 있으며 서로에게도 할당이 가능하다.
```javascript
let num : number = undefined;
let str : string = null;
let obj : {id : string, age : number} = undefined;
let arr : any[]= null;
let und : undefined = null;
let nul : null = undefined;
let voi : void = null; // void는 undefined가 불가능
```

### Void
* 보이드는 값을 반환하지 않는 함수(`return`값이 없는 함수)에서 사용된다.
```javascript
  function consoleHello(msg : string = '안녕하세요') : void {
    console.log(msg);
  }
const hi : void = consoleHello();
console.log(hi) // 억지로 반환시키면 undefined를 반환시킴
```

### Never
* `Never`는 절대 발생하지 않을 값을 뜻하며, 어떠한 타입도 적용할 수 없다.
```javascript
  function error(message: string): never {
    throw new Error(message);
  }
```
> `void`랑 용도가 비슷해보이는데..?

### Union
* 2개 이상의 타입을 허용하는 경우, `Union`이라고 한다. `|`를 통해 타입을 구분하며, `()`는 선택사항이다.
```javascript
let value : (string | number); // string | number
value = '안녕하세요';
value = 3;
```
> `Union`이라는 타입명이 있는건 아니고, 위와같은 상황?을 이야기하는듯 하다.

### 인터섹션 : Intersection
* `&`를 사용해 2개이상의 타입을 조합하는 경우이다.
* 새로운 타입을 생성하지 않고, 기존의 것들들 조합할 수 있긴하지만, 자주사용되지는 않는다고한다.
```javascript
  interface User {
    name : string,
    age : number
  }
  interface Authorized {
    authorized : boolean
  }

  const user : User & Authorized = {
    name : 'sangmin',
    age : 26,
    authorized : true
  }
```

### 함수 : Function
* 화살표 함수를 이용해 타입을 지정할 수 있다.
```javascript
  const func = (x : number = 1, y : number = 3) : number => {
    return x + y;
  }
  console.log(func()) // 4

  let func2 : (arg1 : number, arg2 : number) => number;
  func2 = function(x = 1, y = 3){
    return x+y;
  }

  let func3 : () => void;
  func3 = function(){
    console.log('반환하는거 없습니다.')
  }
```

## 타입 추론 : Inference
* 명시적으로 타입이 선언되어있지 않은경우, 타입스크립트는 부여된 값을 통해 타입을 추론한다.
* <b style="color : tomato;">주의할 점</b>
  * const : 할당된 값이 타입이되버림 `const a = "문자열" // a : "문자열`
    > `const`도 별도로 타입을 입력해주면, 해당 타입이 뜨긴 함
  * let : 정상적인 타입추론이 이루어짐 `let a = "문자열" // a : string`
  * `let`과 `const`는 타입을 추론하는 규칙이 다르다. 이는 합리적인것이, `let`의 경우 타입만 동일하다면 값이 바꿀수 있지만, `const`는 다른 값이 대입될 수 없기 때문에 그냥 타입처럼 박히는? 것이다.
* 모든 곳에 타입을 명시할 필요는 없으며, 이를 통해 좀 더 가독성 좋은 코드를 짤 수 있다.
```javascript
let num = 12;
num = '타입스크립트'; // 'string' 형식은 'number' 형식에 할당할 수 없습니다.ts(2322)
```

## 타입 단언 : Assertions
* 타입스크립트가 타임 추론을 통해 판단할 수 있는 타입의 범위를 넘는경우, 더 이상 추론하지 않게 막을 수 있다.
* 개발자가 타입스크립트보다 타입에 대해 더 잘 알고있는 상황을 의미한다.
```javascript
  // 상황 설명
  //  val : 문자열과 숫자열을 받을 수 있다.
  //  isNumber : 숫자인지 아닌지 boolean으로 받는다.
  //    개발자는 isNumber가 true라면 val이 number타입이라는것을 알고있지만, 타입스크립트는 알지 못한다.
  //    따라서, func1 같은 경우 toFixed메소드는 string타입에서 사용할 수 없다는 에러를 출력하게된다.
  function func1(val : string | number, isNumber : boolean) : void{
    if(isNumber) val.toFixed(2);
  }

  // number타입인 val만 toFixed 메소드가 실행되도록 한다.
  function func2(val : string | number, isNumber : boolean) : void{
    if(isNumber) (val as number).toFixed(2);
  }
```

### Non-null 단언 연산자
* 단언 연산자 `!`를 통해, `Null`이나 `undefined`값이 아님을 단언할 수 있다.
```javascript
  function func(x : number | null | undefined) : string {
    // 조건문을 활용할 경우
    if(x) return x.toFixed(2);

    // 위의 타입 단언을 사용할 경우
    return (x as number).toFixed(2);

    // Non-null(null이나 undefined가 아닌)연산자 !를 사용할 경우
    return x!.toFixed(2);
  }
```

## 타입 가드 : Guards
* 타입스크립트가 추론 가능한 특정 범위에서 타입을 보장할 수 있다.
* `val is Type`의 형태로, 변수의 상태를 반환 타입으로 명시한 함수이다
```javascript
  // 변수의 타입을 매번 보장하기 위해 타입단언을 여러번 사용하게되는 경우가 있다.
  function someFunc(val: string | number, isNumber: boolean) {
    if (isNumber) {
      (val as number).toFixed(2);
      isNaN(val as number);
    } else {
      (val as string).split('');
      (val as string).toUpperCase();
      (val as string).length;
    }
  }

  // 타입가드 val is Type
  //  솔직히 잘 모르겠음.. 그냥 number인지 확인하는 함수를 별도로 밖으로 뺀 느낌이다.
  //  val is number를 그냥 boolean으로 바꿔서 하는거랑 다른게 뭐가 있나..?
  function isNumber(val : string | number) : val is number {
    return typeof val === 'number';
  }
  function someFunc(val: string | number) {
    if (isNumber(val)) {
      val.toFixed(2);
      isNaN(val);
    } else {
      val.split('');
      val.toUpperCase();
      val.length;
    }
  }
```

* `typeof`, `in` 그리고 `instanceof`연산자를 직접 사용하는 타입 가드.
```javascript
  // typeof 연산자
  //  당연히 object는 사용하는것을 비추천
  function funcTypeof(val : string | number){
    if(typeof val === 'number'){
      val.toFixed(2);
      isNaN(val);
    }else{
      val.split('');
      val.toUpperCase();
      val.length;
    }
  }

  // in 연산자
  //  속성 in 객체명
  //    명시된 속성이 객체에 존재하는지 여부 파악
  //    in을 사용하려면, any타입의 변수여야한다.
  //    근데 작동은 안되는데..?
  function funcIn(val : any){
    if('toFixed' in val){
      val.toFixed(2);
      isNaN(val);
    }else if('split' in val){
      val.split('');
      val.toUpperCase();
      val.length;
    }
  }

  // instance 연산자
  //  개인적으로 프로토타입을 만드는것을 선호하지 않기 때문에 패스
```
* 타입 단언과 타입 가드 느낌. 그냥, 짧은 구문을 사용할 경우 타입 단언 긴 구문이 필요하다면 조건문을 활용하여 타입 가드 인 듯 하다..

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)