<template>
  <f7-page class="knowledgecontent-page">
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.back')" @click="routeToKnowledge"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="$t('app.knowledgecontents')"></f7-nav-title>
      <f7-nav-right>
        <f7-link v-if="isApproved" :text="$t('app.study')" @click="startLearning"></f7-link>
        <f7-link v-if="isOwner" :text="$t('app.update')" @click="editLearningContent"></f7-link>
        <f7-link v-if="isOwner" :text="$t('app.delete')" @click="deleteLearningContent"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title class="knowledge-titles" style="margin-top:16px;margin-bottom:4px">{{this.name}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="knowledgecontent_ in knowledgecontents" :key="knowledgecontent_.id">
        <f7-list-item radio name="knowledgecontent-radio"
                      :value="knowledgecontent_.id"
                      :title="knowledgecontent_.title"
                      :badge="knowledgecontent_.ord"
                      :badge-color="getColor(knowledgecontent_)"
                      :disabled = "parseInt(knowledgecontent_.ord) > 1 && parseInt(knowledgecontent_.ord) > parseInt(selectedOrd) && !isOwner"
                      :checked="parseInt(selectedOrd) === parseInt(knowledgecontent_.ord)"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list v-if="isOwner">
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addHtml">{{$t('knowledge.addhtml')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addSelect">{{$t('knowledge.addselect')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addMultiSelect">{{$t('knowledge.addmultiselect')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addInput">{{$t('knowledge.addinput')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addPicture">{{$t('knowledge.addpicture')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addAdvertisment">{{$t('knowledge.addadvertisment')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addAudio">{{$t('knowledge.addaudio')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addFlash">{{$t('knowledge.addflash')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addYoutube">{{$t('knowledge.addyoutube')}}</f7-button>
      </f7-list-item>
      <f7-list-item>
        <f7-button big color="blue" style = "line-height:27px" @click="addCertificate">{{$t('knowledge.addcertificate')}}</f7-button>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
//.ios label.item-radio input[type="radio"] ~ .icon-radio {
 // margin-right:30px;
//}
</style>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      knowledgekey: null,
      selectedOrd: '01',
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
          this.setName()
        }
      })
      this.$root.chat.getMyKnowledgeApplication(this.knowledgekey, data => {
        if (data) {
          const val = []
          val.push(data)
          window.store.dispatch('initKnowledgeApplications', val)
          this.setIsApproved()
        }
      })
      this.$root.chat.getLearningStatus(data => {
        if (data) {
          window.store.dispatch('initLearningstatus', data)
          this.getSelectedOrd()
        }
      })
    }
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
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${knowledgecontent}`)
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
    routeToKnowledge() {
      this.$f7router.navigate(`/knowledge/?mid=${this.knowledgekey}&isowner=${this.isOwner}`)
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
      if (parseInt(knowledgecontent_.ord) > 1 && parseInt(knowledgecontent_.ord) > parseInt(this.selectedOrd) && !this.isOwner) {
        return 'gray'
      } else {
        return 'red'
      }
    }
  }
}
</script>
