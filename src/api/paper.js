import request from '@/utils/request'

/**
 * 布置作业获取练习题
 */
export function filterPapers(data) {
  return request({
    url: `/paper/filterPaper`,
    method: 'post',
    data
  })
}

/**
 * 新增试卷
 */
export function addPaper(data) {
  return request({
    url: `/paper/addPaper`,
    method: 'post',
    data
  })
}

/**
 * 获取试卷信息
 */
export function getInfo(id) {
  return request({
    url: `/paper/info/${id}`,
    method: 'get'
  })
}

/**
 * 获取试卷试题
 */
export function getPaperExercises(id) {
  return request({
    url: `/paper/exercises/${id}`,
    method: 'get'
  })
}

/**
 * 保存试题信息
 */
export function savePaperExercises(data) {
  return request({
    url: `/paper/savePaperExercises`,
    method: 'post',
    data
  })
}

/**
 * 根据categoryId获取试卷
 */
export function getPapersByCategory(id) {
  return request({
    url: `/paper/getPapersByCategory/${id}`,
    method: 'get'
  })
}