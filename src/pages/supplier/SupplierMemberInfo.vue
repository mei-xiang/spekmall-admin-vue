<template>
  <!-- 供应商会员信息 -->
  <div class="content" v-if="Object.keys(memberObj).length > 0">
    <div class="box">
      <h2>
        供应商基本信息
        <span
          class="infoType"
          v-if="memberObj.account&&memberObj.account.status.status !== 1"
        >状态：{{ memberObj.account.status.text }}</span>
        <span class="infoType" v-if="memberObj.account&&memberObj.account.status.status == 1">
          状态：{{ memberObj.account.status.text }} 原因：{{
          memberObj.account.remarks
          }}
        </span>
      </h2>
      <div class="info">
        <div class="glod">
          <div class="glodSup">是否金牌供应商：{{ memberObj.vip == 0 ? "否" : "是" }}</div>
          <div class="glodCycle">
            金牌时效周期：{{
            memberObj.vip == 0
            ? "/"
            : memberObj.vipDate + " ~ " + memberObj.vipExpired
            }}
          </div>
        </div>
        <div class="item">
          <span>供应商编号</span>
          <span>{{ memberObj.code }}</span>
        </div>
        <div class="item">
          <span>手机账号</span>
          <span>{{ memberObj.username }}</span>
        </div>
        <div class="item">
          <span>公司名称</span>
          <span v-if="memberObj.supplierCompanyOutput">{{ memberObj.supplierCompanyOutput.name }}</span>
        </div>
        <div class="item">
          <span>主营行业</span>
          <span
            v-if="memberObj.supplierCompanyOutput"
          >{{ memberObj.supplierCompanyOutput.industry|formatIndustry }}</span>
        </div>
        <!-- <span
          v-if="memberObj.supplierShopOutput&&memberObj.supplierShopOutput.shopCompany"
        >{{ memberObj.supplierShopOutput.shopCompany.industry|formatIndustry }}</span>-->
        <div class="item">
          <span>主营产品</span>
          <span>{{ memberObj.majorPorducts }}</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span
            v-if="memberObj.supplierCompanyOutput&&memberObj.supplierCompanyOutput.companyLinkMan"
          >{{ memberObj.supplierCompanyOutput.companyLinkMan.province }}{{ memberObj.supplierCompanyOutput.companyLinkMan.city }}{{ memberObj.supplierCompanyOutput.companyLinkMan.address }}</span>
        </div>
        <div class="item">
          <span>成立时间</span>
          <span
            v-if="memberObj.supplierShopOutput"
          >{{ memberObj.supplierShopOutput.shopCompany.establishmentDate }}</span>
        </div>
        <div class="item">
          <span>注册资金</span>
          <span
            v-if="memberObj.supplierShopOutput"
          >{{ memberObj.supplierShopOutput.shopCompany.registeredCapital }}万元</span>
        </div>
        <div class="item">
          <span>公司简介</span>
          <span
            v-if="memberObj.supplierShopOutput"
          >{{ memberObj.supplierShopOutput.shopCompany.companyDesc }}</span>
        </div>
        <div class="item">
          <span>店铺地址</span>
          <span></span>
        </div>
        <template
          v-if="
            memberObj.supplierCompanyOutput && memberObj.supplierCompanyOutput.companyLinkMan
          "
        >
          <div class="item">
            <span>固定电话</span>
            <span>{{ memberObj.supplierCompanyOutput.companyLinkMan.telephone }}</span>
          </div>
          <div class="item">
            <span>联系人</span>
            <span>{{ memberObj.supplierCompanyOutput.companyLinkMan.linkName }}</span>
          </div>
          <div class="item">
            <span>性别</span>
            <span>
              {{
              memberObj.supplierCompanyOutput.companyLinkMan.sex.index == 0
              }}
            </span>
            <span>
              {{
              memberObj.supplierCompanyOutput.companyLinkMan.sex.index == 1
              }}
            </span>
            <span>
              {{
              memberObj.supplierCompanyOutput.companyLinkMan.sex.index == 2
              }}
            </span>
          </div>
          <div class="item">
            <span>联系手机</span>
            <span>{{ memberObj.supplierCompanyOutput.companyLinkMan.mobile }}</span>
          </div>
        </template>
      </div>
    </div>
    <div class="box">
      <h2>企业资料信息</h2>
      <div class="info">
        <div class="item">
          <span>公司全称</span>
          <span v-if="memberObj.supplierCompanyOutput">{{ memberObj.supplierCompanyOutput.name }}</span>
        </div>
        <div class="item">
          <span>社会统一信用代码</span>
          <span
            v-if="memberObj.supplierCompanyOutput"
          >{{ memberObj.supplierCompanyOutput.creditCode }}</span>
        </div>
        <div class="item">
          <span>营业执照（三证合一）</span>
          <!-- 空数组的话不渲染图片，可以添加一个占位符图 -->
          <el-image
            style="width: 100px; height: 100px"
            v-for="(item, index) in businessLicense||[]"
            :key="index"
            :src="imgBaseUrl + item"
            :preview-src-list="[imgBaseUrl + item]"
          ></el-image>
        </div>
        <div class="item">
          <span>法人代表姓名</span>
          <span
            v-if="memberObj.supplierCompanyOutput"
          >{{ memberObj.supplierCompanyOutput.legalPersonName }}</span>
        </div>
        <div class="item">
          <span>法人代表身份证号</span>
          <span
            v-if="memberObj.supplierCompanyOutput"
          >{{ memberObj.supplierCompanyOutput.legalPersonCardNo }}</span>
        </div>
        <div class="item">
          <span>法人代表身份证</span>
          <!-- 空数组的话不渲染图片，可以添加一个占位符图 -->
          <el-image
            style="width: 100px; height: 100px"
            v-for="(item, index) in legalPersonCardPicture"
            :key="index"
            :src="imgBaseUrl + item"
            :preview-src-list="[imgBaseUrl + item]"
          ></el-image>
        </div>
      </div>
    </div>
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
      memberObj: '', // 会员数据对象
      businessLicense: [], // 营业执照
      legalPersonCardPicture: [], // 法人代表身份证
      shopCategoryData: [] // 行业列表
    }
  },
  created() {
    this.getProductList()
  },
  filters: {
    formatIndustry(val) {
      let industrys = null
      console.log(_this.shopCategoryData)
      _this.shopCategoryData.forEach(item => {
        if (item.value == val) {
          industrys = item.text
        }
      })
      if (!industrys) {
        return val
      }
      return industrys
    }
  },
  methods: {
    getProductList() {
      this.axios
        .get(`/api/supplier/id/info`, {
          id: this.$route.query.id
        })
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.memberObj = res.data
            if (res.data.supplierCompanyOutput) {
              this.businessLicense = this.$getArrayByStr(
                res.data.supplierCompanyOutput.businessLicense
              )
            }
            if (res.data.supplierCompanyOutput) {
              this.legalPersonCardPicture = this.$getArrayByStr(
                res.data.supplierCompanyOutput.legalPersonCardPicture
              )
            }
            // 获取所有行业类别
            setTimeout(() => {
              this.getBusinessList()
            }, 0)
          }
        })
    },
    // 获取行业分类
    getBusinessList() {
      this.axios.get(`/dictionary/detail/childs/majorBusiness`).then(res => {
        this.shopCategoryData = res.data[0].details
        console.log(this.shopCategoryData)
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
