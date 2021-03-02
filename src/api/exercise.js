import request from '@/utils/request'

/**
 * 教师保存理论练习题
 */
export function addOne(data) {
  return request({
    url: '/exercise/add',
    method: 'post',
    data
  })
}

/**
 * 教师编辑理论练习题
 */
export function modify(data) {
  return request({
    url: '/exercise/modify',
    method: 'post',
    data
  })
}

/**
 * 条件检索理论联系
 */
export function getByConditions(data) {
  return request({
    url: '/exercise/getByConditions',
    method: 'post',
    data
  })
}

/**
 * 根据ID获取题目详情
 */
export function getDetail(id) {
  return request({
    url: `/exercise/detail/${id}`,
    method: 'get'
  })
}