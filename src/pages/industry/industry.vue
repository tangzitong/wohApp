<template>
  <f7-page class="industry-page">
    <f7-navbar :title="$t('app.industry')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveIndustry"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.industry')}}</f7-block-title>
    <f7-list>
      <template v-if="industrys.length">
        <div class="industry flex-row" v-for="industry_ in industrys" :key="industry_.id">
          <f7-list-item radio name="industry-radio" :value="industry_.id" :title="industry_.text" :checked="industry === industry_.id"></f7-list-item>
        </div>
      </template>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getIndustryConfig, setIndustryConfig } from '@/code'

export default {
  data() {
    return {
      industry: '1',
      industrys: []
    }
  },
  created() {
    this.industry = getIndustryConfig()
  },
  computed: {
    ...mapState({
      industrys: state => state.industrys,
    })
  },
  mounted() {
    this.$store.dispatch('getIndustrys')
  },
  methods: {
    saveIndustry() {
      const industry = this.$$('input[name="industry-radio"]:checked').val()
      setIndustryConfig(industry)
    }
  }
}
</script>
