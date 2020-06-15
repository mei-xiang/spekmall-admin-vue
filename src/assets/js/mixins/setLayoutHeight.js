/*
 * @Description: 计算设置布局高度
 * @Author: jiaxin
 * @Date: 2019-05-20 16:12:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-09 18:47:57
 */
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 整个内容区域高度
      contentH: 500,
      // 主表格高度
      tableMaxH: 500,
      // 上部分表格高度
      TopTableMaxH: 500,
      // 下部分表格高度
      BottomTableMaxH: 500
    }
  },
  mounted() {
    this.resetLayout();
  },
  computed: {
    ...mapGetters(["windowH"])
  },
  watch: {
    windowH() {
      this.resetLayout();
    }
  },
  methods: {
    resetLayout() {
      this.$nextTick(() => {
        // 内容高度
        this.contentH = $("#content").height();
        // 单表格页面布局部分
        const pagesH = $(".el-pagination").height() || 0;
        const pagesMT = $(".el-pagination").css("margin-top") || 0;
        //10 预设下部边缘的边距
        this.tableMaxH = $("#content").height() - $(".setup-box").height() - pagesH - parseInt(pagesMT) - 10;

        // 上下布局部分 ------------------------------------------
        // 上部分高度
        const contentTop = $("#top-list").height();
        // 下部分高度
        const contentBottom = $("#bot-list").height();
        // 搜索和按钮高度
        const setupBox = $("#top-list .setup-box").height() || 0;
        // 分页及其边距高度
        const topPagesH = $("#top-list .pagination").height() || 0;
        // TABS高度
        const tabH = $("#bot-list .el-tabs").height() || 0;

        //上部表高度
        this.TopTableMaxH = contentTop - setupBox - topPagesH;
        // 下部表高度
        this.BottomTableMaxH = contentBottom - tabH - 5;
      })
    }
  }
}
