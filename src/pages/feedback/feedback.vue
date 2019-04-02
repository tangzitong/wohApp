<template>
  <f7-page class="feedback-page">
    <f7-navbar :title="$t('app.feedback')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.send')" @click="sendFeedback"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <editor :placeholder="$t('feedback.placeholder')" @text:change="editorTextChange" enableTools="emotion"></editor>
    <f7-list>
      <f7-list-group v-for="(group, key) in feedbackGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item v-for="feedback_ in group"
          :key="feedback_.userid"
          :value="feedback_.userid"
          :title="feedback_.content"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
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
    }),
    feedbackGroups() {
      return groupBy(this.feedbacks, 'CreateDate')
    }
  },
  methods: {
    editorTextChange(text) {
      this.text = text
    },
    sendFeedback() {
      const feedback = {
        'userid': this.$root.user.email,
        'content': this.text,
        'CreateDate': (new Date()).toLocaleDateString()
      }
      this.$store.dispatch('putFeedback', feedback).then(function() {
        this.$store.dispatch('getFeedback').then(function() {
          window.$$.alert(this.$t('feedback.result'))
        })
      })
    }
  },
  components: {
    Editor
  }
}
</script>
