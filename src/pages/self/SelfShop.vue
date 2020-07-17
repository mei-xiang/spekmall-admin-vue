<template>
  <!-- 自营店铺管理 -->
  <div class="content">
    <!-- 表格区域 -->
    <div v-if="!isOwnShop">
      <span>您的店铺暂未开通</span>
      <el-button class="query" @click="publish" size="mini">店铺发布</el-button>
    </div>
    <el-table :data="selfData" border style="width: 1249px;" v-if="isOwnShop">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column label="店铺名称" width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.supplierCompanyOutput.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="店铺成立时间" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商类型" width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.selfSupport?'自营':'非自营' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺状态" width="190">
        <template slot-scope="scope">
          <span
            v-if="scope.row.supplierShopOutput"
          >{{scope.row.supplierShopOutput.shopStatus.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交状态" width="190">
        <template slot-scope="scope" v-if="scope.row.shopAudit">
          <span>{{scope.row.shopAudit.status==0?'草稿':'' }}</span>
          <span>{{scope.row.shopAudit.status==1?'待审核':'' }}</span>
          <span>{{scope.row.shopAudit.status==2?'审核通过':'' }}</span>
          <span>{{scope.row.shopAudit.status==3?'审核不通过':'' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierShopOutput.remarks" label="信息" width="190"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { setStore } from 'js/store'
export default {
  data() {
    return {
      selfData: [], // 列表数据
      isOwnShop: true
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    getShopList() {
      this.axios.post(`/api/supplier/self/search`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.selfData = res.data.content
          if (res.data.content.length > 0) {
            this.isOwnShop = true
          } else {
            this.isOwnShop = false
          }
        }
      })
    },
    // 查看
    handleDetail(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/selfShopInfo',
        query: { id: row.id, type: 1 }
      })
      setStore({
        name: 'selfShopInfo',
        content: { id: row.id, type: 1 }
      })
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/selfShopInfo',
        query: { id: row.id, type: 2 }
      })
      setStore({
        name: 'selfShopInfo',
        content: { id: row.id, type: 2 }
      })
    },
    // 发布店铺
    publish() {
      this.$router.push({
        path: '/selfShopInfo',
        query: { type: 3 }
      })
      setStore({
        name: 'selfShopInfo',
        content: { type: 3 }
      })
    }
  }
}
</script>

<style scopde></style>
