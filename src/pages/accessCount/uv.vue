<!--
 * @Description: 访问用户统计
-->
<template>
  <main-page ref="mainPage"
             :height="tableMaxH"
             :isShowPagination="false"
             :showSummary="true"
             :hasSelection="false"></main-page>
</template>

<script>
export default {
  name: "Pv",
  // eslint-disable-next-line no-undef
  mixins: [setLayoutHeight],
  data() {
    return {
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
          ]
        },
        theaderData: [
          {
            type: 8,
            width: 220,
            hasSort: false,
            isShow: true,
            prop: 'createDate',
            label: '日期',
            format: 'yyyy-MM-dd'
          },
          {
            type: 9,
            width: 220,
            hasSort: false,
            isShow: true,
            prop: 'uvCount',
            label: '用户访问量',
            summaryType: 0
          }
        ],
        pageSize: 999999
      }
    }
  },
  methods: {
    clickBtn(fn) {
      this[fn]();
    },
    setTable() {
      this.$refs.mainPage.setPageConfig(this.mainPageData);
    }
  },
  mounted() {
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
