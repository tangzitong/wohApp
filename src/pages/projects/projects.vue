<template>
  <f7-page id="projectsView" class="projects-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.projects')" :back-link="$t('app.back')">
    </f7-navbar>
    <project v-for="item in projects" :isOwner="isOwner" :key="item.id" :data="item" @project:content-click="routeToPost"></project>
  </f7-page>
</template>

<script>
import Project from '@/components/project'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      projectType: ''
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.projectType = query.projecttype
    this.getProjects(this.isOwner, this.projectType)
  },
  methods: {
    getProjects(isOwner, projectType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getProjectListByOwner(window.user.uid, function(projects) {
          window.store.dispatch('initProjects', projects)
        })
      } else if (projectType) {
        this.$root.chat.getProjectListByType(projectType, function(projects) {
          window.store.dispatch('initProjects', projects)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getProjectListByOwner(window.user.uid, function(projects) {
          window.store.dispatch('refreshProjects', projects)
        })
      } else if (this.projectType) {
        this.$root.chat.getProjectListByType(this.projectType, function(projects) {
          window.store.dispatch('refreshProjects', projects)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getProjectListByOwner(window.user.uid, function(projects) {
          window.store.dispatch('infiniteProjects', projects)
        })
      } else if (this.projectType) {
        this.$root.chat.getProjectListByType(this.projectType, function(projects) {
          window.store.dispatch('infiniteProjects', projects)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    },
    routeToPost(data) {
      this.$f7router.navigate(`/projects/view/?mid=${data.id}`)
    }
  },
  components: {
    Project
  }
}
</script>
