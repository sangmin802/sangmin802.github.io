---
title : "TypeScript Optional"
date : 2020-12-22 00:00:01
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "선택적 옵션"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 선택적 옵션(Optional)
* `?`키워드를 사용하는 여러 선택적 개념에 대해 알아보자
> `interface`에서는 `?`키워드를 통해, 필수 속성이 아닌 선택적 속성임을 명시해줬다.

## 매개변수(Parameters)
* 타입을 선언할 때 선택적 매개변수를 지정할 수 있다.
```javascript
  function add(x : number, y? : number) : number {
    return x+(y ?? 0);
  }
  const result = add(2);
  console.log(result)
```

## 속성과 메소드(Properties and Methods)
* `?` 키워드를 속성과 메소드 타입에도 선언할 수 있다.
* `interface`, `type`, `class`에서 사용 가능하다.
* 이전 `interface`에 선택적 옵션 예제가 있으니 패스

## 체이닝(Chaining)
* 특정 속성이 `undefined`나 `null`이 아닐경우에만 다음 속성을 찾을 수 있도록 할 수 있다.
* 자바스크립트에서는 <b>옵셔널 체이닝</b>으로 알려져있는 기능이다.
```javascript
  function toString(str : string | null) : string[] {
    return str?.split('');
  }

  toString('문자열')
  toString(null) // ?없으면 에러
```

* `&&` 연산자로 속성을 깊숙히 들어가며 `null`여부를 파악할 때 유용하다.
```javascript
  if(foo && foo.bar && foo.bar.baz){}
  if(foo?.bar?.baz){}
```

## Nullish 병합 연산자
* `||`를 사용하여 false를확인하는 경우가 많은데, `0`이나 `''`값또한 false로 인식하여 문제가 생길 수 있다. 자바스크립트와 마찬가지로 `??`를 사용하여 해결할 수 있다.
```javascript
  const foo = null ?? 'Hello nullish.';
  console.log(foo); // null이라 이후 값이 할당. Hello nullish.

  const bar = false ?? true;
  console.log(bar); // false

  const baz = 0 ?? 12;
  console.log(baz); // 0
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)