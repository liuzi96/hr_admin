import router from '@/router'
import NProgress from 'nprogress'// 引人进度条插件
import 'nprogress/nprogress.css'
import store from './store'
const whiteList = ['/login', '/404']// 定义白名单,不受权限控制的页面
router.beforeEach(async(to, from, next) => {
  NProgress.start()// 开启进度条
  // 先判断有无token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userid) {
        await store.dispatch('user/getUserInfo')
      }
      next() // 如果有token说明已经登录,去往其他页面直接放行
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done()
})
// 路由后置守卫
router.afterEach(() => {
  NProgress.done()
})
