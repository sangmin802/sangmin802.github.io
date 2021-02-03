---
title : "TypeScript Module"
date : 2020-12-23 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "모듈"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 모듈
* 기본적인 자바스크립트 모듈이 아닌, 타입스크립트만 가지고 있는 모듈개념을 추가적으로 알아보자.

## import & export
```javascript
  // 타입 내보내기
  export interface IUser {
    name : string
    age : number
  }

  export type MyType<T> = string | T

  // 타입 들여오기
  import {IUser, MyType} from './types'
```

* 컴파일 옵션에서 `esModuleInterop : true`를 통해, ES6모듈의 기본 import 방식도 사용할 수 있다.
```javascript
  // CommonJS/AMD/UMD
  import ABC = require('abc');
  // or
  import * as ABC from 'abc';
  // or `"esModuleInterop": true`
  import ABC from 'abc';
```

## 모듈의 타입 선언(Ambient module declaration)
* 타입스크립트의 외부 자바스크립트 모듈 사용
* 모듈을 받고 import 할 때, 에러가 발생한다.
> `react-router-dom`을 import 하는단계에서 에러가 생기긴 함. `@types..`로 다시받거나, `declare...` 라는 해결방안이 뜬다.
* 모듈구현만하는 자바스크립트와 달리 타입선언도 동시에 하는 타입스크립트는 컴파일러가 이해할 수 있도록 모듈또한 타입선언이 필요하며, `.d.ts`라는 형식으로 파일을 만든다.

* Lodash의 camelCase 메소드를 실행시키기
```javascript
  import * as _ from 'lodash'; // Error - TS2307: Cannot find module 'lodash'.

  console.log(_.camelCase('import lodash module'));
```

* lodash.d.ts파일 생성
```javascript
  declare module 'lodash' {
    // 인터페이스 생성
    interface ILodash {
      camelCase(str? : string) : string
    }
    // 인터페이스 정보를 갖고있는 변수 생성
    const _ : ILodash;
    // 변수 내보내기
    export = _;
  }
```
>사용하고자하는 메소드의 타입정보를 갖고있는 인터페이스를 생성해야하는듯 함.

* 컴파일을 위한 참조태그 입력
* 위에서 만든 `lodash.d.ts`파일의 타입선언이 컴파일 과정에 포함될 수 있도록 `///`(삼중 슬래시 지시자)를 사용하는 참조태그와 path(경로) 속성을 사용한다.
```javascript
  // 참조 태그(Triple-slash directive)
  /// <reference path="./lodash.d.ts" />

  import * as _ from 'lodash';

  console.log(_.camelCase('import lodash module'));
```  
  * 참조태그를 통해 가져오는것은 모듈이 아니라 타입 선언이기 때문에 `import`를 사용하지 않는다.
  * `///`는 자바스크립트로 컴파일되면 단순 주석이 된다.
  * `path`속성은 가져올 타입선언의 상대경로를 지정한다.
  * `types`속성은 `/// <reference types="lodash" />`와 같이 모듈 이름을 지정하며, 이는 컴파일 옵션 `typeRoots`와 `Definitely Typed(@types)`를 기준으로 한다.



### Definitely Typed(@types)
* 위처럼 사용하게 되는 메소드를 별도로 타입지정을 해주면 대부분 문제가 해결된다.
* 하지만, 여러개의 메소드를 사용해야하는데 그럴때마다 이러한 작업을 하는것은 너무 비효율적이다.
* `npm install -D @types/모듈이름`를 사용해 설치하면 쉽게 해결된다.

### typeRootes와 types 옵션
* 타입 선언을 찾을 수 없는 자바스크립트 모듈이거나, 가지고있는 타입선언을 수정해야하는경우 `lodash.d.ts`를 직접 만들어야 하는데, 이를 좀 더 쉽게 관리할 수 있는 컴파일옵션 `typeRoots`가 있다.
```javascript
  // types/lodash/index.d.ts
  declare module 'lodash' {
    interface ILodash {
      camelCase(str?: string): string
    }
    const _: ILodash;
    export = _;
  }

  // tsconfig.json
  "typeRoots" : ["./types"]
```
  * `typeRoots`의 기본값은 `["./node_modules/@types"]` 이다.
  * `typeRoots`옵션은 지정된 경로에서 `index.d.ts`파일을 먼저 탐색한다.
  * 컴파일러 옵션 types를 사용해 화이트리스트로 사용할 모듈 이름만 고를 수 있다.
    > `"types" : ["lodash"]` lodash타입만 허용.  
    > `[]` 모두 허용 안함.  
    > 값이 없다면 모두 허용. - 기본값  

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)