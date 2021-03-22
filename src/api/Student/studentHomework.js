import request from '@/utils/request'

/**
 * 提交作业，反馈成绩
 */
export function submitAndSave(data) {
  return request({
    url: "/studentHomework/submitAndSave",
    method: 'post',
    data
  })
}

/**
 * 获取学生作业记录
 */
 export function getStudentHomeworkRecord(chapterId) {
  return request({
    url: `/studentHomework/getStudentHomeworkRecord/${chapterId}`,
    method: 'get',
  })
}