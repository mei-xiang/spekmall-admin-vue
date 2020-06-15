<!--
 * @Description: 登录
 * @Author: xiabing
 * @Date: 2018-09-26 10:38:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-10 17:38:59
 -->

<template>
  <div class="login">
    <div class="login-box clearfix">
      <div class='login-title fl'>
        <img src="../../assets/images/logo_white.png"
             alt="logo">
        <p>敏特达官网后台管理系统</p>
      </div>
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               @keyup.enter.native="submitForm('ruleForm')"
               class="fr">
        <i class="login-icon"
           :class="isAccount ? 'account-icon' : 'qrcode-icon'"
           @click="loginMode"></i>
        <div v-if="isAccount">
          <p class="login-mode">扫码安全登录</p>
          <div class="login-qrcode"></div>
          <p class="login-tips">使用微信扫一扫登录</p>
        </div>
        <div v-else>
          <p class="login-mode">帐号登录</p>
          <el-form-item prop="name">
            <div class="username-box">
              <i class="iconfont">&#xe639;</i>
              <el-input type="text"
                        v-model="ruleForm.name"
                        placeholder="请输入用户名"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="password-box">
              <i class="iconfont">&#xe69f;</i>
              <el-input type="password"
                        v-model="ruleForm.password"
                        placeholder="请输入密码"></el-input>
            </div>
          </el-form-item>
          <div class="operate-box clearfix">
            <el-checkbox @change="clickSaveLogin"
                         v-model="saveLoginInfo">请保存我这次登录信息</el-checkbox>
            <!-- <router-link to="/register"
									 class="forget-password fr">忘记密码？</router-link> -->
          </div>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p class="edition">当前版本 v1.0.0</p>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from "vuex";
import fileList from '@/router/fileList';
import { setStore, getStore, removeStore } from 'js/store'
export default {
  name: "login",
  data() {
    return {
      isAccount: false,
      saveLoginInfo: false,
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          this.$rules.setRequired("请输入账号"),
          this.$rules.setNoSpace()
        ],
        password: [
          this.$rules.setRequired("请输入密码"),
          this.$rules.setPassword(6, 20)
        ]
      },
      validatorUrl: null
    };
  },
  methods: {
    ...mapMutations({
      set_active_index: "SET_ACTIVE_INDEX",
      set_user_info: "SET_USER_INFO",
      resetTabs: "RESET_TABS"
    }),
    // ...mapActions(["GET_PRODUCTTYPES"]),
    // 刷新验证码
    loginMode() {
      this.isAccount = !this.isAccount
    },
    // 本地密码加解密方法
    compile(code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length);
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
      }
      return escape(c);
    },
    uncompile(code) {
      code = unescape(code);
      var c = String.fromCharCode(code.charCodeAt(0) - code.length);
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
      }
      return c;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中，请稍等',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          removeStore({ name: 'access_token' });
          this.axios.post("/api/api/sysLogin", {
            name: this.ruleForm.name,
            password: this.ruleForm.password
          }).then((res) => {
            let useData = res.data.userDetail;
            this.$message.success("登录成功");
            // 保存token
            setStore({
              name: 'access_token',
              content: res.data.token,
              type: "session"
            });
            // 检测密码强度并记录
            useData.passwordStrength = this.testPassword(this.ruleForm.password);

            // 保存登录信息 部分 start ----------------------------------
            let loginInfo = {};
            if (this.saveLoginInfo) {
              loginInfo = {
                saveLoginInfo: true,
                name: this.ruleForm.name,
                password: this.compile(this.ruleForm.password)
              }
            } else {
              loginInfo = {
                saveLoginInfo: false,
                username: null,
                password: null
              }
            }
            setStore({
              name: 'login_info',
              content: loginInfo
            });
            // 保存登录信息 部分 end ----------------------------------
            // 菜单处理方法
            const toMenu = (menuData) => {
              const pathArr = new Set();
              if (!Array.isArray(menuData)) return [];
              let obj = {};
              // 排序 + 创建菜单id映射对象
              menuData.sort((a, b) => {
                obj[a.id] = a;
                obj[b.id] = b;
                return a.orderNum - b.orderNum
              })
              // let newObj = JSON.parse(JSON.stringify(obj));
              const toTreeFn = (arr, id) => {
                let tree = [];
                let temp = null;
                menuData.forEach((item, index) => {
                  item.pName = obj[item.parentId] ? obj[item.parentId].menuName : "根节点";
                  if (item.parentId === id) {
                    temp = toTreeFn(arr, item.id);
                    if (temp.length > 0) {
                      item.children = temp;
                    }
                    if (item.menuUrl && !pathArr.has(item.menuUrl)) {
                      const name = item.menuUrl.replace("/", "");
                      pathArr.add(item.menuUrl);
                      useData.routerList.push({
                        path: item.menuUrl,
                        name: name,
                        component: fileList[name],
                        meta: {
                          title: item.menuName,
                          parent: item.pName,
                          requireAuth: true
                        }
                      })
                    }
                    tree.push(item);
                    delete menuData[index];
                  }
                })
                return tree;
              }
              return toTreeFn(menuData, 0)
            }
            // 解析编辑权限
            const parsePermissions = (data) => {
              const { menus, editMenuIds } = data;
              let arr = [];
              menus.forEach((item) => {
                if (editMenuIds.indexOf(item.id) !== -1 && !this.$dataIsNull(item.menuUrl)) {
                  console.log(item.menuUrl.replace("/", ""));
                  arr.push(item.menuUrl.replace("/", ""));
                }
              })

              return arr;
            };
            // 解析编辑权限
            useData.permissions = parsePermissions(useData);
            // 路由数据
            useData.routerList = [];
            // 系统左侧菜单数据
            useData.leftMenu = toMenu(useData.menus);
            useData.avatar = useData.avatar ? this.$imageSrc(useData.avatar) : "/static/image/icon_top_head_user.png";
            // 保存登录用户信息
            this.set_user_info(useData);

            // 切换到用户保存的路由
            let historyRoute = useData.routerList[0].path;
            // 获取上次登录用户id 判断是否用户连续登录 连续登录跳转上次退出时的路由
            const lastLoginId = getStore({ name: 'last_login_id' })
            if (this.$router.currentRoute.query.redirect && lastLoginId && lastLoginId === useData.id) {
              historyRoute = this.$router.currentRoute.query.redirect;
            } else {
              this.resetTabs();
              setStore({
                name: 'last_login_id',
                content: useData.id,
                type: "session"
              });
            }
            const loginSuccess = () => {
              this.$router.push(historyRoute);
              this.set_active_index(historyRoute);
              loading.close();
            }
            // 判断是否加载路由
            if (useData.routerList.length === 0) {
              loginSuccess();
            } else {
              // 增加获取的路由权限
              this.$router.addRoutes(useData.routerList);
              // 路由加载成功后回调
              this.$router.onReady(() => {
                loginSuccess();
              })
            }
          }).catch((res) => {
            loading.close();
          });
        }
      });
    },
    clickSaveLogin(val) {
      if (val) this.$message.warning("请勿在无安全保障的电脑上保存登录信息！！！");
    },
    setLoginInfo() {
      const loginInfo = getStore({ name: 'login_info' });
      if (loginInfo && loginInfo.saveLoginInfo) {
        this.saveLoginInfo = true;
        this.ruleForm.name = loginInfo.name;
        this.ruleForm.password = this.uncompile(loginInfo.password);
      }
    },
    testPassword(password) {
      var modes = 0;
      if (password.length < 6) return 0;
      if (/\d/.test(password)) modes++; //数字
      if (/[a-z]/.test(password)) modes++; //小写
      if (/[A-Z]/.test(password)) modes++; //大写
      if (/[^a-zA-Z0-9]+/.test(password)) modes++; //特殊字符
      if (password.length > 12) return 4;
      return modes;
    }
  },
  created() {
    this.setLoginInfo();
  }
};
</script>

