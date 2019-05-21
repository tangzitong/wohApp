<template>
  <f7-page class="knowledge">
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.back')" @click="routeToContent"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="!knowledgecontentkey ? $t('knowledge.addselect') : $t('knowledge.updateselect')"></f7-nav-title>
    </f7-navbar>
    <f7-block>
      <h3>{{!knowledgecontentkey ? $t('knowledge.addselect') : $t('knowledge.updateselect')}}</h3>
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
      <f7-list-item>
        <label>{{$t('knowledge.content.htmlcontent')}}</label><br/>
        <input type="textarea" :placeholder="$t('knowledge.content.htmlcontent_')" @input="htmlcontent = $event.target.value" :value="htmlcontent" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.select1')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.select1_')" @input="select1 = $event.target.value" :value="select1" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.select2')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.select2_')" @input="select2 = $event.target.value" :value="select2" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.select3')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.select3_')" @input="select3 = $event.target.value" :value="select3" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.select4')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.select4_')" @input="select4 = $event.target.value" :value="select4" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.answer')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.answer_')" @input="answer = $event.target.value" :value="answer" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big color="blue" style = "line-height:27px" @click="updateKnowledgeSelect">{{!knowledgecontentkey ? $t('knowledge.addselect') : $t('knowledge.updateselect')}}</f7-button>
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
      htmlcontent: null,
      select1: null,
      select2: null,
      select3: null,
      select4: null,
      answer: null,
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
    this.getKnowledgeSelect()
  },
  methods: {
    getKnowledgeSelect() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.htmlcontent = this.knowledgecontents[knowledgecontent].content.title
            this.select1 = this.knowledgecontents[knowledgecontent].content.options.a
            this.select2 = this.knowledgecontents[knowledgecontent].content.options.b
            this.select3 = this.knowledgecontents[knowledgecontent].content.options.c
            this.select4 = this.knowledgecontents[knowledgecontent].content.options.d
            this.answer = this.knowledgecontents[knowledgecontent].content.answer
            break
          }
        }
      }
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${this.knowledgekey}&isowner=true`)
    },
    updateKnowledgeSelect() {
      if (this.knowledgecontentkey) {
        this.$root.chat.updateKnowledgeContent(this.knowledgekey, this.knowledgecontentkey, this.ord, this.title, {
          type: 'Select',
          title: this.htmlcontent,
          answer: this.answer,
          options: {
            a: this.select1,
            b: this.select2,
            c: this.select3,
            d: this.select4
          }
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.addKnowledgeContent(this.knowledgekey, this.ord, this.title, {
          type: 'Select',
          title: this.htmlcontent,
          answer: this.answer,
          options: {
            a: this.select1,
            b: this.select2,
            c: this.select3,
            d: this.select4
          }
        }, function(knowledgecontentkey) {
          console.log('add success')
        })
      }

      this.ord = 0
      this.title = ''
      this.htmlcontent = ''
      this.select1 = ''
      this.select2 = ''
      this.select3 = ''
      this.select4 = ''
      this.answer = ''
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  }
}
</script>
