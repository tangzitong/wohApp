<template>
  <f7-page no-navbar no-toolbar no-swipeback layout="white">
    <transition name="fade">
        <div v-if="performingRequest" class="loading">
            <p>Loading...</p>
        </div>
    </transition>
    <!-- Title -->
    <f7-block style="text-align: center; font-size: 25px;">{{!$root.user ? $t('login.titleSignIn') : $t('login.titleSignOut')}}</f7-block>

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
        <f7-label>{{$t('login.password')}}</f7-label>
        <f7-input type="password" :placeholder="$t('login.passwordConfirmation')" @input="passwordConfirmation = $event.target.value" />
      </f7-list-item>
    </f7-list>

    <!-- Email sign in buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button big raised color="green" fill @click="handleSignIn">{{$t('login.signIn')}}</f7-button>
    </f7-block>

    <!-- Email registration buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailRegistration">
      <f7-button big raised color="green" @click="mode='registration'">{{$t('login.createAccount')}}</f7-button>
    </f7-block>
    <f7-block v-if="mode === 'registration' && firebaseConfig.allowEmailRegistration">
      <f7-button big raised color="green" fill @click="handleRegistration">{{$t('login.handleRegistration')}}</f7-button>
    </f7-block>

    <!-- Email reset buttons -->
    <f7-block v-if="mode === 'signIn' && firebaseConfig.allowEmailLogin">
      <f7-button big raised color="orange" @click="mode='reset'">{{$t('login.resetPassword')}}</f7-button>
    </f7-block>
    <f7-block v-if="mode === 'reset' && firebaseConfig.allowEmailLogin">
      <f7-button big raised color="orange" fill @click="handleReset">{{$t('login.handleReset')}}</f7-button>
    </f7-block>

    <!-- Logout button -->
    <f7-block v-if="mode === 'signOut'">
      <f7-button big raised color="red" fill @click="handleSignOut">{{$t('login.signOut')}}</f7-button>
    </f7-block>

    <!-- Cancel button -->
    <f7-block v-if="(!$root.loginRequiringPagesOnStart && !$root.loginRequiredForAllPages) || mode !== 'signIn'">
      <f7-button big raised color="red" @click="cancel">{{$t('login.cancel')}}</f7-button>
    </f7-block>

  </f7-page>
</template>
<script>
import { mapActions } from 'vuex'

// Export module
export default {
  data: function () {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
      mode: '',
      performingRequest: false
    }
  },
  computed: {
    firebaseConfig: function () {
      return this.$root.config
    }
  },
  created: function () {
    this.mode = this.$root.user ? 'signOut' : 'signIn'
    this.$root.$signOut = this.handleSignOut
  },
  mounted() {
    // Workaround to close login popup on initial load and shift it back to the left -->
    // Close only if there are no login requiring pages on start or the user is logged in
    if ((!this.$root.loginRequiringPagesOnStart && !this.$root.loginRequiredForAllPages) || this.$root.user) {
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
    cancel: function () {
      if (this.mode === 'reset' || this.mode === 'registration') {
        this.mode = this.$root.user ? 'signOut' : 'signIn'
      } else {
        // Reset form
        this.email = ''
        this.password = ''
        this.passwordConfirmation = ''
        this.mode = this.$root.user ? 'signOut' : 'signIn'
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
        window.f7.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.f7.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
      } else if (this.password === '') {
        window.f7.alert(this.$t('login.errorNoPassword'), this.$t('login.error'))
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
            window.f7.alert(this.$t('login.firebaseErrors')[err.code], this.$t('login.error'))
          })
      }
    },
    handleSignInDone: function () {
      // Hide loading indicator
      // window.f7.hideIndicator()
      this.performingRequest = false
      // Reset form
      this.email = ''
      this.password = ''
      this.passwordConfirmation = ''
      this.mode = 'signOut'
      // Load required URL per view
      const loginRequiringPages = this.$root.loginRequiringPages
      this.$f7.views.forEach((view) => {
        if (loginRequiringPages[view.selector]) {
          this.$nextTick(() => {
            view.router.load({url: loginRequiringPages[view.selector], animatePages: false})
          })
        }
      })
      // Reset required URLs
      this.$root.loginRequiringPages = []
      // Close popup
      this.updatePopup({
        key: 'loginOpened',
        value: false
      })
    },
    handleSignOut: function () {
      this.$f7.popup('#app-framework-login-popup')
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
            window.f7.addNotification({
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
        window.f7.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.f7.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
      } else if (this.password === '') {
        window.f7.alert(this.$t('login.errorNoPassword'), this.$t('login.error'))
      } else if (this.passwordConfirmation !== this.password) {
        window.f7.alert(this.$t('login.errorPasswordsDifferent'), this.$t('login.error'))
      } else {
        // Show loading indicator
        // window.f7.showIndicator()
        this.performingRequest = true
        // Create new user
        window.firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          // On success, sign in user
          .then(user => {
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Show notification
            window.f7.addNotification({
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
            // Hide loading indicator
            // window.f7.hideIndicator()
            this.performingRequest = false
            // Show error alert
            window.f7.alert(this.$t('login.firebaseErrors')[err.code], this.$t('login.error'))
          })
      }
    },
    handleReset: function () {
      if (navigator.onLine === false) {
        window.f7.alert(this.$t('login.errorOffline'), this.$t('login.error'))
      } else if (this.email === '') {
        window.f7.alert(this.$t('login.errorNoEmail'), this.$t('login.error'))
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
            window.f7.addNotification({
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
            window.f7.alert(this.$t('login.firebaseErrors')[err.code], this.$t('login.error'))
          })
      }
    }
  }
}
</script>
