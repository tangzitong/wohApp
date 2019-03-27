<template>
  <f7-page id="companysView" class="companys-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.companys')" :back-link="$t('app.back')">
    </f7-navbar>
    <company v-for="item in companys" :key="item.id" :data="item" @company:content-click="routeToPost"></company>
  </f7-page>
</template>

<script>
import axios from 'axios'
import Company from '@/components/company'
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
      companys: state => state.companys,
    })
  },
  mounted() {
    this.getCompanys()
  },
  methods: {
    ...mapActions([
      'initCompanys',
      'infiniteCompanys',
      'refreshCompanys'
    ]),
    getCompanys() {
      this.$f7.preloader.show()
      axios.get('/companys.json').then(res => {
        const companys = res.data
        this.initCompanys(companys)
        this.$f7.preloader.hide()
      })
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      axios.get('/companys.json').then(res => {
        if (parseInt(this.companys[0].id) === 48) {
          this.$emit('show-tip')
        } else {
          const companys = res.data
          this.refreshCompanys(companys)
        }
        this.refreshing = false
        this.$f7.ptr.done()
      })
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      axios.get('/companys.json').then(res => {
        const id = parseInt(this.companys[this.companys.length - 1].id)
        if (id === 24) {
          this.loadedEnd = true
          this.$f7.infiniteScroll.destroy('#homeView .infinite-scroll-content')
          this.$$('#homeView .infinite-scroll-preloader').remove()
        } else {
          const companys = res.data
          this.infiniteCompanys(companys)
        }
        this.loadingMore = false
      })
    },
    routeToPost(data) {
      this.$f7router.navigate(`/companys/view/?mid=${data.id}`)
    }
  },
  components: {
    Company
  }
}
</script>
