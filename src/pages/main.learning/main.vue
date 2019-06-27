<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon="iconfont icon-download" icon-size="22" v-show="activedTab === 'home'" @click="openDownload"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{navbarTitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon="iconfont icon-feedback3" icon-size="22" v-show="activedTab === 'news'" @click="openPublisher"></f7-link>
        <f7-link icon="iconfont icon-login" icon-size="22" v-show="activedTab === 'home' && !isUserLogin" @click="openLogin"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-toolbar tabbar :labels="!isAndroid">
      <f7-link id="homelink" :icon="!isAndroid ? 'iconfont icon-ios7homepage' : ''" :text="$t('app.student')" tab-link="#home" tab-link-active></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7chatbubble' : ''" :text="$t('app.chat')" tab-link="#contacts"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7news' : ''" :text="$t('app.news')" tab-link="#news"></f7-link>
      <f7-link id="datalink" :icon="!isAndroid ? 'iconfont icon-ios7person' : ''" :text="$t('app.teacher')" tab-link="#data"></f7-link>
      <f7-link :icon="!isAndroid ? 'iconfont icon-ios7gearoutline' : ''" :text="$t('app.settings')" tab-link="#settings"></f7-link>
    </f7-toolbar>

    <f7-tabs>
      <f7-tab id="home" style="font-size: 24px" tab-active @tab:show="tabActived('home')">
        <home-view @show-tip="showLoadResult"></home-view>
      </f7-tab>
      <f7-tab id="contacts" style="font-size: 24px" @tab:show="tabActived('contacts')">
        <contacts-view></contacts-view>
      </f7-tab>
      <f7-tab id="news" style="font-size: 22px" @tab:show="tabActived('news')">
        <news-view></news-view>
      </f7-tab>
      <f7-tab id="data" style="font-size: 28px" @tab:show="tabActived('data')">
        <data-view></data-view>
      </f7-tab>
      <f7-tab id="settings" style="font-size: 24px" @tab:show="tabActived('settings')">
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
import SettingsView from './tabs/settings'
import { mapState, mapActions } from 'vuex'
import { isAndroid } from '@/utils/appFunc'

export default {
  data() {
    return {
      activedTab: 'home',
      isOwner: false
    }
  },
  computed: {
    ...mapState({
      isUserLogin: state => state.isUserLogin
    }),
    navbarTitle() {
      switch (this.activedTab) {
        case 'home':
          return this.$t('app.app_knowledge')
        case 'contacts':
          return this.$t('app.chat')
        case 'news':
          return this.$t('app.news')
        case 'data':
          return this.$t('app.teacher')
        case 'settings':
          return this.$t('app.settings')
      }
    },
    isAndroid() {
      return isAndroid()
    }
  },
  mounted() {
    const query = this.$f7route.query
    this.isOwner = (query.isowner === 'true')
    if (this.isOwner) {
      this.$$('a#homelink.tab-link').removeClass('tab-link-active')
      this.$$('a#datalink.tab-link').addClass('tab-link-active')
      this.$$('div#home.tab-active').removeClass('tab-active')
      this.$$('div#data').addClass('tab-active')
      this.tabActived('data')
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    tabActived(tab) {
      this.activedTab = tab
      switch (this.activedTab) {
        case 'home':
          this.getApplicationKnowledges()
          break
        case 'contacts':
          this.getRoomList()
          break
        case 'news':
          this.getTimeline()
          break
        case 'data':
          this.getOwnerKnowledges()
          break
      }
    },
    getTimeline() {
      this.$f7.preloader.show()
      this.$root.chat.getPostList(function(posts) {
        window.store.dispatch('initTimeline', posts)
      })
      this.$f7.preloader.hide()
    },
    getRoomList() {
      if (!this.isUserLogin) return
      this.$f7.preloader.show()
      this.$root.chat.getRoomList(function(contacts) {
        window.store.dispatch('initContacts', contacts)
      })
      this.$f7.preloader.hide()
    },
    getApplicationKnowledges() {
      if (!this.isUserLogin) return
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByApplication(function(applicationknowledges) {
        window.store.dispatch('initApplicationKnowledges', applicationknowledges)
      })
      this.$f7.preloader.hide()
    },
    getOwnerKnowledges() {
      if (!this.isUserLogin) return
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByOwner(function(ownerknowledges) {
        window.store.dispatch('initOwnerKnowledges', ownerknowledges)
      })
      this.$f7.preloader.hide()
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
    },
    openLogin() {
      this.updatePopup({
        key: 'loginOpened',
        value: true
      })
    },
    openDownload() {
      this.$f7router.navigate(`/download`)
    }
  },
  components: {
    HomeView,
    ContactsView,
    NewsView,
    DataView,
    SettingsView,
  }
}
</script>
