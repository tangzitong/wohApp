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
      <f7-nav-title style="text-align: center; font-size: 22px;">{{!$root.user ? $t('login.titleSignIn') : $t('login.titleSignOut')}}</f7-nav-title>
      <f7-nav-right class="user flex-column">
        <div class="name">{{$t('app.app_knowledge')}}</div>
      </f7-nav-right>
    </f7-navbar>
    <!-- Sign in disabled alert -->
    <f7-block inner inset v-if="!firebaseConfig.allowEmailLogin && mode === 'signIn'">{{$t('login.currentlyDisabled')}}</f7-block>

    <!-- Form for email sign in / registration / password reset -->
    <f7-list form id="app-framework-login-screen" inset v-if="!$root.user && (firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration'))">
      <f7-list-item v-if="firebaseConfig.allowEmailLogin || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label style="font-size: 16px; margin-bottom: 6px">{{$t('login.email')}}</f7-label>
        <f7-input type="email" :placeholder="$t('login.email_')" @input="email = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="(firebaseConfig.allowEmailLogin && mode === 'signIn') || (firebaseConfig.allowEmailRegistration && mode === 'registration')">
        <f7-label style="font-size: 16px; margin-bottom: 6px">{{$t('login.password')}}</f7-label>
        <f7-input type="password" :placeholder="$t('login.password_')" @input="password = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="firebaseConfig.allowEmailRegistration && mode === 'registration'">
        <f7-label style="font-size: 16px; margin-bottom: 6px">{{$t('login.passwordConfirmation')}}</f7-label>
        <f7-input type="password" :placeholder="$t('login.passwordConfirmation')" @input="passwordConfirmation = $event.target.value" />
      </f7-list-item>
      <f7-list-item v-if="firebaseConfig.allowEmailRegistration && mode === 'registration'">
        <f7-label style="font-size: 16px; margin-bottom: 6px">{{$t('modify.usertitle')}}</f7-label>
        <f7-input type="text" :placeholder="$t('modify.usertitle_')" @input="title = $event.target.value" :value="title" />
      </f7-list-item>
    </f7-list>

    <div class="login-footer flex-row1" v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <!-- Email sign in buttons -->
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "background:#fc8c32;line-height:27pxx" @click="handleSignIn">
        <span class="text" v-text="$t('login.signIn')"></span></f7-button>
      <!-- Email registration buttons -->
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px"  @click="mode='registration'">
        <span class="text" v-text="$t('login.createAccount')"></span></f7-button>
    </div>

    <!-- Email regist buttons -->
    <div class="login-footer flex-row1" v-if="mode === 'registration' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleRegistration">
        <span class="text" v-text="$t('login.handleRegistration')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "background:#c4c4c4;line-height:27px"  @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <!-- Email handle reset buttons -->
    <div class="login-footer flex-row1" v-if="mode === 'reset' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleReset">
        <span class="text" v-text="$t('login.handleReset')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "background:#c4c4c4;line-height:27px"  @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <!-- Logout button -->
    <div class="login-footer flex-row1" v-if="mode === 'signOut'">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="handleSignOut">
        <span class="text" v-text="$t('login.signOut')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "background:#c4c4c4;line-height:27px" @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>

    <div class="login-reset" v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <div @click="mode='reset'"><span class="text"  v-text="$t('login.resetPassword')"></span></div>
      <div @click="cancel"><span class="text" style="color:#999;margin-left:80px" v-text="$t('login.cancel')"></span></div>
    </div>

    <f7-block-title class="change_lan">{{$t('app.language')}}</f7-block-title>
    <div class="lan_link">
        <f7-list-item v-if="lang === 'enUS'" style="filter: grayscale(0);" value="enUS" @click="saveLang('enUS')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/en.png?alt=media&token=11c95a87-996b-4ca8-bb37-4e81579a7716" alt="ENGLISH" style="width:60px">
        </f7-list-item>
        <f7-list-item v-if="lang !== 'enUS'" style="filter: grayscale(1);" value="enUS" @click="saveLang('enUS')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/en.png?alt=media&token=11c95a87-996b-4ca8-bb37-4e81579a7716" alt="ENGLISH" style="width:60px">
        </f7-list-item>
        <f7-list-item v-if="lang === 'zhCN'" style="filter: grayscale(0);" value="zhCN" @click="saveLang('zhCN')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/cn.png?alt=media&token=bb9fa1f3-07bf-4edd-bb1b-c159007d77a0" alt="CHINESE" style="width:60px">
        </f7-list-item>
        <f7-list-item v-if="lang !== 'zhCN'" style="filter: grayscale(1);" value="zhCN" @click="saveLang('zhCN')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/cn.png?alt=media&token=bb9fa1f3-07bf-4edd-bb1b-c159007d77a0" alt="CHINESE" style="width:60px">
        </f7-list-item>
        <f7-list-item v-if="lang === 'jaJP'" style="filter: grayscale(0);" value="jaJP" @click="saveLang('jaJP')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/jp.png?alt=media&token=41fb9269-7af9-4c19-8651-16c4c013d811" alt="JAPNESE" style="width:60px">
        </f7-list-item>
        <f7-list-item v-if="lang !== 'jaJP'" style="filter: grayscale(1);" value="jaJP" @click="saveLang('jaJP')">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/jp.png?alt=media&token=41fb9269-7af9-4c19-8651-16c4c013d811" alt="JAPNESE" style="width:60px">
        </f7-list-item>
    </div>

    <!--<f7-list>
        <f7-list-item radio name="language-radio" value="enUS" :checked="lang === 'enUS'" @change="saveLang">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/en.png?alt=media&token=11c95a87-996b-4ca8-bb37-4e81579a7716" alt="ENGLISH">
        </f7-list-item>
        <f7-list-item radio name="language-radio" value="zhCN" :checked="lang === 'zhCN'" @change="saveLang">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/cn.png?alt=media&token=bb9fa1f3-07bf-4edd-bb1b-c159007d77a0" alt="CHINESE">
        </f7-list-item>
        <f7-list-item radio name="language-radio" value="jaJP" :checked="lang === 'jaJP'" @change="saveLang">
          <img src="https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/jp.png?alt=media&token=41fb9269-7af9-4c19-8651-16c4c013d811" alt="JAPNESE">
        </f7-list-item>
    </f7-list>-->

    <!-- Email reset buttons
    <div class="login-footer flex-row" v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="mode='reset'">
        <span class="text" v-text="$t('login.resetPassword')"></span></f7-button>
      <f7-button class="tool flex-rest-width" big color="blue" style = "line-height:27px" @click="cancel">
        <span class="text" v-text="$t('login.cancel')"></span></f7-button>
    </div>-->

  </f7-page>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";

