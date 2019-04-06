<template>
  <div class="work-view">
    <f7-list>
      <f7-list-item :title="$t('app.jobs')" link="/jobs/addtype/">
        <i class="f7-icons size-25" slot="media">bag</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.companys')" link="/companys/addtype/">
        <i class="f7-icons size-25" slot="media">home</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.projects')" link="/projects/addtype/">
        <i class="f7-icons size-25" slot="media">home_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.talents')" link="/talents/addtype/">
        <i class="f7-icons size-25" slot="media">person</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.consultants')" link="/consultants/addtype/">
        <i class="f7-icons size-25" slot="media">person_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.dispatchers')" link="/dispatchers/addtype/">
        <i class="f7-icons size-25" slot="media">persons_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledge')" link="/knowledge/addtype/">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.tools')" link="/tools/addtype/">
        <i class="f7-icons size-25" slot="media">cloud_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.events')" link="/events/addtype/">
        <i class="f7-icons size-25" slot="media">calendar</i>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.work-view {
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
      userInfo: state => state.userProfile
    })
  }
}
</script>
