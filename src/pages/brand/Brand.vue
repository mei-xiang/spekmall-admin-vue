<template>
  <!-- 品牌管理 -->
  <div class="content brand">
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
        >添加品牌</el-button>
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
            @click.native="showImg(imgBaseUrl + scope.row.brandImg)"
          ></el-image>
          <!--  :preview-src-list="[imgBaseUrl + scope.row.brandImg]" -->
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
      class="totBrandListDia"
    >
      <el-form :model="brandForm" ref="brandRef" :rules="brandRules" label-width="100px">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brandForm.brandName" placeholder="必填项，十五个字节以内"></el-input>
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
          <span class="size_limit">尺寸216*130，1M以内，PNG/JPG/JPEG/GIF</span>
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
    <el-dialog :visible.sync="isShowHomeBrandDia" title="首页品牌管理">
      <div class="homeBrandBox">
        <div class="addHomeBrand_box">
          <div class="addHomeBrand" @click="showHomeAddBrand" v-for="(item) in 10" :key="item">点击添加</div>
        </div>

        <draggable v-model="homeBrandList" @update="datadragEnd">
          <transition-group tag="div" class="drop-wrapper">
            <div v-for="item in homeBrandList" :key="item" class="item">
              <el-image style="width: 148px; height: 148px" :src="imgBaseUrl+item.brandImg"></el-image>
              <span class="del" @click="delHomeBrand(item.id)">删除{{item.sortNum}}</span>
              <!-- <span class="del" @click="delHomeBrand(item.id)">删除{{item.sortNum}}</span> -->
            </div>
          </transition-group>
        </draggable>
      </div>
    </el-dialog>

    <!-- 首页品牌热门品牌对话框 -->
    <el-dialog :visible.sync="isShowHotBrandListDia" title="热门品牌" @close="handleHotDiaClose">
      <div>
        <el-form :inline="true" :model="searchHotForm" class="searchForm">
          <el-form-item label>
            <el-input v-model="searchHotForm.keyword" placeholder="请输入品牌编号或品牌名称搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="query" icon="el-icon-search" @click="hotquery" size="mini">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="hotData"
          highlight-current-row
          @current-change="rowCurrentChange"
          ref="singleTableRef"
        >
          <el-table-column prop="brandCode" label="品牌编号"></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <el-image
                style="width: 120px; height: 28px;margin-top:5px"
                :src="imgBaseUrl + scope.row.brandImg"
                :preview-src-list="[imgBaseUrl + scope.row.brandImg]"
              ></el-image>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="position: static; margin-top: 20px;"
          @size-change="handleHotSizeChange"
          @current-change="handleHotCurrentChange"
          :current-page="searchHotForm.page + 1"
          :page-sizes="[10, 20, 50]"
          :page-size.sync="searchHotForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="hotTotal"
        ></el-pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="addHomeBrand">确 定</el-button>
        <el-button @click="isShowHotBrandListDia = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog
      title
      :visible.sync="imgDialogVisible"
      width="100%"
      @close="handleImgClose"
      style="margin-top:200px"
      class="imgDialog"
    >
      <div style="width:100%;text-align:center;">
        <img :src="src" alt width="300px" height="300px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseUrl from '../../api/env'
