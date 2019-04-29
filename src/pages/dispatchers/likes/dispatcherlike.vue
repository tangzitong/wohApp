<template>
  <f7-page class="dispatcher-page">
    <f7-navbar :title="$t('app.dispatchers')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Dispatcher :enableToolbar="false" :data="dispatcher"></Dispatcher>
    <div class="likes">
      <div class="title">
        <span>{{$t('dispatcher.like')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool flex-rest-width" :class="{liked: dispatcher.liked}" @click="LikeDispatcher(dispatcher.id)">
          <span class="iconfont icon-like"></span>
          <span class="text" v-text="dispatcher.like_count ? dispatcher.like_count : $t('home.like')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="dispatcherlikes">
          <div class="like flex-row" v-for="like in dispatcherlikes" :key="like.id">
            <img class="avatar" :src="getAvatar(like.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{like.name}}</span></div>
              <div class="time"><span>{{formatTime(like.time)}}</span></div>
              <f7-link v-if="like.avatar === userid" class="tool flex-rest-width" :class="{liked: dispatcher.liked}" @click="UnLikeDispatcher(dispatcher.id, like.id)">
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

.dispatcher-page {
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
  .dispatcher-page {
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
import Dispatcher from '@/components/dispatcher'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      dispatcher: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      dispatchers: state => state.dispatchers,
      dispatcherlikes: state => state.dispatcherlikes,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.dispatcher = find(this.dispatchers, p => p.id === query.mid)
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    this.$root.chat.getDispatcherLikes(this.dispatcher.id, function(likes) {
      window.store.dispatch('initDispatcherLikes', likes)
    })
  },
  methods: {
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    getLikes(dispatcherid) {
      this.$root.chat.getDispatcherLikes(dispatcherid, function(likes) {
        window.store.dispatch('initDispatcherLikes', likes)
      })
    },
    LikeDispatcher(mid) {
      this.$root.chat.likeDispatcher(mid, function(likeKey) {
        console.log('likeDispatcher success')
      })
      this.getLikes(mid)
    },
    UnLikeDispatcher(mid, likeKey) {
      this.$root.chat.unlikeDispatcher(mid, likeKey, function(likeKey) {
        console.log('unlikeDispatcher success')
      })
      this.getLikes(mid)
    }
  },
  components: {
    Dispatcher
  }
}
</script>
