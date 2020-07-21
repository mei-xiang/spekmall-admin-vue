<template>
  <!-- 供应商会员管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label>
        <el-input v-model="searchForm.keyword" placeholder="请输入编号、手机、名称搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value></el-option>
          <el-option label="已启用" value="ENABLED"></el-option>
          <el-option label="已停用" value="DISABLED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否金牌供应商：">
        <el-select v-model="searchForm.vip">
          <el-option label="全部" value></el-option>
          <el-option label="否" value="0"></el-option>
          <el-option label="是" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="searchForm.dates[0]"
          type="datetime"
          placeholder="选择起始日期"
          @change="startChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dates[1]"
          type="datetime"
          placeholder="选择结束日期"
          @change="endChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="query" icon="el-icon-search" @click="query" size="mini">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="memberData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="供应商编号" width="140"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="190" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.supplierCompanyOutput">{{ scope.row.supplierCompanyOutput.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
          <!-- <span
            v-if="scope.row.supplierCompanyOutput&&scope.row.supplierCompanyOutput.companyLinkMan"
          >{{ scope.row.supplierCompanyOutput.companyLinkMan.mobile }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop label="地区" width="140">
        <template slot-scope="scope">
          <span
            v-if="scope.row.supplierCompanyOutput&&scope.row.supplierCompanyOutput.companyLinkMan"
          >
            {{ scope.row.supplierCompanyOutput.companyLinkMan.province
            }} {{ scope.row.supplierCompanyOutput.companyLinkMan.city }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.account">{{ scope.row.account.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业认证状态" width="130">
        <template slot-scope="scope">
          <template v-if="scope.row.supplierCompanyOutput">
            <span v-if="scope.row.supplierCompanyOutput.companyValidity==0">未认证</span>
            <span v-if="scope.row.supplierCompanyOutput.companyValidity==1">待认证</span>
            <span v-if="scope.row.supplierCompanyOutput.companyValidity==2">认证通过</span>
            <span v-if="scope.row.supplierCompanyOutput.companyValidity==3">认证不通过</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="金牌供应商" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.vip == 0">否</span>
          <span v-if="scope.row.vip == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="金牌时效周期" width="260">
        <template slot-scope="scope">
          <span v-if="!scope.row.vipDate || !scope.row.vipExpired"></span>
          <span v-else>
            {{
            scope.row.vipDate + " - " + scope.row.vipExpired
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="注册时间" width="170"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <template v-if="scope.row.account">
            <el-button
              size="mini"
              type="text"
              @click="handleStop(scope.$index, scope.row)"
              v-if="scope.row.account.status.status == 0"
            >停用</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleStart(scope.$index, scope.row)"
              v-if="scope.row.account.status.status == 1"
            >启用</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleCancelGold(scope.$index, scope.row)"
              v-if="scope.row.account.status.status == 0 && scope.row.vip == 1"
            >取消金牌</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleBecomeGold(scope.$index, scope.row)"
              v-if="scope.row.account.status.status == 0 && scope.row.vip == 0"
            >成为金牌</el-button>
          </template>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.supplierCompanyOutput&&scope.row.supplierCompanyOutput.companyValidity==1"
            @click="handleValidity(scope.$index, scope.row)"
          >企业认证</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.page + 1"
      :page-sizes="[20, 30, 50]"
      :page-size.sync="searchForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 成为金牌会员对话框 -->
    <el-dialog
      title="填写金牌供应商时效周期"
      :visible.sync="isShowGlodDialog"
      @close="handleCloseGlod"
      class="glodDialog"
    >
      <el-form :model="glodForm">
        <el-form-item label>
          <el-col :span="11">
            <el-date-picker
              v-model="glodForm.dates[0]"
              type="datetime"
              placeholder="选择起始日期"
              @change="startChange"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="glodForm.dates[1]"
              type="datetime"
              placeholder="选择结束日期"
              @change="endChange"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowGlodDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleGlod">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      title="企业认证审核"
      :visible.sync="isShowApprovalDialog"
      @close="handleCloseApproval"
      class="approvalDialog"
    >
      <el-button @click="approveNoPass" type="danger">认证不通过</el-button>
      <el-button @click="approvePass" type="primary">认证通过</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { setStore, getStore } from 'js/store'
import axios from 'axios'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        status: '',
        token: token || '',
        vip: '',
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      memberData: [], // 列表数据
      // 设置金牌对话框数据
      isShowGlodDialog: false,
      glodForm: {
        dates: []
      },
      id: null, // 当前id
      validity_id: null,
      isShowApprovalDialog: false // 控制认证对话框显示与隐藏
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    getMemberList() {
      this.axios.post(`/api/supplier/search`, this.searchForm).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.memberData = res.data.content
          this.searchForm.page = res.data.number
          this.searchForm.size = res.data.size
          this.total = res.data.totalElements
        }
      })
    },
    startChange() {
      if (this.searchForm.dates.length > 0)
        this.searchForm.dates[0] = this.$timeDate(this.searchForm.dates[0])
      if (this.glodForm.dates.length > 0)
        this.glodForm.dates[0] = this.$timeDate(this.glodForm.dates[0])
    },
    endChange() {
      if (this.searchForm.dates.length > 0)
        this.searchForm.dates[1] = this.$timeDate(this.searchForm.dates[1])
      if (this.glodForm.dates.length > 0)
        this.glodForm.dates[1] = this.$timeDate(this.glodForm.dates[1])
    },
    // 查询
    query() {
      this.searchForm.page = 0
      if (
        new Date(this.searchForm.dates[0]).getTime() >
        new Date(this.searchForm.dates[1]).getTime()
      ) {
        return this.$message.warning('起始时间不能大于结束时间！')
      }
      this.getMemberList()
    },
    handleSizeChange(val) {
      this.searchForm.size = val
      this.getMemberList()
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getMemberList()
    },
    // 查看
    handleDetail(index, row) {
      console.log(index, row)
      // type查看类型
      this.$router.push({
        path: '/supplierMemberInfo',
        query: { id: row.id }
      })
      setStore({
        name: 'supplierMemberInfo',
        content: { id: row.id }
      })
    },
    // 停用
    handleStop(index, row) {
      this.$prompt('停用后此账号将不可登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入停用原因',
        inputPattern: /[\s\S]{1,1000}/,
        inputErrorMessage: '请输入原因'
      })
        .then(({ value }) => {
          console.log(value)
          this.axios
            .post(`/api/supplier/disable`, {
              id: row.id,
              status: 'DISABLED',
              remarks: value
            })
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '停用成功'
                })
                this.getMemberList()
              }
            })
        })
        .catch(() => {})
    },
    // 启用
    handleStart(index, row) {
      console.log(index, row)
      this.$confirm('是否启用此帐号', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios
            .post(`/api/supplier/enable`, {
              id: row.id
            })
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '启用成功'
                })
                this.getMemberList()
              }
            })
        })
        .catch(() => {})
    },
    // 企业认证
    handleValidity(index, row) {
      console.log(index, row)
      this.validity_id = row.supplierCompanyOutput.id
      this.isShowApprovalDialog = true
    },
    // 显示成为金牌对话框
    handleBecomeGold(index, row) {
      console.log(index, row)
      this.isShowGlodDialog = true
      this.id = row.id // 设置当前id
      console.log(this.id)
    },
    // 取消金牌
    handleCancelGold(index, row) {
      console.log(index, row)
      this.$prompt('是否取消金牌供应商', '取消原因：', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入取消原因',
        inputPattern: /\S/,
        inputErrorMessage: '请输入原因'
      })
        .then(({ value }) => {
          this.axios
            .put(`/api/supplier/vip`, {
              id: row.id,
              vip: false,
              remarks: value
            })
            .then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '取消金牌成功'
                })
                this.getMemberList()
              }
            })
        })
        .catch(() => {})
    },
    // 成为金牌
    handleGlod() {
      if (
        new Date(this.glodForm.dates[0]).getTime() >
        new Date(this.glodForm.dates[1]).getTime()
      ) {
        return this.$message.warning('起始时间不能大于结束时间！')
      }
      this.axios
        .put(`/api/supplier/vip`, {
          id: this.id,
          vip: true,
          vipDate: this.glodForm.dates[0],
          vipExpired: this.glodForm.dates[1]
        })
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '成为金牌成功'
            })
            this.isShowGlodDialog = false
            this.getMemberList()
          }
        })
    },
    // 对话框关闭数据清除
    handleCloseGlod() {
      this.glodForm.dates = []
      this.id = null
    },
    approvePassOrNoPass(obj, callback) {
      this.axios.post(`/api/supplier/company/validity`, obj).then(res => {
        console.log(res)
        if (res.code === 200) {
          callback && callback(res)
        }
      })
    },
    // 审核通过
    approvePass() {
      const _this = this
      this.$confirm('审核通过确认', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.approvePassOrNoPass(
            {
              id: _this.validity_id,
              validity: 2
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.isShowApprovalDialog = false
                _this.getMemberList()
              }
            }
          )
        })
        .catch(() => {})
    },
    // 审核不通过
    approveNoPass() {
      const _this = this
      this.$prompt('', '审核不通过确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请输入不通过原因',
        inputPattern: /[\s\S]{1,1000}/,
        inputErrorMessage: '请输入不通过原因'
      })
        .then(({ value }) => {
          _this.approvePassOrNoPass(
            {
              id: _this.validity_id,
              validity: 3,
              remarks: value
            },
            function(res) {
              if (res.code == 200) {
                _this.$message({
                  type: 'success',
                  message: '审核成功!'
                })
                _this.isShowApprovalDialog = false
                _this.getMemberList()
              }
            }
          )
        })
        .catch(() => {})
    },
    // 对话框关闭
    handleCloseApproval() {
      this.validity_id = null
    }
  }
}
</script>

<style>
.glodDialog .el-dialog {
  width: 600px !important;
  text-align: center;
}
.glodDialog .el-dialog__body {
  padding-left: 30px;
}
.approvalDialog .el-dialog {
  width: 500px !important;
  height: 250px !important;
  text-align: center;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.approvalDialog .el-dialog__body {
  padding-left: 30px;
  padding-top: 70px;
}
</style>
