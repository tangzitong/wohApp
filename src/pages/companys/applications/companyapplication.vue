<template>
  <f7-page class="company-page">
    <f7-navbar :title="$t('app.companys')" :back-link="$t('app.back')" sliding>
    </f7-navbar>
    <Company :enableToolbar="false" :data="company"></Company>
    <div class="applications">
      <div class="title">
        <span>{{$t('company.application')}}</span>
      </div>
      <f7-toolbar class="custom-toolbar flex-row" bottom-md>
        <f7-link class="tool tool-border flex-rest-width" @click="applicationCompany">
          <span class="iconfont icon-application"></span>
          <span class="text" v-text="company.application_count ? company.application_count : $t('company.application')"></span>
        </f7-link>
      </f7-toolbar>
      <div class="clist">
        <template v-if="companyapplications">
          <div class="application flex-row" v-for="application in companyapplications" :key="application.id">
            <img class="avatar" :src="getAvatar(application.avatar)" />
            <div class="detail flex-rest-width">
              <div class="name"><span>{{application.name}}</span></div>
              <div class="time"><span>{{formatTime(application.time)}}</span></div>
              <div class="text"><span>{{application.text}}</span></div>
              <f7-link v-if="application.avatar === userid" class="tool tool-border flex-rest-width" @click="removeApplication(company.id, application.id)">
                <span class="iconfont icon-application"></span>
                <span class="text" v-text="$t('company.removeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus === true" class="tool tool-border flex-rest-width" @click="disagreeApplication(company.id, application.id)">
                <span class="iconfont icon-thumbup"></span>
                <span class="text" v-text="$t('company.disagreeapplication')"></span>
              </f7-link>
              <f7-link v-if="application.avatar !== userid && application.approvalStatus !== true" class="tool tool-border flex-rest-width" @click="agreeApplication(company.id, application.id)">
                <span class="iconfont icon-close"></span>
                <span class="text" v-text="$t('company.agreeapplication')"></span>
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

.company-page {
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
  .company-page {
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
import Company from '@/components/company'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'
import { mapState, mapActions } from 'vuex'
import find from 'lodash/find'

export default {
  data() {
    return {
      company: {},
      userid: null
    }
  },
  computed: {
    ...mapState({
      companys: state => state.companys,
      companyapplications: state => state.companyapplications,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.company = find(this.companys, p => p.id === query.mid)
    this.$root.chat.getCompanyApplications(this.company.id, function(applications) {
      window.store.dispatch('initCompanyApplications', applications)
    })
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
  },
  methods: {
    ...mapActions([
      'updateApplication'
    ]),
    applicationCompany() {
      this.updateApplication({
        key1: 'applicationOpened',
        value1: true,
        key2: 'applicationType',
        value2: 'Company',
        key3: 'applicationKey',
        value3: `${this.company.id}`
      })
    },
    getApplications(companyid) {
      this.$root.chat.getCompanyApplications(companyid, function(applications) {
        window.store.dispatch('initCompanyApplications', applications)
      })
    },
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    agreeApplication(mid, applicationKey) {
      this.$root.chat.updateCompanyApplication(mid, applicationKey, true, function(applicationKey) {
        console.log('updateCompanyApplication success')
      })
      this.getApplications(mid)
    },
    disagreeApplication(mid, applicationKey) {
      this.$root.chat.updateCompanyApplication(mid, applicationKey, false, function(applicationKey) {
        console.log('updateCompanyApplication success')
      })
      this.getApplications(mid)
    },
    removeApplication(mid, applicationKey) {
      this.$root.chat.removeCompanyApplication(mid, applicationKey, function(applicationKey) {
        console.log('removeCompanyApplication success')
      })
      this.getApplications(mid)
    }
  },
  components: {
    Company
  }
}
</script>
