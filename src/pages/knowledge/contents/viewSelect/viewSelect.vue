<template>
  <f7-page class="knowledge">
    <f7-navbar :title="$t('app.study')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.directory')" @click="routeToContent"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block>
      <h3>{{title}}</h3>
    </f7-block>
    <f7-list>
      <f7-list-item>
        <p v-html="htmlcontent"></p>
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
        <f7-button v-if="parseInt(ord) > 0" big color="blue" style = "line-height:27px" @click="goPrev">{{$t('app.prev')}}</f7-button>
        <f7-button v-if="parseInt(ord) < content_count" big color="blue" style = "line-height:27px" @click="goNext">{{$t('app.next')}}</f7-button>
      </f7-list-item>
    </f7-list>
    <div class="comments">
      <div class="title">
        <span>{{$t('home.comment')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool tool-border flex-rest-width" @click="openKnowledgecommentPopup">
          <span class="iconfont icon-comment"></span>
          <span class="text" v-text="comment_count ? comment_count : $t('home.comment')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="knowledgecomments">
          <div class="comment flex-row" v-for="comment in knowledgecomments" :key="comment.id">
            <img class="avatar" :src="getAvatar(comment.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{comment.name}}</span></div>
              <div class="time"><span>{{formatTime(comment.time)}}</span></div>
              <div class="text"><span>{{comment.comment}}</span></div>
            </div>
          </div>
        </template>
        <div class="empty-content" v-else>
          <i class="iconfont icon-wujieguoyangshi"/>
          <div class="text">
            <span>{{$t('app.empty_container')}}</span>
          </div>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<style lang="less">
@import '../../../../assets/styles/mixins.less';

.knowledge {
  .custom-toolbar {
    background: #fff;
    &:before {
      background: #e1e1e1;
    }
    .tool {
      justify-content: center;
      &.tool-border {
        border-right: 1px solid #e1e1e1;
      }
      &.liked {
        > span {
          color: @mainColor;
        }
      }
      > span {
        color: #6d6d78;
        vertical-align: middle;
      }
      .iconfont {
        font-size: 18px;
      }
      .text {
        font-size: 15px;
      }
    }
  }
  .comments {
    background-color: #fff;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    margin-bottom: 15px;
    .title {
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      font-size: 13px;
    }
    .comment {
      border-top: 1px solid #dadada;
      padding: 10px;
      font-size: 14px;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 30px;
      }
      .detail {
        margin-left: 8px;
        .name {
          font-size: 13px;
          color: #333;
        }
        .time {
          font-size: 11px;
          color: #929292;
          margin-bottom: 2px;
        }
        .text {
          line-height: 20px;
          color: #5d5d5d;
        }
      }
    }
  }
}

.md {
  .knowledge {
    .custom-toolbar {
      .tool {
        &.liked {
          > span {
            color: #fff;
          }
        }
        > span {
          color: rgba(255, 255, 255, 0.7);;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>

<script>
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState, mapActions } from 'vuex'

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
      userid: null,
      comment_count: 0,
      istry: false
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      learningstatus: state => state.learningstatus,
      knowledgecomments: state => state.knowledgecomments,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted: function () {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
    this.knowledgecontentkey = query.contentid
    this.istry = (query.istry === 'true')
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.knowledgekey) {
      this.$root.chat.getKnowledgeContents(this.knowledgekey, data => {
        if (data) {
          window.store.dispatch('initKnowledgecontents', data)
        }
      })
      if (!this.istry) {
        this.$root.chat.getLearningStatus(data => {
          if (data) {
            window.store.dispatch('initLearningstatus', data)
          }
        })
      }
    }
    this.getKnowledgeSelect()
    this.getKnowledgeContentsCount()
    if (this.knowledgekey && this.knowledgecontentkey) {
      this.$root.chat.getKnowledgeContentComments(this.knowledgekey, this.knowledgecontentkey, knowledgecomments => {
        window.store.dispatch('initKnowledgeComments', knowledgecomments)
      })
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
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
            this.comment_count = this.knowledgecontents[knowledgecontent].comment_count
            break
          }
        }
      }
    },
    getNextContentType() {
      for (const knowledgecontent in this.knowledgecontents) {
        if (parseInt(this.knowledgecontents[knowledgecontent].ord) === parseInt(this.ord) + 1) {
          this.nextContentType = this.knowledgecontents[knowledgecontent].content.type
          this.nextknowledgecontentkey = knowledgecontent
          break
        }
      }
    },
    getPrevContentType() {
      for (const knowledgecontent in this.knowledgecontents) {
        if (parseInt(this.knowledgecontents[knowledgecontent].ord) === parseInt(this.ord) - 1) {
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
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/viewPicture/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/viewAdvertisment/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/viewAudio/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/viewFlash/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/viewYoutube/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}&istry=${this.istry}`)
          break
      }
    },
    goNext() {
      const knowledgeoption = this.$$('input[name="knowledgeoption-radio"]:checked').val()
      if (knowledgeoption !== this.answer) {
        this.getKnowledgeSelect()
        return
      }
      if (!this.istry) {
        this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
          console.log('knowledgeKey=' + knowledgeKey)
        })
      }
      this.getNextContentType()
      switch (this.nextContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/viewPicture/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/viewAdvertisment/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/viewAudio/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/viewFlash/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/viewYoutube/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}&istry=${this.istry}`)
          break
      }
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${this.knowledgekey}&isowner=false&istry=${this.istry}`)
    },
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    openKnowledgecommentPopup() {
      this.updatePopup({
        key: 'knowledgekey',
        value: this.knowledgekey
      })
      this.updatePopup({
        key: 'knowledgecontentkey',
        value: this.knowledgecontentkey
      })
      this.updatePopup({
        key: 'knowledgecommentOpened',
        value: true
      })
    }
  }
}
</script>
