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
