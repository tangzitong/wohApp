<template>
  <f7-page class="event-page">
    <f7-navbar :title="$t('app.events')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Event :enableToolbar="false" :data="event"></Event>
    <div class="likes">
      <div class="title">
        <span>{{$t('event.like')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool flex-rest-width" :class="{liked: event.liked}" @click="LikeEvent(event.id)">
          <span class="iconfont icon-like"></span>
          <span class="text" v-text="event.like_count ? event.like_count : $t('home.like')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="eventlikes">
          <div class="like flex-row" v-for="like in eventlikes" :key="like.id">
            <img class="avatar" :src="getAvatar(like.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{like.name}}</span></div>
              <div class="time"><span>{{formatTime(like.time)}}</span></div>
              <f7-link v-if="like.avatar === userid" class="tool flex-rest-width" :class="{liked: event.liked}" @click="UnLikeEvent(event.id, like.id)">
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

.event-page {
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
  .event-page {
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
import Event from '@/components/event'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      event: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      events: state => state.events,
      eventlikes: state => state.eventlikes,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.event = find(this.events, p => p.id === query.mid)
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    this.$root.chat.getEventLikes(this.event.id, function(likes) {
      window.store.dispatch('initEventLikes', likes)
    })
  },
  methods: {
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    getLikes(eventid) {
      this.$root.chat.getEventLikes(eventid, function(likes) {
        window.store.dispatch('initEventLikes', likes)
      })
    },
    LikeEvent(mid) {
      this.$root.chat.likeEvent(mid, function(likeKey) {
        console.log('likeEvent success')
      })
      this.getLikes(mid)
    },
    UnLikeEvent(mid, likeKey) {
      this.$root.chat.unlikeEvent(mid, likeKey, function(likeKey) {
        console.log('unlikeEvent success')
      })
      this.getLikes(mid)
    }
  },
  components: {
    Event
  }
}
</script>
