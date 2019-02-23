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

// Import Routes
import Routes from './routes.js'
// Import App Component
import App from './app'

// Import Vuex store
import store from './store'
import { getLoginUser } from './store/actions'
import * as types from './store/mutation-types'
import VueRouter from 'vue-router'

// import network framework
import './network'

// import i18n support
import i18n from './i18n'

// import store cache
import StoreCache from './utils/storeCache'

import { isAndroid } from './utils/appFunc'

const fb = require('./firebaseConfig.js')
// Init F7 Vue Plugin
Vue.use(Framework7Vue, Framework7)

const router = new VueRouter({
  Routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = fb.auth().currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit(types.SET_CURRENTUSER, user)
    store.dispatch('fetchUserProfile')
    fb.chat.setUser(user.uid, user.name, function(user) {
      fb.chat.resumeSession()
    })

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit(types.SET_USERPROFILE, doc.data())
    })

    // realtime updates from our posts collection
    fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      // check if created by currentUser
      let createdByCurrentUser = false
      if (querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges[0].doc.data().userId
      }

      // add new posts to hiddenPosts array after initial load
      if (querySnapshot.docChanges.length !== querySnapshot.docs.length &&
        querySnapshot.docChanges[0].type === 'added' && !createdByCurrentUser) {
        const post = querySnapshot.docChanges[0].doc.data()
        post.id = querySnapshot.docChanges[0].doc.id

        store.commit(types.SET_HIDDENPOSTS, post)
      } else {
        const postsArray = []

        querySnapshot.forEach(doc => {
          const post = doc.data()
          post.id = doc.id
          postsArray.push(post)
        })

        store.commit(types.SET_POSTS, postsArray)
      }
    })
  }
})

// Init App
new Vue({
  el: '#app',
  store,
  i18n,
  template: '<app/>',
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
