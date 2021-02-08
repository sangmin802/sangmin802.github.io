---
title : "ES6_String.new-Methods"
date : 2020-07-17 00:00:01
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6  
---   
## String.methods

* ES6에서 String 객체의 새로운 메소드가 추가되었다.

```javascript
// ES6 string의 새로운 메소드들.
const str = 'Hello world!';
const startstr = 'Hello';
const endstr = 'world!';
const include = 'lo wor';

// 1. string.startWith(시작되는문자열);
console.log(str.startsWith(startstr)); // true

// 2. string.endWith(마지막문자열);
console.log(str.endsWith(endstr)); // true

// 3. string.includes(포함문자열);
console.log(str.includes(include)); // true
```