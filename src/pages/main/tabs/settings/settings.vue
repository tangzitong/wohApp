<template>
  <div class="settings-view">
    <f7-list class="user-profile">
      <f7-list-item link="/profile/">
        <img :src="this.userInfo.avatar_url" class="avatar" slot="media">
        <div slot="inner-start" class="detail">
          <div class="name">{{userInfo.nick_name}}</div>
          <div class="location">
            <span>{{$t('app.city')}}: </span>
            <span>{{userInfo.location}}</span>
          </div>
        </div>
      </f7-list-item>
    </f7-list>
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
        <i class='iconfont icon-wujieguoyangshi' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.feedback')" link="/feedback/">
        <i class='iconfont icon-feedback2' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.about')" link="/about/">
        <i class='iconfont icon-about1' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <template v-if="!isUserLogin">
      <f7-list-item :title="$t('login.title')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="openLogin">{{$t('login.btn')}}</a>
      </f7-list-item>
      </template>
      <template v-else>
      <f7-list-item v-if="isUserLogin" :title="$t('modify.title')" link="/about/modify/">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
      </f7-list-item>
      <f7-list-item :title="$t('logout.title')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="logout">{{$t('logout.btn')}}</a>
      </f7-list-item>
      </template>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.settings-view {
  .list {
    margin: 15px 0;
    .iconfont {
      height: 29px;
    }
    .icon-language {
      color: #0099ff;
    }
    .icon-area {
      color: #0055ff;
    }
    .icon-industry {
      color: #5555ff;
    }
    .icon-feedback2 {
      color: #00cc99;
    }
    .icon-about1 {
      color: #ffcc33;
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
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      isUserLogin: this.$root.user
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    openLogin() {
      this.updatePopup({
        key: 'loginOpened',
        value: true
      })
    },
    logout() {
      this.$root.auth.signOut().then(() => {
        this.$store.dispatch('clearData')
        this.$f7router.navigate('/')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
