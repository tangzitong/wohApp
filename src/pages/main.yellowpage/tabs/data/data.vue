<template>
  <div class="data-view">
    <f7-list>
      <f7-list-group v-for="company_ in companys" :key="company_.id">
        <f7-list-item :link="getLink(company_.id)"
          :value="company_.id"
          :title="company_.name"
          :after="$t('app.update')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.companytype')" link="/company/type/?isowner=true">
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
    .icon-companys {
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
      companys: state => state.ownercompanys,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getCompanys()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getCompanys() {
      this.$f7.preloader.show()
      this.$root.chat.getCompanyListByOwner(function(ownercompanys) {
        window.store.dispatch('initOwnerCompanys', ownercompanys)
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
      return `/company/?mid=${id}&isowner=true`
    }
  }
}
</script>
