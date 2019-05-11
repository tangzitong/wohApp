<template>
  <f7-page class="knowledgecontent-page">
    <f7-navbar :title="$t('app.knowledgecontents')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link v-if="isApproved" :text="$t('app.study')" @click="startLearning"></f7-link>
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
                      :badge="knowledgecontent_.ord"
                      :badge-color="getColor(knowledgecontent_)"
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
        <f7-button big raised color="green" fill @click="addMultiSelect">{{$t('knowledge.addmultiselect')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addInput">{{$t('knowledge.addinput')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addPicture">{{$t('knowledge.addpicture')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addAdvertisment">{{$t('knowledge.addadvertisment')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addAudio">{{$t('knowledge.addaudio')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addFlash">{{$t('knowledge.addflash')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big raised color="green" fill @click="addYoutube">{{$t('knowledge.addyoutube')}}</f7-button>
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
      isApproved: false,
      name: null
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      knowledgeapplications: state => state.knowledgeapplications,
      learningstatus: state => state.learningstatus
    })
  },
  mounted: function () {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
    this.isOwner = (query.isowner === 'true')
    if (this.knowledgekey) {
      this.$root.chat.getKnowledgeContents(this.knowledgekey, data => {
        if (data) {
          window.store.dispatch('initKnowledgecontents', data)
        }
      })
      this.$root.chat.getMyKnowledgeApplication(this.knowledgekey, data => {
        if (data) {
          const val = []
          val.push(data)
          window.store.dispatch('initKnowledgeApplications', val)
        }
      })
      this.$root.chat.getLearningStatus(data => {
        if (data) {
          window.store.dispatch('initLearningstatus', data)
        }
      })
    }
    this.getSelectedOrd()
    this.setName()
    this.setIsApproved()
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
    setIsApproved() {
      for (const knowledgeapplication in this.knowledgeapplications) {
        if (this.knowledgeapplications[knowledgeapplication].approvalStatus === true) {
          this.isApproved = true
          break
        }
      }
    },
    setName() {
      for (const knowledge in this.knowledges) {
        if (this.knowledges[knowledge].id === this.knowledgekey) {
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
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/viewPicture/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/viewAdvertisment/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/viewAudio/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/viewFlash/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/viewYoutube/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
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
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/addMultiSelect/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/addInput/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/addPicture/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/addAdvertisment/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/addAudio/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/addFlash/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/addYoutube/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
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
    addMultiSelect() {
      this.$f7router.navigate(`/knowledge/contents/addMultiSelect/?mid=${this.knowledgekey}`)
    },
    addInput() {
      this.$f7router.navigate(`/knowledge/contents/addInput/?mid=${this.knowledgekey}`)
    },
    addPicture() {
      this.$f7router.navigate(`/knowledge/contents/addPicture/?mid=${this.knowledgekey}`)
    },
    addAdvertisment() {
      this.$f7router.navigate(`/knowledge/contents/addAdvertisment/?mid=${this.knowledgekey}`)
    },
    addAudio() {
      this.$f7router.navigate(`/knowledge/contents/addAudio/?mid=${this.knowledgekey}`)
    },
    addFlash() {
      this.$f7router.navigate(`/knowledge/contents/addFlash/?mid=${this.knowledgekey}`)
    },
    addYoutube() {
      this.$f7router.navigate(`/knowledge/contents/addYoutube/?mid=${this.knowledgekey}`)
    },
    addCertificate() {
      this.$f7router.navigate(`/knowledge/contents/addCertificate/?mid=${this.knowledgekey}`)
    },
    getColor(knowledgecontent_) {
      if (knowledgecontent_.ord > 1 && knowledgecontent_.ord > this.selectedOrd && !this.isOwner) {
        return 'gray'
      } else {
        return 'red'
      }
    }
  }
}
</script>
