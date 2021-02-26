<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoles"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="total,sizes,prev,pager,next,jumper" :page-sizes="[2,5,10,20]" :page-size="page.pagesize" :total="page.total" @current-change="currentChange" @size-change="sizeChange" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formdata.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formdata.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formdata.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formdata.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <add-roles :showdialog.sync="showdialog" :role-data.sync="roleData" @addRoles="getRolesDedail" />
    </div>
  </div>
</template>

<script>
import addRoles from './components/addRoles'
import { deleteRoles, getCompanyDetail, getRolesByIdDetail, getRolesDetail } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  components: {
    addRoles
  },
  data() {
    return {
      formdata: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      list: [],
      page: {
        pagesize: 5,
        page: 1, // 当前页数
        total: 0
      },
      showdialog: false,
      roleData: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRolesDedail()
    this.getCompanymain()
  },
  methods: {
    async getCompanymain() {
      const res = await getCompanyDetail(this.companyId)
      console.log(res)
      this.formdata = res
    },
    async getRolesDedail() {
      const result = await getRolesDetail({ page: this.page.page, pagesize: this.page.pagesize })
      console.log(result)
      const { rows, total } = result
      this.page.total = total
      this.list = rows
    },
    currentChange(newPage) {
      this.page.page = newPage
      this.getRolesDedail()
    },
    sizeChange(newSize) {
      this.page.pagesize = newSize
      this.getRolesDedail()
    },
    addRoles() {
      this.showdialog = true
    },
    async editRole(id) {
      this.roleData = await getRolesByIdDetail(id)
      console.log(this.roleData)
      this.showdialog = true
    },
    async deleteRole(id) {
      try {
        await this.$confirm('请确认是否永久删除该角色,是否继续?', '提示', {
          type: 'warning'
        })
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page -= 1
        }
        await deleteRoles(id)
        this.getRolesDedail()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
