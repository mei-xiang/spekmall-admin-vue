<!--
 * @Description: 表格右上角 按钮组 组件
 * @Author: jiaxin
 * @Date: 2018-12-04 11:25:14
 -->
<template>
  <el-button-group class="button-group">
    <template v-for="(item,index) in showBtnData">
      <el-button
        v-if="!item.hidden && (!item.permission || userInfo.permissions.indexOf(item.permission) !== -1)"
        size="mini"
        :key="index"
        :icon="item.icon"
        :disabled="item.disabled?item.disabled(): false"
        @click="clickBtn(item.fn)"
      >{{item.label}}</el-button>
    </template>
    <el-button v-if="btnListData.length>showCount" size="mini" icon="el-icon-more" @click="showAll"></el-button>
    <el-button v-if="showCount>maxShow" size="mini" icon="el-icon-d-arrow-right" @click="showMax"></el-button>
  </el-button-group>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
  name: "BtnList",
  data() {
    return {
      // 实际显示个数
      showCount: 0
    };
  },
  props: {
    // 最多显示多少个按钮
    maxShow: {
      type: Number,
      default: () => {
        return 10;
      }
    },
    // 获取的按钮数据
    btnListData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  mounted() {
    this.showMax();
  },
  methods: {
    clickBtn(key) {
      if (typeof key === "string") {
        // 一下两个方法效果相同，看父组件监听那个方法
        this.$emit(key);
        this.$emit("clickBtn", key);
      }
    },
    showAll() {
      this.showCount = this.btnListData.length;
    },
    showMax() {
      this.showCount = this.maxShow;
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    showBtnData: function() {
      return this.btnListData.slice(0, this.showCount);
    }
  }
};
</script>

<style lang="stylus" scoped>
.button-group {
  margin: 4px 0;
}
</style>
