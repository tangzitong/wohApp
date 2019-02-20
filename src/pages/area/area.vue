<template>
  <f7-page class="area-page">
    <f7-navbar :title="$t('app.area')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')" @click="saveArea"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.area')}}</f7-block-title>
    <f7-list>
      <template v-if="areas.length">
        <div class="area flex-row" v-for="area in areas" :key="area.id">
          <f7-list-item radio name="area-radio" value="area.id" title="area.text" :checked="area === area.id"></f7-list-item>
        </div>
      </template>
    </f7-list>
  </f7-page>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import { getAreaConfig, setAreaConfig } from '@/code'

export default {
  data() {
    return {
      area: '1'，
      areas： []
    }
  },
  created() {
    this.area = getAreaConfig()
  },
  computed: {
    ...mapState({
      areas: state => state.areas,
    })
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    ...mapActions([
      'initArea'
    ]),
    getAreas() {
      this.$f7.preloader.show()
      axios.get('/area.json').then(res => {
        const areas = res.data
        this.initArea(areas)
        this.$f7.preloader.hide()
      })
    },
    saveArea() {
      const area = this.$$('input[name="area-radio"]:checked').val()
      setAreaConfig(area)
    }
  }
}
</script>
