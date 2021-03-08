import request from '@/utils/request'

/**
 * 添加实验题目
 */
export function addExperiment(data) {
  return request({
    url: '/experiment/add',
    method: 'post',
    data
  })
}

/**
 * 分页展示实验列表
 */
export function listExperimentForTeachers(current) {
  return request({
    url: `/experiment/listByPage/${current}`,
    method: 'get',
  })
}

/**
 * 分页展示实验列表
 */
 export function filterAndList(data) {
  return request({
    url: `/experiment/filterAndList`,
    method: 'post',
    data
  })
}

/**
 * 改变实验是否可见
 */
export function statusChange(id, status) {
  return request({
    url: `/experiment/visable?id=${id}&status=${status}`,
    method: 'get',
  })
}

/**
 * 获取实验的详情信息
 */
export function getDetail(id) {
  return request({
    url: `/experiment/getDetail/${id}`,
    method: 'get',
  })
}

/**
 * 编辑实验题目
 */
 export function modifyExperiment(data) {
  return request({
    url: '/experiment/modify',
    method: 'post',
    data
  })
}

/**
 * 下载实验样例数据
 */
export function downloadSource(id) {
  return request({
    url: `/experiment/download/${id}`,
    method: 'get',
  })
}

/**
 * 提交实验判题
 */
export function judge(data) {
  return request({
    url: '/experiment/judge',
    method: 'post',
    data
  })
}