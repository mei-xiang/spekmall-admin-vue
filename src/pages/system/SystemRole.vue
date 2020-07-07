<template>
  <!-- 商品标签管理 -->
  <div class="content">
    <!-- 表格区域 -->
    <div class="pageTitle">权限设置</div>
    <div class="btn" style="text-align: right; margin:10px 20px">
      <el-button type="primary" size="small" @click="addBtn">新增</el-button>
    </div>
    <el-table :data="labelData" border>
      <el-table-column prop="name" label="角色昵称"></el-table-column>
      <el-table-column label="设置">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="editBtn(scope.row)"
            v-if="scope.row.type != 1"
          >修改权限</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.type != 1"
          >删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增，修改弹框 -->
    <el-dialog
      :title="isAddType?'新增':'修改'"
      v-dialogDrag
      @close="closeDialog"
      :visible.sync="isShowAddOrEdit"
    >
      <main-form ref="mainForm" :data="postData" :form="formConfig" :rules="rule"></main-form>
      <div class="tree-wrap">
        <ul class="clearfix">
          <li class="fl">菜单名称</li>
          <li class="fr">是否可编辑</li>
        </ul>

        <el-scrollbar style="height:100%">
          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            @check-change="checkNode"
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.menuName }}</span>
              <span v-if="data.isPage">
                <el-switch v-model="data.isEditor"></el-switch>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>

      <div slot="footer">
        <el-button type="primary" @click="submit(isAddType)">确 定</el-button>
        <el-button @click="closeAddOrEdit">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      labelData: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          checkList: ["1", "2"],
          isView: true,
          isEdit: false,
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          checkList: [],
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: false
        }
      ],
      isShowAddOrEdit: false,
      isAddType: true,
      treeData: [],
      postData: {
        id: null,
        nameZh: ""
      },
      formConfig: [
        [
          {
            span: 24,
            labelWidth: "120px",
            list: [
              {
                type: "text",
                label: "角色昵称：",
                prop: "name"
              }
            ]
          }
        ]
      ],
      rule: {
        name: [
          this.$rules.setRequired("请输入角色昵称"),
          this.$rules.setLength(1, 20)
        ]
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      this.axios.get(`/api/role?size=100`).then(res => {
        console.log(res, "role");
        if (res.code == 200) {
          this.labelData = res.data.content;
        }
      });
    },

    closeDialog() {
      // 关闭弹框初始化数据
      this.postData = this.$options.data.call(this).postData;
      this.$nextTick(() => {
        this.$refs.mainForm.clearValidate();
      });
    },

    async addBtn() {
      await this.getMenu();
      this.isShowAddOrEdit = true;
      this.isAddType = true;
      this.parseTree("set", []);
    },
    parseTree(type, idsArr) {
      const treeData = this.treeData;
      let result = [];
      const findNode = (arr, ids) => {
        if (!Array.isArray(arr)) return;
        arr.map(item => {
          // 设置模式
          if (type === "set") {
            if (ids.indexOf(item.id) !== -1) {
              item.isEditor = true;
            } else if (item.isPage) {
              item.isEditor = false;
            }
          }
          // 获取数据模式
          if (type === "get") {
            if (item.isPage && item.isEditor && ids.indexOf(item.id) !== -1) {
              result.push(item.id);
            }
          }
          if (item.children && item.children.length !== 0) {
            findNode(item.children, ids);
          }
        });
      };
      findNode(treeData, idsArr);
      return result;
    },

    getMenu() {
      return new Promise((resolve, reject) => {
        this.axios.get("/api/menu").then(res => {
          console.log(res, "qingqiuchengogng");
          this.pIds = [];
          const arr = res.data.map(item => {
            if (!this.$dataIsNull(item.menuUrl)) {
              item.isPage = true;
              item.isEditor = false;
            } else {
              this.pIds.push(item.id);
            }
            return item;
          });
          this.treeData = this.$treeFn.toTree(arr, 0, {
            name: "menuName",
            pId: "parentId",
            pName: "pName",
            children: "children",
            originNode: "根节点"
          });
          resolve();
        });
      });
    },
    checkNode(data, isChoiced) {
      if (data.isPage) data.isEditor = isChoiced;
    },
    async editBtn(data) {
      await this.getMenu();
      this.axios.get(`/api/role/${data.id}`).then(res => {
        console.log(res, "查询编辑")
        const resDate = res.data;
        this.postData = data;
        // 设置勾选项
        const checkedIds = resDate.viewMenuIds.filter(item => {
          if (this.pIds.indexOf(item) === -1) return true;
        });
        this.isAddType = false;
        this.isShowAddOrEdit = true;
        console.log(checkedIds);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedIds);
          this.$nextTick(() => {
            this.parseTree("set", resDate.editMenuIds);
          });
        });
      });
    },
    submit(isAddType) {
      let fn = "post";
      let url = "/api/role";
      if (!isAddType) {
        fn = "put";
        url = `/api/role/`;
      }
      this.$refs["mainForm"].validate(data => { 
        data.code = data.name;
        const checkedIds = this.$refs.tree.getCheckedKeys();
        const halfChecked = this.$refs.tree.getHalfCheckedKeys();
        data.viewMenuIds = [...checkedIds, ...halfChecked];
        data.editMenuIds = this.parseTree("get", checkedIds);
        console.log(data.viewMenuIds, data.editMenuIds, "hhhh");
        this.axios[fn](url, data, { String: "json" }).then(res => {
          this.$message.success("添加成功");
          this.isShowAddOrEdit = false;
          this.getRoleList();
        });
      });
    },

    closeAddOrEdit() {
      this.isShowAddOrEdit = false;
    },
    // 删除
    handleDelete(index, row) {
      this.del(row.id);
    },
    del(id) {
      console.log(this.axios.del);
      this.$confirm(`你确认要删除此角色吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios.del(`/api/role/${id}`).then(res => {
            console.log(res, " 返回");
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getRoleList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="stylus" scopde>
.el-dialog {
  width: 450px !important;
}

.pageTitle {
  font-size: 24px;
  margin-bottom: 20px;
}

/deep/ .custom-tree-node {
  .value {
    margin-left: auto;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 10px;
}

.tree-wrap {
  box-sizing: border-box;
  position: relative;
  padding: 30px 0 0 35px;
  height: 350px;

  ul {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: 48px;
  }

  li {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}
</style>

