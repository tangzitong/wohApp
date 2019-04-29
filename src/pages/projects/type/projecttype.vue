<template>
  <f7-page class="projecttype-page">
    <f7-navbar :title="$t('app.projecttype')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.display')" @click="viewProjecttype"></f7-link>
        <f7-link v-if="isOwner === 'true'" :text="$t('app.add')" @click="addProjecttype"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('app.projecttype')}}</f7-block-title>
    <f7-searchbar
      search-container="#search-list"
      :disable-link-text="$t('app.cancel')"
      :placeholder="$t('project.placeholder')"
      :clear-button="true"
    ></f7-searchbar>
    <f7-list project-list id="search-list" class="searchbar-found">
      <f7-list-group v-for="(group, key) in projecttypeGroups" :key="key">
        <f7-list-item :title="key" group-title></f7-list-item>
        <f7-list-item radio name="projecttype-radio" v-for="projecttype_ in group"
          :key="projecttype_.id"
          :value="projecttype_.id"
          :title="projecttype_.name"
          :checked="projecttype === projecttype_.id"></f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <div class="empty-content">
        <i class="iconfont icon-wujieguoyangshi"></i>
        <div class="text">{{$t('project.empty')}}</div>
      </div>
    </f7-list>
  </f7-page>
</template>

<style lang="less">
.projecttype-page {
  .searchbar{
    top: 44px;
  }
  .project-list {
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
  .projecttype-page {
    .searchbar {
      display: none;
    }
    .project-list {
      padding-top: 0;
    }
  }
}
</style>

<script>
import groupBy from 'lodash/groupBy'
import { mapState } from 'vuex'
import { getProjecttypeConfig, setProjecttypeConfig } from '@/code'
import { getLangConfig } from '@/i18n'

export default {
  data() {
    return {
      projecttype: '1',
      lang: 'enUS',
      isOwner: 'false'
    }
  },
  created() {
    this.projecttype = getProjecttypeConfig()
    this.lang = getLangConfig()
  },
  computed: {
    ...mapState({
      projecttypes: state => state.projecttypes,
    }),
    projecttypeGroups() {
      return groupBy(this.projecttypes, 'nickname')
    }
  },
  mounted() {
    this.$store.dispatch('getProjecttypes', this.lang)
    const query = this.$f7route.query
    this.isOwner = query.isowner
  },
  methods: {
    viewProjecttype() {
      const projecttype = this.$$('input[name="projecttype-radio"]:checked').val()
      setProjecttypeConfig(projecttype)
      this.$f7router.navigate(`/project/?projecttype=${projecttype}&isowner=${this.isOwner}`)
    },
    addProjecttype() {
      const projecttype = this.$$('input[name="projecttype-radio"]:checked').val()
      setProjecttypeConfig(projecttype)
      this.$f7router.navigate(`/project/add/?projecttype=${projecttype}`)
    }
  }
}
</script>
