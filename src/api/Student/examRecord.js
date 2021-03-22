import request from '@/utils/request'

/**
 * 保存学生答题记录
 */
 export function saveRecord(data) {
  return request({
    url: '/examRecord/saveRecord',
    method: 'post',
    data
  })
}

/**
 * 考试完成，改卷
 */
 export function judgeExam(data) {
  return request({
    url: '/examRecord/judgeAndReturnGrade',
    method: 'post',
    data
  })
}