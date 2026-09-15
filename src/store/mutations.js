import * as types from './mutation-types'

const mutations = {
  [types.SET_AVATAR_URL]: (state, data) => {
    state.avatarUrl = data
  },
  [types.SET_IM_CLIENT]: (state, data) => {
    state.imClient = data
  },
  [types.SET_CON_CLIENT]: (state, data) => {
    state.conClient[data.groupid] = data
  },
  [types.SET_USER_ONLINE]: (state, data) => {
    state.userOnline = data
  },
  [types.SET_USER_ONLINE_TOTAL]: (state, data) => {
    state.userOnlineTotal = data
  },
  [types.SET_USER_INFO]: (state, data) => {
    state.userInfo = data
  },
  [types.SET_GROUPS]: (state, data) => {
    state.groups = data
  },
  [types.SET_HBGROUPS]: (state, data) => {
    state.hbgroups = data
  },
  [types.SET_CURRENT_CHANNEL_ID]: (state, data) => {
    state.currentChannelId = data
  },
  [types.SET_UNREAD_COUNT]: (state,data) => {
    state.unreadCount = state.unreadCount + data
  },
  [types.SET_OTHER_LOGIN_FLAG]: (state,data) => {
    state.otherLoginFlag = data
  }
}

export default mutations
