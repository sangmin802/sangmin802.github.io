---
title: 'Functional Programming (===) or (!==) Function Component ?'
date: 2021-03-26 15:23:00
category: 'Study'
draft: false
tag: 'Think'
---

유튜브 구독해놓은 개발자 분께서, 함수형 프로그래밍이란 영상을 올리셨길래 보면서 겪었던? 일을 회상하며 정리해보려고 한다.

이전에 모 기업 면접을 보던 중 받았던 질문이 있다.

❝ 함수형 프로그래밍을 사용해보신 적 있나요? ❞

조금 고민을 하였지만,

❝ 아니요 ❞

라고 대답을 하였다.

고민을 했던 이유는 내가 `React` 에서 자주 사용하고있는 **함수형 컴포넌트**들이 과연 함수형 프로그래밍이 맞나 잠시 생각해보았지만, 잘 알지도 못하는 **함수형 프로그래밍**이 맞다고 확신하기는 아직 이르다 생각하여 대답에 부정하였다.

## React Component, Functional Programming

이전까지는 `React`를 사용할 때 `Class`를 기반으로한 컴포넌트를 계속 만들어왔는데, 고유의 속성값들(데이터)와, 내부에서 사용하는 메소드를 갖고있는 구조를 보았을 때 전형적인 **객체지향 프로그래밍** 이라는 느낌이였다.

그래서 종종, `React`에서 `React Hook`을 등장시키고, `function` 기반의 컴포넌트를 만들수 있게 되자, 이것이 **함수형 프로그래밍**이라는 글도 심심치않게 검색되는것 같았다.

하지만, 함수형 프로그래밍의 조건을 고려해보았을 때, 모든 `function` 기반의 컴포넌트들이 그 조건에 충족되는지는 잘... 모르겠다.

## 특징

### Pure Functions

말 그대로 순수함수이다. 함수에 동일한 인자를 넣었을 때 동일한 결과값을 반환하는 함수이다. 개인적으로 이 조건이 가장 걸렸던것 같다.

단순하게 `view`를 그려내는 컴포넌트 만큼은 받은 속성값으로만 작동되기 때문에, 어디에서든 재활용이 가능하여 함수형 프로그래밍이라고 할 수 도 있겠다는 생각은 들었다.

뭐 이런애들..?

```js
// loa-hands
export default ({ backSrc, src, grade }) => {
  return (
    <div className="imgWrap">
      {backSrc && (
        <img
          className={`imgWidth contentBoxBorder gradient${grade}`}
          src={backSrc}
          alt="partImg"
        />
      )}
      {src && (
        <img
          className={`equipMainImg absolute imgWidth gradient${grade}`}
          src={src}
          alt={src}
        />
      )}
    </div>
  )
}
```

하지만 `React Hook`을 사용하다보면, `useEffect`나 `useState`등의 각종 `Hook`들이 연결되어있는 `function`기반의 컴포넌트들이 존재한다.

이러한 `Hook`들은 변수로 보내지는것이 아닌, 외부의 자원을 이용하는데 이러한점 자체가 순수 함수에 위반되는 `Side Effect`가 아닌가 싶다..

> 사실상 여기에 쓰인 `new Date` 또한 `Side Effect`

```js
// loa-hands
const Index = () => {
  const { homeData, setHomeData } = HomeDataHook()

  DateOverHook(setHomeData)

  const today = new Date().getSeconds()
  const yoil = new Date().getDay()

  return (
    <section className="home">
      <EventSection events={homeData?.events} />
      <CalendarSection
        calendar={homeData?.calendar}
        today={today}
        yoil={yoil}
      />
      <TimerSection data={dailyIsland} today={today} text="오늘의 모험섬" />
      <TimerSection
        data={fieldBoss[yoil]}
        today={today}
        text="오늘의 필드보스"
      />
      <TimerSection
        data={chaosGate[yoil]}
        today={today}
        text="오늘의 카오스 게이트"
      />
      <TimerSection data={oceanCont[yoil]} today={today} text="오늘의 항해" />
    </section>
  )
}
```

### Stateless, Immuatability

상태 불변성이다. 상위 컴포넌트에게서 **물려 받은 / 변수로 받은** 속성들은 대부분 수정되지 않는 `const`의 특징을 띄고 있기 때문에, 변경시킬수 없다.

이 부분은 크게 문제될것 같지 않다.  
위의 두 특징을 잘 반영하고 있는 순수함수가 `.map` 과 `.filter` 라고 한다.

둘 다 받은 변수인 배열로만 작업을 하고, 새로운 배열을 반환하기 때문에 기존의 변수에는 아무런 영향을 끼치지 않기 때문이라고 한다.

> 자주 사용하는 메소드들인데 이번 기회로 뭔가 더 호감이 간다.

## 결론

함수형 프로그래밍을 이해하고, 잘 사용하기위해서는 정말 많은 이해와 시간이 필요하다고 한다.

당연하게도 아직도 함수형 프로그래밍에대한 이해는 많이 부족하다.

> 사실상 백지가 아닐까.. 라는 생각도

어쨌든 느낀점은

**`function` 기반의 컴포넌트를 사용하면 함수형 프로그래밍을 할 수 있다.**

**하지만**

**모든 `function` 기반의 컴포넌트가 함수형 프로그래밍을 기반으로 하여 만들어졌다고 하기는 어려울것 같다.**


## 이에 대해 React repo 에 등록된 한가지 이슈
- [React 공식홈페이지 명칭변경](https://github.com/reactjs/reactjs.org/pull/863)
위와 같은 고민, 이슈가 논란되자 `React`에서는 공식문서에 이전의 표기방식이였던 `함수형 컴포넌트` 에서 `함수 컴포넌트`로 변경하게 되었다는 이야기