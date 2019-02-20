<template>
  <f7-page id="eventsView" class="events-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <event v-for="item in events" :key="item.id" :data="item" @event:content-click="routeToPost"></event>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Event from '@/components/event'
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
      events: state => state.events,
    })
  },
  mounted() {
    this.getEvents()
  },
  methods: {
    ...mapActions([
      'initEvents',
      'infiniteEvents',
      'refreshEvents'
    ]),
    getEvents() {
      this.$f7.preloader.show()
      axios.get('/events.json').then(res => {
        const events = res.data
        this.initEvents(events)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/events.json').then(res => {
        if (parseInt(this.events[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const events = res.data
          this.refreshEvents(events)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/events.json').then(res => {
        const id = parseInt(this.events[this.events.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const events = res.data
          this.infiniteEvents(events)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/post/?mid=${data.id}`)
    }
  },
  components: {
    Event
  }
}
</script>
