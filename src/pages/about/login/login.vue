<template>
  <f7-page class="login-page">
    <f7-navbar :title="$t('login.title')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
        <transition name="fade">
          <div v-if="performingRequest" class="loading">
            <p>Loading...</p>
          </div>
        </transition>
        <f7-list>
          <f7-list-item :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
            <form v-if="showLoginForm" @submit.prevent>
              <h1>{{$t('login.title')}}</h1>
              <f7-list-item>
                <label for="email1">{{$t('login.userId')}}</label>
                <input v-model.trim="loginForm.email" type="text" :placeholder="$t('login.userId_')" id="email1" />
              </f7-list-item>
              <f7-list-item>
                <label for="password1">{{$t('login.password')}}</label>
                <input v-model.trim="loginForm.password" type="password" :placeholder="$t('login.password_')" id="password1" />
              </f7-list-item>
              <f7-list-item>
                <a @click="login">{{$t('login.btn')}}</a>
              </f7-list-item>
              <f7-list-item>
                <a @click="togglePasswordReset">{{$t('password.title')}}</a>
                <a @click="toggleForm">{{$t('regist.title')}}</a>
              </f7-list-item>
            </form>
            <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
              <h1>{{$t('regist.title')}}</h1>
              <f7-list-item>
                <label for="name">{{$t('regist.name')}}</label>
                <input v-model.trim="signupForm.name" type="text" :placeholder="$t('regist.name_')" id="name" />
              </f7-list-item>
              <f7-list-item>
                <label for="title">{{$t('regist.usertitle')}}</label>
                <input v-model.trim="signupForm.title" type="text" :placeholder="$t('regist.usertitle_')" id="title" />
              </f7-list-item>
              <f7-list-item>
                <label for="email2">{{$t('regist.email')}}</label>
                <input v-model.trim="signupForm.email" type="text" :placeholder="$t('regist.email_')" id="email2" />
              </f7-list-item>
              <f7-list-item>
                <label for="password2">{{$t('regist.password')}}</label>
                <input v-model.trim="signupForm.password" type="password" :placeholder="$t('regist.password_')" id="password2" />
              </f7-list-item>
              <f7-list-item>
                <a @click="signup">{{$t('regist.btn')}}</a>
                <a @click="toggleForm">{{$t('app.back')}}</a>
              </f7-list-item>
            </form>
            <form v-if="showForgotPassword" @submit.prevent class="password-reset">
              <div v-if="!passwordResetSuccess">
                <h1>{{$t('password.title')}}</h1>
                <p>{{$t('password.content')}}</p>
                <f7-list-item>
                  <label for="email3">{{$t('password.email')}}</label>
                  <input v-model.trim="passwordForm.email" type="text" :placeholder="$t('password.email_')" id="email3" />
                </f7-list-item>
                <f7-list-item>
                  <a @click="resetPassword">{{$t('password.btn')}}</a>
                  <a @click="togglePasswordReset">{{$t('app.back')}}</a>
                </f7-list-item>
              </div>
              <div v-else>
                <h1>{{$t('password.sent')}}</h1>
                <p>{{$t('password.complete')}}</p>
                <f7-list-item>
                  <a @click="togglePasswordReset">{{$t('app.back')}}</a>
                </f7-list-item>
              </div>
            </form>
          </f7-list-item>
          <f7-list-item>
            <transition name="fade">
              <div v-if="errorMsg !== ''" class="error-msg">
                <p>{{ errorMsg }}</p>
              </div>
            </transition>
          </f7-list-item>
        </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
const fb = require('../../../firebaseConfig.js')

export default {
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        title: '',
        email: '',
        password: ''
      },
      passwordForm: {
        email: ''
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ''
    }
  },
  methods: {
    toggleForm() {
      this.errorMsg = ''
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true
        this.showForgotPassword = false
        this.passwordResetSuccess = false
      } else {
        this.showLoginForm = false
        this.showForgotPassword = true
      }
    },
    login() {
      this.performingRequest = true

      fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
        this.$store.commit('setCurrentUser', user)
        this.$store.dispatch('fetchUserProfile')
        this.performingRequest = false
        this.$f7router.navigate('/')
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    },
    signup() {
      this.performingRequest = true

      fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
        this.$store.commit('setCurrentUser', user)

        // create user obj
        fb.usersCollection.doc(user.uid).set({
          name: this.signupForm.name,
          title: this.signupForm.title
        }).then(() => {
          this.$store.dispatch('fetchUserProfile')
          this.performingRequest = false
          this.$f7router.navigate('/')
        }).catch(err => {
          console.log(err)
          this.performingRequest = false
          this.errorMsg = err.message
        })
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    },
    resetPassword() {
      this.performingRequest = true

      fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
        this.performingRequest = false
        this.passwordResetSuccess = true
        this.passwordForm.email = ''
      }).catch(err => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    }
  }
}
</script>
