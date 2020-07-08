<template>
  <!-- 商品类别管理 -->
  <div class="content">
    <el-button
      type="button"
      class="el-button el-button--default el-button--mini addCategory"
      icon="el-icon-circle-plus-outline"
      @click="addCategory"
    >添加类别</el-button>
    <div class="box">
      <div class="left">
        <p>分类列表</p>
        <div class="tree">
          <el-tree :data="categoryData" :props="setCategory()" @node-click="handleNodeClick"></el-tree>
        </div>
      </div>
      <div class="right">
        <p>类别属性</p>
        <el-form
          :model="categoryForm"
          :rules="categoryRules"
          ref="categoryRef"
          label-width="100px"
          class="categoryForm"
        >
          <el-form-item label="类别ID" prop="id">
            <el-input v-model="categoryForm.id" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="类别编码" prop="code">
            <el-input v-model="categoryForm.code"></el-input>
          </el-form-item>
          <el-form-item label="名称(中文)" prop="name">
            <el-input v-model="categoryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="类别级别" prop="level">
            <el-radio-group v-model="categoryForm.level">
              <el-radio :label="1" :disabled="disabled">一级</el-radio>
              <el-radio :label="2" :disabled="disabled">二级</el-radio>
              <el-radio :label="3" :disabled="disabled">三级</el-radio>
              <el-radio :label="4" :disabled="disabled">四级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updataCategory('categoryRef')">更新名称</el-button>
            <el-button @click="resetForm('categoryRef')">隐藏</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getStore } from 'js/store'
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
        page: 0,
        size: 20,
        dates: [] // 起止时间
      },
      total: null,
      buyerData: [],
      isShowDialog: false,
      // 对话框数据
      lookBuyerForm: {},
      categoryData: [],
      categoryForm: {
        id: '',
        code: '',
        name: '',
        level: 1
      },
      categoryRules: {
        id: [{ required: true, message: '类别ID不能为空', trigger: 'blur' }],
        code: [
          { required: true, message: '类别编码不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        level: [
          { required: true, message: '请选择类别级别', trigger: 'change' }
        ]
      },
      disabled: true
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取产品类别
    getCategoryList() {
      this.axios.get(`/api/category/list`).then(res => {
        console.log(res)
        const resData = res.data

        if (resData) {
          // 递归让后台获取的不规范数据规范
          // （childrens中无数据剔除，否则层级菜单组件最后一层为空无法选中）
          const parse = array => {
            array.map(item => {
              if (Array.isArray(item.childrens)) {
                if (item.childrens.length === 0) {
                  delete item.childrens
                } else {
                  parse(item.childrens)
                }
              } else {
                delete item.childrens
              }
            })
          }
          parse(resData)
        }
        this.categoryData = resData
      })
    },
    setCategory(checkStrictly) {
      return {
        value: 'id',
        children: 'childrens',
        label: 'name'
      }
    },
    // 选中节点
    handleNodeClick(data) {
      console.log(data)
      // this.categoryForm = JSON.parse(JSON.stringify(data))
      for (let key in this.categoryForm) {
        this.categoryForm[key] = data[key]
      }
    },
    addCategory() {},
    // 修改类别名称
    updataCategory(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        console.log(this.categoryForm)
        this.axios.put(`/api/category/modify`, this.categoryForm).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.getCategoryList()
          }
        })
      })
    },
    // 删除类别
    resetForm(formName) {
      this.axios
        .del(`/api/category/delete?id=${this.categoryForm.id}`)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.getCategoryList()
          }
        })
    }
  }
}
</script>

<style scoped>
.content {
  height: 100%;
  overflow: hidden;
}
.box {
  display: flex;
  height: 90%;
  box-sizing: border-box;
}
.left {
  width: 30%;
  height: 100%;
  margin-right: 30px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  overflow: hidden;
}
.right {
  width: 70%;
  height: 100%;
  border: 1px solid #ccc;
}
.box p {
  font-size: 16px;
  line-height: 50px;
  height: 50px;
  border-bottom: 1px solid #ccc;
  padding-left: 30px;
}
.addCategory {
  margin-bottom: 20px;
}
.tree {
  box-sizing: border-box;
  padding: 20px 20px 0 20px;
  height: calc(100% - 50px);
  overflow: auto;
}
.categoryForm {
  width: 500px;
  padding: 20px;
  padding-left: 100px;
}
</style>
