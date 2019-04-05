<template>
  <f7-page id="consultantsView" class="consultants-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.consultants')" :back-link="$t('app.back')">
    </f7-navbar>
    <consultant v-for="item in consultants" :key="item.id" :data="item" @consultant:content-click="routeToPost"></consultant>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Consultant from '@/components/consultant'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
    }
  },
  computed: {
    ...mapState({
      consultants: state => state.consultants,
    })
  },
  mounted() {
    this.getConsultants()
  },
  methods: {
    ...mapActions([
      'initConsultants',
      'infiniteConsultants',
      'refreshConsultants'
    ]),
    getConsultants() {
      this.$f7.preloader.show()
      axios.get('/consultants.json').then(res => {
        const consultants = res.data
        this.initConsultants(consultants)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/consultants.json').then(res => {
        if (parseInt(this.consultants[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const consultants = res.data
          this.refreshConsultants(consultants)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/consultants.json').then(res => {
        const id = parseInt(this.consultants[this.consultants.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const consultants = res.data
          this.infiniteConsultants(consultants)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/consultants/view/?mid=${data.id}`)
    }
  },
  components: {
    Consultant
  }
}
</script>
