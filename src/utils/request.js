// export default service
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const TimeOut = 60 * 60 * 1000
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000

})// 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(async config => {
  if (store.getters.token && !config.headers.Authorization) {
    // 封装一个函数检测token是否过期
    if (checkTimeOut()) {
      await store.dispatch('user/logout')
      router.push('/login')
      Message.error('token 已超时')
      return Promise.reject('token 已超时')
    } else {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(res => {
  const { success, message, data } = res.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  console.dir(error)
  if (error.response && error.response.data.code && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(new Error('已经超时了'))
  } else {
    Message.error(error.message)
    return Promise.reject(error)
  }
})
export default service
// 封装的时间戳验证函数
const checkTimeOut = () => {
  const currentTime = getTimeStamp() // 登录保存的时间戳
  const nowTime = Date.now() // 当前时间
  return nowTime - currentTime > TimeOut
}

