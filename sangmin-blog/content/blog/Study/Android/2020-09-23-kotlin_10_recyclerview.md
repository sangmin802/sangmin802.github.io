---
title : "Kotlin Recycler View"
date : 2020-09-23 00:00:09
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Recycler View
* 기존 List View보다 좀 더 개선된 기능이다.

```javascript
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    val url = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/information/class/"
    val GameCharList = arrayListOf<Char>(
        Char("${url}img_detail_warlord_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Warlord"),
        Char("${url}img_detail_berserker_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Berserker"),
        Char("${url}img_detail_destroyer_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Destroyer"),
        Char("${url}img_detail_holyknight_s.png?a30e28ffc1cfe5cf1991", "Warrior", "Holyknight"),
        Char("${url}img_detail_battlemaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Battle Master"),
        Char("${url}img_detail_infighter_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Infighter"),
        Char("${url}img_detail_soulmaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Soul Master"),
        Char("${url}img_detail_lancemaster_s.png?a30e28ffc1cfe5cf1991", "Fighter", "Lance Master"),
        Char("${url}img_detail_devilhunter_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Devil Hunter"),
        Char("${url}img_detail_blaster_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Blaster"),
        Char("${url}img_detail_hawkeye_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Hawk Eye"),
        Char("${url}img_detail_scouter_s.png?a30e28ffc1cfe5cf1991", "Hunter", "Scouter"),
        Char("${url}img_detail_bard_s.png?a30e28ffc1cfe5cf1991", "Magician", "Bard"),
        Char("${url}img_detail_summoner_s.png?a30e28ffc1cfe5cf1991", "Magician", "Summoner"),
        Char("${url}img_detail_arcana_s.png?a30e28ffc1cfe5cf1991", "Magician", "Arcana"),
        Char("${url}img_detail_blade_s.png?a30e28ffc1cfe5cf1991", "Assassin", "Blade"),
        Char("${url}img_detail_demonic_s.png?a30e28ffc1cfe5cf1991", "Assassin", "Demonic")
    )
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 수직으로 생성
        // rv_recyclerView.layoutManager = LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false)

        // 수평으로 생성
        // rv_recyclerView.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)

        // 그리드로 생성
        rv_recyclerView.layoutManager = GridLayoutManager(this, 2)
        rv_recyclerView.setHasFixedSize(true) // recyclerView 성능개선

        rv_recyclerView.adapter = CharAdapter(GameCharList)
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
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginStart="8dp"
        android:layout_marginEnd="8dp"
        android:layout_marginBottom="8dp"
        android:layout_marginTop="8dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent">

        <ImageView
            android:id="@+id/iv_prifile"
            android:layout_width="60dp"
            android:layout_height="60dp"
            android:layout_marginStart="8dp"
            android:layout_marginTop="8dp"
            android:layout_marginBottom="8dp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            tools:srcCompat="@tools:sample/avatars" />

        <TextView
            android:id="@+id/tv_groupClass"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="20dp"
            android:layout_marginTop="16dp"
            android:text="GroupClass"
            android:textColor="#000000"
            android:textStyle="bold"
            app:layout_constraintStart_toEndOf="@+id/iv_prifile"
            app:layout_constraintTop_toTopOf="parent" />

        <TextView
            android:id="@+id/tv_detailClass"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="20dp"
            android:layout_marginBottom="16dp"
            android:text="DetailClass"
            android:textColor="#000000"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintStart_toEndOf="@+id/iv_prifile" />
    </androidx.constraintlayout.widget.ConstraintLayout>
</androidx.constraintlayout.widget.ConstraintLayout>

// Char.kt
class Char (val profile : String, val groupClass : String, val detailClass : String)

// CharAdapter.kt
class CharAdapter(val charList : ArrayList<Char>) : RecyclerView.Adapter<CharAdapter.CustomViewHolder>(){
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CharAdapter.CustomViewHolder {
        // 1번순서
        // Activity에서 onCreate, setContentView를 통해 xml을 연결하는것처럼
        // 완성된 레이아웃이 들어가게될 Activity에 미리 만든 비어있는 레이아웃을 연결한다.
        val view = LayoutInflater.from(parent.context).inflate(R.layout.char_list, parent, false)

        // 클릭이벤트도 해당 class에 묶어서 보냄
        return CustomViewHolder(view, parent).apply {
            this.inflated_char_list.setOnClickListener {
                val curPos : Int = adapterPosition // 클릭 이벤트 실행시에만 제공되는 기능인듯함
                val charData : Char = charList.get(curPos)
                Toast.makeText(parent.context, "그룹 : ${charData.groupClass}\n직업 : ${charData.detailClass}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun getItemCount(): Int {
        return charList.size
    }

    override fun onBindViewHolder(holder: CustomViewHolder, position: Int) {
        // 3번순서
        // CustomViewHolder에게 상속받은 val 값들을 통해 배열의 데이터들을 연결함
        Glide.with(holder._parent).load(charList.get(position).profile).into(holder.profile)
        holder.groupClass.text = charList.get(position).groupClass
        holder.detailClass.text = charList.get(position).detailClass
    }

    class CustomViewHolder(val inflated_char_list : View, val _parent : ViewGroup) : RecyclerView.ViewHolder(inflated_char_list) {
        // 2번순서
        // 비어있는 레이아웃들에서 데이터가 들어가야할 태그들의 id를 호출
        val profile = inflated_char_list.findViewById<ImageView>(R.id.iv_prifile) // 이미지
        val groupClass = inflated_char_list.findViewById<TextView>(R.id.tv_groupClass) // 그룹클래스
        val detailClass = inflated_char_list.findViewById<TextView>(R.id.tv_detailClass) // 서브클래스스
   }
}

```

<!-- ### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav2.PNG?raw=true" alt="result2">
</div> -->


### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/RecyclerView2/app/src/main/res/drawable-v24/recyclerview.PNG?raw=true" alt="result1">
</div>

## 참조
[홍스로이드 Kotlin Recycler View](https://www.youtube.com/watch?v=jsjYo-xy3EA&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=10)