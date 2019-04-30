import Vue from 'vue'
import * as types from './mutation-types'
import find from 'lodash/find'

export default {
  [types.INIT_USER_INFO] (state, { userInfo }) {
    Vue.set(state, 'userInfo', userInfo)
  },
  [types.INIT_CONTACTS] (state, { contacts }) {
    Vue.set(state, 'contacts', contacts)
  },
  [types.APPEND_CONTACTS](state, { contacts }) {
    Vue.set(state, 'contacts', [...state.contacts, ...contacts])
  },
  [types.PREPEND_CONTACTS](state, { contacts }) {
    Vue.set(state, 'contacts', [...contacts, ...state.contacts])
  },
  [types.INIT_ROOMUSERS] (state, { roomusers }) {
    Vue.set(state, 'roomusers', roomusers)
  },
  [types.APPEND_ROOMUSERS](state, { roomusers }) {
    Vue.set(state, 'roomusers', [...state.roomusers, ...roomusers])
  },
  [types.PREPEND_ROOMUSERS](state, { roomusers }) {
    Vue.set(state, 'roomusers', [...roomusers, ...state.roomusers])
  },
  [types.INIT_ROOMMESSAGES] (state, { roommessages }) {
    Vue.set(state, 'roommessages', roommessages)
  },
  [types.APPEND_ROOMMESSAGES](state, { roommessages }) {
    Vue.set(state, 'roommessages', [...state.roommessages, ...roommessages])
  },
  [types.PREPEND_ROOMMESSAGES](state, { roommessages }) {
    Vue.set(state, 'roommessages', [...roommessages, ...state.roommessages])
  },
  [types.INIT_AREAS](state, { areas }) {
    Vue.set(state, 'areas', areas)
  },
  [types.INIT_INDUSTRYS](state, { industrys }) {
    Vue.set(state, 'industrys', industrys)
  },
  [types.INIT_JOBTYPES](state, { jobtypes }) {
    Vue.set(state, 'jobtypes', jobtypes)
  },
  [types.INIT_COMPANYTYPES](state, { companytypes }) {
    Vue.set(state, 'companytypes', companytypes)
  },
  [types.INIT_PROJECTTYPES](state, { projecttypes }) {
    Vue.set(state, 'projecttypes', projecttypes)
  },
  [types.INIT_TALENTTYPES](state, { talenttypes }) {
    Vue.set(state, 'talenttypes', talenttypes)
  },
  [types.INIT_CONSULTANTTYPES](state, { consultanttypes }) {
    Vue.set(state, 'consultanttypes', consultanttypes)
  },
  [types.INIT_DISPATCHERTYPES](state, { dispatchertypes }) {
    Vue.set(state, 'dispatchertypes', dispatchertypes)
  },
  [types.INIT_KNOWLEDGETYPES](state, { knowledgetypes }) {
    Vue.set(state, 'knowledgetypes', knowledgetypes)
  },
  [types.INIT_TOOLTYPES](state, { tooltypes }) {
    Vue.set(state, 'tooltypes', tooltypes)
  },
  [types.INIT_EVENTTYPES](state, { eventtypes }) {
    Vue.set(state, 'eventtypes', eventtypes)
  },
  [types.INIT_JOBS](state, { jobs }) {
    Vue.set(state, 'jobs', jobs)
  },
  [types.INIT_OWNERJOBS](state, { ownerjobs }) {
    Vue.set(state, 'ownerjobs', ownerjobs)
  },
  [types.INIT_APPLICATIONJOBS](state, { applicationjobs }) {
    Vue.set(state, 'applicationjobs', applicationjobs)
  },
  [types.INIT_JOBAPPLICATIONS](state, { jobapplications }) {
    Vue.set(state, 'jobapplications', jobapplications)
  },
  [types.INIT_JOBLIKES](state, { joblikes }) {
    Vue.set(state, 'joblikes', joblikes)
  },
  [types.APPEND_JOBS](state, { jobs }) {
    Vue.set(state, 'jobs', [...state.jobs, ...jobs])
  },
  [types.PREPEND_JOBS](state, { jobs }) {
    Vue.set(state, 'jobs', [...jobs, ...state.jobs])
  },
  [types.UPDATE_JOBS](state, { mid, type }) {
    let item = find(state.jobs, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_COMPANYS](state, { companys }) {
    Vue.set(state, 'companys', companys)
  },
  [types.INIT_OWNERCOMPANYS](state, { ownercompanys }) {
    Vue.set(state, 'ownercompanys', ownercompanys)
  },
  [types.INIT_APPLICATIONCOMPANYS](state, { applicationcompanys }) {
    Vue.set(state, 'applicationcompanys', applicationcompanys)
  },
  [types.INIT_COMPANYAPPLICATIONS](state, { companyapplications }) {
    Vue.set(state, 'companyapplications', companyapplications)
  },
  [types.INIT_COMPANYLIKES](state, { companylikes }) {
    Vue.set(state, 'companylikes', companylikes)
  },
  [types.APPEND_COMPANYS](state, { companys }) {
    Vue.set(state, 'companys', [...state.companys, ...companys])
  },
  [types.PREPEND_COMPANYS](state, { companys }) {
    Vue.set(state, 'companys', [...companys, ...state.companys])
  },
  [types.UPDATE_COMPANYS](state, { mid, type }) {
    let item = find(state.companys, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_PROJECTS](state, { projects }) {
    Vue.set(state, 'projects', projects)
  },
  [types.INIT_OWNERPROJECTS](state, { ownerprojects }) {
    Vue.set(state, 'ownercompownerprojectsanys', ownerprojects)
  },
  [types.INIT_APPLICATIONPROJECTS](state, { applicationprojects }) {
    Vue.set(state, 'applicationprojects', applicationprojects)
  },
  [types.INIT_PROJECTAPPLICATIONS](state, { projectapplications }) {
    Vue.set(state, 'projectapplications', projectapplications)
  },
  [types.INIT_PROJECTLIKES](state, { projectlikes }) {
    Vue.set(state, 'projectlikes', projectlikes)
  },
  [types.APPEND_PROJECTS](state, { projects }) {
    Vue.set(state, 'projects', [...state.projects, ...projects])
  },
  [types.PREPEND_PROJECTS](state, { projects }) {
    Vue.set(state, 'projects', [...projects, ...state.projects])
  },
  [types.UPDATE_PROJECTS](state, { mid, type }) {
    let item = find(state.projects, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_TALENTS](state, { talents }) {
    Vue.set(state, 'talents', talents)
  },
  [types.INIT_OWNERTALENTS](state, { ownertalents }) {
    Vue.set(state, 'ownertalents', ownertalents)
  },
  [types.INIT_APPLICATIONTALENTS](state, { applicationtalents }) {
    Vue.set(state, 'applicationtalents', applicationtalents)
  },
  [types.INIT_TALENTAPPLICATIONS](state, { talentapplications }) {
    Vue.set(state, 'talentapplications', talentapplications)
  },
  [types.INIT_TALENTLIKES](state, { talentlikes }) {
    Vue.set(state, 'talentlikes', talentlikes)
  },
  [types.APPEND_TALENTS](state, { talents }) {
    Vue.set(state, 'talents', [...state.talents, ...talents])
  },
  [types.PREPEND_TALENTS](state, { talents }) {
    Vue.set(state, 'talents', [...talents, ...state.talents])
  },
  [types.UPDATE_TALENTS](state, { mid, type }) {
    let item = find(state.talents, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_CONSULTANTS](state, { consultants }) {
    Vue.set(state, 'consultants', consultants)
  },
  [types.INIT_OWNERCONSULTANTS](state, { ownerconsultants }) {
    Vue.set(state, 'ownerconsultants', ownerconsultants)
  },
  [types.INIT_APPLICATIONCONSULTANTS](state, { applicationconsultants }) {
    Vue.set(state, 'applicationconsultants', applicationconsultants)
  },
  [types.INIT_CONSULTANTAPPLICATIONS](state, { consultantapplications }) {
    Vue.set(state, 'consultantapplications', consultantapplications)
  },
  [types.INIT_CONSULTANTLIKES](state, { consultantlikes }) {
    Vue.set(state, 'consultantlikes', consultantlikes)
  },
  [types.APPEND_CONSULTANTS](state, { consultants }) {
    Vue.set(state, 'consultants', [...state.consultants, ...consultants])
  },
  [types.PREPEND_CONSULTANTS](state, { consultants }) {
    Vue.set(state, 'consultants', [...consultants, ...state.consultants])
  },
  [types.UPDATE_CONSULTANTS](state, { mid, type }) {
    let item = find(state.consultants, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_DISPATCHERS](state, { dispatchers }) {
    Vue.set(state, 'dispatchers', dispatchers)
  },
  [types.INIT_OWNERDISPATCHERS](state, { ownerdispatchers }) {
    Vue.set(state, 'ownerdispatchers', ownerdispatchers)
  },
  [types.INIT_APPLICATIONDISPATCHERS](state, { applicationdispatchers }) {
    Vue.set(state, 'applicationdispatchers', applicationdispatchers)
  },
  [types.INIT_DISPATCHERAPPLICATIONS](state, { dispatcherapplications }) {
    Vue.set(state, 'dispatcherapplications', dispatcherapplications)
  },
  [types.INIT_DISPATCHERLIKES](state, { dispatcherlikes }) {
    Vue.set(state, 'dispatcherlikes', dispatcherlikes)
  },
  [types.APPEND_DISPATCHERS](state, { dispatchers }) {
    Vue.set(state, 'dispatchers', [...state.dispatchers, ...dispatchers])
  },
  [types.PREPEND_DISPATCHERS](state, { dispatchers }) {
    Vue.set(state, 'dispatchers', [...dispatchers, ...state.dispatchers])
  },
  [types.UPDATE_DISPATCHERS](state, { mid, type }) {
    let item = find(state.dispatchers, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_TOOLS](state, { tools }) {
    Vue.set(state, 'tools', tools)
  },
  [types.INIT_OWNERTOOLS](state, { ownertools }) {
    Vue.set(state, 'ownertools', ownertools)
  },
  [types.INIT_APPLICATIONTOOLS](state, { applicationtools }) {
    Vue.set(state, 'applicationtools', applicationtools)
  },
  [types.INIT_TOOLAPPLICATIONS](state, { toolapplications }) {
    Vue.set(state, 'toolapplications', toolapplications)
  },
  [types.INIT_TOOLLIKES](state, { toollikes }) {
    Vue.set(state, 'toollikes', toollikes)
  },
  [types.APPEND_TOOLS](state, { tools }) {
    Vue.set(state, 'tools', [...state.tools, ...tools])
  },
  [types.PREPEND_TOOLS](state, { tools }) {
    Vue.set(state, 'tools', [...tools, ...state.tools])
  },
  [types.UPDATE_TOOLS](state, { mid, type }) {
    let item = find(state.tools, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_KNOWLEDGES](state, { knowledges }) {
    Vue.set(state, 'knowledges', knowledges)
  },
  [types.INIT_OWNERKNOWLEDGES](state, { ownerknowledges }) {
    Vue.set(state, 'ownerknowledges', ownerknowledges)
  },
  [types.INIT_APPLICATIONKNOWLEDGES](state, { applicationknowledges }) {
    Vue.set(state, 'applicationknowledges', applicationknowledges)
  },
  [types.INIT_LEARNERKNOWLEDGES](state, { learnerknowledges }) {
    Vue.set(state, 'learnerknowledges', learnerknowledges)
  },
  [types.INIT_KNOWLEDGECONTENTS](state, { knowledgecontents }) {
    Vue.set(state, 'knowledgecontents', knowledgecontents)
  },
  [types.INIT_KNOWLEDGECERTIFICATES](state, { knowledgecertificates }) {
    Vue.set(state, 'knowledgecertificates', knowledgecertificates)
  },
  [types.INIT_LEARNINGSTATUS](state, { learningstatus }) {
    Vue.set(state, 'learningstatus', learningstatus)
  },
  [types.APPEND_KNOWLEDGES](state, { knowledges }) {
    Vue.set(state, 'knowledges', [...state.knowledges, ...knowledges])
  },
  [types.PREPEND_KNOWLEDGES](state, { knowledges }) {
    Vue.set(state, 'knowledges', [...knowledges, ...state.knowledges])
  },
  [types.INIT_KNOWLEDGECOMMENT](state, { knowledgecomments }) {
    Vue.set(state, 'knowledgecomments', knowledgecomments)
  },
  [types.APPEND_KNOWLEDGECOMMENT](state, { knowledgecomments }) {
    Vue.set(state, 'knowledgecomments', [...state.knowledgecomments, ...knowledgecomments])
  },
  [types.PREPEND_KNOWLEDGECOMMENT](state, { knowledgecomments }) {
    Vue.set(state, 'knowledgecomments', [...knowledgecomments, ...state.knowledgecomments])
  },
  [types.INIT_KNOWLEDGEAPPLICATIONS](state, { knowledgeapplications }) {
    Vue.set(state, 'knowledgeapplications', knowledgeapplications)
  },
  [types.INIT_KNOWLEDGELIKES](state, { knowledgelikes }) {
    Vue.set(state, 'knowledgelikes', knowledgelikes)
  },
  [types.UPDATE_KNOWLEDGES](state, { mid, type }) {
    let item = find(state.knowledges, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_EVENTS](state, { events }) {
    Vue.set(state, 'events', events)
  },
  [types.INIT_OWNEREVENTS](state, { ownerevents }) {
    Vue.set(state, 'ownerevents', ownerevents)
  },
  [types.INIT_APPLICATIONEVENTS](state, { applicationevents }) {
    Vue.set(state, 'applicationevents', applicationevents)
  },
  [types.INIT_EVENTAPPLICATIONS](state, { eventapplications }) {
    Vue.set(state, 'eventapplications', eventapplications)
  },
  [types.INIT_EVENTLIKES](state, { eventlikes }) {
    Vue.set(state, 'eventlikes', eventlikes)
  },
  [types.APPEND_EVENTS](state, { events }) {
    Vue.set(state, 'events', [...state.events, ...events])
  },
  [types.PREPEND_EVENTS](state, { events }) {
    Vue.set(state, 'events', [...events, ...state.events])
  },
  [types.UPDATE_EVENTS](state, { mid, type }) {
    let item = find(state.events, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_REPORTS](state, { reports }) {
    Vue.set(state, 'reports', reports)
  },
  [types.APPEND_REPORTS](state, { reports }) {
    Vue.set(state, 'reports', [...state.reports, ...reports])
  },
  [types.PREPEND_REPORTS](state, { reports }) {
    Vue.set(state, 'reports', [...reports, ...state.reports])
  },
  [types.UPDATE_REPORTS](state, { mid, type }) {
    let item = find(state.reports, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.INIT_TIMETIME](state, { timeline }) {
    Vue.set(state, 'timeline', timeline)
  },
  [types.APPEND_TIMETIME](state, { timeline }) {
    Vue.set(state, 'timeline', [...state.timeline, ...timeline])
  },
  [types.PREPEND_TIMETIME](state, { timeline }) {
    Vue.set(state, 'timeline', [...timeline, ...state.timeline])
  },
  [types.INIT_COMMENT](state, { comments }) {
    Vue.set(state, 'comments', comments)
  },
  [types.APPEND_COMMENT](state, { comments }) {
    Vue.set(state, 'comments', [...state.comments, ...comments])
  },
  [types.PREPEND_COMMENT](state, { comments }) {
    Vue.set(state, 'comments', [...comments, ...state.comments])
  },
  [types.UPDATE_TIMETIME] (state, { mid, type }) {
    let item = find(state.timeline, p => p.id === mid)
    const update = {}
    switch (type) {
      case 'like':
        update.like_count = item.like_count + 1
        update.liked = true
        break
      case 'unlike':
        update.like_count = item.like_count - 1
        update.liked = false
        break
    }
    // Yes, Object.assign can update state and UI component at same time.
    item = Object.assign(item, update)
  },
  [types.UPDATE_POPUP] (state, { key, value }) {
    Vue.set(state.popup, key, value)
  },
  [types.UPDATE_APPLICATION](state, { key1, value1, key2, value2, key3, value3 }) {
    Vue.set(state.popup, key1, value1)
    Vue.set(state.popup, key2, value2)
    Vue.set(state.popup, key3, value3)
  },
  [types.INIT_FEEDBACK](state, { feedbacks }) {
    Vue.set(state, 'feedbacks', feedbacks)
  },
  [types.APPEND_FEEDBACK](state, { feedback }) {
    Vue.set(state, 'feedback', [...state.feedback, ...feedback])
  },
  [types.SET_USERPROFILE](state, { userProfile }) {
    Vue.set(state, 'userProfile', userProfile)
    if (userProfile && userProfile.id) {
      Vue.set(state, 'isUserLogin', true)
    } else {
      Vue.set(state, 'isUserLogin', false)
    }
  },
  [types.SET_POSTS](state, { posts }) {
    if (posts) {
      Vue.set(state, 'posts', posts)
    } else {
      Vue.set(state, 'posts', [])
    }
  },
  [types.SET_HIDDENPOSTS](state, { hiddenPosts }) {
    if (hiddenPosts) {
      if (!state.hiddenPosts.some(x => x.id === hiddenPosts.id)) {
        state.hiddenPosts.unshift(hiddenPosts)
      }
    } else {
      Vue.set(state, 'hiddenPosts', [])
    }
  }

}
