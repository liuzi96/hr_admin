<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span>共166条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="warning" @click="$router.push('/import?type=employee')">导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
          <el-button size="small" type="primary" @click="addEmployees">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list" style="width: 100%">
          <el-table-column label="序号" sortable="" type="index" :index="indexMethod" fixed />
          <el-table-column label="头像">
            <template slot-scope="{row}">
              <img v-imgerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" class="avatar" @click="showImg(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatterEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="230">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 二维码组件 -->
      <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQrCode">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="total,sizes,prev,pager,next,jumper"
          :page-sizes="[2,5,10,20]"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @size-change="changeSize"
          @current-change="changePage"
        />
      </el-row>
      <add-employee :show-dialog.sync="showdialog" @addEmployee="getEmployeesList" />
    </div>
  </div>
</template>

<script>
import EmployeeFormatter from '@/api/constant/employees'
import { deleteEmployee, getEmployeeList } from '@/api/employee'
import addEmployee from './components/addEmployee.vue'
import { formatDate } from '@/filters'
import QRcode from 'qrcode'
export default {
  components: { addEmployee },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showdialog: false,
      avatarImg: '',
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 头像显示
    showImg(staffPhoto) {
      if (staffPhoto) {
        this.avatarImg = staffPhoto
        this.showCodeDialog = true
      }
    },
    // 获取员工列表
    async getEmployeesList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      console.log(this.list)
      this.page.total = total
      this.loading = false
    },
    // 改变页码
    changePage(newpage) {
      console.log(newpage)
      this.page.page = newpage
      this.getEmployeesList()
    },
    // 改变每页数量
    changeSize(newsize) {
      this.page.size = newsize
      this.getEmployeesList()
    },
    formatterEmployment(row, column, cellValue, index) {
      const obj = EmployeeFormatter.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('是否删除该员工的记录信息', '提示', {
          type: 'warning'
        })
        await deleteEmployee(id)
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page -= 1
        }
        this.getEmployeesList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
      }
    },
    addEmployees() {
      this.showdialog = true
    },
    indexMethod(index) {
      return (this.page.page - 1) * (this.page.size) + index + 1
    },
    async exportExcel() {
      const dict = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(dict)
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      console.log(header)
      console.log(rows)
      const data = rows.map(item => {
        const arr = []
        header.forEach(key => {
          const newkey = dict[key]
          let value = item[newkey]
          if (newkey === 'timeOfEntry' || newkey === 'correctionTime') {
            value = new Date(formatDate(value))
          }
          if (newkey === 'formOfEmployment') {
            const obj = EmployeeFormatter.hireType.find(temp => {
              return temp.id === value
            })
            value = obj ? obj.value : '未知'
          }
          arr.push(value)
        })
        return arr
      })
      console.log(data)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          // 配置对象
          header,
          data,
          filename: '员工信息表',
          autoWidth: true
        })
      })
      // import('@/vendor/Export2Excel').then(excel => {

      // })
    },
    // 打开弹出二维码
    showQrCode(url) {
      QRcode.toCanvas(this.$refs.myCanvas, this.avatarImg)
    }

  }
}
</script>

<style>
.avatar {
  width:80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
