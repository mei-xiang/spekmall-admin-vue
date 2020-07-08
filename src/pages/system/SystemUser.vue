<template>
  <div class="newsListWrap content">
    <div class="pageTitle">系统用户管理</div>
    <el-row class="searchRow" style="text-align:right;">
      <el-col>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 20px;"
          @click="handleAddUser"
        >添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%" height="560">
      <el-table-column prop="avatar" label="头像" min-width="120">
        <template slot-scope="{row}">
          <el-image
            style="width: 30px; height: 30px"
            :src="row.avatar"
            :preview-src-list="[row.avatar]"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="120">
        <template slot-scope="{row}">{{row.account.nickname}}</template>
      </el-table-column>
      <el-table-column prop="account" label="用户名" min-width="120">
        <template slot-scope="{row}">{{row.account.username}}</template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色(权限)" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="120">
        <template slot-scope="{row}">{{row.account.status.text}}</template>
      </el-table-column>
      <el-table-column prop="registerDate" label="注册时间" min-width="120"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="120">
        <template slot-scope="{row}">{{row.account.loginDate}}</template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleResetPwd(scope.row)" type="text" size="small">重置密码</el-button>
          <el-button
            v-if="scope.row.account.status.status === 1"
            type="text"
            size="small"
            @click="startAccount(scope.row)"
          >启用</el-button>

          <el-button
            v-if="scope.row.account.status.status === 0"
            type="text"
            size="small"
            @click="forbidAccount(scope.row)"
          >停用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="pageData.page"
      :page-sizes="[10, 20, 50]"
      :page-size.sync="pageData.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total"
    ></el-pagination>
    <!-- 新增用户列表 -->
    <el-dialog
      :title="isAddOrEdit? '修改用户' : '新增用户'"
      :visible.sync="addUserModal"
      width="40%"
      @close="claoseAddUserModal"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="uploadAdd"
                :headers="uploadHeader"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="width: 300px;"
                >（尺寸：230×180、格式jpg\png、大小10M内)</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="ruleForm.username" :disabled="isAddOrEdit"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" v-if="!isShowPwd">
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色权限:" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择角色权限">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称:" palceholder="请输入昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" palceholder="请输入邮箱">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" palceholder="请输入手机号">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserModal = false">取消</el-button>
        <el-button type="primary" @click="submitAddUser">提交</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="modifyModal" width="40%" @close="claoseModifyModal">
      <el-form :model="modifyPwd" ref="modifyPwd" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名:">
          <span>{{modifyPwd.username}}</span>
        </el-form-item>
        <!-- <el-form-item label="密码:" palceholder="请输入密码" prop="password">
          <el-input type="password" v-model="modifyPwd.password"></el-input>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyModal = false">取消</el-button>
        <el-button type="primary" @click="submitPwd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "js/store";
