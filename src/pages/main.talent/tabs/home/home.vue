<template>
  <div class="home-view">
    <f7-list>
      <f7-list-group v-for="talent_ in talents" :key="talent_.id">
        <f7-list-item :link="getLink(talent_.id)"
          :value="talent_.id"
          :title="talent_.name">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.talenttype')" link="/talent/type/?isowner=false">
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
    .icon-talents {
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
      talents: state => state.applicationtalents,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getTalents()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getTalents() {
      this.$f7.preloader.show()
      this.$root.chat.getTalentListByApplication(function(applicationtalents) {
        window.store.dispatch('initApplicationTalents', applicationtalents)
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
      return `/talent/?mid=${id}&isowner=false`
    }
  }
}
</script>
