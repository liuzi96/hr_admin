import request from '@/utils/request'
// 获取角色管理详情
export function getRolesDetail(params) {
  return request({
    url: `/sys/role`,
    params
  })
}
// 获取公司详情
export function getCompanyDetail(id) {
  return request({
    url: `/company/${id}`
  })
}
// 根据id删除角色
export function deleteRoles(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
// 编辑角色
export function editRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
// 根据id获取角色详情
export function getRolesByIdDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

