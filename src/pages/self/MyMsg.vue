<template>
  <!-- 我的消息 -->
  <div class="content">
    <!-- 搜索区域 -->
    <h1>
      我的消息
      <span>（</span>
      <span style="color:#FF0052">{{noReadTotal}}</span>
      <span>封未读）</span>
    </h1>
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="状态：">
        <el-select v-model="searchForm.classify" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="订单消息" value="1"></el-option>
          <el-option label="系统消息" value="2"></el-option>
          <el-option label="询盘消息" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="myMsgData" border style="width: 100%;">
      <!-- <el-table-column type="index" label="序号" fixed></el-table-column> -->
      <el-table-column prop="classify" label="消息分类" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.classify==1">订单消息</span>
          <span v-if="scope.row.classify==2">系统消息</span>
          <span v-if="scope.row.classify==3">询盘消息</span>
        </template>
      </el-table-column>
      <el-table-column label="内容详情" prop="content" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{font_weight: scope.row.isRead==0?true:false}">{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="时间" width="220"></el-table-column>
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
    <el-dialog :visible.sync="isShowDialog" title="查看" @close="handleClose">
      <div class="contentDia">
        <p v-html="content"></p>
      </div>
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
        classify: '',
        page: 0,
        size: 20
      },
      total: null,
      myMsgData: [],
      isShowDialog: false,
      content: '',
      id: null,
      noReadTotal: 0, // 未读总数
      isRead: null
    }
  },
  created() {
    this.getMsgList()
  },
  methods: {
    getMsgList() {
      this.axios.get(`/api/message/myMessage`, this.searchForm).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.myMsgData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements

          this.noReadTotal = this.myMsgData.filter(
            item => item.isRead == 0
          ).length
          this.$store.commit('SET_NOREADTOTAL', this.noReadTotal)
        }
      })
    },

    // 查询
    query() {
      this.searchForm.page = 0
      this.getMsgList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getMsgList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getMsgList()
    },
    handleDetail(index, row) {
      console.log(index, row)
      this.id = row.id
      this.isShowDialog = true
      this.content = row.content
    },
    handleClose() {
      this.axios.put(`/api/message/read/${this.id}`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.getMsgList()
        }
      })
    }
  }
}
</script>

<style scopde>
.el-dialog {
  width: 900px !important;
}
.contentDia {
}
.font_weight {
  font-weight: 900;
}
</style>
