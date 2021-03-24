import request from '@/utils/request'

/**
 * 列出学生所学课程的考试
 */
export function listStudentExams() {
  return request({
    url: '/exam/listStudentExams',
    method: 'get'
  })
}

/**
 * 获取考试的起始时间以及剩余时间
 */
export function getExamDuration(id) {
  return request({
    url: `/exam/getExamDuration/${id}`,
    method: 'get'
  })
}
