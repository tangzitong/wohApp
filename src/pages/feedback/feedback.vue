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
          :key="feedback_.key"
          :value="feedback_.userid"
          :title="feedback_.content"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
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
    window.msg = this.$t('feedback.result')
  },
  computed: {
    ...mapState({
      feedbacks: state => state.feedbacks,
    }),
    feedbackGroups() {
      return groupBy(orderBy(this.feedbacks, 'CreateDate', 'desc'), 'CreateDate')
    }
  },
  methods: {
    editorTextChange(text) {
      this.text = text
    },
    getNowYMD() {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = ('00' + (dt.getMonth() + 1)).slice(-2)
      const d = ('00' + dt.getDate()).slice(-2)
      const result = y + '/' + m + '/' + d
      return result
    },
    sendFeedback() {
      const feedback = {
        'userid': window.user.email,
        'content': this.text,
        'CreateDate': this.getNowYMD()
      }
      window.store.dispatch('putFeedback', feedback).then(function() {
        window.store.dispatch('getFeedback').then(function() {
          window.$$.alert(window.msg)
        })
      })
    }
  },
  components: {
    Editor
  }
}
</script>
