<template>
  <f7-page id="reportsView" class="reports-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.reports')" :back-link="$t('app.back')">
    </f7-navbar>
    <report v-for="item in reports" :key="item.id" :data="item" @report:content-click="routeToPost"></report>
  </f7-page>
</template>

<script>
import axios from 'axios'
import report from '@/components/report'
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
      reports: state => state.reports,
    })
  },
  mounted() {
    this.getreports()
  },
  methods: {
    ...mapActions([
      'initReports',
      'infiniteReports',
      'refreshReports'
    ]),
    getreports() {
      this.$f7.preloader.show()
      axios.get('/reports.json').then(res => {
        const reports = res.data
        this.initReports(reports)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/reports.json').then(res => {
        if (parseInt(this.reports[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const reports = res.data
          this.refreshReports(reports)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/reports.json').then(res => {
        const id = parseInt(this.reports[this.reports.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const reports = res.data
          this.infiniteReports(reports)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    report
  }
}
</script>
