<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.close')" @click="closePopup"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="$t('home.comment')"></f7-nav-title>
      <f7-nav-right>
        <f7-link :text="$t('app.send')" @click="sendComment"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <editor :placeholder="$t('comment.placeholder')" @text:change="editorTextChange" enableTools="emotion,at"></editor>
  </f7-page>
</template>

<script>
import Editor from '@/components/editor'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      text: '',
      name: null,
      title: null
    }
  },
  computed: {
    ...mapState({
      knowledgekey: state => state.popup.knowledgekey,
      knowledgecontentkey: state => state.popup.knowledgecontentkey,
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
    })
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    setName() {
      for (const knowledge in this.knowledges) {
        if (this.knowledges[knowledge].id === this.knowledgekey) {
          this.name = this.knowledges[knowledge].name
          break
        }
      }
    },
    setTitle() {
      for (const knowledgecontent in this.knowledgecontents) {
        if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
          this.title = this.knowledgecontents[knowledgecontent].title
          break
        }
      }
    },
    editorTextChange(text) {
      this.text = text
    },
    getComments() {
      this.$root.chat.getKnowledgeContentComments(this.knowledgekey, this.knowledgecontentkey, function(knowledgecomments) {
        window.store.dispatch('initKnowledgeComments', knowledgecomments)
      })
    },
    sendComment() {
      this.$f7.preloader.show(this.$t('app.submitting'))
      this.setName()
      this.setTitle()
      this.$root.chat.addKnowledgeContentComment(this.knowledgekey, this.knowledgecontentkey, this.name, this.title, this.text, function(commentKey) {
        console.log(commentKey + ' comment added')
      })
      setTimeout(_ => {
        this.$root.chat.getKnowledgeContentComments(this.knowledgekey, this.knowledgecontentkey, function(knowledgecomments) {
          window.store.dispatch('initKnowledgeComments', knowledgecomments)
        })
        this.$f7.preloader.hide()
        this.closePopup()
      }, 1500)
    },
    closePopup() {
      this.updatePopup({
        key: 'knowledgecommentOpened',
        value: false
      })
    }
  },
  components: {
    Editor
  }
}
</script>
