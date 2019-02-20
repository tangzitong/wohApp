import axios from 'axios'
import * as types from './mutation-types'

export function getLoginUser({commit}) {
  axios.get('/user_login.json').then(res => {
    const user = res.data.user
    commit(types.INIT_USER_INFO, {
      user
    })
  })
}

export function getContacts({commit}) {
  axios.get('/contacts.json').then(res => {
    const contacts = res.data
    commit(types.INIT_CONTACTS, {
      contacts
    })
  })
}

export function getArea({ commit }) {
  axios.get('/area.json').then(res => {
    const area = res.data
    commit(types.INIT_AREA, {
      area
    })
  })
}

export function getIndustry({ commit }) {
  axios.get('/industry.json').then(res => {
    const industry = res.data
    commit(types.INIT_INDUSTRY, {
      industry
    })
  })
}

export function getJobtype({ commit }) {
  axios.get('/jobtype.json').then(res => {
    const jobtype = res.data
    commit(types.INIT_JOBTYPE, {
      jobtype
    })
  })
}

export function getCompanytype({ commit }) {
  axios.get('/companytype.json').then(res => {
    const companytype = res.data
    commit(types.INIT_COMPANYTYPE, {
      companytype
    })
  })
}

export function getProjecttype({ commit }) {
  axios.get('/projecttype.json').then(res => {
    const projecttype = res.data
    commit(types.INIT_PROJECTTYPE, {
      projecttype
    })
  })
}

export function getResumetype({ commit }) {
  axios.get('/resumetype.json').then(res => {
    const resumetype = res.data
    commit(types.INIT_RESUMETYPE, {
      resumetype
    })
  })
}

export function getKnowledgetype({ commit }) {
  axios.get('/knowledgetype.json').then(res => {
    const knowledgetype = res.data
    commit(types.INIT_KNOWLEDGETYPE, {
      knowledgetype
    })
  })
}

export function getTooltype({ commit }) {
  axios.get('/tooltype.json').then(res => {
    const tooltype = res.data
    commit(types.INIT_TOOLTYPE, {
      tooltype
    })
  })
}

export function getEventtype({ commit }) {
  axios.get('/eventtype.json').then(res => {
    const eventtype = res.data
    commit(types.INIT_EVENTTYPE, {
      eventtype
    })
  })
}

export function initTimeline({commit}, timeline) {
  commit(types.INIT_TIMETIME, {
    timeline
  })
}

export function infiniteTimeline({commit}, timeline) {
  commit(types.APPEND_TIMETIME, {
    timeline
  })
}

export function refreshTimeline({commit}, timeline) {
  commit(types.PREPEND_TIMETIME, {
    timeline
  })
}

export function updateTimeline({commit}, { mid, type }) {
  commit(types.UPDATE_TIMETIME, {
    mid,
    type
  })
}

export function initJobs({ commit }, jobs) {
  commit(types.INIT_JOBS, {
    jobs
  })
}

export function infiniteJobs({ commit }, jobs) {
  commit(types.APPEND_JOBS, {
    jobs
  })
}

export function refreshJobs({ commit }, jobs) {
  commit(types.PREPEND_JOBS, {
    jobs
  })
}

export function updateJobs({ commit }, { mid, type }) {
  commit(types.UPDATE_JOBS, {
    mid,
    type
  })
}
export function initCompanys({ commit }, companys) {
  commit(types.INIT_COMPANYS, {
    companys
  })
}

export function infiniteCompanys({ commit }, companys) {
  commit(types.APPEND_COMPANYS, {
    companys
  })
}

export function refreshCompanys({ commit }, companys) {
  commit(types.PREPEND_COMPANYS, {
    companys
  })
}

export function updateCompanys({ commit }, { mid, type }) {
  commit(types.UPDATE_COMPANYS, {
    mid,
    type
  })
}

export function initProjects({ commit }, projects) {
  commit(types.INIT_PROJECTS, {
    projects
  })
}

export function infiniteProjects({ commit }, projects) {
  commit(types.APPEND_PROJECTS, {
    projects
  })
}

export function refreshProjects({ commit }, projects) {
  commit(types.PREPEND_PROJECTS, {
    projects
  })
}

export function updateProjects({ commit }, { mid, type }) {
  commit(types.UPDATE_PROJECTS, {
    mid,
    type
  })
}

export function initResumes({ commit }, resumes) {
  commit(types.INIT_RESUMES, {
    resumes
  })
}

export function infiniteResumes({ commit }, resumes) {
  commit(types.APPEND_RESUMES, {
    resumes
  })
}

export function refreshResumes({ commit }, resumes) {
  commit(types.PREPEND_RESUMES, {
    resumes
  })
}

export function updateResumes({ commit }, { mid, type }) {
  commit(types.UPDATE_RESUMES, {
    mid,
    type
  })
}

export function initKnowledges({ commit }, knowledges) {
  commit(types.INIT_KNOWLEDGES, {
    knowledges
  })
}

export function infiniteKnowledges({ commit }, knowledges) {
  commit(types.APPEND_KNOWLEDGES, {
    knowledges
  })
}

export function refreshKnowledges({ commit }, knowledges) {
  commit(types.PREPEND_KNOWLEDGES, {
    knowledges
  })
}

export function updateKnowledges({ commit }, { mid, type }) {
  commit(types.UPDATE_KNOWLEDGES, {
    mid,
    type
  })
}

export function initTools({ commit }, tools) {
  commit(types.INIT_TOOLS, {
    tools
  })
}

export function infiniteTools({ commit }, tools) {
  commit(types.APPEND_TOOLS, {
    tools
  })
}

export function refreshTools({ commit }, tools) {
  commit(types.PREPEND_TOOLS, {
    tools
  })
}

export function updateTools({ commit }, { mid, type }) {
  commit(types.UPDATE_TOOLS, {
    mid,
    type
  })
}

export function initEvents({ commit }, events) {
  commit(types.INIT_EVENTS, {
    events
  })
}

export function infiniteEvents({ commit }, events) {
  commit(types.APPEND_EVENTS, {
    events
  })
}

export function refreshEvents({ commit }, events) {
  commit(types.PREPEND_EVENTS, {
    events
  })
}

export function updateEvents({ commit }, { mid, type }) {
  commit(types.UPDATE_EVENTS, {
    mid,
    type
  })
}

export function updatePopup({commit}, { key, value }) {
  commit(types.UPDATE_POPUP, {
    key,
    value
  })
}

export function updateApplication({ commit }, { key, value }) {
  commit(types.UPDATE_APPLICATION, {
    key,
    value
  })
}
