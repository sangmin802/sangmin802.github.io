---
title : "Kotlin Fragment"
date : 2020-09-25 00:00:10
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Fragment
* Activity간 화면 전환이 아닌, 부품만 교체하여 화면을 구성할 수 있다.
> 프론트엔드 프레임워크에서 컴포넌트와 비슷한 기능 같다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setFrag(0)

        btn_fragment1.setOnClickListener {
            setFrag(0)
        }
        btn_fragment2.setOnClickListener {
            setFrag(1)
        }
        btn_fragment3.setOnClickListener {
            setFrag(2)
        }
    }

    private fun setFrag(fragNum : Int) {
        // Fragment 연결
        val ft = supportFragmentManager.beginTransaction()
        when(fragNum){
            0 -> {
                ft.replace(R.id.main_frame, Fragment1()).commit()
            }
            1 -> {
                ft.replace(R.id.main_frame, Fragment2()).commit()
            }
            2 -> {
                ft.replace(R.id.main_frame, Fragment3()).commit()
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

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rv_recyclerView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>

// char_list.xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_margin="16dp">
        <Button
            android:id="@+id/btn_fragment1"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Fragment1"/>
        <Button
            android:id="@+id/btn_fragment2"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Fragment2"/>
        <Button
            android:id="@+id/btn_fragment3"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Fragment3"/>
    </LinearLayout>
    <FrameLayout
        android:id="@+id/main_frame"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_margin="16dp"/>
</LinearLayout>

// Fragement1, 2, 3.kt
class Fragment1 : Fragment() {
    override fun onCreateView( // Fragment 첫 실행시 수행
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // frag.xml 연결 (1,2,3)
        val view = inflater.inflate(R.layout.frag1, container, false)
        return view
    }
}
```

### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Fragment/app/src/main/res/drawable-v24/fragment1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Fragment/app/src/main/res/drawable-v24/fragment3.PNG?raw=true" alt="result2">
</div>


<!-- ### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/RecyclerView2/app/src/main/res/drawable-v24/recyclerview.PNG?raw=true" alt="result1">
</div> -->

## 참조
[홍스로이드 Kotlin Fragment](https://www.youtube.com/watch?v=BT206iXW9bk&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=11)