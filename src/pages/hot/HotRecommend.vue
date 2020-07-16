<template>
  <!-- 热门推荐管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入产品名称、供应商名称、供应商编号搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="showHotProduct"
        >添加热门商品</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="showHomeBrand"
        >首页热门管理</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="recommendData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="产品编号" width="150"></el-table-column>
      <el-table-column prop="categoryName" label="产品类别" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
          <!-- <span>{{ scope.row.categoryName|formatCategory }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="title" label="产品中文名称" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="价格" width="120"></el-table-column>
      <el-table-column
        prop="supplierOutput.supplierCompanyOutput.name"
        label="供应商名称"
        width="190"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="supplierOutput.code" label="供应商编号" width="150"></el-table-column>
      <el-table-column prop="showBegin" label="成为热门推荐时间" width="150"></el-table-column>
      <el-table-column label="是否首页展示" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.showIndex == true ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="150"></el-table-column>

      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

    <!-- 热门商品对话框 -->
    <el-dialog :visible.sync="isShowHotProductDialog" title="热门商品" @close="handleClose">
      <div>
        <el-form :inline="true" :model="searchHotForm" class="searchForm">
          <el-form-item label>
            <el-input v-model="searchHotForm.keyword" placeholder="请输入产品名称、供应商名称搜索"></el-input>
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
          <el-table-column
            prop="supplierOutput.supplierCompanyOutput.name"
            label="供应商名称"
            width="190"
            show-overflow-tooltip
          ></el-table-column>
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

    <!-- 首页热门管理对话框 -->
    <el-dialog :visible.sync="isShowHomeBrandDialog" title="热门管理" class="hotHomeBox">
      <div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <!-- todo---拖拽 -->
          <span>拖拽排列顺序</span>
          <el-button
            type="button"
            class="el-button el-button--default el-button--mini"
            icon="el-icon-circle-plus-outline"
            @click="showHomeProduct"
          >添加商品</el-button>
        </div>

        <el-table :data="homeData" row-key="id" ref="homeTable">
          <el-table-column type="index" label="序号" fixed></el-table-column>
          <el-table-column prop="code" label="产品编号" width="150"></el-table-column>
          <el-table-column prop="categoryName" label="产品类别" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName }}</span>
              <!-- <span>{{ scope.row.categoryName|formatCategory }}</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="title" label="产品中文名称" width="175" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="supplierOutput.supplierCompanyOutput.name"
            label="供应商名称"
            width="175"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="createDate" label="首页展示时效周期" width="150"></el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleHomeDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 首页展示时效周期对话框 -->
    <el-dialog
      title="填写首页展示时效周期"
      :visible.sync="isShowHomeDialog"
      @close="handleCloseHome"
      class="glodDialog"
    >
      <el-form :model="homeShowForm">
        <el-form-item label>
          <el-col :span="11">
            <el-date-picker
              v-model="homeShowForm.effectDate[0]"
              type="datetime"
              placeholder="选择起始日期"
              @change="startChange"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="homeShowForm.effectDate[1]"
              type="datetime"
              placeholder="选择结束日期"
              @change="endChange"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowHomeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleHome">确 定</el-button>
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
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        isHot: true,
        showIndex: false,
        page: 0,
        size: 20
      },
      // 热门商品搜索表单
      searchHotForm: {
        keyword: '',
        isHot: false,
        showIndex: false,
        page: 0,
        size: 10
      },
      // 首页热门搜索表单
      searchHomeForm: {
        keyword: '',
        isHot: true,
        showIndex: true,
        page: 0,
        size: 10
      },
      total: null,
      hotTotal: null, // 热门商品总数
      recommendData: [], // 列表数据
      hotData: [], // 热门商品列表数据
      homeData: [], // 首页热门列表数据
      type: '', // 添加热门/首页
      isShowHotProductDialog: false, // 控制对话框的显示与隐藏
      isShowHomeBrandDialog: false, // 控制首页品牌管理对话框
      multipleSelection: [], // 热门多选数据
      // 首页展示时效周期
      isShowHomeDialog: false,
      homeShowForm: {
        effectDate: []
      }
    }
  },
  created() {
    this.getRecommentList() // 获取热门商品数据
  },
  mounted() {},
  filters: {
    formatCategory(val) {
      if (val && val.indexOf('>') != -1) {
        return val.substring(val.lastIndexOf('>') + 1)
      }
      return val
    }
  },
  methods: {
    getRecommentList() {
      this.axios.get(`/hot/product`, this.searchForm).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.recommendData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    // 获取热门商品数据
    getHotList() {
      this.axios.get(`/hot/product`, this.searchHotForm).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.hotData = res.data.content
          this.searchHotForm.page = res.data.number
          this.searchHotForm.size = res.data.size
          this.hotTotal = res.data.totalElements
        }
      })
    },
    // 获取首页首页展示数据
    getHomeList() {
      this.axios.get(`/hot/product`, this.searchHomeForm).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.homeData = res.data.content
          this.searchHomeForm.page = res.data.number
          this.searchHomeForm.size = res.data.size
          this.rowDrop()
        }
      })
    },
    // 查询
    query() {
      this.searchForm.page = 0
      this.getRecommentList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getRecommentList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getRecommentList()
    },
    // 显示热门商品对话框
    showHotProduct() {
      this.type = 'hot'
      this.isShowHotProductDialog = true
      this.getHotList()
    },
    // 显示热门管理对话框
    showHomeBrand() {
      this.type = 'home'
      this.isShowHomeBrandDialog = true
      this.getHomeList()
    },
    // 删除
    handleDel(index, row) {
      console.log(row)
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .post(`/hot/product/isHot?ids=${[row.id]}&isHot=false`)
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getRecommentList()
            })
        })
        .catch(() => {})
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
      this.searchHotForm.isHot = false
      this.searchHotForm.showIndex = false
      this.type = ''
      this.searchHotForm.keyword = ''
      this.searchHomeForm.keyword = ''
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
    addHotProduct() {
      if (this.type == 'hot') {
        const ids = []
        this.multipleSelection.forEach(item => {
          ids.push(item.id)
        })
        axios.post(`/hot/product/isHot?ids=${ids}&isHot=true`).then(res => {
          console.log(res)
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.isShowHotProductDialog = false
            this.getRecommentList()
          }
          if (res.code == 500) {
            this.$message.success(res.message)
          }
        })
      }
      if (this.type == 'home') {
        this.isShowHomeDialog = true
      }
    },

    // 首页热门删除
    handleHomeDel(index, row) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .post(`/hot/product/showIndex?ids=${row.id}&showIndex=false`)
            .then(res => {
              console.log(res)
              if (res.data.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getHomeList()
              }
            })
        })
        .catch(() => {})
    },
    showHomeProduct() {
      this.isShowHotProductDialog = true
      this.searchHotForm.isHot = true
      this.searchHotForm.showIndex = false
      this.getHotList()
    },
    // 首页展示起始时间
    startChange() {
      this.homeShowForm.effectDate[0] = this.$timeDate(
        this.homeShowForm.effectDate[0]
      )
    },
    endChange() {
      this.homeShowForm.effectDate[1] = this.$timeDate(
        this.homeShowForm.effectDate[1]
      )
    },
    // 首页展示
    handleHome() {
      if (!this.homeShowForm.effectDate[0] && !this.homeShowForm.effectDate[0])
        return false
      if (new Date(this.homeShowForm.effectDate[1]).getTime() < +new Date()) {
        return this.$message.warning('结束时间不能小于当前时间')
      }
      if (new Date(this.homeShowForm.effectDate[0]).getTime() > +new Date()) {
        return this.$message.warning('起始时间不能大于当前时间')
      }
      if (
        new Date(this.homeShowForm.effectDate[0]).getTime() >
        new Date(this.homeShowForm.effectDate[1]).getTime()
      ) {
        return this.$message.warning('起始时间不能大于结束时间！')
      }
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.id)
      })
      axios
        .post(
          `/hot/product/showIndex?ids=${ids}&showIndex=true&effectDate=${this.homeShowForm.effectDate}`
        )
        .then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.$message.success('添加成功!')
            this.isShowHomeDialog = false
            this.isShowHotProductDialog = false
            this.getHomeList()
          }
          if (res.data.code == 500) {
            this.$message.warning(res.data.message)
            this.isShowHomeDialog = false
            this.isShowHotProductDialog = false
            this.getHomeList()
          }
        })
    },
    // 首页展示对话框关闭数据清除
    handleCloseHome() {
      this.homeShowForm.effectDate = []
      this.id = null
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(
        '.hotHomeBox .el-table__body-wrapper tbody'
      )
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.homeData.splice(oldIndex, 1)[0]
          _this.homeData.splice(newIndex, 0, currRow)
          console.log(_this.homeData)
          const arr = []
          _this.homeData.forEach((item, index) => {
            arr.push(item.id)
          })
          _this.axios.put(`/hot/product/showSort?ids=${arr}`).then(res => {
            if (res.code == 200) {
              _this.getHomeList()
            }
          })
        }
      })
    }
  }
}
</script>

<style scopde>
.content {
  height: 100%;
  overflow: scroll;
}
.el-dialog {
  width: 1100px !important;
}
.glodDialog .el-dialog {
  width: 600px !important;
  text-align: center;
}
.glodDialog .el-dialog__body {
  padding-left: 30px;
}
</style>
