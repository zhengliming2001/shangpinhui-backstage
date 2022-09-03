import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:9528/api/admin/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:9528/api/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'http://localhost:9528/api/admin/acl/index/logout',
    method: 'post'
  })
}
