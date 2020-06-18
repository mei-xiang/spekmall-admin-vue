<template>
  <!-- 买家会员管理 -->
  <div class="content">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="">
        <el-input
          v-model="formInline.user"
          placeholder="请输入会员编码、手机搜索"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.region" placeholder="状态">
          <el-option label="已启用" value="ENABLED"></el-option>
          <el-option label="已停用" value="DISABLED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-date-picker
          v-model="value1"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <span>~</span>
      <el-form-item>
        <el-date-picker
          v-model="value2"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
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
        >{{ value1 }}-{{ value2 }}
      </el-form-item>
    </el-form>
    <el-table :data="buyerData" border style="width: 100%">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column prop="code" label="会员编码" width="150">
      </el-table-column>
      <el-table-column prop="telephone" label="手机" width="150">
      </el-table-column>
      <el-table-column prop="company" label="公司名称" width="190">
      </el-table-column>
      <el-table-column label="地区" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">已激活</span>
          <span v-if="scope.row.status == 1">已停用</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerDate" label="注册时间" sortable>
      </el-table-column>
      <el-table-column prop="loginDate" label="最后登录时间"> </el-table-column>
      <el-table-column label="操作" width="220">
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
            @click="handleDelete(scope.$index, scope.row)"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStore } from "js/store";
import axios from "axios";
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      buyerData: [],
      value1: "",
      value2: ""
    };
  },
  created() {
    this.getBuyerList();
  },
  methods: {
    getBuyerList() {
      const token = getStore({ name: "access_token", type: "string" });
      this.axios
        .get(`http://192.168.212.13:8010/api/buyer/search`, { token })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.buyerData = res.data.content;
          }
        });
    },
    query() {
      console.log(~new Date(this.value1))
      console.log(~new Date(this.value2))
    },
    handleDetail(index, row) {
      console.log(index, row);
    },
    handleStop(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style scopde></style>
