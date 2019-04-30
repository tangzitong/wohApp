<template>
  <div class="home-view">
    <f7-list>
      <f7-list-group v-for="tool_ in tools" :key="tool_.id">
        <f7-list-item :link="getLink(tool_.id)"
          :value="tool_.id"
          :title="tool_.name"
          :after="$t('app.study')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.tooltype')" link="/tool/type/?isowner=false">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list v-if="!isUserLogin">
      <f7-list-item :title="$t('login.titleSignIn')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="openLogin">{{$t('login.titleSignIn')}}</a>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.home-view {
  .list {
    margin: 15px 0;
    .iconfont {
      height: 29px;
    }
    .icon-tools {
      color: #ff0c33;
    }
  }
}
</style>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      tools: state => state.applicationtools,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getTools()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getTools() {
      this.$f7.preloader.show()
      this.$root.chat.getToolListByApplication(function(applicationtools) {
        window.store.dispatch('initApplicationTools', applicationtools)
      })
      this.$f7.preloader.hide()
    },
    openLogin() {
      this.updatePopup({
        key: 'loginOpened',
        value: true
      })
    },
    getLink(id) {
      return `/tool/?mid=${id}&isowner=false`
    }
  }
}
</script>
