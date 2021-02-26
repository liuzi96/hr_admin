<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :http-request="upload"
      :on-preview="preview"
      :on-change="changeFile"
      :on-remove="handleRemove"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :class="{disabled: filecomputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
// import { getUserInfo } from '@/api/user'
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDRgeYOS01A5mCOVs8FckeHf4oF9mAtYbI',
  SecretKey: 'BtC3f32qvLVcXF5hjXAoBZp14Sm2nML4'
})

export default {
  data() {
    return {
      fileList: [], // 上传的文件列表
      showDialog: false,
      imgUrl: '',
      currentFileUid: '', // 用于记录当前图片的uid
      showPercent: false, // 控制进度条的显示关闭,
      percent: '' // 控制进度条进度
    }
  },
  computed: {
    // 判断是否上传一张图片
    filecomputed() {
      return this.fileList.length >= 1
    }
  },
  methods: {
    upload(data) {
      console.log(data.file)
      if (data.file) {
        cos.putObject({
          Bucket: 'liuzi-1304850802-1304850802', // 存储桶
          Region: 'ap-guangzhou', // 地域
          Key: data.file.name + data.file.size, // 文件名
          Body: data.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (progressData) => {
            this.percent = progressData.percent * 100
          }
        }, (err, data) => {
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                item.url = 'http://' + data.Location
                item.upload = true
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    },
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      this.fileList = [...fileList]
      console.log(this.fileList, '删除图片触发的函数')
    },
    changeFile(file, fileList) {
      this.fileList = [...fileList]
      console.log(this.fileList, '文件改变触发的函数')
    },
    beforeUpload(file) {
      console.log(file)
      // 检验文件的大小
      const maxSize = 1 * 1024 * 1024
      // 检验文件的类型是否符合规范
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (file.size > maxSize) {
        this.$message.error('图片不能超过5M大小')
        return false
      }
      if (types.indexOf(file.type) === -1) {
        this.$message.error('图片格式不规范')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
