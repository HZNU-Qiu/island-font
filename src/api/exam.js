import request from '@/utils/request'

/**
 * 保存考试
 */
export function saveExam(data) {
  return request({
    url: `/exam/saveExam`,
    method: 'post',
    data
  })
}

/**
 * 获取教师自己的课程考试
 */
export function getTeachersExam() {
  return request({
    url: `/exam/getTeachersExam`,
    method: 'get'
  })
}

/**
 * 编辑考试
 */
export function modifyExam(data) {
  return request({
    url: `/exam/modifyExam`,
    method: 'post',
    data
  })
}