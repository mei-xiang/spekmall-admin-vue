<!-- 求购订单详情 -->
<template>
  <!--  v-if="Object.keys(orderInfo).length > 0" -->
  <div class="content">
    <!-- 不为待发货与待收货状态 type：1 -->
    <div v-if="type==1">
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
            <span>{{orderInfo.title}}</span>
          </div>
          <div class="item">
            <span>发布时间：</span>
            <span>{{orderInfo.createDate}}</span>
          </div>
          <div class="item">
            <span>报价截止时间：</span>
            <span>{{orderInfo.expireDate}}</span>
          </div>
          <div class="item">
            <span>采购人：</span>
            <span>{{orderInfo.fromUserName}}</span>
          </div>
          <div class="item">
            <span>发布地点：</span>
            <span>{{orderInfo.publishAddress}}</span>
          </div>
          <div class="item">
            <span>报价方式：</span>
            <span>{{orderInfo.totalPriceComfirm}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>产品清单</h2>
        <div class="info" v-if="orderInfo.product">
          <el-table :data="[orderInfo.product]" border stripe style="width: 800px">
            <el-table-column prop="title" label="产品名称" width="180"></el-table-column>
            <el-table-column prop="category" label="所属类别" width="180"></el-table-column>
            <el-table-column prop="model" label="规格" width="180"></el-table-column>
            <el-table-column prop="count" label="数量"></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="total" label="图片">
              <template slot-scope="scope">
                <img
                  :src="imgBaseUrl+scope.row.picture"
                  v-if="scope.row.picture"
                  width="50px"
                  height="42px"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="box" v-if="orderInfo.quotoList">
        <h2>卖家报价</h2>
        <div class="info">
          <el-table :data="orderInfo.quotoList" border stripe style="width: 800px">
            <el-table-column type="index" label="序号" width="55"></el-table-column>
            <el-table-column prop="supplierName" label="商家名称" width="180"></el-table-column>
            <el-table-column prop="price" label="单价" width="180"></el-table-column>
            <el-table-column prop="freight" label="总运费" width="180"></el-table-column>
            <el-table-column prop="total" label="报价总金额"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span
                  style="margin-left: 10px"
                  v-if="orderInfo.status"
                >{{ scope.row.confirm==true&&orderInfo.status.status==2?'已接单':'' }}{{ scope.row.confirm==true&&orderInfo.status.status==3?'已确认':'' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 待发货与待收货状态 type：2-->
    <div v-if="type==2">
      <div class="box">
        <h2>订单详情</h2>
        <div class="info">
          <div class="item">
            <span>订单编号 ：</span>
            <span>{{orderInfo.code}}</span>
          </div>
          <div class="item">
            <span>订单状态：</span>
            <span style="color:#FF4400" v-if="orderInfo.status">{{orderInfo.status.text}}</span>
          </div>
          <div class="item">
            <span>交易金额：</span>
            <span style="color:#FF4400">¥{{orderInfo.totalPrice}}</span>
          </div>
          <div class="item">
            <span>下单时间：</span>
            <span>{{orderInfo.createDate}}</span>
          </div>
          <div class="item">
            <span>付款时间：</span>
            <span>{{orderInfo.payDate}}</span>
          </div>
          <div class="item">
            <span>最后确认金额：</span>
            <span v-if="orderInfo.totalPriceComfirm">¥{{orderInfo.totalPriceComfirm}}</span>
          </div>
          <div class="item" v-if="type==1">
            <span>操作：</span>
            <el-button type="primary" @click="handleEditPrice">修改金额</el-button>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>物流信息</h2>
        <div class="info">
          <div class="item">
            <span>收货地址</span>
            <span v-if="orderInfo.addressInfo">{{orderInfo.addressInfo.address}}</span>
          </div>
          <div class="item">
            <span>运送方式</span>
            <span v-if="orderInfo.expressInfoView">{{orderInfo.expressInfoView.deliveryType}}</span>
          </div>
          <div class="item">
            <span>物流公司</span>
            <span v-if="orderInfo.expressInfoView">{{orderInfo.expressInfoView.expressCompany}}</span>
          </div>
          <div class="item">
            <span>运单号</span>
            <span v-if="orderInfo.expressInfoView">{{orderInfo.expressInfoView.expressNovar}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>买家信息</h2>
        <div class="info">
          <div class="item">
            <span>公司名称</span>
            <span>{{orderInfo.supplierName}}</span>
          </div>
          <div class="item">
            <span>姓名</span>
            <span>{{orderInfo.supplierPersionName}}</span>
          </div>
          <div class="item">
            <span>联系方式</span>
            <span>{{orderInfo.supplierMobile}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>商品明细</h2>
        <div class="info">
          <el-table :data="orderInfo.godvList" border stripe style="width: 800px">
            <el-table-column prop="date" label="商品信息" width="300" show-overflow-tooltip>
              <template slot-scope="scope">
                <img
                  :src="imgBaseUrl+scope.row.picture"
                  v-if="scope.row.picture"
                  width="50px"
                  height="42px"
                />
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="180"></el-table-column>
            <el-table-column prop="num" label="数量" width="180"></el-table-column>
            <el-table-column prop="total" label="商品小计"></el-table-column>
          </el-table>
          <div class="item">
            <span>用户备注</span>
            <span>{{orderInfo.remarks}}</span>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>发票信息</h2>
        <div class="info">
          <div class="item">
            <span>发票类型</span>
            <span v-if="orderInfo.invoice">{{orderInfo.invoice.invoiceType}}</span>
          </div>
          <div class="item">
            <span>发票抬头</span>
            <span v-if="orderInfo.invoice">{{orderInfo.invoice.invoiceTitle}}</span>
          </div>
          <div class="item">
            <span>寄送信息</span>
            <span v-if="orderInfo.addressInfo">{{orderInfo.addressInfo.address}}</span>
          </div>
        </div>
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
    if (this.type == 1) {
      this.getOrderList()
    }
    if (this.type == 2) {
      this.getOrderSendList()
    }
  },
  methods: {
    // 获取不为待发货与待收货状态数据
    getOrderList() {
      this.axios
        .get(`${this.baseUrl}/api/admin/demandOrderDetails?demandId=${this.id}`)
        .then(res => {
          console.log(res)
          const data = res.data
          if (res.code == 200) {
            this.orderInfo = data
          }
        })
    },
    // 获取待发货与待收货状态数据
    getOrderSendList() {
      this.axios
        .get(
          `${this.baseUrl}/api/admin/demandPayOrderDetails?demandId=${this.id}`
        )
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


