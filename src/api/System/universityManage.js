import request from '@/utils/request'

export function addUniversity(data) {
  return request({
    url: '/university/add',
    method: 'post',
    data
  })
}

export function addSchool(data) {
  return request({
    url: '/school/add',
    method: 'post',
    data
  })
}

export function addDepartment(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}

export function addMajor(data) {
  return request({
    url: '/major/add',
    method: 'post',
    data
  })
}

export function addClass(data) {
  return request({
    url: '/class/add',
    method: 'post',
    data
  })
}

export function getTree() {
  return request({
    url: '/university/getTree',
    method: 'get'
  })
}

export function modifyUniversity(data) {
  return request({
    url: '/university/modify',
    method: 'post',
    data
  })
}

export function modifySchool(data) {
  return request({
    url: '/school/modify',
    method: 'post',
    data
  })
}

export function modifyDepartment(data) {
  return request({
    url: '/department/modify',
    method: 'post',
    data
  })
}

export function modifyMajor(data) {
  return request({
    url: '/major/modify',
    method: 'post',
    data
  })
}

export function modifyClass(data) {
  return request({
    url: '/class/modify',
    method: 'post',
    data
  })
}