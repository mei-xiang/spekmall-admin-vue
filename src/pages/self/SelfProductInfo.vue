<template>
  <!-- 商品查看 -->
  <div class="content product">
    <h1>
      <span v-if="type==1">查看商品</span>
      <span v-if="type==2">编辑商品</span>
      <span v-if="type==3">发布商品</span>
      <!-- <span class="infoType" v-if="selfProductForm.status.status !== 4">状态：{{ selfProductForm.status.text }}</span>
      <span
        class="infoType"
        v-if="selfProductForm.status.status == 4"
      >状态：{{ selfProductForm.status.text }} 原因：{{ selfProductForm.remarks }}</span>-->
    </h1>
    <el-form
      :model="selfProductForm"
      ref="selfProductRef"
      :rules="selfProductRules"
      label-width="150px"
      label-position="right"
      style="width:700px;margin-left:100px"
    >
      <div class="box">
        <h2>公司基本信息</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="产品名称" prop="title">
              <el-input v-model="selfProductForm.title" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="产品类别" prop="categoryId">
              <el-cascader
                ref="selfProductInfoRef"
                key="selfProductInfo"
                :options="categoryData"
                v-model="selfProductForm.categoryId"
                @change="categoryChange($event)"
                :props="setCategory()"
                :disabled="disabled"
                filterable
                clearable
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="品牌名" prop="brand">
              <el-input v-model="selfProductForm.brand" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="产品型号" prop="model">
              <el-input v-model="selfProductForm.model" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item city">
            <el-form-item label="生产地" prop="city" v-if="type==1">
              <el-input
                v-model="selfProductForm.province + selfProductForm.city"
                :readonly="readonly"
              ></el-input>
            </el-form-item>
            <el-form-item label="生产地" prop="city" v-if="type==2||type==3">
              <el-select
                v-model="selfProductForm.countryId"
                placeholder="国家"
                @change="countryChange"
              >
                <el-option
                  v-for="(item,index) in country"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="selfProductForm.province"
                placeholder="请选择省份"
                @change="provincesChange"
                :disabled="disabledPro"
              >
                <el-option
                  v-for="(item,index) in provinces"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="selfProductForm.city"
                placeholder="请选择城市"
                @change="cityChange"
                :disabled="disabledPro"
              >
                <el-option
                  v-for="(item,index) in cities"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="最小起订量" prop="minimumOrderingQuantity">
              <el-input v-model="selfProductForm.minimumOrderingQuantity" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="价格" prop="bargain">
              <el-input
                v-model="selfProductForm.price"
                :readonly="readonly"
                class="price"
                placeholder="输入金额"
                :disabled="disabledPrice"
              ></el-input>
              <el-radio v-model="selfProductForm.bargain" :label="false" @change="bargainChange">金额</el-radio>
              <el-radio
                v-model="selfProductForm.bargain"
                :label="true"
                v-if="type==2||type==3"
                @change="bargainChange"
              >议价</el-radio>
              <!-- <el-checkbox v-model="selfProductForm.bargain" v-if="type==2||type==3">议价</el-checkbox> -->
              <!-- <el-input v-model="selfProductForm.price" :readonly="readonly" class="price" placeholder="输入金额"></el-input>
              <el-checkbox v-model="selfProductForm.bargain" v-if="type==2||type==3">议价</el-checkbox>-->
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="selfProductForm.unit" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="是否主要产品" prop="isMainProduct">
              <el-radio-group v-model="selfProductForm.isMainProduct">
                <el-radio :label="true" :disabled="disabled">主要产品</el-radio>
                <el-radio :label="false" :disabled="disabled">普通产品</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="产品标签" prop="tagsId" v-if="type==2||type==3">
              <el-select
                v-model="selfProductForm.tagsId"
                multiple
                :multiple-limit="3"
                placeholder="请选择产品标签"
              >
                <el-option
                  v-for="(item,index) in optionsTag"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="type==1">
              <el-form-item label="产品标签" prop="tagsId" v-if="type==1">
                <el-tag
                  :key="index"
                  v-for="(tag,index) in tagList"
                  style="margin-right:10px"
                >{{ tag.name }}</el-tag>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>产品图片上传</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="产品图片" prop="images">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="handleImagesSuccess"
                :on-preview="handleImagesPreview"
                :on-remove="handleImagesRemove"
                :on-exceed="handleImagesExceed"
                :file-list="fileImagesList"
                v-if="type == 2 || type == 3"
                style="width:850px;"
                :limit="5"
              >
                <!--   :before-upload="beforeAvatarUpload" -->
                <i class="el-icon-plus"></i>
              </el-upload>
              <span class="size_limit">尺寸350*350,格式jpg/png/gif,大小不超过500K</span>
              <el-dialog :visible.sync="imagesDialogVisible" v-if="type == 2 || type == 3">
                <img width="100%" :src="imagesDialogImageUrl" alt />
              </el-dialog>
              <el-image
                style="width: 140px; height: 140px"
                v-for="(item, index) in selfProductForm.images"
                :key="index"
                :src="imgBaseUrl + item"
                :preview-src-list="[imgBaseUrl + item]"
                v-if="type == 1"
              ></el-image>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>产品贸易信息</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="商品库存" prop="storage">
              <el-input v-model="selfProductForm.storage" :readonly="readonly" class="storage"></el-input>
              <span>{{selfProductForm.unit}}</span>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="支付方式" prop="payModels">
              <el-checkbox-group v-model="selfProductForm.payModels" style="display:inline-block">
                <el-checkbox
                  v-for="item in payType"
                  :label="item"
                  :key="item"
                  :disabled="disabled"
                >{{item }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="运输方式" prop="shippingTypes">
              <el-checkbox-group
                v-model="selfProductForm.shippingTypes"
                style="display:inline-block"
              >
                <el-checkbox
                  v-for="item in shipType"
                  :label="item"
                  :key="item"
                  :disabled="disabled"
                >{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>产品详情</h2>
        <div class="info">
          <div class="item">
            <span style="color:#F56C6C;position:absolute;left:180px;top:3px;">*</span>
            <el-form-item label="产品规格" prop="specsList">
              <!-- 表格区域 -->
              <el-table :data="selfProductForm.specsList" border style="display:inline-block">
                <el-table-column align="center" prop="specsName" label="名称">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.specsName"
                      placeholder="请输入内容"
                      :readonly="readonly"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="specsParam" label="参数">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.specsParam"
                      placeholder="请输入内容"
                      :readonly="readonly"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleDel(scope.$index, scope.row)"
                      :disabled="disabled"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <span style="color:#F56C6C;position:absolute;left:180px;top:3px;">产品规格不能为空</span> -->
              <el-button
                type="button"
                class="el-button el-button--primary el-button--mini"
                @click="addSpecs"
                :disabled="disabled"
              >增行</el-button>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="产品详情" prop="introduction">
              <vue-ueditor-wrap
                v-model="selfProductForm.introduction"
                :destroy="true"
                :config="UEDITOR_CONFIG"
                style="width:900px"
                v-if="type == 2 || type == 3"
              ></vue-ueditor-wrap>
              <div v-if="type==1" v-html="selfProductForm.introduction" style="color:#606266"></div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <!-- <el-button @click="close" class="close">取消</el-button> -->
    <!-- type:1 查看 type:2 编辑 type:3 新增-->
    <el-button @click="save" type="primary" v-if="type == 2||type == 3" class="btn_approve">保存为草稿</el-button>
    <el-button @click="approve" type="primary" v-if="type == 2||type == 3">添加审核</el-button>
  </div>
</template>

<script>
import baseUrl from '../../api/env'
import VueUeditorWrap from 'vue-ueditor-wrap'
import { getStore } from 'js/store'

let _this
export default {
  data() {
    _this = this
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      selfProductForm: {
        title: '', // 产品名称
        categoryId: '', // 产品类别
        brand: '', // 品牌
        model: '', // 产品型号
        countryId: 1, // 国家id
        provinceId: '', // 省份编码
        province: '', // 省份
        cityId: '', // 城市编码
        city: '', // 城市
        minimumOrderingQuantity: '', // 最小起订量
        price: '', // 价格
        bargain: false, // 议价 teur/false
        unit: '', // 单位
        isMainProduct: '', // 是否主要产品 true/false
        tagsId: [], // 产品标签id
        storage: '', // 库存
        payModels: [], // 支付方式
        shippingTypes: [], // 运输方式
        introduction: '', // 产品详情
        status: '', // 产品状态 0.草稿 1.提交审核
        images: [], // 产品图片多张，图片url
        specsList: [] // 规格名称,规格参数。上传需要解析
      },
      // 校验规则
      selfProductRules: {
        title: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '产品类别不能为空', trigger: 'change' }
        ],
        brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
        model: [
          { required: true, message: '产品型号不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '生产地不能为空', trigger: 'change' }
        ],
        minimumOrderingQuantity: [
          { required: true, message: '最小起订量不能为空', trigger: 'blur' }
        ],
        bargain: [
          { required: true, message: '价格不能为空', trigger: 'change' }
        ],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        isMainProduct: [
          { required: true, message: '是否主要产品不能为空', trigger: 'change' }
        ],
        tagsId: [
          { required: true, message: '产品标签不能为空', trigger: 'change' }
        ],
        images: [
          { required: true, message: '产品图片不能为空', trigger: 'change' }
        ],
        storage: [{ required: true, message: '库存不能为空', trigger: 'blur' }],
        payModels: [
          { required: true, message: '支付方式不能为空', trigger: 'change' }
        ],
        shippingTypes: [
          { required: true, message: '运输方式不能为空', trigger: 'change' }
        ],
        introduction: [
          { required: true, message: '产品详情不能为空', trigger: 'blur' }
        ]
      },

      disabledPrice: false, // 议价下禁用价格输入框

      tagList: [], // 标签展示 type 1
      country: [], // 国家列表
      provinces: [], // 省份列表
      cities: [], // 城市列表
      disabledPro: false, // 是否禁用省市
      optionsTag: [], // 标签多选列表
      categoryData: [], // 产品类别列表
      categoryView: [], // 产品类别展示 type 1

      payType: ['支付宝', '微信支付', '银联支付'], // 支付方式
      shipType: ['空运', '海运', '快递', '公路运输', '铁路运输'], // 运输方式

      type: null, // 查看1  编辑2  新增3
      readonly: false, // 只读
      disabled: false, // 禁用
      uploadUrl: `${
        baseUrl[process.env.NODE_ENV].apiUrl
      }/file/upload?token=${token}`, // 图片上传地址
      fileImagesList: [], // images图片
      imagesDialogImageUrl: '', // images图片预览
      imagesDialogVisible: false
    }
  },
  created() {
    // 查看 type：1   编辑 type：2  新增 type：3
    this.type = this.$route.query.type
    if (this.type == 1) {
      this.getProductList()
      this.readonly = true
      this.disabled = true
    }
    if (this.type == 2) {
      this.getProductList()
      this.readonly = false
      this.disabled = false
      this.disabledPrice = true
    }
    if (this.type == 3) {
      this.readonly = false
      this.disabled = false
    }
    this.UEDITOR_CONFIG = getStore({ name: 'UEDITOR_CONFIG' })
    this.getCategoryList() // 获取产品类别列表
    this.getCountryList() // 获取国家列表
    this.getProvinces() // 获取省份列表
    this.getTagList() // 获取标签列表
  },
  watch: {
    'selfProductForm.specsList': function(val, oldval) {
      if (val && val.length > 20) {
        val.splice(20, 1)
        this.$message.warning('产品规格限20个')
      }
    }
  },
  components: {
    VueUeditorWrap
  },
  methods: {
    getProductList() {
      this.axios
        .get(`/api/product/info`, {
          productId: this.$route.query.id
        })
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            for (let key in this.selfProductForm) {
              this.selfProductForm[key] = res.data[key]
            }
            this.selfProductForm.introduction = res.data.introduction || ''
            // 解析显示产品标签
            if (res.data.tags.length > 0) {
              const arr = []
              res.data.tags.forEach(item => {
                arr.push(item.id)
              })
              this.selfProductForm.tagsId = arr
            }

            if (!this.selfProductForm.countryId) {
              this.selfProductForm.countryId = 1
            }
            // 解析显示产品类别
            this.categoryView = res.data.categoryView

            // 获取产品id return [1,111,1111]
            const arr = []
            if (
              Object.keys(this.categoryView).length > 0 &&
              this.categoryView.id
            ) {
              arr.push(this.categoryView.id)
              const parse = array => {
                array.map(item => {
                  if (item.id) {
                    arr.push(item.id)
                    if (item.childrens) {
                      parse(item.childrens)
                    }
                  }
                })
              }
              parse(this.categoryView.childrens)
            }
            this.selfProductForm.categoryId = arr
            console.log(this.selfProductForm.categoryId)

            this.selfProductForm.specsList = res.data.specs

            // 编辑时图片展示
            this.selfProductForm.images.forEach(item => {
              this.fileImagesList.push({
                url: this.imgBaseUrl + item
              })
            })
          }
        })
    },
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
    // 分类 -------------------------------------------------------------------------
    categoryChange(arr) {
      // const node = this.$refs.selfProductInfoRef.getCheckedNodes()
      // this.$emit('categoryChange', arr, node)
    },
    setCategory(checkStrictly) {
      return {
        value: 'id',
        children: 'childrens',
        label: 'name',
        checkStrictly: false
      }
    },

    bargainChange(val) {
      console.log(val)
      if (val) {
        this.disabledPrice = true
        this.selfProductForm.price = ''
      } else {
        this.disabledPrice = false
      }
    },

    // 获取国家
    getCountryList() {
      this.axios.get(`/public/countries`).then(res => {
        res.data.forEach(item => {
          this.country.push({
            label: item.nameZh,
            value: item.id
          })
        })
      })
    },
    // 获取所有省份
    getProvinces() {
      this.axios.get(`/public/address/provinces`).then(res => {
        console.log(res)
        res.data.forEach(item => {
          this.provinces.push({
            label: item.name,
            value: item.name,
            id: item.id
          })
        })
      })
    },
    // 根据省份编码获取所有市
    getCitiesById(provinceId) {
      this.cities = []
      this.axios
        .get(`/public/address/cities/provinces?provincesid=${provinceId}`)
        .then(res => {
          console.log(res)
          res.data.forEach(item => {
            this.cities.push({
              label: item.name,
              value: item.name,
              id: item.id
            })
          })
        })
    },
    // 国家改变。不是中国，禁用省市
    countryChange(val) {
      if (val != 1) {
        this.selfProductForm.province = ''
        this.selfProductForm.provinceId = ''
        this.selfProductForm.city = ''
        this.selfProductForm.cityId = ''
        this.disabledPro = true
      } else {
        this.disabledPro = false
      }
    },
    // 省份改变
    provincesChange(val) {
      this.selfProductForm.city = ''
      this.selfProductForm.cityId = ''
      const provinceId = this.provinces.find(item => {
        return item.value == val
      }).id
      this.getCitiesById(provinceId)
      this.selfProductForm.provinceId = provinceId
    },
    // 城市改变
    cityChange(val) {
      const cityId = this.cities.find(item => {
        return item.value == val
      }).id
      this.selfProductForm.cityId = cityId
    },

    // 获取标签多选列表
    getTagList() {
      this.axios.get(`/api/tag/list`).then(res => {
        if (res.code != 200) return false
        res.data.forEach(item => {
          this.optionsTag.push({
            label: item.name,
            value: item.id
          })
        })
        // 标签展示
        if (this.type == 1) {
          res.data.forEach(item1 => {
            this.selfProductForm.tagsId.forEach(item2 => {
              if (item1.id == item2) {
                this.tagList.push({
                  name: item1.name
                })
              }
            })
          })
        }
        // 新增产品type 3 默认选中自营和放心购标签
        if (this.type == 3) {
          this.selfProductForm.tagsId = [14, 5]
        }
      })
    },
    // 处理产品图片上传
    handleImagesSuccess(res, file, fileList) {
      this.selfProductForm.images.push(res.data)
    },
    handleImagesPreview(file, fileList) {
      this.imagesDialogImageUrl = file.url
      this.imagesDialogVisible = true
    },
    handleImagesRemove(file, fileList) {
      if (file.response) {
        const item = this.selfProductForm.images.findIndex(i => {
          return i.src == file.response.data
        })
        this.selfProductForm.images.splice(item, 1)
      } else {
        const item = this.selfProductForm.images.findIndex(i => {
          return i.src == file.url.match(/filePath=(\S*)/)[1]
        })
        this.selfProductForm.images.splice(item, 1)
      }
    },
    handleImagesExceed(files, fileList) {
      this.$message.warning(`最多添加5张`)
    },
    beforeAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/GIF'
      const isLt2M = file.size / 1024 / 1024 < 0.48828125

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 或者 GIF 格式!')
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 500KB!')
        }
      }, 0)
      const isSize = new Promise(function(resolve, reject) {
        let width = 350 // 限制图片尺寸为350*350
        let height = 350
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      })
        .then(
          () => {
            return file
          },
          () => {
            _this.$message.error('图片尺寸限制为350 x 350')
            return Promise.reject()
          }
        )
        .catch(error => {})

      return isJPG && isLt2M && isSize
    },
    // 表格删除
    handleDel(index, row) {
      this.selfProductForm.specsList.splice(index, 1)
    },
    // 表格添加
    addSpecs() {
      const obj = {
        specsName: '',
        specsParam: ''
      }
      this.selfProductForm.specsList.push(obj)
    },
    // 返回
    close() {
      this.$router.push('/selfProduct')
    },
    saveOrApprove(obj, callback) {
      // 表单校验
      this.$refs.selfProductRef.validate(valid => {
        if (!valid) return
        if (
          this.selfProductForm.bargain == false &&
          this.selfProductForm.price.length <= 0
        ) {
          return this.$message.warning('价格不能为空')
        }
        if (
          this.selfProductForm.specsList.length == 0 ||
          this.selfProductForm.specsList[0].specsName == '' ||
          this.selfProductForm.specsList[0].specsParam == ''
        ) {
          return this.$message.warning('产品规格不能为空')
        }

        // 数据类型转换
        this.selfProductForm.categoryId = this.selfProductForm.categoryId[
          this.selfProductForm.categoryId.length - 1
        ]
        this.selfProductForm.payModels = this.selfProductForm.payModels.toString()
        this.selfProductForm.shippingTypes = this.selfProductForm.shippingTypes.toString()
        const specsList = []
        this.selfProductForm.specsList.forEach(item => {
          specsList.push({
            specsName: item.specsName,
            specsList: item.specsList
          })
        })
        const productObj = {
          specsList: specsList,
          ...this.selfProductForm
        }
        this.$dataTransform(productObj, 'specsList')
        console.log(productObj)
        console.log(this.selfProductForm)
        this.axios.post(`/api/product/self/save`, productObj).then(res => {
          callback && callback(res)
        })
      })
    },
    save() {
      this.selfProductForm.status = 0 // 草稿
      if (this.type == 2) this.selfProductForm.id = this.$route.query.id
      this.saveOrApprove(this.selfProductForm, function(res) {
        if (res.code == 200) {
          _this.$router.push('/selfProduct')
        }
        if (res.code == 500) {
          _this.$message.warning(res.message)
        }
      })
    },
    approve() {
      this.selfProductForm.status = 1 // 审核
      if (this.type == 2) this.selfProductForm.id = this.$route.query.id
      this.saveOrApprove(this.selfProductForm, function(res) {
        if (res.code == 200) {
          _this.$router.push('/selfProduct')
        }
        if (res.code == 500) {
          _this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style scoped>
.btn_approve {
  margin-left: 550px !important;
}
</style>
