<template>
  <f7-page id="knowledgesView" class="knowledges-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <knowledge v-for="item in knowledges" :key="item.id" :data="item" @knowledge:content-click="routeToPost"></knowledge>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Knowledge from '@/components/knowledge'
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
      knowledges: state => state.knowledges,
    })
  },
  mounted() {
    this.getKnowledges()
  },
  methods: {
    ...mapActions([
      'initKnowledges',
      'infiniteKnowledges',
      'refreshKnowledges'
    ]),
    getKnowledges() {
      this.$f7.preloader.show()
      axios.get('/knowledges.json').then(res => {
        const knowledges = res.data
        this.initKnowledges(knowledges)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/knowledges.json').then(res => {
        if (parseInt(this.knowledges[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const knowledges = res.data
          this.refreshKnowledges(knowledges)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/knowledges.json').then(res => {
        const id = parseInt(this.knowledges[this.knowledges.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const knowledges = res.data
          this.infiniteKnowledges(knowledges)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Knowledge
  }
}
</script>
