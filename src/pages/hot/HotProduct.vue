<template>
  <!-- 首页热门品类管理 -->
  <div class="content productBox">
    <template v-if="$isPermission($route.path)">
      <div v-if="!isShowCategory">暂未添加热门分类</div>
      <el-select v-model="categoryVal" placeholder="请选择分类">
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        type="button"
        class="el-button el-button--default el-button--mini"
        icon="el-icon-circle-plus-outline"
        @click="addHotCategory"
      >新增分类</el-button>
      <el-button
        type="button"
        class="el-button el-button--default el-button--mini"
        icon="el-icon-circle-plus-outline"
        @click="delHotCategory"
        v-if="isShowCategory"
      >删除分类</el-button>
      <el-button
        type="button"
        class="el-button el-button--default el-button--mini"
        icon="el-icon-circle-plus-outline"
        @click="moveUpCategory"
        v-if="isShowCategory"
      >上移</el-button>
      <el-button
        type="button"
        class="el-button el-button--default el-button--mini"
        icon="el-icon-circle-plus-outline"
        @click="moveDownCategory"
        v-if="isShowCategory"
      >下移</el-button>
      <el-button
        type="button"
        class="el-button el-button--default el-button--mini"
        icon="el-icon-circle-plus-outline"
        @click="showAddHotProduct"
        v-if="isShowCategory"
      >添加商品</el-button>
    </template>
    <div v-if="isShowCategory">
      <el-tabs v-model="activeCategory" @tab-click="handleClick">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="(item,index) in hasCategory"
          :key="index"
        >
          <el-table
            :data="productData"
            row-key="id"
            border
            style="width: 100%;"
            v-if="isResetTable"
          >
            <el-table-column type="index" label="序号" fixed></el-table-column>
            <el-table-column prop="productCode" label="产品编号" width="120"></el-table-column>
            <el-table-column prop="categoryName" label="产品类别" width="300">
              <template slot-scope="scope">
                <span>{{ scope.row.categoryName }}</span>
                <!-- <span>{{ scope.row.categoryName|formatCategory }}</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品中文名称"></el-table-column>
            <el-table-column prop="companyName" label="供应商名称"></el-table-column>
            <el-table-column label="操作" v-if="$isPermission($route.path)">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="delChildCategoryPro(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 热门商品对话框 -->
    <el-dialog :visible.sync="isShowHotProductDialog" title="热门商品" @close="handleClose">
      <div>
        <el-form :inline="true" :model="searchHotForm" class="searchForm">
          <el-form-item label>
            <el-input v-model="searchHotForm.productTitile" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label>
            <el-input v-model="searchHotForm.supplierName" placeholder="请输入供应商名称搜索"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="query" icon="el-icon-search" @click="hotquery" size="mini">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="hotData" @selection-change="handleSelectionChange" ref="multipleHotTable">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="code" label="商品编号" width="150"></el-table-column>
          <el-table-column prop="title" label="产品名" width="190" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brand" label="品牌" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" width="190" show-overflow-tooltip></el-table-column>
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
        <el-button type="primary" @click="addHotProduct">确 定</el-button>
        <el-button @click="isShowHotProductDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
