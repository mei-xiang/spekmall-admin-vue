<template>
  <!-- 供应商店铺信息 -->
  <div class="content" v-if="Object.keys(companyObj).length > 0">
    <h1>
      供应商店铺审核
      <span class="infoType" v-if="shopStatus !== 3">店铺状态：{{ shopStatusVal }}</span>
      <span class="infoType" v-if="shopStatus == 3">店铺状态：{{ shopStatusVal }} 原因：{{shopRemark}}</span>

      <span class="infoType" v-if="shopAudit == 0">提交状态：{{ '草稿' }}</span>
      <span class="infoType" v-if="shopAudit == 1">提交状态：{{ '待审核' }}</span>
      <span class="infoType" v-if="shopAudit == 2">提交状态：{{ '审核通过' }}</span>
      <span class="infoType" v-if="shopAudit == 3">提交状态：{{ '审核不通过' }} 原因：{{shopRemark}}</span>

      <!-- <span class="infoType" v-if="shopObj.supplierShopOutput.shopStatus.index !== 3">
        状态：{{
        shopObj.supplierShopOutput.shopStatus.index == 2
        ? "已审核"
        : shopObj.supplierShopOutput.shopStatus.text
        }}
      </span>
      <span class="infoType" v-if="shopObj.supplierShopOutput.shopStatus.index == 3">
        状态：{{ shopObj.supplierShopOutput.shopStatus.text }} 原因：{{
        shopObj.supplierShopOutput.remarks
        }}
      </span>-->
    </h1>
    <div class="box">
      <h2>公司基本信息</h2>
      <div class="info">
        <div class="item">
          <span>公司名称</span>
          <span>{{companyObj.name}}</span>
        </div>
        <div class="item">
          <span>统一信用代码</span>
          <span>{{companyObj.creditCode }}</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span>{{ companyObj.province}}{{ companyObj.city }}</span>
          <span>{{companyObj.address }}</span>
        </div>
        <div class="item">
          <span>行业</span>
          <span>{{companyObj.industry | formatIndustry(companyObj.industry2) }}</span>
        </div>
        <div class="item">
          <span>公司简介</span>
          <span class="companyDesc">{{companyObj.companyDesc}}</span>
        </div>
        <div class="item">
          <span>主营产品</span>
          <span>{{ companyObj.majorPorducts }}</span>
        </div>
        <div class="item">
          <span>公司成立时间</span>
          <span>{{ companyObj.establishmentDate }}</span>
        </div>
        <div class="item">
          <span>注册资金</span>
          <span>{{ companyObj.registeredCapital }}万元</span>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>公司其他信息</h2>
      <div class="info">
        <div class="item">
          <span>店铺Logo</span>
          <el-image
            style="width: 140px; height: 140px;margin-right:10px"
            v-for="(item, index) in logo"
            :key="index"
            :src="imgBaseUrl + item"
            @click.native="showImg(imgBaseUrl + item)"
          ></el-image>
          <!-- :preview-src-list="[imgBaseUrl + item]" -->
        </div>
        <div class="item">
          <span>店铺主页招牌图片</span>
          <el-image
            style="width: 140px; height: 140px;margin-right:10px"
            v-for="(item, index) in signboard"
            :key="index"
            :src="imgBaseUrl + item"
            @click.native="showImg(imgBaseUrl + item)"
          ></el-image>
          <!-- :preview-src-list="[imgBaseUrl + item]" -->
        </div>
        <div class="item" style="width:500px;display:flex">
          <span>banner</span>
          <el-carousel style="flex:1;" v-if="majorObj&&majorObj.banners">
            <el-carousel-item v-for="item in majorObj.banners" :key="item.id">
              <img :src="imgBaseUrl + item" class="image" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="item" style="width:900px;display:flex">
          <span>公司图片</span>
          <el-carousel
            :interval="4000"
            type="card"
            height="200px"
            style="flex:1;"
            v-if="majorObj&&majorObj.images"
          >
            <el-carousel-item v-for="(item, index) in majorObj.images" :key="index">
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
          <span style="min-width:150px">公司详情介绍</span>
          <span v-html="majorObj.introduction"></span>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>信息认证</h2>
      <div class="info">
        <div class="item">
          <span>信息认证标识</span>
          <span style="color:#F56C6C;position:absolute;left:90px;top:3px;">*</span>
          <el-radio
            v-model="shopValidity"
            :label="true"
            :disabled="disabled"
            style="margin-top:10px;"
          >有</el-radio>
          <el-radio
            v-model="shopValidity"
            :label="false"
            :disabled="disabled"
            style="margin-top:10px;"
          >没有</el-radio>
        </div>
      </div>
    </div>

    <!-- <el-button @click="close" v-if="type == 1">取消</el-button> -->
    <!-- type:1 查看 type:2 审核-->
    <el-button @click="approveNoPass" type="danger" v-if="type == 2" class="btn_approve">审核不通过</el-button>
    <el-button @click="approvePass" type="primary" v-if="type == 2">审核通过</el-button>

    <!-- 图片预览对话框 -->
    <el-dialog title :visible.sync="imgDialogVisible" width="100%" @close="handleClose" style="margin-top:200px">
      <div style="width:100%;text-align:center;">
        <img :src="src" alt width="300px" height="300px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from 'js/store'
