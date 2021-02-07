import request from '@/utils/request'

export function getStudentsByPage(currentPage) {
  return request({
    url: `/user/getStudentsByPage?currentPage=${currentPage}`,
    method: 'get'
    })
}

export function modifyStudentInfo(data) {
  return request({
    url: `/user/modifyStudentInfo`,
    method: 'post',
    data
  })
}

export function modifyStudentStatus(data) {
  return request({
    url: `/studentInfo/modifyStudentStatus`,
    method: 'post',
    data
  })
}

export function addStudent(data) {
  return request({
    url: '/studentInfo/addStudent',
    method: 'post',
    data
  })
}

export function getTeachersByPage(currentPage) {
  return request({
    url: `/user/getTeachersByPage?currentPage=${currentPage}`,
    method: 'get'
    })
}

export function modifyTeacherInfo(data) {
  return request({
    url: `/user/modifyStudentInfo`,
    method: 'post',
    data
  })
}

export function modifyTeacherStatus(data) {
  return request({
    url: `/teacherInfo/modifyTeacherStatus`,
    method: 'post',
    data
  })
}

export function addTeacher(data) {
  return request({
    url: '/teacherInfo/addTeacher',
    method: 'post',
    data
  })
}

export function changeStudentAvatar(data) {
  return request({
    url: '/user/changeAvatar',
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    data
  })
}