.ios .list .item-inner:after {
  display: none;
}
.ios .item-input-wrap {
  border: #ddd solid 1px;
}
.list .item-inner {
  padding-top: 12px;
  padding-bottom: 8px;
}
.login-reset {
  display: flex;
  flex-direction: row;
  justify-content:space-around;
  //margin-top: 8px;

  .text {
    color:#0a94ed;
    font-size: 16px;
  }
}
.flex-row1{
  display: flex !important;
  flex-direction: column;    //登录按钮竖排放0603
}
.lan_link {
  align-items: center;
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin: 10px;
}
.ios .list{
  margin-top: 20px;
  //margin-bottom: 24px;
}
.list li{
  //margin-bottom: 10px;
}

.ios .block-title {
  margin: 50px 0 20px;
  text-align:center;
  font-size:18px;
  color:#888;
}
.ios label.item-radio .item-inner {
    padding: 0;
}
  .login.post-login {
    background-color: white;
    //padding: 0;        //0603无效化
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
          color: white;     //更改“海威学习”字样的颜色为白色0603
          //font-weight: bold;   更改字体样式为正常
          font-size: 16px;     //更改字体大小
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
      margin-left: 30px;
      margin-right: 30px;
      //padding: 0;   //0603无效化
      a.link {
        line-height: 35px;
        height: 35px;
      }
      .tool {
        justify-content: center;
        margin-bottom: 12px;   //按钮的间距0604
        //padding: 0;             //0603无效化
        &.tool-border{
          //border-right: 1px solid #e1e1e1;   //0603无效化
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
          font-size: 18px;  //登录按钮字的大小0601
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

    saveLang(lang) {
      // const lang = this.$$('input[removestyle("filter: grayscale(1);")]:checked').val()
      this.lang = lang
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
