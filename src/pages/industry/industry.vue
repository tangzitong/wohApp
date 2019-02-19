<template>
  <f7-page class="industry-page">
    <f7-navbar :title="$t('app.industry')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveIndustry"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.industry')}}</f7-block-title>
    <f7-list>
        <f7-list-item radio name="industry-radio" value="enUS" title="English" :checked="lang === 'enUS'"></f7-list-item>
        <f7-list-item radio name="industry-radio" value="zhCN" title="简体中文" :checked="lang === 'zhCN'"></f7-list-item>
        <f7-list-item radio name="industry-radio" value="jaJP" title="日本語" :checked="lang === 'jaJP'"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { getIndustryConfig, setIndustryConfig } from '@/code'

export default {
  data() {
    return {
      industry: '1'
    }
  },
  created() {
    this.industry = getIndustryConfig()
  },
  methods: {
    saveIndustry() {
      const industry = this.$$('input[name="industry-radio"]:checked').val()
      setIndustryConfig(industry)
    }
  }
}
</script>
