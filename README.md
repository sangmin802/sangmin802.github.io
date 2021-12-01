# SangMin 개발이야기

템플릿 제작자 : [Jbee](https://github.com/JaeYeopHan)  
템플릿 : [gatsby-starter-bee](https://github.com/JaeYeo pHan/gatsby-starter-bee)  
너무나도 멋진 베이스 만들어주셔서 감사합니다.

## 포스트로 작성하기에는 부정확하거나 단순한 소스들

- React의 UI를 구성하는 요소를 js 내부에 포함시켜 하나의 컴포넌트라고 불리는 jsx를 사용함. babel을 통해 React.createElement로 컴파일 한다고 함
- ReactDOM.render는 단 한번만 호출이 되며, ReactDOM은 해당 엘리먼트와 자식 엘리먼트들에서 변경이 되는 부분만을 업데이트 한다.
- 여기서 엘리먼트는 컴포넌트와 다르고, 컴포넌트의 구성요소이다.

  ```js
  function tick() {
    const element = (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    )
    ReactDOM.render(element, document.getElementById('root'))
  }
  setInterval(tick, 1000)
  ```

위의 메소드를 setInterval로 반복하여 실행하여 전체의 UI를 render 시켜도 오로지 h2의 텍스트만 변경된다.

- ReactDOM.render에 사용되는 엘리먼트는 `<Welcome />`과 같은 사용자 정의 컴포넌트로도 가능함

### React 진행과정

- ReactDOM.render는 `<div>{word}</div>`와 같은 React 엘리먼트(jsx)를 받는다.
- ReactDOM.render에 엘리먼트가 전달되면, React 엘리먼트 트리(virtual dom)가생성되고, 실제 DOM을 생성한다(느낌이 기본적으로 되어있는 document.getElementById('root')의 내부 DOM을 생성하는것 같음). 이후에는 비교, 업데이트를 함
- 엘리먼트는 `<Welcome/>`과 같은 사용자 정의 컴포넌트로 대체될 수 있으며, 이러한 컴포넌트들은 하나 혹은 여러개의 엘리먼트 또는 또 다른 사용자 정의 컴포넌트를 return 한다.
- 처음 ReactDOM.render 로 생성된 이후로는 전체가 아닌 부분적으로 업데이트를 진행함. 이때 Lane : number이라는 값을 통해 대상 컴포넌트를 찾는것같음
- 첫 생성 이후 setState를 통해 상태값에 변화가 생긴다면 전체를 생성하는것이 아닌 React는 변경된 요소를 효율적으로 반영하기 위해 diff 알고리즘의 규칙에 따라 새로운 virtual dom과 이전의 virtual dom을 비교를 하고 변경된 부분만 모아서 하나로 묶어서 실제 DOM 트리를 업데이트 함
  1. 엘리먼트의 타입이 완전 다를 때, `<div> -> <span>`에는 해당 엘리먼트와 자식들을 모두 버리고 새롭게 생성함. 이 때문에, unmount, mount가 다시 호출되는 것
  2. 엘리먼트의 타입이 같을 때, 변경되는 prop만 바뀜
  3. 컴포넌트가 동일할 때, 변경이 있는 prop만 업데이드 됨. 이때 componentDidUpdate 호출됨 (이거는 hook에서 조금 바뀐것같음)
  4. 자식에 대해서는 key를 기준으로
- React에서의 컴포넌트들은 자신이 받은 데이터가 상위 컴포넌트의 props로 받은것인지, 자체 state인지 알지 못한다. 오로지 자신이 반환하는 컴포넌트 혹은 엘리먼트들에게 어떠한 속성을 전달할것인지에만 집중하고, 변화를 준다.
  > 이러한 특징 때문에, React는 단방향식 데이터 흐름이라고 한다.

### jsx

- **HTML과 표현식이 함께 사용되어 React Element를 생성한는 식.** React.createlement로 이해할 수 있고 실행될 수 있는 코드로 컴파일되기 위한 방법
- React에서 작성한 `<Component id={1} />` 등등들은 React.createElement(엘리먼트, 속성, 자식들) 으로 컴파일 되어 작동된다
- 첫번째 엘리먼트에서 소문자가 전달되면 기본적으로 제공되는 div, span등의 태그들이며 대문자이면 사용자가 생성한 컴포넌트를 지칭하게 된다
  - 컴파일 단계에서 사용자가 생성한 컴포넌트를 찾기 때문에, 해당 스코프 내에서는 import 되어 알고있는 상태여야 한다.
  - createElement또한, 컴파일 단계에서 찾기 때문에 React를 import 해놓아야 한다.
- 표현식의 경우 위의 Component처럼 속성을 직접 전달할 수있지만, for나 if 같은 구문은 직접 전달될 수 없기 때문에, 이러한 작업을 수행하고 해당 속성을 전달하는 React.createElement로 컴파일되는 return문을 작성하는것이다.

### Hook의 등장

class가 아닌 함수형 컴포넌트에 React의 state와 생명주기 기능을 연동시켜주는 함수이다.

- [why Hook](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)

### useState

- React는 Hook 호출을 컴포넌트와 어떻게 연관시키는가? https://ko.reactjs.org/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components
- React는 현재 렌더링중인 컴포넌트를 추적하고 있다고 함 코드를 보니 업데이트되는 컴포넌트를 Lane(number 타입) 이라는 값으로 찾는것 같음
- 각 컴포넌트마다 데이터를 관리하는 객체를 갖고있고, useState와 같은 hook이 작동되었을 때 해당 컴포넌트를 찾아서 실행하는것 같음
- React 어플리케이션에서는 상태값을 하나의 key와 value 한 쌍으로 기억을 한다고 함
- react hook 작동원리의 예제에서 작성된 순서로의 index로 기억하는 것처럼. 아마 예제에서는 상당히 일부분만 구현된것이기 때문에, 추적하는 key-value도 상위에 있을것 같음

### Suspense

- [예제](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/fakeApi.js:701-710)

Suspense는 React에서 사용되고있는 컴포넌트가 사용하고있는 데이터가 아직 준비되지 않았다는것을 React에 알려줄 수 있는 방법.
React에서는 getDerivedStateFromError는 컴포넌트가 마운트되기 이전에 호출되는 생명주기로, 렌더 과정에서 하위에서 발생한 에러를 포착할 수 있음
React-query와 같이 비동기과정에서 loading과같은 상태를 잡을수 있는데, 이 때의 비동기작업들은 일반 Promise를 반환하는것이 아니라 상태, 결과, 실제 promise를 클로저로 기억하여 값을 반환하는 함수를 반환하는것 같음
이 때, 만약 상태가 처음의 pending이라면 throw로 해당 promise를 에러의 값으로 전달하여 Suspense가 getDerivedStateFromError를 통해 감지 중단, 지연을 시키고 fallback 컴포넌트를 반환하는것 같음

> 실제로, Suspense로 감싼 컴포넌트 내부에서 Promise자체를 throw를 통해 에러의 값으로 전달하면 error가 발생하는것이 아닌, Suspense에 지정한 fallback이 반환되는것을 확인할 수 있음

데이터를 받아오는 컴포넌트 내부에서 throw를 호출하여 해당 컴포넌트를 중지시키는게 핵심인것 같음. 또한 그 throw 자체를 Suspense의 getDerivedStateFromError가 감지하여 fallback을 반환하는것도

> unmount가 아닌 중지임 mount 조차도 되지 않음

- 해당 컴포넌트가 사용하는 데이터가 존재하지 않을 경우 정지하고 다음 컴포넌트의 렌더링을 시도함 - 일종의 비동기 작업처럼 중지하고 이후로 미루는것 같음
- 모든 컴포넌트의 렌더링이 종료되면 중지되어있던 컴포넌트의 상위에 있던 Suspense에 전달된 fallback을 찾고 그것을 렌더링함
  > 흔히 ...loading 같은것들

```js
import React from 'react'

let resolve = null

const promise = new Promise(res => {
  resolve = res
}).then(() => {
  data = 'success data'
})

function async() {
  if (!data) throw promise
  return data
}

export default function App() {
  return (
    <div className="App">
      <React.Suspense
        fallback={
          <button
            onClick={() => {
              resolve?.()
            }}
          >
            resolve!
          </button>
        }
      >
        <InnerApp />
      </React.Suspense>
    </div>
  )
}

function InnerApp() {
  const data = async()

  return <>{data}</>
}
```

> codeSandbox에서 구현해봄

- getBoundingClientRect는 reflow 발생

  > 직접적인 발생 보다는, 최신의 위치값을 알 기 위해, 렌더링 que에 쌓여있는 reflow 유발 작업들을 모두 처리한다고 함.

### Promise와 callback 차이

- setTimeout 과 같은 비동기작업을 수행하고 다음 단계의 작업을 실행하고자 할 때 무한히 생성될 수 있는 콜백지옥을 .then을 통한 체이닝으로 해소 가능
- 비동기 작업을 수행하고 성공하거나 실패에 대한 상황을 핸들링하는데 용이함

### React는 라이브러리? 프레임워크?

- React만의 jsx파일을 사용한다는 특징, 기준이 있고 React를 사용하면 어느정도 비슷한 구조를 갖게되는점에서 프레임워크에 더 가깝다는 얘기를 함
- 개발자가 제작하는 프로그램이 갖고있는 기준을 기반으로 필요한 기능을 부분부분별 가져다 쓸 수 있다면 라이브러리
- 정해져있는 기준, 규칙, 흐름이 있고 그러한 기반을 바탕으로 개발자가 프로그램을 제작한다면 프레임워크

### 왜 타입스크립트?

- https://dzone.com/articles/what-is-typescript-and-why-use-it
- 컴파일 단계에서 예상 외의 결과가 발생할 수 있는 코드들을 미리 알려줘서 런타임 때 발생하지 않도록 예방을 해줌
- 만약, 협업을 하는 과정에서 특정 함수에 어떠한 타입의 값이 전달되어야 하는지 알 수 있어서, 버그를 예방할 수 있음

### history.replace vs history.go

- 기본적으로 history 객체는 브라우저에서 사용자의 방문기록에 접근하고, 이동하는 메소드를 제공하는 객체
- history.replace : 현재 검색 스택에 최상위의 위치를 대체함
- history.push : 누적된 검색 스택 위에 하나를 더 쌓음
- history.go(숫자) : -이면 현재 검색스택에서 뒤로가기 +면 현재 검색스택에서 앞으로이동

### 비동기를 통한 성능개선

- 검색 자동완성을 사용할 때, 디바운싱을 사용하여 setTimeout의 비동기를 이용해 최신의 요청에만 데이터를 받아오는 로직을 실행

### 비동기를 통한 경험 개선

- 원래대로라면, 처음 데이터를 비동기로 받아오고, 받아온 데이터를 기반으로 새롭게 요청을 하는 과정에 있어서, 사용자가 첫 화면을 보는데 너무 오랜시간이 걸린다고 파악되어

  > 첫 데이터가 수신된다면, 화면을 그리고 이후의 데이터는 별도의 비동기 작업으로 진행하여 데이터를 받아오도록 처리

### resolve의 호출시기

비동기를 사용하여 진행중인 이벤트를 일시 중단하고, 다른 환경에서 resolve를 호출하여 중단된 이벤트를 이어서 진행할 수 있음

- 진행중인 이벤트에서, 나머지는 나중에 실행시키고 싶다 라는 경우, Promise를 통해 인자로 받은 resolve를 원하는 타이밍에 호출시켜서 그 이후에 진행시킬 수 있음(React context나 전역변수로 기억해서 다른 환경에서도 가능.)
- 특정프로젝트에서 a select박스에서 특정 옵션을 선택했을 때만 b select 박스가 활성화 되는 상태에서 b select 의 옵션을 선택했을 때 a select를 초기화시키고 싶었기 때문에, a select에서 초기화 시키는 로직 이전을 중단키기 위해 로직들을 비동기로 처리하고, b select를 활성화시키는 옵션을 선택하였을 때에는 즉시 resolve시키는것이 아닌 b select 박스에서의 옵션을 선택했을 때 resolve 시켜서 a select box의 나머지 이벤트를 이어서 진행하도록 하였음

### 브라우저 작동 과정

- 내 블로그

### react flux? 디자인패턴?

- [링크](https://bestalign.github.io/translation/cartoon-guide-to-flux/)
- 뷰에서도 데이터 모델을 업데이트 할 수 있고, 그 업데이트된 모델을 의존하는 다른 모델이 업데이트되는등... 끝이없음
- 상태에 변화를 주고자 하면 어떤일을 하는지, 참고할 데이터의 정보를 통해 하나의 액션을 생성한다.(흔히 action과 payload)
- 생성된 액션을 디스패쳐로 넘겨준다. dispatch({type : ...})
- 디스패쳐는 액션을 기다리는 모든 스토어에대해 알고있고, 액션이 넘어오게된다면 스토어에 액션을 전달해준다.
- 스토어는 디스패쳐로부터 모든 액션들을 전달받고, 타입에 따라 수행할지 하지 않을지 혹은 어떤식으로 처리할지 구분하여 상태값을 업데이트한다.
- 뷰는 그냥 전달받은 상태값을 보여주기만 한다.

### virtual dom, 메모이제이션과 diff

- React는 변경된 요소를 효율적으로 반영하기 위해 diff 알고리즘의 규칙에 따라 새로운 virtual dom과 이전의 virtual dom을 비교를 하고 변경된 부분만을 통해 실제 DOM에 최소한의 수정을 가함
  1. 엘리먼트의 타입이 완전 다를 때, `<div> -> <span>`에는 해당 엘리먼트와 자식들을 모두 버리고 새롭게 생성함. 이 때문에, unmount, mount가 다시 호출되는 것
  2. 엘리먼트의 타입이 같을 때, 변경되는 prop만 바뀜
  3. 컴포넌트가 동일할 때, 변경이 있는 prop만 업데이드 됨. 이때 componentDidUpdate 호출됨 (이거는 hook에서 조금 바뀐것같음)
  4. 자식에 대해서는 key를 기준으로
- memo를 사용하지 않아도, 사용하지 않는 속성에 의해 자식이 rerendere되어 많은 횟수의 변화가 있는것 같아보여도 위와같은 diff 알고리즘을 통해 성능에는 큰 문제가 없음
- 단순히 rerender를 예방하는것이지, DOM 변경과 관련된 성능에는 큰 차이 없다고 함. 하지만, render를 한다는것은 이전 vdom과 render된 vdom을 비교하기 위한 diff 알고리즘이 한번 더 실행되어야 함
  > 물론, diff 알고리즘이 매우 효율적이라 큰 문제는 안되지만, 우리가 React 내부에서 작성한 로직들이 다시 실행된다는것은 얘기가 다름

### why parse block

document.write와 같이 html을 즉시 생성하는 경우가 있어서(그 순서를 보장하기 위해?)

### Promise 실행함수와 try catch 범위

new Promise의 인자로 전달되는 콜백함수는 하나의 실행함수로서 프로미스의 실행, 거절을 의미하는 두가지 인자를 받는 함수이다. 이 실행함수는 Promise 객체가 반환되기 이전에 먼저 실행이 된다.

대게, 어떠한 비동기로 진행된 작업이 완료되고 내부에서 resolve 혹은 reject를 호출하여 이후의 로직을 마이크로태스크큐에 넘겨 이벤트루프를 통해 콜스택에 넘겨지도록 한다.

await이 없다면 try catch로 잡을 수 없는 이유는, Promise 내부에서 발생한 throw는 하나의 reject와 동일하게 작동되어 Promise가 거절되었다는 것은, 해당 에러는 이미 비동기로서 try catch의 영향권을 벗어난 상태이기 때문이다.

- 실행함수 주위에는 `'암시적 try..catch'`가 존재하고 있고, 스스로 에러를 잡고, 에러를 거부상태의 프라미스로 변경시킨다.
  > (throw error -> reject)
- 당연히 Promise 내부의 setTimout 안에서 발생한 에러는 await 되어있는 try catch라도 잡지 못한다.
  > setTimout이라는 별도의 비동기 환경에서 발상한 에러이기 때문에 내부에 try catch로 감싸고 catch 시 Promise의 reject를 호출해줘야 한다.

### 렌더링 파이프라인

브라우저를 렌더링하는 과정들 파싱, 렌더트리 구축, 레이아웃 형성, 페인트, 컴포지트단계 (컴포지터 스레드 작업)을 하나의 렌더링 파이프라인이라고 한다.

### css-in-js

1. 클래스명에대한 고민을 줄일 수 있음
2. 현재의 자바스크립트 환경에 쉽게 접근할 수 있고, 동적으로 생성된 값에 자유롭게 스타일링을 할 수 있음
   - 만약, css-in-css를 사용한다면 동적인 스타일을 부여하기 위해 inline 스타일을 사용해야 함
3. 별도의 스타일 파일을 관리할 필요가 없음

   - 근데 생각해보면 css-in-js를 사용하더라도 스타일을 별도의 파일로 관리하며 import 해 사용하긴 함..

4. 결국 의존하는 새로운 모듈이 추가되는 것
5. css-in-css를 통해 완성되어있는 클래스를 즉시 반영하는것과, 자바스크립트로 된 새로운 스타일을 읽고 계산하여 반영하는것에 차이가 있다고 함
   - 어쨌든 결국 스타일을 적용하기 위해 스크립트를 한번 더 읽고 계산하고 해석해야 하는 점
