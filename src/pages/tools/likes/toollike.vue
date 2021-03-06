<template>
  <f7-page class="tool-page">
    <f7-navbar :title="$t('app.tools')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Tool :enableToolbar="false" :data="tool"></Tool>
    <div class="likes">
      <div class="title">
        <span>{{$t('tool.like')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool flex-rest-width" :class="{liked: tool.liked}" @click="LikeTool(tool.id)">
          <span class="iconfont icon-like"></span>
          <span class="text" v-text="tool.like_count ? tool.like_count : $t('home.like')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="toollikes">
          <div class="like flex-row" v-for="like in toollikes" :key="like.id">
            <img class="avatar" :src="getAvatar(like.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{like.name}}</span></div>
              <div class="time"><span>{{formatTime(like.time)}}</span></div>
              <f7-link v-if="like.avatar === userid" class="tool flex-rest-width" :class="{liked: tool.liked}" @click="UnLikeTool(tool.id, like.id)">
                <span class="text" v-text="$t('home.like')"></span>
              </f7-link>
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
  .likes {
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
    .like {
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
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      tool: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      tools: state => state.tools,
      toollikes: state => state.toollikes,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.tool = find(this.tools, p => p.id === query.mid)
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    this.$root.chat.getToolLikes(this.tool.id, function(likes) {
      window.store.dispatch('initToolLikes', likes)
    })
  },
  methods: {
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    getLikes(toolid) {
      this.$root.chat.getToolLikes(toolid, function(likes) {
        window.store.dispatch('initToolLikes', likes)
      })
    },
    LikeTool(mid) {
      this.$root.chat.likeTool(mid, function(likeKey) {
        console.log('likeTool success')
      })
      this.getLikes(mid)
    },
    UnLikeTool(mid, likeKey) {
      this.$root.chat.unlikeTool(mid, likeKey, function(likeKey) {
        console.log('unlikeTool success')
      })
      this.getLikes(mid)
    }
  },
  components: {
    Tool
  }
}
</script>
