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
      <f7-list-group v-for="knowledgeoption_ in knowledgeoptions" :key="knowledgeoption_.id">
        <f7-list-item radio name="knowledgeoption-radio"
          :value="knowledgeoption_.id"
          :title="knowledgeoption_.name"></f7-list-item>
      </f7-list-group>
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
      knowledgeoptions: null,
      answer: null,
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
    this.getKnowledgeSelect()
    this.getKnowledgeContentsCount()
  },
  methods: {
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    swap(datas, i, j) {
      const data = datas[i]
      datas[i] = datas[j]
      datas[j] = data
    },
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
    getKnowledgeSelect() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.htmlcontent = this.knowledgecontents[knowledgecontent].content.title
            const datas = [
              {id: 'a', name: this.knowledgecontents[knowledgecontent].content.options.a},
              {id: 'b', name: this.knowledgecontents[knowledgecontent].content.options.b},
              {id: 'c', name: this.knowledgecontents[knowledgecontent].content.options.c},
              {id: 'd', name: this.knowledgecontents[knowledgecontent].content.options.d}
            ]
            for (let i = 0; i < 4; i++) {
              const j = this.getRandomInt(4)
              this.swap(datas, i, j)
            }
            this.knowledgeoptions = datas
            this.answer = this.knowledgecontents[knowledgecontent].content.answer
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
      const knowledgeoption = this.$$('input[name="knowledgeoption-radio"]:checked').val()
      if (knowledgeoption !== this.answer) {
        this.getKnowledgeSelect()
        return
      }
      this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
        console.log('knowledgeKey=' + knowledgeKey)
      })
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
