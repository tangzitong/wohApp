<template>
  <f7-page class="knowledge">
    <f7-navbar :title="$t('knowledge.addaudio')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('knowledge.addaudio')}}</h3>
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
      <f7-button big raised color="green" fill @click="updateKnowledgeAudio">{{$t('knowledge.addaudio')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin && knowledgekey && knowledgecontentkey">
      <imageuploader
        :store="'knowledgecontents/' + userid + '/' + knowledgekey + knowledgecontentkey"
        :db="'knowledgecontents/data/' + knowledgekey + '/contents/' + knowledgecontentkey + '/content/audioPath'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="audioPath">
      <img :src="audioPath" width="50%" />
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
      audioPath: null,
      ord: 0,
      title: '',
      userid: null,
      showSuccess: false
    }
  },
  computed: {
    ...mapState({
      knowledgecontents: state => state.knowledgecontents,
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
          window.store.dispatch('initKnowledgecontents', data)
        }
      })
    }
    this.getKnowledgeAudio()
  },
  methods: {
    getKnowledgeAudio() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.audioPath = this.knowledgecontents[knowledgecontent].content.audioPath
            break
          }
        }
      }
    },
    updateKnowledgeAudio() {
      if (this.knowledgecontentkey) {
        this.$root.chat.updateKnowledgeContent(this.knowledgekey, this.knowledgecontentkey, this.ord, this.title, {
          type: 'Audio',
          audioPath: this.audioPath
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.addKnowledgeContent(this.knowledgekey, this.ord, this.title, {
          type: 'Audio',
          audioPath: this.audioPath
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      }

      this.ord = 0
      this.title = ''
      this.audioPath = ''
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  },
  components: {
    imageuploader
  }
}
</script>
