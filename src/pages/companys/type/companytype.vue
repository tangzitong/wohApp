<template>
  <f7-page class="companytype-page">
    <f7-navbar :title="$t('app.companytype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewCompanytype"></f7-link>
        <f7-link v-if="isOwner === 'true'" :text="$t('app.add')" @click="addCompanytype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.companytype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('company.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list company-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in companytypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="companytype-radio" v-for="companytype_ in group"
          :key="companytype_.id"
          :value="companytype_.id"
          :title="companytype_.name"
          :checked="companytype === companytype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('company.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.companytype-page {
  .searchbar{
    top: 44px;
  }
  .company-list {
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
  .companytype-page {
    .searchbar {
      display: none;
    }
    .company-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getCompanytypeConfig, setCompanytypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      companytype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.companytype = getCompanytypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      companytypes: state => state.companytypes,
    }),
    companytypeGroups() {
      return groupBy(this.companytypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getCompanytypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    viewCompanytype() {
      const companytype = this.$$('input[name="companytype-radio"]:checked').val()
      setCompanytypeConfig(companytype)
      this.$f7router.navigate(`/company/?companytype=${companytype}&isowner=${this.isOwner}`)
    },
    addCompanytype() {
      const companytype = this.$$('input[name="companytype-radio"]:checked').val()
      setCompanytypeConfig(companytype)
      this.$f7router.navigate(`/company/add/?companytype=${companytype}`)
    }
  }
}
</script>
