<template>
  <f7-page id="projectsView" class="projects-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <project v-for="item in projects" :key="item.id" :data="item" @project:content-click="routeToPost"></project>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Project from '@/components/project'
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
      projects: state => state.projects,
    })
  },
  mounted() {
    this.getProjects()
  },
  methods: {
    ...mapActions([
      'initProjects',
      'infiniteProjects',
      'refreshProjects'
    ]),
    getProjects() {
      this.$f7.preloader.show()
      axios.get('/projects.json').then(res => {
        const projects = res.data
        this.initProjects(projects)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/projects.json').then(res => {
        if (parseInt(this.projects[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const projects = res.data
          this.refreshProjects(projects)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/projects.json').then(res => {
        const id = parseInt(this.projects[this.projects.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const projects = res.data
          this.infiniteProjects(projects)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Project
  }
}
</script>
