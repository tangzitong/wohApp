<template>
  <div class="knowledge post-knowledge" @click="contentClick(data)">
    <div class="knowledge-header">
      <div class="avatar">
        <img :src="getAvatar(data.avatar)" alt="Image">
      </div>
      <div class="user flex-column">
        <div class="name">{{data.name}}</div>
        <div class="time">{{`#${data.nickname} `}}{{formatTime(data.created_at)}}</div>
      </div>
    </div>
    <div class="knowledge-content">
      <div class="text">{{data.address}}</div>
      <div v-if="data.photo" class="image" @click.stop="openPhotoBrowser(data.photo)">
        <img :src="data.photo">
      </div>
      <div v-if="data.Tel" class="text">Tel:{{data.Tel}}</div>
      <div v-if="data.Fax" class="text">Fax:{{data.Fax}}</div>
      <div v-if="data.Manager" class="text">Manager:{{data.Manager}}</div>
      <div v-if="data.HP" class="link" @click.stop="openPhotoBrowser(data.HP)">HP:{{data.HP}}</div>
    </div>
    <div class="knowledge-footer flex-row" v-if="enableToolbar">
      <f7-button big raised color="green" fill @click="applicationKnowledge">{{$t('knowledge.application')}}</f7-button>
      <f7-link class="tool flex-rest-width" :class="{liked: data.like_count}" @click.stop="toggleLike(data.id, data.like_count)">
        <span class="iconfont icon-like"></span>
        <span class="text" v-text="data.LikeNum ? data.LikeNum : $t('knowledge.like')"></span>
      </f7-link>
    </div>
    <div class="knowledge-footer flex-row" v-if="isOwner">
      <f7-button big raised color="green" fill @click="updateKnowledge">{{$t('knowledge.update')}}</f7-button>
      <f7-button big raised color="green" fill @click="deleteKnowledge">{{$t('knowledge.delete')}}</f7-button>
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
import { mapActions } from 'vuex'

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
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions([
      'updateApplication'
    ]),
    applicationKnowledge() {
      this.updateApplication({
        key1: 'applicationOpened',
        value1: true,
        key2: 'applicationType',
        value2: 'Knowledge',
        key3: 'applicationKey',
        value3: `${this.data.id}`
      })
    },
    updateKnowledge() {
      this.$f7router.navigate(`/knowledges/add/?mid=${this.data.id}`)
    },
    deleteKnowledge() {
      this.$root.chat.removeKnowledge(`${this.data.id}`, function() {
        console.log('delete success')
      })
    },
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
      return distanceInWordsToNow(time / (24 * 3600), { addSuffix: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    toggleLike(mid, status) {
      this.$root.chat.likeKnowledge(mid, function(likeKey) {
        console.log('likeKnowledge success')
      })
    }
  }
}
</script>
