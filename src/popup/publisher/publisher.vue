<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.close')" @click="closePopup"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="$t('publisher.publisher')"></f7-nav-title>
      <f7-nav-right>
        <f7-link :text="$t('app.send')" @click="sendTweet"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <editor :placeholder="$t('publisher.placeholder')" @text:change="editorTextChange"></editor>
    <!-- Image -->
    <f7-block v-if="isUserLogin && imageid">
      <imageuploader
        :store="'posts/' + userid + '/' + imageid"
        :db="''" />
    </f7-block>
    <f7-block inset v-if="imagePath">
      <img :src="imagePath" width="50%" />
    </f7-block>
  </f7-page>
</template>

<script>
import Editor from '@/components/editor'
import { mapActions, mapState } from 'vuex'
import imageuploader from '../imageuploader'

export default {
  data() {
    return {
      text: '',
      imageid: null
    }
  },
  computed: {
    ...mapState({
      imagePath: state => state.imagePath,
      isUserLogin: state => state.isUserLogin,
      userid: state => state.userProfile.id
    })
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    this.imageid = window.uuid.v4().split('-').join('')
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getTimeline() {
      this.$f7.preloader.show()
      this.$root.chat.getPostList(function(posts) {
        window.store.dispatch('initTimeline', posts)
      })
      this.$f7.preloader.hide()
    },
    editorTextChange(text) {
      this.text = text
    },
    sendTweet() {
      this.$f7.preloader.show(this.$t('app.submitting'))
      this.$root.chat.createPost(this.text, this.imagePath, postkey => {
        this.$f7.addNotification({
          title: this.$t('publisher.publisher'),
          message: this.$t('publisher.published'),
          hold: 3000,
          closeIcon: false
        })
      })
      setTimeout(_ => {
        this.$f7.preloader.hide()
        this.getTimeline()
        this.closePopup()
      }, 1500)
    },
    closePopup() {
      this.updatePopup({
        key: 'publisherOpened',
        value: false
      })
    }
  },
  components: {
    Editor,
    imageuploader
  }
}
</script>
