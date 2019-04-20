<template>
  <f7-page class="knowledge">
    <f7-navbar :title="$t('app.study')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{title}}</h3>
    </f7-block>
    <f7-list>
      <f7-list-item>
        <!-- Image -->
        <f7-block inset v-if="myCertificatePath">
          <img :src="myCertificatePath" width="50%" />
        </f7-block>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item>
        <f7-button v-if="ord > 0" big raised color="green" fill @click="goPrev">{{$t('app.prev')}}</f7-button>
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
      knowledgecontentkey: null,
      prevContentType: 'Html',
      prevknowledgecontentkey: null,
      certificatePath: null,
      myCertificatePath: null,
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
      knowledgecertificates: state => state.knowledgecertificates,
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
      this.$root.chat.getMyKnowledgeCertificate(this.knowledgekey, data => {
        if (data) {
          this.$store.dispatch('initKnowledgecertificates', data)
        }
      })
    }
    this.getKnowledgeCertificate()
    this.getMyKnowledgeCertificate()
    if (!this.myCertificatePath) {
      this.createCertificate()
      this.getMyKnowledgeCertificate()
    }
  },
  methods: {
    createCertificate() {
      this.$root.chat.addKnowledgeCertificate(this.knowledgekey, this.myCertificatePath, knowledgeKey => {
        console.log('knowledgeKey=' + knowledgeKey)
      })
    },
    getMyKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        for (const knowledgecertificate in this.knowledgecertificates) {
          if (this.knowledgecertificates[knowledgecertificate].knowledgeid === this.knowledgecontentkey) {
            this.myCertificatePath = this.knowledgecontents[this.knowledgecontentkey].certificatePath
            break
          }
        }
      }
    },
    getKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.certificatePath = this.knowledgecontents[knowledgecontent].content.certificatePath
            break
          }
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
    }
  }
}
</script>
