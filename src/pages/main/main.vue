<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left></f7-nav-left>
      <f7-nav-title>{{navbarTitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon="iconfont icon-feedback3" icon-size="22" v-show="activedTab === 'home'" @click="openPublisher"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-toolbar tabbar :labels="!isAndroid">
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7homeoutline' : ''" :text="$t('app.home')" tab-link="#home" tab-link-active></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7person' : ''" :text="$t('app.contacts')" tab-link="#contacts"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-pic' : ''" :text="$t('app.news')" tab-link="#news"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-thumbup' : ''" :text="$t('app.data')" tab-link="#data"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7cameraoutline' : ''" :text="$t('app.work')" tab-link="#work"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7gearoutline' : ''" :text="$t('app.settings')" tab-link="#settings"></f7-link>
    </f7-toolbar>

    <f7-tabs>
      <f7-tab id="home" tab-active @tab:show="tabActived('home')">
        <home-view @show-tip="showLoadResult"></home-view>
      </f7-tab>
      <f7-tab id="contacts" @tab:show="tabActived('contacts')">
        <contacts-view></contacts-view>
      </f7-tab>
      <f7-tab id="news" @tab:show="tabActived('news')">
        <news-view></news-view>
      </f7-tab>
      <f7-tab id="data" @tab:show="tabActived('data')">
        <data-view></data-view>
      </f7-tab>
      <f7-tab id="work" @tab:show="tabActived('work')">
        <work-view></work-view>
      </f7-tab>
      <f7-tab id="settings" @tab:show="tabActived('settings')">
        <settings-view></settings-view>
      </f7-tab>
    </f7-tabs>

    <div class="load-result">{{$t('home.noNewestPost')}}</div>
  </f7-page>
</template>

<style lang="less" scoped>
.load-result{
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 50px;
    left: 0;
    background-color: #ff9500;
    color: #ffffff;
    z-index: 5001;
    text-align: center;
    line-height: 30px;
    opacity: 0;
}
.md {
  .load-result {
    bottom: 0;
  }
}
</style>

<script>
import HomeView from './tabs/home'
import ContactsView from './tabs/contacts'
import NewsView from './tabs/news'
import DataView from './tabs/data'
import WorkView from './tabs/work'
import SettingsView from './tabs/settings'
import { mapActions } from 'vuex'
import { isAndroid } from '@/utils/appFunc'

export default {
  data() {
    return {
      activedTab: 'home'
    }
  },
  computed: {
    navbarTitle() {
      switch (this.activedTab) {
        case 'home':
          return this.$t('app.app_name')
        case 'contacts':
          return this.$t('app.contacts')
        case 'news':
          return this.$t('app.news')
        case 'data':
          return this.$t('app.data')
        case 'work':
          return this.$t('app.work')
        case 'settings':
          return this.$t('app.settings')
      }
    },
    isAndroid() {
      return isAndroid()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    tabActived(tab) {
      this.activedTab = tab
    },
    showLoadResult() {
      setTimeout(_ => {
        this.$$('div.load-result').css('opacity', '1').transition(1000)

        setTimeout(_ => {
          this.$$('div.load-result').css('opacity', '0').transition(1000)
        }, 2100)
      }, 400)
    },
    openPublisher() {
      this.updatePopup({
        key: 'publisherOpened',
        value: true
      })
    }
  },
  components: {
    HomeView,
    ContactsView,
    NewsView,
    DataView,
    WorkView,
    SettingsView,
  }
}
</script>
