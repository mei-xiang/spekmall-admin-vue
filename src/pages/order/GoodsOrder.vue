<template>
  <!-- 电商订单管理 -->
  <div class="content order">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="订单号：">
        <el-input v-model="searchForm.code" placeholder="请输入订单号搜索"></el-input>
      </el-form-item>
      <el-form-item label="买家名称：">
        <el-input v-model="searchForm.buyer" placeholder="请输入买家名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="商家名称：">
        <el-input v-model="searchForm.supplier" placeholder="请输入商家名称搜索"></el-input>
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
      <el-tab-pane :label="'待卖家确认'+'('+statusLenList[0]+')'" name="STATUS0"></el-tab-pane>
      <el-tab-pane :label="'待付款'+'('+statusLenList[1]+')'" name="STATUS1"></el-tab-pane>
      <el-tab-pane :label="'待发货'+'('+statusLenList[2]+')'" name="STATUS2"></el-tab-pane>
      <el-tab-pane :label="'待收货'+'('+statusLenList[3]+')'" name="STATUS3"></el-tab-pane>
      <el-tab-pane :label="'已完成'+'('+statusLenList[4]+')'" name="STATUS4"></el-tab-pane>
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
      <div class="item" v-for="(item1,index1) in orderData" :key="index1">
        <div class="item_hd">
          <el-row>
            <el-col :span="5">
              <div class="grid-content bg-purple code">订单编号：{{item1.code}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple-light time">下单时间：{{item1.createDate}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple user">买家用户：{{item1.buyerName}}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content bg-purple user">商家：{{item1.supplierName}}</div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content bg-purple-light detail">
                <el-link type="primary" @click="orderDetail(item1.id,item1.status.status)">订单详情</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="item_bd">
          <el-row>
            <div class="info" v-for="(item2,index2) in item1.godvList" :key="index2">
              <el-col :span="6">
                <div class="grid-content bg-purple avatar">
                  <el-image style="width: 50px; height: 50px" :src="imgBaseUrl+item2.picture"></el-image>
                  <span class="tit">{{item2.title}}</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple-light" v-if="item2.price">¥{{item2.price}}</div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">{{item2.num}}</div>
              </el-col>
              <el-col :span="3">
                <div
                  class="grid-content bg-purple-light"
                  v-if="item1.totalPrice"
                >¥{{item1.totalPrice}}</div>
              </el-col>
              <el-col :span="3">
                <!-- index2==0 表示只显示第一个列表数据 -->
                <div class="grid-content bg-purple-light sure" v-if="index2==0">
                  <!-- 状态为待确认，显示待确认，否则显示具体金额 -->
                  <span v-if="item1.status.status==0">待确认</span>
                  <span
                    v-if="item1.status.status!=0&&item1.totalPriceComfirm"
                  >¥{{item1.totalPriceComfirm}}</span>
                </div>
              </el-col>
              <el-col :span="3">
                <div
                  class="grid-content bg-purple-light statu"
                  v-if="index2==0"
                >{{item1.status.text}}</div>
              </el-col>
            </div>
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
import { setStore, getStore } from 'js/store'
import axios from 'axios'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        code: '', // 订单编号
        buyer: '', // 买家
        supplier: '', // 卖家
        productTitle: '', // 产品名称
        status: '', // 订单状态
        dateStart: '', // 起始日期
        dateEnd: '', // 结束日期
        page: 0,
        size: 20
      },
      total: null,
      orderData: [], // 订单列表数据
      statusLenList: [0, 0, 0, 0, 0], // 状态数量
      activeName: '' // 当前标签页
    }
  },
  created() {
    this.getOrderList()
    this.getOrderLenList()
  },
  methods: {
    getOrderList() {
      this.axios.get(`/api/admin/goodsOrderPage`, this.searchForm).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.orderData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    // 获取订单状态数量
    getOrderLenList() {
      const statusObj = {
        statusArr: [
          { status: 'STATUS0' },
          { status: 'STATUS1' },
          { status: 'STATUS2' },
          { status: 'STATUS3' },
          { status: 'STATUS4' }
        ],
        ...this.searchForm
      }
      this.$dataTransform(statusObj, 'statusArr')
      console.log(statusObj)
      this.axios.get(`/api/admin/goodsOrderCount`, statusObj).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.statusLenList = res.data
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
    // 标签页切换
    handleClick(tab, event) {
      let arr = []
      arr = this.activeName.split(',')
      console.log(arr)
      this.searchForm.status = arr
      if (this.activeName == 0) {
        this.searchForm.status = ''
      }
      // todo---状态数量的接口
      this.getOrderList()
    },
    // 订单详情
    orderDetail(id, status) {
      // type:1 自营订单详情  type:2 电商订单详情
      console.log(status)
      if (status == 6 || status == 7 || status == 8) {
        this.$router.push({
          path: '/orderRefund',
          query: { id: id, type: 2 }
        })
        setStore({
          name: 'orderRefund',
          content: { id: id, type: 2 }
        })
      } else {
        this.$router.push({
          path: '/orderInfo',
          query: { id: id, type: 2 }
        })
        setStore({
          name: 'orderInfo',
          content: { id: id, type: 2 }
        })
      }
    }
  }
}
</script>

<style>
</style>

