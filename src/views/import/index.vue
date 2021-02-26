<template>
  <div>
    <uploadExcel :on-success="onSuccess" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employee'
export default {
  data() {
    return {
      type: this.$route.query.type
    }
  },
  methods: {
    async onSuccess(data) {
      if (this.type === 'employee') {
        console.log(data)
        const dict = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const { results } = data
        const newData = results.map((item) => {
          return this.transData(dict, item)
        }
        )
        console.log(newData)
        await importEmployee(newData)
        this.$message.success('导入数据成功')
        this.$router.back()
      } else {
        console.log('准备以后添加其他类型的导入操作')
      }
    },
    transData(oldobj, newobj) {
      const newData = {}
      for (const key in newobj) {
        const newkey = oldobj[key]
        let newvalue = newobj[key]
        if (newkey === 'timeOfEntry' || newkey === 'correctionTime') {
          newvalue = new Date(this.formatDate(newvalue, '/'))
        }
        newData[newkey] = newvalue
      }
      return newData
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
