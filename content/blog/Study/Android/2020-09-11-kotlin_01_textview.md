---
title : "Kotlin TextView"
date : 2020-09-11 00:00:00
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 


## Kotlin 기본구성

<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/HongTextView/app/src/main/res/drawable/textview1.PNG?raw=true" alt="img1">
</div>

* 기본적으로 xml파일 하나, kt파일 하나가 하나의 화면을 구성한다.
* xml은 정적인 파일이다.
> 프론트단에서 HTML, CSS와 같은 기능 인 듯 하다.
* kt파일은 동적인 파일이다.
> 프론트단에서 JavaScript의 영역 인 듯 하다.

<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/HongTextView/app/src/main/res/drawable/textview2.PNG?raw=true" alt="img2">
</div>

* xml파일의 우측 상단을 보면 위와같은 탭들을 볼 수 있는데, 해당 탭을 통해 현재 보여지는화면, 혹은 현재 코드상태를 볼 수 있다.
* 코드에서 직접 수정도 가능하지만

<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/HongTextView/app/src/main/res/drawable/textview3.PNG?raw=true" alt="img3">
</div>

* 디자인화면에서 스타일이나, 새로운 태그를 넣는것도 가능하다.

<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/HongTextView/app/src/main/res/drawable/textview4.PNG?raw=true" alt="img4">
</div>

* 상단의 애뮬레이터를 통해 가상의 앱을 구동시켜볼 수 있다.

<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/HongTextView/app/src/main/res/drawable/textview5.PNG?raw=true" alt="img5">
</div>

## TextView
* 일반적으로 텍스트부분을 나타내는 태그? 인것같다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // onCreate는 앱이 최초로 실행되었을 때 수행되는것!
        super.onCreate(savedInstanceState)
        // R은 res(Resources)폴더를 의미한다.
        // res폴더의 layout폴더의 activity_main파일을 연결한다!
        setContentView(R.layout.activity_main)

        // 위에서 xml파일을 연결했기 때문에, 선언한 id값을 호출할 수 있다.
        tv_title.setText("LostArk\nseason2")
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
    <TextView
        android:id="@+id/tv_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="LostArk"
        android:textColor="#000000"
        android:textSize="30sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```


## 참조
[홍스로이드 Kotlin TextView](https://www.youtube.com/watch?v=IaXhn_I_ziY&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=1)