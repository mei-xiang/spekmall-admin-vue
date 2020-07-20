<template>
  <div class="banner-wrap content">
    <div class="addBtn">
      <el-button type="primary" @click="addBanner">新增Banner</el-button>
    </div>

    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column min-width="55" type="index" label="序号"></el-table-column>

      <el-table-column min-width="120px" align="center" label="名称">
        <template slot-scope="{row}">
          <span>{{row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="banner图片">
        <template slot-scope="{row}">
          <el-image style="width: 100px; height: 100px" :src="row.src" fit="contain"></el-image>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="链接地址">
        <template slot-scope="{row}">{{row.url }}</template>
      </el-table-column>

      <el-table-column min-width="100px" align="center" label="操作">
        <template slot-scope="{row}">
          <el-button @click="handleModify(row)" type="text" size="small">修改</el-button>
          <el-button @click="handleDel(row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Drag" width="80">
        <template>
          <i class="el-icon-rank"></i>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增模态框 -->
    <el-dialog
      title="新增banner"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="handleCancelModal"
      class="bannerModal"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="banner名称：" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width:320px"></el-input>
        </el-form-item>

        <el-form-item label="banner图片：" :label-width="formLabelWidth" prop="src">
          <el-upload
            class="avatar-uploader"
            :action="uploadAdd"
            :headers="uploadHeader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">（尺寸：1920×440、格式jpg\png、大小10M内)</div>
          </el-upload>
        </el-form-item>
        <!--  prop="url" -->
        <el-form-item label="链接地址：" :label-width="formLabelWidth">
          <el-input v-model="form.url" style="width:320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelModal">取 消</el-button>
        <el-button type="primary" @click="handleSubmit(bannerId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { setStore, getStore, removeStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    console.log(this, 'jldsjflsjf')
    let baseUrl = this.BaseUrl
    return {
      list: [],
      uploadAdd: baseUrl + '/file/upload',
      uploadHeader: {
        Authorization: 'Bearer ' + token
      },
      isEditSubmit: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      sortable: null,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        src: '',
        url: ''
      },
      imageUrl: '',
      bannerId: '',
      rules: {
        name: [
          { required: true, message: '请输入banner名称', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
        src: [{ required: true, message: '请上传图片', trigger: 'change' }]
      }
    }
  },
  mounted() {
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.getBannerList()
    this.setSort()
  },
  methods: {
    // 轮播图拖拽事件
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          let oldArr = this.list
            .map(item => {
              return item.id
            })
            .join(',')
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          let newArr = this.list
            .map(item => {
              return item.id
            })
            .join(',')
          if (oldArr === newArr) return
          this.axios.put(`/api/banner/home/sort?ids=${newArr}`).then(res => {
            this.getBannerList()
          })
        }
      })
    },
    async getBannerList() {
      let res = await this.axios.get('/api/banner/home')
      if (!res.success) return
      let { data } = res
      this.list = data
      this.list.forEach((item, index) => {
        this.list[index].src = this.imgBaseUrl + item.src
      })
    },
    // 文件上传成功的钩子函数
    uploadSuccess(res, file, fileList) {
      this.form.src = res.data
      this.imageUrl = this.imgBaseUrl + res.data
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return
      })
    },
    // 编辑操作
    handleModify(row) {
      console.log(row)
      this.isEditSubmit = true
      this.dialogFormVisible = true
      // this.form = row
      this.form.id = row.id
      this.imageUrl = row.src
      this.form.url = row.url
      this.form.name = row.name
      this.form.src = row.src.split('filePath=')[1]
      // this.form.src = '/home/file/upload/20200717/n7sc3px7tfxi7khpddjhaaa.jpg'
    },
    // 删除操作
    handleDel(row) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let queryStr = `/api/banner/home?id=${row.id}`
          this.axios.del(queryStr).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getBannerList()
          })

          console.log(111)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 新增banner
    addBanner() {
      this.dialogFormVisible = true
      this.isEditSubmit = false
    },

    // 文件上传前的钩子函数，用于对文件类型进行校验
    beforeAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
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
    // 提交表单
    handleSubmit(val) {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // if (this.list.length >= 5) {
          //   this.$message.warning('图片轮播只允许5章')
          //   return
          // }

          if (!this.isEditSubmit) {
            let params = this.form
            params.type = 'IMAGE'
            params.position = 'INDEX'
            this.axios
              .post('/api/banner/home', this.form, { String: 'json' })
              .then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                  this.getBannerList()
                }
                if (res.code == 500) {
                  this.$message.warning(res.message)
                }
              })

            // 新建提交
          } else {
            // 编辑提交
            let queryStr = `/api/banner/home/${this.form.id}`
            this.axios
              .put(queryStr, this.form, { String: 'json' })
              .then(res => {
                if (!res.success) return
                this.$message.success('编辑成功')
                this.getBannerList()
              })
          }
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // 取消模态框
    handleCancelModal() {
      this.dialogFormVisible = false
      this.form = {
        name: '',
        src: '',
        linkUrl: ''
      }
      this.imageUrl = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}

.pageTitle {
  font-size: 24px;
  margin-bottom: 20px;
}

.addBtn {
  text-align: right;
  margin-bottom: 10px;
}

.icon-star {
  margin-right: 2px;
}

.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

/* 图片上传 */
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

/deep/ .avatar {
  width: 100px;
  height: 100px;
  display: block;
}

/deep/ .bannerModal .el-dialog {
  width: 25% !important;
}
</style>
