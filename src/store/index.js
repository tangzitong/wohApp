import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  isUserLogin: false,
  userInfo: {},
  userProfile: {},
  contacts: [],
  timeline: [],
  comments: [],
  posts: [],
  hiddenPosts: [],
  popup: {
    publisherOpened: false,
    commentOpened: false,
    postKey: '',
    knowledgecommentOpened: false,
    knowledgekey: '',
    knowledgecontentkey: '',
    applicationOpened: false,
    applicationType: '',
    applicationKey: '',
    loginOpened: false
  },
  imagePath: ''
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
