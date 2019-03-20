Devlop Guidline
===

# 1.Git
## git install

[git install](https://qiita.com/toshi-click/items/dcf3dd48fdc74c91b409)

## create local repository
```
cd D:\work\wohapp
git init
git clone https://github.com/highwayns/wohApp.git
git remote add origin/master https://github.com/highwayns/wohApp.git
```
##update repository
```
git reset --hard origin/master
git fetch
git pull
```
##commit modified
git add .
git commit -m "XXX modified"
git push

##コンフリクト解消ガイド
https://qiita.com/yuya_presto/items/5d99499cf96c0ebb09f8

2.json
https://github.com/highwayns/json-server
https://json.org/
https://github.com/jdorn/json-editor

3.js
https://qiita.com/takeharu/items/809114f943208aaf55b3
https://momentjs.com/
https://underscorejs.org/
https://qiita.com/tsukishimaao/items/39d22fd9178546d6cdeb
https://wp-p.info/tpl_rep.php?cat=js-application&fl=r9
https://qiita.com/ichikawa_0829/items/85413fedc59822ccef75
https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage

4.html/css
http://www.ituore.com/entry/html-css-basic
https://www.webopixel.net/html-css/503.html
https://qiita.com/ritukiii/items/67b3c50002b48c6186d6

5.nodejs
https://qiita.com/taiponrock/items/9001ae194571feb63a5e
https://nodejs.org/en/docs/
```
npm install
npm start
npm run build
```
https://dackdive.hateblo.jp/entry/2016/10/10/095800
https://github.com/highwayns/esformatter
```
npm install [-g] esformatter
esformatter -i test.js
```
webpack：
【入门 Webpack，看这篇就够了 - 前端学习笔记 - SegmentFault 思否】
https://segmentfault.com/a/1190000006178770

6.phonegap
http://docs.phonegap.com/

7.vs install cordova
https://algorithm.joho.info/programming/vs2017-visual-studio-tools-for-apache-cordova-install/
debug
https://jp.vuejs.org/v2/cookbook/debugging-in-vscode.html
```
install vue plugin & Eslint plugin & Debugger for Chrome
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/*"
      }
    }
```
https://docs.microsoft.com/en-us/visualstudio/cross-platform/tools-for-cordova/debug-test/debug-using-visual-studio?view=toolsforcordova-2017

8.firebase
https://firebase.google.com/docs/reference/js/firebase
firebase tools:
```
npm i firebase-tools
npm i -g firebase-tools
firebase login
firebase init
firebase use --add
firebase serve --only hosting
firebase deploy
firebase open hosting:site
```
firebase auth:
firebase database:
firebase firestore:
firebase storage:
firebase hosting:
firebase mlkit:

firebase performance monitor:
  アプリケーションにPerformance Monitoring SDKを追加する
  （Optional）SDKを使用してアプリケーションのカスタムトレースとカウンタを定義する
  Firebaseコンソールでのパフォーマンスデータの監視
firebase Crashlytics:
firebase Test Lab:

firebase In-App messaging:
firebase Predictions:
firebase A/B Testing:
firebase Cloud messaging:
firebase Remote Config:
firebase Dynamic Links:
firebase App Index:
firebase invite:
firebase admob:

9.cordova
https://cordova.apache.org/docs/en/latest/
```
npm install cordova -g
cordova create wohapp com.highwayns.wohapp wohApp
cordova requirements
cordova platform add ios --save
cordova plugin add cordova-plugin-whitelist cordova-plugin-statusbar cordova-plugin-camera cordova-plugin-geolocation cordova-plugin-file-transfer cordova-plugin-inappbrowser cordova-plugin-network-information
```

10 vue & vuex &axios
https://vuejs.org/v2/guide/
https://vuex.vuejs.org/guide/
https://jp.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
##project create:
```
npm install -g vue-cli
vue init webpack test-vue
```

##project manager:
```
npm install --global @vue/cli
vue ui
```

##online editor:
https://github.com/highwayns/vuegg

11.framework7
http://v2.framework7.io/vue/
```
npm install framework7
npm install -g framework7-cli
framework7 create
framework7 create --ui
framework7 create --ui --port 8080
framework7 generate-assets
framework7 generate-assets --ui
framework7 cordova plugin add cordova-plugin-statusbar
framework7 cordova plugin add cordova-plugin-splashscreen
framework7 cordova build ios
```

12.glup & Iconfont
https://github.com/gulpjs/gulp/tree/master/docs
```
npm install glup -g
gulp Iconfont
```
##framework7-icons:
https://github.com/framework7io/framework7-icons
##material-design-icons:
https://github.com/google/material-design-icons
https://icofont.com/icons

13.jQuery
https://maketips.net/tip/223/how-to-include-jquery-into-vuejs

14.firebasebot
https://github.com/FirebaseExtended/bolt/blob/master/docs/language.md
```
npm install --global firebase-bolt
firebase-bolt < posts.bolt
```

15.firechat
https://firechat.firebaseapp.com/docs/
##API - Public Methods
new Firechat(ref, options)
Firechat.setUser(userId, userName, onComplete)
Firechat.resumeSession()
Firechat.on(eventType, callback)
Firechat.createRoom(roomName, roomType, callback(roomId))
Firechat.enterRoom(roomId)
Firechat.leaveRoom(roomId)
Firechat.sendMessage(roomId, messageContent, messageType='default', callback)
Firechat.toggleUserMute(userId, callback)
Firechat.inviteUser(userId, roomId)
Firechat.acceptInvite(inviteId, callback)
Firechat.declineInvite(inviteId, callback)
Firechat.getRoomList(callback)
Firechat.getUsersByRoom(roomId, [limit=100], callback)
Firechat.getUsersByPrefix(prefix, startAt, endAt, limit, callback)
Firechat.getRoom(roomId, callback)
Firechat.createPost(content, pic, callback)
Firechat.addComment(postKey, comments, callback)
Firechat.likePost(postKey, callback)
Firechat.getPostList(callback)
Firechat.removePost(postKey, callback)
Firechat.getPostComments(postkey, callback)
Firechat.removePostComment(postKey, commentKey, callback)
Firechat.getPostLikes(postkey, callback)
Firechat.unlikePost(postKey, likeKey, callback)
Firechat.addContact(userid, name, header, location, callback)
Firechat.removeContact(userkey, callback)
Firechat.getContactList(callback)

##API - Exposed Bindings
user-update - Invoked when the user's metadata changes.
room-enter - Invoked when the user successfully enters a room.
room-exit - Invoked when the user exists a room.
message-add - Invoked when a new message is received.
message-remove - Invoked when a message is deleted.
room-invite - Invoked when a new room invite is received.
room-invite-response - Invoked when a response to a previous invite is received.

##Data Structure
moderators/ 
  <user-id> - A list of user ids and their moderator status. 
    true|false - A boolean value indicating the user's moderator status.
room-messages/ 
  <room-id> 
    <message-id> 
      userId - The id of the user that sent the message.
      name - The name of the user that sent the message.
      message - The content of the message.
      timestamp - The time at which the message was sent.
room-metadata/ 
  <room-id> 
    createdAt - The time at which the room was created.
    createdByUserId- The id of the user that created the room.
    id - The id of the room.
    name - The public display name of the room.
    type - The type of room, public or private.
room-users/
user-names-online/
users/ 
  <user-id> 
    id - The id of the user.
    name - The display name of the user.
    invites - A list of invites the user has received.
    muted - A list of user ids currently muted by the user.
    rooms - A list of currently active rooms, used for sessioning.

16.android
##JDKのインストール
##Android SDKのインストール
```
export PATH=$HOME/Library/Android/sdk/platform-tools:$PATH
export PATH=$HOME/Library/Android/sdk/tools:$PATH

cordova platform add android
```

##エミュレータでの検証:
Genymotion.appを起動
アプリケーション内で、VMをダウンロード (もしまだなければ)
VMを起動
Cordovaから起動 $ cordova run android 

##実機で検証:
Android実機のUSBデバッグ機能をONに
MacにAndroid実機をUSB接続 (USBケーブルが充電専用だとNGなので注意)
次のコマンドで接続確認して、表示されればOK $ adb devices 
Cordovaから起動 $ cordova run android 
ビルドを待つ...
実機でアプリが起動!

17.ios
Apple の開発者のダウンロードアップルの開発者として登録する必要があります。
```
    $ npm install -g ios-sim
    $ npm install -g ios-deploy
    $ cordova run ios --device
    $ cordova emulate ios
```

18.windows
cordova build windows -- --appx=8.1-phone
##To deploy Windows package:
```
cordova run windows -- --win  # explicitly specify Windows as deployment target
cordova run windows # `run` uses Windows package by default
```
##To deploy Windows Phone package:
```
cordova run windows -- --phone  # deploy app to Windows Phone 8.1 emulator
cordova run windows --device -- --phone  # deploy app to connected device
```
##This command will give you the list of all available targets:
```
cordova run windows --list
cordova run windows --target="Emulator 8.1 720P 4.7 inch" -- --phone
```

19.python2.7
一部Packageはpython2.7を使っている。
https://www.python.jp/install/windows/install_py2.7.html

20.awaresome
https://github.com/highwayns/awesome-vue
https://github.com/highwayns/vuejs-interview-questions
https://github.com/highwayns/awesome-github-vue
https://github.com/highwayns/vue2-elm
https://github.com/useryangtao/vue-wechat

21.unittest
https://qiita.com/oret/items/8c9a216865b088c15d68
https://jp.vuejs.org/v2/guide/unit-testing.html
https://qiita.com/TsutomuNakamura/items/975329b61e5c8a375691
https://qiita.com/chimame/items/e97883fd46b67529d59f
```
npm install -g nodeunit
```
test folderにテストプログラムを作成する
```
nodeunit test
```

22.vue plugin & vuefire
https://github.com/highwayns/vuefire
https://jp.vuejs.org/v2/guide/plugins.html

23.vue on aem
https://github.com/ahmed-musallam/AtACE-AEM-Vue

24.app-framework
https://github.com/highwayns/app-framework
