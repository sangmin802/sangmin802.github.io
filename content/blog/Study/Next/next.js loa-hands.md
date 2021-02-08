---
title : "Next.js Loa-Hands"
date : 2021-02-03 00:00:00
category : "Study"
draft : false
tag : "Next.js"
--- 

<div style="text-align : center">
  <img src="/img/2021/02/03/1.PNG?raw=true" alt="1">
</div>

완료하였다.

이전까지는, `gh-pages`를 애용했지만 `Next.js`는 `Vercel`이 더 적합하다고 하여, 처음 사용해보았는데 `package.json`에 `Vercel`전용 명령어를 입력한다면, 해당 깃 리포지토리에 추가될때마다 자동으로 빌드되는것이 참 편한것 같다.

당연히 이전에도 발생했던 문제인 새로고침시 `404`는 이전에 해결했던 방법을 토대로 `Next.js`에 맞게 살 짝 수정하여 해결하였다. 애초에, `UserInfo`는 클라이언트사이드 라우팅을 사용하려했기때문에, 이 방법 밖에 없는듯..?

```ts
// 404.tsx
const Custom404 = () => {
  if(typeof window === 'undefined') return null;
  const l = window.location;
  let pathSegmentsToKeep = 0;
  l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
  l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
  l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
  (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
  l.hash)


  return <div>404입니다</div>;
}

export default Custom404;

// index.tsx
if(
  typeof window !== 'undefined' &&
  router.asPath !== '/'
){
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');

      router.push(decoded + l.hash)
    }
  }(window.location))
  return null;
}
```

그리고 일부분 수정하는 과정에서 여러개의 컴포넌트가 동시에 렌더링되며 발생한 에러가 있었는데

```ts
useEffect(() => {
  if(!userData){
    dispatch(Actions.getUserData_Thunk(name, router));
  }else{
    dispatch(Actions.loadingToggle(false));
  }
}, [name, userData])
```

이와 같은 방법으로 해결해주었다. 그냥 렌더링 자체에 순위를 주면 되었던 것..

`Next.js`는 필요에 따라 검색엔진에 노출시키고자 하는 페이지만 `SSR`방식을 사용하고 나머지는 기존 `CSR`방식을 유지시킬 수 있다는점이 참 매력적인것 같다.
> 앞으로 `React.js`만 사용하여 개발하는 일은 줄어들 듯..?

> 아 그리고, `Next.js`를 하면서, 왜 `React.js`는 프레임워크이지만 라이브러리이기도 하다고 하는지 느낀것 같다.