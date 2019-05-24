<template>
  <f7-page class="knowledge">
    <f7-navbar>
      <f7-nav-left>
        <f7-link :text="$t('app.back')" @click="routeToContent"></f7-link>
      </f7-nav-left>
      <f7-nav-title :title="!knowledgecontentkey ? $t('knowledge.addflash') : $t('knowledge.updateflash')"></f7-nav-title>
    </f7-navbar>
    <f7-block>
      <h3>{{!knowledgecontentkey ? $t('knowledge.addflash') : $t('knowledge.updateflash')}}</h3>
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
        <label>{{$t('knowledge.content.flashPath')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.flashPath_')" @input="playerOptions.flash.swf = $event.target.value" :value="playerOptions.flash.swf" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.source0type')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.source0type_')" @input="playerOptions.sources[0].type = $event.target.value" :value="playerOptions.sources[0].type" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.source0src')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.source0src_')" @input="playerOptions.sources[0].src = $event.target.value" :value="playerOptions.sources[0].src" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.source1type')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.source1type_')" @input="playerOptions.sources[1].type = $event.target.value" :value="playerOptions.sources[1].type" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('knowledge.content.source1src')}}</label><br/>
        <input type="text" :placeholder="$t('knowledge.content.source1src_')" @input="playerOptions.sources[0].src = $event.target.value" :value="playerOptions.sources[1].src" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big color="blue" style = "line-height:27px" @click="updateKnowledgeFlash">{{!knowledgecontentkey ? $t('knowledge.addflash') : $t('knowledge.updateflash')}}</f7-button>
    </f7-block>
    <!-- Flash -->
    <f7-block inset v-if="flashPath">
      <video-player  class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
      ></video-player>
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
      flashPath: null,
      ord: 0,
      title: '',
      userid: null,
      showSuccess: false,
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
    this.getKnowledgeFlash()
  },
  methods: {
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
            break
          }
        }
      }
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${this.knowledgekey}&isowner=true`)
    },
    updateKnowledgeFlash() {
      if (this.knowledgecontentkey) {
        this.$root.chat.updateKnowledgeContent(this.knowledgekey, this.knowledgecontentkey, this.ord, this.title, {
          type: 'Flash',
          flashPath: this.playerOptions.flash.swf,
          source0type: this.playerOptions.sources[0].type,
          source0src: this.playerOptions.sources[0].src,
          source1type: this.playerOptions.sources[1].type,
          source1src: this.playerOptions.sources[1].src
        }, function(knowledgecontentkey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.addKnowledgeContent(this.knowledgekey, this.ord, this.title, {
          type: 'Flash',
          flashPath: this.playerOptions.flash.swf,
          source0type: this.playerOptions.sources[0].type,
          source0src: this.playerOptions.sources[0].src,
          source1type: this.playerOptions.sources[1].type,
          source1src: this.playerOptions.sources[1].src
        }, function(knowledgecontentkey) {
          console.log('add success')
        })
      }

      this.ord = 0
      this.title = ''
      this.playerOptions.flash.swf = ''
      this.playerOptions.sources[0].type = ''
      this.playerOptions.sources[0].src = ''
      this.playerOptions.sources[1].type = ''
      this.playerOptions.sources[1].src = ''
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  },
  components: {
    imageuploader
  }
}
</script>
