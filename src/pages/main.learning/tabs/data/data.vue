<template>
  <div class="data-view">
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
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      isUserLogin: state => state.isUserLogin
    })
  }
}
</script>
