<template>
  <f7-page id="companysView" class="companys-view"
           ptr
           infinite
           @ptr:refresh="onRefresh"
           @infinite="onInfiniteScroll">
    <f7-navbar :title="$t('app.companys')" :back-link="$t('app.back')">
    </f7-navbar>
    <company v-for="item in companys" :isOwner="isOwner" :key="item.id" :data="item" @company:content-click="routeToPost"></company>
  </f7-page>
</template>

<script>
import Company from '@/components/company'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      companyType: ''
    }
  },
  computed: {
    ...mapState({
      companys: state => state.companys,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.companyType = query.companytype
    this.getCompanys(this.isOwner, this.companyType)
  },
  methods: {
    getCompanys(isOwner, companyType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getCompanyListByOwner(window.user.uid, function(companys) {
          window.store.dispatch('initCompanys', companys)
        })
      } else if (companyType) {
        this.$root.chat.getCompanyListByType(companyType, function(companys) {
          window.store.dispatch('initCompanys', companys)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getCompanyListByOwner(window.user.uid, function(companys) {
          window.store.dispatch('refreshCompanys', companys)
        })
      } else if (this.companyType) {
        this.$root.chat.getCompanyListByType(this.companyType, function(companys) {
          window.store.dispatch('refreshCompanys', companys)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getCompanyListByOwner(window.user.uid, function(companys) {
          window.store.dispatch('infiniteCompanys', companys)
        })
      } else if (this.companyType) {
        this.$root.chat.getCompanyListByType(this.companyType, function(companys) {
          window.store.dispatch('infiniteCompanys', companys)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
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
