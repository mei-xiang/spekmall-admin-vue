<!--

 * @Description: 主页面 （动态）
 * @Author: jiaxin
 * @Date: 2019-01-02 15:58:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-12 11:27:12
 -->
<template>
  <div>
    <table-header :mainConfigData="mainConfigData"
                  :subConfigData="subConfigData"
                  :searchData="searchData"
                  @clickSearch="search"
                  @resetSearch="resetSearch"
                  @showMoreSearch="showMoreSearch"
                  :btnListData="btnListData"
                  :isShowBtnList="isShowBtnList"
                  @clickBtn="clickBtn"></table-header>
    <main-table ref="table"
                :height="height"
                :maxHeight="maxHeight"
                :hasIndex="true"
                :hasSelection="hasSelection"
                :theaderData="theaderData"
                :tbodyData="tbodyData"
                :options="options"
                :showSummary="showSummary"
                @sortChange="sortChange"
                @rowClick="rowClick"
                @buttonClick="buttonClick"
                @switchChange="switchChange"
                @commitSelection="clickChoicedData"></main-table>
    <main-pagination v-if="isShowPagination"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :pageSizes="pageSizes"
                     :total="total"
                     :time="time"
                     @currentChange="currentChange"
                     @sizeChange="sizeChange">
    </main-pagination>
  </div>
</template>

<script>
import TableHeader from "@/components/TableHeader";
import MainPagination from "@/components/MainPagination";

