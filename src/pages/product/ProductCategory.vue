<template>
  <!-- 商品类别管理 -->
  <div class="content">
    <el-button
      type="button"
      class="el-button el-button--default el-button--mini addCategory"
      icon="el-icon-circle-plus-outline"
      @click="showAddCategory"
      v-if="$isPermission($route.path)"
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
          <el-form-item v-if="$isPermission($route.path)">
            <el-button type="primary" @click="updataCategory('categoryRef')">更新名称</el-button>
            <el-button @click="delCategory('categoryRef')">隐藏</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 添加类别对话框 -->
    <el-dialog :visible.sync="isShowAddCatDialog" title="添加类别" @close="handleClose">
      <el-form
        :model="addCatForm"
        ref="addCatRef"
        :rules="addCatRules"
        label-width="90px"
        class="addCatForm"
      >
        <el-form-item label="上级类别">
          <el-cascader
            key="addCategory"
            ref="addCategoryRef"
            :options="addCategoryData"
            v-model="addCatForm.fid"
            @change="addCategoryChange($event)"
            :props="setAddCategory()"
            filterable
            clearable
            placeholder="请选择上级类别(为空表示一级类别)"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="类别级别" prop="level">
          <el-radio-group v-model="addCatForm.level">
            <el-radio :label="1">一级</el-radio>
            <el-radio :label="2">二级</el-radio>
            <el-radio :label="3">三级</el-radio>
            <el-radio :label="4">四级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类别编码" prop="code">
          <el-input v-model="addCatForm.code" placeholder="请输入类别编码(数字)"></el-input>
        </el-form-item>
        <el-form-item label="名称(中文)" prop="name">
          <el-input v-model="addCatForm.name" placeholder="请输入名称">></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addCategory">添加</el-button>
        <el-button @click="isShowAddCatDialog = false">取 消</el-button>
      </div>
    </el-dialog>
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
      isShowAddCatDialog: false,
      // 添加分类对话框数据
      addCatForm: {
        fid: '',
        code: '',
        name: '',
        level: ''
      },
      addCatRules: {
        code: [
          { required: true, message: '类别编码不能为空', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '只能输入整数' }
        ],
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        level: [
          { required: true, message: '请选择类别级别', trigger: 'change' }
        ]
      },
      addCategoryData: [],
      // 编辑分类数据
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
        this.addCategoryData = JSON.parse(JSON.stringify(resData))

        // 移除添加分类的第四级
        if (this.addCategoryData) {
          const parse = array => {
            array.map(item => {
              if (item.level < 3) {
                if (item.childrens && item.childrens.length > 0) {
                  parse(item.childrens)
                }
              } else {
                delete item.childrens
              }
            })
          }
          parse(this.addCategoryData)
        }
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
    showAddCategory() {
      this.isShowAddCatDialog = true
    },
    // 添加分类处理 -------------------------------------------------------------------------
    addCategoryChange(arr) {
      if (arr.length > 0) {
        this.addCatForm.fid = arr[arr.length - 1]
      }
    },
    setAddCategory(checkStrictly) {
      return {
        value: 'id',
        children: 'childrens',
        label: 'name',
        checkStrictly: true
      }
    },
    // 添加分类
    addCategory() {
      this.$refs.addCatRef.validate(valid => {
        if (!valid) return false
        console.log(this.addCatForm)
        axios({
          url: '/api/category/apply',
          method: 'post',
          params: {
            'category.fid': this.addCatForm.fid,
            'category.level': this.addCatForm.level,
            'category.code': this.addCatForm.code,
            'category.name': this.addCatForm.name,
            pid: this.addCatForm.fid
          }
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.$message.success(res.data.message)
            this.isShowAddCatDialog = false
            this.getCategoryList()
          }
        })
      })
    },
    // 清空添加类别对话框
    handleClose() {
      for (let key in this.addCatForm) {
        this.addCatForm[key] = ''
      }
      this.$refs.addCatRef.resetFields()
    },
    // 修改类别名称
    updataCategory(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        console.log(this.categoryForm)
        this.axios
          .put(
            `/api/category/modify?id=${this.categoryForm.id}&name=${this.categoryForm.name}&code=${this.categoryForm.code}&level=${this.categoryForm.level}`
          )
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              this.$message.success(res.message)
              this.getCategoryList()
            }
          })
      })
    },
    // 删除类别
    delCategory(formName) {
      this.axios
        .del(`/api/category/delete?id=${this.categoryForm.id}`)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$message.success(res.message)
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
.addCatForm {
  transform: translateX(-10px);
}
</style>
