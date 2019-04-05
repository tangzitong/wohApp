<template>
  <f7-page class="eventtype-page">
    <f7-navbar :title="$t('app.eventtype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveEventtype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.eventtype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('event.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="(group, key) in eventtypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="eventtype-radio" v-for="eventtype_ in group"
          :key="eventtype_.id"
          :value="eventtype_.id"
          :title="eventtype_.name"
          :checked="eventtype === eventtype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getEventtypeConfig, setEventtypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      eventtype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.eventtype = getEventtypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      eventtypes: state => state.eventtypes,
    }),
    eventtypeGroups() {
      return groupBy(this.eventtypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getEventtypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    saveEventtype() {
      const eventtype = this.$$('input[name="eventtype-radio"]:checked').val()
      setEventtypeConfig(eventtype)
      this.$f7router.navigate(`/events/?eventtype=${eventtype}&isowner=${this.isOwner}`)
    }
  }
}
</script>
