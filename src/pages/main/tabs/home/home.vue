<template>
  <div class="home-view">
    <f7-list>
      <f7-list-item :title="$t('app.jobs')" link="/jobmain/">
        <i class="f7-icons size-25" slot="media">bag</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.companys')" link="/companymain/">
        <i class="f7-icons size-25" slot="media">home</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.projects')" link="/projectmain/">
        <i class="f7-icons size-25" slot="media">home_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.talents')" link="/talentmain/">
        <i class="f7-icons size-25" slot="media">person</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.consultants')" link="/consultantmain/">
        <i class="f7-icons size-25" slot="media">person_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.dispatchers')" link="/dispatchermain/">
        <i class="f7-icons size-25" slot="media">persons_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.knowledges')" link="/knowledgemain/">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.tools')" link="/toolmain/">
        <i class="f7-icons size-25" slot="media">cloud_fill</i>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.events')" link="/eventmain/">
        <i class="f7-icons size-25" slot="media">calendar</i>
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
      userInfo: state => state.userProfile
    })
  }
}
</script>
