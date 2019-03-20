import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  user: {},
  contacts: [],
  timeline: [],
  currentUser: null,
  userProfile: {},
  posts: [],
  hiddenPosts: [],
  popup: {
    publisherOpened: false,
    commentOpened: false,
    applicationOpened: false,
    loginOpened: false,
    imageUploaderOpened: false
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
