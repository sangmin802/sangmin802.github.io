---
title : "TypeScript Class"
date : 2020-12-22 00:00:00
category : "Study"
draft : false
tag : "TypeScript"
toc: true
toc_label: "클래스"
sidebar : 
  - title : 'TypeScript'
  - nav : TypeScript
--- 
# 클래스(Class)
* 클래스의 생성자 `constructor`와 일반 메소드와는 다르게 속성은 `val : type`과 같이 클래스 바디에 별도로 타입을 선언한다.
```javascript
  class Animal {
    name : string
    constructor(name : string){
      this.name = name;
    }
  }

  class Dog extends Animal {
    getName() : string {
      return `강아지 이름은 ${this.name} 입니다.`
    }
  }

  const dob : Dog = new Dog('백돌시');
```

## 클래스 수식어(Modifiers)
* 클래스의 속성이나 메소드에서 사용할 수 있는 접근 제어자(Access Modifiers)들이 있다
  * `public` : 어디서나 자유롭게 접근가능(기본) - 속성, 메소드
  * `protected` : 나와 상속된 클래스 내에서 접근 가능 - 속성, 메소드
  * `private` : 현재 클래스에서만 접근 가능 - 속성, 메소드
  * `static` : 정적으로 사용 - 속성, 일반 메소드
  * `readonly` : 읽기 전용으로 사용 - 속성
* 생성자 consturctor에서 타입선언과 동시에 접근제어자를 사용하면 속성으로 정의할 수 있다.
```javascript
  class Animal {
    constructor(public name : string){
    }
  }

  class Dog extends Animal {
    getName() : string {
      return `강아지 이름은 ${this.name} 입니다.`
    }
  }

  const dog : Dog = new Dog('백돌시');
```

* `static`을 사용하여 정적 변수나, 정적 메소드를 생성할 수 있다.
* `static`이란, 클래스 자체가 가지고있는 속성이나 메소드이다.
```javascript
  class Animal {
    static type : string = '동물'
    constructor(public name : string){
      this.name = name;
    }
  }

  class Dog extends Animal {
    getName() : string {
      return `강아지 이름은 ${this.name} 입니다. ${Animal.type} 입니다.`
    }
  }

  const dog : Dog = new Dog('백돌시');
  console.log(dog.getName())
```

## 추상(Abstract) 클래스
* 추상 클래스는 다른 클래스가 파생될 수 있는 기본 클래스로, 인터페이스와 굉장히 유사하다.
```javascript
  abstract class AUser {
    abstract name : string
    abstract getName() : string
  }

  class User1 extends AUser {
    constructor(public name : string){
      super()
    }
    getName(){
      return this.name
    }
  }

  interface IUser {
    name : string
    getName() : string
  }

  class User2 implements IUser {
    constructor(public name : string){}
    getName(){
      return this.name
    }
  }

  const user1 = new User1('상민');
  const user2 = new User2('상민');
```

* 추상 클래스와 인터페이스의 차이점은 속성이나 메소드에 대한 세부 구현이 가능하다.
```javascript
  abstract class AUser {
    abstract name : string
    abstract getName() : string
    constructor(public age : number){}
    getAge(){
      return this.age
    }
  }

  class User1 extends AUser {
    constructor(public name : string, age : number){
      super(age)
    }
    getName(){
      return this.name
    }
  }

  const user1 = new User1('상민', 26);
  console.log(user1.getName(), user1.getAge())
```

## 참조
* [HEROPY Teck 한눈에 보는 타입스크립트](https://heropy.blog/2020/01/27/typescript/)