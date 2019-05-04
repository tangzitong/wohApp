<template>
  <div class="home-view">
    <f7-list>
      <f7-list-group v-for="project_ in projects" :key="project_.id">
        <f7-list-item :link="getLink(project_.id)"
          :value="project_.id"
          :title="project_.name">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.projecttype')" link="/project/type/?isowner=false">
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
    .icon-projects {
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
      projects: state => state.applicationprojects,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getProjects()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getProjects() {
      this.$f7.preloader.show()
      this.$root.chat.getProjectListByApplication(function(applicationprojects) {
        window.store.dispatch('initApplicationProjects', applicationprojects)
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
      return `/project/?mid=${id}&isowner=false`
    }
  }
}
</script>
