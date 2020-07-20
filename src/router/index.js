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
    path: '/',
    component: Layout,
    children: [
      {
        path: 'about',
        name: 'About',
        component: () => import(/* webpackChunkName: "About" */ '../views/About.vue'),
        meta: { title: 'About', icon: 'el-icon-document' }
      }
    ]
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
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  // }
]

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = new createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
