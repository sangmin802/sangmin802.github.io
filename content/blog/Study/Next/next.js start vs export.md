---
title : "Next.js start vs export"
date : 2021-02-15 00:00:00
category : "Study"
draft : false
tag : "Next.js"
--- 

`Next`로 배포를 할 때, 두가지 과정이 존재한다. `Next build` `Next export`

## Next build
`next start`나 `next export`라는 명령어를 실행시키기 위한 사전작업이기도 하며, 해당 명령어는 `.next`폴더를 생성한다.


## Next start
`Next.js`의 기본적인 `SSR` 페이지 생성 방식이다.

* [Automatic Static Optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)

`getStaticProps`, `getServerSideProps`등의 메소드를 특정 페이지에서 생성하고 사용했을 때, 서버사이드렌더링을 하여 먼저 정적생성을 하도록 한다.
> Loa-hands를 만들 때 사용했던 방법

`.next/server/pages`루트로 이동해보면, 정적생성이 되어있는 파일들을 확인해 볼 수 있다.

`Next export`와 다르게, 완전한 정적인 파일을 만든것이 아니라, `node.js`서버 자체는 유지시켜놓은 상태기이 때문에, 커스텀 서버를 만들어서 이용할 수 있다.
> 물론 위의 방법은 `Vercel`와 같은 `ServerLess`플랫폼을 통한 배포는 불가능하다

만약, 특정 라우트를 서버에 연결되는 API? 작업을 수행하고자 할 때, 이와같은 방법을 추천하며 해당 라우트는 `Next.js`의 기본 라우팅 방식에서 제외된다.
> 로그인 환경 구성이나, 서버에서 API를 불러오고자 할 때 사용할 듯 하다.

아래와 같은 HTTP 요청이 커스텀 서버로 갔을 때,
```html
<form action="/test_post" method="Post">
  <input type="text" name="testText"/>
  <input type="submit"/>
</form>
```

`test_post`의 요청에 한해서는 `Next.js`가 아닌 커스텀 서버의 처리를 하도록 함.

그외의 나머지들은 `*`은 `Next.js`의 라우팅 방식을 따르도록 함.


```ts
const express = require("express");
const next = require("next");
const server = express();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
// next 메소드의 인자로 받을수 있는 객체의 속성들은
//  dev : 개발모드에서 Next.js를 실행할지 여부. 기본값은 false
//  dir : Next.js 프로젝트의 위치. 기본값은 '.'
//  quiet : 서버정보가 포함된 오류메시지 출력 여부. 기본값은 false
//  conf : next.config.js와 동일한 객체. 기본값은 '{}'

const handle = app.getRequestHandler(); // Next.js의 기본 라우팅방식을 따르도록 함


server.use(express.json());
server.use(express.urlencoded({extended : false}));

app.prepare().then(() => {

  server.post("/test_post", (req, res) => {
    const text = req.body.testText;
    res.send(text)
  });

  // 위에 나열된 url이 아니면 모두 Next.js의 기본 라우팅을 따르도록 함
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("listening to 3000");
  });
});
```

* [Next.js custom Server - express](https://nextjs.org/docs/advanced-features/custom-server)

기본적으로 `Node.js`서버를 기반으로 작동되기 때문에 `Next.js`에서 제공하는 여러 `Data-fetching API`들을 사용할 수 있다

* [Next.js Data-fetching API](https://nextjs.org/docs/basic-features/data-fetching)

## Next export
* [Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export)

`next export`는 모든 페이지들을 정적인 `HTML files`들로 만들어서, 어떠한 호스트에서도 해당 서비스를 제공할 수 있으며, 별도의 `Node.js`서버또한 필요하지 않는다.

이러한 앱은 `dynamic routes`, `prefetching`, `preloading` 그리고 `dynamic imports`와 같은 `Next.js`의 대부분의 기능을 꾸준히 지원한다.

`create-react-app`과 매우 유사하지만, `pre-rendering`을 위해 전용 메소드를 사용하여 여전히 `build-time`에 정적생성을 할 수 있다는 차이점이 있음.

* [exportPathMap](https://nextjs.org/docs/api-reference/next.config.js/exportPathMap)

해당 기능은, 페이지들이 서버사이드에서 추가적인 데이터 요청을 할 필요가 없는 경우에 아주 유용하다. 물론, 클라이언트사이드에서 데이터 요청을 하는것은 상관없다.

## 참고
* [stackoverflow next build vs next export](https://stackoverflow.com/questions/61724368/what-is-the-difference-between-next-export-and-next-build-in-next-js)