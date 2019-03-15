<template>
  <div class="home-view">
    <f7-list>
      <f7-list-item :title="$t('app.jobs')" link="/jobs/type/">
        <i class="f7-icons size-25" slot="media">home</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.companys')" link="/companys/type/">
        <i class='iconfont icon-companys' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.projects')" link="/projects/type/">
        <i class='iconfont icon-projects' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.talents')" link="/talents/type/">
        <i class='iconfont icon-talents' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.consultants')" link="/consultants/type/">
        <i class='iconfont icon-consultants' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.dispatchers')" link="/dispatchers/type/">
        <i class='iconfont icon-dispatchers' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledge')" link="/knowledge/type/">
        <i class='iconfont icon-knowledges' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.tools')" link="/tools/type/">
        <i class='iconfont icon-tools' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.events')" link="/events/type/">
        <i class='iconfont icon-events' slot="media"></i>
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
    .icon-jobs {
      color: #0099ff;
    }
    .f7-icons.size-25 {
      color: #0099ff;
    }
    .icon-companys {
      color: #00cc99;
    }
    .icon-projects {
      color: #ffcc33;
    }
    .icon-talents {
      color: #fecc33;
    }
    .icon-consultants {
      color: #ffec33;
    }
    .icon-dispatchers {
      color: #ffdc33;
    }
    .icon-knowledges {
      color: #ff0c33;
    }
    .icon-tools {
      color: #ff8c33;
    }
    .icon-events {
      color: #ff9c33;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.user
    })
  }
}
</script>
