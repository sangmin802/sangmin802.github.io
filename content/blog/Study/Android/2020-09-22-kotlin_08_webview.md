---
title : "Kotlin WebView"
date : 2020-09-22 00:00:07
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## WebView
* 반응형 환경이 구현된 웹 어플리케이션이라면 해당 기능을 통해 간단하게 안드로이드 앱으로 만들 수 있다.

```javascript
// Manifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.webview">

    <uses-permission android:name="android.permission.INTERNET" /> 인터넷 접근 권한

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true" // 안드로이드 9.0업데이트 이후, HTTP통신이나 WebView를 할 때 해당 속성을 application 안에 넣어줘야 정상적으로 작동된다.
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>

// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 웹뷰 셋팅
        // 자바스크립트 기능 허용
        wv_webView.settings.javaScriptEnabled = true
        // 아래 두줄이 없다면 새로운 창을 띄워버림
        wv_webView.webViewClient = WebViewClient()
        wv_webView.webChromeClient = WebChromeClient()

        // 웹뷰 연결
        wv_webView.loadUrl("https://sangmin802.github.io/haemulhansang/#/")
        // Tip!
        // mainifests의 thema에서 noactionbar를 통해, 상단 바를 지울 수 있다.
    }

    override fun onBackPressed() {
        if(wv_webView.canGoBack()) { // 웹사이트에서 뒤로갈 페이지가 존재한다면
            wv_webView.goBack()
        }else{
            super.onBackPressed()
        }
    }
}

// activity_main.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/wv_webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

<!-- ### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav2.PNG?raw=true" alt="result2">
</div> -->


### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/WebView/app/src/main/res/drawable-v24/webview.PNG?raw=true" alt="result1">
</div>

## 참조
[홍스로이드 Kotlin WebView](https://www.youtube.com/watch?v=z0ha16-oz7I&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=8)