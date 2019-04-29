<template>
  <f7-page id="jobsView" class="jobs-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.jobs')" :back-link="$t('app.back')">
    </f7-navbar>
    <job v-for="item in jobs" :isOwner="isOwner" :key="item.id" :data="item"></job>
  </f7-page>
</template>

<script>
import Job from '@/components/job'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      jobType: ''
    }
  },
  computed: {
    ...mapState({
      jobs: state => state.jobs,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.jobType = query.jobtype
    this.getJobs(this.isOwner, this.jobType)
  },
  methods: {
    getJobs(isOwner, jobType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getJobListByOwner(function(jobs) {
          window.store.dispatch('initJobs', jobs)
        })
      } else if (jobType) {
        this.$root.chat.getJobListByType(jobType, function(jobs) {
          window.store.dispatch('initJobs', jobs)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getJobListByOwner(function(jobs) {
          window.store.dispatch('refreshJobs', jobs)
        })
      } else if (this.jobType) {
        this.$root.chat.getJobListByType(this.jobType, function(jobs) {
          window.store.dispatch('refreshJobs', jobs)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getJobListByOwner(function(jobs) {
          window.store.dispatch('infiniteJobs', jobs)
        })
      } else if (this.jobType) {
        this.$root.chat.getJobListByType(this.jobType, function(jobs) {
          window.store.dispatch('infiniteJobs', jobs)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Job
  }
}
</script>
