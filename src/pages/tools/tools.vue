<template>
  <f7-page id="toolsView" class="tools-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.tools')" :back-link="$t('app.back')">
    </f7-navbar>
    <tool v-for="item in tools" :isOwner="isOwner" :key="item.id" :data="item"></tool>
  </f7-page>
</template>

<script>
import Tool from '@/components/tool'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      toolType: ''
    }
  },
  computed: {
    ...mapState({
      tools: state => state.tools,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.toolType = query.tooltype
    this.getTools(this.isOwner, this.toolType)
  },
  methods: {
    getTools(isOwner, toolType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getToolListByOwner(function(tools) {
          window.store.dispatch('initTools', tools)
        })
      } else if (toolType) {
        this.$root.chat.getToolListByType(toolType, function(tools) {
          window.store.dispatch('initTools', tools)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getToolListByOwner(function(tools) {
          window.store.dispatch('refreshTools', tools)
        })
      } else if (this.toolType) {
        this.$root.chat.getToolListByType(this.toolType, function(tools) {
          window.store.dispatch('refreshTools', tools)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getToolListByOwner(function(tools) {
          window.store.dispatch('infiniteTools', tools)
        })
      } else if (this.toolType) {
        this.$root.chat.getToolListByType(this.toolType, function(tools) {
          window.store.dispatch('infiniteTools', tools)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Tool
  }
}
</script>
