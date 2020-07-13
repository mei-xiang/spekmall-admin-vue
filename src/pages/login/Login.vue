<!--
 * @Description: 登录
 * @Author: xiabing
 * @Date: 2018-09-26 10:38:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-10 17:38:59
 -->

<template>
  <div class="login">
    <div class="box">
      <div class="con-l"></div>
      <div class="con-r">
        <div class="title">
          <p class="title-back">欢迎回来！</p>
          <p class="title-login">登录</p>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          @keyup.enter.native="submitForm('ruleForm')"
          class="fr login-form"
        >
          <el-form-item prop="username">
            <div class="username-box">
              <el-input type="text" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="password-box">
              <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
              <router-link to="/register" class="forget-password fr">忘记密码？</router-link>
            </div>
          </el-form-item>
          <SliderVerificationCode
            v-model="sliderVal"
            @change="handleChange"
            content="请按住滑块，拖动到最右边"
            textColor="#909399"
          />
          <div class="validata_slider_box">
            <span class="validata_slider" v-if="isShowSliderText">请移动滑块</span>
          </div>
          <div class="login_for">
            <el-button type="primary" @click="submitForm('ruleForm')" class="submit">
              <i class="iconfont iconqianwang go"></i>
            </el-button>
            <div class="operate-box clearfix">
              <el-switch @change="clickSaveLogin" v-model="saveLoginInfo" inactive-text="记住密码"></el-switch>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapMutations } from 'vuex'
import fileList from '@/router/fileList'
import { setStore, getStore, removeStore } from 'js/store'
import axios from 'axios'
export default {
  name: 'login',
  data() {
    return {
      sliderVal: false,
      saveLoginInfo: false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          this.$rules.setRequired('请输入账号'),
          this.$rules.setNoSpace()
        ],
        password: [
          this.$rules.setRequired('请输入密码'),
          this.$rules.setPassword(6, 20)
        ]
      },
      validatorUrl: null,
      isShowSliderText: false // 控制滑块校验文字的显示/隐藏
    }
  },
  methods: {
    // 滑块的回调
    handleChange(value) {
      // console.log('您验证结果为:',value);
      if (value) {
        this.isShowSliderText = false
      }
    },
    ...mapMutations({
      set_active_index: 'SET_ACTIVE_INDEX',
      set_user_info: 'SET_USER_INFO',
      resetTabs: 'RESET_TABS'
    }),
    // ...mapActions(["GET_PRODUCTTYPES"]),
    // 本地密码加解密方法
    compile(code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length)
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
      }
      return escape(c)
    },
    uncompile(code) {
      code = unescape(code)
      var c = String.fromCharCode(code.charCodeAt(0) - code.length)
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
      }
      return c
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!this.sliderVal) return (this.isShowSliderText = true)
        if (valid) {
          if (!this.sliderVal) return (this.isShowSliderText = true)
          const loading = this.$loading({
            lock: true,
            text: '登录中，请稍等',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          removeStore({ name: 'access_token' })
          axios
            .post(`${this.BaseUrl}/public/login`, {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              userType: 1
            })
            .then(res => {
              console.log(res)
              if (res.data.code !== 200) return false
              // this.$router.push({path: '/page'})
              let useData = res.data.data
              this.$message.success('登录成功')
              // 保存token
              setStore({
                name: 'access_token',
                content: res.data.data.token,
                type: 'session'
              })
              // 检测密码强度并记录
              useData.passwordStrength = this.testPassword(
                this.ruleForm.password
              )

              // 保存登录信息 部分 start ----------------------------------
              let loginInfo = {}
              if (this.saveLoginInfo) {
                loginInfo = {
                  saveLoginInfo: true,
                  username: this.ruleForm.username,
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
              })
              // 保存登录信息 部分 end ----------------------------------
              // 菜单处理方法
              const toMenu = menuData => {
                const pathArr = new Set()
                if (!Array.isArray(menuData)) return []
                let obj = {}
                // 排序 + 创建菜单id映射对象
                menuData.sort((a, b) => {
                  obj[a.id] = a
                  obj[b.id] = b
                  return a.orderNum - b.orderNum
                })
                // let newObj = JSON.parse(JSON.stringify(obj));
                const toTreeFn = (arr, id) => {
                  let tree = []
                  let temp = null
                  menuData.forEach((item, index) => {
                    item.pName = obj[item.parentId]
                      ? obj[item.parentId].menuName
                      : '根节点'
                    if (item.parentId === id) {
                      temp = toTreeFn(arr, item.id)
                      if (temp.length > 0) {
                        item.children = temp
                      }
                      if (item.menuUrl && !pathArr.has(item.menuUrl)) {
                        const name = item.menuUrl.replace('/', '')
                        pathArr.add(item.menuUrl)
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
                      tree.push(item)
                      delete menuData[index]
                    }
                  })
                  return tree
                }
                return toTreeFn(menuData, 0)
              }
              // 解析编辑权限
              const parsePermissions = data => {
                const { menus, editMenuIds } = data
                let arr = []
                menus.forEach(item => {
                  if (
                    editMenuIds.indexOf(item.id) !== -1 &&
                    !this.$dataIsNull(item.menuUrl)
                  ) {
                    console.log(item.menuUrl.replace('/', ''))
                    arr.push(item.menuUrl.replace('/', ''))
                  }
                })

                return arr
              }
              // 解析编辑权限
              useData.permissions = parsePermissions(useData)
              // 路由数据
              useData.routerList = []
              // 系统左侧菜单数据
              useData.leftMenu = toMenu(useData.menus)
              useData.avatar = useData.avatar
                ? this.$imageSrc(useData.avatar)
                : '/static/image/icon_top_head_user.png'
              // 保存登录用户信息
              this.set_user_info(useData)

              // 切换到用户保存的路由
              let historyRoute = useData.routerList[0].path
              // 获取上次登录用户id 判断是否用户连续登录 连续登录跳转上次退出时的路由
              const lastLoginId = getStore({ name: 'last_login_id' })
              if (
                this.$router.currentRoute.query.redirect &&
                lastLoginId &&
                lastLoginId === useData.id
              ) {
                historyRoute = this.$router.currentRoute.query.redirect
              } else {
                this.resetTabs()
                setStore({
                  name: 'last_login_id',
                  content: useData.id,
                  type: 'session'
                })
              }
              const loginSuccess = () => {
                this.$router.push(historyRoute)
                this.set_active_index(historyRoute)
                loading.close()
              }
              // 判断是否加载路由
              if (useData.routerList.length === 0) {
                loginSuccess()
              } else {
                // 增加获取的路由权限
                this.$router.addRoutes(useData.routerList)
                // 路由加载成功后回调
                this.$router.onReady(() => {
                  loginSuccess()
                })
              }
            })
            .catch(res => {
              loading.close()
            })
        }
      })
    },
    clickSaveLogin(val) {
      if (val)
        this.$message.warning('请勿在无安全保障的电脑上保存登录信息！！！')
    },
    setLoginInfo() {
      const loginInfo = getStore({ name: 'login_info' })
      if (loginInfo && loginInfo.saveLoginInfo) {
        this.saveLoginInfo = true
        this.ruleForm.username = loginInfo.username
        this.ruleForm.password = this.uncompile(loginInfo.password)
      }
    },
    testPassword(password) {
      var modes = 0
      if (password.length < 6) return 0
      if (/\d/.test(password)) modes++ //数字
      if (/[a-z]/.test(password)) modes++ //小写
      if (/[A-Z]/.test(password)) modes++ //大写
      if (/[^a-zA-Z0-9]+/.test(password)) modes++ //特殊字符
      if (password.length > 12) return 4
      return modes
    }
  },
  created() {
    this.setLoginInfo()
  }
}
</script>

