<template>
  <f7-page class="modify-page">
    <f7-navbar :title="$t('modify.title')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('modify.title')}}</h3>
      <p>{{$t('modify.content')}}</p>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('modify.complete')}}</p>
      </transition>
      <f7-list>
        <f7-list-item>
          <form @submit.prevent>
            <f7-list-item>
              <label for="name">{{$t('modify.name')}}</label>
              <input v-model.trim="name" type="text" :placeholder="$t('modify.name_')" id="name" />
            </f7-list-item>
            <f7-list-item>
              <label for="title">{{$t('modify.usertitle')}}</label>
              <input v-model.trim="title" type="text" :placeholder="$t('modify.usertitle_')" id="title" />
            </f7-list-item>
            <f7-list-item>
              <a @click="updateProfile">{{$t('modify.btn')}}</a>
            </f7-list-item>
            <f7-list-item>
              <a @click="uploadImage">{{$t('modify.image')}}</a>
            </f7-list-item>
          </form>
        </f7-list-item>
      </f7-list>
    </f7-block>
  </f7-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      name: '',
      title: '',
      showSuccess: false
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    cancel: function () {
      // Close popup
      this.updatePopup({
        key: 'imageUploaderOpened',
        value: true
      })
    },
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title
      })

      this.name = ''
      this.title = ''

      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  }
}
</script>
