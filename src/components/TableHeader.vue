<!--
 * @Description: 主表格头部区域
 * @Author: jiaxin
 * @Date: 2018-12-11 10:56:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-09 18:20:03
 -->
<template>
  <div>
    <div class="setup-box">
      <div class="clearfix"
           v-for="itemConfig in layout"
           :key="itemConfig">
        <!-- 主搜索区域 -->
        <div v-if="$props[itemConfig].length !== 0"
             v-show="itemConfig ==='mainConfigData' || (itemConfig ==='subConfigData' && isShowMoreSearch)"
             :class="{'left-search fl':itemConfig ==='mainConfigData', 'moreSearch':itemConfig ==='subConfigData'}">
          <el-form :inline="true"
                   class="top-search">
            <template v-for="(item,index) in $props[itemConfig]">
              <!-- 文本类型 -->
              <el-form-item v-if="item.type === 0 || item.type === 'text'"
                            :key="index"
                            :label="item.label===''?'':item.label+'：'">
                <el-input v-model="searchData[item.key]"
                          :style="{'width':item.width+'px'}"
                          size="mini"
                          :placeholder="item.label"></el-input>
                <el-tooltip :content="item.helpTxt"
                            placement="top">
                  <i v-show="item.helpTxt && item.helpTxt!==null && item.helpTxt!==''"
                     class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </el-form-item>
              <!-- 数字类型 -->
              <el-form-item v-if="item.type === 1 || item.type === 'number'"
                            :key="index"
                            :label="item.label===''?'':item.label+'：'">
                <el-input v-if="!item.isScope"
                          v-model="searchData[item.key]"
                          size="mini"
                          :style="{'width':item.width+'px'}"
                          type="number"
                          :placeholder="item.label"></el-input>
                <el-input v-if="item.isScope"
                          v-model="searchData[item.key][0]"
                          size="mini"
                          :style="{'width':item.width+'px'}"
                          type="number"
                          :placeholder="item.label"></el-input>
                <span v-if="item.isScope">~</span>
                <el-input v-if="item.isScope"
                          v-model="searchData[item.key][1]"
                          size="mini"
                          :style="{'width':item.width+'px'}"
                          type="number"
                          :placeholder="item.label"></el-input>
                <el-tooltip :content="item.helpTxt"
                            placement="top">
                  <i v-show="item.helpTxt && item.helpTxt!==null && item.helpTxt!==''"
                     class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </el-form-item>
              <!-- 下拉框类型 -->
              <el-form-item v-if="item.type === 2 || item.type === 'select'"
                            :key="index"
                            :label="item.label===''?'':item.label+'：'">
                <el-select v-model="searchData[item.key]"
                           :style="{'width':item.width+'px'}"
                           size="mini">
                  <el-option v-if="item.key !== 'searchType' && item.key !== 'searchDateType'"
                             label="全部"
                             :value="null"></el-option>
                  <el-option v-for="item in item.selectOption"
                             :key="item.id"
                             :label="item.label"
                             :value="typeof(searchData[item.key]) == 'number'? Number(item.id):String(item.id)"></el-option>
                </el-select>
                <el-tooltip :content="item.helpTxt"
                            placement="top">
                  <i v-show="item.helpTxt && item.helpTxt!==null && item.helpTxt!==''"
                     class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </el-form-item>
              <!-- 时间类型 -->
              <el-form-item v-if="item.type === 3 || item.type === 'datetime'"
                            :key="index"
                            :label="item.label===''?'':item.label+'：'">
                <el-date-picker v-if="!item.isScope"
                                v-model="searchData[item.key]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                type="datetime"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
                <el-date-picker v-if="item.isScope"
                                v-model="searchData[item.key][0]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                type="datetime"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
                <span v-if="item.isScope">~</span>
                <el-date-picker v-if="item.isScope"
                                v-model="searchData[item.key][1]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                type="datetime"
                                size="mini"
                                placeholder="选择日期时间">
                </el-date-picker>
                <el-tooltip :content="item.helpTxt"
                            placement="top">
                  <i v-show="item.helpTxt && item.helpTxt!==null && item.helpTxt!==''"
                     class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </el-form-item>
              <!-- 日期类型 -->
              <el-form-item v-if="item.type === 4 || item.type === 'date'"
                            :key="index"
                            :label="item.label===''?'':item.label+'：'">
                <el-date-picker v-if="!item.isScope"
                                v-model="searchData[item.key]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd"
                                type="date"
                                size="mini"
                                placeholder="选择日期">
                </el-date-picker>
                <el-date-picker v-if="item.isScope"
                                v-model="searchData[item.key][0]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd"
                                type="date"
                                size="mini"
                                placeholder="选择日期">
                </el-date-picker>
                <span v-if="item.isScope">~</span>
                <el-date-picker v-if="item.isScope"
                                v-model="searchData[item.key][1]"
                                :style="{'width':item.width+'px'}"
                                value-format="yyyy-MM-dd"
                                type="date"
                                size="mini"
                                placeholder="选择日期">
                </el-date-picker>
                <el-tooltip :content="item.helpTxt"
                            placement="top">
                  <i v-show="item.helpTxt && item.helpTxt!==null && item.helpTxt!==''"
                     class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </el-form-item>
              <br :key="item.key"
                  v-if="item.isLineFeed" />
            </template>
          </el-form>
          <div class="right-btns"
               v-if="itemConfig ==='mainConfigData'">
            <el-button v-if="mainConfigData.length!==0"
                       type="common"
                       size="mini"
                       icon="el-icon-search"
                       @click="clickSearchBtn">查询</el-button>
            <el-button v-if="mainConfigData.length!==0"
                       icon="el-icon-refresh"
                       size="mini"
                       @click="resetSearchBtn">重置</el-button>
            <el-button v-if="subConfigData.length!==0"
                       type="text"
                       size="mini"
                       @click="toggleMoreSearch">{{isShowMoreSearch?"关闭更多":"更多搜索"}}</el-button>
          </div>
        </div>
        <!-- 右侧按钮列表区域 -->
        <div class="btn-box fr"
             v-if="itemConfig ==='mainConfigData' && isShowBtnList">
          <btn-list :btnListData="btnListData"
                    :maxShow="maxShow"
                    @clickBtn="clickBtn"></btn-list>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "Tableheader",
  data() {
    return {
      layout: ["mainConfigData", "subConfigData"],
      isShowMoreSearch: false,
      // 按钮列表部分-------------
      // 实际显示个数
      showCount: 0,
      showBtnData: []
    };
  },
  props: {
    // 配置
		/* MainConfigData: [
			{
				label: "姓名",
				key: "name",
				type: 3,
				isScope: true,
				selectKey: "",
				isLineFeed: false,
				isMain: true,
				default: "",
				width: "120",
				icon: "String",
				style: "String",
				farmat: "",
				isShow: false,
				sort: 1,
				helpTxt: ""
			},
			{
				label: "姓名",
				key: "name",
				type: 2,
				isScope: true,
				selectOption: [
					{
						label: "全部",
						id: 0
					},
					{
						label: "公共",
						id: 1
					},
					{
						label: "全部",
						id: 2
					}
				],
				isLineFeed: false,
				isMain: true,
				default: "",
				width: "120",
				icon: "String",
				style: "String",
				farmat: "",
				isShow: false,
				sort: 1,
				helpTxt: ""
			}
		] */
    mainConfigData: {
      type: Array,
      default: () => {
        return []
      }
    },
    subConfigData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 搜索数据
    searchData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 最多显示多少个按钮
    maxShow: {
      type: Number,
      default: () => {
        return 10
      }
    },
    // 获取的按钮数据
    btnListData: {
      type: Array,
      default: () => {
        return []
      }
    },
    isShowBtnList: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  mounted() {
    this.showCount = this.maxShow;
  },
  methods: {
    clickSearchBtn() {
      this.$emit("clickSearch");
    },
    resetSearchBtn() {
      this.$emit("resetSearch");
    },
    toggleMoreSearch(val) {
      this.isShowMoreSearch = !this.isShowMoreSearch;
      this.$emit("showMoreSearch", this.isShowMoreSearch);
    },
    // 按钮列表部分 ---------------
    clickBtn(key) {
      if (typeof key === "string") {
        this.$emit("clickBtn", key);
      }
    },
    showAll() {
      this.showCount = this.btnListData.length;
    },
    showMax() {
      this.showCount = this.maxShow;
    }
  }
};
</script>

<style scoped lang="stylus">
>>>.el-form-item
  margin-right 14px

.left-search
  position relative
  padding-right 235px

  .right-btns
    position absolute
    right 0
    top 0
    width 234px
    height 40px
    line-height 40px

>>>.el-form-item__label
  padding-right 5px
</style>
