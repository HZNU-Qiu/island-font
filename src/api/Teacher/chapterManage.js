import request from '@/utils/request'

export function addChapter(data) {
  return request({
    url: '/chapter/addChapter',
    method: 'post',
    data
  })
}

export function getAll(id) {
  return request({
    url: `/chapter/getAll/${id}`,
    method: 'get'
  })
}

export function addChapterCourse(data) {
  return request({
    url: '/chapter/addCourse',
    method: 'post',
    data
  })
}