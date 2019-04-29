<template>
  <f7-page class="project-page">
    <f7-navbar :title="$t('app.projects')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Project :enableToolbar="false" :data="project"></Project>
    <div class="applications">
      <div class="title">
        <span>{{$t('project.application')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool tool-border flex-rest-width" @click="applicationProject">
          <span class="iconfont icon-application"></span>
          <span class="text" v-text="project.application_count ? project.application_count : $t('project.application')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="projectapplications">
          <div class="application flex-row" v-for="application in projectapplications" :key="application.id">
            <img class="avatar" :src="getAvatar(application.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{application.name}}</span></div>
              <div class="time"><span>{{formatTime(application.time)}}</span></div>
              <div class="text"><span>{{application.text}}</span></div>
              <f7-link v-if="application.avatar === userid" class="tool tool-border flex-rest-width" @click="removeApplication(project.id, application.id)">
                <span class="iconfont icon-application"></span>
                <span class="text" v-text="$t('project.removeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus === true" class="tool tool-border flex-rest-width" @click="disagreeApplication(project.id, application.id)">
                <span class="iconfont icon-thumbup"></span>
                <span class="text" v-text="$t('project.disagreeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus !== true" class="tool tool-border flex-rest-width" @click="agreeApplication(project.id, application.id)">
                <span class="iconfont icon-close"></span>
                <span class="text" v-text="$t('project.agreeapplication')"></span>
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

.project-page {
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
  .project-page {
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
import Project from '@/components/project'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState, mapActions } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      project: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects,
      projectapplications: state => state.projectapplications,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.project = find(this.projects, p => p.id === query.mid)
    this.$root.chat.getProjectApplications(this.project.id, function(applications) {
      window.store.dispatch('initProjectApplications', applications)
    })
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
  },
  methods: {
    ...mapActions([
      'updateApplication'
    ]),
    applicationProject() {
      this.updateApplication({
        key1: 'applicationOpened',
        value1: true,
        key2: 'applicationType',
        value2: 'Project',
        key3: 'applicationKey',
        value3: `${this.project.id}`
      })
    },
    getApplications(projectid) {
      this.$root.chat.getProjectApplications(projectid, function(applications) {
        window.store.dispatch('initProjectApplications', applications)
      })
    },
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    agreeApplication(mid, applicationKey) {
      this.$root.chat.updateProjectApplication(mid, applicationKey, true, function(applicationKey) {
        console.log('updateProjectApplication success')
      })
      this.getApplications(mid)
    },
    disagreeApplication(mid, applicationKey) {
      this.$root.chat.updateProjectApplication(mid, applicationKey, false, function(applicationKey) {
        console.log('updateProjectApplication success')
      })
      this.getApplications(mid)
    },
    removeApplication(mid, applicationKey) {
      this.$root.chat.removeProjectApplication(mid, applicationKey, function(applicationKey) {
        console.log('removeProjectApplication success')
      })
      this.getApplications(mid)
    }
  },
  components: {
    Project
  }
}
</script>
