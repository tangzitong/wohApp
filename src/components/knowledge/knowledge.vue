<template>
  <div class="knowledge post-knowledge">
    <div class="knowledge-header">
      <div class="avatar">
        <img :src="getAvatar(data.avatar)" alt="Image">
      </div>
      <div class="user flex-column">
        <div class="name">{{data.name}}</div>
        <div class="time">{{`#${data.nickname} `}}{{formatTime(data.created_at)}}</div>
      </div>
    </div>
    <div class="knowledge-content" @click="contentClick(data)">
      <div class="text">{{data.introduce}}</div>
      <div v-if="data.photo" class="image">
        <img :src="data.photo">
      </div>
      <div v-if="data.address" class="text">Address:{{data.address}}</div>
      <div v-if="data.Tel" class="text">Tel:{{data.Tel}}</div>
      <div v-if="data.Fax" class="text">Fax:{{data.Fax}}</div>
      <div v-if="data.Manager" class="text">Manager:{{data.Manager}}</div>
      <div v-if="data.HP" class="link">HP:{{data.HP}}</div>
    </div>
    <div class="knowledge-footer flex-row" v-if="enableToolbar">
      <f7-button class="tool tool-border flex-rest-width" big raised color="blue" fill @click="applicationKnowledge">{{$t('knowledge.application')}}
        <span class="text" v-text="data.application_count ? '(' + data.application_count + ')' : ''"></span>
      </f7-button>
      <f7-button class="tool flex-rest-width" big raised color="blue" fill @click="likeKnowledge">{{$t('knowledge.like')}}
        <span class="text" v-text="data.like_count ? '(' + data.like_count + ')' : ''"></span>
      </f7-button>
    </div>
    <div class="knowledge-footer flex-row" v-if="enableToolbar">
      <f7-button class="tool tool-border flex-rest-width" big raised color="blue" fill @click="knowledgecontents">{{$t('app.knowledgecontents')}}
        <span class="text" v-text="data.content_count ? '(' + data.content_count + ')' : ''"></span>
      </f7-button>
      <f7-button class="tool flex-rest-width" big raised color="blue" fill @click="knowledgecertificates">{{$t('app.knowledgecertificates')}}
        <span class="text" v-text="data.certificate_count ? '(' + data.certificate_count + ')' : ''"></span>
      </f7-button>
    </div>
    <div class="knowledge-footer flex-row" v-if="enableToolbar">
      <f7-button class="tool tool-border flex-rest-width"  v-if="isOwner" big raised color="blue" fill @click="updateKnowledge">{{$t('knowledge.update')}}</f7-button>
      <f7-button class="tool flex-rest-width" v-if="isOwner" big raised color="blue" fill @click="deleteKnowledge">{{$t('knowledge.delete')}}</f7-button>
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
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    likeKnowledge() {
      this.$f7router.navigate(`/knowledge/likes/?mid=${this.data.id}`)
    },
    applicationKnowledge() {
      this.$f7router.navigate(`/knowledge/applications/?mid=${this.data.id}&isowner=${this.isOwner}`)
    },
    knowledgecertificates() {
      this.$f7router.navigate(`/knowledge/certificates/?mid=${this.data.id}`)
    },
    knowledgecontents() {
      this.$emit('knowledge:content-click', this.data)
    },
    updateKnowledge() {
      this.$f7router.navigate(`/knowledge/add/?mid=${this.data.id}`)
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
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    }
  }
}
</script>
