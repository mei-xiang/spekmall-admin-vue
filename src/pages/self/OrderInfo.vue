<template>
  <div class="content" v-if="Object.keys(orderInfo).length > 0">
    <div class="box">
      <h2>订单详情</h2>
      <div class="info">
        <div class="item">
          <span>订单编号 ：</span>
          <span>{{orderInfo.code}}</span>
        </div>
        <div class="item">
          <span>订单状态：</span>
          <span style="color:#FF4400">{{orderInfo.status.text}}</span>
        </div>
        <div class="item">
          <span>交易金额：</span>
          <span style="color:#FF4400" v-if="orderInfo.totalPrice">¥{{orderInfo.totalPrice}}</span>
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
          <template v-if="orderInfo.status">
            <span v-if="orderInfo.status.status==0">操作：</span>
            <el-button
              type="primary"
              @click="handleEditPrice"
              v-if="orderInfo.status.status==0"
            >修改金额</el-button>
          </template>
          <template v-if="orderInfo.status">
            <span v-if="orderInfo.status.status==2">操作：</span>
            <el-button
              type="primary"
              @click="handlePostInfo"
              v-if="orderInfo.status.status==2"
            >填写物流信息</el-button>
          </template>
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
          <span
            v-if="orderInfo.expressInfoView"
          >{{orderInfo.expressInfoView.deliveryType|handleDelivery}}</span>
        </div>
        <div class="item">
          <span>物流公司</span>
          <span
            v-if="orderInfo.expressInfoView"
          >{{orderInfo.expressInfoView.expressCompany|handleexpressCom}}</span>
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
          <span v-if="orderInfo.addressInfo">{{orderInfo.addressInfo.address}}</span>
        </div>
      </div>
    </div>

    <!-- 物流信息对话框 -->
    <el-dialog :visible.sync="isShowPostDialog" title="物流信息" @close="handleDiaClose">
      <el-form
        :model="orderForm"
        ref="orderInfoRef"
        :rules="orderRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="物流方式：" prop="deliveryType">
          <el-select v-model="orderForm.deliveryType" placeholder="请选择">
            <el-option
              v-for="item in deliveryType"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司：" prop="expressCompany">
          <el-select v-model="orderForm.expressCompany" placeholder="请选择">
            <el-option
              v-for="item in expressCompany"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输单号：" prop="expressNovar">
          <el-input v-model="orderForm.expressNovar"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="addPostInfo">确 定</el-button>
        <el-button @click="isShowPostDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
let _this
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    _this = this
    return {
      orderInfo: {}, // 店铺数据
      id: null,
      type: '', // 1自营订单详情 2电商订单详情
      deliveryType: [], // 物流方式列表
      expressCompany: [], // 物流公司列表
      // 物流信息
      orderForm: {
        deliveryType: '',
        expressCompany: '',
        expressNovar: ''
      },
      isShowPostDialog: false, // 物流信息对话框显示于隐藏
      // 物流信息校验规则
      orderRules: {
        deliveryType: [
          { required: true, message: '请选择物流方式', trigger: 'change' }
        ],
        expressCompany: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        expressNovar: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ]
      },
      deliveryType: [], // 物流方式列表
      expressCompany: [] // 物流公司列表
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getOrderList()
    // 获取物流方式
    this.axios
      .get(`/dictionary/detail/child/transportationType`)
      .then(res => {
        if (res.code === 200) {
          this.deliveryType = res.data
        }
      })
      .catch(err => {})
    // 获取公司列表
    this.axios
      .get(`/dictionary/detail/child/logistics`)
      .then(res => {
        if (res.code === 200) {
          this.expressCompany = res.data
        }
      })
      .catch(err => {})
  },
  mounted() {
    this.axios
      .get(`/dictionary/detail/child/transportationType`)
      .then(res => {
        if (res.code === 200) {
          this.deliveryType = res.data
        }
      })
    this.axios
      .get(`/dictionary/detail/child/logistics`)
      .then(res => {
        if (res.code === 200) {
          this.expressCompany = res.data
        }
      })
  },
  filters: {
    handleDelivery(val) {
      return _this.deliveryType.find(item => item.value == val).text
    },
    handleexpressCom(val) {
      return _this.expressCompany.find(item => item.value == val).text
    }
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
          }
        })
    },
    // 修改价格
    handleEditPrice() {
      this.$prompt('修改订单价格：', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9.]+$/,
        inputErrorMessage: '请输入订单价格'
      }).then(({ value }) => {
        this.axios
          .put(`/api/admin/update/totalPrice`, {
            orderId: this.id,
            totalPrice: value
          })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.orderInfo.totalPrice = value
            }
          })
      })
    },
    handlePostInfo() {
      this.isShowPostDialog = true
    },
    // 添加物流信息
    addPostInfo() {
      this.$refs.orderInfoRef.validate(valid => {
        if (!valid) return false
        this.axios
          .put(`/api/admin/add/express`, {
            ...this.orderForm,
            orderId: this.id
          })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.isShowPostDialog = false
              // this.getOrderList()
              this.$router.push('/selfOrder')
            }
          })
      })
    },
    // 物流信息对话框关闭数据重置
    handleDiaClose() {
      for (let key in this.orderForm) {
        this.orderForm[key] = ''
      }
      this.$refs.orderInfoRef.resetFields()
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
</style>
