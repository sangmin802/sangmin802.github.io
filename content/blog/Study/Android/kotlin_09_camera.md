---
title : "Kotlin Camera"
date : 2020-09-22 00:00:08
category : "Study"
tag : "Android"
draft : false
sidebar : 
  - title : 'Kotlin'
  - nav : Kotlin    
--- 
## Camera
* 안드로이드 기본 카메라 기능을 앱에서 사용할 수 있다.
> 개인적으로.. 자바 기본문법을 모르다보니 너무 어려웠다..특히 중간중간에 `also`같은 구문이 있던데.. 잠깐 알아보니 `class`의 속성들을 조금 더 쉽게 변경할 수 있는 문법인것같다!.. 공부해야할듯

```javascript
// Manifest.xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.camera">

    <!--  카메라 권한  -->
    <uses-permission android:name="android.permission.CAMERA"/>
    <!--  파일 쓰기 권한  -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <!--  파일 저장 권한  -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <!--  카메라 기능 사용  -->
    <uses-feature android:name="android.hardware.camera" android:required="true"/>
    <!--  true : 카메라 기능이 없는 안드로이드일 경우, 에러가 생김  -->
    <!--  false : 카메라 기능이 없어도 정상적으로 작동됨  -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!--  보안을 위해 사진 제공자, 사용하는 앱에 대한 명시  -->
        <provider
            android:authorities="com.example.camera.fileprovider"
            android:name="androidx.core.content.FileProvider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />

        </provider>
    </application>

</manifest>

// MainActivity.kt
class MainActivity : AppCompatActivity() {

    val REQUEST_IMAGE_CAPTURE = 1 // 카메라 사진촬영 요청코드
    lateinit var curPhotoPath : String // 그냥 미리 선언해놓는 문자열 형태의 사진 경로

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // mainfests에 필요한 권한들을 요청한다
        // 단, 안드로이드 공문에 기재된 몇몇의 권한들은 개인정보와 관련된 위험권한으로 사용자에게 허락을 받아야 한다.
        // 허락 팝업을 위해 gradle에 추가를 한다.
        //      implementation 'gun0912.ted:tedpermission:2.2.3'
        setPermission() // 권한 체크 메소드 수행

        btn_camera.setOnClickListener {
            takeCapture() // 사진 촬영
        }
    }

    // 권한 요청 팝업 설정
    private fun setPermission() {
        val permission = object : PermissionListener {
            override fun onPermissionGranted() { // 설정해놓은 위험권한들이 모두 허용 되었을 경우 실행
                Toast.makeText(this@MainActivity, "권한이 허용 되었습니다.", Toast.LENGTH_SHORT).show()
            }

            override fun onPermissionDenied(deniedPermissions: MutableList<String>?) { // 설정해놓은 위험권한들이 하나라도 거부되었을 경우 실행
                Toast.makeText(this@MainActivity, "권한이 거부 되었습니다.", Toast.LENGTH_SHORT).show()
            }
        }

        TedPermission.with(this)
            .setPermissionListener(permission)
            .setRationaleMessage("카메라 앱을 사용하시려면 권한을 허용해주세요.")
            .setDeniedMessage("권한을 거부하셨습니다. [앱 실행] -> [권한] 항목에서 허용해주세요.")
            .setPermissions(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.CAMERA)
            .check()
    }

    // 사진 촬영
    private fun takeCapture() {
    // 기본 카메라 앱 실행
    // 카메라 기능도 Activity 형태이기 때문에, Intent로 화면전환을 사용한다.
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
            takePictureIntent.resolveActivity(packageManager)?.also {
                val photoFile : File? = try {
                    createImageFile()
                } catch (ex : IOException) {
                    null
                }
                photoFile?.also {
                    val photoURI : Uri = FileProvider.getUriForFile(
                        this,
                        "com.example.camera.fileprovider",
                        it
                    )
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                    // startActivity만 있으면, 단순히 카메라 Activity로 이동만 하지만
                    // startActivityForResult를 쓰면, 갔다가 결과값을 받고 돌아온다
                    startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
                }
            }
        }
    }

    // 이미지 파일 생성
    private fun createImageFile(): File {
        val timestamp : String = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val storageDir : File? = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile("JPEG_${timestamp}_", ".jpg", storageDir)
            .apply { curPhotoPath = absolutePath }
    }

    // startActivityForResult를 사용해서 받아온 사진 결과값.
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // 이미지를 성공적으로 가져 왔다면
        if(requestCode === REQUEST_IMAGE_CAPTURE && resultCode === Activity.RESULT_OK) {
            val bitmap : Bitmap
            val file = File(curPhotoPath)
            if(Build.VERSION.SDK_INT < 28) { // 안드로이드 9.0버전보다 낮을경우
                bitmap = MediaStore.Images.Media.getBitmap(contentResolver, Uri.fromFile(file))
                iv_profile.setImageBitmap(bitmap)
            }else{
                val decode = ImageDecoder.createSource(
                    this.contentResolver,
                    Uri.fromFile(file)
                )
                bitmap = ImageDecoder.decodeBitmap(decode)
                iv_profile.setImageBitmap(bitmap)
            }
            savePhoto(bitmap)
        }
    }

    // 갤러리에 저장
    private fun savePhoto(bitmap: Bitmap) {
        // 사진폴더에 저장하기 위한 경로
        val folderPath = Environment.getExternalStorageDirectory().absolutePath + "/Pictures/"
        val timestamp : String = SimpleDateFormat("yyyyMMdd_HHmmss").format(Date())
        val fileName = "${timestamp}.jpeg"
        val folder = File(folderPath)
        if(!folder.isDirectory) { // 해당 경로에 폴더가 존재하지 않는다면
            folder.mkdirs()
        }

        // 저장저리
        val out = FileOutputStream(folderPath + fileName)
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out)
        Toast.makeText(this, "사진이 저장되었습니다.", Toast.LENGTH_SHORT).show()
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

    <Button
        android:id="@+id/btn_camera"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="카메라 촬영"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintHorizontal_bias="0.498"
        app:layout_constraintStart_toStartOf="parent" />

    <ImageView
        android:id="@+id/iv_profile"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintBottom_toTopOf="@+id/btn_camera"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        android:src="@drawable/ic_launcher_background" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

<!-- ### 결과물
<div style="display : flex; justify-content : space-between;">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav1.PNG?raw=true" alt="result1">
  <img style="display : inlneblock; width : 40%" src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Navigation/app/src/main/res/drawable-v24/nav2.PNG?raw=true" alt="result2">
</div> -->


### 결과물
<div style="text-align : center;">
  <img src="https://github.com/sangmin802/Kotlin_Android/blob/master/HongLecture/Camera/app/src/main/res/drawable-v24/camera.PNG?raw=true" alt="result1">
</div>

## 참조
[홍스로이드 Kotlin Camera](https://www.youtube.com/watch?v=inprJiLDUIU&list=PLC51MBz7PMywN2GJ53aF0UO5fnHGjW35a&index=9)