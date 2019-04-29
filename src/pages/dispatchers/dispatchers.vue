<template>
  <f7-page id="dispatchersView" class="dispatchers-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.dispatchers')" :back-link="$t('app.back')">
    </f7-navbar>
    <dispatcher v-for="item in dispatchers" :isOwner="isOwner" :key="item.id" :data="item"></dispatcher>
  </f7-page>
</template>

<script>
import Dispatcher from '@/components/dispatcher'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      dispatcherType: ''
    }
  },
  computed: {
    ...mapState({
      dispatchers: state => state.dispatchers,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.dispatcherType = query.dispatchertype
    this.getDispatchers(this.isOwner, this.dispatcherType)
  },
  methods: {
    getDispatchers(isOwner, dispatcherType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getDispatcherListByOwner(function(dispatchers) {
          window.store.dispatch('initDispatchers', dispatchers)
        })
      } else if (dispatcherType) {
        this.$root.chat.getDispatcherListByType(dispatcherType, function(dispatchers) {
          window.store.dispatch('initDispatchers', dispatchers)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getDispatcherListByOwner(function(dispatchers) {
          window.store.dispatch('refreshDispatchers', dispatchers)
        })
      } else if (this.dispatcherType) {
        this.$root.chat.getDispatcherListByType(this.dispatcherType, function(dispatchers) {
          window.store.dispatch('refreshDispatchers', dispatchers)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getDispatcherListByOwner(function(dispatchers) {
          window.store.dispatch('infiniteDispatchers', dispatchers)
        })
      } else if (this.dispatcherType) {
        this.$root.chat.getDispatcherListByType(this.dispatcherType, function(dispatchers) {
          window.store.dispatch('infiniteDispatchers', dispatchers)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Dispatcher
  }
}
</script>
