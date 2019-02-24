<template>
  <f7-page class="feedback-page">
    <f7-navbar :title="$t('app.feedback')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.send')" @click="sendFeedback"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <editor :placeholder="$t('feedback.placeholder')" @text:change="editorTextChange" enableTools="emotion"></editor>
    <f7-list>
      <f7-list-group v-for="feedback_ in feedbacks" :key="feedback_.id">
        <f7-list-item name="feedback-radio"
                      :value="feedback_.id"
                      :title="feedback_.content"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import Editor from '@/components/editor'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      text: ''
    }
  },
  mounted() {
    this.$store.dispatch('getFeedback')
  },
  computed: {
    ...mapState({
      feedbacks: state => state.feedbacks,
    })
  },
  methods: {
    editorTextChange(text) {
      this.text = text
    },
    sendFeedback() {
      const feedback = {
        'data': [{
          'id': '2',
          'userid': '1',
          'content': this.text,
          'CreateDate': '2019年2月13日'
        }]
      }
      this.$store.dispatch('putFeedback', feedback)
      $$.alert(this.$t('feedback.result'))
    }
  },
  components: {
    Editor
  }
}
</script>
