<template>
  <el-dialog :title="showtitle" :visible="showdialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="deptform" label-width="120px" :model="formdata" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formdata.name" style="width: 80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formdata.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formdata.manager" style="width: 80%" placeholder="请选择" @focus="getEmploysimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formdata.introduce" style="width: 80%" placeholder="1-300个字符" text="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 底部操作栏 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" @click="btnOk">确定</el-button>
        <el-button @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartment, editDepartment, getDepartmentMain, getDepartments, getEmployeeSimple } from '@/api/department'
export default {
  props: {
    showdialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      if (this.formdata.id) {
      // 找出点击新增部门对应的子部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.formdata.id).some(item => item.name === value)
        console.log(isRepeat)
      } else {
        // 新增
        isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some((item) => item.name === value)
      }
      if (isRepeat) {
        callback(new Error('同级部门已经有该子部门了'))
      } else {
        callback()
      }
    }
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      if (this.formdata.id) {
        isRepeat = depts.some(item => item.code === value && item.id !== this.formdata.id)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      if (isRepeat) {
        callback(new Error('部门编码是唯一的,该编码已经被使用'))
      } else {
        callback()
      }
    }

    return {
      formdata: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名字不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1到50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkName }
        ],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1到50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCode }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1到300个字符' }]
      },
      people: []
    }
  },
  computed: {
    showtitle() {
      return this.formdata.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmploysimple() {
      const res = await getEmployeeSimple()
      console.log(res)
      this.people = res
    },
    btnOk() {
      this.$refs.deptform.validate(async isok => {
        if (isok) {
          // 将编辑业务场景和新增部门业务请求进行分类,如果有部门id说明是编辑场景
          if (this.formdata.id) {
            await editDepartment(this.formdata)
            this.$message.success('部门修改成功')
          } else {
            const res = await addDepartment({ ...this.formdata, pid: this.treeNode.id })
            this.$message.success('部门新增成功')
            console.log(res)
          }
          this.$emit('addDepts')
          this.$emit('update:showdialog', false)
        }
      })
    },
    btnCancel() {
      // 这里相当于把编辑表单获取的formdata数据重置成了新增表单时候的对象
      this.formdata = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showdialog', false)
      this.$refs.deptform.resetFields()
      console.log(this.formdata)
    },
    async getDepartDetail(id) {
      this.formdata = await getDepartmentMain(id)
      console.log(this.formdata)
    }
  }
}
</script>

<style>

</style>
