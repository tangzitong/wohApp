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
    <f7-list>
      <f7-list-group v-for="(group, key) in jobtypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="jobtype-radio" v-for="jobtype_ in group"
          :key="jobtype_.id"
          :value="jobtype_.id"
          :title="jobtype_.name"
          :checked="jobtype === jobtype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

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
      this.$f7router.navigate(`/jobs/?jobtype=${jobtype}`)
    }
  }
}
</script>