import axios from 'axios'
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      categoryList: [], // 所有分类
      categoryVal: '', // 选中分类的值
      hasCategory: [], // 拥有的分类
      activeCategory: '', // 当前分类
      productData: [], // 产品数据
      firstCategoryId: null,
      categoryId: null, // 产品分类id
      // 热门类目搜索表单
      searchHotForm: {
        page: 0,
        size: 10,
        productTitile: '',
        supplierName: ''
      },
      hotTotal: null, // 热门商品总数
      hotData: [], // 热门商品列表数据
      isShowHotProductDialog: false, // 控制对话框的显示与隐藏
      multipleSelection: [], // 热门多选数据
      isResetTable: false
    }
  },
  created() {
    this.getAllCategoryList()
    this.getHasCategoryList()
  },
  computed: {
    // 是否有分类数据
    isShowCategory() {
      return this.hasCategory.length > 0 ? true : false
    }
  },
  mounted() {
    // this.rowDrop()
    this.$nextTick(() => {
      this.isResetTable = true
    })
  },
  filters: {
    formatCategory(val) {
      if (val && val.indexOf('>') != -1) {
        return val.substring(val.lastIndexOf('>') + 1)
      }
      return val
    }
  },
  methods: {
    // 获取所有分类
    getAllCategoryList() {
      this.axios.get(`/api/category/list`).then(res => {
        console.log(res)
        if (res.code == 200) {
          res.data.forEach(item => {
            this.categoryList.push({
              id: item.id,
              value: item.name,
              label: item.name
            })
          })
        }
      })
    },
    // 获取已添加的分类
    getHasCategoryList() {
      this.hasCategory = []
      this.axios.get(`/api/hotCategory/list`).then(res => {
        console.log(res)
        if (res.code == 200) {
          res.data.forEach(item => {
            this.hasCategory.push({
              id: item.id,
              value: item.name,
              label: item.name,
              categoryId: item.categoryId
            })
          })
          // 获取第一个分类的数据
          if (this.hasCategory.length > 0) {
            this.getProductById(this.hasCategory[0].categoryId)
            this.firstCategoryId = this.hasCategory[0].categoryId
            this.categoryId = this.hasCategory[0].id
          }
        }
      })
    },
    // 根据分类id获取产品数据
    getProductById(id) {
      this.axios
        .get(`/api/hotCategoryProduct/list?categoryId=${id}`)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.productData = res.data
            // this.rowDrop()
            this.$nextTick(() => {
              this.isResetTable = true
              setTimeout(() => {
                this.rowDrop()
              }, 200)
            })
          }
        })
    },
    // 添加分类
    addHotCategory() {
      if (this.categoryVal == '') return false
      this.firstCategoryId = this.categoryList.find(item => {
        return item.value == this.categoryVal
      }).id
      this.axios
        .post(`/api/hotCategory/apply`, {
          categoryId: this.firstCategoryId,
          categoryName: this.categoryVal
        })
        .then(res => {
          console.log(res)
          if (res.code == 501) {
            this.$message.warning(res.message)
          }
          if (res.code == 200) {
            this.getHasCategoryList()
          }
        })
    },
    // 删除分类
    delHotCategory() {
      console.log(this.categoryId)
      this.$confirm('是否删除此分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .del(`/api/hotCategory/delete`, {
              id: this.categoryId
            })
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success('删除成功!')
                this.getHasCategoryList()
              }
            })
        })
        .catch(() => {})
    },
    // 上移
    moveUpCategory() {
      this.axios
        .post(`/api/hotCategory/moveUp?id=${this.categoryId}`)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            const index = this.hasCategory.findIndex(item => {
              return item.id == this.categoryId
            })
            this.hasCategory.splice(index - 1, 0, this.hasCategory[index])
            this.hasCategory.splice(index + 1, 1)
            // 标签页同步
            this.activeCategory =
              this.hasCategory.findIndex(item => {
                return item.id == this.categoryId
              }) + ''
          }
        })
    },
    // 下移
    moveDownCategory() {
      this.axios
        .post(`/api/hotCategory/moveDown?id=${this.categoryId}`)
        .then(res => {
          if (res.code == 200) {
            console.log(res)
            const index = this.hasCategory.findIndex(item => {
              return item.id == this.categoryId
            })
            this.hasCategory.splice(index + 2, 0, this.hasCategory[index])
            this.hasCategory.splice(index, 1)
            // 标签页同步
            this.activeCategory =
              this.hasCategory.findIndex(item => {
                return item.id == this.categoryId
              }) + ''
          }
        })
    },
    // 显示添加商品对话框
    showAddHotProduct() {
      this.isShowHotProductDialog = true
      this.getHotList()
    },
    // 获取热门商品数据
    getHotList() {
      console.log({
        ...this.searchHotForm,
        categoryId: this.firstCategoryId
      })
      this.axios
        .get(`/api/category/products/page`, {
          ...this.searchHotForm,
          categoryId: this.firstCategoryId
        })
        .then(res => {
          if (res.code == 200) {
            console.log(res)
            this.hotData = res.data.content
            this.searchHotForm.page = res.data.number
            this.searchHotForm.size = res.data.size
            this.hotTotal = res.data.totalElements
          }
        })
    },
    handleHotSizeChange(val) {
      this.searchHotForm.size = val
      this.getHotList()
    },
    handleHotCurrentChange(val) {
      this.searchHotForm.page = val
      this.getHotList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 热门商品分页操作
    hotquery() {
      this.searchHotForm.page = 0
      this.getHotList()
    },
    handleClose() {
      // 重置操作
      this.multipleSelection = [] // 清空热门选中数据
      this.$refs.multipleHotTable.clearSelection() // 重置选中状态
      this.searchHotForm.page = 0 // 重置分页
      this.searchHotForm.productTitile = ''
      this.searchHotForm.supplierName = ''
    },
    // 添加商品
    addHotProduct() {
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.productId)
      })
      console.log({
        categoryId: this.firstCategoryId,
        productIds: ids
      })
      this.axios
        .post(
          `/api/hotCategoryProduct/apply?categoryId=${this.firstCategoryId}&productIds=${ids}`
        )
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            console.log(res)
            this.isShowHotProductDialog = false
            this.getProductById(this.firstCategoryId)
          }
          if (res.code == 500) {
            this.$message.warning(res.message)
          }
        })
    },
    // 标签页切换
    handleClick(tab, event) {
      this.isResetTable = false
      // 一级分类id
      this.categoryId = this.hasCategory[this.activeCategory - 0].id
      this.firstCategoryId = this.hasCategory[
        this.activeCategory - 0
      ].categoryId
      this.getProductById(this.firstCategoryId)
      // this.$nextTick(() => {
      //   this.rowDrop()
      // })
    },
    // 删除产品数据
    delChildCategoryPro(index, row) {
      console.log(index, row)
      this.$confirm('是否删除此商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .del(`/api/hotCategoryProduct/delete`, {
              id: row.id
            })
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message)
                this.getProductById(this.firstCategoryId)
              }
            })
        })
        .catch(() => {})
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      console.log(tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.productData.splice(oldIndex, 1)[0]
          _this.productData.splice(newIndex, 0, currRow)
          console.log(_this.productData)
          const arr = []
          _this.productData.forEach((item, index) => {
            arr.push({
              id: item.id,
              isSort: index + 1
            })
          })
          _this.axios
            .post(`/api/hotCategoryProduct/sort`, arr, {
              headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                // _this.productData = []
                _this.getProductById(_this.firstCategoryId)
              }
            })
        }
      })
    }
  }
}
</script>

<style>
.productBox {
  height: 100%;
  overflow: scroll;
}
.productBox .el-dialog {
  width: 1100px !important;
}
</style>

