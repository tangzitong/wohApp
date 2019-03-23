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
              <input type="text" :placeholder="$t('modify.name_')" @input="name = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="title">{{$t('modify.usertitle')}}</label>
              <input type="text" :placeholder="$t('modify.usertitle_')" @input="title = $event.target.value" />
            </f7-list-item>
          </form>
        </f7-list-item>
      </f7-list>
    </f7-block>
    <f7-block v-if="$root.user">
      <a @click="updateProfile">{{$t('modify.btn')}}</a>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <imageuploader
        :store="'users/' + $root.user.uid"
        :db="'users/' + $root.user.uid + '/photo'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="100%" />
    </f7-block>
</f7-page>
</template>

<script>
import { mapState } from 'vuex'
import imageuploader from '../../../popup/imageuploader'

export default {
  data() {
    return {
      name: '',
      title: '',
      showSuccess: false,
      photo: null
    }
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    window.db('users/' + window.user.uid).on('value', snapshot => {
      const data = snapshot.val()
      if (data) {
        this.name = data.name
        this.title = data.title
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
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title,
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
