<template>
  <f7-page class="knowledge">
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.back')" @click="routeToContent"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="!knowledgecontentkey ? $t('knowledge.addcertificate') : $t('knowledge.updatecertificate')"></f7-nav-title>
    </f7-navbar>
    <f7-block>
      <h3>{{!knowledgecontentkey ? $t('knowledge.addcertificate') : $t('knowledge.updatecertificate')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('knowledge.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('knowledge.content.ord')}}</label><br/>
        <input type="number" :placeholder="$t('knowledge.content.ord_')" @input="ord = $event.target.value" :value="ord" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.title')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.title_')" @input="title = $event.target.value" :value="title" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big color="blue" style = "line-height:27px" @click="updateKnowledgeCertificate">{{!knowledgecontentkey ? $t('knowledge.addcertificate') : $t('knowledge.updatecertificate')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin && knowledgekey && knowledgecontentkey">
      <imageuploader
        :store="'knowledgecontents/' + userid + '/' + knowledgekey + knowledgecontentkey"
        :db="'knowledgecontents/data/' + knowledgekey + '/contents/' + knowledgecontentkey + '/content/certificatePath'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="imagePath">
      <img :src="imagePath" width="50%" />
    </f7-block>
</f7-page>
</template>

<script>
import imageuploader from '../../../../popup/imageuploader'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      knowledgekey: null,
      knowledgecontentkey: null,
      ord: 0,
      title: '',
      userid: null,
      showSuccess: false
    }
  },
  computed: {
    ...mapState({
      knowledgecontents: state => state.knowledgecontents,
      isUserLogin: state => state.isUserLogin,
      imagePath: state => state.imagePath
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
          window.store.dispatch('initKnowledgecontents', data)
        }
      })
    }
    this.getKnowledgeCertificate()
  },
  methods: {
    getKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            const certificatePath = this.knowledgecontents[knowledgecontent].content.certificatePath
            window.store.dispatch('setImagePath', certificatePath)
            break
          }
        }
      }
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${this.knowledgekey}&isowner=true`)
    },
    updateKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        this.$root.chat.updateKnowledgeContent(this.knowledgekey, this.knowledgecontentkey, this.ord, this.title, {
          type: 'Certificate',
          certificatePath: this.imagePath
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.addKnowledgeContent(this.knowledgekey, this.ord, this.title, {
          type: 'Certificate',
          certificatePath: this.imagePath
        }, function(knowledgecontentkey) {
          console.log('add success')
        })
      }

      this.ord = 0
      this.title = ''
      window.store.dispatch('setImagePath', '')
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  },
  components: {
    imageuploader
  }
}
</script>
