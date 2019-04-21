<template>
  <f7-page class="knowledgecertificates-page">
    <f7-navbar :title="$t('app.knowledgecertificates')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewCertificate"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.knowledgecertificates')}}</f7-block-title>
    <f7-list>
      <f7-list-group v-for="knowledgecertificates_ in knowledgecertificates" :key="knowledgecertificates_.id">
        <f7-list-item radio name="knowledgecertificates-radio"
                      :value="knowledgecertificates_.id"
                      :title="knowledgecertificates_.name + '@' + formatTime(knowledgecertificates_.time)"
                      :media="getAvatar(knowledgecertificates_.avatar)"
                      :checked="knowledgecertificates === knowledgecertificates_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapState } from 'vuex'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { getRemoteAvatar } from '@/utils/appFunc'

export default {
  data() {
    return {
      knowledgekey: null
    }
  },
  computed: {
    ...mapState({
      knowledgecertificates: state => state.knowledgecertificates,
    })
  },
  mounted() {
    const query = this.$f7route.query
    this.knowledgekey = query.mid
    if (this.knowledgekey) {
      this.$root.chat.getKnowledgeCertificates(this.knowledgekey, data => {
        if (data) {
          window.store.dispatch('initKnowledgecertificates', data)
        }
      })
    }
  },
  methods: {
    openPhotoBrowser(url) {
      const pb = this.$f7.photoBrowser.create({
        zoom: 400,
        theme: 'dark',
        photos: [url]
      })
      pb.open()
    },
    formatTime(time) {
      return distanceInWordsToNow(time, { addSuffix: true, includeSeconds: true })
    },
    getAvatar(id) {
      return getRemoteAvatar(id)
    },
    viewCertificate() {
      const knowledgecertificate = this.$$('input[name="knowledgecertificates-radio"]:checked').val()
      this.openPhotoBrowser(this.knowledgecertificates[knowledgecertificate].certificatePath)
    }
  }
}
</script>
