<template>
  <!-- 供应商会员管理 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入编号、手机、名称搜索"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="已启用" value="ENABLED"></el-option>
          <el-option label="已停用" value="DISABLED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否金牌供应商：">
        <el-select v-model="searchForm.vip">
          <el-option label="全部" value=""></el-option>
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
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.dates[1]"
          type="datetime"
          placeholder="选择结束日期"
          @change="endChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          class="query"
          icon="el-icon-search"
          @click="query"
          size="mini"
          >查询</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="memberData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column
        prop="name"
        label="供应商编号"
        width="190"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="供应商名称"
        width="190"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="mobile" label="手机" width="150">
      </el-table-column>
      <el-table-column
        prop="supplierCompanyOutput.legalPersonName"
        label="地区"
        width="190"
      >
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status.text }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="金牌供应商"
        width="190"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="金牌时效周期"
        width="190"
      ></el-table-column>
      <el-table-column prop="createDate" label="注册时间" sortable>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.$index, scope.row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleStop(scope.$index, scope.row)"
            >停用</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleStart(scope.$index, scope.row)"
            >启用</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleCancelGold(scope.$index, scope.row)"
            >取消金牌</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleBecomeGold(scope.$index, scope.row)"
            >成为金牌</el-button
          >
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
    >
    </el-pagination>

    <!-- 查看对话框 -->
    <el-dialog :visible.sync="isShowDialog" title="查看">
      <el-form
        :model="lookBuyerForm"
        ref="lookBuyerRef"
        label-width="100px"
        class="demo-ruleForm"
        center
      >
        <el-form-item label="姓名">
          <el-input v-model="lookBuyerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="lookBuyerForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="lookBuyerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="lookBuyerForm.address"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="lookBuyerForm.company"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="isShowDialog = false"
          >确 定</el-button
        >
        <el-button @click="isShowDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStore } from "js/store";
import axios from "axios";
export default {
  data() {
    const token = getStore({ name: "access_token", type: "string" });
    return {
      // 搜索表单
      searchForm: {
        keyword: "",
        status: "",
        token: token || "",
        vip: "",
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      memberData: [], // 列表数据
      isShowDialog: false,
      // 对话框数据
      lookBuyerForm: {},
      // 列表图片展示
      url: "",
      srcList: []
    };
  },
  created() {
    this.getApplyList();
  },
  methods: {
    getApplyList() {
      supplierCompanyOutput.businessLicense;
      this.axios
        .post(`${this.baseUrl}/api/supplier/search`, this.searchForm)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.memberData = res.data.content;
            this.searchForm.page = res.data.number;
            this.searchForm.size = res.data.size;
            this.total = res.data.totalElements;
          }
        });
    },
    startChange() {
      this.searchForm.dates[0] = this.$timeDate(this.searchForm.dates[0]);
    },
    endChange() {
      this.searchForm.dates[1] = this.$timeDate(this.searchForm.dates[1]);
    },
    // 查询
    query() {
      this.searchForm.page = 0;
      if (
        new Date(this.searchForm.dates[0]).getTime() >
        new Date(this.searchForm.dates[1]).getTime()
      ) {
        return this.$message.warning("起始时间不能大于结束时间！");
      }
      this.getApplyList();
    },
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.getApplyList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val - 1;
      this.getApplyList();
    },
    // 查看
    handleDetail(index, row) {
      console.log(index, row);
      // 查看 type：1   审核 type：2   新增 type：3
      this.$router.push({
        path: "/supperApplyInfo",
        query: { id: row.id, type: 1 }
      });
    },
    // 停用
    handleStop(index, row) {
      console.log(index, row);
      this.$prompt("停用后此账号将不可登录", "备注：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "请输入停用原因",
        inputPattern: /^[A-Za-z0-9.]{5,1000}$/,
        inputErrorMessage: "请输入原因"
      })
        .then(({ value }) => {
          this.axios
            .post(`${this.baseUrl}/api/supplier/disable`, {
              id: row.id,
              status: "DISABLED",
              remarks: value
            })
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "停用成功"
                });
                this.getApplyList();
              }
            });
        })
        .catch(() => {});
    },
    // 启用
    handleStart(index, row) {
      console.log(index, row);
      this.$confirm("是否启用此帐号", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post(`${this.baseUrl}/api/supplier/enable`, {
              id: row.id
            })
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "启用成功"
                });
                this.getApplyList();
              }
            });
        })
        .catch(() => {});
    },
    // 成为金牌
    handleBecomeGold(index, row) {
      console.log(index, row);
      // this.$prompt("填写金牌供应商时效周期", "", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   inputType: "textarea",
      //   inputPlaceholder: "请输入取消原因",
      //   inputPattern: /^[A-Za-z0-9.]{5,1000}$/,
      //   inputErrorMessage: "请输入原因"
      // })
      //   .then(({ value }) => {
      //     this.put
      //       .post(`${this.baseUrl}/api/supplier/vip`, {
      //         id: row.id,
      //         vip: false,
      //         remarks: value
      //       })
      //       .then(res => {
      //         console.log(res);
      //         if (res.code === 200) {
      //           this.$message({
      //             type: "success",
      //             message: "取消金牌成功"
      //           });
      //           this.getApplyList();
      //         }
      //       });
      //   })
      //   .catch(() => {});
    },
    // 取消金牌
    handleCancelGold(index, row) {
      console.log(index, row);
      this.$prompt("是否取消金牌供应商", "取消原因：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "请输入取消原因",
        inputPattern: /^[A-Za-z0-9.]{5,1000}$/,
        inputErrorMessage: "请输入原因"
      })
        .then(({ value }) => {
          this.put
            .post(`${this.baseUrl}/api/supplier/vip`, {
              id: row.id,
              vip: false,
              remarks: value
            })
            .then(res => {
              console.log(res);
              if (res.code === 200) {
                this.$message({
                  type: "success",
                  message: "取消金牌成功"
                });
                this.getApplyList();
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scopde></style>
