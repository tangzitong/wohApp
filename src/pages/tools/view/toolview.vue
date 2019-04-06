<template>
  <f7-page class="tool-page">
    <f7-navbar :title="$t('app.tools')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Tool :enableToolbar="false" :data="tool"></Tool>
    <div class="applications">
      <div class="title">
        <span>{{$t('tool.application')}}</span>
      </div>
      <div class="clist">
        <template v-if="applications.length">
          <div class="application flex-row" v-for="application in applications" :key="application.name">
            <img class="avatar" :src="getAvatar(application.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{application.name}}</span></div>
              <div class="time"><span>{{formatTime(application.time)}}</span></div>
              <div class="text"><span>{{application.text}}</span></div>
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
    <f7-toolbar class="custom-toolbar flex-row" bottom-md>
      <f7-link class="tool tool-border flex-rest-width" @click="openApplicationPopup">
        <span class="iconfont icon-application"></span>
        <span class="text" v-text="tool.application_count ? tool.application_count : $t('tool.application')"></span>
      </f7-link>
      <f7-link class="tool flex-rest-width" :class="{liked: tool.liked}" @click="toggleLike(tool.id, tool.liked)">
        <span class="iconfont icon-like"></span>
        <span class="text" v-text="tool.like_count ? tool.like_count : $t('home.like')"></span>
      </f7-link>
    </f7-toolbar>
  </f7-page>
</template>

<style lang="less">
@import '../../../assets/styles/mixins.less';

.tool-page {
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
  .applications {
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
    .application {
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
  .tool-page {
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
import Tool from '@/components/tool'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState, mapActions } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      tool: {},
      applications: []
    }
  },
  computed: {
    ...mapState({
      tools: state => state.tools
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.tool = find(this.tools, p => p.id === query.mid)
    this.getApplications()
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getApplications() {
      const random = Math.floor(Math.random() * 2)
      if (!random) return []
      this.$root.chat.getToolApplications(this.tool.id, function(applications) {
        this.applications = applications
      })
    },
    formatTime(time) {
      return distanceInWordsToNow(time * 1000, { addSuffix: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    openApplicationPopup() {
      this.updatePopup({
        key: 'applicationOpened',
        value: true
      })
    },
    toggleLike(mid, status) {
      this.$root.chat.likeTool(this.tool.id, function(likeKey) {
        console.log('likeTool success')
      })
    }
  },
  components: {
    Tool
  }
}
</script>
