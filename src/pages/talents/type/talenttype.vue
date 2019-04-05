<template>
  <f7-page class="talenttype-page">
    <f7-navbar :title="$t('app.talenttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveTalenttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.talenttype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('talent.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="(group, key) in talenttypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="talenttype-radio" v-for="talenttype_ in group"
          :key="talenttype_.id"
          :value="talenttype_.id"
          :title="talenttype_.name"
          :checked="talenttype === talenttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getTalenttypeConfig, setTalenttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      talenttype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.talenttype = getTalenttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      talenttypes: state => state.resumetypes,
    }),
    talenttypeGroups() {
      return groupBy(this.talenttypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getResumetypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    saveTalenttype() {
      const talenttype = this.$$('input[name="talenttype-radio"]:checked').val()
      setTalenttypeConfig(talenttype)
      this.$f7router.navigate(`/talents/?talenttype=${talenttype}&isowner=${this.isOwner}`)
    }
  }
}
</script>
