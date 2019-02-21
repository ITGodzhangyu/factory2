import request from '@/utils/request'

export function getComponentList(params) {
  return request({
    url: '/components',
    method: 'get',
    params
  })
}

export function addComponentList(data) {
  return request({
    url: '/components',
    method: 'post',
    data
  })
}

export function editComponentList(data) {
  return request({
    url: '/components',
    method: 'put',
    data
  })
}

export function deleteComponentList(params) {
  return request({
    url: '/components',
    method: 'delete',
    params
  })
}

export function getList(params) {
  return request({
    url: '/repo',
    method: 'get',
    params
  })
}


export function deleteTypeList(params) {
  return request({
    url: '/repo',
    method: 'delete',
    params
  })
}

export function addTypeList(data) {
  return request({
    url: '/repo',
    method: 'post',
    data
  })
}

export function getModuls(params) {
  return request({
    url: '/templates',
    method: 'get',
    params
  })
}

export function addModuls(data) {
  return request({
    url: '/templates',
    method: 'post',
    data
  })
}

