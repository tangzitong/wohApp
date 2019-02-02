import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enUS from './lang/en_us'
import zhCN from './lang/zh_cn'
import jaJP from './lang/ja_jp'
import StoreCache from '@/utils/storeCache'

Vue.use(VueI18n)
const cache = new StoreCache('vuex')

export function getLangConfig() {
  const simplifiedChinese = ['zh', 'zh-cn']
  const japanese = ['ja-JP', 'ja-jp']
  let browserLang = navigator.userLanguage || window.navigator.language
  browserLang = browserLang.toLowerCase()
  return cache.get('lang')
      || (~simplifiedChinese.indexOf(browserLang) ? 'zhCN' : ~japanese.indexOf(browserLang) ? 'jaJP' : 'enUS')
}

export function setLangConfig(lang) {
  cache.set('lang', lang)
  i18n.locale = lang
}

const messages = {
  enUS,
  zhCN,
  jaJP
}

const i18n = new VueI18n({
  locale: getLangConfig(),
  messages,
  fallbackLocale: 'zhCN'
})

export default i18n
