import request from '@/utils/request'

/**
 * 获取课程内容 缺少作业返回信息
 */
export function getContent(id) {
  return request({
    url: `/courseContent/getContent/${id}`,
    method: 'get'
  })
}

/**
 * 保存课程内容
 */
export function saveContent(data) {
  return request({
    url: '/courseContent/saveContent',
    method: 'post',
    data
  })
}