---
title : "ES6_Proxy"
date : 2020-07-31 00:00:02
category : "Study"
draft : false
tag : "ECMA Script"
sidebar : 
  title : 'ECMA Script'
  nav : es6    
---   
## Proxy
* 특정 Object를 갖고와서 다른 용도로 사용할 수 있게 하는것
* 첫번째 인자로 대상이 될 객체를 넣고, 두번째 인자로 중간단계의 메소드를 갖고있는 객체를 지정한다.
* 대표 메소드는 `get`, `set` 이다

```javascript
    const proxy = new Proxy({
      name : '이름이야',
      changedCount : 0
    }, {
      get : function(target, property, receiver){
        // target = 타겟이 된 객체
        // property = 명령을 받은 속성
        // receiver = 생성된 proxy객체
        console.log('Get value'); // 1번
        console.log(target, property, receiver) // 2번
        return target[property] ? target[property] : "Doesn't exist";
      },
      set : function(target, property, value){
        // value = 변경되기로 요청한 값
        console.log('Changing name'); // 1번
        target['changedCount']++;
        target[property] = value
      }
    });
    // 생성된 proxy객체를 조회하게될 경우, get메소드가 먼저 실행된다.
    console.log(proxy.name);
    // 1번 Get value
    // 2번 ({name: "이름이야", changedCount: 0}, 'name', Proxy {name: "이름이야", changedCount: 0})
    // 3번 이름이야

    // proxy의 name속성을 변경하게되면, 바뀌기전 set 메소드가 먼저 실행된다.
    proxy.name = 'Name changed';
    // 1번 Changing name

    console.log(proxy.name);
    // 1번 Get value
    // 2번 ({name: "Name changed", changedCount: 0}, 'name', Proxy {name: "Name changed", changedCount: 0})
    // 3번 Name changed
    console.log(proxy.whi); // Doesn't exist
    console.log(proxy); // Proxy {name: "Name changed", changedCount: 1}

    // 위에서는 예시로, 변경이 이뤄질때마다 count++되도록해서 몇번바꿨는지 출력할 수 있도록 함
```