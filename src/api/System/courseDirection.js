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

export function listAllTags(id) {
  return request({
    url: `/courseCategory/list/${id}`,
    method: 'get',
  })
}

export function addTag(data) {
  return request({
    url: '/courseCategory/add',
    method: 'post',
    data
  })
}

export function modiftTag(data) {
  return request({
    url: '/courseCategory/modify',
    method: 'post',
    data
  })
}

export function getTree() {
  return request({
    url: '/courseDirection/getTree',
    method: 'get'
  })
}