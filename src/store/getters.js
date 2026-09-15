const getters = {
  avatarUrl: state => state.avatarUrl,
  imClient: state => state.imClient,
  conClient: state => state.conClient,
  userOnline: state => state.userOnline,
  userOnlineTotal: state => state.userOnlineTotal,
  userInfo: state => state.userInfo,
  groups: state => state.groups,
  hbgroups: state => state.hbgroups,
  currentChannelId: state => state.currentChannelId,
  unreadCount: state => state.unreadCount,
  otherLoginFlag: state => state.otherLoginFlag
}

export default getters
