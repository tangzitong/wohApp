<template>
  <f7-page class="dispatchertype-page">
    <f7-navbar :title="$t('app.dispatchertype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="saveDispatchertype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.dispatchertype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('dispatcher.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list>
      <f7-list-group v-for="dispatchertype_ in dispatchertypes" :key="dispatchertype_.id">
        <f7-list-item radio name="dispatchertype-radio"
                      :value="dispatchertype_.id"
                      :title="dispatchertype_.name"
                      :checked="dispatchertype === dispatchertype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getDispatchertypeConfig, setDispatchertypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      dispatchertype: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.dispatchertype = getDispatchertypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      dispatchertypes: state => state.dispatchertypes,
    })
  },
  mounted() {
    this.$store.dispatch('getDispatchertypes', this.lang)
  },
  methods: {
    saveDispatchertype() {
      const dispatchertype = this.$$('input[name="dispatchertype-radio"]:checked').val()
      setDispatchertypeConfig(dispatchertype)
      this.$f7router.navigate(`/dispatchers/?dispatchertype=${dispatchertype}`)
    }
  }
}
</script>
