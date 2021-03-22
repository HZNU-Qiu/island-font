import request from '@/utils/request'

/**
 * 学生开始学习课程
 */
export function startLearning(id) {
  return request({
    url: `/studentCourse/startLearning/${id}`,
    method: 'get'
  })
}

/**
 * 查询学生是否开启了课程
 */
export function hasStart(id) {
  return request({
    url: `/studentCourse/hasStart/${id}`,
    method: 'get'
  })
}