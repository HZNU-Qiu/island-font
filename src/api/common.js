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