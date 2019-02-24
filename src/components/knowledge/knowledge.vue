<template>
  <div class="knowledge post-knowledge" @click="contentClick(data)">
    <div class="knowledge-header">
      <div class="avatar">
        <img :src="getAvatar(data.id)" alt="Image">
      </div>
      <div class="user flex-column">
        <div class="name">{{data.Title}}</div>
        <div class="time">{{`#${data.id} `}}{{formatTime(data.CreateDate)}}</div>
      </div>
    </div>
    <div class="knowledge-content">
      <div class="text">{{data.Description}}</div>
      <div v-if="data.Image" class="image" @click.stop="openPhotoBrowser(data.Image)">
        <img :src="data.Image">
      </div>
    </div>
    <div class="knowledge-footer flex-row" v-if="enableToolbar">
      <f7-link class="tool tool-border flex-rest-width">
        <span class="iconfont icon-comment"></span>
        <span class="text" v-text="data.StudentsNum ? data.StudentsNum : $t('knowledge.application')"></span>
      </f7-link>
      <f7-link class="tool flex-rest-width" :class="{liked: data.LikeNum}" @click.stop="toggleLike(data.id, data.LikeNum)">
        <span class="iconfont icon-like"></span>
        <span class="text" v-text="data.LikeNum ? data.LikeNum : $t('knowledge.like')"></span>
      </f7-link>
    </div>
  </div>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";

  .knowledge.post-knowledge {
    background-color: white;
    margin: 10px 0;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    box-shadow: none;
    .knowledge-header {
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
    .knowledge-content{
      padding: 5px 10px;
      .image {
        margin-top: 5px;
        > img {
          width: 100%;
        }
      }
    }
    .knowledge-footer{
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
        &.liked{
          > span {
            color: @mainColor;
          }
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
      this.$emit('knowledge:content-click', data)
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
      this.$store.dispatch('updateKnowledges', {
        mid,
        type: status ? 'unlike' : 'like'
      })
    }
  }
}
</script>
