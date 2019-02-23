<template>
  <div class="report post-report" @click="contentClick(data)">
    <div class="report-header">
      <div class="avatar">
        <img :src="getAvatar(data.id)" alt="Image">
      </div>
      <div class="user flex-column">
        <div class="name">{{data.username}}</div>
      </div>
    </div>
    <div class="report-content">
      <div><span v-text="$t('report.DateHyouji')"></span><span class="text"> :{{data.date}} </span></div>
      <div><span v-text="$t('report.WorkTimehyoji')"></span><span class="text"> :{{data.startTime}}~{{data.endTime}}</span></div>
      <div><span v-text="$t('report.WorkContenthyoji')"></span><span class="text"> :{{data.content}}</span></div>
      <div><span v-text="$t('report.WorkAddresshyoji')"></span><span class="text"> :{{data.address}}</span></div>
    </div>
    <div class="report-footer flex-row" v-if="enableToolbar" style="background:#FFA500;">
      <f7-link class="tool tool-border flex-rest-width"  :text="$t('report.application')" @click="sendResult"></f7-link>
    </div>
  </div>
</template>
<style lang="less">
  @import "../../assets/styles/mixins.less";

  .report.post-report {
    background-color: white;
    margin: 10px 0;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    box-shadow: none;
    .report-header {
      padding: 10px;
      padding-bottom: 5px;
      justify-content: inherit;
      align-items: inherit;
      &:after {
        height: 0;
      }
      .avatar, .avatar > img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 9px;
      }
      .user {
        justify-content: center;
        .time {
          font-size: 12px;
          color: #8999a5;
          margin-top: 3px;
        }
        .name {
          color: #ff9800;
          font-weight: bold;
          font-size: 14px;
        }
      }
    }
    .report-content{
      padding: 5px 10px;
      .image {
        margin-top: 5px;
        > img {
          width: 100%;
        }
      }
    }
    .report-footer{
      min-height: 35px;
      padding: 0;
      a.link {
        line-height: 35px;
        height: 35px;
      }
      .tool {
        justify-content: center;
        &.tool-border{
          border-right: 1px solid #e1e1e1;
        }
        > span {
          color: #6D6D78;
          vertical-align: middle;
        }
        .iconfont{
          font-size: 16px;
        }
        .text {
          font-size: 13px;
        }
      }
    }
  }
</style>

<script>
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    enableToolbar: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    contentClick(data) {
      this.$emit('card:content-click', data)
    },
    openPhotoBrowser(url) {
      const pb = this.$f7.photoBrowser.create({
        zoom: 400,
        theme: 'dark',
        photos: [url]
      })
      pb.open()
    },
    formatTime(time) {
      return distanceInWordsToNow(time * 1000, { addSuffix: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    toggleLike(mid, status) {
      this.$store.dispatch('updateTimeline', {
        mid,
        type: status ? 'unlike' : 'like'
      })
    },
    sendResult() {
      $$.alert(this.$t('report.result'))
    }
  }
}
</script>
