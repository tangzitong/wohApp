<template>
  <f7-page id="newsView" class="news-view"
           ptr
           infinite
           >
    <card v-for="item in orderBytimeline" :key="item.id" :data="item" @card:content-click="routeToPost"></card>
  </f7-page>
</template>

<script>
import Card from '@/components/card'
import { mapState } from 'vuex'
import orderBy from 'lodash/orderBy'

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
      timeline: state => state.timeline,
    }),
    orderBytimeline() {
      return orderBy(this.timeline, 'created_at', 'desc')
    }
  },
  mounted() {
    this.getTimeline()
  },
  methods: {
    getTimeline() {
      this.$f7.preloader.show()
      this.$root.chat.getPostList(function(posts) {
        window.store.dispatch('initTimeline', posts)
      })
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      this.$root.chat.getPostList(function(posts) {
        window.store.dispatch('refreshTimeline', posts)
      })
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      this.$root.chat.getPostList(function(posts) {
        window.store.dispatch('infiniteTimeline', posts)
      })
      this.loadingMore = false
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Card
  }
}
</script>
