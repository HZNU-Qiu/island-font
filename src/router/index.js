import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login/index.vue')
  },
  {
    path: '/completeInfo',
    component: () => import(/* webpackChunkName: "InfoComplete" */ '../views/InfoComplete/index.vue')
  },
  {
    path: '/experiment',
    name: 'Experiments',
    component: Layout,
    redirect: '/experiment/coding',
    meta: { title: 'Experiments', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'coding',
        name: 'Program',
        component: () => import(/* webpackChunkName: "Coding" */ '../views/Program/index.vue'),
        meta: { title: 'Coding', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import(/* webpackChunkName: "CreateExperiment" */ '../views/CreateExperiment/index.vue'),
        meta: { title: 'Create', icon: 'el-icon-upload2' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/dashboard',
    name: 'system',
    meta: {
      title: '管理员',
      roles: ['system']
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/system/Dashboard'),
        name: 'systemDashboard',
        meta: { roles: ['system'], title: '系统仪表盘' }
      },
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/home',
    name: 'student',
    meta: {
      title: '学生',
      roles: ['student']
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/system/Dashboard'),
        name: 'systemDashboard',
        meta: { roles: ['system'], title: '系统仪表盘' }
      },
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'home',
    meta: {
      title: '首页',
      roles: ['student', 'teacher', 'system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/HomePage/index'),
        name: 'homepage',
        meta: { roles: ['student', 'teacher', 'system'], title: '首页' }
      }
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'hash', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = new createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
