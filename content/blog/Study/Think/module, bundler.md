---
title: '모듈과 번들러'
date: 2020-07-06 00:00:02
category: 'Study'
draft: false
tag: 'Think'
---

> 21-11-29 업데이트

# 모듈화에대한 욕구

개발되는 앱에서 사용되는 스크립트의 양이 많아지고, 규모가 커지면서 사람들은 비슷한 역할을 코드들을 묶어서 관리하고, 재사용가능한 코드들을 필요한 상황에 가져와서(`import`) 혹은 내보내는등(`export`)을 통해 관리를 하고싶어하게 되었다.

즉, 규모있는 코드를 작은단위로 잘라내고 필요에 따라 가져와서 사용하고자하는 욕구가 생겼다.

그때무터 모듈이라는 개념이 생기고 위의 역할을 수행하게 되었다.

이렇게 생성된 모듈들은 특징이 있었는데,

## 독자적인 스코프를 사용함

이전 모듈이 아니였다면 스크립트 내에 생성된 변수들은 모두 전역변수로서 하나의 스코프를 공유해, 종종 중첩되는 문제가 발생하였다.

하지만 스크립트를 기능별로 혹은 어떠한 기준을 통해 모듈화를 하여 사용하면 그 모듈 내에서만의 독자적인 스코프를 갖게된다.

## 단 한번의 실행

만약 모듈 내에 실행이 되는 코드 혹은 변수, 상수 등이 선언되어있다면 여러곳에서 해당 모듈이 재사용 되더라도 단 한번만 생성이 된다.

> 하나의 변수를 여러 다른 모듈에서도 사용 가능하고, 공통적인 `key`를 바라본다.

거대해진 스크립트를 기준에 따라 구분하고, 필요에따라 가져와서 사용을 하는데에 더불어 독자적인 스코프를 사용하여 더욱 안전한 개발을 할 수 있게 되었다.

앱의 규모가 커지면서 위와 같은 문제가 발생을 하였지만, 개발자의 측면에서의 개선이 커보인다.

위와 같은 변화에 있어서 클라이언트 상에서도 문제가 있었는데, 스크립트 파일 등 하나의 웹페이지를 구성하는데 필요한 자원들의 갯수가 많아지면서 클라이언트에서 서버로 요청을 하는 횟수가 많아졌다.

즉, 사용자가 첫 화면을 보기위해 기다려야하는시간이 증가하게 되었다.

> 각각 브라우저바다 서버로 보낼수 있는 요청의 숫자가 다르고 심지어 제약도되어있기 때문에 이러한 문제는 크게 다가왔다.

그래서 앱의 규모가 커져도 사용하는 자원을 얻기위해 서버에 요청하는 횟수는 적은 상태로 유지하고자 하는 욕구가 생겼다.

사실 위와 같이 서버에 요청을 보내는것을 최소하하기 위한 방법으로는 적은 갯수의 스크립트 파일에 모든 내용을 담아서 요청을 하는것이다.

어찌보면 단순해보이지만, 당장 생각해보아도 유지보수를 하는데 큰 어려움이 있어보인다.

그렇다면 유지보수를 위해 기능별로 추상화한 모듈들을 사용하여도 서버로의 요청 횟수는 적게 유지하여 클라이언트상에서의 경험을 좋게할 수 있는 방법은 없을까?

# Bundle(r) - webpack

이전 코드들의 모듈화를 거치면서 스크립트들 어떠한 기준으로 작은 단위로 구분하게 되었는데

조금 더 확장하여서 스크립트 뿐만 아니라 `image`, `style`, `HTML`, `css` 모두를 하나의 모듈이라는 개념으로 약속을 하는 것이다.

