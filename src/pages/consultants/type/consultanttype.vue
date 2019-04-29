<template>
  <f7-page class="consultanttype-page">
    <f7-navbar :title="$t('app.consultanttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewConsultanttype"></f7-link>
        <f7-link v-if="isOwner === 'true'" :text="$t('app.add')" @click="addConsultanttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.consultanttype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('consultant.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list consultant-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in consultanttypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="consultanttype-radio" v-for="consultanttype_ in group"
          :key="consultanttype_.id"
          :value="consultanttype_.id"
          :title="consultanttype_.name"
          :checked="consultanttype === consultanttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('consultant.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.consultanttype-page {
  .searchbar{
    top: 44px;
  }
  .consultant-list {
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
  .consultanttype-page {
    .searchbar {
      display: none;
    }
    .consultant-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getConsultanttypeConfig, setConsultanttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      consultanttype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.consultanttype = getConsultanttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      consultanttypes: state => state.consultanttypes,
    }),
    consultanttypeGroups() {
      return groupBy(this.consultanttypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getConsultanttypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    viewConsultanttype() {
      const consultanttype = this.$$('input[name="consultanttype-radio"]:checked').val()
      setConsultanttypeConfig(consultanttype)
      this.$f7router.navigate(`/consultant/?consultanttype=${consultanttype}&isowner=${this.isOwner}`)
    },
    addConsultanttype() {
      const consultanttype = this.$$('input[name="consultanttype-radio"]:checked').val()
      setConsultanttypeConfig(consultanttype)
      this.$f7router.navigate(`/consultant/add/?consultanttype=${consultanttype}`)
    }
  }
}
</script>
