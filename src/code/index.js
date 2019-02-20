import StoreCache from '@/utils/storeCache'

const cache = new StoreCache('vuex')

export function getAreaConfig() {
  return cache.get('area')
}

export function setAreaConfig(area) {
  cache.set('area', area)
}

export function getIndustryConfig() {
  return cache.get('industry')
}

export function setIndustryConfig(industry) {
  cache.set('industry', industry)
}
