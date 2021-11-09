---
title: 'Webpack & Babel'
date: 2020-07-06 00:00:02
category: 'Study'
draft: false
tag: 'Think'
---

# Bundle(r)

- 웹앱을 구성하는 자원들이 많아질수록 서버에 요청 횟수가 많아져 속도가 느려진다.
- 같은 타입의 자원들끼리 묶어서 구성을 하게될 경우, 효율적으로 서버에 요청얼 하게되어 속도가 빨라지게된다.

## Bundler 종류

- ⭐Webpack⭐
- parcel
- browserify

## Webpack

- 자바스크립트 정적 모듈 번들러로, 모든것이 모듈화되어있다.
  > React나 Vue, Angular등 import export를 사용할 수 있는것은, 모듈들이 서로 의존관계에 있기 때문이다.

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
- preset의 옵션을 통해, 컴파일할 버전 및, 적용된 버전값들을 디버깅할 수 있다.

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