export default {
  data() {
    const token = getStore({ name: "access_token", type: "string" });
    let baseUrl = this.BaseUrl;
    return {
      // table
      tableData: [],
      srcList: [],
      addUserModal: false,
      rolesList: [],
      isShowPwd: false,
      ruleForm: {
        nickname: "",
        avatar: "",
        roleId: "",
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      pageData: {
        page: 1,
        size: 10,
        total: 0
      },
      rules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        rights: [{ required: true, message: "请选择昵称", trigger: "change" }],
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        roleId: [
          { required: true, message: "请选择角色权限", trigger: "change" }
        ]
      },
      modifyModal: false,
      modifyPwd: {},
      // modifyPwdRules: {
      //   password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      // },
      // wenjian
      uploadAdd: baseUrl + "/file/upload",
      uploadHeader: {
        Authorization: "Bearer " + token
      },
      imageUrl: "",
      isAddOrEdit: false // falase是新增， true 为edit
    };
  },
  created() {
    this.getRoleList();
    this.getUerList();
  },
  methods: {
    // 发布新闻
    handleAddUser() {
      this.isAddOrEdit = false;
      this.isShowPwd = false;
      this.addUserModal = true;
    },
    getRoleList() {
      this.axios.get("/api/role").then(res => {
        this.rolesList = res.data.content.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
      });
    },
    getUerList() {
      this.axios
        .get(
          `/api/manager/page?page=${this.pageData.page}&size=${this.pageData.size}`
        )
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data.content;
            this.tableData = this.tableData.map(item => {
              item.avatar = this.imgBaseUrl + item.avatar;

              return item;
            });

            this.pageData.total = res.data.totalElements;
          }
        });
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields();
    },
    handleAvatarSuccess() {},
    // 修改密码
    handleResetPwd(row) {
      this.modifyModal = true;
      this.modifyPwd.username = row.account.username;
    },
    submitPwd() {
      this.axios
        // .post("/api/manager/password/reset", this.modifyModal,{String:"json"})
        .post(`/api/manager/password/reset?username=${this.modifyPwd.username}`)
        .then(res => {
          this.$message.success("密码修改成功");
          this.modifyModal = false;
          this.getUerList();
        });
    },
    claoseModifyModal() {
      this.$refs.modifyPwd.resetFields();
    },
    // 禁用

    forbidAccount(row) {
      this.axios
        .post(
          `/api/manager/disable/`,
          { id: row.id, remarks: "" },
          { String: "json" }
        )
        .then(res => {
          this.$message.success("禁用成功");
          this.getUerList();
        });
    },

    // 启用
    startAccount(row) {
      this.axios.post(`/api/manager/enable/?id=${row.id}`).then(res => {
        this.$message.success("启用成功");
        this.getUerList();
      });
    },

    // 新增用户

    claoseAddUserModal() {
      this.$refs.ruleForm.resetFields();
      this.$refs.ruleForm.clearValidate();
      this.imageUrl = "";
      this.ruleForm = {
        email: "",
        mobile: ""
      };
    },
    // 新增用户
    submitAddUser() {
      let url = "/api/manager/apply";
      if (this.isAddOrEdit) {
        url = `/api/manager/update`;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = this.ruleForm;
          params.userType = 1;
          this.axios.post(url, params, { String: "json" }).then(res => {
            this.$message.success("增加成功");
            this.getUerList();
            this.$refs.ruleForm.resetFields();
            this.imageUrl = "";
            this.ruleForm = {
              email: "",
              mobile: ""
            };
            this.addUserModal = false;
          });
        } else {
          return false;
        }
      });
    },

    // 编辑操作
    handleEdit(item) {
      this.isAddOrEdit = true;
      this.isShowPwd = true;
      this.addUserModal = true;
      this.axios.get(`/api/manager/${item.id}`).then(res => {
        let resData = res.data;
        this.ruleForm = {
          avatar: resData.account.avatar,
          roleId: resData.roleId,
          nickname: resData.account.nickname,
          username: resData.account.username,
          password: resData.account.password,
          email: resData.email,
          mobile: resData.mobile,
          id: resData.id
        };
        this.imageUrl = this.imgBaseUrl + item.account.avatar;
      });
    },
    // 文件上传前的钩子函数，用于对文件类型进行校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或者 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    uploadSuccess(res, file, fileList) {
      this.ruleForm.avatar = res.data;
      this.imageUrl = this.imgBaseUrl + res.data;
    },
    handlePageChange(val) {
      this.pageData.page = val;
      this.getUerList();
    },
    handleSizeChange(val) {
      this.pageData.size = val;
      this.getUerList();
    }
  }
};
</script>

<style lang="stylus" scoped>
/deep/ .el-dialog {
  width: 600px !important;
}

.pageTitle {
  font-size: 24px;
  margin-bottom: 20px;
}

.searchRow {
  margin-bottom: 10px;
}

// /deep/ .el-table .el-table__row td {
// padding: 0;
// }
// 解决element Ui 表格错位
/deep/ .el-table th.gutter {
  display: table-cell !important;
}

// 图片上传样式
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

/deep/ .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
