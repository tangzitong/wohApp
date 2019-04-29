<template>
  <f7-page id="talentsView" class="talents-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.talents')" :back-link="$t('app.back')">
    </f7-navbar>
    <talent v-for="item in talents" :isOwner="isOwner" :key="item.id" :data="item"></talent>
  </f7-page>
</template>

<script>
import Talent from '@/components/talent'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      talentType: ''
    }
  },
  computed: {
    ...mapState({
      talents: state => state.talents,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.talentType = query.talenttype
    this.getTalents(this.isOwner, this.talentType)
  },
  methods: {
    getTalents(isOwner, talentType) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getTalentListByOwner(function(talents) {
          window.store.dispatch('initTalents', talents)
        })
      } else if (talentType) {
        this.$root.chat.getTalentListByType(talentType, function(talents) {
          window.store.dispatch('initTalents', talents)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getTalentListByOwner(function(talents) {
          window.store.dispatch('refreshTalents', talents)
        })
      } else if (this.talentType) {
        this.$root.chat.getTalentListByType(this.talentType, function(talents) {
          window.store.dispatch('refreshTalents', talents)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getTalentListByOwner(function(talents) {
          window.store.dispatch('infiniteTalents', talents)
        })
      } else if (this.talentType) {
        this.$root.chat.getTalentListByType(this.talentType, function(talents) {
          window.store.dispatch('infiniteTalents', talents)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    }
  },
  components: {
    Talent
  }
}
</script>
