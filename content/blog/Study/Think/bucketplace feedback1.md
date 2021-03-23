---
title: '버킷플레이스 피드백 분석1 - Coding Convention'
date: 2021-03-08 13:18:00
category: 'Study'
draft: false
tag: 'Think'
---

이번 과제를 통해 받은 피드백을 기반으로, 현재 집중하고 있는 프로젝트인 `Loa-Hands`도 검토해보고, 제출했던 과제도 전반적으로 수정해보려고 한다.

## 컨벤션이 일정하지 않고 안티패턴으로 네이밍 되어 있습니다.

개발자들간 협업간 원활한 유지보수와 **가독성**을 위해 암묵적으로 약속한 프로그래밍 스타일 협약`(Convention)` 이 있다고 한다.

정말 여러가지가 있지만, 내가 부족했던것들만 한번 다뤄보려고 한다.

## 코딩 컨벤션

### 소스파일

- 소스파일은 알파벳 **소문자**, 하이픈`(-)`, 밑줄`(_)` 로만 작성
  > 컴포넌트파일이나 각종 훅들을 종종 대문자로 시작하는 경우가 있었는데, 모두 수정해야겠다.. 사실상 이것도 일정하지않고 어떤건 소문자 어떤건 대문자 이러긴 했음..

### 중괄호 {}

- 모든 제어문에 있어서 하나의 구문만을 갖고 있어도 중괄호를 사용해야 한다.
  > 한줄은 생략해도 된다는 말도 있는걸 보면 좀 케바케인듯..?

#### 🤬Bad

```ts
if (true) doSomething()
```

#### 😍Good

```ts
if (true) {
  doSomething()
}
```

### 스위치문 들여쓰기

- 스위치문에 있어서, break와 다음 case사의의 공백은 선택이다.
  > 가독성을 위해서라면 한줄 띄어쓰는것이 좋은듯?

#### 😍Good

```ts
switch (animal) {
  case Animal.BANDERSNATCH:
    handleBandersnatch()
    break

  case Animal.JABBERWOCK:
    handleJabberwock()
    break

  default:
    throw new Error('Unknown animal')
}
```

### . 메소드체인

- 길어지는 메소드 체인을 작성할 경우 .을 기점으로 메소드마다 들여쓴다.
  > 근데 사실상 이 문제는, `.`의 위치가 잘못되면 어차피 에러발생이라 어느정도 수준까지의 체인이 적당한지가 관점일듯 함..

#### 😍Good

```ts
const leds = stage
  .selectAll('.led')
  .data(data)
  .enter()
  .append('svg:svg')
  .classed('led', true)
  .attr('width', (radius + margin) * 2)
  .append('svg:g')
  .attr('transform', `translate(${radius + margin},${radius + margin})`)
  .call(tron.led)
```

### 공백

- 한 줄이 **80자**를 넘기면 안된다.

  > 이것을 기준으로 위의 메소드체인도 컷팅하면 될 듯 하다.

- 각 구문사이는 줄 공백을 주는것이 좋다.

### 변수

- 한 줄에 하나의 변수를 선언한다.

#### 😍Good

```ts
const a = 1
const b = 3
```

- 지역 변수는 그 변수를 포함하는 블록 시작에서 선언하지 않고, 사용범위를 최소화 하기 위해 사용되는 지점과 가장 가까운 곳에서 선언한다.
  > 모든 변수는 상단에 위치해야 보기 편할거라 생각해왔었는데, 그것이 아니라 사용하는 부분 바로 전에 입력하는게 보기 좋다고 한다.. 아아...

#### 🤬Bad

```ts
function(hasName){
  const name = getName();

  if(!hasName){
    return false;
  }

  this.setFirstName(name);

  return true;
}
```

#### 😍Good

```ts
function(hasName){

  if(!hasName){
    return false;
  }

  const name = getName();

  this.setFirstName(name);

  return true;
}
```

### 주석

- 주석은 모두 특정 로직 위에(이전에) 작성한다. 절대로 같은 줄에 작성하지 않는다.

### 변수 그룹화

- 변수를 선언할 때, `const`를 먼저 묶고, `let`을 묶어준다.

#### 🤬Bad

```ts
let i
const items = getItems()
let dragonball
const goSportsTeam = true
let len
```

#### 😍Good

```ts
const goSportsTeam = true
const items = getItems()
let dragonball
let i
let length
```

### 객체

- 동적 속성명을 사용할 때에는, **계산된 속성명(Computed Property Name)**을 사용한다.
  > 객체에 있어서 속성은 어떠한 경우에도 이후 추가되는것이 아닌, 초기에 생성되어있어야 하는것 같음

#### 🤬Bad

```ts
function getKey(k) {
  return `a key named ${k}`
}

const obj = {
  id: 5,
  name: 'San Francisco',
}
obj[getKey('enabled')] = true
```

#### 😍Good

```ts
function getKey(k) {
  return `a key named ${k}`
}

const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
}
```

### 함수

- 변수와 함수는 사용하기 이전에 작성해준다.
  > 아니면 함수 선언식 사용?
- 함수 내부에서 파라미터를 조작하기 보단, 받는 단계에서 기본값을 사용한다.
  > 또한, 기본값을 갖고있는 파라미터를 뒤쪽으로 미뤄둔다.

