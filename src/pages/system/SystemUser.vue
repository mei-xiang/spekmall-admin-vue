<!--
 * @Description: 系统账号管理
 -->

<template>
  <div class="content">
    <div class="user">
      <main-page
        ref="mainPage"
        :height="tableMaxH"
        :hasSelection="false"
        @clickBtn="clickBtn"
        @buttonClick="buttonClick"
        @switchChange="switchChange"
      ></main-page>

      <!-- 新增，修改弹框 -->
      <el-dialog
        :title="dialogType === 0?'新增':'修改'"
        v-dialogDrag
        @close="closeDialog"
        :visible.sync="isShowAddOrEdit"
      >
        <span v-show="dialogType !== 2" class="label">头像：</span>
        <el-upload
          v-show="dialogType !== 2"
          class="avatar-uploader"
          :show-file-list="false"
          action
          :http-request="uploadImg"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <main-form
          ref="mainForm"
          :data="postData"
          :form="formConfig"
          :options="options"
          :rules="addOrEditRules"
        ></main-form>
        <div slot="footer">
          <el-button type="primary" @click="submit(dialogType)">确 定</el-button>
          <el-button @click="closeAddOrEdit">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "User",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/users/managers",
          params: null,
          records: "data"
        },
        search: {
          mainConfigData: [
            {
              label: "用户名",
              key: "name",
              type: 0,
              width: 120
            },
            {
              label: "昵称",
              key: "nickname",
              type: 0,
              width: 120
            }
          ],
          searchData: {
            account: "",
            nickname: ""
          }
        },
        btnListData: [
          {
            label: "新增",
            icon: "el-icon-circle-plus-outline",
            gridSelectModel: 2,
            fn: "addBtn",
            permission: "user"
          }
        ],
        theaderData: [
          {
            type: 13,
            width: "50px",
            hasSort: false,
            isShow: true,
            prop: "avatar",
            label: "头像"
          },
          {
            type: 0,
            width: 0,
            hasSort: false,
            isShow: true,
            prop: "name",
            label: "用户名"
          },
          {
            type: 0,
            width: 0,
            hasSort: false,
            isShow: true,
            prop: "nickname",
            label: "昵称"
          },
          {
            type: 0,
            width: "110px",
            hasSort: false,
            isShow: true,
            prop: "roleNameZh",
            label: "权限"
          },
          {
            type: 2,
            width: "60px",
            hasSort: false,
            isShow: () => {
              return this.$isPermission("user");
            },
            prop: "isEnable",
            label: "启用状态"
          },
          {
            type: 8,
            width: "150px",
            hasSort: false,
            isShow: true,
            prop: "createDate",
            label: "创建时间"
          },
          {
            type: 8,
            width: "150px",
            hasSort: false,
            isShow: true,
            prop: "loginDate",
            label: "最后登录时间"
          },
          {
            type: 1,
            width: "180px",
            hasSort: false,
            isShow: () => {
              return this.$isPermission("user");
            },
            btnList: [
              {
                label: "编辑",
                fn: "editBtn"
              },
              {
                label: "修改密码",
                fn: "changePassword"
              }
            ],
            label: "操作"
          }
        ]
      },
      postData: {
        id: null,
        avatar: "",
        name: "",
        password: "",
        nickname: "",
        phone: "",
        email: "",
        roleId: null
      },
      // 弹框相关
      isShowAddOrEdit: false,
      dialogType: 0,
      imageUrl: "",
      formConfig: [],
      addOrEditRules: {
        name: [
          this.$rules.setRequired("请输入用户名"),
          this.$rules.setCode(4, 18)
        ],
        nickname: [
          this.$rules.setRequired("请输入昵称"),
          this.$rules.setLength(1, 20)
        ],
        roleId: [this.$rules.setRequired("请选择角色", "change")],
        phone: [
          { required: true, validator: this.$rules.checkPhone, trigger: "blur" }
        ],
        email: this.$rules.checkEmail(false),
        password: [
          this.$rules.setRequired("请输入密码"),
          this.$rules.setPassword(6, 18)
        ]
      },
      options: {}
    };
  },
  methods: {
    clickBtn(fn) {
      this[fn]();
    },
    buttonClick(val, index, fn) {
      this[fn](val, index);
    },
    async addBtn() {
      await this.getRoles();
      this.dialogType = 0;
      this.setFrom(this.dialogType);
      this.isShowAddOrEdit = true;
    },
    switchChange(val, index) {
      this.axios
        .put("/api/users/enable", {
          id: val.id,
          isEnable: val.isEnable
        })
        .then(res => {
          this.$message.success(res.msg);
          this.getList();
        });
    },
    setPage() {
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    },
    // 获取列表数据
    getList() {
      this.$refs.mainPage.getList();
    },
    // 获取权限
    getRoles() {
      return new Promise((resolve, reject) => {
        this.axios
          .get("/api/sysRoles", {
            pageSize: 9999999,
            pageNum: 1
          })
          .then(res => {
            const roles = res.data.records.map(item => {
              return {
                id: item.id,
                label: item.nameZh
              };
            });
            this.$set(this.options, "roles", roles);
            resolve();
          });
      });
    },
    // 右侧按钮列表部分 -------------------------
    setFrom(dialogType) {
      this.formConfig = [
        [
          {
            span: 24,
            labelWidth: "100px",
            list: [
              {
                type: "text",
                label: "用户名：",
                prop: "name",
                readOnly: dialogType !== 0
              },
              {
                type: "password",
                label: "密码：",
                prop: "password",
                showPassword: true,
                hidden: dialogType === 1
              },
              {
                type: "select",
                label: "角色：",
                prop: "roleId",
                hidden: dialogType === 2,
                optionCode: "roles"
              },
              {
                type: "text",
                label: "昵称：",
                prop: "nickname",
                hidden: dialogType === 2
              },
              {
                type: "text",
                label: "手机：",
                prop: "phone",
                hidden: dialogType === 2
              },
              {
                type: "text",
                label: "邮箱：",
                prop: "email",
                hidden: dialogType === 2
              }
            ]
          }
        ]
      ];
    },
    uploadImg(data) {
      this.axios.upload([data.file]).then(res => {
        this.postData.avatar = res.data;
        this.imageUrl = URL.createObjectURL(data.file);
      });
    },
    getDataById(data) {
      return new Promise((resolve, reject) => {
        this.axios
          .get(`/api/users/${data.id}`)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    async editBtn(data) {
      await this.getRoles();
      this.getDataById(data).then(res => {
        for (const key in this.postData) {
          if (res.data.hasOwnProperty(key)) {
            this.postData[key] = res.data[key];
          }
        }
        this.imageUrl = this.$imageSrc(res.data.avatar);
        this.dialogType = 1;
        this.setFrom(this.dialogType);
        this.isShowAddOrEdit = true;
      });
    },
    changePassword(data) {
      this.getDataById(data).then(res => {
        this.postData.id = res.data.id;
        this.postData.name = res.data.name;
        this.dialogType = 2;
        this.setFrom(this.dialogType);
        this.isShowAddOrEdit = true;
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或者 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 提交保存数据
    submit(dialogType) {
      let fn = "";
      let url = "";
      switch (dialogType) {
        case 0:
          fn = "post";
          url = "/api/users";
          break;
        case 1:
          fn = "put";
          url = `/api/users/${this.postData.id}`;
          break;
        case 2:
          fn = "put";
          url = "/api/users/password/manage";
          break;
        default:
          break;
      }
      this.$refs["mainForm"].validate(data => {
        if (dialogType === 2) {
          data = {
            name: data.name,
            newPwd: data.password
          };
        } else {
          // 新增修改的时候验证头像
          if (this.$dataIsNull(data.avatar)) {
            this.$message.warning("请上传头像");
            return;
          }
        }
        this.axios[fn](url, data).then(res => {
          this.$message.success(res.msg);
          this.closeAddOrEdit();
          this.getList();
        });
      });
    },
    closeAddOrEdit() {
      this.isShowAddOrEdit = false;
    },
    closeDialog() {
      this.imageUrl = null;
      // 关闭弹框初始化数据
      this.postData = this.$options.data.call(this).postData;
      this.$nextTick(() => {
        this.$refs.mainForm.clearValidate();
      });
    }
  },
  mounted() {
    this.setPage();
  }
};
</script>

<style scoped lang="stylus">
.label {
  position: relative;
  top: 57px;
  left: 35px;

  &:before {
    content: '*';
    color: #F56C6C;
    margin-right: 4px;
  }
}

>>>.avatar-uploader {
  text-align: center;

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
