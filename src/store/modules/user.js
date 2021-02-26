import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
const state = {
  token: getToken(), // 默认值为空
  userInfo: {}
}
const mutations = {
  setCookie(state, data) {
    state.token = data
    setToken(data)
  },
  removeCookie() {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setCookie', res)
    setTimeStamp()
  },
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    const totalInfo = { ...res, ...baseInfo }
    commit('setUserInfo', totalInfo)
    return totalInfo
  },
  logout(context) {
    context.commit('removeCookie')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
