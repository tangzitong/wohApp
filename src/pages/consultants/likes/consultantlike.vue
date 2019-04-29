<template>
  <f7-page class="consultant-page">
    <f7-navbar :title="$t('app.consultants')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Consultant :enableToolbar="false" :data="consultant"></Consultant>
    <div class="likes">
      <div class="title">
        <span>{{$t('consultant.like')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool flex-rest-width" :class="{liked: consultant.liked}" @click="LikeConsultant(consultant.id)">
          <span class="iconfont icon-like"></span>
          <span class="text" v-text="consultant.like_count ? consultant.like_count : $t('home.like')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="consultantlikes">
          <div class="like flex-row" v-for="like in consultantlikes" :key="like.id">
            <img class="avatar" :src="getAvatar(like.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{like.name}}</span></div>
              <div class="time"><span>{{formatTime(like.time)}}</span></div>
              <f7-link v-if="like.avatar === userid" class="tool flex-rest-width" :class="{liked: consultant.liked}" @click="UnLikeConsultant(consultant.id, like.id)">
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

.consultant-page {
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
  .consultant-page {
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
import Consultant from '@/components/consultant'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      consultant: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      consultants: state => state.consultants,
      consultantlikes: state => state.consultantlikes,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.consultant = find(this.consultants, p => p.id === query.mid)
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    this.$root.chat.getConsultantLikes(this.consultant.id, function(likes) {
      window.store.dispatch('initConsultantLikes', likes)
    })
  },
  methods: {
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    getLikes(consultantid) {
      this.$root.chat.getConsultantLikes(consultantid, function(likes) {
        window.store.dispatch('initConsultantLikes', likes)
      })
    },
    LikeConsultant(mid) {
      this.$root.chat.likeConsultant(mid, function(likeKey) {
        console.log('likeConsultant success')
      })
      this.getLikes(mid)
    },
    UnLikeConsultant(mid, likeKey) {
      this.$root.chat.unlikeConsultant(mid, likeKey, function(likeKey) {
        console.log('unlikeConsultant success')
      })
      this.getLikes(mid)
    }
  },
  components: {
    Consultant
  }
}
</script>
