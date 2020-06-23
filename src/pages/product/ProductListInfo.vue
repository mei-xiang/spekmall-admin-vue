<template>
  <!-- 商品查看 -->
  <div class="content">
    <h1>
      {{ type == 1 ? "商品查看" : "商品审核"
      }}<span class="infoType">状态：已发布</span
      ><span class="infoType">状态：审核不通过 原因：信息不符合</span>
    </h1>
    <div class="box">
      <h2>
        公司基本信息
      </h2>
      <div class="info">
        <div class="item">
          <span><i class="select">*</i> 产品名称</span>
          <span>{{ productObj.title }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 产品类别</span>
          <span>{{}}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 品牌名</span>
          <span>{{ productObj.brand }}</span>
        </div>
        <div class="item">
          <span><i class="select">&nbsp;</i> 产品型号</span>
          <span>{{ productObj.model }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 生产地</span> <span>{{}}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 最小起订量</span>
          <span>{{ productObj.minimumOrderingQuantity }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 价格</span>
          <span>￥{{ productObj.price }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 单位</span>
          <span>{{ productObj.unit }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 是否主要产品</span>
          <span>{{ productObj.isMainProduct ? "是" : "否" }}</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 产品标签</span>
          <el-tag
            :key="tag"
            v-for="tag in productObj.tags"
            style="margin-right:10px"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>
        产品图片上传
      </h2>
      <div class="info">
        <div class="item">
          <el-image
            v-for="(item, index) in productObj.images"
            :key="index"
            style="width: 100px; height: 100px;margin-right:10px"
            :src="imgBaseUrl + productObj.images"
            :preview-src-list="srcList"
          >
          </el-image>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>
        产品贸易信息
      </h2>
      <div class="info">
        <div class="item">
          <span><i class="select">*</i> 商品库存</span>
          <span>10000000</span>
        </div>
        <div class="item">
          <span><i class="select">*</i> 支付方式</span>
          <el-checkbox-group v-model="payType" style="display:inline-block">
            <el-checkbox v-for="item in payType" :label="item" :key="item">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="item">
          <span><i class="select">*</i> 运输方式</span>
          <el-checkbox-group v-model="shipType" style="display:inline-block">
            <el-checkbox v-for="item in shipType" :label="item" :key="item">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="box">
      <h2>
        产品详情
      </h2>
      <div class="info">
        <div class="item">
          <span><i class="select">*</i> 产品规格</span>
          <!-- 表格区域 -->
          <el-table
            :data="productData"
            border
            style="width: 300px;display:inline-block"
          >
            <el-table-column align="center" prop="name" label="名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="parma"
              label="参数"
              width="150"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="item" style="display: flex;">
          <span style="width:150px;"><i class="select">*</i> 产品详情</span>
          <span style="flex:1"
            >产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产品简介内容产</span
          >
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
      type: null, // 查看1  审核2
      productObj: {},
      productList: ["爆品", "新品", "促销"], // 产品标签
      payType: ["支付宝", "微信支付", "银联支付"], // 支付方式
      shipType: ["空运", "海运", "快递", "公路运输", "铁路运输"], // 运输方式
      productData: [
        {
          name: "安装方式",
          parma: "固定式"
        },
        {
          name: "额定电流",
          parma: "63A"
        }
      ]
    };
  },
  created() {
    // 查看 type：1   审核 type：2
    this.type = this.$route.query.type;
    this.getProductList();
  },
  methods: {
    getProductList() {
      this.axios
        .get(`${this.baseUrl}/api/product/info`, {
          productId: this.$route.query.id
        })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.productObj = res.data;
            // for (let key in this.supperForm) {
            //   this.supperForm[key] = res.data[key];
            // }
            // this.remarks = res.data.remarks;

            // // 展示图片处理
            // const srcList = this.supperForm.businessLicense.split(",");
            // this.url = this.imgBaseUrl + srcList[0];
            // srcList.forEach(item => {
            //   this.srcList.push(this.imgBaseUrl + item);
            // });
            // console.log(this.url);
            // console.log(this.srcList);
          }
        });
    },
    // 返回
    close() {
      this.$router.push("/productList");
    },
    approvePassOrNoPass(obj, callback) {
      this.axios.put(`${this.baseUrl}/api/product/audit`, obj).then(res => {
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
              status: true
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: "success",
                  message: "审核成功!"
                });
                _this.$router.push("/productList");
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
              status: false,
              remarks: value
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: "success",
                  message: "审核成功!"
                });
                _this.$router.push("/productList");
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
  /* display: flex; */
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
