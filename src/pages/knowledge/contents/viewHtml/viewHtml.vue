<template>
  <f7-page class="knowledge">
    <f7-navbar :title="$t('app.study')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{title}}</h3>
    </f7-block>
    <f7-list>
      <f7-list-item>
        {{htmlcontent}}
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item>
        <f7-button v-if="ord > 0" big raised color="green" fill @click="goPrev">{{$t('app.prev')}}</f7-button>
        <f7-button v-if="ord < content_count" big raised color="green" fill @click="goNext">{{$t('app.next')}}</f7-button>
      </f7-list-item>
    </f7-list>
</f7-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      knowledgekey: null,
      content_count: 0,
      knowledgecontentkey: null,
      nextContentType: 'Html',
      nextknowledgecontentkey: null,
      prevContentType: 'Html',
      prevknowledgecontentkey: null,
      htmlcontent: null,
      ord: 0,
      title: '',
      userid: null
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      learningstatus: state => state.learningstatus,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted: function () {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
    this.knowledgecontentkey = query.contentid
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.knowledgekey) {
      this.$root.chat.getKnowledgeContents(this.knowledgekey, data => {
        if (data) {
          this.$store.dispatch('initKnowledgecontents', data)
        }
      })
      this.$root.chat.getLearningStatus(data => {
        if (data) {
          this.$store.dispatch('initLearningstatus', data)
        }
      })
    }
    this.getKnowledgeHtml()
    this.getKnowledgeContentsCount()
  },
  methods: {
    getKnowledgeContentsCount() {
      if (this.knowledgekey) {
        for (const knowledge in this.knowledges) {
          if (this.knowledges[knowledge].id === this.knowledgekey) {
            this.content_count = this.knowledges[knowledge].content_count
            break
          }
        }
      }
    },
    getKnowledgeHtml() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.htmlcontent = this.knowledgecontents[knowledgecontent].content.data
            break
          }
        }
      }
    },
    getNextContentType() {
      for (const knowledgecontent in this.knowledgecontents) {
        if (this.knowledgecontents[knowledgecontent].ord === (parseInt(this.ord) + 1).toString()) {
          this.nextContentType = this.knowledgecontents[knowledgecontent].content.type
          this.nextknowledgecontentkey = knowledgecontent
          break
        }
      }
    },
    getPrevContentType() {
      for (const knowledgecontent in this.knowledgecontents) {
        if (this.knowledgecontents[knowledgecontent].ord === (parseInt(this.ord) - 1).toString()) {
          this.prevContentType = this.knowledgecontents[knowledgecontent].content.type
          this.prevknowledgecontentkey = knowledgecontent
          break
        }
      }
    },
    goPrev() {
      this.getPrevContentType()
      if (this.ord < '2') {
        return
      }
      switch (this.prevContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
      }
    },
    goNext() {
      this.getNextContentType()
      switch (this.nextContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
      }
    }
  }
}
</script>
