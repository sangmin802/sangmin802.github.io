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
`Next.js`의 기본적인 `SSR` 페이지 생성 방식이다.[Automatic Static Optimization](https://nextjs.org/docs/advanced-features/automatic-static-optimization)

`getStaticProps`, `getServerSideProps`등의 메소드를 특정 페이지에서 생성하고 사용했을 때, 서버사이드렌더링을 하여 먼저 정적생성을 하도록 한다.
> Loa-hands를 만들 때 사용했던 방법

`.next/server/pages`루트로 이동해보면, 정적생성이 되어있는 파일들을 확인해 볼 수 있다.

`Next export`와 다르게, 완전한 정적인 파일을 만든것이 아니라, `node.js`서버 자체는 유지시켜놓은 상태기이 때문에, 커스텀 서버를 만들어서 이용할 수 있다.
> 물론 위의 방법은 `Vercel`와 같은 `ServerLess`플랫폼을 통한 배포는 불가능하다

다만, 이와같이 별도로 커스텀 서버를 만들어서 사용하게 될 경우, `ServerLess` 및, `Next.js`의 장점인 `Automatic Static Optimization(정적 생성 기능)`등의 최적화를 제거한다고 함.


* [Next.js custom Server - express](https://nextjs.org/docs/advanced-features/custom-server)

기본적으로 `Node.js`서버를 기반으로 작동되기 때문에 `Next.js`에서 제공하는 여러 `Data-fetching API`들을 사용할 수 있다

* [Next.js Data-fetching API](https://nextjs.org/docs/basic-features/data-fetching)



## Next export
* [Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export)

`next export`는 모든 페이지들을 정적인 `HTML files`들로 만들어서, 어떠한 호스트에서도 해당 서비스를 제공할 수 있으며, 별도의 `Node.js`서버또한 필요하지 않는다.

이러한 앱은 `dynamic routes`, `prefetching`, `preloading` 그리고 `dynamic imports`와 같은 `Next.js`의 대부분의 기능을 꾸준히 지원한다.

`create-react-app`과 매우 유사하지만, [exportPathMap](https://nextjs.org/docs/api-reference/next.config.js/exportPathMap)메소드를 사용하여 여전히 `build-time`에 동적인 페이지를 생성할 수 있다.

해당 기능은, 페이지들이 서버사이드에서 추가적인 데이터 요청을 할 필요가 없는 경우에 아주 유용하다. 물론, 클라이언트사이드에서 데이터 요청을 하는것은 상관없다.
> 즉, 서버에서의 작업이 필요없는 앱인 경우 이런 방법을 추천하는 듯.  `cors`와 같은 문제를 `Access Header`로 해결하면서 `DB`와 같은 백엔드 서버를 별도로 관리하는경우?


## 참고
* [stackoverflow next build vs next export](https://stackoverflow.com/questions/61724368/what-is-the-difference-between-next-export-and-next-build-in-next-js)