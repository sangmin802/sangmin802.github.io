---
title: ⚛ CallStack에서 await을 만났을 때
date: 2021-10-09 11:18:00
category: 'Study'
draft: false
tag: 'Think'
---

`React`에서 `setState`는 비동기로 작동이 된다.

엄밀히 따지면, `setState`가 호출이되면 상태값을 변경하는 요청을 비동기로 전달하게 된다.

```js
const [state, setState] = useState(0)

useState(() => {
  setState(state + 1)
  setState(state + 1)
  setState(state + 1)
}, [])

console.log(state) // 1
```

동일 이벤트 내에 여러번 동일한 `setState`가 호출이 되고, 동일한 대상이라면 대체된다.

> 위의 값이 1인 이유이다.

### React Asnyc Logic

`React`에서 서버로 요청을 보내고 응답을 받는 등의 비동기 로직을 작성하는 방식이다.

```js
const async = useCallback(async () => {
  setLoading(true)
  try {
    const data = await fetchSomething()
    setData(data)
    setLoading(false)
  } catch (e) {
    setError(error)
    setLoading(false)
  }
}, [])

useEffect(() => {
  async()
}, [async])
```

대충 위와 같은 방식으로 비동기작업 로직을 작성하게 된다.

> 더 나은 방법으로 `React-Query`나 상황에 따라`Redux-Saga` 를 사용하기도 함

흐름은 간단하다.

1. 요청이 들어오면 `loading`.
2. 서버로 요청을 전송하면, 응답을 받을때까지 중단.
3. 정상 응답이면 `data` 설정, `loading` 취소.
4. 에러라면 `error` 설정, `loading` 취소.

`setState`를 통해 상태값을 업데이트하는 요청을 비동기로 전송하는 상황을 자바스크립트 실행환경을 생각하면서 흐름을 잡아보는 과정에 있어서 궁금한것이 생겼다.

`async`, `await`이 `Promise`, `.then`의 어떠한 부분을 대체하는걸까?

## Promise, .then

`async`, `await` 이전 비동기를 처리하기위해 사용되어왔던 방법이다.

```js
console.log(
  (function promise() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('done')
      }, 200)
    })
  })()
)
```

비동기작업의 결과값을 잡아내기 위한 방법을 제공하는 `Promise`객체는 대기, 처리, 거부의 상태를 갖고있다.

위의 상태만으로는 `Promise { <pending> }`의 결과를 보여줄 것이다.

> `console.log`로 조회를 할 때에는 아직, `.2`초의 작업이 비동기로 진행중이기 떄문

처리, 에러와 같은 결과를 확인하기 위해서는 `.then`, `.catch`와 같은 메소드를 사용해야 한다.

```js
;(function promise() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done')
    }, 200)
  })
})().then(result => console.log(result))

console.log('end')

// end
// .2초뒤, done
```

`.then`, `.catch`는 마이크로태스크 큐에 저장이 되었다가 콜스택이 비면 선입선출방식으로 실행이 된다.

이는, 위와같은 `Promise`객체에서 직접적으로 `return`을 통해 값을 전달받을 수 없다는 소리다.

> 실행되는 시간이 다르기때문이 아닐까

1. `promise`함수를 실행시키고, `setTimeout` `web Api`를 만나서 비동기에서 진행되도록 함. 그리고 콜스택에서 제거됨
2. `console.log('end')`가 콜스택에서 실행되고 빠짐
3. `.2`초의 시간이 흐르고 **매크로태스크**에 `resolve('done')` 작업을 비어있는 콜스택에 올림
4. `resolve('done')`을 비동기로 실행시키고 콜스택에서 제거.
   > `Promise` 생성자 자체가 비동기로 실행이 되는것이 아닌, `resolve`, `reject` 로 결과값을 전달 `.then`으로 수신하는 과정이 중요한것 같음
   > `Promise`내부에 `console`을 찍으면 콜스택에 올라간 그대로 실행되고 사라짐
5. `resolve('done')`이 비동기에서 완료되면, **마이크로태스크**에 `.then()`의 콜백 작업인 `console.log(result)`가 콜스택에 올라가고 실행되됨.

우리가 자주 사용하는 `fetch` 또한 `Promise`객체를 반환하는 `api`로 호출이 된다면 비동기로 작업이 수행된 다음, `.then`과 같은 메소드로 값을 확인할 수 있다.

## async, await

`async`, `await`는 기존의 `Promise`, `.then`방식의 문제를 해결하기 위해서 최신의 자바스크립트 시리즈인 `ES8`에서 나온 문법이다.

```js
;(async function promise() {
  return 'done'
})().then(result => console.log(result))
// done
```

위의 함수도 이전 `Promise`처럼 동일한 값을 반환한다.

이를 통해 알수 있는점은, `async`로 감싸진 함수는 `Promise`객체를 반환한다는것을 알 수 있다.

```js
function delay() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('done')
    }, 200)
  })
}

;(async function promise() {
  const result = await delay()
  console.log(result)
})()

// done
```

`await`을 사용하여 `delay`와 같이 `Promise` 객체를 반환하는 비동기작업이 수행될 경우, `await`이 `Promise`객체가 아닌 `resolve`된 값을 받을 때 까지 이후의 로직을 중단시킬 수 있다.

