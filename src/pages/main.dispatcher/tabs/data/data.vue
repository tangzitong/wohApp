<template>
  <div class="data-view">
    <f7-list>
      <f7-list-group v-for="dispatcher_ in dispatchers" :key="dispatcher_.id">
        <f7-list-item :link="getLink(dispatcher_.id)"
          :value="dispatcher_.id"
          :title="dispatcher_.name"
          :after="$t('app.update')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.dispatchertype')" link="/dispatcher/type/?isowner=true">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.data-view {
  .list {
    margin: 15px 0;
    .iconfont {
      height: 29px;
    }
    .icon-dispatchers {
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
      dispatchers: state => state.ownerdispatchers,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getDispatchers()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getDispatchers() {
      this.$f7.preloader.show()
      this.$root.chat.getDispatcherListByOwner(function(ownerdispatchers) {
        window.store.dispatch('initOwnerDispatchers', ownerdispatchers)
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
      return `/dispatcher/?mid=${id}&isowner=true`
    }
  }
}
</script>
