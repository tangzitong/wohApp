<template>
  <div class="work-view">
    <f7-list>
      <f7-list-item :title="$t('app.jobs')" link="/jobs/add/">
        <i class='iconfont icon-jobs' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.companys')" link="/companys/add/">
        <i class='iconfont icon-companys' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.projects')" link="/projects/add/">
        <i class='iconfont icon-projects' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.talents')" link="/talents/add/">
        <i class='iconfont icon-talents' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.consultants')" link="/consultants/add/">
        <i class='iconfont icon-consultants' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.dispatchers')" link="/dispatchers/add/">
        <i class='iconfont icon-dispatchers' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledge')" link="/knowledge/add/">
        <i class='iconfont icon-knowledges' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.tools')" link="/tools/add/">
        <i class='iconfont icon-tools' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.events')" link="/events/add/">
        <i class='iconfont icon-events' slot="media"></i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.reports')" link="/reports/add/">
        <i class='iconfont icon-reports' slot="media"></i>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
  .work-view {
    .list

  {
    margin: 15px 0;
    .iconfont

    {
      height: 29px;
    }

    .icon-jobs {
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

    .icon-reports {
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
