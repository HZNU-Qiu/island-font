import request from '@/utils/request'

/**
 * 学生开始学习课程
 */
export function getProgress(id) {
  return request({
    url: `/studentChapter/getProgress/${id}`,
    method: 'get'
  })
}

/**
 * 查询学生是否完成了该章节
 * 是返回成绩
 */
export function hasComplete(id) {
  return request({
    url: `/studentChapter/hasComplete/${id}`,
    method: 'get'
  })
}