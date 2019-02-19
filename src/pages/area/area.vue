<template>
  <f7-page class="area-page">
    <f7-navbar :title="$t('app.area')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveArea"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.area')}}</f7-block-title>
    <f7-list>
        <f7-list-item radio name="area-radio" value="enUS" title="English" :checked="lang === 'enUS'"></f7-list-item>
        <f7-list-item radio name="area-radio" value="zhCN" title="简体中文" :checked="lang === 'zhCN'"></f7-list-item>
        <f7-list-item radio name="area-radio" value="jaJP" title="日本語" :checked="lang === 'jaJP'"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { getAreaConfig, setAreaConfig } from '@/code'

export default {
  data() {
    return {
      area: '1'
    }
  },
  created() {
    this.area = getAreaConfig()
  },
  methods: {
    saveArea() {
      const area = this.$$('input[name="area-radio"]:checked').val()
      setAreaConfig(area)
    }
  }
}
</script>
