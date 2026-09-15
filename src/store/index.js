import Vue from "vue"
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  avatarUrl: '',
  imClient: null,
  conClient: {},
  userOnline: [],
  userOnlineTotal: {},
  userInfo: null,
  groups: [],
  hbgroups: [],
  currentChannelId: '',
  unreadCount:0,
  otherLoginFlag:0,
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
