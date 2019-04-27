<template>
  <div class="data-view">
    <f7-list>
      <f7-list-group v-for="knowledge_ in knowledges" :key="knowledge_.id">
        <f7-list-item :link="getLink(knowledge_.id)"
          :value="knowledge_.id"
          :title="knowledge_.name"
          :after="$t('app.update')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledgetype')" link="/knowledge/type/?isowner=true">
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
      knowledges: state => state.knowledges,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getKnowledges()
    }
  },
  watch: {
    isUserLogin: function (isUserLogin_) {
      if (isUserLogin_) {
        this.getKnowledges()
      }
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getKnowledges() {
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByOwner(function(knowledges) {
        window.store.dispatch('initKnowledges', knowledges)
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
      return `/knowledge/contents/?mid=${id}`
    }
  }
}
</script>
