import Vue from 'vue'
import * as types from './mutation-types'
import find from 'lodash/find'

export default {
  [types.INIT_USER_INFO] (state, { user }) {
    Vue.set(state, 'user', user)
  },
  [types.INIT_CONTACTS] (state, { contacts }) {
    Vue.set(state, 'contacts', contacts)
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
  [types.INIT_RESUMES](state, { resumes }) {
    Vue.set(state, 'resumes', resumes)
  },
  [types.APPEND_RESUMES](state, { resumes }) {
    Vue.set(state, 'resumes', [...state.resumes, ...resumes])
  },
  [types.PREPEND_RESUMES](state, { resumes }) {
    Vue.set(state, 'resumes', [...resumes, ...state.resumes])
  },
  [types.UPDATE_RESUMES](state, { mid, type }) {
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
  [types.INIT_TOOLS](state, { tools }) {
    Vue.set(state, 'tools', tools)
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
  [types.APPEND_KNOWLEDGES](state, { knowledges }) {
    Vue.set(state, 'knowledges', [...state.knowledges, ...knowledges])
  },
  [types.PREPEND_KNOWLEDGES](state, { knowledges }) {
    Vue.set(state, 'knowledges', [...knowledges, ...state.knowledges])
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
  [types.UPDATE_APPLICATION](state, { key, value }) {
    Vue.set(state.application, key, value)
  },
  [types.INIT_FEEDBACK](state, { feedbacks }) {
    Vue.set(state, 'feedbacks', feedbacks)
  },
  [types.APPEND_FEEDBACK](state, { feedback }) {
    Vue.set(state, 'feedback', [...state.feedback, ...feedback])
  },
  [types.SET_CURRENTUSER](state, { currentUser }) {
    Vue.set(state, 'currentUser', currentUser)
  },
  [types.SET_USERPROFILE](state, { userProfile }) {
    Vue.set(state, 'userProfile', userProfile)
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
