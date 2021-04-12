import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Layout from '@/layout'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

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
    path: '/doExam',
    component: () => import(/* webpackChunkName: "DoExam" */ '../views/student/Exam.vue')
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
      title: '管理员',
      icon: 'el-icon-s-platform',
      roles: ['system']
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/system/Dashboard'),
        name: 'SystemDashboard',
        meta: { roles: ['system'], title: '服务监控', icon: 'el-icon-stopwatch' }
      },
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    name: '主页',
    meta: {
      roles: ['student', 'teacher', 'system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/HomePage.vue'),
        name: '旧岛LMS',
        meta: { roles: ['student', 'teacher', 'system'], title: '旧岛LMS', icon: 'el-icon-house' }
      },
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/course',
    name: '课程中心',
    meta: {
      title: '课程中心',
      roles: ['student'],
      icon: 'el-icon-s-grid'
    },
    children: [
      {
        path: 'course',
        component: () => import('@/views/student/CourseLabrary'),
        name: '旧岛课程',
        meta: { roles: ['student'], title: '旧岛课程', icon: 'el-icon-s-management' }
      },
      {
        path: 'courseCatalog',
        component: () => import('@/views/student/CourseCatalog.vue'),
        hidden: true,
        meta: { roles: ['student'], title: '课程目录' }
      },
      {
        path: 'learning',
        component: () => import('@/views/student/Learning.vue'),
        hidden: true,
        meta: { roles: ['student'] }
      },
    ]
  },
  {
    path: '/universityManage',
    component: Layout,
    redirect: '/universityManage/index',
    name: '院校管理',
    meta: {
      roles: ['system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/UniversityManage'),
        name: 'Manage',
        meta: { roles: ['system'], title: '院校管理', icon: 'el-icon-office-building' }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/studentManage',
    name: '用户管理',
    meta: { roles: ['system'], title: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'studentManage',
        component: () => import('@/views/system/StudentManage'),
        name: '学生管理',
        meta: { roles: ['system'], title: '学生管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'teacherManage',
        component: () => import('@/views/system/TeacherManage'),
        name: '教师管理',
        meta: { roles: ['system'], title: '教师管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/directions',
    component: Layout,
    redirect: '/directions/index',
    name: '课程管理',
    meta: {
      roles: ['system'],
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/CourseDirection'),
        name: '课程方向',
        meta: { roles: ['system'], title: '课程方向', icon: 'el-icon-collection-tag' }
      }
    ]
  },
  {
    path: '/courseManage',
    name: '课程库',
    component: Layout,
    redirect: '/courseManage/list',
    meta: { roles: ['teacher'], title: '课程库', icon: 'el-icon-s-grid' },
    children: [
      {
        path: 'list',
        name: '课程列表',
        component: () => import(/* webpackChunkName: "CourseTable" */ '../views/teacher/CourseTable.vue'),
        meta: { roles: ['teacher'], title: '课程列表', icon: 'el-icon-notebook-2' }
      },
      {
        path: 'create',
        name: '创建课程',
        component: () => import(/* webpackChunkName: "CreateCourse" */ '../views/teacher/CreateCourse.vue'),
        meta: { roles: ['teacher'], title: '创建课程', icon: 'el-icon-circle-plus-outline' }
      },
      {
        path: 'homework',
        hidden: true,
        component: () => import(/* webpackChunkName: "Homework" */ '../views/teacher/Homework.vue'),
        meta: { roles: ['teacher'] }
      },
    ]
  },
  {
    path: '/experiment',
    name: '实验题库',
    component: Layout,
    redirect: '/experiment/coding',
    meta: { roles: ['teacher', 'student'], title: '实验题库', icon: 'el-icon-s-platform' },
    children: [
      {
        path: 'coding',
        hidden: true,
        component: () => import(/* webpackChunkName: "Coding" */ '../views/Program/index.vue'),
        meta: { roles: ['teacher', 'student'] }
      },
      {
        path: 'submited',
        hidden: true,
        component: () => import(/* webpackChunkName: "SubmitQueue" */ '../views/SubmitQueue/index.vue'),
        meta: { roles: ['teacher', 'student'] }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import(/* webpackChunkName: "CreateExperiment" */ '../views/CreateExperiment/index.vue'),
        meta: { roles: ['teacher'] }
      },
      {
        path: 'list',
        name: 'ExperimentManage',
        component: () => import(/* webpackChunkName: "ExperimentManage"*/ '../views/teacher/ExperimentList.vue'),
        meta: { roles: ['teacher'], title: '题库管理', icon: 'el-icon-s-order' }
      },
      {
        path: 'all',
        name: 'ExperimentList',
        component: () => import(/* webpackChunkName: "ExperimentList"*/ '../views/Experiments/index'),
        meta: { roles: ['teacher', 'student'], title: '实验列表', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/exerciseManage',
    name: '理论题库',
    component: Layout,
    redirect: '/exerciseManage/index',
    meta: { roles: ['teacher'], title: '理论题库', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'index',
        name: '理论题',
        component: () => import(/* webpackChunkName: "ExercisesManage" */ '../views/teacher/ExerciseManage.vue'),
        meta: { roles: ['teacher'], title: '理论题', icon: 'el-icon-s-order' }
      },
      {
        path: 'exerciseEdition',
        hidden: true,
        component: () => import(/* webpackChunkName: "ExerciseEdition"*/ '../views/teacher/ExerciseEdition.vue'),
        meta: { roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/courseDetail',
    meta: { roles: ['teacher'] },
    component: Layout,
    hidden: true,
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
    hidden: true,
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
    hidden: true,
    redirect: '/courseContentViewer/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "CourseContentViewer" */ '../views/teacher/CourseContentViewer.vue'),
        meta: { roles: ['teacher'] }
      }
    ]
  },
  {
    path: '/Exam',
    name: '课程考核',
    component: Layout,
    redirect: '/Exam/paperManage',
    meta: { roles: ['teacher', 'student'], title: '考核', icon: 'el-icon-alarm-clock' },
    children: [
      {
        path: 'paperManage',
        name: '试卷管理',
        component: () => import(/* webpackChunkName: "PaperManage" */ '../views/teacher/PaperManage.vue'),
        meta: { roles: ['teacher'], title: '试卷库', icon: 'el-icon-receiving' }
      },
      {
        path: 'examManage',
        name: '考试管理',
        component: () => import(/* webpackChunkName: "ExamManage" */ '../views/teacher/ExamManage.vue'),
        meta: { roles: ['teacher'], title: '考试管理', icon: 'el-icon-files' }
      },
      {
        path: 'addExercises',
        hidden: true,
        component: () => import(/* webpackChunkName: "addExercises" */ '../views/teacher/PaperExercises.vue'),
      },
      {
        path: 'myExams',
        component: () => import('@/views/student/ExamList.vue'),
        name: '考核',
        meta: { roles: ['student'], title: '考核', icon: 'el-icon-trophy' }
      },
      {
        path: 'myGrades',
        component: () => import('@/views/student/ExamGrades.vue'),
        name: '我的成绩',
        meta: { roles: ['student'], title: '成绩', icon: 'el-icon-data-line' }
      }
    ]
  },

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
