import StoreCache from '@/utils/storeCache'

const cache = new StoreCache('vuex')

export function getKnowledgetypeConfig() {
  return cache.get('knowledgetype')
}

export function setKnowledgetypeConfig(knowledgetype) {
  cache.set('knowledgetype', knowledgetype)
}

export function getCompanytypeConfig() {
  return cache.get('companytype')
}

export function setCompanytypeConfig(companytype) {
  cache.set('companytype', companytype)
}

export function getConsultanttypeConfig() {
  return cache.get('consultanttype')
}

export function setConsultanttypeConfig(consultanttype) {
  cache.set('consultanttype', consultanttype)
}

export function getDispatchertypeConfig() {
  return cache.get('dispatchertype')
}

export function setDispatchertypeConfig(dispatchertype) {
  cache.set('dispatchertype', dispatchertype)
}

export function getEventtypeConfig() {
  return cache.get('eventtype')
}

export function setEventtypeConfig(eventtype) {
  cache.set('eventtype', eventtype)
}

export function getJobtypeConfig() {
  return cache.get('jobtype')
}

export function setJobtypeConfig(jobtype) {
  cache.set('jobtype', jobtype)
}

export function getProjecttypeConfig() {
  return cache.get('projecttype')
}

export function setProjecttypeConfig(projecttype) {
  cache.set('projecttype', projecttype)
}

export function getReporttypeConfig() {
  return cache.get('reporttype')
}

export function setReporttypeConfig(reporttype) {
  cache.set('reporttype', reporttype)
}

export function getTalenttypeConfig() {
  return cache.get('talenttype')
}

export function setTalenttypeConfig(talenttype) {
  cache.set('talenttype', talenttype)
}

export function getTooltypeConfig() {
  return cache.get('tooltype')
}

export function setTooltypeConfig(tooltype) {
  cache.set('tooltype', tooltype)
}

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

export function setDataType(datatype) {
  cache.set('datatype', datatype)
}

export function getDataType() {
  return cache.get('datatype')
}
