---
title : "Kotlin Navigation View"
date : 2020-09-21 00:00:05
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Navigation View
* 햄버거나 사이드에서 나오는 슬라이드 네비게이션을 만들 수 있다.

### 순서
1. `gradle`에 추가
> `implementation 'com.google.android.material:material:1.0.0'`
2. res 폴더에 네비게이션 메뉴를 다룰 menu resources directory 를 만들어준다.
> type을 menu로 해줘야 한다.
> Tip! drawble의 new에서 --asset을 통해, 안드로이드에서 제공하는 기본 이미지들을 사용할 수 있다.
3. menu를 구성하는 태그들을 만들어준다.  
4. `activity_main`에서 외부 태그를 `constraint`가 아닌, `DrawerLayout`으로 변경해준다
> `DrawerLayout`이란 햄버거, 샌드위치라 불리는 버튼을 눌렀을 때 화면 사이드에서 스와이프 되며 나오는 view를 말한다.
5. `DrawerLayout` 바로 아래에, `material.navigation.NavigationView`태그를 추가하고, `android:layout_gravity="start"`를 통해, 화면 왼쪽으로 빼준다.(End도 됨 방향은 자유)


```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener { // Navigation 관련 클래스들을을 상속받음
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        nav_btn.setOnClickListener {
            // 왼쪽방향에서 밀어라
            layout_drawer.openDrawer(GravityCompat.START) // START = Left, END = Right
        }

// 네비게이션 뷰에 아래의 아이템 클릭기능 부여 (상속받았던 클릭이벤트에 override한것이기 때문에, this)
        nav_view.setNavigationItemSelectedListener(this)
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean { // Navigaion 메뉴 클릭 시 수행
        when(item.itemId){ // nav_menu의 item들의 아이디
            R.id.access -> Toast.makeText(this, "접근성", Toast.LENGTH_SHORT).show()
            R.id.email -> Toast.makeText(this, "이메일", Toast.LENGTH_SHORT).show()
            R.id.send -> Toast.makeText(this, "메시지", Toast.LENGTH_SHORT).show()
        }
        // 위의 과정을 진행하고, navigation을 닫아줘
        layout_drawer.closeDrawers()
        return false
    }


// Nav가 켜져있을 때, 뒤로가기를 눌러도 앱이 꺼지지않고 Nav가 닫히도록
    override fun onBackPressed() {
        if(layout_drawer.isDrawerOpen(GravityCompat.START)){ // Nav가 열려있는 상태면
            layout_drawer.closeDrawers() // Nav만 닫아
        }else{
            super.onBackPressed() // 일반 백버튼 실행
        }
    }
}

// nav_menu.xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <group android:checkableBehavior="single">
        <item
            android:id="@+id/access"
            android:icon="@drawable/ic_baseline_accessibility_24"
            android:title="접근성" />
        <item
            android:id="@+id/email"
            android:icon="@drawable/ic_baseline_email_24"
            android:title="이메일" />
        <item
            android:id="@+id/send"
            android:icon="@drawable/ic_baseline_send_24"
            android:title="메시지" />
    </group>
</menu>

// activity_main.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:id="@+id/layout_drawer"
    tools:context=".MainActivity">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Hello World!"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <ImageView
            android:id="@+id/nav_btn"
            android:layout_width="50dp"
            android:layout_height="50dp"
            android:layout_marginStart="8dp"
            android:layout_marginTop="8dp"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            android:src="@drawable/ic_baseline_menu_64" />

    </androidx.constraintlayout.widget.ConstraintLayout>
    <com.google.android.material.navigation.NavigationView
        android:id="@+id/nav_view"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:menu="@menu/nav_menu" />
</androidx.drawerlayout.widget.DrawerLayout>
```

### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav2.PNG?raw=true" alt="result2">
</div>

<!-- 
### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/ListView/app/src/main/res/drawable-v24/listview2.PNG?raw=true" alt="result2">
</div> -->

## 참조
[홍스로이드 Kotlin Navigation View](https://www.youtube.com/watch?v=ALTFLXKiPUY&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=6)