import axios from 'axios'
import * as types from './mutation-types'

export function clearData({ commit }) {
  commit(types.SET_CURRENTUSER, null)
  commit(types.SET_USERPROFILE, {})
  commit(types.SET_POSTS, null)
  commit(types.SET_HIDDENPOSTS, null)
}

export function setCurrentUser({ commit }, user) {
  commit(types.SET_CURRENTUSER, user)
}

export function fetchUserProfile({ commit, state }) {
  window.db('users').child(state.currentUser.uid).once('value', function(snapshot) {
    commit(types.SET_USERPROFILE, snapshot.val())
  }).catch(err => {
    console.log(err)
  })
}

export function updateProfile({ commit, state }, data) {
  window.db('users').child(state.currentUser.uid).update({
    login_name: data.name,
    nick_name: data.title,
    photo: data.photo
  }).catch(err => {
    console.log(err)
  })
}

export function updateCompany({ commit, state }, data) {
  window.db('companys').child(state.currentUser.uid).update({
    name: data.name,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo
  }).catch(err => {
    console.log(err)
  })
}

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

export function getAreas({ commit }, language) {
  axios.get(`/datatype/${language}/area.json`).then(res => {
    const areas = res.data
    commit(types.INIT_AREAS, {
      areas
    })
  })
}

export function getIndustrys({ commit }, language) {
  axios.get(`/datatype/${language}/industry.json`).then(res => {
    const industrys = res.data
    commit(types.INIT_INDUSTRYS, {
      industrys
    })
  })
}

export function getJobtypes({ commit }, language) {
  axios.get(`/datatype/${language}/jobtype.json`).then(res => {
    const jobtypes = res.data
    commit(types.INIT_JOBTYPES, {
      jobtypes
    })
  })
}

export function getCompanytypes({ commit }, language) {
  axios.get(`/datatype/${language}/companytype.json`).then(res => {
    const companytypes = res.data
    commit(types.INIT_COMPANYTYPES, {
      companytypes
    })
  })
}

export function getProjecttypes({ commit }, language) {
  axios.get(`/datatype/${language}/projecttype.json`).then(res => {
    const projecttypes = res.data
    commit(types.INIT_PROJECTTYPES, {
      projecttypes
    })
  })
}

export function getResumetypes({ commit }, language) {
  axios.get(`/datatype/${language}/resumetype.json`).then(res => {
    const resumetypes = res.data
    commit(types.INIT_RESUMETYPES, {
      resumetypes
    })
  })
}

export function getKnowledgetypes({ commit }, language) {
  axios.get(`/datatype/${language}/knowledgetype.json`).then(res => {
    const knowledgetypes = res.data
    commit(types.INIT_KNOWLEDGETYPES, {
      knowledgetypes
    })
  })
}

export function getTooltypes({ commit }, language) {
  axios.get(`/datatype/${language}/tooltype.json`).then(res => {
    const tooltypes = res.data
    commit(types.INIT_TOOLTYPES, {
      tooltypes
    })
  })
}

export function getEventtypes({ commit }, language) {
  axios.get(`/datatype/${language}/eventtype.json`).then(res => {
    const eventtypes = res.data
    commit(types.INIT_EVENTTYPES, {
      eventtypes
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

export function initReports({ commit }, reports) {
  commit(types.INIT_REPORTS, {
    reports
  })
}

export function infiniteReports({ commit }, reports) {
  commit(types.APPEND_REPORTS, {
    reports
  })
}

export function refreshReports({ commit }, reports) {
  commit(types.PREPEND_REPORTS, {
    reports
  })
}

export function updateReports({ commit }, { mid, type }) {
  commit(types.UPDATE_REPORTS, {
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

export function getFeedback({ commit }) {
  axios.get('/feedback.json').then(res => {
    const feedbacks = res.data
    commit(types.INIT_FEEDBACK, {
      feedbacks
    })
  })
}

export function putFeedback({ commit }, feedback) {
  axios.put('/feedback.json', feedback).catch(err => {
    console.log(err)
  })
}