<style scoped lang="stylus">
.login
  background url('../../assets/images/login_bg.png') 0 0 no-repeat
  background-size cover
  position fixed
  top 0
  left 0
  right 0
  bottom 0

  // .login-header
  // background rgba(0, 0, 0, 0.4)
  // height 88px
  // width 100%
  // img
  // margin 26px 100px
  .login-box
    margin 0 16.66%
    transform translate(0, -50%)
    position relative
    top 50%

    @media screen and (min-width: 1020px) and (max-width: 1280px)
      margin 0 10%

    .login-title
      margin 177px 0

      img
        width 320px

      p
        font-size 32px
        color #fff
        margin-top 30px

    .el-form
      width 460px
      height 356px
      padding 0 50px
      box-sizing border-box
      background #fff
      position relative

      @media screen and (max-width: 1440px)
        width 380px

      .login-icon
        width 50px
        height 50px
        display inline-block
        cursor pointer
        position absolute
        top 20px
        right 20px

      .login-mode
        padding 24px 0
        font-size 20px
        color #409eff
        line-height 20px
        text-align center
        cursor pointer

      .login-qrcode
        width 200px
        height 200px
        background #ccc
        margin 30px auto 20px

      .login-tips
        color #999999
        font-size 14px
        text-align center
        margin-bottom 66px

      >>>.el-form-item
        margin-bottom 16px

      >>>.el-input__inner:focus
        border-color #00438a

      .username-box, .password-box
        position relative

        .iconfont
          position absolute
          padding 0 15px
          z-index 2
          color #c6d3de
          font-size 13px
          line-height 43px

        >>>input
          padding-left 40px

      .code-box
        .fl
          width 220px

          @media screen and (max-width: 1440px)
            width 150px

        .fr
          width 100px
          height 40px
          border 1px solid #dcdfe6

          img
            width 100%
            cursor pointer

      .operate-box
        margin-bottom 22px

        >>>.el-checkbox__label
          font-size 14px
          color #333333
          line-height 16px

        >>>.el-checkbox__inner
          width 20px
          height 20px

          &:after
            position absolute
            height 9px
            width 4px
            left 6px
            top 2px

        >>>.el-checkbox__input.is-saveLoginInfo .el-checkbox__inner
          background-color #00438a
          border-color #00438a

        >>>.el-checkbox__input.is-focus .el-checkbox__inner
          border-color #00438a

        .forget-password
          font-size 14px
          color #00438a
          line-height 16px

      .el-button
        width 100%
        background #00438a
        box-shadow 1px 2px 4px 0 #00438a
        border-radius 4px
        border-color #00438a
        font-size 16px
        color #fff

      .edition
        font-size 14px
        color #666666
        line-height 14px
        text-align center
        margin-top 30px

  .login-footer
    position fixed
    bottom 30px
    text-align center
    width 100%

    p
      color #fff
      font-size 14px
      line-height 22px
</style>
