---
title : "Next.js Route"
date : 2021-01-28 00:00:00
category : "Study"
draft : false
tag : "Next.js"
--- 

Next.js는 기존 React.js와 다르게, 라우팅이라는 것을 별도의 모듈을 설치할 필요없이 기본적으로 제공한다.

더욱, 폴더의 구성을 통해 페이지 라우팅을 관리하더라
> `pages/users/[name].tsx` -> `/users/sangmin`
> `pages/users/index.tsx` -> `/users`

위처럼 당연하게도 동적 라우팅을 제공하기도 한다.

예제를 보던 중 다소 헷갈렸던 부분이 있었기때문에, 내 입맛대로 다시 정리해보려 한다.

```ts
export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on users
  const paths = sampleUserData.map((user) => ({
    params: { id: user.id.toString() },
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id
    const item = sampleUserData.find((data) => data.id === Number(id))
    // By returning { props: item }, the StaticPropsDetail component
    // will receive `item` as a prop at build time
    return { props: { item } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
```

1. `getStaticPaths` : 해당 동적라우팅이 생성?할 수 있는 모든 경우의 페이지들을 미리 파악하는것.
2. `getStaticProps` : 해당 라우팅 페이지를 정적생성하는데, 파일명에 있던 `[id]`를 갖고있는 하나의 데이터를 찾음.
3. 위의 두 메소드들은 해당 라우트를 `pre-rendering`하기 위함임. 당연히, 두개의 메소드가 존재하지 않아도 `id`변수를 `import Router from 'next/router`모듈을 통해 `query`를 확인할 수 있음
4. 3번을 해보면 이상한점이 생길것이다. 새로고침을 했을 경우, 첫 렌더링에 비어있는 `query`객체가 오기때문에 정상적인 페이지 구성이 안될텐데, 알아보니 `hydrate`메소드가 작동되기 전에는 `query` 객체라 비어있는상태라고 한다. `hydrate`이후, `query`에 변수가 담기는것을 확인할 수 있다.
> 클라이언트가 직접 요청하는 경우, `pre-rendering`이 필요하지 않은경우가 대부분이기때문에 아래의 1, 2번이 적합할 듯 함.


```ts
// 해결방법
// 1. 
Router.router?.query.id

// 2.
if(!id) return null;

// 위의 두 방법은 클라이언트사이드렌더링이기 때문에, network를 확인해보면 서버에서 받아오는 페이지가 아님

// 3. 정적생성이 아닌, 서버측 구성을 통해 서버에서 query를 파악하여 클라이언트에게 넘겨주도록 함.
//  3번은 해당 메소드 사용으로 서버사이드렌더링을 하게되기 때문에 network를 확인해보면 서버에서 받아오는 페이지임
//  따라서 서버에서 알고있는 path가 아니면 404를 반환함. 당연하게도
export const getServerSideProps = async({params} : any) => {
  const id = params.id;
  return {
    props : {id}
  }
}
```

5. `fallback : false` : 없는 값은 404페이지를 반환시킴.
6. `fallback : true` : 정적 생성을 하고자 하는 데이터가 너무 많은 경우(제품 판매 사이트 등) 초기 빌드시간이 오래걸린다. 따라서, 일부분의 데이터만 정적생성을 하고 이후 사용자가 정적생성을 하지 못한 데이터를 요청할 때, 커스텀 로딩화면을 보게되고, `getStaticProps`메소드가 실행된다고 함.

## 느낌
직접 사용해보며 여러 상황을 겪어봐야 좀 더 정확하게 알 수 있을것 같음