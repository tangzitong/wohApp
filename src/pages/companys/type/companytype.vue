<template>
  <f7-page class="companytype-page">
    <f7-navbar :title="$t('app.companytype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveCompanytype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.companytype')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="companytype_ in companytypes" :key="companytype_.id">
        <f7-list-item radio name="companytype-radio"
                      :value="companytype_.id"
                      :title="companytype_.name"
                      :checked="companytype === companytype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getCompanytypeConfig, setCompanytypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      companytype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.companytype = getCompanytypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      companytypes: state => state.companytypes,
    })
  },
  mounted() {
    this.$store.dispatch('getCompanytypes', this.lang)
  },
  methods: {
    saveCompanytype() {
      const companytype = this.$$('input[name="companytype-radio"]:checked').val()
      setCompanytypeConfig(companytype)
      this.$f7router.navigate(`/companys/?companytype=${companytype}`)
    }
  }
}
</script>
