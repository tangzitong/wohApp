<template>
  <f7-page class="jobtype-page">
    <f7-navbar :title="$t('app.jobtype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveJobtype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.jobtype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('job.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list job-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in jobtypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="jobtype-radio" v-for="jobtype_ in group"
          :key="jobtype_.id"
          :value="jobtype_.id"
          :title="jobtype_.name"
          :checked="jobtype === jobtype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('job.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.jobtype-page {
  .searchbar{
    top: 44px;
  }
  .job-list {
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
  .jobtype-page {
    .searchbar {
      display: none;
    }
    .job-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getJobtypeConfig, setJobtypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      jobtype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.jobtype = getJobtypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      jobtypes: state => state.jobtypes,
    }),
    jobtypeGroups() {
      return groupBy(this.jobtypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getJobtypes', this.lang)
  },
  methods: {
    saveJobtype() {
      const jobtype = this.$$('input[name="jobtype-radio"]:checked').val()
      setJobtypeConfig(jobtype)
      this.$f7router.navigate(`/job/add/?jobtype=${jobtype}`)
    }
  }
}
</script>
