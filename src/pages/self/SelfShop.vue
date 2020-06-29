<template>
  <!-- 自营店铺管理 -->
  <div class="content">
    <!-- 表格区域 -->
    <el-table :data="shopData" border style="width: 90%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="name" label="店铺名称" width="190"></el-table-column>
      <el-table-column prop="name" label="店铺成立时间" width="190" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="供应商类型" width="190"></el-table-column>
      <el-table-column label="店铺状态" width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.shop.shopStatus.text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="信息" width="190"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="scope.row.shop.shopStatus.ndex == 1"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      shopData: [] // 列表数据
    }
  },
  created() {
    this.getShopList()
  },
  methods: {
    getShopList() {
      this.axios
        .get(`${this.baseUrl}/api/supplier/shop/search`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.shopData = res.data.content
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
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row)
      this.$router.push({
        path: '/selfShopInfo',
        query: { id: row.id, type: 2 }
      })
    }
  }
}
</script>

<style scopde></style>
