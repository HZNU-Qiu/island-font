import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  if (getToken()) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else if (to.path === '/completeInfo') {
      next()
    } else {
      console.log(store.getters.roles)
      console.log(store.getters.roles.length)
      console.log(store.getters.roles.length === 0)
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(response => { // 拉取用户信息
          const roles = response.roles;
          store.dispatch('generateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          console.log(err)
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录');
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下，如果访问/login 直接访问就好了
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 没有token还想访问别的页面，重定向回/login
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
