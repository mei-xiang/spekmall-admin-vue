<template>
  <!-- 自营订单管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="订单号：">
        <el-input v-model="searchForm.keyword" placeholder="请输入订单号搜索"></el-input>
      </el-form-item>
      <el-form-item label="买家名称：">
        <el-input v-model="searchForm.keyword" placeholder="请输入买家名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchForm.keyword" placeholder="请输入商品名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="下单时间：">
        <el-date-picker
          v-model="searchForm.dates[0]"
          type="datetime"
          placeholder="选择起始日期"
          @change="startChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dates[1]"
          type="datetime"
          placeholder="选择结束日期"
          @change="endChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs type="border-card">
      <el-tab-pane label="全部订单"></el-tab-pane>
      <el-tab-pane label="待处理(8)"></el-tab-pane>
      <el-tab-pane label="待卖家确认(0)"></el-tab-pane>
      <el-tab-pane label="待发货(0)"></el-tab-pane>
      <el-tab-pane label="待收货(0)"></el-tab-pane>
      <el-tab-pane label="已完成(0)"></el-tab-pane>
      <el-table :data="memberData" border style="width: 100%;">
        <el-table-column type="index" label="序号" fixed></el-table-column>
        <el-table-column prop="code" label="供应商编号" width="190"></el-table-column>
        <el-table-column prop="name" label="供应商名称" width="190" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
        <el-table-column prop label="地区" width="180">
          <template slot-scope="scope">
            <span>
              {{ scope.row.supplierCompanyOutput.province
              }}{{ scope.row.supplierCompanyOutput.city }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.status.text }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金牌供应商" width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.vip == 0">否</span>
            <span v-if="scope.row.vip == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="金牌时效周期" width="260">
          <template slot-scope="scope">
            <span v-if="!scope.row.vipDate || !scope.row.vipExpired"></span>
            <span v-else>
              {{
              scope.row.vipDate + " - " + scope.row.vipExpired
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="注册时间" sortablewidth="170"></el-table-column>
      </el-table>
    </el-tabs>

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
        status: '',
        token: token || '',
        vip: '',
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      memberData: [], // 列表数据
      // 设置金牌对话框数据
      isShowGlodDialog: false,
      glodForm: {
        dates: []
      },
      id: null // 当前id
    }
  },
  created() {
    this.getApplyList()
  },
  methods: {
    getApplyList() {
      this.axios
        .post(`${this.baseUrl}/api/supplier/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.memberData = res.data.content
            this.searchForm.page = res.data.number
            this.searchForm.size = res.data.size
            this.total = res.data.totalElements
          }
        })
    },
    startChange() {
      if (this.searchForm.dates.length > 0)
        this.searchForm.dates[0] = this.$timeDate(this.searchForm.dates[0])
      if (this.glodForm.dates.length > 0)
        this.glodForm.dates[0] = this.$timeDate(this.glodForm.dates[0])
    },
    endChange() {
      if (this.searchForm.dates.length > 0)
        this.searchForm.dates[1] = this.$timeDate(this.searchForm.dates[1])
      if (this.glodForm.dates.length > 0)
        this.glodForm.dates[1] = this.$timeDate(this.glodForm.dates[1])
    },
    // 查询
    query() {
      this.searchForm.page = 0
      if (
        new Date(this.searchForm.dates[0]).getTime() >
        new Date(this.searchForm.dates[1]).getTime()
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
    }
  }
}
</script>

<style>
.glodDialog .el-dialog {
  width: 600px !important;
  text-align: center;
}
.glodDialog .el-dialog__body {
  padding-left: 30px;
}
</style>

