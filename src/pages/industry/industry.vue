<template>
  <f7-page class="industry-page">
    <f7-navbar :title="$t('app.industry')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveIndustry"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.industry')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="industry_ in industrys" :key="industry_.id">
        <f7-list-item radio name="industry-radio"
                      :value="industry_.id"
                      :title="industry_.text"
                      :checked="industry === industry_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getIndustryConfig, setIndustryConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      industry: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.industry = getIndustryConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      industrys: state => state.industrys,
    })
  },
  mounted() {
    this.$store.dispatch('getIndustrys', this.lang)
  },
  methods: {
    saveIndustry() {
      const industry = this.$$('input[name="industry-radio"]:checked').val()
      setIndustryConfig(industry)
    }
  }
}
</script>
