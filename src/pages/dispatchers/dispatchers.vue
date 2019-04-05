<template>
  <f7-page id="dispatchersView" class="dispatchers-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.dispatchers')" :back-link="$t('app.back')">
    </f7-navbar>
    <dispatcher v-for="item in dispatchers" :key="item.id" :data="item" @dispatcher:content-click="routeToPost"></dispatcher>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Dispatcher from '@/components/dispatcher'
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
      dispatchers: state => state.dispatchers,
    })
  },
  mounted() {
    this.getDispatchers()
  },
  methods: {
    ...mapActions([
      'initDispatchers',
      'infiniteDispatchers',
      'refreshDispatchers'
    ]),
    getDispatchers() {
      this.$f7.preloader.show()
      axios.get('/dispatchers.json').then(res => {
        const dispatchers = res.data
        this.initDispatchers(dispatchers)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/dispatchers.json').then(res => {
        if (parseInt(this.dispatchers[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const dispatchers = res.data
          this.refreshDispatchers(dispatchers)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/dispatchers.json').then(res => {
        const id = parseInt(this.dispatchers[this.dispatchers.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const dispatchers = res.data
          this.infiniteDispatchers(dispatchers)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/dispatchers/view/?mid=${data.id}`)
    }
  },
  components: {
    Dispatcher
  }
}
</script>
