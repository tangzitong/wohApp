import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  userProfile: {},
  contacts: [],
  timeline: [],
  posts: [],
  hiddenPosts: [],
  popup: {
    publisherOpened: false,
    commentOpened: false,
    applicationOpened: false,
    applicationType: '',
    applicationKey: '',
    loginOpened: false
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
