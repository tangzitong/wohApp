<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.close')" @click="closeApplication"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="$t('application.application')"></f7-nav-title>
      <f7-nav-right>
        <f7-link :text="$t('app.send')" @click="sendTweet"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <editor :placeholder="$t('application.placeholder')" @text:change="editorTextChange"></editor>
  </f7-page>
</template>

<script>
import Editor from '@/components/editor'
import { mapActions } from 'vuex'
import { getDataType, getDataId } from '@/code'

export default {
  data() {
    return {
      text: '',
      id: '',
      type: ''
    }
  },
  methods: {
    ...mapActions([
      'updateApplication'
    ]),
    editorTextChange(text) {
      this.text = text
    },
    sendTweet() {
      const id = getDataId()
      const type = getDataType()
      this.$f7.preloader.show(this.$t('app.submitting'))
      switch (type) {
        case 'Job':
          this.$root.chat.addJobApplication(id, this.text, function(applicationkey) {
            console.log('Add Job Application success')
          })
          break
        case 'Company':
          this.$root.chat.addCompanyApplication(id, this.text, function(applicationkey) {
            console.log('Add Company Application success')
          })
          break
        case 'Project':
          this.$root.chat.addProjectApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Project Application success')
          })
          break
        case 'Talent':
          this.$root.chat.addTalentlication(this.id, this.text, function(applicationkey) {
            console.log('Add Talent Application success')
          })
          break
        case 'Dispatcher':
          this.$root.chat.addDispatcherApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Dispatcher Application success')
          })
          break
        case 'Consultant':
          this.$root.chat.adConsultantApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Consultant Application success')
          })
          break
        case 'Knowledge':
          this.$root.chat.adKnowledgeApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Knowledge Application success')
          })
          break
        case 'Tool':
          this.$root.chat.adToolApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Tool Application success')
          })
          break
        case 'Event':
          this.$root.chat.adEventApplication(this.id, this.text, function(applicationkey) {
            console.log('Add Event Application success')
          })
          break
      }
      setTimeout(_ => {
        this.$f7.preloader.hide()
        this.closeApplication()
      }, 1500)
    },
    closeApplication() {
      this.updateApplication({
        key: 'applicationOpened',
        value: false
      })
    }
  },
  components: {
    Editor
  }
}
</script>
