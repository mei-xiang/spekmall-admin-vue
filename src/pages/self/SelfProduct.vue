<template>
  <!-- 自营商品管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="产品类别：">
        <el-cascader
          ref="selfProductRef"
          key="selfProduct"
          :options="categoryData"
          v-model="searchForm.categoryId"
          @change="categoryChange($event)"
          :props="setCategory()"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="草稿" value="AS_DRAFT"></el-option>
          <el-option label="待审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="已发布" value="UPER_SHELF"></el-option>
          <el-option label="已下架" value="LOWER_SHELF"></el-option>
          <el-option label="审核不通过" value="AUDIT_UNPASS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="addProduct"
        >发布新产品</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="productData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column label="产品状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status && scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="产品编号" width="150"></el-table-column>
      <el-table-column prop="categoryName" label="产品类别（末级）">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName|formatCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="产品中文名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="价格" width="150"></el-table-column>
      <el-table-column label="是否主要产品" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.hot">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpDate" label="最后发布日期" width="150"></el-table-column>
      <el-table-column prop="lastModifyDate" label="最后编辑日期" width="150"></el-table-column>
      <el-table-column label="管理产品" width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.status.status==0">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleApproval(scope.$index, scope.row)">提交审核</el-button>
          </div>
          <div v-if="scope.row.status.status==1">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </div>
          <div v-if="scope.row.status.status==2">
            <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleLower(scope.$index, scope.row)">下架</el-button>
          </div>
          <div v-if="scope.row.status.status==3">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </div>
          <div v-if="scope.row.status.status==4">
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="handleApproval(scope.$index, scope.row)">提交审核</el-button>
          </div>
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

    <!-- type:1 查看 type:2 编辑 type:3 新增-->
    <el-button @click="save" type="primary" v-if="type == 2||type == 3">保存为草稿</el-button>
    <el-button @click="approve" type="primary" v-if="type == 2||type == 3">添加审核</el-button>
  </div>
</template>

<script>
import { getStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        categoryId: '',
        status: '',
        page: 0,
        size: 20
      },
      total: null,
      productData: [], // 列表数据
      categoryData: [], // 产品类别列表
      id: null, // 当前数据id
      type: '' // 查看 type：1   编辑 type：2   新增 type：3
    }
  },
  created() {
    this.getSelfProductList()
    this.getCategoryList()
  },
  filters: {
    formatCategory(val) {
      if (val&&val.indexOf('>') != -1) {
        return val.substring(val.lastIndexOf('>') + 1)
      }
      return val
    }
  },
  methods: {
    getSelfProductList() {
      this.axios.get(`/api/product/self/search`, this.searchForm).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.productData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    // 查询
    query() {
      this.searchForm.page = 0
      this.getSelfProductList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getSelfProductList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getSelfProductList()
    },
    // 获取产品类别
    getCategoryList() {
      this.axios.get(`/api/category/list`).then(res => {
        console.log(res)
        const resData = res.data

        if (resData) {
          // 递归让后台获取的不规范数据规范
          // （childrens中无数据剔除，否则层级菜单组件最后一层为空无法选中）
          const parse = array => {
            array.map(item => {
              if (Array.isArray(item.childrens)) {
                if (item.childrens.length === 0) {
                  delete item.childrens
                } else {
                  parse(item.childrens)
                }
              } else {
                delete item.childrens
              }
            })
          }
          parse(resData)
        }
        this.categoryData = resData
      })
    },
    // 分类 -------------------------------------------------------------------------
    categoryChange(arr) {
      // const node = this.$refs.selfProductRef.getCheckedNodes()
      // this.$emit('categoryChange', arr, node)
      if (arr.length > 0) {
        this.searchForm.categoryId = arr[arr.length - 1]
      }
    },
    setCategory(checkStrictly) {
      return {
        value: 'id',
        children: 'childrens',
        label: 'name',
        checkStrictly: false
      }
    },

    // 发布新产品
    addProduct() {
      this.$router.push({
        path: '/selfProductInfo',
        query: { type: 3 }
      })
    },
    // 查看
    handleDetail(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/selfProductInfo',
        query: { id: row.id, type: 1 }
      })
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/selfProductInfo',
        query: { id: row.id, type: 2 }
      })
    },
    // 下架
    handleLower(index, row) {
      console.log(index, row)
      this.$confirm('是否确认下架？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .put(`/api/product/self/lower`, {
              productId: row.id
            })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '下架成功'
                })
                this.getSelfProductList()
              }
            })
        })
        .catch(() => {})
    },
    // 删除
    handleDel(index, row) {
      console.log(index, row)
      this.$confirm('是否确认删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .del(`/api/product/self/del`, {
              productId: row.id
            })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.getSelfProductList()
              }
            })
        })
        .catch(() => {})
    },
    // 提交审核
    handleApproval(index, row) {
      console.log(index, row)
      this.axios
        .put(`/api/product/self/toAudit`, {
          productId: row.id
        })
        .then(res => {
          if (res.code === 200) {
            this.$confirm(
              '提交成功，平台将在您提交的工作时间2小时内完成审核，敬请留意通知',
              '',
              {
                type: 'warning'
              }
            )
              .then(() => {})
              .catch(() => {})
            this.getSelfProductList()
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
</style>
