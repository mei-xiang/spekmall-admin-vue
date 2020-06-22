<template>
  <!-- 供应商店铺信息 -->
  <div class="content">
    <h1>
      供应商店铺审核<span class="infoType">状态：已审核</span
      ><span class="infoType">状态：审核不通过 原因：信息不符合</span>
    </h1>
    <div class="box">
      <h2>
        公司基本信息
      </h2>
      <div class="info">
        <div class="item">
          <span>公司名称</span> <span>深圳市思贝克集团有限公司</span>
        </div>
        <div class="item">
          <span>统一信用代码</span> <span>91320214MA1P52PP8G</span>
        </div>
        <div class="item">
          <span>地址</span>
          <span>无锡市新吴区南方不锈钢交易中心B3-41-1411</span>
        </div>
        <div class="item"><span>行业</span> <span>行业大类-行业细分</span></div>
        <div class="item">
          <span>公司简介</span>
          <span
            >深圳市思贝克集团有限公司深圳市思贝克集团有限公司深圳市思贝克集团有限公司深圳市思贝克集团有限公司</span
          >
        </div>
        <div class="item">
          <span>主营产品</span>
          <span>产品A、产品A、产品A、产品A、产品A、产品A、</span>
        </div>
        <div class="item"><span>公司成立时间</span> <span>2020-5-28</span></div>
        <div class="item"><span>注册资金</span> <span>1000万元</span></div>
      </div>
    </div>
    <div class="box">
      <h2>
        公司其他信息
      </h2>
      <div class="info">
        <div class="item">
          <span>公司Logo</span
          ><el-image style="width: 100px; height: 100px" :src="url"> </el-image>
        </div>
        <div class="item">
          <span>店铺主页招牌图片</span
          ><el-image style="width: 100px; height: 100px" :src="url"> </el-image>
        </div>
        <div class="item">
          <span>banner</span>
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
        <div class="item">
          <span>公司图片</span>
          <el-image
            style="width: 100px; height: 100px"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>
        信息认证
      </h2>
      <div class="info">
        <div class="item">
          <span>信息认证标识</span>
          <el-radio v-model="radio" label="1">有</el-radio>
          <el-radio v-model="radio" label="2">没有</el-radio>
        </div>
      </div>
    </div>

    <el-button @click="close" v-if="type == 1">取消</el-button>
    <!-- type:1 查看 type:2 审核-->
    <el-button @click="approveNoPass" type="danger" v-if="type == 2"
      >审核不通过</el-button
    >
    <el-button @click="approvePass" type="primary" v-if="type == 2"
      >审核通过</el-button
    >
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
      ],
      radio: "1",
      type: null // 查看1  审核2
    };
  },
  created() {
    // 查看 type：1   审核 type：2
    this.type = this.$route.query.type;
  },
  methods: {
        // 返回
    close() {
      this.$router.push("/supplierShop");
    },
    approvePassOrNoPass(obj, callback) {
      this.axios
        .post(`${this.baseUrl}/api/supplier/shop/audit`, obj)
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            callback && callback(res);
          }
        });
    },
    approvePass() {
      this.$confirm("审核通过确认", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const _this = this;
          this.approvePassOrNoPass(
            {
              id: this.$route.query.id,
              status: "AUDIT_PASS"
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: "success",
                  message: "审核成功!"
                });
                _this.$router.push("/supplierShop");
              }
            }
          );
        })
        .catch(() => {});
    },
    approveNoPass() {
      this.$prompt("", "审核不通过确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "请输入不通过原因",
        inputPattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,1000}$/,
        inputErrorMessage: "请输入不通过原因"
      })
        .then(({ value }) => {
          const _this = this;
          this.approvePassOrNoPass(
            {
              id: this.$route.query.id,
              status: "AUDIT_FAIL",
              remarks: value
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: "success",
                  message: "审核成功!"
                });
                _this.$router.push("/supplierShop");
              }
            }
          );
        })
        .catch(() => {});
    }
  }
};
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
