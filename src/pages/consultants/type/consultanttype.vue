<template>
  <f7-page class="consultanttype-page">
    <f7-navbar :title="$t('app.consultanttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveConsultanttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.consultanttype')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="consultanttype_ in consultanttypes" :key="consultanttype_.id">
        <f7-list-item radio name="consultanttype-radio"
                      :value="consultanttype_.id"
                      :title="consultanttype_.name"
                      :checked="consultanttype === consultanttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getConsultanttypeConfig, setConsultanttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      consultanttype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.consultanttype = getConsultanttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      consultanttypes: state => state.consultanttypes,
    })
  },
  mounted() {
    this.$store.dispatch('getConsultanttypes', this.lang)
  },
  methods: {
    saveConsultanttype() {
      const consultanttype = this.$$('input[name="consultanttype-radio"]:checked').val()
      setConsultanttypeConfig(consultanttype)
      this.$f7router.navigate(`/consultants/?consultanttype=${consultanttype}`)
    }
  }
}
</script>