<style>
.login {
  background: url('../../assets/images/login_bg.png') 0 0 no-repeat;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login .box {
  width: 80%;
  height: 90%;
  background-color: pink;
  display: flex;
  background: #ffffff;
  box-shadow: 0 24px 36px 0 rgba(51, 53, 54, 0.06);
  border-radius: 24px;
  overflow: hidden;
}

.login .box .con-l {
  flex: 1;
  background-color: skyblue;
  background: url('../../assets/images/login_l_bg.png') no-repeat center center;
}
.login .box .con-r {
  flex: 1;
  padding: 100px 80px 117px 29px;
}
.login .title .title-back {
  font-size: 40px;
  color: #47494b;
  margin-bottom: 4px;
  line-height: 56px;
}
.login .title .title-login {
  font-size: 40px;
  color: #47494b;
  margin-bottom: 50px;
  line-height: 56px;
}
.login .login-form {
  width: 100%;
}
.login .el-input {
  font-family: 'PingFangSC-Regular';
  font-size: 14px;
  color: #909399;
  border-bottom: 1px solid #dddddd;
}
.login .el-form .el-input__inner {
  border: none !important;
  padding: 0 !important;
  color: #909399;
}
.login .el-form .username-box {
  border: none !important;
}
.login .submit {
  background-image: linear-gradient(135deg, #7ebdfb 0%, #167fda 100%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  position: relative;
}
.login .submit .go {
  position: absolute;
  top: 13px;
  right: 1px;
  font-size: 38px;
  transform: translateX(-10px);
}
.login .forget-password {
  position: absolute;
  top: 0;
  right: 0;
  color: #909399;
}
.app-drag {
  margin-top: 50px !important;
  /* margin-bottom: 81px !important; */
  border-radius: 5px !important;
}
.app-drag .slider {
  border-radius: 5px !important;
}

.app-drag .text {
  border-radius: 5px !important;
}
.background {
  border-radius: none !important;
  border-top-left-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}
.login_for {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.operate-box {
  display: inline-block;
}
.validata_slider_box {
  margin-top: 4px;
  margin-bottom: 81px;
  position: relative;
}
.validata_slider {
  color: #f56c6c;
  font-size: 12px;
  position: absolute;
  top: 4px;
  left: 0;
}
</style>
