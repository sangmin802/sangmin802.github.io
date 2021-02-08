---
title : "Kotlin LostArk Hands"
date : 2020-10-08 00:00:11
category : "Study"
tag : "Android"
draft : false
--- 

## 배웠으면 써먹어봐야지 - LostArk Hands
### LostArk Hands
내가 좋아하는 게임인 로스트아크 유저검색앱을 만들어보고싶었는데 해당 게임사에서 API를 공개하지 않더라..
<br>
그런데, 전투정보실 네트워크에서 요청하는 주소를 그대로 사용해보니, 완성된 View파일을 가져오는데 잘만 조리하면.. 필요한 데이터를 뽑을수 있을것 같아, JS로 먼저 실험해봤는데, 잘 된다!
<br>
이미 로아와 라는 훌륭한 웹앱이 있고, 만드신 개발자께서 웹뷰로 모바일 앱도 구현해놓으신것 같다. 그래도 재미있을거 같으니 도전!

### 구현중 새롭게 알게된 점
#### HTTP통신은 Coroutine을 활용하여 Dispatchers.IO에서 진행
* 메인스레드에서 HTTP통신시, 불가능하다는 에러가 생긴다. UI관련 작업을 수행하는 메인스레드이니 다른 스레드에서 진행하도록 한다. 코루틴을 공부하면서 HTTP통신을 하고, 결과값을 기다렸다가 사용하는 동기식 꿈의 코드를 알았으니 해결! 

```javascript
  fun searchClickEvent(){
      CoroutineScope(Dispatchers.IO).launch {
          getUserData(et_value.text.toString())
      }
  }

  suspend fun getUserData(editTextVal: String) {
      val scopeManager = ScopeManager()
      val userData = scopeManager.HttpRequest(editTextVal)

      parentFragmentManager.beginTransaction().replace(R.id.frame_changingFrame, UserInfoFragment.newInstance(userData)).commit()
  }
```

#### 코루틴스코프를 관리하는 하나의 클래스를 통해 일괄종료시킬 수 있다.
* 코루틴작업을 여러번 종료시킬필요 없이, 하나로 묶고 한번에 종료시킬수 있었다.

```javascript
class ScopeManager {
    private val mainScope = CoroutineScope(Dispatchers.Default)
    fun destroy(){
        mainScope.cancel()
    }
    suspend fun HttpRequest(_val : String) : SendingData {
        val editTextVal = URLEncoder.encode("${_val}", "UTF-8")
        val httpResult = getHttp(editTextVal)

        return mainScope.async {
            val userEquipResult = getUserEquip(httpResult)
            val userInfoResult = getUserInfo(httpResult, _val)

            SendingData(userEquipResult, userInfoResult)
        }.await()
    }
    ...
}
```

#### 배열로된 데이터를 전달하고자 할 때
* 여러개의 데이터를 하나의 배열형식으로 담아 넘겨줄 때, 타입이 애매해서 힘들었는데 Parcelable을 통해 쉽게할 수 있었다. 받는방식은 아래에서 확인
* 코틀린에서는 데이터들의 모델을 만들어서 관리하는것이 이후 타입을 지정해주는것을 포함하여 깔끔한 것 같다.

```javascript
class SendingData (
  var userEquip : UserEquip?,
  var userInfo : UserInfo
) : Parcelable {
  ...
}
```

#### Fragment 데이터 전달
* MainFragment안에 WelcomeFragment가있고, 검색 시 검색된 유저의 정보를 띄우는 UserInfoFragment로 대체되도록 하였다.

```javascript
// MainFragment
suspend fun getUserData(editTextVal: String) {
    val scopeManager = ScopeManager()
    val userData = scopeManager.HttpRequest(editTextVal)

    parentFragmentManager.beginTransaction().replace(R.id.frame_changingFrame, UserInfoFragment.newInstance(userData)).commit()
}

// UserInfoFragment
var userData : SendingData? = null

// 2번진행
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    arguments?.let {
        userData = it.getParcelable("userData")
    }
}

...

// 1번진행
companion object {
    @JvmStatic
    fun newInstance(userData : SendingData) =
        UserInfoFragment().apply {
            arguments = Bundle().apply {
              // 위에서 Parcelable 클래스에 상속받은 SendingData모델
                putParcelable("userData", userData)
            }
        }
}
```

#### android:windowSoftInputMode="adjustPan"
* 키보드활성화시 이미지등이 밀려 사이즈가 작아지는것을 막을 수 있었다.

```javascript
// Manifest
<activity
    android:name=".MainActivity"
    android:windowSoftInputMode="adjustPan">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

#### 화면이 짤리는 RecyclerView
* 보통 ScrollView 안에 RecyclerView 가 들어가는 경우라면 NestedScrollView를 써주자 ~

#### resources
* resources를 통해 res폴더의 이미지, 색상 등 정적 자료들을 사용할 수 있다.

### 완성!
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 33%" src="https://github.com/sangmin802/portfolio/blob/master/public/img/projectImg/loahands1.png?raw=true" alt="result1">
  <img style="display : inlneblock; width : 33%" src="https://github.com/sangmin802/portfolio/blob/master/public/img/projectImg/loahands2.png?raw=true" alt="result2">
  <img style="display : inlneblock; width : 33%" src="https://github.com/sangmin802/portfolio/blob/master/public/img/projectImg/loahands3.png?raw=true" alt="result3">
</div>

### 후기
예전에는 안드로이드 개발은 JAVA언어라서 완전히 백엔드의 영역이라고 생각했다. 하지만 알아갈수록.. 프론트에 더 가까운느낌이랄까.. 정말 많이 부족하고 낯설며 어려웠지만 재미는 있네