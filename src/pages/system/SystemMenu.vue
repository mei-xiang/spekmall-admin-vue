<!--
 * @Description: 菜单管理
 * @Author: jiaxin
 * @LastEditors: jiaxin
 * @Date: 2018-11-27 12:45:50
 * @LastEditTime: 2019-08-22 18:09:48
 -->

<!-- 菜单管理 -->
<template>
  <div class="menu content">
    <!-- 顶部功能区 -->
    <div class="setup-box top clearfix">
      <div class="form-box fl">
        <el-form :inline="true" :model="searchData" class="top-search fl">
          <el-form-item label="菜单名称：">
            <el-input v-model="searchData.menuName" size="mini" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="是否启用：">
            <el-select v-model="searchData.isEnable" size="mini">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box fr">
        <btn-list
          :btnListData="btnListData"
          @addRootNode="addRootNode"
          @open="closeOrOpenTree(true)"
          @close="closeOrOpenTree(false)"
        ></btn-list>
      </div>
    </div>
    <!-- 树形表格区 -->
    <Table-tree
      ref="tableTree"
      :draggable="true"
      :filterText="filterText"
      :treeHeight="tableMaxH-54"
      :headerData="headerData"
      :bodyData="treeData"
      @clickAdd="clickAdd"
      @clickEdit="clickEdit"
      @clickDelete="clickDelete"
    ></Table-tree>

    <!-- 新增、修改弹框 -->
    <el-dialog
      :title="isAddType?'新增':'修改'"
      v-dialogDrag
      @close="closeAddOrEditDialog"
      :visible.sync="showAddOrEditDialog"
    >
      <main-form
        ref="AddOrEditRorm"
        :rules="rules"
        :data="chioceData"
        :form="formConfig"
        :options="options"
        @nodeChange="nodeChange"
      ></main-form>
      <div slot="footer">
        <el-button type="primary" size="small" v-if="isAddType" @click="submit(true)">确 定</el-button>
        <el-button type="primary" size="small" v-else @click="submit(false)">确 定</el-button>
        <el-button @click="showAddOrEditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import TableTree from "@/components/tree/TableTree";
