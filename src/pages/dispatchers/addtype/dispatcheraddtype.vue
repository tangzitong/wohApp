<template>
  <f7-page class="dispatchertype-page">
    <f7-navbar :title="$t('app.dispatchertype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveDispatchertype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.dispatchertype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('dispatcher.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list dispatcher-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in dispatchertypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="dispatchertype-radio" v-for="dispatchertype_ in group"
          :key="dispatchertype_.id"
          :value="dispatchertype_.id"
          :title="dispatchertype_.name"
          :checked="dispatchertype === dispatchertype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('dispatcher.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.dispatchertype-page {
  .searchbar{
    top: 44px;
  }
  .dispatcher-list {
    margin: 20px 0;
    padding-top: 44px;
    .list-group-title {
      line-height: 25px;
      background: #f7f7f7;
      color: #8e8e93;
      font-weight: normal !important;
      font-size: 14px;
    }
    .item-media {
      > img {
        width: 35px;
        height: 35px;
      }
    }
  }
}
.md {
  .dispatchertype-page {
    .searchbar {
      display: none;
    }
    .dispatcher-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getDispatchertypeConfig, setDispatchertypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      dispatchertype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.dispatchertype = getDispatchertypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      dispatchertypes: state => state.dispatchertypes,
    }),
    dispatchertypeGroups() {
      return groupBy(this.dispatchertypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getDispatchertypes', this.lang)
  },
  methods: {
    saveDispatchertype() {
      const dispatchertype = this.$$('input[name="dispatchertype-radio"]:checked').val()
      setDispatchertypeConfig(dispatchertype)
      this.$f7router.navigate(`/dispatcher/add/?dispatchertype=${dispatchertype}`)
    }
  }
}
</script>
