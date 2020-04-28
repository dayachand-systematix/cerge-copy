Please follow these instructions when you start coding on this project for first time. To run it properly 

### 1) For GIT Clone
```sh
git clone http://10.10.1.3:2010/sipl/cerge-app.git
```

### 2) Enter Directory
```sh
cd cerge-app
```

### 3) Package Install
```sh
npm install
```

### 4) Linking Packages
```sh
react-native link
```


### 5) Clear Cache 
```sh
watchman watch-del-all 
rm -rf $TMPDIR/react-*
```

### 6) Run Bundle command for Android 
```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

### 7) Run Bundle command for iOS 
```sh
react-native bundle --entry-file ./index.js --platform ios --bundle-output ios/main.jsbundle --assets-dest ./ios
```