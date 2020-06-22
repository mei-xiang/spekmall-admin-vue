<template>
  <!-- 商品管理列表 -->
  <div class="content">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <el-form-item label="">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入产品名称、供应商名称、编号搜索"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品类别：">
        <el-input v-model="searchForm.categoryId"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder="状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="已发布" value="UPER_SHELF"></el-option>
          <el-option label="已下架" value="LOWER_SHELF"></el-option>
          <el-option label="待审核" value="AUDIT_PROCESS"></el-option>
          <el-option label="审核不通过" value="AUDIT_UNPASS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间：">
        <el-date-picker
          v-model="searchForm.publishDate[0]"
          type="datetime"
          placeholder="选择起始日期"
          @change="startChange"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchForm.publishDate[1]"
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
    <el-table :data="productData" border style="width: 100%;">
      <el-table-column type="index" label="序号" fixed></el-table-column>
      <el-table-column
        prop="code"
        label="产品编号"
        width="120"
      ></el-table-column>
      <el-table-column prop="category" label="产品类别（末级）" width="150">
      </el-table-column>
      <el-table-column
        prop=""
        label="产品中文名称"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="price" label="价格" width="130"> </el-table-column>
      <el-table-column
        prop="supplierOutput.name"
        label="供应商名称"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="showIndex" label="是否主要产品" width="100">
      </el-table-column>
      <el-table-column prop="" label="是否猜你喜欢" width="100">
      </el-table-column>
      <el-table-column prop="lastUpDate" label="最后发布日期" width="133">
      </el-table-column>
      <el-table-column prop="lastModifyDate" label="最后编辑日期" width="133">
      </el-table-column>
      <el-table-column label="产品状态" width="85">
        <template slot-scope="scope">
          <span>{{ scope.row.status.text || "" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理产品">
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
            @click="handleApproval(scope.$index, scope.row)"
            >审核</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleLookApproval(scope.$index, scope.row)"
            >查看审核</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleSetLike(scope.$index, scope.row)"
            >设置猜你喜欢</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleCloseLike(scope.$index, scope.row)"
            >取消猜你喜欢</el-button
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
export default {
  data() {
    const token = getStore({ name: "access_token", type: "string" });
    return {
      // 搜索表单
      searchForm: {
        keyword: "",
        categoryId: "",
        status: "",
        token: token || "",
        page: 0,
        size: 20,
        publishDate: [] // 起止时间
      },
      total: null,
      productData: [], // 列表数据
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
  filters: {
    imgUrlFormat(urlStr) {
      if (!urlStr) urlStr = "";
      const srcList = urlStr.split(",");
      return this.imgBaseUrl + srcList[0];
    }
  },
  methods: {
    getApplyList() {
      this.axios
        .get(`${this.baseUrl}/api/product/search`, this.searchForm)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.productData = res.data.content;
            this.searchForm.page = res.data.number;
            this.searchForm.size = res.data.size;
            this.total = res.data.totalElements;
          }
        });
    },
    startChange() {
      this.searchForm.publishDate[0] = this.$timeDate(
        this.searchForm.publishDate[0]
      );
    },
    endChange() {
      this.searchForm.publishDate[1] = this.$timeDate(
        this.searchForm.publishDate[1]
      );
    },
    // 查询
    query() {
      this.searchForm.page = 0;
      if (
        new Date(this.searchForm.publishDate[0]).getTime() >
        new Date(this.searchForm.publishDate[1]).getTime()
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
      this.searchForm.page = val;
      this.getApplyList();
    },
    handleDetail(index, row) {
      console.log(index, row);
      // 查看 type：1   审核 type：2   新增 type：3
      // this.$router.push({
      //   path: "/supperApplyInfo",
      //   query: { id: row.id, type: 1 }
      // });
    },
    // 审核
    handleApproval(index, row) {
      console.log(index, row);
      // this.$router.push({
      //   path: "/supperApplyInfo",
      //   query: { id: row.id, type: 2 }
      // });
    },
    // 查看审核
    handleLookApproval(index, row) {
      console.log(index, row);
      // this.$router.push({
      //   path: "/supperApplyInfo",
      //   query: { id: row.id, type: 2 }
      // });
    },
    // 设置猜你喜欢
    handleSetLike(index, row) {
      console.log(index, row);
    },
    // 取消猜你喜欢
    handleCloseLike(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style scopde>
.content {
  height: 100%;
}
</style>
