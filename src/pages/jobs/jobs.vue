<template>
  <f7-page id="jobsView" class="jobs-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <job v-for="item in jobs" :key="item.id" :data="item" @job:content-click="routeToPost"></job>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Job from '@/components/job'
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
      jobs: state => state.jobs,
    })
  },
  mounted() {
    this.getJobs()
  },
  methods: {
    ...mapActions([
      'initJobs',
      'infiniteJobs',
      'refreshJobs'
    ]),
    getJobs() {
      this.$f7.preloader.show()
      axios.get('/jobs.json').then(res => {
        const jobs = res.data
        this.initJobs(jobs)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/jobs.json').then(res => {
        if (parseInt(this.jobs[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const jobs = res.data
          this.refreshJobs(jobs)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/jobs.json').then(res => {
        const id = parseInt(this.jobs[this.jobs.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const jobs = res.data
          this.infiniteJobs(jobs)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Job
  }
}
</script>
