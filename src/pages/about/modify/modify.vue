<template>
  <f7-page class="modify-page">
    <f7-navbar :title="$t('modify.title')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('modify.title')}}</h3>
      <p>{{$t('modify.content')}}</p>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('modify.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <div class="modify_ul" style="width=100%;background:#fff;padding:10px 0 10px">
      <f7-list-item style="list-style-type: none;">
        <f7-label style="font-size: 16px;margin-bottom:6px">{{$t('modify.name')}}</f7-label>
        <f7-input type="text" :placeholder="$t('modify.name_')" @input="name = $event.target.value" :value="name" />
      </f7-list-item>
      <f7-list-item style="list-style-type: none;padding-bottom:20px">
        <f7-label style="font-size: 16px;margin-bottom:6px">{{$t('modify.usertitle')}}</f7-label>
        <f7-input type="text" :placeholder="$t('modify.usertitle_')" @input="title = $event.target.value" :value="title" />
      </f7-list-item>
      </div>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="red" fill @click="updateProfile">{{$t('modify.btn')}}</f7-button>
    </f7-block>
    <!-- Image uploader component -->
    <f7-block style="margin-bottom:30px" v-if="isUserLogin">
      <imageuploader
        :store="'users/' + id"
        :db="'users/' + id + '/photo'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="100%" />
    </f7-block>
</f7-page>
</template>

<style lang="less">
.ios .block {
    margin: 20px 0;
}
</style>

<script>
import { mapState } from 'vuex'
import imageuploader from '../../../popup/imageuploader'

export default {
  data() {
    return {
      id: '',
      name: '',
      title: '',
      showSuccess: false,
      photo: null,
      isUserLogin: !!window.user
    }
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    window.db('users/' + window.user.uid).on('value', snapshot => {
      const data = snapshot.val()
      if (data) {
        this.id = data.id
        this.name = data.login_name
        this.title = data.name
        this.photo = data.photo
      }
    })
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.login_name,
        title: this.title !== '' ? this.title : this.userProfile.name,
        photo: this.photo !== '' ? this.photo : this.userProfile.photo
      })

      this.name = ''
      this.title = ''

      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  },
  components: {
    imageuploader
  }
}
</script>
