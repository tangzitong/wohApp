import axios from 'axios'
import * as types from './mutation-types'

export function clearData({ commit }) {
  commit(types.SET_USERPROFILE, {})
  commit(types.SET_POSTS, {})
  commit(types.SET_HIDDENPOSTS, {})
}

export function setUserProfile({ commit, state }, userProfile) {
  commit(types.SET_USERPROFILE, {
    userProfile
  })
}

export function addProfile({ commit, state }, data) {
  window.db('users').child(data.id).set({
    id: data.id,
    login_name: data.name,
    name: data.title,
    points: 0,
    avatar_url: '',
    gender: '',
    location: '',
    invites: [],
    muted: [],
    rooms: [],
    contacts: [],
    posts: [],
    photo: data.photo
  }).catch(err => {
    console.log(err)
  })
}

export function updateProfile({ commit, state }, data) {
  window.db('users').child(data.id).update({
    login_name: data.name,
    name: data.title,
    photo: data.photo
  }).catch(err => {
    console.log(err)
  })
}

export function getLoginUser({commit}) {
  axios.get('/user_login.json').then(res => {
    const userInfo = res.data.user
    commit(types.INIT_USER_INFO, {
      userInfo
    })
  })
}

export function initContacts({commit}, contacts) {
  commit(types.INIT_CONTACTS, {
    contacts
  })
}

export function infiniteContacts({ commit }, contacts) {
  commit(types.APPEND_CONTACTS, {
    contacts
  })
}

export function refreshContacts({ commit }, contacts) {
  commit(types.PREPEND_CONTACTS, {
    contacts
  })
}

export function initRoomUsers({commit}, roomusers) {
  commit(types.INIT_ROOMUSERS, {
    roomusers
  })
}

export function infiniteRoomUsers({ commit }, roomusers) {
  commit(types.APPEND_ROOMUSERS, {
    roomusers
  })
}

export function refreshRoomUsers({ commit }, roomusers) {
  commit(types.PREPEND_ROOMUSERS, {
    roomusers
  })
}

export function initRoomMessages({commit}, roommessages) {
  commit(types.INIT_ROOMMESSAGES, {
    roommessages
  })
}

export function infiniteRoomMessages({ commit }, roommessages) {
  commit(types.APPEND_ROOMMESSAGES, {
    roommessages
  })
}

