<template>
  <f7-page class="knowledgetype-page">
    <f7-navbar :title="$t('app.knowledgetype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewKnowledgetype"></f7-link>
        <f7-link v-if="isOwner === 'true'" :text="$t('app.add')" @click="addKnowledgetype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.knowledgetype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('knowledge.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list knowledge-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in knowledgetypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="knowledgetype-radio" v-for="knowledgetype_ in group"
          :key="knowledgetype_.id"
          :value="knowledgetype_.id"
          :title="knowledgetype_.name"
          :checked="knowledgetype === knowledgetype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('knowledge.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.knowledgetype-page {
  .searchbar{
    top: 44px;
  }
  .knowledge-list {
    margin: 20px 0;
    padding-top: 44px;
    .list-group-title {
      line-height: 25px;
      background: #f7f7f7;
      color: #8e8e93;
      font-weight: normal !important;
      font-size: 14px;
    }
    .item-media {
      > img {
        width: 35px;
        height: 35px;
      }
    }
  }
}
.md {
  .knowledgetype-page {
    .searchbar {
      display: none;
    }
    .knowledge-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getKnowledgetypeConfig, setKnowledgetypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      knowledgetype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.knowledgetype = getKnowledgetypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      knowledgetypes: state => state.knowledgetypes,
    }),
    knowledgetypeGroups() {
      return groupBy(this.knowledgetypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getKnowledgetypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    viewKnowledgetype() {
      const knowledgetype = this.$$('input[name="knowledgetype-radio"]:checked').val()
      setKnowledgetypeConfig(knowledgetype)
      this.$f7router.navigate(`/knowledge/?knowledgetype=${knowledgetype}&isowner=${this.isOwner}`)
    },
    addKnowledgetype() {
      const knowledgetype = this.$$('input[name="knowledgetype-radio"]:checked').val()
      setKnowledgetypeConfig(knowledgetype)
      this.$f7router.navigate(`/knowledge/add/?knowledgetype=${knowledgetype}`)
    }
  }
}
</script>
