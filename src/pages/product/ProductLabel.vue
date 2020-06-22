<template>
  <!-- 商品标签管理 -->
  <div class="content">
    <!-- 表格区域 -->
    <el-button
      type="button"
      class="el-button el-button--primary el-button--mini"
      icon="el-icon-circle-plus-outline"
      style="margin-bottom:20px"
      @click="addSupplier"
    >
      新增
    </el-button>
    <el-table :data="labelData" border style="width: 720px">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="type" label="标签类型" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">自营渠道</span>
          <span v-if="scope.row.type == 2">运营产品标签</span>
          <span v-if="scope.row.type == 3">商家添加标签</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品标签名称" width="150">
      </el-table-column>
      <el-table-column prop="ico" label="图标" width="150"> </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看对话框 -->
    <el-dialog :visible.sync="isShowDialog" :title="type==1?'修改':'新增'">
      <el-form
        :model="lookBuyerForm"
        ref="lookBuyerRef"
        label-width="100px"
        class="demo-ruleForm"
        center
      >
        <el-form-item label="标签名称">
          <el-input v-model="lookBuyerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-input v-model="lookBuyerForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="标签图标">
          <el-input v-model="lookBuyerForm.email"></el-input>
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
export default {
  data() {
    return {
      labelData: [],
      isShowDialog: false,
      // 对话框数据
      lookBuyerForm: {},
      type: '' // 对话框类型 新增/编辑
    };
  },
  created() {
    this.getBuyerList();
  },
  methods: {
    getBuyerList() {
      this.axios.get(`${this.baseUrl}/api/tag/list`).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.labelData = res.data;
        }
      });
    },
    addSupplier(){
      console.log('添加')
      this.isShowDialog = true;
      this.type = 2
    },
    // 修改
    handleEdit(index, row) {
      console.log(index, row);
      this.isShowDialog = true;
      this.type = 1
      this.axios
        .get(`${this.baseUrl}/api/buyer/info`, {
          id: row.id,
          token: this.$token
        })
        .then(res => {
          console.log(res);
          if (res.code != 200) return;
          this.lookBuyerForm = res.data;
        });
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("确认是否禁用该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post(`${this.baseUrl}/api/buyer/disable`, {
              id: row.id,
              token: this.$token
            })
            .then(res => {
              console.log("aaa");
              if (res.code != 200) return;
              this.$message({
                type: "success",
                message: "禁用成功!"
              });
              this.getBuyerList();
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scopde></style>
