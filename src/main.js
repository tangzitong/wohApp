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
  const currentUser = fb.currentUser

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
    loginRequiringPagesOnStart: true,
    config: fb.dbConfig，
    user：fb.currentUser,
    db: fb.database,
    auth: fb.auth,
    chat: fb.chat
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
    }
  },
  // Register App Component
  components: {
    app: App
  }
})

getLoginUser(store)
