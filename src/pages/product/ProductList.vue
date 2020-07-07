<template>
  <!-- 商品管理列表 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入产品名称、供应商名称、编号搜索"></el-input>
      </el-form-item>
      <el-form-item label="产品类别：">
        <el-cascader
          key="productList"
          ref="productListRef"
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
          <el-option label="已发布" value="UPER_SHELF"></el-option>
          <el-option label="已下架" value="LOWER_SHELF"></el-option>
          <el-option label="待审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="审核不通过" value="AUDIT_UNPASS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
          v-model="searchForm.publishDate[0]"
          type="datetime"
          placeholder="选择起始日期"
          @change="startChange"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchForm.publishDate[1]"
          type="datetime"
          placeholder="选择结束日期"
          @change="endChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="productData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="产品编号" width="120"></el-table-column>
      <el-table-column prop="categoryName" label="产品类别（末级）" width="300"></el-table-column>
      <el-table-column prop="title" label="产品中文名称" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="价格" width="130"></el-table-column>
      <el-table-column prop="supplierOutput.name" label="供应商名称" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="是否主要产品" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.hot">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="是否猜你喜欢" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.like">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpDate" label="最后发布日期" width="133"></el-table-column>
      <el-table-column prop="lastModifyDate" label="最后编辑日期" width="133"></el-table-column>
      <el-table-column label="产品状态" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.status && scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理产品">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleApproval(scope.$index, scope.row)"
            v-if="scope.row.status && scope.row.status.status == 1"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleLookApproval(scope.$index, scope.row)"
            v-if="scope.row.status && scope.row.status.status == 1"
          >查看审核</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleSetLike(scope.$index, scope.row)"
            v-if="
              scope.row.status &&
                scope.row.status.status == 2 &&
                !scope.row.like
            "
          >设置猜你喜欢</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleCloseLike(scope.$index, scope.row)"
            v-if="
              scope.row.status && scope.row.status.status == 2 && scope.row.like
            "
          >取消猜你喜欢</el-button>
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

    <!-- 审核对话框 -->
    <el-dialog
      title="产品审核"
      :visible.sync="isShowApprovalDialog"
      @close="handleCloseApproval"
      class="approvalDialog"
    >
      <el-button @click="approveNoPass" type="danger">审核不通过</el-button>
      <el-button @click="approvePass" type="primary">审核通过</el-button>
    </el-dialog>
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
        token: token || '',
        page: 0,
        size: 20,
        publishDate: [] // 起止时间
      },
      total: null,
      productData: [], // 列表数据
      categoryData: [], // 产品类别列表
      // 审核对话框数据
      isShowApprovalDialog: false,
      id: null // 当前数据id
    }
  },
  created() {
    this.getApplyList()
    this.getCategoryList()
  },
  methods: {
    getApplyList() {
      this.axios
        .get(`/api/product/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.productData = res.data.content
            this.searchForm.page = res.data.number
            this.searchForm.size = res.data.size
            this.total = res.data.totalElements
          }
        })
    },
    startChange() {
      this.searchForm.publishDate[0] = this.$timeDate(
        this.searchForm.publishDate[0]
      )
    },
    endChange() {
      this.searchForm.publishDate[1] = this.$timeDate(
        this.searchForm.publishDate[1]
      )
    },
    // 查询
    query() {
      this.searchForm.page = 0
      if (
        new Date(this.searchForm.publishDate[0]).getTime() >
        new Date(this.searchForm.publishDate[1]).getTime()
      ) {
        return this.$message.warning('起始时间不能大于结束时间！')
      }
      this.getApplyList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getApplyList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getApplyList()
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
      // const node = this.$refs.productListRef.getCheckedNodes()
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

    handleDetail(index, row) {
      console.log(index, row)
      // 查看 type：1   审核 type：2   新增 type：3
      this.$router.push({
        path: '/productListInfo',
        query: { id: row.id, type: 1 }
      })
    },
    // 审核
    handleApproval(index, row) {
      console.log(index, row)
      this.id = row.id
      this.isShowApprovalDialog = true
    },
    // 查看审核
    handleLookApproval(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/productListInfo',
        query: { id: row.id, type: 2 }
      })
    },
    handleLike(obj, callback) {
      this.axios.put(`/api/product/like`, obj).then(res => {
        if (res.code === 200) {
          callback && callback(res)
        }
      })
    },
    // 设置猜你喜欢
    handleSetLike(index, row) {
      const _this = this
      this.handleLike(
        {
          id: row.id,
          like: true
        },
        function(res) {
          if (res.code == 200) {
            _this.getApplyList()
          }
        }
      )
    },
    // 取消猜你喜欢
    handleCloseLike(index, row) {
      const _this = this
      this.handleLike(
        {
          id: row.id,
          like: false
        },
        function(res) {
          if (res.code == 200) {
            _this.getApplyList()
          }
        }
      )
    },
    approvePassOrNoPass(obj, callback) {
      this.axios.put(`/api/product/audit`, obj).then(res => {
        console.log(res)
        if (res.code === 200) {
          callback && callback(res)
        }
      })
    },
    // 审核通过
    approvePass() {
      const _this = this
      this.$confirm('审核通过确认', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.approvePassOrNoPass(
            {
              id: _this.id,
              status: true
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.isShowApprovalDialog = false
                _this.getApplyList()
              }
            }
          )
        })
        .catch(() => {})
    },
    // 审核不通过
    approveNoPass() {
      const _this = this
      this.$prompt('', '审核不通过确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入不通过原因',
        inputPattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,1000}$/,
        inputErrorMessage: '请输入不通过原因'
      })
        .then(({ value }) => {
          _this.approvePassOrNoPass(
            {
              id: _this.id,
              status: false,
              remarks: value
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.isShowApprovalDialog = false
                _this.getApplyList()
              }
            }
          )
        })
        .catch(() => {})
    },
    // 对话框关闭
    handleCloseApproval() {
      this.id = null
    }
  }
}
</script>

<style scopde>
.content {
  height: 100%;
}
.approvalDialog .el-dialog {
  width: 500px !important;
  height: 250px !important;
  text-align: center;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.approvalDialog .el-dialog__body {
  padding-left: 30px;
}
</style>
