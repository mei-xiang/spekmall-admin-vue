<template>
  <!-- 供应商店铺信息 -->
  <div class="content self" v-if="Object.keys(selfForm).length > 0">
    <h1>
      <span v-if="type==1">店铺查看</span>
      <span v-if="type==2">店铺编辑</span>
      <span v-if="type==3">店铺发布</span>
      <span class="infoType">提交状态：{{ shopAudit==0?'待审核':'已审核' }}</span>

      <!-- <span
        class="infoType"
        v-if="selfForm.shop.shopStatus.index !== 3"
      >状态：{{ selfForm.shop.shopStatus.text }}</span>
      <span class="infoType" v-if="selfForm.shop.shopStatus.index == 3">
        状态：{{ selfForm.shop.shopStatus.text }} 原因：{{
        selfForm.shop.remarks
        }}
      </span>-->
    </h1>
    <el-form
      :model="selfForm"
      ref="selfRef"
      :rules="selfRules"
      label-width="150px"
      label-position="right"
      style="width:700px;margin-left:100px"
    >
      <div class="box">
        <h2>公司基本信息</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="selfForm.name" :readonly="readonly_no"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="统一信用代码" prop="creditCode">
              <el-input v-model="selfForm.creditCode" :readonly="readonly_no"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="地址" prop="address">
              <el-select v-model="provincesVal" placeholder="请选择省份" @change="provincesChange">
                <el-option
                  v-for="item in provinces"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="disabled"
                ></el-option>
              </el-select>
              <el-select v-model="cityVal" placeholder="请选择城市" @change="cityChange">
                <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="disabled"
                ></el-option>
              </el-select>
              <el-input
                v-model="selfForm.address"
                :readonly="readonly"
                placeholder="请输入详细地址"
                class="address"
              ></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <!-- <el-form-item label="行业" prop="industry">
              <el-input v-model="selfForm.industry" :readonly="readonly"></el-input>
            </el-form-item>-->
            <el-form-item label="行业" prop="industryArr">
              <el-cascader
                key="productList"
                ref="selfShopInfoRef"
                :options="shopCategoryData"
                v-model="selfForm.industryArr"
                @change="categoryChange($event)"
                :props="setCategory()"
                :readonly="readonly"
                filterable
                clearable
                :disabled="disabled"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="公司简介" prop="companyDesc">
              <el-input v-model="selfForm.companyDesc" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="主营产品" prop="majorPorducts">
              <el-input v-model="selfForm.majorPorducts" :readonly="readonly"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="公司成立时间" prop="establishmentDate">
              <el-date-picker
                v-model="selfForm.establishmentDate"
                type="datetime"
                placeholder="选择日期时间"
                :readonly="readonly"
                @change="dateChange"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="注册资金" prop="registeredCapital">
              <el-input v-model="selfForm.registeredCapital" :readonly="readonly" class="regMon"></el-input>
              <span class="money">万元</span>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>公司其他信息</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="店铺Logo" prop="logo">
              <!-- <span>店铺Logo</span> -->
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="handleLogoSuccess"
                :on-preview="handleLogoPicPreview"
                :on-remove="handleLogoRemove"
                :file-list="fileLogoList"
                :before-upload="beforeLogoAvatarUpload"
                v-if="type == 2 || type == 3"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="logoDialogVisible" v-if="type == 2 || type == 3">
                <img width="100%" :src="logoDialogImageUrl" alt />
              </el-dialog>
              <el-image
                style="width: 140px; height: 140px"
                v-for="(item, index) in selfForm.logo"
                :key="index"
                :src="imgBaseUrl + item"
                :preview-src-list="[imgBaseUrl + item]"
                v-if="type == 1"
              ></el-image>
              <p class="size_limit">尺寸300*300，JPG/PNG/GIF,大小不超过1M</p>
            </el-form-item>
          </div>

          <div class="item">
            <el-form-item label="店铺主页招牌图片" prop="signboard">
              <!-- <span>店铺主页招牌图片</span> -->
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="handleSignboardSuccess"
                :on-remove="handleSignboardRemove"
                :on-preview="handleSignboardPreview"
                :file-list="fileSignboardList"
                :before-upload="beforeSignboardAvatarUpload"
                v-if="type == 2 || type == 3"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="signboardDialogVisible" v-if="type == 2 || type == 3">
                <img width="100%" :src="signboardDialogImageUrl" alt />
              </el-dialog>
              <el-image
                style="width: 140px; height: 140px"
                v-for="(item, index) in selfForm.signboard"
                :key="index"
                :src="imgBaseUrl + item"
                :preview-src-list="[imgBaseUrl + item]"
                v-if="type == 1"
              ></el-image>
              <p class="size_limit">尺寸1200*190，JPG/PNG/GIF,大小不超过5M</p>
            </el-form-item>
          </div>

          <div class="item" style="width:500px;">
            <el-form-item label="banner" prop="banners">
              <!-- <span>banner</span> -->

              <el-carousel style="flex:1;" v-if="type == 1">
                <el-carousel-item v-for="item in selfForm.banners" :key="item.id">
                  <img :src="imgBaseUrl + item.src" class="image" style="width:400px;height:400px" />
                </el-carousel-item>
              </el-carousel>
              <el-upload
                style="width:850px;"
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="handleBannerSuccess"
                :on-remove="handleBannerRemove"
                :on-preview="handleBannerPreview"
                :before-upload="beforeBannerAvatarUpload"
                :file-list="fileBannerList"
                :on-exceed="handleBannerExceed"
                :limit="5"
                v-if="type == 2 || type == 3"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="bannerDialogVisible" v-if="type == 2 || type == 3">
                <img width="100%" :src="bannerDialogImageUrl" alt />
              </el-dialog>
              <p class="size_limit">尺寸1200*350，JPG/PNG/GIF,大小不超过5M,最多添加5张</p>
            </el-form-item>
          </div>

          <div class="item" style="width:900px;">
            <el-form-item label="店铺图片" prop="images">
              <!-- <span>店铺图片</span> -->
              <el-carousel
                :interval="4000"
                type="card"
                height="200px"
                style="flex:1;"
                v-if="type == 1"
              >
                <el-carousel-item v-for="(item, index) in selfForm.images" :key="index">
                  <img :src="imgBaseUrl + item" class="image" style="width:400px;height:400px" />
                </el-carousel-item>
              </el-carousel>
              <el-upload
                style="width:850px;"
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="handleImagesSuccess"
                :on-remove="handleImagesRemove"
                :on-preview="handleImagesPreview"
                :file-list="fileImagesList"
                :on-exceed="handleImagesExceed"
                :before-upload="beforeImagesAvatarUpload"
                :limit="10"
                v-if="type == 2 || type == 3"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="imagesDialogVisible" v-if="type == 2 || type == 3">
                <img width="100%" :src="imagesDialogImageUrl" alt />
              </el-dialog>
              <p class="size_limit">尺寸300*300，JPG/PNG/GIF,大小不超过500k</p>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="box">
        <h2>公司介绍</h2>
        <div class="info">
          <div class="item">
            <el-form-item label="公司详情介绍" prop="introduction">
              <!-- <span>公司详情介绍</span> -->
              <span>
                <vue-ueditor-wrap
                  v-model="selfForm.introduction"
                  :destroy="true"
                  :config="UEDITOR_CONFIG"
                  style="width:900px"
                  v-if="type == 2 || type == 3"
                ></vue-ueditor-wrap>
                <div v-if="type==1" v-html="selfForm.introduction"></div>
              </span>
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
import Qs from 'qs'
export default {
  data() {
    const token = getStore({ name: 'access_token', type: 'string' })
    return {
      // 店铺数据
      selfForm: {
        name: '',
        creditCode: '',
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        address: '',
        industryArr: [], // 展示行业列表
        industry: '',
        industryName: '',
        industry2: '',
        industry2Text: '',
        companyDesc: '',
        majorPorducts: '',
        establishmentDate: '',
        registeredCapital: '',
        introduction: '',
        status: '', // 状态 0  1
        logo: [], // 店铺Logo
        signboard: [], // 店铺主页招牌图片
        banners: [], // banner列表
        images: [] // 店铺图片列表
      },
      shopAudit: null,
      // 校验规则
      selfRules: {
        name: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '统一信用代码不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'change' }
        ],
        industryArr: [
          { required: true, message: '行业不能为空', trigger: 'blur' }
        ],
        companyDesc: [
          { required: true, message: '公司简介不能为空', trigger: 'blur' }
        ],
        majorPorducts: [
          { required: true, message: '主营产品不能为空', trigger: 'blur' }
        ],
        establishmentDate: [
          { required: true, message: '公司成立时间不能为空', trigger: 'change' }
        ],
        registeredCapital: [
          { required: true, message: '注册资金不能为空', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '公司详情介绍不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '店铺Logo不能为空', trigger: 'change' }
        ],
        signboard: [
          {
            required: true,
            message: '店铺主页招牌图片不能为空',
            trigger: 'change'
          }
        ],
        banners: [
          { required: true, message: 'banner不能为空', trigger: 'change' }
        ],
        images: [
          { required: true, message: '店铺图片不能为空', trigger: 'change' }
        ]
      },
      shopCategoryData: [], // 行业列表
      provincesVal: '', // 省份选择框
      cityVal: '', // 城市选择框
      provinces: [], // 省份列表
      cities: [], //城市列表

      type: null, // 查看1/编辑2/新增3
      readonly: false, // 只读
      readonly_no: false, // 只读
      disabled: false, // 禁用
      uploadUrl: `${
        baseUrl[process.env.NODE_ENV].apiUrl
      }/file/upload?token=${token}`, // 图片上传地址

      fileLogoList: [], // logo图片
      logoDialogImageUrl: '', // logo图片预览
      logoDialogVisible: false,
      fileSignboardList: [], // 店铺主页招牌图片
      signboardDialogImageUrl: '', // 店铺主页图片预览
      signboardDialogVisible: false,
      fileBannerList: [], // banner图片
      bannerDialogImageUrl: '', // banner图片预览
      bannerDialogVisible: false,
      fileImagesList: [], // images图片
      imagesDialogImageUrl: '', // 店铺图片预览
      imagesDialogVisible: false,
      UEDITOR_CONFIG: {} // 富文本编辑器
    }
  },
  created() {
    // 查看 type：1   编辑 type：2  新增 type：3
    this.type = this.$route.query.type
    if (this.type == 1) {
      setTimeout(() => {
        this.getSelfShopList()
        this.readonly = true
        this.disabled = true
      })
    }
    if (this.type == 2) {
      // 先获取行业类别再进行展示
      setTimeout(() => {
        this.getSelfShopList()
        this.readonly = false
        this.readonly_no = true
      }, 0)
    }
    if (this.type == 3) {
      this.readonly = false
    }
    // 获取所有省份
    this.getProvinces()
    // 获取所有行业类别
    this.getShopList()
    this.UEDITOR_CONFIG = getStore({ name: 'UEDITOR_CONFIG' })
  },
  components: {
    VueUeditorWrap
  },
  methods: {
    getSelfShopList() {
      this.axios
        .get(`/api/supplier/shop/${this.$route.query.id}/info`)
        .then(res => {
          console.log(res)
          const data = res.data
          let shopCompany = null
          let shopObj = null
          if (res.code == 200) {
            // 解析数据
            if (this.type == 1) {
              shopCompany = data.shop.shopCompany // 基本数据
              shopObj = data.shop // 图片，富文本编辑器
            }
            if (this.type == 2) {
              shopCompany = data.shopAudit.shopCompanyAudit
              shopObj = data.shopAudit
              this.shopAudit = data.shopAudit.status
            }
            this.selfForm.name = shopCompany.name
            this.selfForm.creditCode = shopCompany.creditCode
            this.selfForm.province = shopCompany.province
            this.selfForm.provinceId = shopCompany.provinceId
            this.selfForm.city = shopCompany.city
            this.selfForm.cityId = shopCompany.cityId
            this.selfForm.address = shopCompany.address
            this.selfForm.industry = shopCompany.industry
            this.selfForm.industryName = shopCompany.industryName
            this.selfForm.industry2 = shopCompany.industry2
            this.selfForm.industry2Text = shopCompany.industry2Text
            this.selfForm.companyDesc = shopCompany.companyDesc
            this.selfForm.majorPorducts = data.majorPorducts
            this.selfForm.establishmentDate = shopCompany.establishmentDate
            this.selfForm.registeredCapital = shopCompany.registeredCapital
            this.selfForm.introduction = shopObj.introduction || ''

            // 显示省市
            this.provincesVal = shopCompany.province
            this.cityVal = shopCompany.city

            this.selfForm.industryArr = [
              shopCompany.industryName,
              shopCompany.industry2Text
            ]

            // 图片解析
            this.selfForm.logo = this.$getArrayByStr(shopObj.logo)
            this.selfForm.signboard = this.$getArrayByStr(shopObj.signboard)
            this.selfForm.banners = shopObj.banners || []
            this.selfForm.images = shopObj.images

            // 编辑时图片展示
            this.fileLogoList.push({ url: this.imgBaseUrl + shopObj.logo })
            this.fileSignboardList.push({
              url: this.imgBaseUrl + shopObj.signboard
            })
            if (this.selfForm.banners && this.selfForm.banners.length > 0) {
              this.selfForm.banners.forEach(item => {
                this.fileBannerList.push({
                  url: this.imgBaseUrl + item
                })
              })
            }
            this.selfForm.images.forEach(item => {
              this.fileImagesList.push({
                url: this.imgBaseUrl + item
              })
            })
          }
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
    // 省份改变
    provincesChange(val) {
      this.cityVal = ''
      this.selfForm.city = ''
      this.selfForm.cityId = ''
      const provinceId = this.provinces.find(item => {
        return item.value == val
      }).id
      this.getCitiesById(provinceId)
      this.selfForm.province = this.provincesVal
      this.selfForm.provinceId = provinceId
    },
    // 城市改变
    cityChange(val) {
      const cityId = this.cities.find(item => {
        return item.value == val
      }).id
      this.selfForm.city = this.cityVal
      this.selfForm.cityId = cityId
    },
    // 获取行业分类 -------------------------------------------------------------------------
    getShopList() {
      this.axios.get(`/dictionary/dicAndDetail/majorBusiness2`).then(res => {
        console.log(res)
        const resData = res.data
        resData.forEach(item => {
          item.text = item.name
        })
        this.shopCategoryData = resData
      })
    },
    // 行业分类
    categoryChange(arr) {
      console.log(arr)
      if (arr.length > 0) {
        this.shopCategoryData.forEach(item1 => {
          if (arr[0] == item1.text) {
            this.selfForm.industry = item1.code
            this.selfForm.industryName = item1.name
          }
          item1.detailList.forEach(item2 => {
            if (arr[1] == item2.text) {
              this.selfForm.industry2 = item2.value
              this.selfForm.industry2Text = item2.text
            }
          })
        })
        this.selfForm.industryArr = arr
      }
    },
    setCategory(checkStrictly) {
      return {
        value: 'text',
        children: 'detailList',
        label: 'text',
        checkStrictly: false
      }
    },
    // 时间改变
    dateChange() {
      this.selfForm.establishmentDate = this.$timeDate(
        this.selfForm.establishmentDate
      )
    },
    // 返回
    close() {
      this.$router.push('/selfShop')
    },
    // 处理logo图片上传
    handleLogoSuccess(res, file, fileList) {
      if (this.selfForm.logo.length > 0) {
        fileList.splice(0, 1)
      }
      this.selfForm.logo = fileList[0].response.data
    },
    handleLogoRemove(file, fileList) {
      this.selfForm.logo = fileList
    },
    handleLogoPicPreview(file) {
      this.logoDialogImageUrl = file.url
      this.logoDialogVisible = true
    },
    beforeLogoAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/GIF'
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 或者 GIF 格式!')
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
      }, 0)
      const isSize = new Promise(function(resolve, reject) {
        let width = 300 // 限制图片尺寸为230X180
        let height = 300
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('图片尺寸限制为300 x 300')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    // 处理店铺主页招牌图片上传
    handleSignboardSuccess(res, file, fileList) {
      if (this.selfForm.signboard.length > 0) {
        fileList.splice(0, 1)
      }
      this.selfForm.signboard = fileList[0].response.data
    },
    handleSignboardRemove(file, fileList) {
      this.selfForm.signboard = fileList
    },
    handleSignboardPreview(file) {
      this.signboardDialogImageUrl = file.url
      this.signboardDialogVisible = true
    },
    beforeSignboardAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/GIF'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 或者 GIF 格式!')
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
      }, 0)
      const isSize = new Promise(function(resolve, reject) {
        let width = 1200 // 限制图片尺寸为1200X190
        let height = 190
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('图片尺寸限制为1200 x 190')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    // 处理banner图片上传
    handleBannerSuccess(res, file, fileList) {
      console.log(res)
      this.selfForm.banners.push(res.data)
      // this.selfForm.banners.push({
      //   src: res.data,
      //   sort: this.selfForm.banners.length + 1,
      //   type: 1
      // })
    },
    handleBannerPreview(file, fileList) {
      this.bannerDialogImageUrl = file.url
      this.bannerDialogVisible = true
    },
    handleBannerRemove(file, fileList) {
      if (file && file.response) {
        const item = this.selfForm.banners.findIndex(i => {
          return i.src == file.response.data
        })
        this.selfForm.banners.splice(item, 1)
      }
      // else {
      //   const item = this.selfForm.banners.findIndex(i => {
      //     return i.src == file.url.match(/filePath=(\S*)/)[1]
      //   })
      //   this.selfForm.banners.splice(item, 1)
      // }
    },
    handleBannerExceed(files, fileList) {
      this.$message.warning(`最多添加5张`)
    },
    beforeBannerAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/GIF'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 或者 GIF 格式!')
      }
      setTimeout(() => {
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
      }, 0)
      const isSize = new Promise(function(resolve, reject) {
        let width = 1200 // 限制图片尺寸为1200X350
        let height = 350
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('图片尺寸限制为1200 x 350')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    // 处理店铺图片上传
    handleImagesSuccess(res, file, fileList) {
      this.selfForm.images.push(res.data)
    },
    handleImagesPreview(file, fileList) {
      this.imagesDialogImageUrl = file.url
      this.imagesDialogVisible = true
    },
    handleImagesRemove(file, fileList) {
      if (file.response) {
        const item = this.selfForm.images.findIndex(i => {
          return i.src == file.response.data
        })
        this.selfForm.images.splice(item, 1)
      } else {
        const item = this.selfForm.images.findIndex(i => {
          return i.src == file.url.match(/filePath=(\S*)/)[1]
        })
        this.selfForm.images.splice(item, 1)
      }
    },
    handleImagesExceed(files, fileList) {
      this.$message.warning(`最多添加10张`)
    },
    beforeImagesAvatarUpload(file) {
      let _this = this
      const isJPG =
        file.type === 'image/jpeg' ||
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
        let width = 300 // 限制图片尺寸为300X300
        let height = 300
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width === width && img.height === height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('图片尺寸限制为300 x 300')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    saveOrApprove(obj, callback) {
      this.selfForm.logo = this.selfForm.logo.toString()
      this.selfForm.signboard = this.selfForm.signboard.toString()
      // 接口改变调整banners传数组字符串就行
      // const bannerList = []
      // this.selfForm.banners.forEach(item => {
      //   bannerList.push({
      //     src: item.src,
      //     sort: item.sort,
      //     type: item.type
      //   })
      // })
      // this.selfForm.banners = bannerList
      this.$refs.selfRef.validate(valid => {
        if (!valid) return
        if (this.selfForm.city == '' || this.selfForm.city == null)
          return this.$message.warning('请选择省市')
        // const shopObj = {
        //   banners: bannerList,
        //   ...this.selfForm
        // }
        // this.$dataTransform(shopObj, 'banners')
        // console.log(shopObj)
        this.axios
          .post(`/api/supplier/shop/self/info`, this.selfForm)
          .then(res => {
            callback && callback(res)
          })
      })
    },
    save() {
      this.selfForm.status = 0 // 草稿
      const _this = this
      this.saveOrApprove(this.selfForm, function(res) {
        if (res.code == 200) {
          _this.$router.push('/selfShop')
        }
        if (res.code == 500) {
          _this.$message.warning(res.message)
        }
      })
    },
    approve() {
      this.selfForm.status = 1 // 审核
      const _this = this
      this.saveOrApprove(this.selfForm, function(res) {
        if (res.code == 200) {
          _this.$router.push('/selfShop')
        }
        if (res.code == 500) {
          _this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style>
.self.content {
  padding-top: 10px;
  height: 100%;
  overflow: scroll;
}
.self h1 {
  font-size: 22px;
  line-height: 35px;
  font-weight: 700;
}
.self .box {
  margin-bottom: 20px;
}
.self h2 {
  font-size: 18px;
  line-height: 35px;
  font-weight: 700;
}
.self .infoType {
  color: #cc3333;
  font-size: 14px;
  vertical-align: middle;
  margin-left: 15px;
}
.self .info {
  padding-left: 100px;
  position: relative;
}
.self .info .item {
  line-height: 35px;
}
.self .info .item span:first-of-type {
  display: inline-block;
  width: 150px;
}
.self .glod {
  position: absolute;
  top: 33px;
  left: 500px;
}
.self .glodSup,
.self .glodCycle {
  font-size: 22px;
  color: #cc3333;
  font-weight: 500;
  line-height: 35px;
}
.self span,
.self img {
  vertical-align: top;
}
.self .regMon .el-input__inner {
  width: 400px !important;
}
.self .close {
  margin-left: 450px;
}
.self .money {
  position: absolute;
  right: 0;
  top: 0;
}
.self .el-form-item__content .el-select,
.self .el-form-item__content .el-cascader {
  width: 135px;
}
.self .info .item span:first-of-type {
  display: inline-block;
  width: auto;
}
.self .address.el-input {
  width: auto;
}
.self .btn_approve {
  margin-left: 550px !important;
}
</style>
