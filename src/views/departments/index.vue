<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <treetools :tree-node="company" :is-root="true" @addDepart="addDepartment" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <treetools slot-scope="{ data }" :tree-node="data" @delDepart="getDepartments" @addDepart="addDepartment" @editDepart="editDepartment" />
        </el-tree>
      </el-card>
      <add-dept ref="addform" :showdialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
    </div>
  </div>
</template>
<script>
import { getDepartments } from '@/api/department'
import treetools from './components/tree-tools'
import { tranListTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    treetools, AddDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name' // 表示从这个属性显示内容
      },
      departs: [],
      company: {},
      showDialog: false,
      node: {},
      title: '',
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      console.log(res)
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListTreeData(res.depts, '')
      this.loading = false
    },
    addDepartment(node) {
      this.showDialog = true
      this.node = node
      console.log(this.node)
    },
    async editDepartment(node) {
      await this.$refs.addform.getDepartDetail(node.id)
      this.showDialog = true
      this.node = node
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
