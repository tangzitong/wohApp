<template>
  <div class="settings-view">
    <f7-list class="user-profile">
      <f7-list-item link="/about/">
        <img :src="userInfo.avatar_url" class="avatar" slot="media">
        <div slot="inner-start" class="detail">
          <div class="name" style="font-size:18px;">{{userInfo.nick_name}}</div>
          <div class="location" style="font-size:14px;">
            <span>{{$t('app.city')}}: </span>
            <span>{{userInfo.location}}</span>
          </div>
        </div>
      </f7-list-item>
    </f7-list>

    <!--Iconfont 版-->
      <f7-list>
      <f7-list-item :title="$t('app.language')" link="/language/">
        <i class='iconfont icon-language' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.area')" link="/area/">
        <i class='iconfont icon-area' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.industry')" link="/industry/">
        <i class='iconfont icon-industry' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.feedback')" link="/feedback/">
        <i class='iconfont icon-feedback2' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list v-if="isUserLogin">
      <f7-list-item :title="$t('modify.title')" link="/about/modify/">
        <i class='iconfont icon-modify' slot="media"></i>
      </f7-list-item>
    </f7-list>

    <f7-block v-if="isUserLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:27px" @click="logout">{{$t('logout.title')}}</f7-button>
    </f7-block>
    <!--<f7-list v-if="isUserLogin">
      <f7-list-item :title="$t('logout.title')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="logout">{{$t('logout.btn')}}</a>
      </f7-list-item>
    </f7-list>-->
  </div>
</template>

<style lang="less" scoped>
.settings-view {
  .list {
    margin: 15px 0;
    font-size: 16px;
    .iconfont {
      height: 34px;
    }
    .icon-language {
      color: #46b9fc;
      padding-top: 8px;
      font-size: 22px;
    }
    .icon-area {
      color: #46b9fc;
      padding-top: 8px;
    }
    .icon-industry{
      color: #46b9fc;
      padding-top: 8px;
    }
    .icon-feedback2 {
      color: #46b9fc;
      padding-top: 8px;
    }
    .icon-modify {
      color: #46b9fc;
      padding-top: 8px;
    }

    .icon-about1 {
      color: #46b9fc;
    }
  }
  .user-profile {
    .item-content {
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 5px;
    }
    .detail {
      .location {
        color: #858585;
        font-size: 15px;
        margin-top: 5px;
      }
    }
  }
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      isUserLogin: state => state.isUserLogin
    })
  },
  methods: {
    logout() {
      window.firebase.auth().signOut().then(() => {
        window.user = null
        window.store.dispatch('clearData')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
