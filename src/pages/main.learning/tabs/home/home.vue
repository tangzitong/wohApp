<template>
  <div class="home-view">
    <f7-list>
      <f7-list-item :title="$t('app.knowledgetype')" link="/knowledge/type/?isowner=false">
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
    .icon-knowledges {
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
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
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
    }
  }
}
</script>