export default {
  name: "Menu",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      searchData: {
        menuName: "",
        isEnable: null
      },
      filterText: "",
      tableMaxH: 500,
      // 按钮列表部分
      btnListData: [
        {
          label: "新增一级节点",
          icon: "el-icon-circle-plus-outline",
          disabled: () => {
            return false;
          },
          permission: "systemMenu",
          fn: "addRootNode"
        },
        {
          label: "展开",
          icon: "el-icon-download",
          disabled: () => {
            return this.noSingle;
          },
          fn: "open"
        },
        {
          label: "折叠",
          icon: "el-icon-upload2",
          disabled: () => {
            return this.noSingle && this.noMore;
          },
          fn: "close"
        }
      ],
      // 树形表格区 -----------------------------------
      headerData: [
        {
          id: 0,
          key: "menuName",
          label: "菜单名称",
          width: "20%",
          align: "center",
          bodyAlign: "center"
        },
        {
          id: 2,
          key: "orderNum",
          label: "序号",
          width: "10%",
          align: "center",
          bodyAlign: "center"
        },
        {
          id: 1,
          key: "btn",
          label: "新增/编辑/删除",
          width: "20%",
          align: "center",
          bodyAlign: "center",
          add: data => {
            return this.$isPermission("systemMenu");
          },
          edit: data => {
            return this.$isPermission("systemMenu");
          },
          delete: data => {
            if (!this.$isPermission("systemMenu") || data.children) {
              return false;
            } else {
              return true;
            }
          }
        },
        {
          id: 2,
          key: "isEnable",
          label: "启用状态",
          width: "10%",
          align: "center",
          bodyAlign: "center",
          format: [
            { id: true, label: "启用" },
            { id: false, label: "禁用" }
          ]
        },
        {
          id: 2,
          key: "menuCode",
          label: "页面编码",
          width: "20%",
          align: "center",
          bodyAlign: "center"
        },
        {
          id: 2,
          key: "menuUrl",
          label: "URL",
          width: "10%",
          align: "center",
          bodyAlign: "center"
        }
      ],
      treeData: [],
      originListData: [],
      // 新增 编辑 弹窗部分
      labelWidth: "140px",
      isAddType: true,
      showAddOrEditDialog: false,
      chioceData: {
        parentId: null,
        parentValue: [0],
        pName: null,
        id: null,
        pageId: null,
        menuName: null,
        icon: null,
        orderNum: null,
        isEnable: true
      },
      formConfig: [
        [
          {
            span: 24,
            labelWidth: "120px",
            list: [
              {
                type: "cascader",
                label: "父节点：",
                prop: "parentId",
                value: "parentValue",
                optionCode: "menuTree",
                changeFn: "nodeChange",
                defaultProps: {
                  value: "id",
                  children: "children",
                  label: "menuName",
                  checkStrictly: true
                }
              },
              {
                type: "text",
                label: "菜单名称：",
                prop: "menuName"
              },
              {
                type: "text",
                label: "菜单编码：",
                prop: "menuCode"
              },
              {
                type: "text",
                label: "URL：",
                prop: "menuUrl"
              },
              {
                type: "number",
                label: "序号：",
                prop: "orderNum"
              },

              {
                type: "switch",
                label: "状态：",
                prop: "isEnable"
              }
            ]
          }
        ]
      ],
      options: {
        pageOption: [],
        menuTree: []
      },
      isShowMoreSearch: false,
      rules: {
        menuName: [
          this.$rules.setRequired("请输入菜单名称"),
          this.$rules.setLength(1, 20)
        ],
        menuCode: [
          this.$rules.setRequired("请输入菜单编码"),
          this.$rules.setCode(4, 20)
        ],
        orderNum: this.$rules.checkInterNum(false)
      }
    };
  },
  components: {
    TableTree
  },
  methods: {
    // 右侧toolbar 工具栏区域 ----------------------------------
    // 展开、折叠树形控件
    closeOrOpenTree(isOpen) {
      this.$refs.tableTree.closeOrOpenTree(isOpen);
    },

    // 获取页面列数据
    getList(val) {
      this.axios
        .get(`/api/menu`, {
          pageNum: 1,
          pageSize: 999999999
        })
        .then(res => {
          console.log(res , "jhhh")
          this.originListData = res.data;
          this.buildTree(this.originListData);
        });
    },
    // 根据选择条件构建树
    buildTree(data) {
      if (!Array.isArray(data)) return;
      const { menuName, isEnable } = this.searchData;
      let newData = this.$clone(data);
      let set = new Set();
      let obj = {};
      newData.forEach(item => {
        obj[item.id] = item;
      });
      if (menuName !== "" || isEnable !== null) {
        for (let index = 0; index < newData.length; index++) {
          const item = newData[index];
          if (
            menuName !== "" &&
            item.menuName.toLowerCase().indexOf(menuName.toLowerCase()) === -1
          ) {
            continue;
          }
          // eslint-disable-next-line eqeqeq
          if (isEnable !== null && item.isEnable != isEnable) {
            continue;
          }
          // 将当前节点 及其所有父节点 添加到 set 中
          const addSet = item => {
            set.add(item);
            if (item.parentId !== 0) {
              set.add(obj[item.parentId]);
            }
          };
          addSet(item);
        }
        newData = Array.from(set);
      }
      newData.sort((a, b) => {
        return a.orderNum - b.orderNum;
      });
      this.treeData = this.$treeFn.toTree(newData, 0, {
        name: "menuName",
        pId: "parentId",
        pName: "pName",
        children: "children",
        originNode: "根节点"
      });
    },
    setMenuOption(disabledId) {
      let treeCopy = this.treeData;
      if (disabledId) {
        treeCopy = this.$clone(treeCopy);
        let obj = this.$treeFn.findNodeById(treeCopy, disabledId, {
          children: "children"
        });
        obj.disabled = true;
        delete obj.children;
      }
      // id 为 0的时候 element 组件报错 为暂时避免错误 用 "0" 代替
      this.$set(this.options, "menuTree", [
        {
          id: "0",
          menuName: "根节点",
          children: treeCopy
        }
      ]);
    },
    // 树形表格组件部分 ---------------------------------------
    // 获取所有父节点
    getAllPId(val) {
      return this.$treeFn.findAllPId(this.treeData, val, {
        children: "children",
        pId: "parentId"
      });
    },
    // 新增一级根节点
    addRootNode() {
      this.setMenuOption();
      this.chioceData.pName = "根节点";
      this.chioceData.parentId = 0;
      this.chioceData.parentValue = ["0"];
      this.isAddType = true;
      this.showAddOrEditDialog = true;
    },
    // 点击新增按钮
    clickAdd(data) {
      this.chioceData.pName = data.menuName;
      this.chioceData.parentId = data.id;
      this.chioceData.parentValue = ["0", ...this.getAllPId(data.id)];
      this.setMenuOption();
      this.isAddType = true;
      this.showAddOrEditDialog = true;
    },
    // 点击修改
    clickEdit(data) {
      this.axios.get(`/api/menu/${data.id}`).then(res => {
        this.chioceData = res.data;
        this.chioceData.pName = data.pName;
        if (data.parentId === 0) {
          this.chioceData.parentValue = ["0"];
        } else {
          this.chioceData.parentValue = ["0", ...this.getAllPId(data.parentId)];
        }
        this.setMenuOption(data.id);
        this.isAddType = false;
        this.showAddOrEditDialog = true;
      });
    },
    // 选择节点
    nodeChange(arr, node) {
      const data = node[0].data;
      this.chioceData.pName = data.menuName;
      this.chioceData.parentId = Number(data.id);
    },
    // 点击删除删除
    clickDelete(node, data) {
      this.$delBtn(() => {
        this.axios.del(`/api/menu/${node.id}`).then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getList();
        });
      });
    },
    // 新增完成
    submit(isAddType) {
      let [type, url] = [null, null];
      if (isAddType) {
        type = "post";
        url = "/api/menu";
      } else {
        type = "put";
        url = `/api/menu`;
      }
      this.$refs["AddOrEditRorm"].validate(valid => {
        if (valid) {
          this.axios[type](url, this.chioceData, {String:"json"}).then(res => {
            console.log(res , "xinzeng")
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.showAddOrEditDialog = false;
            this.getList();
          });
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗 重置数据
    closeAddOrEditDialog() {
      // 关闭弹框初始化数据
      this.chioceData = this.$options.data.call(this).chioceData;
    }
  },
  watch: {
    searchData: {
      deep: true,
      handler: function(val) {
        this.buildTree(this.originListData);
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="stylus">
$height = 30px;

.menu {
  height: 100%;

  .top {
    min-height: 50px;

    .top-search {
      width: 850px;

      >>>.el-form-item {
        .el-form-item__label {
          padding-left: 0;
          width: 80px;
        }
      }
    }

    .right-btns {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
