<template>
  <f7-page id="talentsView" class="talents-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.talents')" :back-link="$t('app.back')">
    </f7-navbar>
    <talent v-for="item in talents" :key="item.id" :data="item" @talent:content-click="routeToPost"></talent>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Talent from '@/components/talent'
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
      talents: state => state.talents,
    })
  },
  mounted() {
    this.getTalents()
  },
  methods: {
    ...mapActions([
      'initTalents',
      'infiniteTalents',
      'refreshTalents'
    ]),
    getTalents() {
      this.$f7.preloader.show()
      axios.get('/talents.json').then(res => {
        const talents = res.data
        this.initTalents(talents)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/talents.json').then(res => {
        if (parseInt(this.talents[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const talents = res.data
          this.refreshTalents(talents)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/talents.json').then(res => {
        const id = parseInt(this.talents[this.talents.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const talents = res.data
          this.infiniteTalents(talents)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/talents/view/?mid=${data.id}`)
    }
  },
  components: {
    Talent
  }
}
</script>
