import request from '@/utils/request'

/**
 * 布置作业获取练习题
 */
export function listExercises(current, chapterId) {
  return request({
    url: `/homework/listExercises?current=${current}&chapterId=${chapterId}`,
    method: 'get',
  })
}

/**
 * 布置作业获取练习题
 */
 export function listHomework(chapterId) {
  return request({
    url: `/homework/listHomework/${chapterId}`,
    method: 'get',
  })
}

/**
 * 保存作业
 */
export function saveHomework(data) {
  return request({
    url: `/homework/save`,
    method: 'post',
    data
  })
}