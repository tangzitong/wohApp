<template>
  <f7-page id="resumesView" class="resumes-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.talents')" :back-link="$t('app.back')">
    </f7-navbar>
    <resume v-for="item in resumes" :key="item.id" :data="item" @resume:content-click="routeToPost"></resume>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Resume from '@/components/resume'
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
      resumes: state => state.resumes,
    })
  },
  mounted() {
    this.getResumes()
  },
  methods: {
    ...mapActions([
      'initResumes',
      'infiniteResumes',
      'refreshResumes'
    ]),
    getResumes() {
      this.$f7.preloader.show()
      axios.get('/resumes.json').then(res => {
        const resumes = res.data
        this.initResumes(resumes)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/resumes.json').then(res => {
        if (parseInt(this.resumes[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const resumes = res.data
          this.refreshResumes(resumes)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/resumes.json').then(res => {
        const id = parseInt(this.resumes[this.resumes.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const resumes = res.data
          this.infiniteResumes(resumes)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Resume
  }
}
</script>
