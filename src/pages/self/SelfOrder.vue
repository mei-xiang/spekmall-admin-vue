<template>
  <!-- 自营订单管理 -->
  <div class="content order">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="订单号：">
        <el-input v-model="searchForm.code" placeholder="请输入订单号搜索"></el-input>
      </el-form-item>
      <el-form-item label="买家名称：">
        <el-input v-model="searchForm.buyer" placeholder="请输入买家名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchForm.productTitle" placeholder="请输入商品名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="下单时间：">
        <el-date-picker
          v-model="searchForm.dateStart"
          type="datetime"
          placeholder="选择起始日期"
          @change="startChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dateEnd"
          type="datetime"
          placeholder="选择结束日期"
          @change="endChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name></el-tab-pane>
      <el-tab-pane label="待处理(8)" name></el-tab-pane>
      <el-tab-pane label="待卖家确认(0)" name></el-tab-pane>
      <el-tab-pane label="待发货(0)" name></el-tab-pane>
      <el-tab-pane label="待收货(0)" name></el-tab-pane>
      <el-tab-pane label="已完成(0)" name></el-tab-pane>
      <div class="order_title">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">商品信息</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">单价</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">数量</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">总金额</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">确认金额</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">订单状态</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">操作</div>
          </el-col>
        </el-row>
      </div>
      <div class="item">
        <div class="item_hd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple code">订单编号：SO15893606901730</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light time">下单时间：2020-5-15 16:33:12</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple user">买家用户：linzehao123</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light detail">
                <el-link type="primary">订单详情</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="item_bd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple avatar">
                <el-image style="width: 50px; height: 50px" :src="url"></el-image>
                <span class="tit">Raxwell 直柄麻花钻，2mm，10支Raxwell 直柄麻花钻，2mm，10支Raxwell 直柄麻花钻，2mm，10支</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple">1</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待商家确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light handle">
                <span>修改价格</span>
                <span>取消订单</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item">
        <div class="item_hd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple code">订单编号：SO15893606901730</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light time">下单时间：2020-5-15 16:33:12</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple user">买家用户：linzehao123</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light detail">
                <el-link type="primary">订单详情</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="item_bd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple avatar">
                <el-image style="width: 50px; height: 50px" :src="url"></el-image>
                <span>Raxwell 直柄麻花钻，2mm，10支</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple">1</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待商家确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light handle">
                <span>修改价格</span>
                <span>取消订单</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="item">
        <div class="item_hd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple code">订单编号：SO15893606901730</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light time">下单时间：2020-5-15 16:33:12</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple user">买家用户：linzehao123</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light detail">
                <el-link type="primary">订单详情</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="item_bd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple avatar">
                <el-image style="width: 50px; height: 50px" :src="url"></el-image>
                <span>Raxwell 直柄麻花钻，2mm，10支</span>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple">1</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">¥17500</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light">待商家确认</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light handle">
                <span>修改价格</span>
                <span>取消订单</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
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
        code: '', // 订单编号
        buyer: '', // 买家
        productTitle: '', // 产品名称
        status: '', // 订单状态
        dateStart: '', // 起始日期
        dateEnd: '', // 结束日期
        page: 0,
        size: 20
      },
      total: null,
      orderData: [], // 订单数据
      activeName: '',
      id: null, // 当前id
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.axios
        .get(`${this.baseUrl}/api/admin/self/goodsOrderPage`, this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.orderData = res.data.content
            this.searchForm.page = res.data.number
            this.searchForm.size = res.data.size
            this.total = res.data.totalElements
          }
        })
    },
    startChange() {
      this.searchForm.dateStart = this.$timeDate(this.searchForm.dateStart)
    },
    endChange() {
      this.searchForm.dateEnd = this.$timeDate(this.searchForm.dateEnd)
    },
    // 查询
    query() {
      this.searchForm.page = 0
      if (
        new Date(this.searchForm.dateStart).getTime() >
        new Date(this.searchForm.dateEnd).getTime()
      ) {
        return this.$message.warning('起始时间不能大于结束时间！')
      }
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getOrderList()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
</style>

