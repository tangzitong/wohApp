<template>
  <div class="project post-project">
    <div class="project-header">
      <div class="avatar">
        <img :src="getAvatar(data.avatar)" alt="Image">
      </div>
      <div class="user flex-column">
        <div class="name">{{data.name}}</div>
        <div class="time">{{`#${data.nickname} `}}{{formatTime(data.created_at)}}</div>
      </div>
    </div>
    <div class="project-content">
      <div class="text">{{data.introduce}}</div>
      <div v-if="data.photo" class="image" @click.stop="openPhotoBrowser(data.photo)">
        <img :src="data.photo">
      </div>
      <div v-if="data.address" class="text">Address:{{data.address}}</div>
      <div v-if="data.Tel" class="text">Tel:{{data.Tel}}</div>
      <div v-if="data.Fax" class="text">Fax:{{data.Fax}}</div>
      <div v-if="data.Manager" class="text">Manager:{{data.Manager}}</div>
      <div v-if="data.HP" class="link">HP:{{data.HP}}</div>
    </div>
    <div class="project-footer flex-row" v-if="enableToolbar">
      <f7-button big raised color="green" fill @click="applicationProject">{{$t('project.application')}}
        <span class="text" v-text="data.application_count ? '(' + data.application_count + ')' : ''"></span>
      </f7-button>
      <f7-button big raised color="green" fill @click="likeProject">{{$t('project.like')}}
        <span class="text" v-text="data.like_count ? '(' + data.like_count + ')' : ''"></span>
      </f7-button>
    </div>
    <div class="project-footer flex-row" v-if="enableToolbar">
      <f7-button v-if="isOwner" big raised color="green" fill @click="updateProject">{{$t('project.update')}}</f7-button>
      <f7-button v-if="isOwner" big raised color="green" fill @click="deleteProject">{{$t('project.delete')}}</f7-button>
    </div>
  </div>
</template>

<style lang="less">
  @import "../../assets/styles/mixins.less";

  .project.post-project {
    background-color: white;
    margin: 10px 0;
    border-top: 1px solid #dadada;
    border-bottom: 1px solid #dadada;
    box-shadow: none;
    .project-header {
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
    .project-content{
      padding: 5px 10px;
      .image {
        margin-top: 5px;
        > img {
          width: 100%;
        }
      }
    }
    .project-footer{
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
    likeProject() {
      this.$f7router.navigate(`/project/likes/?mid=${this.data.id}`)
    },
    applicationProject() {
      this.$f7router.navigate(`/project/applications/?mid=${this.data.id}&isowner=${this.isOwner}`)
    },
    updateProject() {
      this.$f7router.navigate(`/project/add/?mid=${this.data.id}`)
    },
    deleteProject() {
      this.$root.chat.removeProject(`${this.data.id}`, function() {
        console.log('delete success')
      })
    },
    contentClick(data) {
      this.$emit('project:content-click', data)
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
