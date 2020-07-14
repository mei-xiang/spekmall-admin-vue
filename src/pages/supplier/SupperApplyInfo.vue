<template>
  <!-- 供应商注册信息 -->
  <div class="content">
    供应商注册信息
    <span class="infoType" v-if="status.index!=3">状态：{{ status.text }}</span>
    <span class="infoType" v-else>状态：{{ status.text }}</span>
    <el-form
      :model="supperForm"
      ref="supperRef"
      :rules="supperRules"
      label-width="100px"
      center
      style="width:700px;margin-left:100px"
    >
      <el-form-item label="登录名" prop="username">
        <el-input v-model="supperForm.username" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password" v-if="!readonly">
        <el-input v-model="supperForm.password" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="company">
        <el-input v-model="supperForm.company" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="法人姓名" prop="legalPersonName">
        <el-input v-model="supperForm.legalPersonName" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" prop="businessLicense">
        <el-upload
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          v-if="type == 3"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" v-if="type == 3">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!-- 查看与审核图片展示 -->
        <el-image
          style="width: 148px; height: 148px"
          :src="url"
          :preview-src-list="srcList"
          v-if="type == 1 || type == 2"
        ></el-image>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input v-model="supperForm.linkEmail" placeholder="请输入你的联系邮箱" :readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="不通过原因" v-if="status.index==3">
        <el-input v-model="remarks" :readonly="readonly" class="noPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('supperRef')" v-if="type == 3">确定</el-button>
        <!-- <el-button @click="close" v-if="type == 3 || type == 1">取消</el-button> -->
        <el-button @click="approveNoPass" type="danger" v-if="type == 2">审核不通过</el-button>
        <el-button @click="approvePass" type="primary" v-if="type == 2">审核通过</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import baseUrl from '../../api/env'
import { getStore } from 'js/store'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      supperForm: {
        username: '',
        password: '',
        company: '',
        legalPersonName: '',
        businessLicense: '',
        linkEmail: ''
      },
      status: '', // 状态对象
      remarks: '', // 审核不通过内容
      supperRules: {
        username: [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        legalPersonName: [
          { required: true, message: '法人姓名不能为空', trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: '营业执照不能为空', trigger: 'change' }
        ]
      },
      fileList: [],
      uploadUrl: `${
        baseUrl[process.env.NODE_ENV].apiUrl
      }/file/upload?token=${token}`, // 图片上传地址

      dialogImageUrl: '',
      dialogVisible: false,
      readonly: false, // 只读
      type: null, // 查看/审核/新增
      // 查看-审核 图片展示
      url: '',
      srcList: []
    }
  },
  computed: {
    // url() {
    //   return `${this.imgBaseUrl}/home/file/upload/20200619/qaam1zubeqzy6ckv4e82icon_top_head_user.png`;
    // },
    // srcList() {
    //   const srcList = this.supperForm.businessLicense.split(",");
    //   srcList.forEach(item => {
    //     item = this.imgBaseUrl + item;
    //   });
    //   return srcList;
    //   // return [
    //   //   "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
    //   //   "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
    //   // ];
    // }
  },
  created() {
    // 查看 type：1   审核 type：2   新增 type：3
    this.type = this.$route.query.type
    if (this.type == 1) {
      this.getApplyList()
      this.readonly = true
    }
    if (this.type == 2) {
      this.getApplyList()
      this.readonly = true
      this.supperRules = {}
    }
  },
  methods: {
    getApplyList() {
      this.axios
        .post(`/api/supplier/register/detail`, {
          id: this.$route.query.id
        })
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            for (let key in this.supperForm) {
              this.supperForm[key] = res.data[key]
            }
            this.remarks = res.data.remarks
            if (res.data.status) {
              this.status = res.data.status
            }

            // 展示图片处理
            const srcList = this.supperForm.businessLicense
              ? this.supperForm.businessLicense.split(',')
              : []
            this.url = this.imgBaseUrl + srcList[0]
            srcList.forEach(item => {
              this.srcList.push(this.imgBaseUrl + item)
            })
            console.log(this.url)
            console.log(this.srcList)
          }
        })
    },
    // 处理图片上传
    handleSuccess(res, file, fileList) {
      this.supperForm.businessLicense = fileList
    },
    handleRemove(file, fileList) {
      this.supperForm.businessLicense = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        // 解析图片上传路径
        // console.log(this.supperForm)
        const businessLicense = []
        this.supperForm.businessLicense.forEach(item => {
          businessLicense.push(item.response.data)
        })
        this.supperForm.businessLicense = businessLicense.join(',')
        console.log(this.supperForm)
        this.axios
          .post(`/api/supplier/register/apply`, this.supperForm)
          .then(res => {
            console.log(res)
            if (res.code !== 200) {
              console.log(res.message)
              this.$message.warning(res.message)
            }
            if (res.code === 200) {
              this.$router.push('/supplierApply')
            }
          })
      })
    },
    // 返回
    close() {
      this.$router.push('/supplierApply')
    },
    approvePassOrNoPass(obj, callback) {
      this.axios.post(`/api/supplier/register/audit`, obj).then(res => {
        console.log(res)
        if (res.code === 200) {
          callback && callback(res)
        }
      })
    },
    // 审核通过
    approvePass() {
      this.$refs.supperRef.validate(valid => {
        if (!valid) return
        this.$confirm('审核通过确认', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const _this = this
            this.approvePassOrNoPass(
              {
                id: this.$route.query.id,
                status: 'AUDIT_PASS'
              },
              function(res) {
                if (res.code == 200) {
                  _this.$message({
                    type: 'success',
                    message: '审核成功!'
                  })
                  _this.$router.push('/supplierApply')
                }
              }
            )
          })
          .catch(() => {})
      })
    },
    // 审核不通过
    approveNoPass() {
      this.$refs.supperRef.validate(valid => {
        if (!valid) return
        this.$prompt('', '审核不通过确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputPlaceholder: '请输入不通过原因',
          inputPattern: /[\s\S]{1,1000}/,
          inputErrorMessage: '请输入不通过原因'
        })
          .then(({ value }) => {
            const _this = this
            this.approvePassOrNoPass(
              {
                id: this.$route.query.id,
                status: 'AUDIT_FAIL',
                remarks: value
              },
              function(res) {
                if (res.code == 200) {
                  _this.$message({
                    type: 'success',
                    message: '审核成功!'
                  })
                  _this.$router.push('/supplierApply')
                }
              }
            )
          })
          .catch(() => {})
      })
    }
  }
}
</script>

<style>
.noPass .el-input__inner {
  color: red !important;
}
</style>
