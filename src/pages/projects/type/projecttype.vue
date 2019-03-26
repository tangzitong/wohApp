<template>
  <f7-page class="projecttype-page">
    <f7-navbar :title="$t('app.projecttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveProjecttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.projecttype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('project.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="(group, key) in projecttypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="projecttype-radio" v-for="projecttype_ in group"
          :key="projecttype_.id"
          :value="projecttype_.id"
          :title="projecttype_.name"
          :checked="projecttype === projecttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getProjecttypeConfig, setProjecttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      projecttype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.projecttype = getProjecttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      projecttypes: state => state.projecttypes,
    }),
    projecttypeGroups() {
      return groupBy(this.projecttypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getProjecttypes', this.lang)
  },
  methods: {
    saveProjecttype() {
      const projecttype = this.$$('input[name="projecttype-radio"]:checked').val()
      setProjecttypeConfig(projecttype)
      this.$f7router.navigate(`/projects/?projecttype=${projecttype}`)
    }
  }
}
</script>
