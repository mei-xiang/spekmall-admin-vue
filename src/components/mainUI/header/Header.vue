<!--
 * @Description: 头部
 -->

<template>
  <!-- :style="{'backgroundColor':bgCOlor}" -->
  <div class="header clearfix" style="backgroundColor:#fff">
    <!-- 侧边栏开关 -->
    <i class="el-icon-menu sidebar" @click="OPEN_SIDEBAR"></i>
    <!-- logo -->
    <div class="logo"></div>
    <!-- 系统名称 -->
    <!-- <div class="system-name">敏特达官网后台管理系统</div> -->
    <!-- 菜单列表 -->
    <!-- 右侧图标列表 -->
    <ul class="right-list clearfix">
      <li class="list-item hover icon-text user" v-popover:user-popover>
        <span class="mes_box"><i class="iconfont iconxiaoxi message"></i></span>
        <!-- <img class="userImg" :src="userInfo.avatar" /> -->
        <img
          src="../../../../src/assets/images/avatar.png"
          alt=""
          class="userImg"
        />
        <!-- {{ userInfo.nickname }} -->
      </li>
    </ul>

    <el-popover
      ref="user-popover"
      placement="bottom-end"
      width="200"
      :open-delay="150"
      popper-class="header-menu"
      :visible-arrow="false"
      trigger="hover"
    >
      <ul class="user-control">
        <li @click="toUserSetting">用户设置</li>
        <li @click="logout">退出</li>
      </ul>
    </el-popover>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapGetters } from "vuex";
// import TopTheme from "../Theme";
import HeaderMenu from "./HeaderMenu";
import { removeStore, getStore } from 'js/store'
export default {
  name: "Header",
  data() {
    return {
      imgSrc: "/static/image/icon_top_head_user.png",
      labelWidth: "130px",
      isShowPasswordDialog: false,
      passwordData: {
        password: null,
        pass: null,
        newPassword: null
      },
      passwordRules: {
        password: [
          this.$rules.setRequired("请输入原密码"),
          this.$rules.setPassword(6, 20)
        ],
        pass: this.$rules.setNewPassword(this, "passwordForm", "passwordData", "newPassword"),
        newPassword: this.$rules.setConfirmPassword(this, "passwordData", "pass")
      },
      bgCOlor: "",
      searchKeyWords: ""
    };
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { HeaderMenu },
  methods: {
    ...mapMutations(["OPEN_SIDEBAR"]),
    toUserSetting() {
      this.$router.push({
        path: '/userSetting'
      })
    },
    toCompanyInfo() {
      this.$router.push({
        path: '/companyInfo'
      })
    },
    // 密码修改部分 --------------------------
    showPasswordDialog() {
      this.isShowPasswordDialog = true;
    },
    passwordSubmit() {
      this.$refs["passwordForm"].validate((valid) => {
        if (valid) {
          this.axios.post("/api/oauth-service/user/resetpassword", this.passwordData).then((res) => {
            // tenantService.auditBatch(this.addOrEditData).then((res) => {
            // eslint-disable-next-line eqeqeq
            if (res.statusCode == 200) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              this.isShowPasswordDialog = false;
            }
          })
        } else {
          return false;
        }
      });
    },
    closePasswordDialog() {
      this.passwordData = this.$options.data.call(this).passwordData;
      this.$nextTick(() => {
        this.$refs.passwordForm.clearValidate();
      })
    },
    // 登出部分 --------------------------
    logout() {
      const reset = () => {
        removeStore({ name: 'access_token' });
        removeStore({ name: 'userInfo' });
        this.$router.push({
          path: '/login',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        });
      }
      let token = getStore({ name: 'access_token', type: "string" });
      this.axios.get("/api/api/logout", {
        Authorization: token
      }).then((res) => {
        this.$socket.close();
        this.$message({
          message: '退出成功',
          type: 'success'
        });
        reset();
      }).catch((res) => {
        reset();
      });
    }
    // handleSelect(key, keyPath, value) {
    // var tabs = value.$el.innerHTML;
    // var name = value.$el.dataset.name;
    // this.changeTabs(name);
    // console.log(name);
    // }
  },
  computed: {
    ...mapGetters(["theme", "userInfo"])
  },
  mounted() {
    this.bgCOlor = this.theme;
  },
  watch: {
    theme() {
      this.bgCOlor = this.theme;
    }
  }

};
</script>

<style scoped lang="stylus">
$height = 50px
$maxWidth = 1180px

.header
  position relative
  .sidebar
    display inline-block
    float left
    padding 0 10px
    line-height 80px
    font-size 26px
    color #1989FA
    cursor pointer

  .logo
    float left
    margin-top 25px
    margin-left 15px
    width 472px
    height 28px
    background url('../../../assets/images/logo_title.png') 0 0 no-repeat
    background-size cover

  .system-name
    float left
    padding 0 20px
    width 420px
    height $height
    line-height $height
    font-size 16px
    color #fff

  .top-theme
    position absolute
    top 14px
    right 0

  .right-list
    float right
    margin-right 35px
    margin-top 17px
    .mes_box
      display inline-block
      width 40px
      height 40px
      background-color skyblue
      margin-top 5px
      border-radius 50%
      text-align center
      position relative
    .message
      position absolute
      font-size 18px!important
      top: -4px;
      right: 7px;
      cursor pointer
    .message:hover
      color: #1989FA
    @media (max-width: $maxWidth)
      padding-right 10px

    .list-item
      float left
      height $height
      color #fff
      cursor pointer

      i
        font-size 24px

      .icon-wrap
        position relative
        top 18px
        left 0
        width 32px
        height 32px

        >>>.el-badge__content.is-fixed
          right 20px
          height 14px
          line-height 14px
          padding 0 4px
          border none

    .hover
      &:hover
        background-color #1989fa
    .icon-item
      width $height
      text-align center

    >>>.el-color-picker
      margin 10px 0 0 10px

    .icon-text
      line-height $height
      padding 0 10px

      i
        float left
        line-height $height
        padding 0 5px

      .userImg
        display block
        float right
        margin 5px 3px 0 0
        width 40px
        height 40px
        border-radius 50%
        margin-left: 30px;

    .input-wrap
      padding 13px 30px 0 0
      width 200px

      @media (max-width: $maxWidth)
        padding-right 10px
        width 120px

      >>>.el-input__inner
        height 34px
        line-height 34px
        border-radius 4px
        border none
        background-color rgba(255, 255, 255, 0.3)
        color #fff

      >>>.el-input__suffix
        top -3px

.top-nav
  float left
  mix-width 240px

>>>.el-menu.el-menu--horizontal
  border 0

>>>.el-menu--horizontal>.el-menu-item, >>>.el-menu--horizontal>.el-submenu .el-submenu__title
  height $height
  line-height $height

.el-icon-more-outline
  color #fff
  font-size 30px
  margin 15px 20px

.system-wrap
  width 500px
  height 300px
  background-color #333

.user-control
  overflow hidden

  li
    padding-left 30px
    height 40px
    line-height 40px
    cursor pointer
    border-bottom 1px solid #ccc

    &:hover
      background-color #ccc

.feedback-control
  li
    position relative
    height 80px
    cursor pointer

    &:hover
      background-color #ccc

    i
      position absolute
      top 18px
      left 15px

    .icon-jiqiren
      font-size 24px

    .icon-duihuakuang
      font-size 32px

    div
      padding 20px 0 0 60px

      h5
        height 20px
        line-height 20px
        color #000

      span
        height 20px
        line-height 20px
        color #999
</style>
