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
        <div class="industry flex-row" v-for="industry in industrys" :key="industry.id">
          <f7-list-item radio name="industry-radio" value="industry.id" title="industry.text" :checked="industry === industry.id"></f7-list-item>
        </div>
      </template>
    </f7-list>
  </f7-page>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
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
  computed: {
    ...mapState({
      industrys: state => state.industrys,
    })
  },
  mounted() {
    this.getIndustrys()
  },
  methods: {
    ...mapActions([
      'initIndustry'
    ]),
    getIndustrys() {
      this.$f7.preloader.show()
      axios.get('/industry.json').then(res => {
        const industrys = res.data
        this.initIndustry(industrys)
        this.$f7.preloader.hide()
      })
    },
    saveIndustry() {
      const industry = this.$$('input[name="industry-radio"]:checked').val()
      setIndustryConfig(industry)
    }
  }
}
</script>
