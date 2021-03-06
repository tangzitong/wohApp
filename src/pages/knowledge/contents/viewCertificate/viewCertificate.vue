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
        <f7-block inset v-if="imagePath">
          <img :src="imagePath"/>
        </f7-block>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item>
        <f7-button v-if="parseInt(ord) > 0" big color="blue" style = "line-height:27px" @click="goPrev">{{$t('app.prev')}}</f7-button>
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
      certificatePath: null,
      imageid: null,
      ord: 0,
      title: '',
      comment_count: 0,
      store: null,
      db: null,
      istry: false
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
      knowledgecontents: state => state.knowledgecontents,
      learningstatus: state => state.learningstatus,
      knowledgecertificates: state => state.knowledgecertificates,
      knowledgecomments: state => state.knowledgecomments,
      imagePath: state => state.imagePath,
      isUserLogin: state => state.isUserLogin,
      userid: state => state.userProfile.id
    })
  },
  mounted: function () {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
    this.knowledgecontentkey = query.contentid
    this.istry = (query.istry === 'true')
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
        this.$root.chat.getMyKnowledgeCertificate(this.knowledgekey, data => {
          if (data) {
            window.store.dispatch('initKnowledgecertificates', data)
          }
        })
      }
    }
    this.getKnowledgeCertificate()
    this.getMyKnowledgeCertificate()
    if (!this.istry && !this.imagePath) {
      this.createCertificate()
      this.getMyKnowledgeCertificate()
      this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
        console.log('knowledgeKey=' + knowledgeKey)
      })
    }
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
    uploadFile(data) {
      this.performingRequest = true
      let len = 0
      for (let i = 0; i < data.length; ++i) {
        len += data[i].length
      }
      console.log(len)
      const bytes = new Uint8Array(len)
      let idx = 0
      for (let j = 0; j < data.length; ++j) {
        for (let k = 0; k < data[j].length; ++k) {
          bytes[idx++] = data[j][k]
        }
      }
      const metadata = {
        contentType: 'image/png',
      }
      // const blob = new window.Blob(PNGData, {type: 'application/octet-binary'})
      // window.storage(this.store).put(blob, {contentType: blob.type})
      window.storage(this.store).put(bytes, metadata)
        .then(() => {
          this.handleFileUploaded()
        })
        .catch(() => {
          // window.f7.hideIndicator()
          this.performingRequest = false
          window.$$.alert('Cannot upload the photo :-(<br />Please try again later', 'Trouble with Firebase')
        })
    },
    handleFileUploaded: function () {
      // Get download URL
      window.storage(this.store).getDownloadURL()
        .then(url => {
          // Save download URL to user data
          window.store.dispatch('setImagePath', url)
          if (this.db !== '') {
            window.db(this.db).set(url)
              .then(() => {
                // window.f7.hideIndicator()
                this.performingRequest = false
              })
              .catch(() => {
                // window.f7.hideIndicator()
                this.performingRequest = false
                window.$$.alert('Cannot update the photo url :-(<br />Please try again later', 'Trouble with Firebase')
              })
          } else {
            // window.f7.hideIndicator()
            this.performingRequest = false
          }
        })
        .catch(() => {
          // window.f7.hideIndicator()
          this.performingRequest = false
          window.$$.alert('Cannot load the photo url :-(<br />Please try again later', 'Trouble with Firebase')
        })
    },
    createCertificate() {
      this.store = 'knowledgecertificates/' + this.userid + '/' + this.knowledgekey
      this.db = 'knowledgecertificates/data/' + this.knowledgekey + '/' + this.userid + '/certificatePath'
      console.log('this.store=' + this.store)
      console.log('this.db=' + this.db)
      this.$root.chat.createCertificate(this.certificatePath, './fonts/SourceSansPro-Regular.ttf', PNGData => {
        // console.log('PNGData=' + PNGData)
        this.uploadFile(PNGData)
      })
      this.$root.chat.addKnowledgeCertificate(this.knowledgekey, knowledgeKey => {
        console.log('knowledgeKey=' + knowledgeKey)
      })
    },
    getMyKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        for (const knowledgecertificate in this.knowledgecertificates) {
          if (this.knowledgecertificates[knowledgecertificate].knowledgeid === this.knowledgecontentkey) {
            const myCertificatePath = this.knowledgecontents[this.knowledgecontentkey].certificatePath
            window.store.dispatch('setImagePath', myCertificatePath)
            break
          }
        }
      }
    },
    getKnowledgeCertificate() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.certificatePath = this.knowledgecontents[knowledgecontent].content.certificatePath
            this.comment_count = this.knowledgecontents[knowledgecontent].comment_count
            break
          }
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
      if (!this.istry) {
        this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
          console.log('knowledgeKey=' + knowledgeKey)
        })
      }
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
