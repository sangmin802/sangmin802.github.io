---
title : "Kotlin intent"
date : 2020-09-14 00:00:00
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Intent
* activity와 activiy간 화면이동 및 정보전달은 intent객체를 사용하면 된다.

### MainActivity
```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btn_a.setOnClickListener {
            // 다음 화면으로 이동하기 위해 intent 객체 생성.
            val intent = Intent(this, SubActivity::class.java)
            // 보내지는 intent객체에 같이보낼 변수 담기.
            // intent.putExtra("msg", tv_sendMsg.text.toString())

            // 혹은, Fragment와 Activity 동일하게 bundleOf메소드를 이용하면 더 편리하다.
            val bundle = bundleOf("msg" to tv_sendMsg.text.toString(), "num" to 1)
            intent.putExtras(bundle)
            startActivity(intent) // intent객체에 담긴 activity로 이동한다.

            finish() // 현재의 activity를 파괴한다.
            // 뒤로가기누르면 아예 앱이 꺼짐
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

    <TextView
        android:id="@+id/tv_sendMsg"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <Button
        android:id="@+id/btn_a"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:text="서브로 이동"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_sendMsg" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/intent/app/src/main/res/drawable-v24/intent1.PNG?raw=true" alt="result1">
</div>

### SubActivity
```javascript
// SubActivity.kt
class SubActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sub)

        // intent객체에 msg, num 속성이 있다면 진행
        if(intent.hasExtra("msg") && intent.hasExtra("num")){
            tv_getMsg.text = intent.getStringExtra("msg")
            tv_getNum.text = intent.getIntExtra("num", 700).toString()
        }
    }
}
// activity_sub.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".SubActivity">

    <TextView
        android:id="@+id/tv_getMsg"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="서브화면"
        android:textSize="36dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv_getNum"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="100"
        android:textSize="36dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_getMsg"
        app:layout_constraintVertical_bias="0.109" />
</androidx.constraintlayout.widget.ConstraintLayout>
```
### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/intent/app/src/main/res/drawable-v24/intent2.PNG?raw=true" alt="result2">
</div>

## 참조
[홍스로이드 Kotlin intent](https://www.youtube.com/watch?v=oXIeBhV06-Y&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=3)