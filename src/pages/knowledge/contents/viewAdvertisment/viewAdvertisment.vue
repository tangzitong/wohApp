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
        <!-- Image -->
        <f7-block inset v-if="advertismentPath" @click.stop="openPhotoBrowser(link)">
          <img :src="advertismentPath" width="50%" />
        </f7-block>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item>
        <f7-button v-if="parseInt(ord) > 0" big raised color="green" fill @click="goPrev">{{$t('app.prev')}}</f7-button>
        <f7-button v-if="parseInt(ord) < content_count" big raised color="green" fill @click="goNext">{{$t('app.next')}}</f7-button>
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
      knowledgecontentkey: null,
      prevContentType: 'Html',
      prevknowledgecontentkey: null,
      content_count: 0,
      advertismentPath: null,
      ord: 0,
      title: '',
      link: '',
      userid: null,
      comment_count: 0
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      learningstatus: state => state.learningstatus,
      knowledgecomments: state => state.knowledgecomments,
      isUserLogin: state => state.isUserLogin
    }),
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
      this.$root.chat.getLearningStatus(data => {
        if (data) {
          window.store.dispatch('initLearningstatus', data)
        }
      })
    }
    this.getKnowledgeAdvertisment()
    this.getKnowledgeContentsCount()
    if (this.knowledgekey && this.knowledgecontentkey) {
      this.$root.chat.getKnowledgeContentComments(this.knowledgekey, this.knowledgecontentkey, knowledgecomments => {
        if (knowledgecomments) {
          window.store.dispatch('initKnowledgeComments', knowledgecomments)
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
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
    getKnowledgeAdvertisment() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.advertismentPath = this.knowledgecontents[knowledgecontent].content.advertismentPath
            this.link = this.knowledgecontents[knowledgecontent].content.link
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
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/viewPicture/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/viewAdvertisment/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/viewAudio/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/viewFlash/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/viewYoutube/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
      }
    },
    goNext() {
      this.getNextContentType()
      this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
        console.log('knowledgeKey=' + knowledgeKey)
      })
      switch (this.nextContentType) {
        case 'Html':
          this.$f7router.navigate(`/knowledge/contents/viewHtml/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'Select':
          this.$f7router.navigate(`/knowledge/contents/viewSelect/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'MultiSelect':
          this.$f7router.navigate(`/knowledge/contents/viewMultiSelect/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Input':
          this.$f7router.navigate(`/knowledge/contents/viewInput/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
        case 'Picture':
          this.$f7router.navigate(`/knowledge/contents/viewPicture/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Advertisment':
          this.$f7router.navigate(`/knowledge/contents/viewAdvertisment/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Audio':
          this.$f7router.navigate(`/knowledge/contents/viewAudio/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Flash':
          this.$f7router.navigate(`/knowledge/contents/viewFlash/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Youtube':
          this.$f7router.navigate(`/knowledge/contents/viewYoutube/?mid=${this.knowledgekey}&contentid=${this.prevknowledgecontentkey}`)
          break
        case 'Certificate':
          this.$f7router.navigate(`/knowledge/contents/viewCertificate/?mid=${this.knowledgekey}&contentid=${this.nextknowledgecontentkey}`)
          break
      }
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${this.knowledgekey}&isowner=false`)
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
