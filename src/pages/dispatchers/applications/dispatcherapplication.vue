<template>
  <f7-page class="dispatcher-page">
    <f7-navbar :title="$t('app.dispatchers')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Dispatcher :enableToolbar="false" :data="dispatcher"></Dispatcher>
    <div class="applications">
      <div class="title">
        <span>{{$t('dispatcher.application')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool tool-border flex-rest-width" @click="applicationDispatcher">
          <span class="iconfont icon-application"></span>
          <span class="text" v-text="dispatcher.application_count ? dispatcher.application_count : $t('dispatcher.application')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="dispatcherapplications">
          <div class="application flex-row" v-for="application in dispatcherapplications" :key="application.id">
            <img class="avatar" :src="getAvatar(application.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{application.name}}</span></div>
              <div class="time"><span>{{formatTime(application.time)}}</span></div>
              <div class="text"><span>{{application.text}}</span></div>
              <f7-link v-if="application.avatar === userid" class="tool tool-border flex-rest-width" @click="removeApplication(dispatcher.id, application.id)">
                <span class="iconfont icon-application"></span>
                <span class="text" v-text="$t('dispatcher.removeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus === true" class="tool tool-border flex-rest-width" @click="disagreeApplication(dispatcher.id, application.id)">
                <span class="iconfont icon-thumbup"></span>
                <span class="text" v-text="$t('dispatcher.disagreeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus !== true" class="tool tool-border flex-rest-width" @click="agreeApplication(dispatcher.id, application.id)">
                <span class="iconfont icon-close"></span>
                <span class="text" v-text="$t('dispatcher.agreeapplication')"></span>
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
import { mapState, mapActions } from 'vuex'
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
      dispatcherapplications: state => state.dispatcherapplications,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.dispatcher = find(this.dispatchers, p => p.id === query.mid)
    this.$root.chat.getDispatcherApplications(this.dispatcher.id, function(applications) {
      window.store.dispatch('initDispatcherApplications', applications)
    })
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
  },
  methods: {
    ...mapActions([
      'updateApplication'
    ]),
    applicationDispatcher() {
      this.updateApplication({
        key1: 'applicationOpened',
        value1: true,
        key2: 'applicationType',
        value2: 'Dispatcher',
        key3: 'applicationKey',
        value3: `${this.dispatcher.id}`
      })
    },
    getApplications(dispatcherid) {
      this.$root.chat.getDispatcherApplications(dispatcherid, function(applications) {
        window.store.dispatch('initDispatcherApplications', applications)
      })
    },
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    agreeApplication(mid, applicationKey) {
      this.$root.chat.updateDispatcherApplication(mid, applicationKey, true, function(applicationKey) {
        console.log('updateDispatcherApplication success')
      })
      this.getApplications(mid)
    },
    disagreeApplication(mid, applicationKey) {
      this.$root.chat.updateDispatcherApplication(mid, applicationKey, false, function(applicationKey) {
        console.log('updateDispatcherApplication success')
      })
      this.getApplications(mid)
    },
    removeApplication(mid, applicationKey) {
      this.$root.chat.removeDispatcherApplication(mid, applicationKey, function(applicationKey) {
        console.log('removeDispatcherApplication success')
      })
      this.getApplications(mid)
    }
  },
  components: {
    Dispatcher
  }
}
</script>
