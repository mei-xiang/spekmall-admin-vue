<!--
 * @Description: 首页
 -->

<template>
  <div class="content" v-if="Object.keys(cordObj).length>0">
    <div class="check">
      <div class="noorder">
        <p>{{cordObj.propNotNum}}</p>
        <p>
          自营未处理订单
          <i class="iconfont iconmoren question"></i>
        </p>
      </div>
      <div class="auditcheck">
        <p>{{cordObj.supNotAuditNum}}</p>
        <p>商家入驻待审核</p>
      </div>
      <div class="storecheck">
        <p>{{cordObj.shopNotAuditNum}}</p>
        <p>店铺待审核</p>
      </div>
      <div class="procheck">
        <p>{{cordObj.prodNotAuditNum}}</p>
        <p>商品待审核</p>
      </div>
    </div>
    <div class="number_box">
      <div class="turnover">
        <p>￥{{cordObj.tdDealMoneyNum}}</p>
        <p>今日交易额</p>
      </div>
      <div class="number">
        <div class="item">
          <p>{{cordObj.tdUv}}</p>
          <p>今日访客数(VU)</p>
        </div>
        <div class="item">
          <p>{{cordObj.tdAddOrderNum}}</p>
          <p>今日新增订单量</p>
        </div>
        <div class="item">
          <p>{{cordObj.tdPv}}</p>
          <p>今日浏览量(PV)</p>
        </div>
        <div class="item">
          <p>{{cordObj.tdAddWbuyNum}}</p>
          <p>
            今日新增求购量
            <i class="iconfont iconmoren question"></i>
          </p>
        </div>
      </div>
    </div>
    <div class="check register">
      <div class="noorder">
        <p>{{cordObj.tdBuyerNum}}</p>
        <p>买家今日新增注册</p>
      </div>
      <div class="auditcheck">
        <p>{{cordObj.buyerNum}}</p>
        <p>买家注册总数</p>
      </div>
      <div class="storecheck">
        <p>{{cordObj.tdSupNum}}</p>
        <p>商家今日新增注册</p>
      </div>
      <div class="procheck">
        <p>{{cordObj.supNum}}</p>
        <p>商家入驻总数</p>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  data() {
    return {
      // 主要数据 --------------------------
      cordObj: {}
    }
  },
  methods: {
    // 获取主数据
    getMainData() {
      this.axios.get(`${this.baseUrl}/public/home`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.cordObj = res.data
        }
      })
    },
    clickCard(fn, url) {
      if (fn) {
        this.fn()
      }
      if (url) {
        this.$router.push(url)
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'userInfo'])
  },
  mounted() {
    this.getMainData()
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  font-family: 'Impact';
  background-color: #f0f2f6;
  overflow: scroll;
}
/* .openSidebar .content {
  padding-left: 0px !important;
}
.hideSidebar .content {
  padding-left: 30px !important;
} */
.check {
  display: flex;
}
.check > div {
  flex: 1;
  height: 225px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  background-image: url('../../assets/images/round_rect_bg.png');
  background-repeat: no-repeat;
  background-position: left bottom;
  margin-right: 19.5px;
}
.noorder {
  background-color: #f5484c;
}
.auditcheck {
  background-color: #d29420;
}
.storecheck {
  background-color: #0bc23f;
}
.procheck {
  background-color: #2f8de1;
}
.check > div p {
  color: #fff;
}
.check > div p:first-child {
  font-family: 'Impact';
  font-size: 40px;
  line-height: 48px;
  margin-top: 68px;
}
.check > div p:last-child {
  font-family: 'PingFangSC-Semibold';
  font-size: 20px;
  line-height: 28px;
  margin-top: 14px;
}
.question {
  margin-left: 5px;
  cursor: pointer;
}
.number_box {
  display: flex;
  height: 470px;
  margin: 19.5px 0;
  text-align: center;
}
.turnover,
.number {
  flex: 1;
  margin-right: 19.5px;
}
.turnover,
.number {
  background: url('../../assets/images/turnover_bg.png') no-repeat left
    bottom/contain;
  border-radius: 10px;
  background-color: #fff;
}
.turnover p:first-child,
.number p:first-child {
  font-size: 80px;
  color: #1989fa;
  line-height: 84px;
  margin-top: 147px;
}
.number p:first-child {
  font-size: 40px;
  line-height: 48px;
  margin-top: 0;
}
.turnover p:last-child,
.number p:last-child {
  font-family: 'PingFangSC-Semibold';
  font-size: 40px;
  color: #47494b;
  line-height: 56px;
  margin-top: 20px;
}
.number p:last-child {
  font-size: 20px;
  color: #47494b;
}
.number {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.number .item {
  background-color: #fff;
  border-radius: 10px;
  width: calc((100%-19.5px) / 2);
  width: -moz-calc((100%-19.5px)/2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.number .item:nth-child(1) {
  /* padding-right: 7px;
  box-sizing: border-box; */
}
.register > div {
  background-color: #fff;
}
.register > div p:first-of-type {
  color: #1989fa;
}
.register > div p:last-of-type {
  font-family: 'PingFangSC-Regular';
  color: #47494b;
}
</style>