export function refreshRoomMessages({ commit }, roommessages) {
  commit(types.PREPEND_ROOMMESSAGES, {
    roommessages
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

export function getTalenttypes({ commit }, language) {
  axios.get(`/datatype/${language}/talenttype.json`).then(res => {
    const talenttypes = res.data
    commit(types.INIT_TALENTTYPES, {
      talenttypes
    })
  })
}

export function getConsultanttypes({ commit }, language) {
  axios.get(`/datatype/${language}/consultanttype.json`).then(res => {
    const consultanttypes = res.data
    commit(types.INIT_CONSULTANTTYPES, {
      consultanttypes
    })
  })
}

export function getDispatchertypes({ commit }, language) {
  axios.get(`/datatype/${language}/dispatchertype.json`).then(res => {
    const dispatchertypes = res.data
    commit(types.INIT_DISPATCHERTYPES, {
      dispatchertypes
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

export function initComments({commit}, comments) {
  commit(types.INIT_COMMENT, {
    comments
  })
}

export function infiniteComments({commit}, comments) {
  commit(types.APPEND_COMMENT, {
    comments
  })
}

export function refreshComments({commit}, comments) {
  commit(types.PREPEND_COMMENT, {
    comments
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

export function initOwnerJobs({ commit }, ownerjobs) {
  commit(types.INIT_OWNERJOBS, {
    ownerjobs
  })
}

export function initApplicationJobs({ commit }, applicationjobs) {
  commit(types.INIT_APPLICATIONJOBS, {
    applicationjobs
  })
}

export function initJobApplications({ commit }, jobapplications) {
  commit(types.INIT_JOBAPPLICATIONS, {
    jobapplications
  })
}

export function initJobLikes({ commit }, joblikes) {
  commit(types.INIT_JOBLIKES, {
    joblikes
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

export function initOwnerCompanys({ commit }, ownercompanys) {
  commit(types.INIT_OWNERCOMPANYS, {
    ownercompanys
  })
}

export function initApplicationCompanys({ commit }, applicationcompanys) {
  commit(types.INIT_APPLICATIONCOMPANYS, {
    applicationcompanys
  })
}

export function initCompanyApplications({ commit }, companyapplications) {
  commit(types.INIT_COMPANYAPPLICATIONS, {
    companyapplications
  })
}

export function initCompanyLikes({ commit }, companylikes) {
  commit(types.INIT_COMPANYLIKES, {
    companylikes
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

export function initOwnerProjects({ commit }, ownerprojects) {
  commit(types.INIT_OWNERPROJECTS, {
    ownerprojects
  })
}

export function initApplicationProjects({ commit }, applicationprojects) {
  commit(types.INIT_APPLICATIONPROJECTS, {
    applicationprojects
  })
}

export function initProjectApplications({ commit }, projectapplications) {
  commit(types.INIT_PROJECTAPPLICATIONS, {
    projectapplications
  })
}

export function initProjectLikes({ commit }, projectlikes) {
  commit(types.INIT_PROJECTLIKES, {
    projectlikes
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

export function initTalents({ commit }, talents) {
  commit(types.INIT_TALENTS, {
    talents
  })
}

export function initOwnerTalents({ commit }, ownertalents) {
  commit(types.INIT_OWNERTALENTS, {
    ownertalents
  })
}

export function initApplicationTalents({ commit }, applicationtalents) {
  commit(types.INIT_APPLICATIONTALENTS, {
    applicationtalents
  })
}

export function initTalentApplications({ commit }, talentapplications) {
  commit(types.INIT_TALENTAPPLICATIONS, {
    talentapplications
  })
}

export function initTalentLikes({ commit }, talentlikes) {
  commit(types.INIT_TALENTLIKES, {
    talentlikes
  })
}

export function infiniteTalents({ commit }, talents) {
  commit(types.APPEND_TALENTS, {
    talents
  })
}

export function refreshTalents({ commit }, talents) {
  commit(types.PREPEND_TALENTS, {
    talents
  })
}

export function updateTalents({ commit }, { mid, type }) {
  commit(types.UPDATE_TALENTS, {
    mid,
    type
  })
}

export function initConsultantApplications({ commit }, consultantapplications) {
  commit(types.INIT_CONSULTANTAPPLICATIONS, {
    consultantapplications
  })
}

export function initConsultantLikes({ commit }, consultantlikes) {
  commit(types.INIT_CONSULTANTLIKES, {
    consultantlikes
  })
}

export function initConsultants({ commit }, consultants) {
  commit(types.INIT_CONSULTANTS, {
    consultants
  })
}

export function initOwnerConsultants({ commit }, ownerconsultants) {
  commit(types.INIT_OWNERCONSULTANTS, {
    ownerconsultants
  })
}

export function initApplicationConsultants({ commit }, applicationconsultants) {
  commit(types.INIT_APPLICATIONCONSULTANTS, {
    applicationconsultants
  })
}

export function infiniteConsultants({ commit }, consultants) {
  commit(types.APPEND_CONSULTANTS, {
    consultants
  })
}

export function refreshConsultants({ commit }, consultants) {
  commit(types.PREPEND_CONSULTANTS, {
    consultants
  })
}

export function updateConsultants({ commit }, { mid, type }) {
  commit(types.UPDATE_CONSULTANTS, {
    mid,
    type
  })
}

export function initDispatchers({ commit }, dispatchers) {
  commit(types.INIT_DISPATCHERS, {
    dispatchers
  })
}

export function initOwnerDispatchers({ commit }, ownerdispatchers) {
  commit(types.INIT_OWNERDISPATCHERS, {
    ownerdispatchers
  })
}

export function initApplicationDispatchers({ commit }, applicationdispatchers) {
  commit(types.INIT_APPLICATIONDISPATCHERS, {
    applicationdispatchers
  })
}

export function initDispatcherApplications({ commit }, dispatcherapplications) {
  commit(types.INIT_DISPATCHERAPPLICATIONS, {
    dispatcherapplications
  })
}

export function initDispatcherLikes({ commit }, dispatcherlikes) {
  commit(types.INIT_DISPATCHERLIKES, {
    dispatcherlikes
  })
}

export function infiniteDispatchers({ commit }, dispatchers) {
  commit(types.APPEND_DISPATCHERS, {
    dispatchers
  })
}

export function refreshDispatchers({ commit }, dispatchers) {
  commit(types.PREPEND_DISPATCHERS, {
    dispatchers
  })
}

export function updateDispatchers({ commit }, { mid, type }) {
  commit(types.UPDATE_DISPATCHERS, {
    mid,
    type
  })
}

export function initKnowledges({ commit }, knowledges) {
  commit(types.INIT_KNOWLEDGES, {
    knowledges
  })
}

export function initOwnerKnowledges({ commit }, ownerknowledges) {
  commit(types.INIT_OWNERKNOWLEDGES, {
    ownerknowledges
  })
}

export function initApplicationKnowledges({ commit }, applicationknowledges) {
  commit(types.INIT_APPLICATIONKNOWLEDGES, {
    applicationknowledges
  })
}

export function initLearnerKnowledges({ commit }, learnerknowledges) {
  commit(types.INIT_LEARNERKNOWLEDGES, {
    learnerknowledges
  })
}

export function initKnowledgecontents({ commit }, knowledgecontents) {
  commit(types.INIT_KNOWLEDGECONTENTS, {
    knowledgecontents
  })
}

export function initKnowledgecertificates({ commit }, knowledgecertificates) {
  commit(types.INIT_KNOWLEDGECERTIFICATES, {
    knowledgecertificates
  })
}

export function initLearningstatus({ commit }, learningstatus) {
  commit(types.INIT_LEARNINGSTATUS, {
    learningstatus
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

export function initKnowledgeComments({commit}, knowledgecomments) {
  commit(types.INIT_KNOWLEDGECOMMENT, {
    knowledgecomments
  })
}

export function infiniteKnowledgeComments({commit}, knowledgecomments) {
  commit(types.APPEND_KNOWLEDGECOMMENT, {
    knowledgecomments
  })
}

export function refreshKnowledgeComments({commit}, knowledgecomments) {
  commit(types.PREPEND_KNOWLEDGECOMMENT, {
    knowledgecomments
  })
}

export function updateKnowledges({ commit }, { mid, type }) {
  commit(types.UPDATE_KNOWLEDGES, {
    mid,
    type
  })
}

export function initKnowledgeApplications({commit}, knowledgeapplications) {
  commit(types.INIT_KNOWLEDGEAPPLICATIONS, {
    knowledgeapplications
  })
}

export function initKnowledgeLikes({commit}, knowledgelikes) {
  commit(types.INIT_KNOWLEDGELIKES, {
    knowledgelikes
  })
}

export function initTools({ commit }, tools) {
  commit(types.INIT_TOOLS, {
    tools
  })
}

export function initOwnerTools({ commit }, ownertools) {
  commit(types.INIT_OWNERTOOLS, {
    ownertools
  })
}

export function initApplicationTools({ commit }, applicationtools) {
  commit(types.INIT_APPLICATIONTOOLS, {
    applicationtools
  })
}

export function initToolApplications({ commit }, toolapplications) {
  commit(types.INIT_TOOLAPPLICATIONS, {
    toolapplications
  })
}

export function initToolLikes({ commit }, toollikes) {
  commit(types.INIT_TOOLLIKES, {
    toollikes
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

export function initOwnerEvents({ commit }, ownerevents) {
  commit(types.INIT_OWNEREVENTS, {
    ownerevents
  })
}

export function initApplicationEvents({ commit }, applicationevents) {
  commit(types.INIT_APPLICATIONEVENTS, {
    applicationevents
  })
}

export function initEventApplications({ commit }, eventapplications) {
  commit(types.INIT_EVENTAPPLICATIONS, {
    eventapplications
  })
}

export function initEventLikes({ commit }, eventlikes) {
  commit(types.INIT_EVENTLIKES, {
    eventlikes
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

export function updateApplication({ commit }, { key1, value1, key2, value2, key3, value3 }) {
  commit(types.UPDATE_APPLICATION, {
    key1,
    value1,
    key2,
    value2,
    key3,
    value3
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
  axios.post('/feedback/data.json', feedback).catch(err => {
    console.log(err)
  })
}

export function setImagePath({ commit }, imagePath) {
  commit(types.SET_IMAGEPATH, {
    imagePath
  })
}
