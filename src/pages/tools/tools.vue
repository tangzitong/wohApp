<template>
  <f7-page id="toolsView" class="tools-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.tools')" :back-link="$t('app.back')">
    </f7-navbar>
    <tool v-for="item in tools" :key="item.id" :data="item" @tool:content-click="routeToPost"></tool>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Tool from '@/components/tool'
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
      tools: state => state.tools,
    })
  },
  mounted() {
    this.getTools()
  },
  methods: {
    ...mapActions([
      'initTools',
      'infiniteTools',
      'refreshTools'
    ]),
    getTools() {
      this.$f7.preloader.show()
      axios.get('/tools.json').then(res => {
        const tools = res.data
        this.initTools(tools)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/tools.json').then(res => {
        if (parseInt(this.tools[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const tools = res.data
          this.refreshTools(tools)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/tools.json').then(res => {
        const id = parseInt(this.tools[this.tools.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const tools = res.data
          this.infiniteTools(tools)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/tools/view/?mid=${data.id}`)
    }
  },
  components: {
    Tool
  }
}
</script>
