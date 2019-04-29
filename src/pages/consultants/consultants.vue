<template>
  <f7-page id="consultantsView" class="consultants-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.consultants')" :back-link="$t('app.back')">
    </f7-navbar>
    <consultant v-for="item in consultants" :isOwner="isOwner" :key="item.id" :data="item"></consultant>
  </f7-page>
</template>

<script>
import Consultant from '@/components/consultant'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      consultantType: ''
    }
  },
  computed: {
    ...mapState({
      consultants: state => state.consultants,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.consultantType = query.consultanttype
    this.getConsultants(this.isOwner, this.consultantType)
  },
  methods: {
    getConsultants(isOwner, consultantType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getConsultantListByOwner(function(consultants) {
          window.store.dispatch('initConsultants', consultants)
        })
      } else if (consultantType) {
        this.$root.chat.getConsultantListByType(consultantType, function(consultants) {
          window.store.dispatch('initConsultants', consultants)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getConsultantListByOwner(function(consultants) {
          window.store.dispatch('refreshConsultants', consultants)
        })
      } else if (this.consultantType) {
        this.$root.chat.getConsultantListByType(this.consultantType, function(consultants) {
          window.store.dispatch('refreshConsultants', consultants)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getConsultantListByOwner(function(consultants) {
          window.store.dispatch('infiniteConsultants', consultants)
        })
      } else if (this.consultantType) {
        this.$root.chat.getConsultantListByType(this.consultantType, function(consultants) {
          window.store.dispatch('infiniteConsultants', consultants)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Consultant
  }
}
</script>
