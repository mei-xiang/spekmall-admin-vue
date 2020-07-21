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
          <el-option label="待审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="已审核" value="AUDIT_PASS"></el-option>
          <el-option label="审核不通过" value="AUDIT_FAIL"></el-option>
          <!-- <el-option label="已停用" value="AUDIT_STOP"></el-option> -->
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
    <el-table :data="shopData" border>
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="供应商编号" width="170"></el-table-column>
      <el-table-column label="供应商名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="scope.row.supplierShopOutput&&scope.row.supplierShopOutput.shopCompany"
          >{{ scope.row.supplierShopOutput.shopCompany.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机" width="220"></el-table-column>
      <el-table-column prop label="地区" width="220">
        <template slot-scope="scope">
          <span
            v-if="scope.row.supplierShopOutput&&scope.row.supplierShopOutput.shopCompany"
          >{{ scope.row.supplierShopOutput.shopCompany.province }}{{ scope.row.supplierShopOutput.shopCompany.city }}</span>
          <!-- <span
             v-if="scope.row.company&&scope.row.company.companyLinkMan"
          >{{ scope.row.company.companyLinkMan.province }} {{ scope.row.company.companyLinkMan.city }}</span>-->
          <!-- <span
            v-if="scope.row.shop.shopCompany"
          >{{ scope.row.shop.shopCompany.provinceId|formatProvince }} {{ scope.row.shop.shopCompany.cityId|formatCity(scope.row.shop.shopCompany.provinceId) }}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否金牌供应商" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.vip == 0">否</span>
          <span v-if="scope.row.vip == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="150">
        <template
          slot-scope="scope"
          v-if="scope.row.supplierShopOutput&&scope.row.supplierShopOutput.shopStatus"
        >
          <span v-if="scope.row.supplierShopOutput.shopStatus.index==1">待审核</span>
          <span v-if="scope.row.supplierShopOutput.shopStatus.index==2">已审核</span>
          <span v-if="scope.row.supplierShopOutput.shopStatus.index==3">审核不通过</span>
        </template>
      </el-table-column>
      <el-table-column label="提交状态" width="120">
        <template slot-scope="scope" v-if="scope.row.shopAudit">
          <span>{{scope.row.shopAudit.status==0?'草稿':'' }}</span>
          <span>{{scope.row.shopAudit.status==1?'待审核':'' }}</span>
          <span>{{scope.row.shopAudit.status==2?'审核通过':'' }}</span>
          <span>{{scope.row.shopAudit.status==3?'审核不通过':'' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="店铺提交审核时间">
        <template
          slot-scope="scope"
          v-if="scope.row.shopAudit&&scope.row.shopAudit.submitAuditDate"
        >
          <span>{{ scope.row.shopAudit.submitAuditDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <template v-if="scope.row.shopAudit">
            <el-button
              size="mini"
              type="text"
              @click="handleApproval(scope.$index, scope.row)"
              v-if="scope.row.shopAudit.status==1"
            >审核</el-button>
          </template>
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
import { setStore, getStore } from 'js/store'
import axios from 'axios'
let _this
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    _this = this
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
      shopData: [], // 列表数据
      provinces: [], // 省份列表
      cities: [] // 城市列表,
    }
  },
  created() {
    this.getShopList()
    this.getProvinces() // 获取省份列表
  },
  filters: {
    formatProvince(val) {
      if (!val) return val
      let province = _this.provinces.find(item => item.id == val)
      if (province) {
        return province.label
      } else {
        return val
      }
    },
    formatCity(val) {
      if (!val) return val
      // let city = _this.cities.find(item => item.id == val)
      // if (city) {
      //   return city.name
      // } else {
      //   return val
      // }
      // return city.name || val
      return val
    }
  },
  methods: {
    getShopList() {
      this.axios.get(`/api/supplier/shop/search`, this.searchForm).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.shopData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },

    // 获取所有省份
    getProvinces() {
      this.axios.get(`/public/address/provinces`).then(res => {
        console.log(res)
        res.data.forEach(item => {
          this.provinces.push({
            label: item.name,
            value: item.name,
            id: item.id
          })
        })
      })
    },
    // 根据省份编码获取所有市
    getCitiesById(provinceId) {
      this.cities = []
      this.axios
        .get(`/public/address/cities/provinces?provincesid=${provinceId}`)
        .then(res => {
          console.log(res)
          res.data.forEach(item => {
            this.cities.push({
              label: item.name,
              value: item.name,
              id: item.id
            })
          })
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
      setStore({
        name: 'supplierShopInfo',
        content: { id: row.id, type: 1 }
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
