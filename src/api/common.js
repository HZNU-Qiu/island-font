import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/token/signin',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: '/',
        method: 'get'
    })
}