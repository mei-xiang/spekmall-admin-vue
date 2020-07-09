<template>
  <!-- 买家会员管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入会员编码、手机搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="已启用" value="ENABLED"></el-option>
          <el-option label="已停用" value="DISABLED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期：">
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
    <el-table :data="buyerData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="会员编码" width="150"></el-table-column>
      <el-table-column prop="telephone" label="手机" width="150"></el-table-column>
      <el-table-column prop="company" label="公司名称" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column label="地区" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope" v-if="scope.row.account">
          <span v-if="scope.row.account.status.status == 0">已激活</span>
          <span v-if="scope.row.account.status.status == 1">已停用</span>
        </template>.status
      </el-table-column>
      <el-table-column prop="registerDate" label="注册时间" sortable></el-table-column>
      <el-table-column prop="loginDate" label="最后登录时间"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <!-- v-if="scope.row.status == 0" -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 0"
            @click="handleStop(scope.$index, scope.row)"
          >停用</el-button>
          <!--  v-if="scope.row.status == 0" -->
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 0"
            @click="handleStart(scope.$index, scope.row)"
          >启用</el-button>
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
      <el-form :model="lookBuyerForm" ref="lookBuyerRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="姓名">
          <el-input v-model="lookBuyerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="lookBuyerForm.telephone"></el-input>
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
      buyerData: [],
      isShowDialog: false,
      // 对话框数据
      lookBuyerForm: {}
    }
  },
  created() {
    this.getBuyerList()
  },
  methods: {
    getBuyerList() {
      this.axios
        .get(`/api/buyer/search`, this.searchForm)
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
      this.getBuyerList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getBuyerList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getBuyerList()
    },
    handleDetail(index, row) {
      console.log(index, row)
      this.isShowDialog = true
      this.axios.get(`/api/buyer/${row.id}/info`).then(res => {
        console.log(res)
        if (res.code != 200) return
        this.lookBuyerForm = res.data
      })
    },
    // 禁用
    handleStop(index, row) {
      this.$confirm('确认是否禁用该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(`/api/buyer/disable`, {
              id: row.id,
              token: this.$token
            })
            .then(res => {
              console.log('aaa')
              if (res.code != 200) return
              this.$message({
                type: 'success',
                message: '禁用成功!'
              })
              this.getBuyerList()
            })
        })
        .catch(() => {})
    },
    // 启用
    handleStart(index, row) {
      console.log(row)
      this.$confirm('确认是否启用该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(`/api/buyer/enable`, {
              id: row.id,
              token: this.$token
            })
            .then(res => {
              if (res.code != 500) return
              console.log('aaa')
              this.$message({
                type: 'success',
                message: '启用成功!'
              })
              this.getBuyerList()
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style scopde></style>
