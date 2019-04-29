<template>
  <f7-page id="eventsView" class="events-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.events')" :back-link="$t('app.back')">
    </f7-navbar>
    <event v-for="item in events" :isOwner="isOwner" :key="item.id" :data="item"></event>
  </f7-page>
</template>

<script>
import Event from '@/components/event'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      eventType: ''
    }
  },
  computed: {
    ...mapState({
      events: state => state.events,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.eventType = query.eventtype
    this.getEvents(this.isOwner, this.eventType)
  },
  methods: {
    getEvents(isOwner, eventType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getEventListByOwner(function(events) {
          window.store.dispatch('initEvents', events)
        })
      } else if (eventType) {
        this.$root.chat.getEventListByType(eventType, function(events) {
          window.store.dispatch('initEvents', events)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getEventListByOwner(function(events) {
          window.store.dispatch('refreshEvents', events)
        })
      } else if (this.eventType) {
        this.$root.chat.getEventListByType(this.eventType, function(events) {
          window.store.dispatch('refreshEvents', events)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getEventListByOwner(function(events) {
          window.store.dispatch('infiniteEvents', events)
        })
      } else if (this.eventType) {
        this.$root.chat.getEventListByType(this.eventType, function(events) {
          window.store.dispatch('infiniteEvents', events)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Event
  }
}
</script>
