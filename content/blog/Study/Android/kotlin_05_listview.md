---
title : "Kotlin ListView & Adapter"
date : 2020-09-15 00:00:04
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## ListView
* ListView기능을 통해, 배열에 담긴 정보를 반복순회하여 화면을 구성할 수 있다.
> 프론트단에서 `Array.map`과 비슷한 기능 같다.
* ListView는 adapter로 연결이 되어있어야 값을 넣어줄 수 있다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    val item = arrayOf("사과", "배", "딸기", "키위")
    listView.adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, item)
    // this(context)는 현재 Activity의 모든 데이터를 담고있다.
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

    <ListView
        android:id="@+id/listView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/ListView/app/src/main/res/drawable-v24/listview1.PNG?raw=true" alt="result1">
</div>

* 위처럼 기본적으로 제겅되는 adapter의 경우 실무에서 사용하기에는 부족함이 있기때문에, 대부분 커스텀 adapter를 따로 만들어서 사용한다.

## Custom Adapter & ListView
1. 모델 객체(class) 만들기
  * 하나하나의 정보를 담게될 class를 만든다
2. ListView에 반복이 될 하나의 레이아웃을 구성한다.
3. 해당 레이아웃을 반복시킬 adapter를 만든다.
4. ListView의 어뎁터로 설정한다.

### 모델 객체(class) 만들기
* 새로운 파일로 클래스로된 모델을 만들어준다

```javascript
// GameChar.kt
package com.example.listview

// 클래스 모델 객체
class GameChar (val img : String, val groupClass : String, val detaliClass : String)
```

### ListView에 반복이 될 하나의 레이아웃을 구성한다.

```javascript
// list_game_char.xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <ImageView
        android:id="@+id/iv_img"
        android:layout_width="140dp"
        android:layout_height="140dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:srcCompat="@drawable/ic_launcher_foreground" />

    <TextView
        android:id="@+id/tv_groupClass"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_marginStart="16dp"
        android:layout_marginTop="16dp"
        android:text="detailClass"
        android:textColor="@color/black"
        android:textSize="26dp"
        app:layout_constraintStart_toEndOf="@+id/iv_img"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv_detailClass"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_marginStart="16dp"
        android:layout_marginBottom="16dp"
        android:text="groupClass"
        android:textColor="@color/black"
        android:textSize="26dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toEndOf="@+id/iv_img" />

    <ImageView
        android:id="@+id/iv_btn"
        android:layout_width="35dp"
        android:layout_height="35dp"
        android:layout_marginEnd="16dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:srcCompat="?android:attr/actionModeWebSearchDrawable" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

### 해당 레이아웃을 반복시킬 adapter를 만든다.

```javascript
// 이거 React할 때, .map으로 컴포넌트 반복시킨거랑 많이 비슷한듯함
class GameCharAdapter (
    val context : Context, // activty의 정보를 담고있는 컨텍스트
    val CharList : ArrayList<GameChar> // GameChar class 형식으로 담겨진 ArrayList
) : BaseAdapter() { // 기본 adapter기술을 상속받음

    // listView에 어떻게 화면을 뿌려줄것인지 구현
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        // 반복시킬 내가만든 레이아웃
        // 해당 context의 listView는 나는 이 레이아웃이 반복된것으로 바꿀꺼야
        val view : View = LayoutInflater.from(context).inflate(R.layout.list_game_char, null)

        // 내가 만들었던 레이아웃에서 동적으로 값이 바뀌어야 할 부분들을 가져옴
        val img = view.findViewById<ImageView>(R.id.iv_img) // ImageView타입의 이미지
        val groupClass = view.findViewById<TextView>(R.id.tv_groupClass) // TextView타입의 메인클래스
        val detailClass = view.findViewById<TextView>(R.id.tv_detailClass) // TextView타입의 디테일클래스

        // 반복해서 레이아웃을 만들어 낼 때, 순서에 맞는 생성된 class들을 불러옴
        val charClass = CharList[position] // 반복순회할 때 index

        // 내가 만들었던 레이아웃에 값을 동적으로 지정해줌
        Glide.with(context).load(charClass.img).into(img)
        groupClass.text = charClass.groupClass
        detailClass.text = charClass.detaliClass

        // 완성된 하나의 레이아웃을 반환
        return view
    }

    // 매 순간마다 어떤 클래스를 가져와서 사용할 것인지
    override fun getItem(position: Int): Any {
        return CharList[position]
    }

    override fun getItemId(position: Int): Long {
        return 0
    }

    // 총 몇개의 레이아웃(리스트)이 만들어졌는지
    override fun getCount(): Int {
        return CharList.size
    }
}
```

### ListView의 어뎁터로 설정한다.

```javascript
class MainActivity : AppCompatActivity() {

    val url = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/information/class/"
    val GameCharList = arrayListOf<GameChar>( // arraylist를 만들껀데, GameChar클래스 타입들을 넣어
        GameChar("${url}img_detail_warlord_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Warlord"),
        GameChar("${url}img_detail_berserker_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Berserker"),
        GameChar("${url}img_detail_destroyer_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Destroyer"),
        GameChar("${url}img_detail_holyknight_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Holyknight"),
        GameChar("${url}img_detail_battlemaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Battle Master"),
        GameChar("${url}img_detail_infighter_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Infighter"),
        GameChar("${url}img_detail_soulmaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Soul Master"),
        GameChar("${url}img_detail_lancemaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Lance Master"),
        GameChar("${url}img_detail_devilhunter_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Devil Hunter"),
        GameChar("${url}img_detail_blaster_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Blaster"),
        GameChar("${url}img_detail_hawkeye_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Hawk Eye"),
        GameChar("${url}img_detail_scouter_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Scouter"),
        GameChar("${url}img_detail_bard_s.png?a30e28ffc1cfe5cf1991", "Magician", "Bard"),
        GameChar("${url}img_detail_summoner_s.png?a30e28ffc1cfe5cf1991", "Magician", "Summoner"),
        GameChar("${url}img_detail_arcana_s.png?a30e28ffc1cfe5cf1991", "Magician", "Arcana"),
        GameChar("${url}img_detail_blade_s.png?a30e28ffc1cfe5cf1991", "Assassin", "Blade"),
        GameChar("${url}img_detail_demonic_s.png?a30e28ffc1cfe5cf1991", "Assassin", "Demonic")
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val Adapter = GameCharAdapter(this, GameCharList)
        listView.adapter = Adapter

        // 리스트 클릭 시
        listView.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
            // 내가 클릭한 아이템
            val selectedItem = parent.getItemAtPosition(position) as GameChar // 해당 index번째의 GameChar 클래스
            Toast.makeText(this, selectedItem.detaliClass, Toast.LENGTH_SHORT).show()
        }
    }
}
```

### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/ListView/app/src/main/res/drawable-v24/listview2.PNG?raw=true" alt="result2">
</div>

## 참조
[홍스로이드 Kotlin ListView](https://www.youtube.com/watch?v=ao0Iqfhy0oo&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=5)