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
      <el-tab-pane :label="'待处理'+'('+statusLenList[0]+')'" name="STATUS0,STATUS2,STATUS6"></el-tab-pane>
      <el-tab-pane :label="'待卖家确认'+'('+statusLenList[1]+')'" name="STATUS0"></el-tab-pane>
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
            <div class="grid-content bg-purple">确认金额</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light">订单状态</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">操作</div>
          </el-col>
        </el-row>
      </div>
      <div class="item" v-for="(item1,index1) in orderData" :key="index1">
        <div class="item_hd">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple code">订单编号：{{item1.code}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light time">下单时间：{{item1.createDate}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple user">买家用户：{{item1.buyerName}}</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple-light detail">
                <el-link type="primary" @click="orderDetail(item1.id)">订单详情</el-link>
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
                <div class="grid-content bg-purple-light">¥{{item2.price}}</div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple">{{item2.num}}</div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content bg-purple-light">¥{{item1.totalPrice}}</div>
              </el-col>
              <el-col :span="3">
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
              <el-col :span="3">
                <!-- index2==0 表示只显示第一个列表数据 -->
                <div class="grid-content bg-purple-light handle" v-if="index2==0">
                  <span @click="handleEditPrice(item1.id)" v-if="item1.status.status==0">修改价格</span>
                  <span @click="handleClose(item1.id)" v-if="item1.status.status==0">取消订单</span>
                  <span @click="handlePost(item1.id)" v-if="item1.status.status==2">填写物流信息</span>
                  <span @click="handleRefund(item1.id)" v-if="item1.status.status==6">
                    <span style="display:block">退款确认</span>
                    <span style="display:block;color:#999;transform:translateX(-13px)">请在48小时内处理</span>
                  </span>
                </div>
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

    <!-- 物流信息对话框 -->
    <el-dialog :visible.sync="isShowPostDialog" title="物流信息">
      <el-form
        :model="postForm"
        ref="postRef"
        :rules="postRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="物流方式：" prop="deliveryType">
          <el-select v-model="postForm.deliveryType" placeholder="请选择">
            <el-option
              v-for="item in deliveryType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司：" prop="expressCompany">
          <el-select v-model="postForm.expressCompany" placeholder="请选择">
            <el-option
              v-for="item in expressCompany"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运输单号：" prop="expressNovar">
          <el-input v-model="postForm.expressNovar"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="addPost">确 定</el-button>
        <el-button @click="isShowPostDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
import axios from 'axios'
import Qs from 'qs'
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
      orderData: [], // 订单列表数据
      statusLenList: [0, 0, 0, 0, 0], // 状态数量
      activeName: '', // 当前标签页
      id: null, // 当前id
      isShowPostDialog: false, // 物流信息对话框显示于隐藏
      // 物流信息
      postForm: {
        deliveryType: '',
        expressCompany: '',
        expressNovar: ''
      },
      // 物流信息校验规则
      postRules: {
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
    this.getOrderList()
    this.getOrderLenList()
  },
  methods: {
    // 获取订单列表数据
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
    // 获取订单状态数量
    getOrderLenList() {
      const statusObj = {
        statusArr: [
          { status: 'STATUS0,STATUS2,STATUS6' },
          { status: 'STATUS0' },
          { status: 'STATUS2' },
          { status: 'STATUS3' },
          { status: 'STATUS4' }
        ],
        ...this.searchForm
      }
      this.$dataTransform(statusObj, 'statusArr')
      console.log(statusObj)
      this.axios
        .get(`${this.baseUrl}/api/admin/self/goodsOrderCount`, statusObj)
        .then(res => {
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
      this.getOrderLenList()
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
      // 处理第一个
      if (this.activeName == 0) {
        this.searchForm.status = ''
      }
      this.getOrderList()
    },
    // 订单详情
    orderDetail(id) {
      // type:1 自营订单详情  type:2 电商订单详情
      this.$router.push({ path: '/selfOrderInfo', query: { id: id, type: 1 } })
    },
    // 修改价格
    handleEditPrice(id) {
      this.$prompt('修改订单价格：', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9.]+$/,
        inputErrorMessage: '请输入订单价格'
      })
        .then(({ value }) => {
          this.axios
            .put(`${this.baseUrl}/api/admin/update/totalPrice`, {
              orderId: id,
              totalPrice: value
            })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.getOrderList()
              }
            })
        })
        .catch(() => {})
    },
    // 取消订单
    handleClose(id) {
      this.$confirm('是否取消订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .put(`${this.baseUrl}/api/admin/cancel`, {
              orderId: id
            })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '取消订单成功'
                })
                this.getOrderList()
              }
            })
        })
        .catch(() => {})
    },
    // 显示物流信息对话框
    handlePost(id) {
      this.isShowPostDialog = true
      this.id = id
    },
    // 添加物流信息
    addPost() {
      this.axios
        .put(`${this.baseUrl}/api/admin/add/express`, {
          ...this.postForm,
          orderId: this.id
        })
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getOrderList()
          }
        })
    },
    // 退款确认
    handleRefund(id) {
      this.$router.push({ path: '/selfOrderRefund', query: { id: id } })
    }
  }
}
</script>

<style>
</style>

