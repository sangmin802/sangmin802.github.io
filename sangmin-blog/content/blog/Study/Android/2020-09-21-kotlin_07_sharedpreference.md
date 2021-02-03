---
title : "Kotlin Shared Preferences"
date : 2020-09-21 00:00:06
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Shared Preferences
* 안드로이드는 서버 DB가 아닌 개인적으로 가지고 있는 간이 데이터베이스가 있다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 앱이 호출되었을 때, 저장되어있던 데이터 불러오기
        loadData()
    }

// ctrl+o를 통해 override가 가능한 메소드들을 볼 수 있다.
    // 앱이 종료되는 시점에 호출
    override fun onDestroy() {
        super.onDestroy()

        // 앱이 종료될 때, 데이터 저장
        saveData()
    }

    fun saveData() {
        val pref = getSharedPreferences("pref", 0)
        val edit = pref.edit() // 추가나 수정
        edit.putString("text", et_inputText.text.toString()) // 첫번째 인자는 키, 두번째 인자는 실제 저장되는 값
        edit.apply() // 저장 완료
    }

    fun loadData() {
        val pref = getSharedPreferences("pref", 0)
        et_inputText.setText(pref.getString("text", "")) // 첫번째 인자는 찾는 키, 찾는 키가 없다면 대체되는 값
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

    <EditText
        android:id="@+id/et_inputText"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:textColor="#000000"
        android:textStyle="bold"
        android:hint="입력하세요"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintWidth_percent="0.6" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

<!-- ### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav2.PNG?raw=true" alt="result2">
</div> -->


### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/SharedPreferences/app/src/main/res/drawable-v24/shared.PNG?raw=true" alt="result2">
</div>

## 참조
[홍스로이드 Kotlin Shared Preferences](https://www.youtube.com/watch?v=cyqgR8VTC1Y&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=7)