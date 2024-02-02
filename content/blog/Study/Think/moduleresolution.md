---
title: 'Typescript 모듈추론방식'
date: 2023-05-01
category: 'Study'
draft: false
tag: 'Think'
---

typescript의 모듈추론방식에 대해 의문이 생겨 정리해보고자 함

# moduleResolution Node vs NodeNext vs Bundler

## moduleResolution node16(nodeNext) / node 비교 유튜브

- [moduleResolution 값에 따른 차이 youtube](https://www.youtube.com/watch?v=MEl2R7mEAP8)
- [이건그냥.. 누가 Node, classic 구분해놓은건데 참고만](https://it-eldorado.tistory.com/124)
- [tsconfig moduleResoltion](https://www.typescriptlang.org/tsconfig#moduleResolution)

타입스크립트를 사용할 때, import를 한다는 것은 개발을 위해 모듈을 불러옴도 맞지만 타입스크립트 자체로서는 import 해오는 모듈이 어떤 타입인지를 알기위함도 있다고 함 (런타임혹은 번들링때가 아님)

타입스크립트가 import해오는 모듈에 대한 타입을 추적하기 위해 아래와 같은 전략들을 씀

참고로, baseurl이 작성된 (이후의 Path 정의 포함) 얘들은 비상대경로로 치는듯 함

classic은 제외하였음

## Node (Node10)

아마 가장 많이사용되고있었던 방식. Node 11 이하의 버전의 commonJs의 모듈방식만을 사용하던 노드 기반에서 유용

일반적으로 대부분의 번들러와 호환이 잘 됨

### 상대경로(아래는 순서가 아님 그냥 이 방식으로 다 한다는 뜻)

- .ts, .tsx, .d.ts로 끝나는 파일들을 이 순서대로 찾음
- package.json에서 types 또는 typing 필드를 찾음
- 폴더에서 index.ts, index.tsx, index.d.ts 파일을 찾음

### 비상대경로

- .ts, .tsx, .d.ts 세가지중 하나를 찾을때까지 자신, 부모, 조상의 nodeModules를 탐색함

## NodeNext (Node16과 동일)

Module 필드또한 동일한 값 매칭 됨

여기서부터 commonJS뿐 아니라, ESM(es 모듈방식)이 지원됨 CJS, ESM의 가능성을 모두 열어놓은 값이기 때문에, 두가지 모두 호환 가능한 방식으로 개발이 되어야 함(엄격함)

Package.json의 exports 필드를 이해할 수 있게 됨

아래 경로에 대한 변경점들은 Pakcage.json type또한 모듈로 프로젝트 내부의 파일들이 ESM모듈로더를 사용할 경우인것 같음(혹은 esm기준의 파일?)

### 상대경로

Import 할 때 컴파일되는 파일의 확장자가 필수로 입력되어야 함. ts가 아닌 최종컴파일되어 반환되는 파일의 확장자가 작성되어야 함. 즉, .js

- 타입스크립트가 자바스크립트로 컴파일해줄 때, import되는 경로(지정자)를 바꿔주지는 않음. 그렇기 때문에, Node가 문제없이 이해할수 있도록, 확장자까지 명확하게 써줘야 한다는것 같음.
  > 맞긴 함.. 컴파일할 때 안바꿔줌 path도.. 그래서 bundler에 함께 명시해주어서 따로 꼭 잡아줘야 하긴 하지. 깡 node 프로젝트를 할 때, 패키지 타입이 module로 esm모듈로더를 사용한다고 하면 확장자를 입력해주는게 필수이기도 하고...
- 실제로 단순 노드기반에서 esm 방식은 확장자가 명시되어야 잘 받아오고, cjs방식은 확장자가 없어도 잘 받아옴(만약에라도의 번들러의 도움은 제외함) 더이상 Index.js라는 파일에 대한 특별한 처리를 제공하지 않음
- 위에서 상대경로 작성 시, 확장자가 필수로 입력되어야 함이 정의 되면퍼 폴더이름을 기준으로 index 파일을 자동으로 확인할 수 있는 방법이 없다고 함
  > ??/index.js 라는 디렉토리를 찾을수 없는것이겠지..?

### 절대경로

package.json의 exports필드를 이해할 수 있게 되면서, 그 필드 기준으로 내보내진것들만 찾을 수 있음.

## Bundler

- [Typescript 5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

- 'bundler' for use with bundlers. Like node16 and nodenext, this mode supports package.json "imports" and "exports", but unlike the Node.js resolution modes, bundler never requires file extensions on relative paths in imports.
- 위 설명 그대로 아래가 문제없이 잘 잡힘
- 얘는 아무것도 컴파일 안해줌(타입스크립트 -> 자바스크립트는 당연히 해주고) 우리가 사용하는 번들에게 모든것을 위임하여 완화된 값임. 그래서 vite cli에서는 Bundler를 사용하고있음

* 외부 패키지의 Exports 필드 잘 잡음
* 절대경로에서 확장자를 사용할 필요 없음
* 단, 타입스크립트 5 이상

## 토이프로젝트와 함께 케이스 정리

- 어떠한 도구의 도움 없이(번들러 등등) 순수 ESM은 깡 node 환경에서 구성을 해도 import 경로에 확장자가 필수로 입력되어야 하지만 CJS는 아님
- [node 16/dynamic](https://github.com/IanVS/ts-module-resolution-examples/tree/main/moduleResolution/Node16/2-export-map#example2-dynamic)

  - This time, since typescript always treats dynamic imports as ESM. 즉 nodeNext의 경우 dynamic import는 무조건 ESM 기준으로 resolve 함.
  - `package.json type = CJS, moduleResolution=nodeNext`로 tracing 했을 때 dynamic import 대한 resolve 기준만 Esm임. 나머지 정적import는 모두 CJS기준으로 나옴.
  <div style="margin : 0 auto; text-align : center">
    <img src="/img/2023/05/01/module-trace-always-esm.png?raw=true" alt="module-trace-always-esm">
  </div>

  - `package.json type = module(ESM), moduleResolution=nodeNext`로 돌리면, 정적임포트던 dynamic import던 모두 esm으로 나옴. 그래서 resolving 할 때 ESM 기준으로 돌기 때문에, 온전히 찾기 위해 확장자가필수적으로 작성되어야 했던 것.
  - `moduleResolution=Node`로 tracing하면 패키지 타입이 CJS던 ESM이던 저 Resolving 기준이 없음. 당연히 moduleResolve기준이 CJS로 돌려서인것 같고, CJS는 확장자 필요 없으니 문제 x
  - 하지만 가능한 방법이 있음. 만약, 동일 조건에서 dynamic import 해오는 애들이 다른 패키지에서 exports 필드에 명시된 상태로 비상대경로로 받아오는것이라면 문제없는것 같음. 왜냐 NodeNext부터 exports필드를 읽을 수 있고, 그곳에서 내보내지고 있음을 확인하였기 때문. 패키지 자체에서 컴파일하여 사용토록 하고, exports 필드에 타입을 명시해주면 되긴 하는듯￼
  <div style="margin : 0 auto; text-align : center">
    <img src="/img/2023/05/01/nodenext-dynamic-exports.png?raw=true" alt="nodenext-dynamic-exports">
  </div>

- 이사람들은 타입스크립트만을 사용한다는 기준으로 개발을 했을것임(모듈로더 관련 확장자 등등에 대한 어떤 툴의 도움도 고려 x로 esm 기반의 프로젝트에서도 node환경에서 잘 돌아가야 했음)
- 파일의 확장자에 모듈로더방식이 명시되어있는게 아니면 moduleResolution nodeNext(현재 node16동일)부터 package.json의 type을 보고 각 모듈들이 어떠한 방식으로 import 하는 모듈들을 찾을 지 결정한다 함.
  - [how to find other modules which that file imports](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7-beta/#type-in-package-json-and-new-extensions)

## nodeNext이면 왜 Js 확장자를 써줘야 함?

- [Matt pocock](https://www.totaltypescript.com/relative-import-paths-need-explicit-file-extensions-in-ecmascript-imports)

This tells TypeScript that you want your imports and exports to conform strictly to the Node spec.

해당속성은, 타입스크립트에게 들이기, 내보내기 규칙에 온전히 Node 기준을 따르라는 명시

- 그래서 위의 차이처럼 node의 type이 cjs냐, esm이냐에 따라 다르게 돌아갔던 것
- 위에서 명시해준 대로, 노드 esm 모듈로더를 쓰는 패키지는 cjs와 다르게 순수 노드에서는 js확장자가 필수입력값임 /foo 를 했을 때, /foo/index 인지 /foo.js 인지 알기 어려워서. 사실 이런것들의 차이를 구분하고, 이해하는것들은 번들러들의 역할이지 타입스크립트나 노드는 이해하고싶지 않다는것 같음

## 추가

- [moduelResolution node16 확장자 논란(?)](https://github.com/microsoft/TypeScript/issues/49083)

이전과는 다르게 앞으로는 확장자 그것도 컴파일 이후의 Js 확장자를 써줘야 함이 개발자들사이에서 낯설다(?)라는 의문을 많이 남긴듯 함.

esm이 지원됨으로 변경되면서 esm 모듈로더 기반 패키지에서는 확장자가 필요한 상황이 되었는데 아마 타입스크립트 자체만으로서는 다른 번들러와 같은 툴들의 도움을 온전히 배제하고 본인만으로 모두 가능해야하기때문에, 낯설긴 하지만 이게 올바른 방향이라고 생각되긴 함..

그래서 5버전에 bundler라는 값이 나왔고, 위와같이 엄격한 검사를 더이상 타입스크립트가 하지 않고 번들러에게 넘긴다는 개념.

## 참고

- [nodeNext](https://stackoverflow.com/questions/71463698/why-we-need-nodenext-typescript-compiler-option-when-we-have-esnext)
