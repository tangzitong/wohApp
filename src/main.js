import _ from 'lodash'

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
import { getLoginUser, setCurrentUser, fetchUserProfile } from './store/actions'
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
// Load image-uploader component
// Vue.component('image-uploader', require('./popup/imageuploader/imageuploader.vue'))

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
window.vm = new Vue({
  el: '#app',
  store,
  i18n,
  template: '<app/>',
  data: {
    loginRequiredForAllPages: false,
    loginRequiringPagesOnStart: false,
    resetLocalStorageOnVersionChange: true,
    projectVersion: '1.0',
    config: fb.dbConfig,
    user: null,
    db: null,
    storage: null,
    timestamp: null,
    auth: null,
    chat: null,
    data: {}
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
    fb.auth.onAuthStateChanged(user => {
      this.user = user ? {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      } : null
      if (user) {
        setCurrentUser(store, user)
        fetchUserProfile(store)
        if (this.chat) {
          this.chat.setUser(user.uid, user.displayName)
        }
      }
    })
    // Use database service
    this.db = function (path) {
      return fb.database.ref(path)
    }
    this.timestamp = fb.timestamp
    // Use storage service
    this.storage = function (path) {
      return fb.storage.ref(path)
    }
    this.auth = fb.auth
    this.chat = fb.chat
    this.$nextTick(function () {
      this.$pageKey = this.getKey()
      this.restoreData()
    })
    // reset local storage after version changed
    if (this.config.resetLocalStorageOnVersionChange === true &&
      window.localStorage.projectVersion !== undefined &&
      window.localStorage.projectVersion !== this.projectVersion) {
      // Empty local storage
      for (const item in window.localStorage) {
        if (!/(firebase:(.+)|user|cacheResetAlert)/.test(item) && item !== 'user') {
          window.localStorage.removeItem(item)
        }
      }
    }
    // Update framework version in local storage
    window.localStorage.projectVersion = this.projectVersion
    if (window.cordova) {
      const self = this
      window.NativeStorage.getItem('data', function (data) {
        self.data = data
      }, function () {
        self.data = {}
      })
    } else {
      this.data = window.localStorage.data !== undefined ? JSON.parse(window.localStorage.data) : {}
    }
  },
  updated: function () {
    this.rememberData()
  },
  computed: {
    // Legacy support
    $get () {
      return this.$root.data
    },
    // Authentication
    $fireAuth () {
      return window.firebase && window.firebase.auth ? window.firebase.auth : null
    },
    $user () {
      return this.$root.user
    },
    // Realtime Database
    $fireDB () {
      return window.firebase && window.firebase.database ? (ref) => { return window.firebase.database().ref(ref) } : null
    },
    // Cloud Storage
    $fireStore () {
      return window.firebase && window.firebase.storage ? (ref) => { return window.firebase.storage().ref(ref) } : null
    }
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
    storage: function (newStore) {
      // Update window object
      window.storage = newStore
    },
    timestamp: function (newTimestamp) {
      // Update window object
      window.timestamp = newTimestamp
    },
    stateReady: function () {
      if (window.localStorage.cacheResetAlert !== undefined) {
        window.f7.alert(window.localStorage.cacheResetAlert, () => {
          // Prevent to show alert twice
          window.localStorage.removeItem('cacheResetAlert')
        })
      }
    }

  },
  firebase: {
    jobs: fb.database.ref('jobs'),
    companys: fb.database.ref('companys'),
    projects: fb.database.ref('projects'),
    talents: fb.database.ref('talents'),
    consultants: fb.database.ref('consultants'),
    dispatchers: fb.database.ref('dispatchers'),
    knowledges: fb.database.ref('knowledges'),
    tools: fb.database.ref('tools'),
    events: fb.database.ref('events')
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
    // Legacy support
    $save (...args) {
      this.saveData(...args)
    },
    $remove (...args) {
      this.removeData(...args)
    },
    $db (...args) {
      // Check arguments
      if (args.length < 1 || args.length > 2 || typeof args[0] !== 'string') {
        throw new Error('$db() should have one or two arguments, the first one should be a string')
      // Read data
      } else if (args.length === 1) {
        return _.get(this.data, args[0], undefined)
      // Write/Remove data
      } else {
        // Clone current data
        const data = _.cloneDeep(this.data)
        // Update data
        if (args[1] !== null) {
          _.set(data, args[0], args[1])
        // Remove data
        } else {
          _.unset(data, args[0])
        }
        // Save data to Vue object
        this.$set(this, 'data', data)
        // Save data to local storage
        if (window.cordova) {
          window.NativeStorage.setItem('data', data)
        } else {
          window.localStorage.data = JSON.stringify(this.data)
        }
      }
    },
    // Legacy support
    saveData: function (path, value) {
      this.$db(path, value)
    },
    removeData: function (path) {
      this.$db(path, null)
    },
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
    },
    restoreData: function () {
      if (this.$pageKey) {
        if (window.localStorage[this.$pageKey]) {
          const data = JSON.parse(window.localStorage[this.$pageKey])
          for (const item in data) {
            this.$data[item] = data[item]
          }
        }
      }
    },
    rememberData: function () {
      if (this.$pageKey) {
        const data = {}
        for (const item in this.$data) {
          data[item] = this.$data[item]
        }
        window.localStorage[this.$pageKey] = JSON.stringify(data)
      }
    },
    getKey: function () {
      if (!this.$options._componentTag && this.$el && this.$el.f7PageData && this.$el.f7PageData.view && this.$el.f7PageData.url) {
        let url = this.$el.f7PageData.url
        if (url.substr(0, 1) === '/') url = url.substr(1)
        if (url.substr(url.length - 1, 1) === '/') url = url.substr(0, url.length - 1)
        const view = this.$el.f7PageData.view.selector
        const key = 'data|' + view + '|' + url
        return key
      } else {
        return null
      }
    }
  },
  // Register App Component
  components: {
    app: App
  }
})

getLoginUser(store)
