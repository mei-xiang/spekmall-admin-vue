<template>
  <!-- 商品标签管理 -->
  <div class="content">
    <!-- 表格区域 -->
    <el-button
      type="button"
      class="el-button el-button--primary el-button--mini"
      icon="el-icon-circle-plus-outline"
      style="margin-bottom:20px"
      @click="addSupplier"
      v-if="$isPermission($route.path)"
    >新增</el-button>
    <el-table :data="labelData" border style="width: 720px">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="type" label="标签类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">自营渠道</span>
          <span v-if="scope.row.type == 2">运营产品标签</span>
          <span v-if="scope.row.type == 3">商家添加标签</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品标签名称"></el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <el-image style="margin-top:5px" :src="imgBaseUrl + scope.row.ico"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if="$isPermission($route.path)">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="scope.row.type != 1"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.type != 1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改/新增对话框 -->
    <el-dialog
      :visible.sync="isShowDialog"
      :title="type == 1 ? '修改标签' : '新增标签'"
      @close="handleClose"
    >
      <el-form :model="labelForm" ref="labelRef" :rules="labelRules" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="labelForm.name" placeholder="必填项，十五个字节以内"></el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="type">
          <el-select v-model="labelForm.type">
            <!-- <el-option label="自营渠道" :value="1"></el-option> -->
            <el-option label="运营产品标签" :value="2"></el-option>
            <el-option label="商家添加标签" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <!--  prop="ico" -->
        <el-form-item label="标签图标">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <span class="size_limit">尺寸1920*440，1M以内，PNG/JPG/JPEG/GIF</span>
          <!-- 修改与审核图片展示 -->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addOrEditLabel">确 定</el-button>
        <el-button @click="isShowDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from '../../api/env'
import { getStore } from 'js/store'
import axios from 'axios'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      labelData: [],
      isShowDialog: false,
      isShowDelDialog: false,
      // 对话框数据
      labelForm: {
        name: '',
        type: '',
        ico: ''
      },
      labelRules: {
        name: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5]{1,7}$|^[\u4e00-\u9fa5]{7}[\dA-Za-z_-]{1}$|^[\dA-Za-z_-]{1,15}$/,
            message: '只能输入15个字节(数字,字母,划线)'
          }
        ],
        type: [
          { required: true, message: '标签类型不能为空', trigger: 'blur' }
        ],
        ico: [
          { required: true, message: '标签图标不能为空', trigger: 'change' }
        ]
      },
      type: '', // 对话框类型 新增/编辑
      uploadUrl: `${
        baseUrl[process.env.NODE_ENV].apiUrl
      }/file/upload?token=${token}`, // 图片上传地址
      fileList: [],
      id: null, // 当前数据id
      title: ''
    }
  },
  created() {
    this.getLabelList()
  },
  methods: {
    getLabelList() {
      this.axios.get(`/api/tag/list`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.labelData = res.data
        }
      })
    },
    handleClose() {
      this.labelForm.name = ''
      this.labelForm.type = ''
      this.labelForm.ico = ''
      this.id = null
      this.$refs.labelRef.resetFields()
      this.fileList = []
    },
    // 显示添加
    addSupplier() {
      this.isShowDialog = true
      this.type = 2
    },
    // 显示修改
    handleEdit(index, row) {
      console.log(index, row)
      this.id = row.id
      this.isShowDialog = true
      this.type = 1
      this.axios.get(`/api/tag/${this.id}`).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.labelForm.name = res.data.name
          this.labelForm.type = res.data.type
          this.labelForm.ico = res.data.ico
          this.fileList.push({ url: this.imgBaseUrl + res.data.ico })
        }
      })
    },
    // 删除
    handleDelete(index, row) {
      this.axios.get(`/api/tag/use/${row.id}`).then(res => {
        console.log(res)
        if (res.code == 200) {
          if (res.data !== 0) {
            this.title = '有商品正在使用该标签，确认是否删除?'
            this.del(row.id)
          }
          if (res.data == 0) {
            this.title = '是否确认删除?'
            this.del(row.id)
          }
        }
      })
    },
    del(id) {
      this.$confirm(`${this.title}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.delete(`/api/tag/${id}`).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getLabelList()
          })
        })
        .catch(() => {})
    },
    // 处理图片上传
    handleSuccess(res, file, fileList) {
      console.log(fileList)
      if (this.labelForm.ico) {
        fileList.splice(0, 1)
      }
      // this.labelForm.ico = this.imgBaseUrl + fileList[0].response.data;
      this.labelForm.ico = fileList[0].response.data
    },
    handleRemove(file, fileList) {
      this.labelForm.ico = ''
    },
    beforeAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error(
          '上传头像图片只能是 JPG 或者 JPEG 或者 PNG 或者 GIF 格式!'
        )
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
      }, 0)
      const isSize = new Promise(function(resolve, reject) {
        let width = 1920 // 限制图片尺寸为1920*440
        let height = 440
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('图片尺寸限制为1920 x 440')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    // 添加或编辑
    addOrEditLabel() {
      this.$refs.labelRef.validate(valid => {
        if (!valid) return
        if (this.type == 1) {
          console.log({ ...this.labelForm, id: this.id })
          this.axios
            .post(`/api/tag/update`, {
              ...this.labelForm,
              id: this.id
            })
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                this.isShowDialog = false
                this.getLabelList()
              }
            })
        }
        if (this.type == 2) {
          this.axios.post(`/api/tag/add`, this.labelForm).then(res => {
            console.log(res)
            if (res.code == 200) {
              this.isShowDialog = false
              this.getLabelList()
            }
          })
        }
      })
    }
  }
}
</script>

<style scopde>
.el-dialog {
  width: 450px !important;
}
</style>

