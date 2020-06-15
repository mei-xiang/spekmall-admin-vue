<!--
 * @Description: 首页
 -->

<template>
  <el-scrollbar style="height:100%">
    <el-row :gutter="5"
            style="padding-right:15px">
      <el-col :span="24"
              :lg="24">
        <el-col class="wrap">
          <div class="card main-data">
            <h4 class="main-title">
              欢迎您，{{userInfo.nickname}}
            </h4>
            <p class="login-info">这是您第 {{userInfo.loginTimes}} 次登录，上次登录日期：{{userInfo.loginDate}}，如果不是您本人登录，请及时修改密码 。</p>
            <el-row :gutter="40"
                    style="overflow:hidden">
              <el-col v-for="item in firstList"
                      :key="item.prop"
                      :span="item.span">
                <div class="data-card"
                     :class="{'cursor-pointer':item.clickFn !== null && item.url !== null}"
                     @click="clickCard(item.fn, item.url)">
                  <p class="number ellipsis"
                     :class="item.class"
                     :title="item.value"
                     :style="{'fontSize':item.fontSize +'px'}">{{cordObj[item.value] || 0}}</p>
                  <p class="txt">{{item.label}}</p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40"
                    style="overflow:hidden">
              <el-col v-for="item in secondList"
                      :key="item.prop"
                      :span="item.span">
                <div class="data-card"
                     :class="{'cursor-pointer':item.clickFn !== null && item.url !== null}"
                     @click="clickCard(item.fn, item.url)">
                  <p class="number ellipsis"
                     :class="item.class"
                     :title="item.value"
                     :style="{'fontSize':item.fontSize +'px'}">{{cordObj[item.value] || 0}}</p>
                  <p class="txt">{{item.label}}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </el-scrollbar>

</template>
<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
  name: "index",
  data() {
    return {
      // 主要数据 --------------------------
      cordObj: {},
      firstList: [
        {
          span: 12,
          key: 1,
          label: "今日访客数（UV）",
          value: "todayUv",
          fontSize: 36,
          class: null,
          fn: null,
          url: null
        },
        {
          span: 12,
          key: 2,
          label: "今日浏览量（PV）",
          value: "todayPv",
          fontSize: 36,
          class: null,
          fn: null,
          url: null
        }
      ],
      secondList: [
        {
          span: 12,
          key: 3,
          label: "未读留言",
          value: "unRead",
          fontSize: 36,
          class: null,
          fn: null,
          url: "/msg"
        },
        {
          span: 12,
          key: 3,
          label: "已发布招聘岗位",
          value: "jobNum",
          fontSize: 36,
          class: null,
          fn: null,
          url: "/job"
        }

      ]
    }
  },
  methods: {
    // 获取主数据
    getMainData() {
      this.axios.get("/api/home")
        .then((res) => {
          this.cordObj = res.data;
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
    ...mapGetters(["theme", "userInfo"])
  },
  mounted() {
    this.getMainData();
  }
};
</script>

<style scoped lang="stylus">
.wrap
  padding-bottom 10px

.card
  box-sizing border-box
  position relative
  padding 46px 10px 10px

  .el-row
    padding-bottom 20px
    height 180px

  .el-col
    height 100%

  .main-title
    position absolute
    top 5px
    left 0
    width 100%
    margin-bottom 0
    padding-left 10px

  .content
    height 100%

.main-data
  .data-card
    height 100%
    background-color #F5F5F5
    text-align center
    overflow hidden

    .number
      line-height 100px
      font-size 36px

    .txt
      line-height 30px
      font-size 14px

.login-info
  height 50px
  line-height 50px
</style>
