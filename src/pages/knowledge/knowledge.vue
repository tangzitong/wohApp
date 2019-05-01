<template>
  <f7-page id="knowledgesView" class="knowledges-view"
           ptr
           infinite>
    <f7-navbar :title="$t('app.knowledges')" :back-link="$t('app.back')">
    </f7-navbar>
    <knowledge v-for="item in knowledges" :isOwner="isOwner" :key="item.id" :data="item" @knowledge:content-click="routeToContent"></knowledge>
  </f7-page>
</template>

<script>
import Knowledge from '@/components/knowledge'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      refreshing: false,
      loadingMore: false,
      loadedEnd: false,
      isOwner: false,
      knowledgekey: null,
      knowledgeType: ''
    }
  },
  computed: {
    ...mapState({
      knowledges: state => state.knowledges,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    this.knowledgeType = query.knowledgetype
    this.knowledgekey = query.mid
    this.getKnowledges(this.isOwner, this.knowledgeType, this.knowledgekey)
  },
  methods: {
    getKnowledges(isOwner, knowledgeType, knowledgekey) {
      this.$f7.preloader.show()
      if (isOwner) {
        this.$root.chat.getKnowledgeListByOwner(function(knowledges) {
          window.store.dispatch('initKnowledges', knowledges)
        })
      } else if (knowledgeType) {
        this.$root.chat.getKnowledgeListByType(knowledgeType, function(knowledges) {
          window.store.dispatch('initKnowledges', knowledges)
        })
      } else if (knowledgekey) {
        this.$root.chat.getKnowledgeByKey(knowledgekey, function(knowledges) {
          const val = []
          val.push(knowledges)
          window.store.dispatch('initKnowledges', val)
        })
      }
      this.$f7.preloader.hide()
    },
    onRefresh() {
      if (this.refreshing) return false

      this.refreshing = true
      if (this.isOwner) {
        this.$root.chat.getKnowledgeListByOwner(function(knowledges) {
          window.store.dispatch('refreshKnowledges', knowledges)
        })
      } else if (this.knowledgeType) {
        this.$root.chat.getKnowledgeListByType(this.knowledgeType, function(knowledges) {
          window.store.dispatch('refreshKnowledges', knowledges)
        })
      }
      this.refreshing = false
      this.$f7.ptr.done()
    },
    onInfiniteScroll() {
      if (this.loadingMore || this.loadedEnd) return false

      this.loadingMore = true
      if (this.isOwner) {
        this.$root.chat.getKnowledgeListByOwner(function(knowledges) {
          window.store.dispatch('infiniteKnowledges', knowledges)
        })
      } else if (this.knowledgeType) {
        this.$root.chat.getKnowledgeListByType(this.knowledgeType, function(knowledges) {
          window.store.dispatch('infiniteKnowledges', knowledges)
        })
      }
      this.loadingMore = false
      this.$f7.ptr.done()
    },
    routeToContent(data) {
      this.$f7router.navigate(`/knowledge/contents/?mid=${data.id}&isowner=${this.isOwner}`)
    }
  },
  components: {
    Knowledge
  }
}
</script>
