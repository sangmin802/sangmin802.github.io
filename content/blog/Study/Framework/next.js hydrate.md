---
title : "Next.js Pre-rendering"
date : 2021-01-26 00:00:00
category : "Study"
draft : false
tag : "Next.js"
--- 

예전에 CSR과 SSR을 비교해보면서 React도 SSR이 가능하도록 할 수 있는지 알아보는 과정에 hydrate메소드를 발견했었다.

그리고, Next.js를 학습하던 도중, 해당 용어를 다시 만나게 되었다.

> Before we talk about data fetching, let’s talk about one of the most important concepts in Next.js: Pre-rendering.

> By default, Next.js pre-renders every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Pre-rendering can result in better performance and SEO.

> Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. (This process is called **hydration**.)

Next.js는 Pre-rendering 기능을 통해 각각의 페이지들의 돔을 미리 구성하기 때문에, 검색엔진에 최적화되어있으며 해당 페이지가 클라이언트사이드에서 실행되었을 때, 스크립트 코드가 읽히며 상호작용이 가능해진다는 점이다.

예전에 봤던 hydrate메소드의 역활과 동일하다.

## Pre-rendering
Next.js의 가장 큰 특징이 Pre-rendering을 한다는 점이다.


* Next.js / Pre-rendering
<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/pre-rendering.png" alt="prerender">
</div>

* React.js / No Pre-rendering
<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/no-pre-rendering.png" alt="prerender">
</div>

## Static Generation vs Server-side Rendering
* 정적 생성
  * Pre-rendering 메소드가 빌드가 될 때 HTML을 구성한다. 이후, 각 요청에는 생성됬던 HTML들이 재사용된다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/static-generation.png" alt="static generation">
</div>

* 서버측 렌더링
  * 요청이 있을때마다 HTML을 구성한다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/server-side-rendering.png" alt="server-side rendering">
</div>


## 선택적 Pre-rendering
Next.js의 중요한 점은 각각의 페이지들이 어떤 Pre-rendering방식을 사용할 것인지 선택할 수 있다는 점이다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/per-page-basis.png" alt="Per-page Basis">
</div>

## 두개의 Pre-rendering 어떤 상황에 사용?
`사용자의 요청이 없어도 페이지를 렌더링 할 수 있습니까?`라고 자문했을 때, `네` 라면 정적 생성, `아니오` 라면 서버측 렌더링을 사용해야한다.

## Static Generation - getStaticProps
대부분의 웹앱은 첫 페이지에서 데이터를 가공하여 보여주는경우가 많다.

이런 경우에도 정적생성이 적합하다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/static-generation-with-data.png" alt="static generation with data">
</div>

페이지 컴포넌트를 내보낼 때, `getStaticProps` 메소드를 반환하는 `async`비동기 함수를 함께 내보낼 수 있다.

* `getStaticProps`메소드는 빌드될 때 실행이 되며
* 함수 내부에서 http작업을 통해 데이터를 받아오고 해당 페이지의 속성으로 보내준다.

```ts
export default function Home(props) { ... }

export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  const data = ...

  // The value of the `props` key will be
  //  passed to the `Home` component
  return {
    props: ...
  }
}
```


해당 메소드를 사용하여, 외부 Fetch등의 메소드로 외부 API도 가져올 수 있다.

```ts
export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch('..')
  return res.json()
}
```

해당메소드로 외부 API를 가져오는 작업을 수행해보았는데, 기존에 연결해놓은 프록시서버가 없어도 잘 작동된다.

아마 서버측에서 작동되는 `getStaticProps`메소드이기 때문에, 해당 서버가 프록시서버 역활을 하는게 아닌가 싶다.

### someDatabaseSDK 
심지어 바로 DB쿼리를 입력할 수도 있다고 함..

```ts
import someDatabaseSDK from 'someDatabaseSDK'

const databaseClient = someDatabaseSDK.createClient(...)

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
```

이와같이 사용할 수 있는 이유는, `getStaticProps`가 서버측에서 실행되기 떄문이라고 한다.

배포할 때에는 빌드될 때만 실행되기 때문에, 사용자의 요청일 경우(즉, 쿼리변수나 헤더가 있는 http요청)에는 사용하지 않는것이 좋다
> 위의 경우에는 정적생성이 아닌 서버측 렌더링을 사용하는것

## Server-side Rendering
사용자의 요청이 있어서 쿼리 변수등이 있고, 요청에 따라 각기 다른 새로운 데이터를 받아와야 한다면 서버측 렌더링을 사용해야한다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/server-side-rendering-with-data.png" alt="server-side-rendering-with-data">
</div>

## Server-side Rendering - getServerSideProps
정적생성에는 `getStaticProps`메소드를 사용했다면, 서버측 렌더링에는 `getServerSideProps`메소드를 사용한다.

```ts
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    }
  }
}
```

해당 메소드는 요청할 때, 실행이 되며 `context`는 `params`, `req`, `res`, `qauery`등의 속성들을 갖고있는 변수이다.

또한, 매 요청마다 서버측에서 작업을 하기 때문에, 정적생성보다 비교적 느리며 캐싱되지 않는다.

## Client-side Rendering
만약, 페이지를 보여주는데 데이터를 꼭 받아올 필요가 없다면, React.js의 방식처럼 클라이언트단에서 데이터를 받아오게 할 수 있다.

<div style="margin : 0 auto; text-align : center">
  <img src="https://nextjs.org/static/images/learn/data-fetching/client-side-rendering.png" alt="Client-side Rendering">
</div>

생각해보면, 모든 페이지가 검색엔진에 노출될 필요가 없이 첫 화면만 노출이 필요하다면, index페이지만 정적생성을 통해 Pre-rendering을 하고, 이후는 클라이언트단 렌더링을 사용해도 될 것 같다.
> 아직 프로젝트에 적용해보지 않아 헛소리일 수도 있지만, 정말 Next.js에서 말한대로 `Server-side Rendering`을 사용하는일은 거의 없을것 같은데..?

## SWR
데이터를 클라이언트단에서 가져와도 된다면, Next.js에서는 SWR이라는 기능을 제공한다.

React Hook의 일종으로 클라이언트측에서 데이터를 받아올 때 캐싱, 재검증등을 제공하는 기능을 갖고 있다.

```ts
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```


## 참고
* [서버측 렌더링 vs 정적 생성 사용상황 예제](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation)
* [Next.js Pre-rendering](https://nextjs.org/learn/basics/data-fetching)