1. 스크립트의 경우 기본적인 모듈의 특징처럼 독자적인 유효한 범위를 갖게된다.
2. 아래에 나오겠지만, 최신의 스크립트에 대해 아직 호환되지 않는 브라우저에 있어서, 이전 버전의 스크립트로 트랜스파일해주는 등의 여러 도움을 주는 모듈들을 함께 사용할 수 있다.
3. 2번과 유사해보이지만 `sass -> css`로 변환한다던지, 이미지를 압축한다던지등의 일을 수행해준다.
4. 큰 이유인 모듈화 된 자원들을 서로 연관된것들끼리 압축하여 서버로의 요청을 전달하는 횟수를 줄여준다.

## Bundler 종류

- ⭐Webpack⭐
- parcel
- browserify

### Webpack 설치

- `npm install --save-dev webpack webpack-cli`
- `webpack`의 기본 설정은 `js`나 `json`형식의 파일만 번들링 할 수 있다. 따라서, 필요에 따라 `rules` 속성에 `css`, `img` 등 적합한 `loader`를 사용하도록 설정해줘야 한다.
- [webpack 로더의 종류 검색](https://bogyum-uncle.tistory.com/111)
- `package.json`의 `scripts`에 간단한 명령어로 빌드를 실행 할 수 있도록 지정해준다
  > `"build": "webpack"`

### entry

- 번들링의 시작이 되는 js파일을 지정해준다.
- 필요에 따라, 여러개의 js파일을 지정해줄 수 있다.
- 시작이 되는 js파일내부에 이후의 js파일들이 모두 모듈화 되어 import로 연결되어있어햐 한다.
  > css파일 또한 마찬가지. React 기본 구조를 생각해보면 될 듯

### output

- 번들링이 완료되었을 때 저장되는 곳이다.

### 번들링 진행 과정

1. `webpack`이 실행이 되면, `entry`를 통해 기준이되는 파일을 분석함.
2. `output`의 경로를 통해 `build`된 파일을 저장함.
3. `html`파일의 `script`경로는 `build`된 파일로 하면 됨.

# Babel

- `ES`시리즈가 나올수록, 개발자들은 최신의 API들로 편하게 프로그래밍을 할 수 있게되었지만, `IE`와 같은 브라우저에서는 작동되지 않는 경우가 있다. 그런 경우를 위해, 최신 스크립트를 이전 버전의 스크립트로 컴파일하는 기능을 가지고 있다.
  > `IE`에 대한 지원이 하나 둘 끝나가고 있다. 하나도 안불쌍하고 잘가라. `Chrome`만세

## Babel 설치

- `npm install --save-dev @babel/core @babel/cli @babel/preset-env`
- `npm install --save-dev babel-loader`
- `npm install --save @babel/polyfill`
- preset의 옵션을 통해, 트랜스파일할 버전 및, 적용된 버전값들을 디버깅할 수 있다.

# 완성 예제

```javascript
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/js/index.js', // es5에 존재하지 않는 es6의 메서드나 생성자들도 지원토록함
  }, // build를 할때(분석할 때) 기준이 되는 경로
  output: {
    // build(분석)을 한 내용이 저장될 곳
    filename: './js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath : 'dist' // devserver로 확인하기 위함
  },

  // 여러개의 js파일이 생성되길 원할 때
  // entry : {
  //   main : './src/js/index.js',
  //   blog : './src/js/blog.js'
  // },
  // output : {
  //   filename : './js/[name].js',
  //   path : path.resolve(__dirname, 'dist'),
  // },

  module: {
    rules: [
      {
        // 최신의 ES스크립트를 지원가능한 버전으로 컴파일하는 babel
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 versions'],
                  },
                  debug: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        sideEffects: true,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
      template: './index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
      },
      hash: true,
      template: './menu.html',
      filename: 'menu.html',
      excludeChunks: ['index'], // MPA에서, 특정 html은 해당 js파일을 제외함.
    }),
    new MiniCssExtractPlugin({
      filename: './css/index.css',
    }),
  ],
}
```

## 참고

- [webpack 핸드북](https://joshua1988.github.io/webpack-guide/guide.html)
- [모듈](https://ko.javascript.info/modules-intro#ref-203)