let _this = null
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    _this = this
    return {
      logo: [], // 店铺Logo
      signboard: [], // 店铺主页招牌图片
      companyObj: {}, // 公司数据
      majorObj: {}, // 图片，介绍，信息认证
      shopValidity: true,
      type: null, // 查看1  审核2
      disabled: true,
      shopCategoryData: [], // 行业列表
      // 图片预览
      imgDialogVisible: false,
      src: '',

      shopAudit: null, // 二次编辑审核状态
      shopStatus: null, // 店铺状态
      shopStatusVal: null, // 店铺状态值
      shopRemark: null // 店铺不通过值
    }
  },
  created() {
    // 查看 type：1   审核 type：2
    this.type = this.$route.query.type
    if (this.type == 2) {
      this.disabled = false
    }
    this.getProductList()
  },
  filters: {
    formatIndustry(val1, val2) {
      let industrys = null
      let industrys2
      console.log(_this.shopCategoryData)
      _this.shopCategoryData.forEach(item => {
        if (item.code == val1) {
          industrys = item.name
          item.detailList.forEach(item1 => {
            if (item1.value == val2) {
              industrys2 = item1.text
            }
          })
        }
      })
      if (!industrys || !industrys2) {
        return val1
      }
      return industrys + '/' + industrys2
    }
  },
  methods: {
    getProductList() {
      this.axios
        .get(`/api/supplier/shop/${this.$route.query.id}/info`)
        .then(res => {
          console.log(res)
          const data = res.data
          if (res.code == 200) {
            if (this.type == 1) {
              this.majorObj = data.supplierShopOutput
              this.companyObj = data.supplierShopOutput.shopCompany
            }
            if (this.type == 2) {
              this.majorObj = data.shopAudit
              this.companyObj = data.shopAudit.shopCompanyAudit
            }
            this.shopValidity = this.majorObj.shopValidity
            this.shopStatus = data.supplierShopOutput.shopStatus.index // 店铺状态相关
            this.shopStatusVal = data.supplierShopOutput.shopStatus.text
            this.shopRemark = data.supplierShopOutput.remarks
            this.shopAudit = data.shopAudit && data.shopAudit.status // 提交状态

            // 图片解析
            this.logo = this.$getArrayByStr(this.majorObj.logo)
            this.signboard = this.$getArrayByStr(this.majorObj.signboard)
            // 获取所有行业类别
            setTimeout(() => {
              this.getBusinessList()
            }, 0)
          }
        })
    },
    // 获取行业分类 -------------------------------------------------------------------------
    getBusinessList() {
      this.axios.get(`/dictionary/dicAndDetail/majorBusiness2`).then(res => {
        console.log(res)
        const resData = res.data
        resData.forEach(item => {
          item.text = item.name
        })
        this.shopCategoryData = resData
      })
    },
    // 返回
    close() {
      this.$router.push('/supplierShop')
    },
    // 图片预览
    handleClose() {
      this.src = ''
      this.imgDialogVisible = false
    },
    showImg(src) {
      this.imgDialogVisible = true
      this.src = src
    },
    approvePassOrNoPass(obj, callback) {
      this.axios.post(`/api/supplier/shop/audit`, obj).then(res => {
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
              status: 'AUDIT_PASS',
              shopValidity: this.shopValidity
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
        inputPattern: /[\s\S]{1,1000}/,
        inputErrorMessage: '请输入不通过原因'
      })
        .then(({ value }) => {
          const _this = this
          this.approvePassOrNoPass(
            {
              id: this.$route.query.id,
              status: 'AUDIT_FAIL',
              remarks: value,
              shopValidity: this.shopValidity
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
  display: flex;
  margin-bottom: 10px;
  max-width: 1300px;
}
.info .item span:first-of-type {
  display: inline-block;
  width: 150px;
}
.info .companyDesc {
  width: 900px;
  /* white-space: normal; */
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
.btn_approve {
  margin-left: 500px !important;
}
</style>
