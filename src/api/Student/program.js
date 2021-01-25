import request from '@/utils/request'

export function submit(data) {
    return request({
        url: '/onlineJudge/judge',
        method: 'post',
        data
    })
}