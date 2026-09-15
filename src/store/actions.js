import * as types from './mutation-types'

export default {
  setAvatarUrl({ commit }, data) {
    commit(types.SET_AVATAR_URL, data)
  },
  setIMClient({ commit }, data) {
    commit(types.SET_IM_CLIENT, data)
  },
  setConClient({ commit }, data) {
    commit(types.SET_CON_CLIENT, data)
  },
  setUserOnline({ commit }, data) {
    commit(types.SET_USER_ONLINE, data)
  },
  setUserOnlineTotal({ commit }, data) {
    commit(types.SET_USER_ONLINE_TOTAL, data)
  },
  setUserInfo({ commit }, data) {
    commit(types.SET_USER_INFO, data)
  },
  setOtherLoginFlag({ commit }, data) {
    commit(types.SET_OTHER_LOGIN_FLAG, data)
  },
  setGroups({ commit }, data) {
    commit(types.SET_GROUPS, data)
  },
  setHbGroups({ commit }, data) {
    commit(types.SET_HBGROUPS, data)
  },
  setCurrentChannelId({ commit }, data) {
    commit(types.SET_CURRENT_CHANNEL_ID, data)
  },
  setUnreadCount({ commit },data) {
    commit(types.SET_UNREAD_COUNT,data)
  }
}
