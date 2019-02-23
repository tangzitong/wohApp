<template>
  <f7-page class="reporttype-page">
    <f7-navbar :title="$t('app.reporttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveReporttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.reporttype')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="reporttype_ in reporttypes" :key="reporttype_.id">
        <f7-list-item radio name="reporttype-radio"
                      :value="reporttype_.id"
                      :title="reporttype_.name"
                      :checked="reporttype === reporttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getReporttypeConfig, setReporttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      reporttype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.reporttype = getReporttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      reporttypes: state => state.reporttypes,
    })
  },
  mounted() {
    this.$store.dispatch('getReporttypes', this.lang)
  },
  methods: {
    saveReporttype() {
      const reporttype = this.$$('input[name="reporttype-radio"]:checked').val()
      setReporttypeConfig(reporttype)
      this.$f7router.navigate(`/reports/?reporttype=${reporttype}`)
    }
  }
}
</script>
