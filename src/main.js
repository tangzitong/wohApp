// Auto polyfill
import 'es6-object-assign/auto'
import 'es6-promise/auto'

// Import Vue
import Vue from 'vue'
// Import F7, F7-Vue
import Framework7 from 'framework7/dist/framework7.esm.bundle.js'
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js'

// Import F7 Styles
import 'framework7/dist/css/framework7.css'

// Import App Custom Styles
import './assets/fonts/iconfont.css'
import './assets/styles/app.less'
import './assets/scss/app.scss'
import './assets/css/framework7-icons.css'

// Import Routes
import Routes from './routes.js'
// Import App Component
import App from './app.vue'

// Import Vuex store
import store from './store'
import { getLoginUser } from './store/actions'
import VueRouter from 'vue-router'

// import network framework
import './network'

// import i18n support
import i18n from './i18n'

// import store cache
import StoreCache from './utils/storeCache'

import { isAndroid } from './utils/appFunc'

import * as fb from './firebaseConfig.js'

// Import vuefire
const VueFire = require('vuefire')

// Init F7 Vue Plugin
Vue.use(Framework7Vue, Framework7)
Vue.use(VueFire)

const router = new VueRouter({
  Routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = this.$root.user

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

// Init App
new Vue({
  el: '#app',
  store,
  i18n,
  template: '<app/>',
  data: {
    loginRequiredForAllPages: false,
    loginRequiringPagesOnStart: false,
    config: fb.dbConfig,
    user: null,
    db: null,
    store: null,
    timestamp: null,
    auth: null,
    chat: null
  },
  beforeCreate: function () {
    window.sortObject = require('./sort-object')
  },
  created: function () {
    // Use auth service
    // Get initial user data from local storage
    this.user = window.localStorage.user ? JSON.parse(window.localStorage.user) : null
    // Clean local storage if user is not logged in initially
    if (!window.localStorage.user) this.cleanLocalStorageAfterLogut()
    // Monitor user changes
    fb.auth().onAuthStateChanged(user => {
      this.user = user ? {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      } : null
    })
    // Use database service
    this.db = function (path) {
      return fb.database().ref(path)
    }
    this.timestamp = fb.database.ServerValue.TIMESTAMP
    // Use storage service
    this.store = function (path) {
      return fb.storage().ref(path)
    }
    this.auth = fb.auth
    this.chat = fb.chat
  },
  // Watch for changes
  watch: {
    user: function (newUser) {
      // Update local storage
      if (newUser === null) {
        window.localStorage.removeItem('user')
        this.cleanLocalStorageAfterLogut()
      } else {
        window.localStorage.user = JSON.stringify(newUser)
      }
      // Update window object
      window.user = newUser
    },
    db: function (newDB) {
      // Update window object
      window.db = newDB
    },
    store: function (newStore) {
      // Update window object
      window.store = newStore
    },
    timestamp: function (newTimestamp) {
      // Update window object
      window.timestamp = newTimestamp
    }
  },
  firebase: {
  },
  // Init Framework7 by passing parameters here
  framework7: {
    id: 'com.highwayns.wohapp', // App bundle ID
    name: 'wohApp', // App name
    theme: isAndroid() ? 'md' : 'ios',
    // App routes
    routes: Routes,
    dialog: {
      title: i18n.t('app.modal.title'),
      buttonOk: i18n.t('app.modal.button_ok'),
      buttonCancel: i18n.t('app.cancel')
    }
  },
  methods: {
    onF7Ready(f7) {
      // mount global functions
      window.$$ = {
        alert: f7.dialog.alert,
        confirm: f7.dialog.confirm,
        prompt: f7.dialog.prompt,
        cache: new StoreCache('vuex')
      }
    },
    cleanLocalStorageAfterLogut: function () {
      for (const item in window.localStorage) {
        // History
        if (/^urls\|([0-9a-zA-Z._-]+)$/.test(item)) {
          const urls = JSON.parse(window.localStorage[item])
          const newUrls = []
          let loginRequired = false
          urls.map((url) => {
            if (this.urlRequiresLogin(url)) {
              loginRequired = true
            } else if (!loginRequired) {
              newUrls.push(url)
            }
          })
          window.localStorage[item] = JSON.stringify(newUrls)
        // Component data and scroll positions
        } else if (/(scroll|data)\|[0-9a-zA-Z._-]+\|(.+)$/.test(item)) {
          const url = item.match(/(scroll|data)\|[0-9a-zA-Z._-]+\|(.+)$/)[2]
          if (this.urlRequiresLogin(url)) {
            window.localStorage.removeItem(item)
          }
        }
      }
    }
  },
  // Register App Component
  components: {
    app: App
  }
})

getLoginUser(store)
