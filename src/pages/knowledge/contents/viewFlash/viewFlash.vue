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
        <!-- Flash -->
        <f7-block inset v-if="playerOptions.flash.swf">
          <video-player  class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions"
          ></video-player>
        </f7-block>
      </f7-list-item>
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
      knowledgecontentkey: null,
      prevContentType: 'Html',
      prevknowledgecontentkey: null,
      nextContentType: 'Html',
      nextknowledgecontentkey: null,
      content_count: 0,
      ord: 0,
      title: '',
      userid: null,
      comment_count: 0,
      istry: false,
      // 视频播放
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        techOrder: ['flash', 'html5'], // 兼容顺序
        flash: {
          hls: { withCredentials: false },
          swf: './static/media/video-js.swf' // 引入静态文件swf
        },
        html5: { hls: { withCredentials: false } },
        sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
          type: 'rtmp/hls',
          src: 'rtmp://192.168.1.199:10935/hls/stream_1'
        }, {
          withCredentials: false,
          type: 'application/x-mpegURL',
          src: 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8'
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
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
    this.getKnowledgeFlash()
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
    getKnowledgeFlash() {
      if (this.knowledgecontentkey) {
        for (const knowledgecontent in this.knowledgecontents) {
          if (this.knowledgecontents[knowledgecontent].id === this.knowledgecontentkey) {
            this.ord = this.knowledgecontents[knowledgecontent].ord
            this.title = this.knowledgecontents[knowledgecontent].title
            this.playerOptions.flash.swf = this.knowledgecontents[knowledgecontent].content.flashPath
            this.playerOptions.sources[0].type = this.knowledgecontents[knowledgecontent].content.source0type
            this.playerOptions.sources[0].src = this.knowledgecontents[knowledgecontent].content.source0src
            this.playerOptions.sources[1].type = this.knowledgecontents[knowledgecontent].content.source1type
            this.playerOptions.sources[1].src = this.knowledgecontents[knowledgecontent].content.source1src
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
      this.getNextContentType()
      if (!this.istry) {
        this.$root.chat.updateLearningStatus(this.knowledgekey, this.ord, true, knowledgeKey => {
          console.log('knowledgeKey=' + knowledgeKey)
        })
      }
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
