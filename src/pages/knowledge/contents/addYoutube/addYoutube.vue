<template>
  <f7-page class="knowledge">
    <f7-navbar :title="$t('knowledge.addyoutube')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('knowledge.addyoutube')}}</h3>
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
      <f7-list-item>
        <label>{{$t('knowledge.content.youtubePath')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.youtubePath_')" @input="link = $event.target.value" :value="youtubePath" />
      </f7-list-item>
    <f7-block v-if="isUserLogin">
      <f7-button big color="blue" style = "line-height:27px" @click="updateKnowledgeYoutube">{{$t('knowledge.addyoutube')}}</f7-button>
    </f7-block>

    <!-- Youtube -->
    <f7-block inset v-if="youtubePath">
      <youtube :video-id="youtubePath" :player-vars="playerVars" @playing="playing"></youtube>
    </f7-block>
</f7-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      knowledgekey: null,
      knowledgecontentkey: null,
      youtubePath: null,
      ord: 0,
      title: '',
      userid: null,
      showSuccess: false,
      playerVars: {
        autoplay: 1
      }
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
    this.getKnowledgeYoutube()
  },
  methods: {
    getKnowledgeYoutube() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.youtubePath = this.knowledgecontents[knowledgecontent].content.youtubePath
            break
          }
        }
      }
    },
    updateKnowledgeYoutube() {
      if (this.knowledgecontentkey) {
        this.$root.chat.updateKnowledgeContent(this.knowledgekey, this.knowledgecontentkey, this.ord, this.title, {
          type: 'Youtube',
          youtubePath: this.youtubePath
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.addKnowledgeContent(this.knowledgekey, this.ord, this.title, {
          type: 'Youtube',
          youtubePath: this.youtubePath
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      }

      this.ord = 0
      this.title = ''
      this.youtubePath = ''
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    },
    playing() {
      console.log('we are watching!!!')
    }
  }
}
</script>
