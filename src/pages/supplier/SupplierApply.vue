<template>
  <!-- 供应商申请管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入手机帐号、名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <!-- [AUDIT_PROCESS,未审核, 1],[AUDIT_PASS,已激活, 2],[AUDIT_FAIL,审核不通过, 3],[AUDIT_STOP,已停用, 4]; -->
          <el-option label="未审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="已激活" value="AUDIT_PASS"></el-option>
          <el-option label="审核不通过" value="AUDIT_FAIL"></el-option>
          <el-option label="已停用" value="AUDIT_STOP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间：">
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
      <!-- todo---用户来源字段后台未提供 -->
      <el-form-item label="备注：">
        <el-select v-model="searchForm.source" placeholder>
          <el-option label="全部" value></el-option>
          <el-option label="运营新增" value="OPERATE_ADD"></el-option>
          <el-option label="用户新增" value="USER_ADD"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
        <el-button
          type="button"
          class="el-button el-button--default el-button--mini"
          icon="el-icon-circle-plus-outline"
          @click="addSupplier"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="buyerData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="company" label="供应商名称" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="username" label="手机" width="150"></el-table-column>
      <el-table-column prop="legalPersonName" label="法人" width="190"></el-table-column>
      <el-table-column label="营业执照" width="190">
        <template slot-scope="scope">
          <el-image
            style="width: 170px; height: 28px;margin-top:5px"
            :src="scope.row.businessLicense | imgFormat"
            :preview-src-list="scope.row.businessLicense | imgFormatList"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间" sortable></el-table-column>
      <el-table-column prop="source" label="用户来源"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status&&scope.row.status.index !== 1"
            @click="handleDetail(scope.$index, scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status&&scope.row.status.index == 1"
            @click="handleApproval(scope.$index, scope.row)"
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

    <!-- 查看对话框 -->
    <el-dialog :visible.sync="isShowDialog" title="查看">
      <el-form
        :model="lookBuyerForm"
        ref="lookBuyerRef"
        label-width="100px"
        class="demo-ruleForm"
        center
      >
        <el-form-item label="姓名">
          <el-input v-model="lookBuyerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="lookBuyerForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="lookBuyerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="lookBuyerForm.address"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="lookBuyerForm.company"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="isShowDialog = false">确 定</el-button>
        <el-button @click="isShowDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
import axios from 'axios'
let _this
export default {
  data() {
    _this = this
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        status: '',
        token: token || '',
        source: '',
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      buyerData: [], // 列表数据
      isShowDialog: false,
      // 对话框数据
      lookBuyerForm: {},
      // 列表图片展示
      url: '',
      srcList: []
    }
  },
  created() {
    this.getApplyList()
  },
  filters: {
    imgFormat(urlStr) {
      if (!urlStr) urlStr = ''
      const srcList = urlStr.split(',')
      return _this.imgBaseUrl + srcList[0]
    },
    imgFormatList(urlStr) {
      if (!urlStr) urlStr = ''
      const srcList = urlStr.split(',')
      const arr = []
      srcList.forEach(item => {
        arr.push(_this.imgBaseUrl + item)
      })
      return arr
    }
  },
  methods: {
    // /api/supplier/register/search
    getApplyList() {
      this.axios
        .post(`/api/supplier/register/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.buyerData = res.data.content
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
    // 添加供应商
    addSupplier() {
      this.$router.push({ path: '/supperApplyInfo', query: { type: 3 } })
    },
    handleDetail(index, row) {
      console.log(index, row)
      // 查看 type：1   审核 type：2   新增 type：3
      this.$router.push({
        path: '/supperApplyInfo',
        query: { id: row.id, type: 1 }
      })
    },
    // 审核
    handleApproval(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/supperApplyInfo',
        query: { id: row.id, type: 2 }
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
