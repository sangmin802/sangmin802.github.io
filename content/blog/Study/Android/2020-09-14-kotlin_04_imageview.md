---
title : "Kotlin ImageView & Toast"
date : 2020-09-14 00:00:03
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## ImageView & Toast
* ImageView를 통해, 자신이 갖고있는 이미지를 보여주거나, 외부 라이브러리를 통해 해당 url의 이미지를 보여줄 수 있다.
* Toast를 통해 하단에서 올라오는 알림글을 설정할 수 있다.
> alert과 비슷한기능? 단 하단에서 올라오고 시간 조절도 가능

### URL을 통한 이미지
1. `build.gradle`의 `dependencies`에 아래 두개의 링크를 적는다
  * `implementation 'com.github.bumptech.glide:glide:4.11.0'`
  * `annotationProcessor 'com.github.bumptech.glide:compiler:4.11.0'`
2. `manifests`파일에 추가하여 인터넷 url에 접근할 수 있도록 한다.
  * `<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>`
  * `<uses-permission android:name="android.permission.INTERNET" />`

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val url = "https://scontent-gmp1-1.xx.fbcdn.net/v/t1.0-9/117331960_4247747288629673_9203310391566836283_n.jpg?_nc_cat=100&_nc_sid=6e5ad9&_nc_ohc=H1GByJl8wwEAX8FlKmt&_nc_ht=scontent-gmp1-1.xx&oh=fa43c6789b445fde7275304896182b26&oe=5F82C4BF"
        // Glide를 통해 해당 아이디의 imageView 주소를 url로 설정
        Glide.with(this).load(url).into(iv_loastArk)

        btn_toast.setOnClickListener {
            // 첫번째 인자는 현재 액티비티. 두번째인자는 출력되는 글, 세번째는 유지시간
            Toast.makeText(this@MainActivity, "Android with Kotlin", Toast.LENGTH_SHORT).show()

            //  토스트 버튼 클릭시 이미지 변경
            //  조건문을 활용하여 Toggle로 살짝 응용해보았다.
            //  res 디렉토리의 drawble 디렉토리의 android2
            when(iv_android.getTag()){
                "0" -> {
                    iv_android.setTag("1")
                    iv_android.setImageResource(R.drawable.android)
                }
                "1" -> {
                    iv_android.setTag("0")
                    iv_android.setImageResource(R.drawable.android2)
                }
            }
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

    <ImageView
        android:id="@+id/iv_loastArk"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.497"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        tools:srcCompat="@tools:sample/avatars" />

    <ImageView
        android:id="@+id/iv_android"
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:tag="1"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.497"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_bias="0.499"
        app:srcCompat="@drawable/android" />

    <Button
        android:id="@+id/btn_toast"
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:layout_marginTop="20dp"
        android:background="@drawable/btn"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/iv_android" />

</androidx.constraintlayout.widget.ConstraintLayout>
```
### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/imageView/app/src/main/res/drawable-v24/imgview1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/imageView/app/src/main/res/drawable-v24/imgview2.PNG?raw=true" alt="result2">
</div>

## 참조
[홍스로이드 Kotlin ImageView & Toast](https://www.youtube.com/watch?v=fmiwEfFrjsM&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=4)