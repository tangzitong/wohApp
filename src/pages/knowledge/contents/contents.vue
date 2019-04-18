<template>
  <f7-page class="knowledgecontent-page">
    <f7-navbar :title="$t('app.knowledgecontents')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.study')" @click="startLearning"></f7-link>
        <f7-link v-if="isOwner" :text="$t('app.update')" @click="editLearningContent"></f7-link>
        <f7-link v-if="isOwner" :text="$t('app.delete')" @click="deleteLearningContent"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{this.name}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="knowledgecontent_ in knowledgecontents" :key="knowledgecontent_.id">
        <f7-list-item radio name="knowledgecontent-radio"
                      :value="knowledgecontent_.id"
                      :title="knowledgecontent_.title"
                      :disabled = "knowledgecontent_.ord > 1 && knowledgecontent_.ord > selectedOrd && !isOwner"
                      :checked="selectedOrd === knowledgecontent_.ord"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list v-if="isOwner">
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addHtml">{{$t('knowledge.addhtml')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addSelect">{{$t('knowledge.addselect')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addInput">{{$t('knowledge.addinput')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addCertificate">{{$t('knowledge.addcertificate')}}</f7-button>
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
      selectedOrd: 0,
      selectedContentType: 'Html',
      isOwner: false,
      name: null
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      learningstatus: state => state.learningstatus
    })
  },
  mounted: function () {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
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
    this.getSelectedOrd()
    this.setIsOwner()
  },
  methods: {
    getSelectedOrd() {
      for (const status in this.learningstatus) {
        if (status === this.knowledgekey) {
          this.selectedOrd = this.learningstatus[status].contentOrd
          break
        }
      }
    },
    setIsOwner() {
      for (const knowledge in this.knowledges) {
        if (this.knowledges[knowledge].avatar === window.user.uid) {
          this.isOwner = true
          this.name = this.knowledges[knowledge].name
          break
        }
      }
    },
    getContentType(contentKey) {
      for (const knowledgecontent in this.knowledgecontents) {
        if (this.knowledgecontents[knowledgecontent].id === contentKey) {
          this.selectedContentType = this.knowledgecontents[knowledgecontent].content.type
          break
        }
      }
    },
    startLearning() {
      const knowledgecontent = this.$$('input[name="knowledgecontent-radio"]:checked').val()
      this.getContentType(knowledgecontent)
      switch (this.selectedContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
      }
    },
    editLearningContent() {
      const knowledgecontent = this.$$('input[name="knowledgecontent-radio"]:checked').val()
      this.getContentType(knowledgecontent)
      switch (this.selectedContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/addHtml/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/addSelect/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/addInput/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/addCertificate/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
      }
    },
    deleteLearningContent() {
      const knowledgecontent = this.$$('input[name="knowledgecontent-radio"]:checked').val()
      this.$root.chat.removeKnowledgeContent(this.knowledgekey, knowledgecontent, function() {
        console.log('content deleted')
      })
    },
    addHtml() {
      this.$f7router.navigate(`/knowledge/contents/addHtml/?mid=${this.knowledgekey}`)
    },
    addSelect() {
      this.$f7router.navigate(`/knowledge/contents/addSelect/?mid=${this.knowledgekey}`)
    },
    addInput() {
      this.$f7router.navigate(`/knowledge/contents/addInput/?mid=${this.knowledgekey}`)
    },
    addCertificate() {
      this.$f7router.navigate(`/knowledge/contents/addCertificate/?mid=${this.knowledgekey}`)
    }
  }
}
</script>
