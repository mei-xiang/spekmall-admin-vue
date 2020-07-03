<!-- 求购订单详情 -->
<template>
  <!--  v-if="Object.keys(orderInfo).length > 0" -->
  <div class="content">
    <div class="box">
      <h2>订单详情</h2>

      <div class="info">
        <div class="item">
          <el-steps :space="200" :active="1" finish-status="success">
            <el-step title="发起求购"></el-step>
            <el-step title="卖家报价"></el-step>
            <el-step title="选择卖家提交意向"></el-step>
            <el-step title="卖家接单交易"></el-step>
          </el-steps>
          <div class="item">
            <span>订单编号 ：</span>
            <span>{{orderInfo.code}}</span>
          </div>
        </div>
        <div class="item">
          <span>求购名称：</span>
          <!-- <span style="color:#FF4400">{{orderInfo.status.text}}</span> -->
        </div>
        <div class="item">
          <span>发布时间 :</span>
          <!-- <span style="color:#FF4400">¥{{orderInfo.totalPrice}}</span> -->
        </div>
        <div class="item">
          <span>报价截止时间：</span>
          <!-- <span>{{orderInfo.createDate}}</span> -->
        </div>
        <div class="item">
          <span>采购人 :</span>
          <!-- <span>{{orderInfo.payDate}}</span> -->
        </div>
        <div class="item">
          <span>发布地点 :</span>
          <!-- <span>¥{{orderInfo.totalPriceComfirm}}</span> -->
        </div>
        <div class="item">
          <span>报价方式： :</span>
          <!-- <span>¥{{orderInfo.totalPriceComfirm}}</span> -->
        </div>
      </div>
    </div>

    <div class="box">
      <h2>产品清单</h2>
      <div class="info">
        <el-table :data="orderInfo.godvList" border stripe style="width: 800px">
          <el-table-column prop="price" label="产品名称" width="180"></el-table-column>
          <el-table-column prop="price" label="所属类别" width="180"></el-table-column>
          <el-table-column prop="num" label="规格" width="180"></el-table-column>
          <el-table-column prop="total" label="数量"></el-table-column>
          <el-table-column prop="total" label="单位"></el-table-column>
          <el-table-column prop="total" label="图片">
            <img
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              width="50px"
              height="42px"
              alt
            />
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="box">
      <h2>卖家报价</h2>
      <div class="info">
        <el-table :data="orderInfo.godvList" border stripe style="width: 800px">
          <el-table-column type="index" label="序号" width="55"></el-table-column>
          <el-table-column prop="price" label="商家名称" width="180"></el-table-column>
          <el-table-column prop="price" label="单价" width="180"></el-table-column>
          <el-table-column prop="num" label="总运费" width="180"></el-table-column>
          <el-table-column prop="total" label="报价总金额"></el-table-column>
          <el-table-column prop="total" label="操作"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      orderInfo: {}, // 店铺数据
      id: null,
      type: '' // 1自营订单详情 2电商订单详情
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.axios
        .get(`${this.baseUrl}/api/admin/goodsOrderDetails?orderId=${this.id}`)
        .then(res => {
          console.log(res)
          const data = res.data
          if (res.code == 200) {
            this.orderInfo = data
          }
        })
    }
  }
}
</script>

<style scoped>
.content {
  padding-top: 10px;
  height: 100%;
  overflow: scroll;
}
h1 {
  font-size: 22px;
  line-height: 35px;
  font-weight: 700;
}
.box {
  margin-bottom: 20px;
}
h2 {
  font-size: 18px;
  line-height: 35px;
  font-weight: 700;
}
.infoType {
  color: #cc3333;
  font-size: 14px;
  vertical-align: middle;
  margin-left: 15px;
}
.info {
  padding-left: 100px;
  position: relative;
}
.info .item {
  line-height: 35px;
}
.info .item span:first-of-type {
  display: inline-block;
  width: 100px;
}
</style>


