<template>
  <!-- 供应商店铺管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入编号、手机、名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="未审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="已激活" value="AUDIT_PASS"></el-option>
          <el-option label="审核不通过" value="AUDIT_FAIL"></el-option>
          <el-option label="已停用" value="AUDIT_STOP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交审核时间：">
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

    <!-- 表格区域 -->
    <el-table :data="shopData" border style="width: 90%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="name" label="供应商编号" width="190"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机" width="190"></el-table-column>
      <el-table-column prop label="地区" width="190">
        <template slot-scope="scope">
          <span v-if="scope.row.shop.shopCompany">{{ scope.row.shop.shopCompany.province }}{{ scope.row.shop.shopCompany.city }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否金牌供应商">
        <template slot-scope="scope">
          <span v-if="scope.row.vip == 0">否</span>
          <span v-if="scope.row.vip == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.shop.shopStatus.text }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="店铺提交审核时间" width="190"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleApproval(scope.$index, scope.row)"
            v-if="scope.row.shop.shopStatus.index == 1"
          >审核</el-button>
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
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      shopData: [] // 列表数据
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    getShopList() {
      this.axios
        .get(`/api/supplier/shop/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.shopData = res.data.content
            this.searchForm.page = res.data.number
            this.searchForm.size = res.data.size
            this.total = res.data.totalElements
          }
        })
    },
    startChange() {
      this.searchForm.dates[0] = this.$timeDate(this.searchForm.dates[0])
    },
    endChange() {
      this.searchForm.dates[1] = this.$timeDate(this.searchForm.dates[1])
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
      this.getShopList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getShopList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getShopList()
    },
    // 查看
    handleDetail(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/supplierShopInfo',
        query: { id: row.id, type: 1 }
      })
    },
    // 审核
    handleApproval(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/supplierShopInfo',
        query: { id: row.id, type: 2 }
      })
    }
  }
}
</script>

<style scopde></style>
