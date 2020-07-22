<!--
 * @Description: 用户设置
 -->

<template>
  <div class="user-setting">
    <el-tabs tab-position="left">
      <el-tab-pane label="安全设置">
        <h5>安全设置</h5>
        <ul>
          <li>
            <h6>密码强度</h6>
            <div>
              <span>当前密码强度：{{userInfo.passwordStrength | filter }}</span>
              <el-button
                type="text"
                class="fr"
                @click="changePassword"
                v-if="$isPermission($route.path)"
              >修改</el-button>
            </div>
          </li>
          <li>
            <h6>手机号</h6>
            <div>
              <span>已绑定手机号：</span>
            </div>
          </li>
          <li>
            <h6>邮箱</h6>
            <div>
              <span>已绑定邮箱：</span>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="修改密码"
      v-dialogDrag
      append-to-body
      @close="closeDialog"
      :visible.sync="isShowDialog"
    >
      <main-form ref="mainForm" :data="postData" :form="formConfig" :rules="rules"></main-form>
      <div slot="footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="closeAddOrEdit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getStore, removeStore } from 'js/store'
export default {
  name: 'User',
  data() {
    const userInfo = getStore({ name: 'userInfo' })
    return {
      // 弹框相关
      isShowDialog: false,
      postData: {
        oldPwd: null,
        password: null,
        newPwd: null
      },
      id: null,
      formConfig: [
        [
          {
            span: 24,
            labelWidth: '120px',
            list: [
              {
                type: 'password',
                label: '旧密码：',
                prop: 'oldPwd',
                showPassword: true
              },
              {
                type: 'password',
                label: '新密码：',
                prop: 'password'
              },
              {
                type: 'password',
                label: '确认密码：',
                prop: 'newPwd'
              }
            ]
          }
        ]
      ],
      rules: {
        oldPwd: [
          this.$rules.setRequired('请输入旧密码'),
          this.$rules.setPassword(6, 18)
        ],
        password: this.$rules.setNewPassword(
          this,
          'mainForm',
          'postData',
          'newPwd',
          true
        ),
        newPwd: this.$rules.setConfirmPassword(
          this,
          'postData',
          'password',
          true
        )
      }
    }
  },
  methods: {
    // 右侧按钮列表部分 -------------------------
    changePassword() {
      this.isShowDialog = true
    },
    // 提交保存数据
    submit() {
      this.$refs['mainForm'].validate(data => {
        this.id = this.userInfo.userId
        console.log(this.id, this.postData.oldPwd, this.postData.newPwd)
        this.axios
          .put('/public/password/change', {
            id: this.id,
            oldPwd: this.postData.oldPwd,
            newPwd: this.postData.newPwd
          })
          .then(res => {
            if (res.code == 404) return this.$message.error(res.message)
            if (res.code != 200) return
            this.$message.success(res.message)
            this.closeAddOrEdit()
            removeStore({ name: 'access_token' })
            removeStore({ name: 'userInfo' })
            this.$router.replace({
              path: '/login'
            })
          })
          .catch(() => {})
      })
    },
    closeAddOrEdit() {
      this.isShowDialog = false
    },
    closeDialog() {
      // 关闭弹框初始化数据
      this.postData = this.$options.data.call(this).postData
      this.$nextTick(() => {
        this.$refs.mainForm.clearValidate()
      })
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    filter(val) {
      switch (val) {
        case 1:
          return '弱'
        case 2:
          return '中'
        case 3:
          return '强'
        case 4:
          return '超强'
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.user-setting {
  box-sizing: border-box;
  padding: 20px 100px 20px 20px;
  height: 100%;

  >>>.el-tabs {
    height: 100%;
  }

  >>>.el-tabs__item {
    height: 80px;
    width: 200px;
    line-height: 80px;
    text-align: center;
    font-size: 18px;
  }

  >>>.el-tabs__content {
    padding-left: 40px;
    height: 100%;
  }

  h5 {
    font-size: 18px;
    font-weight: bolder;
  }

  li {
    padding: 15px 0;
    border-bottom: 1px solid #ccc;
  }

  h6, div {
    height: 40px;
    line-height: 40px;
  }
}
</style>