export default {
  name: "MainPage",
  data() {
    return {
      isMoreSearch: false,
      activeName: "first",
      tableUrlCopy: this.tableUrl,
      //  查询相关 -----------
      mainConfigData: [],
      subConfigData: [],
      searchData: {},
      searchParam: {},
      // 按钮列表部分
      btnListData: [],
      noSingle: true,
      noMore: true,
      theaderData: [],
      tbodyData: [],
      choicedData: [], // 表格选中的数据
      // 分页相关 -------------------------
      currentPage: 1,
      pageSizes: [20, 30, 50],
      pageSize: 20,
      time: 0,
      total: 0
    }
  },
  props: {
    // 显示表格左侧复选框控制器
    hasSelection: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 最大高度，超出高度tbody产生滚动条
    maxHeight: {
      type: [Number, String],
      default: () => {
        return null
      }
    },
    // 设置高度
    height: {
      type: [Number, String],
      default: () => {
        return null
      }
    },
    // 是否显示按钮列表
    isShowBtnList: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 是否显示分页
    isShowPagination: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    //是否显示统计列
    showSummary: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // tbody请求数据的url
    tableUrl: {
      type: String,
      default: () => {
        return null
      }
    },
    // 下拉框数据对象
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    TableHeader,
    MainPagination
  },
  methods: {
    setActiveRow(row) {
      this.$refs.table.activeRow = row;
    },
    // 选择列表行
    clickChoicedData(Arr) {
      this.choicedData = Arr;
      this.$emit('commitSelectionArr', Arr);
      if (Arr.length === 0) {
        this.noSingle = true;
        this.noMore = true;
      } else if (Arr.length === 1) {
        this.noSingle = false;
        this.noMore = true;
      } else {
        this.noSingle = true;
        this.noMore = false;
      }
    },
    // 初始化搜索值对象
    initSearchData() {
      this.searchData = {};
      const resetData = (item) => {
        const defaultValue = this.$dataIsNull(item.defaultValue) ? null : item.defaultValue;
        if (item.type === 0 || item.type === 2 || !item.isScope) {
          this.$set(this.searchData, item.key, defaultValue)
        } else {
          this.$set(this.searchData, item.key, [defaultValue, defaultValue])
        }
      }
      this.subConfigData.map((item) => {
        resetData(item);
      })
      this.mainConfigData.map((item) => {
        resetData(item);
      })
    },
    doLayout() {
      this.$refs.table.doLayout();
    },
    // 请求后台设置数据 转化为 本组件配置数据 并 设置页面获取数据
    // getPageConfig(pageCode) {
    //   return new Promise((resolve, reject) => {
    //     this.axios.get("/api/common-service/core/page/" + pageCode).then((res) => {
    //       if (res.data.items && res.data.items.length === 0) return;
    //       let toolbarData = res.data.items[0].toolbar.grid;
    //       let searchData = toolbarData.searchs;
    //       let buttonData = res.data.items[0].toolbar.buttons;
    //       let tableData = toolbarData.columns;
    //       let configData = {
    //         search: {
    //           mainConfigData: [],
    //           subConfigData: [],
    //           searchData: {}
    //         },
    //         btnListData: [],
    //         theaderData: [],
    //         pageSize: 20,
    //         pageSizes: [20, 30, 50]
    //       };
    //       let codeList = new Set();
    //       // 获取查询面板配置数据相关 ---------------------------------
    //       searchData.map(item => {
    //         let searchList = {
    //           label: item.labelName,
    //           key: item.fieldName,
    //           defaultValue: this.$dataIsNull(item.defaultValue) ? null : item.defaultValue,
    //           type: null,
    //           isScope: item.isRange,
    //           isLineFeed: item.isNextRow,
    //           width: item.width,
    //           icon: item.icon,
    //           style: item.cls,
    //           farmat: "",
    //           sort: item.orderNo,
    //           helpTxt: item.helpInfo,
    //           selectCode: item.dropDownCode
    //         };
    //         switch (item.type) {
    //           case 'text':
    //             searchList.type = 0;
    //             break;
    //           case 'num':
    //             searchList.type = 1;
    //             break;
    //           case 'combox':
    //             searchList.type = 2;
    //             searchList.selectOption = [];
    //             if (!this.$dataIsNull(item.dropDownCode)) codeList.add(item.dropDownCode);
    //             break;
    //           case 'date':
    //             searchList.type = 3;
    //             break;
    //           default:
    //             searchList.type = 0;
    //             break;
    //         }
    //         // 主次查询分类
    //         if (item.isMaster) {
    //           configData.search.mainConfigData.push(searchList);
    //         } else {
    //           configData.search.subConfigData.push(searchList);
    //         }
    //       })
    //       // 获取按钮列表 --------------------------------------------------
    //       buttonData.sort((a, b) => {
    //         return a.orderNum - b.orderNum
    //       })
    //       buttonData.map(item => {
    //         var buttonList = {
    //           label: item.name,
    //           icon: item.icon,
    //           disabled: null,
    //           fn: item.execFunc,
    //           permission: item.permissions,
    //           gridSelectModel: item.gridSelectModel
    //         }
    //         configData.btnListData.push(buttonList);
    //       })
    //       // 获取表格 -----------------------------------------------------
    //       tableData.map(item => {
    //         var tableList = {
    //           type: null,
    //           width: item.width === 0 ? "none" : item.width,
    //           hasSort: item.isSortable,
    //           isShow: item.isVisiable,
    //           prop: item.fieldName,
    //           label: item.caption,
    //           format: item.format,
    //           selectCode: item.dropDownCode
    //         };
    //         if (!this.$dataIsNull(item.dropDownCode)) codeList.add(item.dropDownCode);
    //         switch (item.dataType) {
    //           case 'String':
    //             tableList.type = 0;
    //             break;
    //           case 'Boolean':
    //             tableList.type = 4;
    //             break;
    //           case 'Datetime':
    //             tableList.type = 8;
    //             break;
    //           case 'Number':
    //             tableList.type = 9;
    //             break;
    //           default:
    //             tableList.type = 0;
    //             break;
    //         }
    //         configData.theaderData.push(tableList);
    //       })
    //       // 获取分页 ------------------------------------------------------
    //       if (toolbarData.pageSizeDefault > 0) configData.pageSize = toolbarData.pageSizeDefault;
    //       if (toolbarData.pageSizeList !== null && toolbarData.pageSizeList !== "") {
    //         configData.pageSizes = toolbarData.pageSizeList.split(",").map((item) => {
    //           return parseInt(item)
    //         });
    //       };
    //       // 根据转义的配置设置页面
    //       this.setPageConfig(configData, codeList);
    //       resolve();
    //     });
    //   })
    // },
    // 设置页面配置数据(本地设置)
		/* data = {
			ajaxData:{
				type: "get",
				url: "url",
				params: {id:10}, 初次刷新的 或者 外部刷新时的参数
			},
			search: {
				mainConfigData: [
					{
						label: item.labelName,
						key: item.fieldName,
						type: null,
						isScope: item.isRange,
						isLineFeed: item.isNextRow,
						width: item.width,
						icon: item.icon,
						style: item.cls,
						farmat: "",
						sort: item.orderNo,
						helpTxt: item.helpInfo,
						selectCode: item.dropDownCode,
						selectOption: [],
					}
				],
				subConfigData: [
					{
						label: item.labelName,
						key: item.fieldName,
						type: null,
						isScope: item.isRange,
						isLineFeed: item.isNextRow,
						width: item.width,
						icon: item.icon,
						style: item.cls,
						farmat: "",
						sort: item.orderNo,
						helpTxt: item.helpInfo,
						selectCode: item.dropDownCode
					}
				],
				searchData: { 组件内部刷新的时的参数
					comState: ""  // 搜索栏 key对应的键值对
				}
			},
			btnListData: [
				{
					label: item.name,
					icon: item.icon,
					gridSelectModel: 0, // 0 单选 1多选 2一直显示
					fn: item.execFunc
				}
			],
			theaderData: [
				{
					type: null,
					width: item.width === 0 ? "none" : item.width,
					hasSort: item.isSortable,
					isShow: item.isVisiable,
					prop: item.fieldName,
					label: item.caption,
					format: item.format,
					selectCode: item.dropDownCode
				}
			],
			pageSizes: [20, 30, 50]
		} */
    setPageConfig(data, codeList) {
      const getSelectCode = (arr) => {
        arr = arr.map((item) => {
          if (item.optionCode) item.selectOption = this.options[item.optionCode];
          return item
        })
      };
      // 搜索栏数据
      if (data.search) {
        if (data.search.mainConfigData) {
          this.mainConfigData = data.search.mainConfigData;
          getSelectCode(this.mainConfigData);
        }
        if (data.search.subConfigData) {
          this.subConfigData = data.search.subConfigData;
          getSelectCode(this.subConfigData);
        }
      };
      this.initSearchData();
      // 按钮数据
      if (data.btnListData) {
        data.btnListData.map((item, index) => {
          switch (item.gridSelectModel) {
            case 0:// 单选
              item.disabled = () => { return this.noSingle };
              break;
            case 1:// 多选
              item.disabled = () => { return this.noSingle && this.noMore };
              break;
            case 2:// 不选
              item.disabled = () => { return false };
              break;
            default:
              item.disabled = () => { return false };
              break;
          }
        })
        this.btnListData = data.btnListData;
      };
      // 表格数据
      if (data.theaderData) {
        this.theaderData = data.theaderData;
      };
      // 分页数据
      if (data.pageSizes) this.pageSizes = data.pageSizes;
      if (data.pageSize) this.pageSize = data.pageSize;
      // 根据配置下拉框的数量 确定是否获取下拉框后在获取数据（避免页面数据id转value的变化）
      const getList = (data) => {
        if (data) {
          this.getList(data);
        } else {
          this.resetSearch();
        }
      }
      getList(data.ajaxData);
    },
    // 获取下拉列表数据
    getSelect(codes) {
      return new Promise((resolve, reject) => {
        this.$select.getByCodes(codes)
          .then((obj) => {
            this.mainConfigData.map((item) => {
              if (item.selectCode && item.selectCode !== null) {
                item.selectOption = obj[item.selectCode]
              }
            })
            this.subConfigData.map((item) => {
              if (item.selectCode && item.selectCode !== null) {
                item.selectOption = obj[item.selectCode]
              }
            })
            this.theaderData.map((item) => {
              if (item.selectCode && item.selectCode !== null) {
                item.format = obj[item.selectCode]
              }
            })
            resolve();
          })
          .catch((res) => {
            reject(res)
          })
      })
    },
		/**
		 * @description: 获取tbody数据列(动态页面类型)
		 * @param {Object}  data 传入的ajax配置
		 *  {
		 * 		type：'post'
		 * 		url：'/url'
		 * 		params: {}
		 * }
		 * @return: 无
		 */
    getList(data) {
      // 消除返回数据中的空值
      const removeNull = (data) => {
        if (Array.isArray(data)) {
          return data.filter((item) => {
            if (!this.$dataIsNull(item)) return true
          })
        } else {
          return data;
        }
      }
      return new Promise((resolve, reject) => {
        if (data) {
          // 自定义页面查询方法
          this.tableUrlCopy = data.url;
          this.searchParam.pageNum = this.currentPage;
          this.searchParam.pageSize = this.pageSize;
          this.axios[data.type](data.url, this.searchParam).then((res) => {
            if (res.data.records) {
              this.tbodyData = removeNull(res.data.records);
            } else {
              this.tbodyData = removeNull(res.data);
            }
            this.choicedData = [];
            this.$handlerList(res);
             this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
            resolve(res);
          });
        } else {
          this.searchParam.pageNum = this.currentPage;
          this.searchParam.pageSize = this.pageSize;
          // 动态页面查询方法
          this.axios.get(this.tableUrlCopy, this.searchParam).then((res) => {
            // console.log(res);
            if (res.data.records) {
              this.tbodyData = removeNull(res.data.records);
            } else {
              this.tbodyData = removeNull(res.data);
            }
            this.choicedData = [];
            this.$handlerList(res);
            this.$emit("getSearchParam", this.searchParam);
            resolve(res);
          });
        }
      })
    },
    search() {
      let dateIsOk = true;
      this.searchParam = {}
      const setData = (item) => {
        if (item.key === "searchType") {
          this.searchParam[this.searchData["searchType"]] = this.searchData["searchTxt"];
        } else if ((item.type === 3 || item.type === 4) && item.isScope) {
          // 时间查询类型设置 对应的查询结果获取
          if (item.key === "searchDateArray") {
            this.searchParam[this.searchData["searchDateType"]] = this.searchData["searchDateArray"];
          } else {
            this.searchParam[item.key] = this.searchData[item.key];
          }
          // 判断开始时间不能大于结束时间
          let [start, end] = this.searchData[item.key]
          if (start !== '' && start !== null && end !== '' && end !== null) {
            if (new Date(start).getTime() > new Date(end).getTime()) {
              this.$message.warning("起始时间不能大于结束时间！")
              dateIsOk = false;
            }
          }
        } else {
          this.searchParam[item.key] = this.searchData[item.key];
        }
      }
      if (this.isMoreSearch) {
        this.subConfigData.map((item) => {
          setData(item);
        })
      }
      this.mainConfigData.map((item) => {
        setData(item);
      })
      if (!dateIsOk) return;
      this.currentPage = 1;
      this.getList();
    },
    resetSearch() {
      this.initSearchData();
      this.search();
    },
    clearList() {
      this.tbodyData = [];
    },
    showMoreSearch(val) {
      this.isMoreSearch = val;
      this.$emit("showMoreSearch")
    },
    // 点击工具栏按钮
    clickBtn(fn) {
      console.log('自定义页面按钮事件名称', fn);
      this.$emit("clickBtn", fn, this.$clone(this.choicedData))
    },
    rowClick(row) {
      this.$emit("rowClick", row)
    },
    buttonClick(val, index, fn, allData) {
      this.$emit("buttonClick", val, index, fn, allData)
    },
    switchChange(val, index, fn) {
      this.$emit("switchChange", val, index, fn)
    },
    // 排序
    sortChange(prop, order) {
      this.searchData.orderBy = prop;
      this.getList();
    },
    // 选择页码
    currentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    // 选择每页显示数量
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    }
  },
  watch: {
    tableUrl: {
      immediate: true,
      handler: function (val) {
        this.tableUrlCopy = val;
      }
    }
  }
}
</script>
