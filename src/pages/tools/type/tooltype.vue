<template>
  <f7-page class="tooltype-page">
    <f7-navbar :title="$t('app.tooltype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveTooltype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.tooltype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('tool.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="(group, key) in tooltypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="tooltype-radio" v-for="tooltype_ in group"
          :key="tooltype_.id"
          :value="tooltype_.id"
          :title="tooltype_.name"
          :checked="tooltype === tooltype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getTooltypeConfig, setTooltypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      tooltype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.tooltype = getTooltypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      tooltypes: state => state.tooltypes,
    }),
    tooltypeGroups() {
      return groupBy(this.tooltypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getTooltypes', this.lang)
  },
  methods: {
    saveTooltype() {
      const tooltype = this.$$('input[name="tooltype-radio"]:checked').val()
      setTooltypeConfig(tooltype)
      this.$f7router.navigate(`/tools/?tooltype=${tooltype}`)
    }
  }
}
</script>