단순히 이렇게 보면 큰 차이를 못느낄 수 있겠지만,

비동기작업을 통해 받아오는 값을 사용하여 새롭게 비동기작업을 호출하는 등이 필요한 경우 `Promise`객체를 생성하는 함수가 무한히 중첩되어 흔히 말하는 **콜백지옥** 을 `async` `await`을 사용하면 마치 동기식으로 보이도록 해결할 수 있다.

> 물론, 가능하다면 체이닝으로도 해결가능하긴 함

```js
const data1 = await fetchData1()
const data2 = await fetchData2(data1)
...


fetchData1().then(data1 => {
  fetchData2(data1).then(data2 => {
    console.log(data2)
    ...
  })
})


// 체이닝
fetch(0)
  .then(data => fetch(data))
  .then(data => fetch(data))
  .then(data => fetch(data))
  .then(data => console.log(data));

```

## .then, await

`async`가 `Promise`의 어떤점을 대체하는지는 어렵지 않게 알 수 있다.

함수를 `Promise`객체가 반환되도록 해주는 점.

`.then`이 비동기로 실행되고 이후의 콜백함수가 마이크로태스크에 저장되는것을 `await`은 어떻게 대체하는것일까에 대한 고민을 해보았다.

```js
const async = useCallback(async () => {
  setLoading(true)
  try {
    const data = await fetchSomething()
    console.log('fetch done')
    setData(data)
    setLoading(false)
  } catch (e) {
    setError(error)
    setLoading(false)
  }
}, [])

useEffect(() => {
  async()
  console.log('useEffect done')
}, [async])
```

계속해서 생각을 해보고, 별도의 예제를 돌려보았을 때 나온 결과를 처음에 보았던 `React`에서의 `async` 로직을 통해 다시 정리해볼 생각이다.

1. `async()` 함수는 `Promise`객체를 반환하는 함수이기 때문에, 별도의 `return`값을 갖고있지 않는다.
2. `setLoading(true)`가 콜스택에서 호출되고, 상태값을 업데이트하는 요청을 비동기로 전달한 다음 소멸된다.
3. `const data = await fetchSomething()`에서 `fetchSomething()`의 비동기작업이 호출되고 `await`으로 감싸져있기 때문에, `resolve`된 값을 `await`이 수신할 때까지 이후의 로직은 중단됨.
4. `async()`가 콜스택에서 사라지고, `console.log('useEffect done')`이 실행되고 사라짐
5. 모든 작업이 완료되고 콜스택이 비어있기 때문에, 비동기로 전달된 `setLoading`의 상태값 업데이트 요청이 실행되고 `loading : true` 가 됨.
6. `fetch`를 통해 데이터를 받아오는 등 진행하는데 필요한시간이 지나고, `fetchSomething`이 `Promise.resolve`된 값을 반환하여 `await 또는 .then`이 감지를하고, 이후의 로직들이 마이크로태스크에 저장이 됨.
   > `await`이 `.then`을 대체하니 마이크로태스크 일 것이라고 생각됨
7. `setLoading` 요청을 마지막으로 콜스택이 비어있기 때문에, `await`이후의 로직들이 작동됨

이를 통해 `await`의 대체하는것을 `.then`으로 변경을 한번 해보자.

```js
const async = useCallback(() => {
  setLoading(true)
  fetchSomething()
    .then(data => {
      setData(data)
      setLoading(false)
    })
    .catch(e => {
      setError(error)
      setLoading(false)
    })
}, [])

useEffect(() => {
  async()
  console.log('useEffect done')
}, [async])
```

실제로 테스트 해보니 동일하게 작동되었다.

이를 통해 예상해 볼 수 있는 점

1. `await`으로 받는 결과값은 `.then(data)`의 `data`와 동일하다.
2. `await`구문 이후의 모든 로직들은 `.then(data => {로직})` 로직에 해당된다.

혼자서 테스트해본 코드이다.

```js
async function test() {
  console.log('test')
  ;(function() {
    return new Promise(res => {
      console.log('async 1 start')
      setTimeout(() => {
        res('async1')
      }, 150)
    })
  })().then(res => {
    console.log(res)
  })

  const val = await (function() {
    return new Promise(res => {
      console.log('async 2 start')
      res('async2')
    })
  })()

  console.log(val)

  setTimeout(() => {
    console.log('setTimeout1')
  }, 200)
  setTimeout(() => {
    console.log('setTimeout2')
  }, 100)

  console.log('something work')

  const val2 = await (async function() {
    console.log('async 3 start')
    return 'async3'
  })()

  console.log(val2)
  console.log('test end')
}

async function test2() {
  console.log('test2')
  const val = await (function() {
    return new Promise(res => {
      console.log('async 4 start')
      res('async4')
    })
  })()
  console.log(val)
  console.log('test2 end')
}

test()
test2()

console.log('end')

// test
// async 1 start
// async 2 start
// test2
// async 4 start
// end
// async2
// something work
// async 3 start
// async4
// test2 end
// async3
// test end
// setTimeout2
// async1
// setTimeout1
```

## 느낌

재미있었다.

뭔가 흐름에 대해 조금 더 가까워진 듯 한 느낌?
