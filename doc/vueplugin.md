VUEプラグインの使用
===

# // `MyPlugin.install(Vue)` を呼び出します
```
Vue.use(MyPlugin)

new Vue({
  // ... オプション
})

いくつかのオプションに任意で渡すことができます:
Vue.use(MyPlugin, { someOption: true })
```

# vue-router のような Vue.js 公式プラグインによって提供されるプラグイン
```
// Browserify または Webpack 経由で CommonJS を使用
var Vue = require('vue')
var VueRouter = require('vue-router')

// これを呼びだすのを忘れてはいけません
Vue.use(VueRouter)
```

# プラグインの記述
```
MyPlugin.install = function (Vue, options) {
  // 1. グローバルメソッドまたはプロパティを追加
  Vue.myGlobalMethod = function () {
    // 何らかのロジック ...
  }
  // 2. グローバルアセットを追加
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 何らかのロジック ...
    }
    ...
  })
  // 3. 1つ、または複数のコンポーネントオプションを注入
  Vue.mixin({
    created: function () {
      // 何らかのロジック ...
    }
    ...
  })
  // 4. インスタンスメソッドを追加
  Vue.prototype.$myMethod = function (methodOptions) {
    // 何らかのロジック ...
  }
}
```

# vuefire
```
npm install vue firebase vuefire --save
```

```
var Vue = require('vue')
var VueFire = require('vuefire')
var firebase = require('firebase')

// explicit installation required in module environments
Vue.use(VueFire)

var firebaseApp = firebase.initializeApp({ ... })
var db = firebaseApp.database()

var vm = new Vue({
  el: '#demo',
  firebase: {
    // simple syntax, bind as an array by default
    anArray: db.ref('url/to/my/collection'),
    // can also bind to a query
    // anArray: db.ref('url/to/my/collection').limitToLast(25)
    // full syntax
    anObject: {
      source: db.ref('url/to/my/object'),
      // optionally bind as an object
      asObject: true,
      // optionally provide the cancelCallback
      cancelCallback: function () {},
      // this is called once the data has been retrieved from firebase
      readyCallback: function () {}
    }
  }
})

<div id="demo">
  <pre>{{ anObject }}</pre>
  <ul>
    <li v-for="item in anArray">{{ item.text }}</li>
  </ul>
</div>

// add an item to the array
vm.$firebaseRefs.anArray.push({
  text: 'hello'
})

vm.$bindAsObject('user', myFirebaseRef.child('user'))
vm.$bindAsArray('items', myFirebaseRef.child('items').limitToLast(25))
// You can also pass cancelCallback and readyCallback callbacks functions as
// a third and fourth arguments. Any of them can be omitted by passing null
vm.$bindAsObject('user', myFirebaseRef.child('user'), null, () => console.log('Ready fired!'))

// References are unbound when the component is destroyed but you can manually unbind a reference
// if needed
vm.$unbind('items')

<input v-model="item" placeholder="Add an item"/>
<button @click="addItem">Add item</button>
export default {
  data () {
    return {
      item: ''
    }
  },
  firebase: {
    items: db.ref('items')
  },
  methods: {
    addItem () {
      this.$firebaseRefs.items.push({
        name: this.item
      })
    }
  }
}
```
