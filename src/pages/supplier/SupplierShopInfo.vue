<template>
  <!-- 供应商店铺信息 -->
  <div class="content" v-if="Object.keys(shopObj).length > 0">
    <h1>
      供应商店铺审核
      <span
        class="infoType"
        v-if="shopObj.shop.shopStatus.index !== 3"
      >状态：{{ shopObj.shop.shopStatus.text }}</span>
      <span class="infoType" v-if="shopObj.shop.shopStatus.index == 3">
        状态：{{ shopObj.shop.shopStatus.text }} 原因：{{
        shopObj.shop.remarks
        }}
      </span>
    </h1>
    <div class="box">
      <h2>公司基本信息</h2>
      <div class="info">
        <div class="item">
          <span>公司名称</span>
          <span>{{ shopObj.company.name }}</span>
        </div>
        <div class="item">
          <span>统一信用代码</span>
          <span>{{ shopObj.company.creditCode }}</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span>{{ shopObj.company.address }}</span>
        </div>
        <div class="item">
          <span>行业</span>
          <span>{{ shopObj.company.industry }}</span>
        </div>
        <div class="item">
          <span>公司简介</span>
          <span>{{ shopObj.company.companyDesc }}</span>
        </div>
        <div class="item">
          <span>主营产品</span>
          <span>{{ shopObj.majorPorducts }}</span>
        </div>
        <div class="item">
          <span>公司成立时间</span>
          <span>{{ shopObj.company.establishmentDate }}</span>
        </div>
        <div class="item">
          <span>注册资金</span>
          <span>{{ shopObj.company.registeredCapital }}万元</span>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>公司其他信息</h2>
      <div class="info">
        <div class="item">
          <span>店铺Logo</span>
          <el-image
            style="width: 140px; height: 140px"
            v-for="(item, index) in logo"
            :key="index"
            :src="imgBaseUrl + item"
            :preview-src-list="[imgBaseUrl + item]"
          ></el-image>
        </div>
        <div class="item">
          <span>店铺主页招牌图片</span>
          <el-image
            style="width: 140px; height: 140px"
            v-for="(item, index) in signboard"
            :key="index"
            :src="imgBaseUrl + item"
            :preview-src-list="[imgBaseUrl + item]"
          ></el-image>
        </div>
        <div class="item" style="width:500px;display:flex">
          <span>banner</span>
          <el-carousel style="flex:1;">
            <el-carousel-item v-for="item in shopObj.shop.banners" :key="item.id">
              <img :src="imgBaseUrl + item.src" class="image" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="item" style="width:900px;display:flex">
          <span>店铺图片</span>
          <el-carousel :interval="4000" type="card" height="200px" style="flex:1;">
            <el-carousel-item v-for="(item, index) in shopObj.shop.images" :key="index">
              <img :src="imgBaseUrl + item" class="image" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>公司介绍</h2>
      <div class="info">
        <div class="item">
          <span>公司详情介绍</span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>信息认证</h2>
      <div class="info">
        <div class="item">
          <span>信息认证标识</span>
          <el-radio v-model="radio" :label="true">有</el-radio>
          <el-radio v-model="radio" :label="false">没有</el-radio>
        </div>
      </div>
    </div>

    <el-button @click="close" v-if="type == 1">取消</el-button>
    <!-- type:1 查看 type:2 审核-->
    <el-button @click="approveNoPass" type="danger" v-if="type == 2">审核不通过</el-button>
    <el-button @click="approvePass" type="primary" v-if="type == 2">审核通过</el-button>
  </div>
</template>

<script>
import { getStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      logo: [], // 店铺Logo
      signboard: [], // 店铺主页招牌图片
      shopObj: {}, // 店铺数据
      radio: true,
      type: null // 查看1  审核2
    }
  },
  created() {
    // 查看 type：1   审核 type：2
    this.type = this.$route.query.type
    this.getProductList()
  },
  methods: {
    getProductList() {
      this.axios
        .get(`${this.baseUrl}/api/supplier/shop/${this.$route.query.id}/info`)
        .then(res => {
          console.log(res)
          const data = res.data.data
          if (res.code == 200) {
            this.shopObj = data
            this.radio = data.company.validity

            // 图片解析
            this.logo = this.$getArrayByStr(data.shop.logo)
            this.signboard = this.$getArrayByStr(data.shop.signboard)
          }
        })
    },
    // 返回
    close() {
      this.$router.push('/supplierShop')
    },
    approvePassOrNoPass(obj, callback) {
      this.axios
        .post(`${this.baseUrl}/api/supplier/shop/audit`, obj)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            callback && callback(res)
          }
        })
    },
    approvePass() {
      this.$confirm('审核通过确认', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const _this = this
          this.approvePassOrNoPass(
            {
              id: this.$route.query.id,
              status: 'AUDIT_PASS'
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.$router.push('/supplierShop')
              }
            }
          )
        })
        .catch(() => {})
    },
    approveNoPass() {
      this.$prompt('', '审核不通过确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入不通过原因',
        inputPattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,1000}$/,
        inputErrorMessage: '请输入不通过原因'
      })
        .then(({ value }) => {
          const _this = this
          this.approvePassOrNoPass(
            {
              id: this.$route.query.id,
              status: 'AUDIT_FAIL',
              remarks: value
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.$router.push('/supplierShop')
              }
            }
          )
        })
        .catch(() => {})
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
  width: 150px;
}
.glod {
  position: absolute;
  top: 33px;
  left: 500px;
}
.glodSup,
.glodCycle {
  font-size: 22px;
  color: #cc3333;
  font-weight: 500;
  line-height: 35px;
}
span,
img {
  vertical-align: top;
}
</style>
