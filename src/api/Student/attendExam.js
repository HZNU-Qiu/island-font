import request from '@/utils/request'

/**
 * 获取学生成绩
 */
export function getUserRecord() {
  return request({
    url: '/attendExam/getStudentGrade',
    method: 'get'
  })
}