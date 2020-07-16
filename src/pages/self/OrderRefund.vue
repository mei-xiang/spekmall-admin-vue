<template>
  <!-- 订单详情-退款操作 -->
  <div class="content" v-if="Object.keys(orderInfo).length > 0">
    <div class="box">
      <h2>订单详情-退款操作</h2>
      <div class="info">
        <div class="item">
          <span>订单编号 ：</span>
          <span>{{orderInfo.code}}</span>
        </div>
        <div class="item">
          <span>订单状态：</span>
          <span>{{orderInfo.status.text}}</span>
        </div>
        <div class="item">
          <span>交易金额：</span>
          <span v-if="orderInfo.totalPrice">¥{{orderInfo.totalPrice}}</span>
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
          <span
            style="color:#FF4400"
            v-if="orderInfo.totalPriceComfirm"
          >¥{{orderInfo.totalPriceComfirm}}</span>
        </div>
        <div class="item">
          <span>退款原因：</span>
          <span v-if="orderInfo.orView">{{orderInfo.orView.refundReason}}</span>
        </div>
        <div class="item">
          <span>退款金额：</span>
          <span
            style="color:#FF4400"
            v-if="orderInfo.orView&&orderInfo.orView.refundPrice"
          >¥{{orderInfo.orView.refundPrice}}</span>
        </div>
        <div class="item">
          <span>退款说明：</span>
          <span v-if="orderInfo.orView">{{orderInfo.orView.refundRemark}}</span>
        </div>
        <div class="item">
          <span>申请时间：</span>
          <span v-if="orderInfo.orView">{{orderInfo.orView.createDate}}</span>
        </div>
        <div class="item">
          <span>退款进度：</span>
          <span style="color:#FF4400" v-if="orderInfo.orView">{{orderInfo.orView.status.text}}</span>
        </div>
        <!-- 自营订单可以操作，并且是退款中状态 -->
        <!-- &&orderInfo.orView&&orderInfo.orView.status.status==1 -->
        <div class="item" v-if="type==1&&orderInfo.orView&&orderInfo.orView.status.status==1">
          <span>退款操作：</span>
          <el-radio v-model="status" label="STATUS7" @change="changeOrviewSta">同意退款</el-radio>
          <el-radio v-model="status" label="STATUS8" @change="changeOrviewSta">拒绝退款</el-radio>
          <span style="color:#FF4400">请在{{hours}}:{{minutes}}:{{seconds}}内完成操作</span>
        </div>
        <div class="item" v-if="isShowInput">
          <span>说明：</span>
          <el-input v-model="refuseReason" placeholder="请输入内容" class="explain"></el-input>
        </div>
        <!-- 自营订单/电商订单 退款成功和失败的说明 -->
        <div class="item" v-if="orderInfo.orView&&orderInfo.orView.status.status!=1">
          <span>说明：</span>
          <span v-if="orderInfo.orView.refundRemark">{{orderInfo.orView.refundRemark}}</span>
        </div>
        <!-- 自营订单可以操作，并且是退款中状态 -->
        <div class="item" v-if="type==1&&orderInfo.orView&&orderInfo.orView.status.status==1">
          <span>操作：</span>
          <el-button type="primary" @click="refund">确认提交</el-button>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>物流信息</h2>
      <div class="info">
        <div class="item">
          <span>收货地址</span>
          <span
            v-if="orderInfo.addressInfo"
          >{{orderInfo.addressInfo.province}}&nbsp;{{orderInfo.addressInfo.city}}&nbsp;{{orderInfo.addressInfo.area}}&nbsp;{{orderInfo.addressInfo.address}}</span>
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
          <span>{{orderInfo.buyerName}}</span>
        </div>
        <div class="item">
          <span>姓名</span>
          <span>{{orderInfo.buyerPersionName}}</span>
        </div>
        <div class="item">
          <span>联系方式</span>
          <span>{{orderInfo.buyerMobile}}</span>
        </div>
      </div>
    </div>
    <!-- 电商订单详情展示卖家信息 -->
    <div class="box" v-if="type==2">
      <h2>商家信息</h2>
      <div class="info">
        <div class="item">
          <span>商家</span>
          <span>{{orderInfo.supplierNamebuyerName}}</span>
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
              <img :src="imgBaseUrl+scope.row.picture" alt width="50px" height="42px" />
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
          <span
            v-if="orderInfo.invoiceAddressInfo"
          >{{orderInfo.invoiceAddressInfo.province}}&nbsp;{{orderInfo.invoiceAddressInfo.city}}&nbsp;{{orderInfo.invoiceAddressInfo.area}}&nbsp;{{orderInfo.invoiceAddressInfo.address}}</span>
        </div>
      </div>
    </div>

    <!-- <el-button @click="close">取消</el-button> -->
  </div>
</template>

<script>
import { getStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      orderInfo: {}, // 店铺数据
      status: '',
      type: '', // 1自营订单详情 2电商订单详情
      refuseReason: '',
      isShowInput: false, // 是否显示拒绝输入框
      id: null,
      type: '', // 1自营订单详情 2电商订单详情
      hours: '', // 时
      minutes: '', //分
      seconds: '', // 秒
      _interval: null
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getOrderList()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.countdown()
    // })
  },
  methods: {
    getOrderList() {
      this.axios
        .get(`/api/admin/goodsOrderDetails?orderId=${this.id}`)
        .then(res => {
          console.log(res)
          const data = res.data
          if (res.code == 200) {
            this.orderInfo = data
            if (data.orView) {
              this.refuseReason = data.orView.refuseReason
            }
            this.countdown()
          }
        })
    },
    changeOrviewSta(val) {
      console.log(val)
      // 同意退款
      if (val === 'STATUS8') {
        this.isShowInput = true
      } else {
        this.isShowInput = false
      }
    },
    // 时间倒计时
    countdown() {
      const _this = this
      if (this.orderInfo.orView) {
        let endTime =
          new Date(this.orderInfo.orView.createDate).getTime() +
          2 * 24 * 60 * 60 * 1000
        // let startTime = new Date(this.orderInfo.orView.createDate).getTime()
        let startTime = new Date().getTime()
        let time = (endTime - startTime) / 1000 // 获取天、时、分、秒
        let hours = ''
        let minutes = ''
        let seconds = ''
        _this._interval = setInterval(function() {
          if (time <= 0) {
            clearInterval(_this._interval)
            _this.hours = '00'
            _this.minutes = '00'
            _this.seconds = '00'
            // 自动退款成功
            // this.$router.go(0)
            this.$router.push('/selfOrder')
          }
          let hours = parseInt((time % (60 * 60 * 48)) / 3600)
          let minutes = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
          let seconds = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)

          _this.hours = hours > 9 ? hours : '0' + hours
          _this.minutes = minutes > 9 ? minutes : '0' + minutes
          _this.seconds = seconds > 9 ? seconds : '0' + seconds
          // console.log(_this.hours, _this.minutes, _this.seconds)
          time--
        }, 1000)
      } else {
        _this.hours = '00'
        _this.minutes = '00'
        _this.seconds = '00'
      }
    },
    // 退款
    refund() {
      this.axios
        .put(`/api/admin/refund`, {
          orderId: this.id,
          status: this.status,
          refuseReason: this.refuseReason
        })
        .then(res => {
          if (res.code == 200) {
            this.$router.push('/selfOrder')
          }
        })
    },
    // 返回
    close() {
      this.$router.push('/selfOrder')
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
span,
img {
  vertical-align: top;
}
.explain.el-input {
  width: 350px;
}
</style>
