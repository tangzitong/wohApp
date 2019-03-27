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

export function addProfile({ commit, state }, data) {
  window.db('users').child(data.id).set({
    login_name: data.name,
    nick_name: data.title,
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
  window.db('users').child(state.currentUser.uid).update({
    login_name: data.name,
    nick_name: data.title,
    photo: data.photo
  }).catch(err => {
    console.log(err)
  })
}

export function addJob({ commit, state }, data) {
  const newJobRef = window.db('jobs').child(state.currentUser.uid).push()
  const newJob = {
    id: newJobRef.key,
    name: data.name,
    jobtype: data.jobtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newJobRef.set(newJob, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateJob({ commit, state }, data) {
  const updateJobRef = window.db('jobs').child(state.currentUser.uid).child(data.id)
  const newJob = {
    id: data.id,
    name: data.name,
    jobtype: data.jobtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateJobRef.set(newJob, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteJob({ commit, state }, data) {
  const deleteJobRef = window.db('jobs').child(state.currentUser.uid).child(data.id)
  deleteJobRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addCompany({ commit, state }, data) {
  const newCompanyRef = window.db('companys').child(state.currentUser.uid).push()
  const newCompany = {
    id: newCompanyRef.key,
    name: data.name,
    companytype: data.companytype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newCompanyRef.set(newCompany, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateCompany({ commit, state }, data) {
  const updateCompanyRef = window.db('companys').child(state.currentUser.uid).child(data.id)
  const newCompany = {
    id: data.id,
    name: data.name,
    companytype: data.companytype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateCompanyRef.set(newCompany, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteCompany({ commit, state }, data) {
  const deleteCompanyRef = window.db('companys').child(state.currentUser.uid).child(data.id)
  deleteCompanyRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addProject({ commit, state }, data) {
  const newProjectRef = window.db('projects').child(state.currentUser.uid).push()
  const newProject = {
    id: newProjectRef.key,
    name: data.name,
    projecttype: data.projecttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newProjectRef.set(newProject, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateProject({ commit, state }, data) {
  const updateProjectRef = window.db('projects').child(state.currentUser.uid).child(data.id)
  const newProject = {
    id: data.id,
    name: data.name,
    projecttype: data.projecttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateProjectRef.set(newProject, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteProject({ commit, state }, data) {
  const deleteProjectRef = window.db('projects').child(state.currentUser.uid).child(data.id)
  deleteProjectRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addTalent({ commit, state }, data) {
  const newTalentRef = window.db('talents').child(state.currentUser.uid).push()
  const newTalent = {
    id: newTalentRef.key,
    name: data.name,
    talenttype: data.talenttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newTalentRef.set(newTalent, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateTalent({ commit, state }, data) {
  const updateTalentRef = window.db('talents').child(state.currentUser.uid).child(data.id)
  const newTalent = {
    id: data.id,
    name: data.name,
    talenttype: data.talenttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateTalentRef.set(newTalent, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteTalent({ commit, state }, data) {
  const deleteTalentRef = window.db('talents').child(state.currentUser.uid).child(data.id)
  deleteTalentRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addConsultant({ commit, state }, data) {
  const newConsultantRef = window.db('consultants').child(state.currentUser.uid).push()
  const newConsultant = {
    id: newConsultantRef.key,
    name: data.name,
    consultanttype: data.consultanttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newConsultantRef.set(newConsultant, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateConsultant({ commit, state }, data) {
  const updateConsultantRef = window.db('consultants').child(state.currentUser.uid).child(data.id)
  const newConsultant = {
    id: data.id,
    name: data.name,
    consultanttype: data.consultanttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateConsultantRef.set(newConsultant, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteConsultant({ commit, state }, data) {
  const deleteConsultantRef = window.db('consultants').child(state.currentUser.uid).child(data.id)
  deleteConsultantRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addDispatcher({ commit, state }, data) {
  const newDispatcherRef = window.db('dispachers').child(state.currentUser.uid).push()
  const newDispatcher = {
    id: newDispatcherRef.key,
    name: data.name,
    dispachertype: data.dispachertype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newDispatcherRef.set(newDispatcher, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateDispatcher({ commit, state }, data) {
  const updateDispatcherRef = window.db('dispachers').child(state.currentUser.uid).child(data.id)
  const newDispatcher = {
    id: data.id,
    name: data.name,
    dispachertype: data.dispachertype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateDispatcherRef.set(newDispatcher, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteDispatcher({ commit, state }, data) {
  const deleteDispatcherRef = window.db('dispachers').child(state.currentUser.uid).child(data.id)
  deleteDispatcherRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addKnowledge({ commit, state }, data) {
  const newKnowledgeRef = window.db('knowledges').child(state.currentUser.uid).push()
  const newKnowledge = {
    id: newKnowledgeRef.key,
    name: data.name,
    knowledgetype: data.knowledgetype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newKnowledgeRef.set(newKnowledge, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateKnowledge({ commit, state }, data) {
  const updateKnowledgeRef = window.db('knowledges').child(state.currentUser.uid).child(data.id)
  const newKnowledge = {
    id: data.id,
    name: data.name,
    knowledgetype: data.knowledgetype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateKnowledgeRef.set(newKnowledge, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteKnowledge({ commit, state }, data) {
  const deleteKnowledgeRef = window.db('knowledges').child(state.currentUser.uid).child(data.id)
  deleteKnowledgeRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addTool({ commit, state }, data) {
  const newToolRef = window.db('tools').child(state.currentUser.uid).push()
  const newTool = {
    id: newToolRef.key,
    name: data.name,
    tooltype: data.tooltype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newToolRef.set(newTool, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateTool({ commit, state }, data) {
  const updateToolRef = window.db('tools').child(state.currentUser.uid).child(data.id)
  const newTool = {
    id: data.id,
    name: data.name,
    tooltype: data.tooltype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateToolRef.set(newTool, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteTool({ commit, state }, data) {
  const deleteToolRef = window.db('tools').child(state.currentUser.uid).child(data.id)
  deleteToolRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function addEvent({ commit, state }, data) {
  const newEventRef = window.db('events').child(state.currentUser.uid).push()
  const newEvent = {
    id: newEventRef.key,
    name: data.name,
    eventtype: data.eventtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  newEventRef.set(newEvent, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function updateEvent({ commit, state }, data) {
  const updateEventRef = window.db('events').child(state.currentUser.uid).child(data.id)
  const newEvent = {
    id: data.id,
    name: data.name,
    eventtype: data.eventtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    like: data.like,
    photo: data.photo,
    createDate: new Date()
  }
  updateEventRef.set(newEvent, function(error) {
    if (error) {
      console.log(error)
    }
  })
}

export function deleteEvent({ commit, state }, data) {
  const deleteEventRef = window.db('events').child(state.currentUser.uid).child(data.id)
  deleteEventRef.remove(function(error) {
    if (error) {
      console.log(error)
    }
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
  axios.post('/feedback.json', feedback).catch(err => {
    console.log(err)
  })
}
