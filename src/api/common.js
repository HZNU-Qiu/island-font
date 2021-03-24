import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/token/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'get'
    })
}

export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

/**
 * 首页加载信息接口
 */
export function getHomePageInfo() {
    return request({
        url: '/user/getHomePageInfo',
        method: 'get'
    })
}

/**
 * 通用上传图片并在线预览方法
 */
export function uploadAndPreview(data) {
    return request({
        url: '/common/upload',
        method: 'post',
        header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data
    })
}

/**
 * 通用清除缓存的图片,上传过图片但并未确定时触发
 */
export function cancelUpload(tmp) {
    return request({
        url: '/common/cancel',
        method: 'post',
        data: tmp
    })
}