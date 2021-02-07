import request from '@/utils/request'

export function addCourseDirection(data) {
  return request({
    url: '/courseDirection/add',
    method: 'post',
    data
  })
}

export function listAll() {
  return request({
    url: '/courseDirection/list',
    method: 'get'
  })
}

export function modifyCourseDirection(data) {
  return request({
    url: '/courseDirection/modify',
    method: 'post',
    data
  })
}

export function ListAllTags(id) {
  return request({
    url: `/courseCategory/list/${id}`,
    method: 'get',
  })
}