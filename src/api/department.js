import request from '@/utils/request.js'
// 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
// 新增部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
// 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
// 获取部门的详情
export function getDepartmentMain(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 编辑部门
export function editDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