import { getStore } from 'js/store'
import axios from 'axios'
import draggable from 'vuedraggable'

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
      imgDialogVisible: false,
      src: '',
      // 对话框表单数据
      brandForm: {
        brandName: '',
        brandImg: '',
        hot: ''
      },
      brandRules: {
        brandName: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' },
          {
            pattern: /^[\u4e00-\u9fa5]{1,7}$|^[\u4e00-\u9fa5]{7}[\dA-Za-z_-]{1}$|^[\dA-Za-z_-]{1,15}$/,
            message: '只能输入15个字节(数字,字母,划线)'
          }
        ],
        brandImg: [
          { required: true, message: '品牌图片不能为空', trigger: 'blur' }
        ],
        hot: [
          { required: true, message: '品牌类型不能为空', trigger: 'change' }
        ]
      },
      uploadUrl: `${
        baseUrl[process.env.NODE_ENV].apiUrl
      }/file/upload?token=${token}`, // 图片上传地址
      isShowHomeBrandDia: false, // 控制首页品牌管理对话框
      homeBrandList: [], // 首页品牌列表
      ids: [], // 首页品牌列表id
      isShowHotBrandListDia: false, // 控制热门首页品牌对话框的显示与隐藏
      // 热门品牌搜索表单
      searchHotForm: {
        keyword: '',
        page: 0,
        size: 10
      },
      hotTotal: null, // 热门品牌总数
      hotData: [], // 热门品牌列表数据
      selectRow: {} // 热门数据
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
  components: {
    draggable
  },
  methods: {
    // 获取品牌列表
    getBrandList() {
      this.axios.get(`/api/brand`, this.searchForm).then(res => {
        if (res.code == 200) {
          this.brandData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    // 获取首页品牌列表
    getHomeBrandList() {
      this.axios
        .get(`/api/brand/showhome`, {
          page: 1,
          size: 10
        })
        .then(res => {
          if (res.code === 200) {
            console.log(res)
            this.homeBrandList = res.data.content
            // 获取首页品牌列表id
            this.ids = []
            this.homeBrandList.forEach(item => {
              this.ids.push(item.id)
            })
          }
        })
    },
    // 获取热门品牌数据
    getHotList() {
      this.axios.get(`/api/brand/hot`, this.searchHotForm).then(res => {
        if (res.code == 200) {
          this.hotData = res.data.content
          this.searchHotForm.page = res.data.number
          this.searchHotForm.size = res.data.size
          this.hotTotal = res.data.totalElements
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
      this.axios.get(`/api/brand/info`, { id: row.id }).then(res => {
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
          axios.delete(`/api/brand?id=${row.id}`).then(res => {
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
      this.axios.put(`/api/brand/sethot`, obj).then(res => {
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
            .put(`/api/brand`, {
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
          this.axios.post(`/api/brand`, this.brandForm).then(res => {
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
        let width = 216 // 限制图片尺寸为216X130
        let height = 130
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
          _this.$message.error('图片尺寸限制为216 x 130')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    // 图片预览
    handleImgClose() {
      this.src = ''
      this.imgDialogVisible = false
    },
    showImg(src) {
      this.imgDialogVisible = true
      this.src = src
    },

    /**  首页品牌管理 */

    // 获取首页品牌列表
    showHomeBrand() {
      this.isShowHomeBrandDia = true
      this.getHomeBrandList()
    },
    // 删除首页品牌
    delHomeBrand(id) {
      this.ids.splice(
        this.ids.findIndex(item => id == item),
        1
      )
      this.axios.put(`/api/brand/del/showhome?id=${id}`).then(res => {
        if (res.code === 200) {
          this.getHomeBrandList()
          // 重新排序
          this.getSortList()
        }
      })
    },
    // 显示热门品牌对话框
    showHomeAddBrand() {
      this.isShowHotBrandListDia = true
      this.getHotList()
    },
    // 排序接口
    getSortList() {
      console.log(this.ids)
      this.axios.put(`/api/brand/sortNum?ids=${this.ids}`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.getHomeBrandList()
        }
      })
    },
    // 添加首页品牌
    addHomeBrand() {
      this.axios
        .put(`/api/brand/add/showhome`, {
          id: this.selectRow.id,
          sortNum: this.homeBrandList.length + 1
        })
        .then(res => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.isShowHotBrandListDia = false
            this.getHomeBrandList() // 获取列表

            // 重新排序
            this.getSortList()
          }
        })
    },
    getdata: function(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd: function(evt) {
      console.log('拖动前的索引：' + evt.oldIndex)
      console.log('拖动后的索引：' + evt.newIndex)
      console.log(this.homeBrandList)
      // 获取首页品牌列表id
      this.ids = []
      this.homeBrandList.forEach(item => {
        this.ids.push(item.id)
      })
      this.getSortList()
    },
    // 热门品牌分页操作
    hotquery() {
      this.searchHotForm.page = 0
      this.getHotList()
    },
    rowCurrentChange(val) {
      if (!val) return
      console.log(val)
      this.selectRow = val
    },
    handleHotDiaClose() {
      // 重置操作
      this.selectRow = {} // 清空热门选中数据
      this.searchHotForm.page = 0 // 重置分页
      this.searchHotForm.keyword = ''
    },
    handleHotSizeChange(val) {
      this.searchHotForm.size = val
      this.getHotList()
    },
    handleHotCurrentChange(val) {
      this.searchHotForm.page = val
      this.getHotList()
    }
  }
}
</script>

<style>
</style>
