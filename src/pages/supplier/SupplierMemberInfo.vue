<template>
  <!-- 供应商会员信息 -->
  <div class="content">
    <div class="box">
      <h2>
        供应商基本信息<span class="infoType">状态：已审核</span
        ><span class="infoType">状态：已停用 原因：该账号违规 </span>
      </h2>
      <div class="info">
        <div class="glod">
          <div class="glodSup">是否金牌供应商：否</div>
          <div class="glodCycle">金牌时效周期：/</div>
        </div>
        <div class="item"><span>供应商编号</span> <span>AAA01000001</span></div>
        <div class="item"><span>手机账号</span> <span>13510001000</span></div>
        <div class="item">
          <span>公司名称</span> <span>深圳市思贝克有限公司</span>
        </div>
        <div class="item"><span>主营行业</span> <span>建筑-建材</span></div>
        <div class="item">
          <span>主营产品</span>
          <span>二级类别A、二级类别A、二级类别A、二级类别A</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span>浙江省杭州市紫竹科技园上海市闵行区紫竹5路紫竹科技园</span>
        </div>
        <div class="item"><span>成立时间</span> <span>2020-5-28</span></div>
        <div class="item"><span>注册资金</span> <span>1000万元</span></div>
        <div class="item">
          <span>公司简介</span>
          <span
            >深圳市思贝克集团有限公司深圳市思贝克集团有限公司深圳市思贝克集团有限公司深圳市思贝克集团有限公司</span
          >
        </div>
        <div class="item">
          <span>店铺地址</span> <span>http://www.ispek/huaqiangbei.com/</span>
        </div>
        <div class="item"><span>固定电话</span> <span>0755 82301200</span></div>
        <div class="item"><span>联系人</span> <span>才徐坤</span></div>
        <div class="item"><span>性别</span> <span>男</span></div>
        <div class="item"><span>联系手机</span> <span>13510001000</span></div>
      </div>
    </div>
    <div class="box">
      <h2>
        企业资料信息
      </h2>
      <div class="info">
        <div class="item">
          <span>公司全称</span> <span>浙江鸿创黔富医疗器械有限公司</span>
        </div>
        <div class="item">
          <span>社会统一信用代码</span> <span>91110108MA01QC9A1X</span>
        </div>
        <div class="item">
          <span>营业执照（三证合一）</span>
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
        <div class="item">
          <span>法人代表姓名</span> <span>浙江鸿创黔富医疗器械有限公司</span>
        </div>
        <div class="item">
          <span>法人代表身份证号</span>
          <span>440301199912124221</span>
        </div>
        <div class="item">
          <span>法人代表身份证</span
          ><el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStore } from "js/store";
export default {
  data() {
    const token = getStore({ name: "access_token", type: "string" });
    return {
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ]
    };
  },
  created() {},
  methods: {}
};
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
