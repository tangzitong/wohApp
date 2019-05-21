<template>
  <f7-page  class="login post-login" no-navbar no-toolbar no-swipeback layout="gray">
    <transition name="fade">
        <div v-if="performingRequest" class="loading">
            <p>Loading...</p>
        </div>
    </transition>
    <f7-navbar class="login-header">
      <f7-nav-left class="avatar">
        <img :src="userInfo.avatar_url" class="avatar" alt="Image">
      </f7-nav-left>
      <f7-nav-title style="text-align: center; font-size: 25px;">{{!$root.user ? $t('login.titleSignIn') : $t('login.titleSignOut')}}</f7-nav-title>
      <f7-nav-right class="user flex-column">
        <div class="name">{{$t('app.app_knowledge')}}</div>
      </f7-nav-right>
    </f7-navbar>
    <!-- Sign in disabled alert -->
    <f7-block inner inset v-if="!firebaseConfig.allowEmailLogin && mode === 'signIn'">{{$t('login.currentlyDisabled')}}</f7-block>

    <!-- Form for email sign in / registration / password reset -->
    <f7-list form id="app-framework-login-screen" inset v-if="!$root.user && (firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration'))">
      <f7-list-item v-if="firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label>{{$t('login.email')}}</f7-label>
        <f7-input type="email" :placeholder="$t('login.email')" @input="email = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="(firebaseConfig.allowEmailLogin && mode === 'signIn') || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label>{{$t('login.password')}}</f7-label>
        <f7-input type="password" :placeholder="$t('login.password')" @input="password = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="firebaseConfig.allowEmailRegistration && mode === 'registration'">
        <f7-label>{{$t('login.passwordConfirmation')}}</f7-label>
        <f7-input type="password" :placeholder="$t('login.passwordConfirmation')" @input="passwordConfirmation = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="firebaseConfig.allowEmailRegistration && mode === 'registration'">
        <label for="title">{{$t('modify.usertitle')}}</label>
        <input type="text" :placeholder="$t('modify.usertitle_')" @input="title = $event.target.value" :value="title" />
      </f7-list-item>
    </f7-list>

    <div class="login-footer flex-row" v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <!-- Email sign in buttons -->
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleSignIn">
        <span class="text" v-text="$t('login.signIn')"></span></f7-button>
      <!-- Email registration buttons -->
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px"  @click="mode='registration'">
        <span class="text" v-text="$t('login.createAccount')"></span></f7-button>
    </div>

    <!-- Email regist buttons -->
    <div class="login-footer flex-row" v-if="mode === 'registration' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleRegistration">
        <span class="text" v-text="$t('login.handleRegistration')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px"  @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <!-- Email handle reset buttons -->
    <div class="login-footer flex-row" v-if="mode === 'reset' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleReset">
        <span class="text" v-text="$t('login.handleReset')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px"  @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <!-- Logout button -->
    <div class="login-footer flex-row" v-if="mode === 'signOut'">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleSignOut">
        <span class="text" v-text="$t('login.signOut')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px" @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <f7-block-title>{{$t('app.language')}}</f7-block-title>
    <f7-list>
        <f7-list-item radio name="language-radio" value="enUS" title="English" :checked="lang === 'enUS'" @change="saveLang"></f7-list-item>
        <f7-list-item radio name="language-radio" value="zhCN" title="简体中文" :checked="lang === 'zhCN'" @change="saveLang"></f7-list-item>
        <f7-list-item radio name="language-radio" value="jaJP" title="日本語" :checked="lang === 'jaJP'" @change="saveLang"></f7-list-item>
    </f7-list>

    <!-- Email reset buttons -->
    <div class="login-footer flex-row" v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="mode='reset'">
        <span class="text" v-text="$t('login.resetPassword')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px" @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

  </f7-page>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";

  .login.post-login {
    background-color: white;
    margin: 10px 0;
    margin-top: 0px;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    box-shadow: none;
    .login-header {
      padding: 10px;
      padding-bottom: 5px;
      justify-content: inherit;
      align-items: inherit;
      &:after {
        height: 0;
      }
      .avatar, .avatar > img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 9px;
      }
      .user {
        justify-content: center;
        .time {
          font-size: 12px;
          color: #8999a5;
          margin-top: 3px;
        }
        .name {
          color: blue;
          font-weight: bold;
          font-size: 20px;
          text-align: right;
        }
      }
    }
    .login-content{
      padding: 5px 10px;
      .image {
        margin-top: 5px;
        > img {
          width: 100%;
        }
      }
    }
    .login-footer{
      min-height: 35px;
      padding: 0;
      a.link {
        line-height: 35px;
        height: 35px;
      }
      .tool {
        justify-content: center;
        &.tool-border{
          border-right: 1px solid #e1e1e1;
        }
        &.liked{
          > span {
            color: @mainColor;
          }
        }
        > span {
          color: white;
          vertical-align: middle;
        }
        .iconfont{
          font-size: 16px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
</style>

<script>
import { mapActions, mapState } from 'vuex'
import { getLangConfig, setLangConfig } from '@/i18n'

// Export module
export default {
  data: function () {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      title: '',
      mode: '',
      performingRequest: false,
      lang: 'enUS'
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    firebaseConfig: function () {
      return this.$root.config
    }
  },
  created: function () {
    this.lang = getLangConfig()
    this.mode = window.user ? 'signOut' : 'signIn'
    this.$root.$signOut = this.handleSignOut
  },
  mounted() {
    // Workaround to close login popup on initial load and shift it back to the left -->
    // Close only if there are no login requiring pages on start or the user is logged in
    if ((!this.$root.loginRequiringPagesOnStart && !this.$root.loginRequiredForAllPages) || window.user) {
      this.updatePopup({
        key: 'loginOpened',
        value: false
      })
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    saveLang() {
      const lang = this.$$('input[name="language-radio"]:checked').val()
      setLangConfig(lang)
    },
    cancel: function () {
      if (this.mode === 'reset' || this.mode === 'registration') {
        this.mode = window.user ? 'signOut' : 'signIn'
      } else {
        // Reset form
        this.email = ''
        this.password = ''
        this.passwordConfirmation = ''
        this.title = ''
        this.mode = window.user ? 'signOut' : 'signIn'
        // Reset required URLs
        this.$root.loginRequiringPages = []
        // Close popup
        this.updatePopup({
          key: 'loginOpened',
          value: false
        })
      }
    },
    handleSignIn: function () {
      if (navigator.onLine === false) {
        window.$$.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.$$.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
      } else if (this.password === '') {
        window.$$.alert(this.$t('login.errorNoPassword'), this.$t('login.error'))
      } else {
        // Show loading indicator
        // window.f7.showIndicator()
        this.performingRequest = true
        // Sign in user
        window.firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          // On success
          .then(user => {
            this.handleSignInDone()
          })
          // On error, show alert
          .catch(err => {
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Show error alert
            window.$$.alert(this.$t('login.firebaseErrors')[err.code], this.$t('login.error'))
          })
      }
    },
    handleSignInGG: function () {
      // Show loading indicator
      // window.f7.showIndicator()
      this.performingRequest = true
      // Sign in user
      const provider = new window.firebase.auth.GoogleAuthProvider()
      window.firebase.auth.currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential
        const user = result.user
        window.store.dispatch('addProfile', {
          id: user.uid,
          name: user.email,
          title: '',
          photo: ''
        })
        this.handleSignInDone()
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        // Hide loading indicator
        // window.f7.hideIndicator()
        this.performingRequest = false
        // Show error alert
        window.$$.alert(this.$t('login.firebaseErrors')[error.code], this.$t('login.error'))
      })
    },
    handleSignInFB: function () {
      // Show loading indicator
      // window.f7.showIndicator()
      this.performingRequest = true
      // Sign in user
      const provider = new window.firebase.auth.FacebookAuthProvider()
      window.firebase.auth.currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential
        const user = result.user
        window.store.dispatch('addProfile', {
          id: user.uid,
          name: user.email,
          title: '',
          photo: ''
        })
        this.handleSignInDone()
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        // Hide loading indicator
        // window.f7.hideIndicator()
        this.performingRequest = false
        // Show error alert
        window.$$.alert(this.$t('login.firebaseErrors')[error.code], this.$t('login.error'))
      })
    },
    handleSignInTW: function () {
      // Show loading indicator
      // window.f7.showIndicator()
      this.performingRequest = true
      // Sign in user
      const provider = new window.firebase.auth.TwitterAuthProvider()
      window.firebase.auth.currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential
        const user = result.user
        window.store.dispatch('addProfile', {
          id: user.uid,
          name: user.email,
          title: '',
          photo: ''
        })
        this.handleSignInDone()
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        // Hide loading indicator
        // window.f7.hideIndicator()
        this.performingRequest = false
        // Show error alert
        window.$$.alert(this.$t('login.firebaseErrors')[error.code], this.$t('login.error'))
      })
    },
    handleSignInGH: function () {
      // Show loading indicator
      // window.f7.showIndicator()
      this.performingRequest = true
      // Sign in user
      const provider = new window.firebase.auth.GithubAuthProvider()
      window.firebase.auth.currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        // var credential = result.credential
        const user = result.user
        window.store.dispatch('addProfile', {
          id: user.uid,
          name: user.email,
          title: '',
          photo: ''
        })
        this.handleSignInDone()
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        // Hide loading indicator
        // window.f7.hideIndicator()
        this.performingRequest = false
        // Show error alert
        window.$$.alert(this.$t('login.firebaseErrors')[error.code], this.$t('login.error'))
      })
    },
    handleSignInDone: function () {
      // Hide loading indicator
      // window.f7.hideIndicator()
      this.getApplicationKnowledges()
      this.performingRequest = false
      // Reset form
      // this.email = ''
      // this.password = ''
      // this.passwordConfirmation = ''
      // this.mode = 'signOut'
      // Load required URL per view
      // const loginRequiringPages = this.$root.loginRequiringPages
      // this.$f7.views.forEach((view) => {
      //  if (loginRequiringPages[view.selector]) {
      //    this.$nextTick(() => {
      //      view.router.load({url: loginRequiringPages[view.selector], animatePages: false})
      //    })
      //  }
      // })
      // Reset required URLs
      // this.$root.loginRequiringPages = []
      // Close popup
      this.updatePopup({
        key: 'loginOpened',
        value: false
      })
    },
    getApplicationKnowledges() {
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByApplication(function(applicationknowledges) {
        window.store.dispatch('initApplicationKnowledges', applicationknowledges)
      })
      this.$f7.preloader.hide()
    },
    handleSignOut: function () {
      // this.$f7.popup('#app-framework-login-popup')
      window.firebase.auth().signOut()
        .then(() => {
          // Reset form
          this.mode = 'signIn'
          // Navigate pages back
          const navBack = (view, times) => {
            if (times > 0) {
              view.router.back()
              this.$nextTick(() => {
                times--
                navBack(view, times)
              })
            }
          }
          this.$f7.views.forEach((view) => {
            const history = view.history
            let historyRequiresLoginAtPosition = 0
            history.forEach((url) => {
              if (this.$root.urlRequiresLogin(url) === false) {
                historyRequiresLoginAtPosition++
              }
            })
            navBack(view, history.length - historyRequiresLoginAtPosition)
          })
          // Do only if there are pages which do not require login
          if (!this.$root.loginRequiredForAllPages && !this.$root.loginRequiringPagesOnStart) {
            // Close popup
            this.updatePopup({
              key: 'loginOpened',
              value: false
            })
            // Show notification
            this.$f7.addNotification({
              title: this.$t('login.signOut'),
              message: this.$t('login.signOutDone'),
              hold: 3000,
              closeIcon: false
            })
          }
        })
    },
    handleRegistration: function () {
      if (navigator.onLine === false) {
        window.$$.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.$$.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
      } else if (this.password === '') {
        window.$$.alert(this.$t('login.errorNoPassword'), this.$t('login.error'))
      } else if (this.passwordConfirmation !== this.password) {
        window.$$.alert(this.$t('login.errorPasswordsDifferent'), this.$t('login.error'))
      } else {
        // Show loading indicator
        // window.f7.showIndicator()
        this.performingRequest = true
        window.email = this.email
        window.title = this.title
        window.isRegisting = true
        // Create new user
        window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          // On success, sign in user
          .then(user => {
            // Hide loading indicator
            window.store.dispatch('addProfile', {
              id: user.uid,
              name: window.email,
              title: window.title,
              photo: ''
            })
            window.isRegisting = false
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Show notification
            this.$f7.addNotification({
              title: this.$t('login.accountCreated'),
              message: this.$t('login.checkYourInbox'),
              hold: 3000,
              closeIcon: false
            })
            // Handle sign in
            this.handleSignInDone()
          })
          // On error, show alert
          .catch(err => {
            console.log(err)
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Handle sign in
            this.handleSignInDone()
          })
      }
    },
    handleReset: function () {
      if (navigator.onLine === false) {
        window.$$.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.$$.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
      } else {
        // Show loading indicator
        // window.f7.showIndicator()
        this.performingRequest = true
        // Send reset link
        window.firebase.auth().sendPasswordResetEmail(this.email)
          .then(user => {
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Update mode
            this.mode = 'signIn'
            // On success, show notfication and login screen again
            this.$f7.addNotification({
              title: this.$t('login.emailSent'),
              message: this.$t('login.checkYourInbox'),
              hold: 3000,
              closeIcon: false
            })
            this.mode = 'signIn'
          })
          .catch(err => {
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Show error alert
            window.$$.alert(this.$t('login.firebaseErrors')[err.code], this.$t('login.error'))
          })
      }
    }
  }
}
</script>
