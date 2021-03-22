import request from '@/utils/request'

export function createCourse(data) {
  return request({
    url: '/courseManage/add',
    method: 'post',
    data
  })
}

export function listByTeacherId() {
  return request({
    url: '/courseManage/listByTeacherId',
    method: 'get'
  })
}

export function modifyCourse(data) {
  return request({
    url: '/courseManage/modify',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: `/courseManage/detail/${id}`,
    method: 'get'
  })
}

export function getCourseTree() {
  return request({
    url: `/courseManage/getCourseTree`,
    method: 'get'
  })
}

/**
 * 根据方向、类别、难度、是否是用户课程筛选课程信息
 */
export function filterCourse(data) {
  return request({
    url: `/courseManage/filterCourse`,
    method: 'post',
    data
  })
}