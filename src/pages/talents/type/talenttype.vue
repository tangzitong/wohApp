<template>
  <f7-page class="talenttype-page">
    <f7-navbar :title="$t('app.talenttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewTalenttype"></f7-link>
        <f7-link v-if="isOwner === 'true'" :text="$t('app.add')" @click="addTalenttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.talenttype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('talent.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list talent-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in talenttypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="talenttype-radio" v-for="talenttype_ in group"
          :key="talenttype_.id"
          :value="talenttype_.id"
          :title="talenttype_.name"
          :checked="talenttype === talenttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('talent.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.talenttype-page {
  .searchbar{
    top: 44px;
  }
  .talent-list {
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
  .talenttype-page {
    .searchbar {
      display: none;
    }
    .talent-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getTalenttypeConfig, setTalenttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      talenttype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.talenttype = getTalenttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      talenttypes: state => state.talenttypes,
    }),
    talenttypeGroups() {
      return groupBy(this.talenttypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getTalenttypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    viewTalenttype() {
      const talenttype = this.$$('input[name="talenttype-radio"]:checked').val()
      setTalenttypeConfig(talenttype)
      this.$f7router.navigate(`/talent/?talenttype=${talenttype}&isowner=${this.isOwner}`)
    },
    addTalenttype() {
      const talenttype = this.$$('input[name="talenttype-radio"]:checked').val()
      setTalenttypeConfig(talenttype)
      this.$f7router.navigate(`/talent/add/?talenttype=${talenttype}`)
    }
  }
}
</script>
