<template>
  <div class="data-view">
    <f7-list>
      <f7-list-group v-for="consultant_ in consultants" :key="consultant_.id">
        <f7-list-item :link="getLink(consultant_.id)"
          :value="consultant_.id"
          :title="consultant_.name"
          :after="$t('app.update')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.consultanttype')" link="/consultant/type/?isowner=true">
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
    .icon-consultants {
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
      consultants: state => state.ownerconsultants,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getConsultants()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getConsultants() {
      this.$f7.preloader.show()
      this.$root.chat.getConsultantListByOwner(function(ownerconsultants) {
        window.store.dispatch('initOwnerConsultants', ownerconsultants)
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
      return `/consultant/?mid=${id}&isowner=true`
    }
  }
}
</script>
