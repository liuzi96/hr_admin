<template>
  <el-dialog :title="showtitle" :visible="showdialog" @close="btnCancel">
    <el-form ref="roleform" label-width="120px" :model="roleData" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleData.name" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input v-model="roleData.description" />
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" @click="btnOk">确定</el-button>
          <el-button @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { addRole, editRole } from '@/api/setting'
export default {
  props: {
    showdialog: {
      type: Boolean,
      default: false
    },
    roleData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 新增角色
      rules: {
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' },
          { min: 1, max: 30, message: '角色名不能超过30个词', trigger: 'blur' }
        ],
        description: [{ max: 50, message: '内容不能超过50个字', trigger: 'blur' },
          { required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showtitle() {
      return this.roleData.id ? '编辑角色' : '新增角色'
    }
  },
  methods: {
    btnCancel() {
      this.$emit('update:showdialog', false)
      this.$emit('update:roleData', { name: '', description: '' })
      this.$refs.roleform.resetFields()
    },
    async btnOk() {
      try {
        await this.$refs.roleform.validate()
        if (this.roleData.id) {
          console.log('这里是编辑角色')
          await editRole(this.roleData)
          this.$message.success('修改成功')
        } else {
          await addRole(this.roleData)
          this.$message.success('新增成功')
        }
        this.$emit('addRoles')
        this.$emit('update:showdialog', false)
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style>

</style>
