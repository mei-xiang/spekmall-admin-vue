<!--
 * @Description: 页面统计
-->
<template>
  <div class="main-page">
    <main-page ref="mainPage"
               :height="tableMaxH"
               :isShowPagination="false"
               :showSummary="true"
               :hasSelection="false"
               @clickBtn="clickBtn"></main-page>
    <div class="sub-page"
         v-if="isShowSubPage">

      <h4 class="main-title">页面维度设置
        <a class="cursor-pointer"
           @click="closeSubPage">
          <i class="el-icon-error"></i>
        </a>
      </h4>
      <div class="wrap">
        <div v-for="(item, index) in data"
             :key="index"
             class="item">
          <h2>{{item.label}}</h2>
          <el-checkbox-group v-model="checked"
                             @change='change'>
            <el-checkbox v-for="subItem in item.children"
                         :label="subItem.value"
                         :key="subItem.value">{{subItem.label}}</el-checkbox>
          </el-checkbox-group>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: "Pv",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
      checked: [],
      data: [
        {
          label: '主业',
          children: [
            { label: '首页', value: 'homePV' }
          ]
        },
        {
          label: '关于我们',
          children: [
            { label: '集团概况', value: 'surveyPv' },
            { label: '企业文化', value: 'culturePv' },
            { label: '企业荣誉', value: 'honorPv' },
            { label: '发展历程', value: 'developPv' }
          ]
        },
        {
          label: '产品及服务',
          children: [
            { label: '产品介绍', value: 'productPv' },
            { label: '工艺流程', value: 'processFlowPv' },
            { label: '专业设备', value: 'equipmentPv' }
          ]
        },
        {
          label: '解决方案',
          children: [
            { label: 'MES1', value: 'mes1Pv' },
            { label: 'MES2', value: 'mes2Pv' }
          ]
        },
        {
          label: '新闻资讯',
          children: [
            { label: '资讯列表', value: 'newsPv' }
            // { label: '资讯详情', value: 'mes2Pv' }
          ]
        },
        {
          label: '合作联系',
          children: [
            { label: '联系我们', value: 'contactUsPv' },
            { label: '留言专栏', value: 'msgColumnPv' },
            { label: '人才招聘', value: 'recruitPv' }
          ]
        }
      ],
      isShowSubPage: false,
      mainPageData: {
        ajaxData: {
          type: "get",
          url: "/api/counts",
          params: null,
          records: 'data'
        },
        search: {
          mainConfigData: [
            {
              label: "类型",
              key: "dateFlag",
              type: 2,
              width: 120,
              selectOption: [
                { id: 1, label: '最近7天' },
                { id: 2, label: '最近30天' },
                { id: 3, label: '最近60天' }
              ]
            },
            {
              label: "查询日期",
              key: "dateArr",
              type: 4,
              width: 130,
              isScope: true
            }
          ],
          searchData: {
            phone: "",
            companyName: ""
          }
        },
        btnListData: [
          {
            label: "页面维度设置",
            icon: "el-icon-circle-plus-outline",
            fn: "addBtn",
            permission: 'news'
          }
        ],
        theaderData: [],
        pageSize: 999999
      }
    }
  },
  methods: {
    ...mapMutations(['SET_PAGE']),
    clickBtn(fn) {
      this[fn]();
    },
    setTable() {
      const item = {
        type: 8,
        width: 130,
        hasSort: false,
        isShow: true,
        prop: 'createDate',
        label: '日期',
        format: 'yyyy-MM-dd'
      };
      const list = [
        { label: "首页", prop: 'homePV' },
        { label: "资讯列表", prop: 'newsPv' },
        { label: "MES1", prop: 'mes1Pv' },
        { label: "MES2", prop: 'mes2Pv' },
        { label: "产品介绍", prop: 'productPv' },
        { label: "工艺流程", prop: 'processFlowPv' },
        { label: "专业设备", prop: 'equipmentPv' },
        { label: "集团概况", prop: 'surveyPv' },
        { label: "企业文化", prop: 'culturePv' },
        { label: "企业荣誉", prop: 'honorPv' },
        { label: "发展历程", prop: 'developPv' },
        { label: "人才招聘", prop: 'recruitPv' },
        { label: "联系我们", prop: 'contactUsPv' },
        { label: "留言专栏", prop: 'msgColumnPv' }
      ];
      const theader = list.filter((item) => {
        if (this.page.indexOf(item.prop) !== -1) {
          item.type = 9;
          item.width = 'none';
          item.hasSort = false;
          item.isShow = true;
          item.summaryType = 0;
          return item
        }
      })
      this.mainPageData.theaderData = [item, ...theader];
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    },
    addBtn() {
      this.isShowSubPage = true;
    },
    change() {
      this.SET_PAGE(this.checked)
    },
    closeSubPage() {
      this.isShowSubPage = false;
      this.setTable()
    }
  },
  computed: {
    ...mapGetters(['page'])
  },
  mounted() {
    this.checked = this.page
    this.setTable();
  }
}
</script>

<style lang="stylus" scoped>
.wrap
  padding 50px

.item
  float left
  width 140px
  height 400px

  h2
    height 40px
    line-height 40px
    font-size 18px

  >>>.el-checkbox
    display block
    height 30px
    line-height 30px
</style>
