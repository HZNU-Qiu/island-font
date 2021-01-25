import request from '@/utils/request'

export function completeInfo(data) {
  return request({
    url: '/studentInfo/infoComplete',
    method: 'post',
    data
  })
}