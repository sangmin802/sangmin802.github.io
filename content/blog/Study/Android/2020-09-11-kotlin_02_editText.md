---
title : "Kotlin EditText & Button"
date : 2020-09-11 00:00:01
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Edit Text & Button
* Edit Text 디자인탭에서는 Plain Text라고 나와있다.
> 프론트단에서 input태그와 같은역할인듯하다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 버튼 클릭시, Edit Text에 입력된 값을 가져와서 Text에 적용시켜줄거임
        btn_getText.setOnClickListener{
            // Edit Text에 입력된 값을 문자열로 가져와주세요.
            val resultText = et_id.text.toString()
            // 가져온 값을 적용시켜주세요.
            tv_result.setText(resultText)
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
        android:id="@+id/tv_result"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="텍스트"
        android:textSize="40dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <EditText
        android:id="@+id/et_id"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:ems="10"
        android:hint="아이디를 입력하세요." // placeholder와 비슷한느낌
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.497"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_result" />

    <Button
        android:id="@+id/btn_getText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:text="텍스트 가져오기"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/et_id" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/EditTextButton/app/src/main/res/drawable/edittext.PNG?raw=true" alt="result">
</div>

## 참조
[홍스로이드 Kotlin EditText, Button](https://www.youtube.com/watch?v=J-PsYQlgPWw&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=2)