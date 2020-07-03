<template>
  <!-- 我的消息 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="已启用" value="ENABLED"></el-option>
          <el-option label="已停用" value="DISABLED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="myMsgData" border style="width: 100%;">
      <!-- <el-table-column type="index" label="序号" fixed></el-table-column> -->
      <el-table-column prop="code" label="消息分类" width="150"></el-table-column>
      <el-table-column prop="telephone" label="内容详情" width="150"></el-table-column>
      <el-table-column prop="registerDate" label="时间" sortable></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
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
        status: '',
        page: 0,
        size: 20
      },
      total: null,
      myMsgData: [],
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
        .get(`${this.baseUrl}/api/buyer/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.myMsgData = res.data.content
            this.searchForm.page = res.data.number
            this.searchForm.size = res.data.size
            this.total = res.data.totalElements
          }
        })
    },

    // 查询
    query() {
      this.searchForm.page = 0
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
      this.axios.get(`${this.baseUrl}/api/buyer/${row.id}/info`).then(res => {
        console.log(res)
        if (res.code != 200) return
        this.lookBuyerForm = res.data
      })
    }
  }
}
</script>

<style scopde></style>

