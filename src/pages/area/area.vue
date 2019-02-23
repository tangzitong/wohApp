<template>
  <f7-page class="area-page">
    <f7-navbar :title="$t('app.area')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveArea"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.area')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="area_ in areas" :key="area_.id">
        <f7-list-item radio name="area-radio"
                      :value="area_.id"
                      :title="area_.text"
                      :checked="area === area_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import { getAreaConfig, setAreaConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      area: '1',
      lang: 'enUS'
    }
  },
  created() {
    this.area = getAreaConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      areas: state => state.areas,
    })
  },
  mounted() {
    this.$store.dispatch('getAreas', this.lang)
  },
  methods: {
    saveArea() {
      const area = this.$$('input[name="area-radio"]:checked').val()
      setAreaConfig(area)
    }
  }
}
</script>
