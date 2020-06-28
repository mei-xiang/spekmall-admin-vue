<template>
  <!-- 品牌管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入品牌编号或品牌名称搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="showAddBrand"
        >新增</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="showHomeBrand"
        >首页品牌管理</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="brandData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="brandCode" label="品牌编号" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="brandName" label="品牌名称" width="150"></el-table-column>
      <el-table-column label="图片" width="190">
        <template slot-scope="scope">
          <el-image
            style="width: 120px; height: 28px;margin-top:5px"
            :src="imgBaseUrl + scope.row.brandImg"
            :preview-src-list="[imgBaseUrl + scope.row.brandImg]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="是否热门品牌" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.hot == true ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否首页品牌" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.showHome == true ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="150"></el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleMark(scope.$index, scope.row)"
            v-if="scope.row.hot == false"
          >标记热门</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleCancel(scope.$index, scope.row)"
            v-if="scope.row.hot == true"
          >取消热门</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page + 1"
      :page-sizes="[20, 30, 50]"
      :page-size.sync="searchForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 修改/新增对话框 -->
    <el-dialog
      :visible.sync="isShowBrandDialog"
      :title="type == 1 ? '修改品牌' : '新增品牌'"
      @close="handleClose"
    >
      <el-form :model="brandForm" ref="brandRef" :rules="brandRules" label-width="100px">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brandForm.brandName"></el-input>
        </el-form-item>
        <el-form-item label="品牌图片" prop="brandImg">
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
        </el-form-item>
        <el-form-item label="品牌类型" prop="hot">
          <el-radio v-model="brandForm.hot" :label="true">热门品牌</el-radio>
          <el-radio v-model="brandForm.hot" :label="false">普通品牌</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addOrEditBrand">确 定</el-button>
        <el-button @click="isShowBrandDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 首页品牌管理对话框 -->
    <el-dialog :visible.sync="isShowHomeBrandDialog" title="首页品牌管理" @close="handleHomeBrandClose">
      <div style="padding:20px">
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
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
import axios from 'axios'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        page: 0,
        size: 20
      },
      total: null,
      fileList: [], // 展示图片列表
      brandData: [], // 列表数据
      id: '', // 当前数据id
      type: '', // 新增-修改标识
      isShowBrandDialog: false, // 控制对话框的显示与隐藏
      brandForm: {
        brandName: '',
        brandImg: '',
        hot: ''
      }, // 对话框表单数据
      brandRules: {
        brandName: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' }
        ],
        brandImg: [
          { required: true, message: '品牌图片不能为空', trigger: 'blur' }
        ],
        hot: [
          { required: true, message: '品牌类型不能为空', trigger: 'change' }
        ]
      },
      uploadUrl: `http://192.168.212.13:8010/file/upload?token=${token}`, // 图片上传接口地址
      isShowHomeBrandDialog: false // 控制首页品牌管理对话框
    }
  },
  created() {
    this.getBrandList()
  },
  filters: {
    imgUrlFormat(urlStr) {
      if (!urlStr) urlStr = ''
      const srcList = urlStr.split(',')
      return this.imgBaseUrl + srcList[0]
    }
  },
  methods: {
    getBrandList() {
      this.axios.get(`${this.baseUrl}/api/brand`, this.searchForm).then(res => {
        if (res.code == 200) {
          this.brandData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    // 查询
    query() {
      this.searchForm.page = 0
      this.getBrandList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getBrandList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getBrandList()
    },
    // 显示添加品牌对话框
    showAddBrand() {
      this.isShowBrandDialog = true
      this.type = 2
    },
    // 显示修改品牌对话框
    handleEdit(index, row) {
      this.isShowBrandDialog = true
      this.type = 1
      this.id = row.id
      this.axios
        .get(`${this.baseUrl}/api/brand/info`, { id: row.id })
        .then(res => {
          if (res.code == 200) {
            for (let key in this.brandForm) {
              this.brandForm[key] = res.data[key]
            }
            this.fileList.push({ url: this.imgBaseUrl + res.data.brandImg })
          }
        })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.delete(`${this.baseUrl}/api/brand?id=${row.id}`).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getBrandList()
          })
        })
        .catch(() => {})
    },
    handleHot(obj, callback) {
      this.axios.put(`${this.baseUrl}/api/brand/sethot`, obj).then(res => {
        if (res.code === 200) {
          callback && callback(res)
        }
      })
    },
    // 标记热门
    handleMark(index, row) {
      const _this = this
      this.handleHot(
        {
          id: row.id,
          hot: true
        },
        function(res) {
          _this.getBrandList()
        }
      )
    },
    // 取消热门
    handleCancel(index, row) {
      const _this = this
      this.handleHot(
        {
          id: row.id,
          hot: false
        },
        function(res) {
          _this.getBrandList()
        }
      )
    },
    // 添加或编辑
    addOrEditBrand() {
      this.$refs.brandRef.validate(valid => {
        if (!valid) return false
        if (this.type == 1) {
          this.axios
            .put(`${this.baseUrl}/api/brand`, {
              ...this.brandForm,
              id: this.id
            })
            .then(res => {
              if (res.code === 200) {
                this.isShowBrandDialog = false
                this.getBrandList()
              }
            })
        }
        if (this.type == 2) {
          this.axios
            .post(`${this.baseUrl}/api/brand`, this.brandForm)
            .then(res => {
              if (res.code === 200) {
                this.isShowBrandDialog = false
                this.getBrandList()
              }
            })
        }
      })
    },
    handleClose() {
      // 清除操作
      for (let key in this.brandForm) {
        this.brandForm[key] = ''
      }
      this.id = null
      this.type = ''
      this.$refs.brandRef.resetFields()
      this.fileList = []
    },
    // 处理图片上传
    handleSuccess(res, file, fileList) {
      if (this.brandForm.brandImg) {
        fileList.splice(0, 1)
      }
      this.brandForm.brandImg = fileList[0].response.data
    },
    handleRemove(file, fileList) {
      this.brandForm.brandImg = ''
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isPNG = file.type === "image/png";
      // const isGIF = file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 1
      // if (!isJPG || !isPNG || !isGIF) {
      //   this.$message.error("上传头像图片只能是 PNG/JPG/JPEG/GIF 格式!");
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }
      return isLt2M
    },
    showHomeBrand() {
      this.isShowHomeBrandDialog = true
      this.axios
        .get(`${this.baseUrl}/api/brand/showhome`, {
          page: 1,
          size: 10
        })
        .then(res => {
          if (res.code === 200) {
            console.log(res)
          }
        })
    },
    handleHomeBrandClose() {}
  }
}
</script>

<style scopde>
.content {
  height: 100%;
  overflow: scroll;
}
.el-dialog {
  width: 450px !important;
}
</style>
