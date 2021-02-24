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
    meta: {
      title: 'system',
      icon: 'el-icon-s-platform',
      roles: ['system']
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/system/Dashboard'),
        name: 'SystemDashboard',
        meta: { roles: ['system'], title: 'DashBoard', icon: 'el-icon-stopwatch' }
      },
    ]
  },
  // {
  //   path: '/student',
  //   component: Layout,
  //   redirect: '/student/home',
  //   name: 'student',
  //   meta: {
  //     title: '学生',
  //     roles: ['student']
  //   },
  //   children: [
  //     {
  //       path: 'home',
  //       component: () => import('@/views/system/Dashboard'),
  //       name: 'systemDashboard',
  //       meta: { roles: ['system'], title: '系统仪表盘' }
  //     },
  //   ]
  // },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: 'home',
    meta: {
      roles: ['student', 'teacher', 'system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/HomePage/index'),
        name: 'homepage',
        meta: { roles: ['student', 'teacher', 'system'], title: 'Home', icon: 'el-icon-house' }
      }
    ]
  },
  {
    path: '/universityManage',
    component: Layout,
    redirect: '/universityManage/index',
    name: 'UniversityManage',
    meta: {
      roles: ['system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/UniversityManage'),
        name: 'Manage',
        meta: { roles: ['system'], title: 'UniversityManage', icon: 'el-icon-office-building' }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/studentManage',
    name: 'UserManage',
    meta: { roles: ['system'], title: 'UserManage', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'studentManage',
        component: () => import('@/views/system/StudentManage'),
        name: 'studentManage',
        meta: { roles: ['system'], title: 'StudentManage', icon: 'el-icon-user-solid' }
      },
      {
        path: 'teacherManage',
        component: () => import('@/views/system/TeacherManage'),
        name: 'teacherManage',
        meta: { roles: ['system'], title: 'TeacherManage', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/directions',
    component: Layout,
    redirect: '/directions/index',
    name: 'CourseManage',
    meta: {
      roles: ['system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/CourseDirection'),
        name: 'CourseDirection',
        meta: { roles: ['system'], title: 'CourseDirection', icon: 'el-icon-collection-tag' }
      }
    ]
  },
  {
    path: '/courseManage',
    name: 'CourseManage',
    component: Layout,
    redirect: '/courseManage/list',
    meta: { roles: ['teacher'], title: 'CourseManage', icon: 'el-icon-s-grid' },
    children: [
      {
        path: 'list',
        name: 'CourseTable',
        component: () => import(/* webpackChunkName: "CourseTable" */ '../views/teacher/CourseTable.vue'),
        meta: { roles: ['teacher'], title: 'CourseTable', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import(/* webpackChunkName: "CreateCourse" */ '../views/teacher/CreateCourse.vue'),
        meta: { roles: ['teacher'], title: 'CreateCourse', icon: 'el-icon-circle-plus-outline' }
      }
    ]
  },
  {
    path: '/experiment',
    name: 'Experiments',
    component: Layout,
    redirect: '/experiment/coding',
    meta: { roles: ['teacher', 'student'], title: 'Experiments', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'coding',
        name: 'Program',
        component: () => import(/* webpackChunkName: "Coding" */ '../views/Program/index.vue'),
        meta: { roles: ['teacher', 'student'], title: 'Coding', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import(/* webpackChunkName: "CreateExperiment" */ '../views/CreateExperiment/index.vue'),
        meta: { roles: ['teacher'], title: 'Create', icon: 'el-icon-upload2' }
      }
    ]
  },
  {
    path: '/courseDetail',
    meta: { roles: ['teacher'] },
    component: Layout,
    redirect: '/courseDetail/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "CourseDetail" */ '../views/teacher/CourseDetail.vue'),
        meta: { roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/courseContentEditor',
    meta: { roles: ['teacher'] },
    component: Layout,
    redirect: '/courseContentEditor/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "CourseContent" */ '../views/teacher/CourseContentEditor.vue'),
        meta: { roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/courseContentViewer',
    meta: { roles: ['teacher'] },
    component: Layout,
    redirect: '/courseContentViewer/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "CourseContentViewer" */ '../views/teacher/CourseContentViewer.vue'),
        meta: { roles: ['teacher'] }
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
