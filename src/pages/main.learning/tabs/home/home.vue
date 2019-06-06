<template>
  <div class="home-view">
    <f7-list>
      <f7-list-group v-for="knowledge_ in knowledges" :key="knowledge_.id">
        <f7-list-item :link="getLink(knowledge_.id)"
          :value="knowledge_.id"
          :title="knowledge_.name"
          :after="$t('app.study')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledgetype')" link="/knowledge/type/?isowner=false">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-block v-if="!isUserLogin">
      <f7-button class="tool tool-border flex-rest-width" big color="blue" style = "line-height:32px;background:#fc8c32" @click="openLogin">{{$t('login.titleSignIn')}}</f7-button>
    </f7-block>

    <!--<f7-list v-if="!isUserLogin">
      <f7-list-item :title="$t('login.titleSignIn')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="openLogin">{{$t('login.titleSignIn')}}</a>
      </f7-list-item>
    </f7-list>-->
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
      knowledges: state => state.applicationknowledges,
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
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getKnowledges() {
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByApplication(function(applicationknowledges) {
        window.store.dispatch('initApplicationKnowledges', applicationknowledges)
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
      return `/knowledge/?mid=${id}&isowner=false`
    }
  }
}
</script>
