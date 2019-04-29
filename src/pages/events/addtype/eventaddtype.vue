<template>
  <f7-page class="eventtype-page">
    <f7-navbar :title="$t('app.eventtype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveEventtype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.eventtype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('event.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list event-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in eventtypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="eventtype-radio" v-for="eventtype_ in group"
          :key="eventtype_.id"
          :value="eventtype_.id"
          :title="eventtype_.name"
          :checked="eventtype === eventtype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('event.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.eventtype-page {
  .searchbar{
    top: 44px;
  }
  .event-list {
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
  .eventtype-page {
    .searchbar {
      display: none;
    }
    .event-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getEventtypeConfig, setEventtypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      eventtype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.eventtype = getEventtypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      eventtypes: state => state.eventtypes,
    }),
    eventtypeGroups() {
      return groupBy(this.eventtypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getEventtypes', this.lang)
  },
  methods: {
    saveEventtype() {
      const eventtype = this.$$('input[name="eventtype-radio"]:checked').val()
      setEventtypeConfig(eventtype)
      this.$f7router.navigate(`/event/add/?eventtype=${eventtype}`)
    }
  }
}
</script>
