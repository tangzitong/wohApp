<template>
  <f7-page class="knowledgetype-page">
    <f7-navbar :title="$t('app.knowledgetype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveKnowledgetype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.knowledgetype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('knowledge.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="(group, key) in knowledgetypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="knowledgetype-radio" v-for="knowledgetype_ in group"
          :key="knowledgetype_.id"
          :value="knowledgetype_.id"
          :title="knowledgetype_.name"
          :checked="knowledgetype === knowledgetype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getKnowledgetypeConfig, setKnowledgetypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      knowledgetype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.knowledgetype = getKnowledgetypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      knowledgetypes: state => state.knowledgetypes,
    }),
    knowledgetypeGroups() {
      return groupBy(this.knowledgetypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getKnowledgetypes', this.lang)
  },
  methods: {
    saveKnowledgetype() {
      const knowledgetype = this.$$('input[name="knowledgetype-radio"]:checked').val()
      setKnowledgetypeConfig(knowledgetype)
      this.$f7router.navigate(`/knowledge/?knowledgetype=${knowledgetype}`)
    }
  }
}
</script>
