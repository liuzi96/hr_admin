const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
  userid: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  companyId: state => state.user.userInfo.companyId
}
export default getters