#### 🤬Bad

```ts
function handleThings(opts) {
  opts = opts || {}
}

function handleThings(opts) {
  if (opts === void 0) {
    opts = {}
  }
}
```

#### 😍Good

```ts
function handleThings(opts = {}) {
  // ...
}
function handleThings(val, opts = {}) {
  // ...
}
```

- 사이드 이펙트가 발생할 수 있는 파라미터의 기본값 사용을 지양한다.

  > 사이드 이펙트 : 외부영역에 영향을 주는 것. 필요하다면 클로저 사용

  > 사이드 이펙트는 좀 더 다뤄볼 예정

#### 🤬Bad

```ts
var b = 1
function count(a = b++) {
  console.log(a)
}
count() // 1
count() // 2
count(3) // 3
count() // 3
```

## 네이밍 컨벤션

- 이름 맨 압이나 뒷쪽에 **밑줄(\_)**을 사용하지 않는다.
  > 헐..

#### 🤬Bad

```ts
this.__firstName__ = 'Panda'
this.firstName_ = 'Panda'
this._firstName = 'Panda'
```

#### 😍Good

```ts
this.firstName = 'Panda'
```

- `this` 는 변수의 값으로 사용하지 않으며, 필요하다면 화살표 함수로 작성한다.

- 가독성을 위해 축약문은 모두 대문자로 표기한다.

#### 🤬Bad

```ts
const HttpRequests = null
```

#### 😍Good

```ts
const HTTPRequests = null
```

- `export`되는 파일 내 모든 상수`(const)` 는 모두 대문자로 표기한다.

#### 🤬Bad

```ts
export const Test_Variable = null
```

#### 😍Good

```ts
export const TEST_VARIABLE = null
```

- 이름에 복수형을 사용하지 않는다. 또한, 줄임말을 사용하지 않는다.

#### 🤬Bad

```ts
let del_notes = ['one', 'two']
```

#### 😍Good

```ts
let delivery_note_list = ['one', 'two']
```

- `export`를 제외한 변수, 상수, 함수, 객체의 경우 `lowerCamelCase`로 표기한다

## 안티 패턴

습관적으로 많이 사용하지만, 성능, 디버깅 유지보수 가독성에 부정적인 영향을 주기 때문에 피해야 하는 패턴들이다.

### 배열에서 delete 사용하지 않기

객체에서는 상관없지만 배열의 경우 `delete`를 사용하더라도 `undefined`로 공간을 차지하고 있는 상태이기 때문에, `splice`메소드를 사용하는것이 좋다.

### 같은 DOM 엘리먼트를 반복해서 탐색하지 않기

`querySelector`와 같은 돔을 탐색할 때, 동일한 돔을 여러번 탐색하는것은 성능 저하를 유발하기 때문에 캐싱하는것이 좋다.

#### 🤬Bad

```ts
const className = document.getElementById('result').className
const clientHeight = document.getElementById('result').clientHeight
const scrollTop = document.getElementById('result').scrollTop
document.getElementById('result').blur()
```

#### 😍Good

```ts
const el = document.getElementById('result')
const { className, clientHeight, scrollTop } = el
el.blur()
```

### DOM 변경 최소화

`innerHTML`이나 `appendChild`메소드는 사용할 때마다 돔 변경이 발생한다. 돔 변경은 할 때마다 비용이 들기 때문에, 한번에 일괄 해주는것이 좋다.

#### 🤬Bad

```ts
myBookmarks.forEach(bookmark => {
  el.innerHTML += `<li><a href="${bookmark.url}">${bookmark.name}</a></li>`
})
```

#### 😍Good

```ts
const html = myBookmarks
  .map(bookmark => `<li><a href="${bookmark.url}">${bookmark.name}</a></li>`)
  .join('')

el.innerHTML = html
```

### 인라인 함수는 절대 사용하지 않는다.

바닐라 자바스크립트 뿐만 아니라 `React`와 같은 경우도 인라인으로 함수를 작성하는 것이 아닌, `useCallback`으로 메소드를 선언하고 그 메소드만 묶어준다.

## prettier

`VScode`의 `prettier`를 사용하면 세미콜론이나 디스트럭처링 내 띄어쓰기 등 작은 부분들은 저장할 때 일 괄 수정해주는 좋은 모듈? 이 있더라 !

### 참고

- [스타일 가이드 컨벤션 편](https://velog.io/@cada/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%BD%94%EB%94%A9-%EB%B0%8F-%EB%84%A4%EC%9D%B4%EB%B0%8D-%EC%BB%A8%EB%B2%A4%EC%85%98-1%ED%8E%B8)
- [안티패턴](https://ui.toast.com/fe-guide/ko_ANTI-PATTERN#settimeout-setinterval-%EC%82%AC%EC%9A%A9-%EC%8B%9C-%EC%BD%9C%EB%B0%B1-%ED%95%A8%EC%88%98%EB%8A%94-%EB%AC%B8%EC%9E%90%EC%97%B4%EB%A1%9C-%EC%A0%84%EB%8B%AC%ED%95%98%EC%A7%80-%EC%95%8A%EB%8A%94%EB%8B%A4)
