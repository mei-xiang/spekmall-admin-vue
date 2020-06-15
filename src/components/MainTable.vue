<!--
 * @Description: 本系统统一主表格组件
 * @Author: jiaxin
 * @LastEditors: Please set LastEditors
 * @Date: 2018-11-06 16:39:02
 * @LastEditTime: 2020-06-10 15:30:54
 -->

<template>
  <el-form :model="formData"
           ref="form">
    <el-table :border="hasBorder"
              stripe
              ref="table"
              :data="tbodyData"
              style="width: 100%"
              :max-height="maxHeight"
              :height="height"
              :show-summary="showSummary"
              :summary-method="summaryFn"
              highlight-current-row
              @sort-change='sortChange'
              @expand-change='expandChange'
              @cell-click="cellClick"
              @current-change="currentChange"
              @selection-change="handleSelectionChange">
      <!--选择-->
      <el-table-column v-if="hasSelection"
                       type="selection"
                       width="50"
                       @click.stop="clickIndex">
      </el-table-column>
      <!--序号-->
      <el-table-column v-if="hasIndex"
                       type="index"
                       label="序号"
                       fixed
                       width="55">
      </el-table-column>
      <!-- 展开行部分 -->
      <el-table-column v-if="showExpand"
                       type="expand"
                       :label="expandTitle"
                       width="80">
        <!-- eslint-disable-next-line vue/no-unused-vars -->
        <template slot-scope="scope">
          <slot name="expand"
                :data="expandDataCopy"></slot>
        </template>

      </el-table-column>
      <!--数据源-->
      <template v-for="(column, index) in theaderData">
        <el-table-column v-if="typeof column.isShow === 'function'?column.isShow():column.isShow"
                         header-align="center"
                         :show-overflow-tooltip="column.type===12 || column.type===10 ? false:true"
                         :width="column.width"
                         min-width="120px"
                         :sortable="column.hasSort?'custom':false"
                         :key="index"
                         :fixed="column.isFixed"
                         :prop="column.prop"
                         :label="column.label">
          <!-- 自定义表头 -->
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template slot="header"
                    slot-scope="scope">
            <span v-show="!column.slotType"
                  class="ellipsis">{{scope.column.label}}</span>
            <el-button v-if="column.slotType === 'button'"
                       type="text"
                       size="mini"
                       @click="headerButtonClick(scope.column.prop)">{{scope.column.label}}</el-button>
          </template>
          <template slot-scope="scope">
            <!-- 普通表格 -->
            <span v-if="column.type===0 || column.type=== 'string'">
              {{scope.row[column.prop] | stringFilter(column.optionCode?(column.optionByProp?options[column.optionCode][scope.row[column.optionByProp]]:options[column.optionCode]):column.format)}}
            </span>

            <!-- 按钮表格 -->
            <el-button v-if="column.type===1 && !column.prop"
                       @click.stop="buttonClick(scope.row, scope.$index, column.fn)"
                       type="text"
                       size="small">{{column.btnListLabel}}</el-button>
            <el-button v-if="column.type===1 && typeof scope.row[column.prop] ==='string'"
                       @click.stop="buttonClick(scope.row,scope.$index)"
                       type="text"
                       size="small">{{scope.row[column.prop]}}</el-button>
            <span v-if="column.type===1 && typeof column.btnList ==='object'">
              <el-button v-for="(item,index) in column.btnList"
                         :key="index"
                         v-show="item.hidden?item.hidden(scope.row, formData.data, scope.$index):true"
                         @click.stop="buttonsClick(item.fn,scope.row,scope.$index, formData.data)"
                         :type="item.type?item.type:'text'"
                         size="small">{{item.label}}</el-button>
            </span>

            <!-- 滑块按钮表格 -->
            <el-switch v-if="(column.type===2 || column.type==='switch')"
                       v-model="scope.row[column.prop]"
                       @change="switchChange(scope.row)"
                       active-color="#13ce66"
                       inactive-color="#ccc">
            </el-switch>

            <!-- 图标表格 -->
            <i v-if="column.type===3 || column.type=== 'icon'"
               class="table-icon"
               :class="scope.row[column.prop].class"
               :title="scope.row[column.prop].title"
               @click="buttonClick(scope.row,scope.$index)"></i>

            <!-- 状态类型表格 -->
            <!-- 以下是 只显示 √ 显示方案 -->
            <i v-if="column.type===4 || column.type=== 'state'">{{scope.row[column.prop] ? "√" : ""}}</i>
            <!-- 以下是√ 和 × 显示方案 -->
            <!-- <i :class="{'el-icon-check':scope.row[column.prop],'el-icon-close':!scope.row[column.prop]}"></i> -->
            <!-- 以下是文字显示方案 -->
            <!-- <span v-if="!column.option"
						:class="{'fn-green':scope.row[column.prop],'fn-red':!scope.row[column.prop]}">{{scope.row[column.prop]?"启用":"禁用"}}</span>
					<span v-if="column.option"
						:class="{'fn-green':scope.row[column.prop],'fn-red':!scope.row[column.prop]}">{{scope.row[column.prop]?column.option[0]:column.option[1]}}</span> -->

            <!-- 超链接表格 -->
            <a v-if="column.type===5 || column.type=== 'url'"
               :href="scope.row[column.prop].url"
               class="fn-blue"
               target="view_window">{{scope.row[column.prop].label}}</a>

            <!-- 可编辑表格（点击切换） -->
            <span v-if="column.type===6">
              <el-input size="small"
                        :type="column.inputType?column.inputType:'text'"
                        v-if="!scope.row.noInput && scope.row.isInput"
                        v-model.trim="scope.row[column.prop]"
                        placeholder="请输入内容"
                        class="t-input"
                        :maxlength="column.maxLength?column.maxLength:40"
                        @blur="blur(scope.$index, column.prop)"
                        @change="inputChange($event, scope.$index, column.prop, scope.row)"></el-input>
              <span v-if="scope.row.noInput || !scope.row.isInput"
                    class="t-text">{{scope.row[column.prop]}}</span>
            </span>

            <!-- 彩色文字表格 -->
            <span v-if="column.type===7"
                  :class="scope.row[column.prop].color">{{scope.row[column.prop].text}}</span>

            <!-- 日期时间表格 -->
            <template v-if="column.type===8 || column.type=== 'date'">
              <span v-if="!column.isEdit">
                {{scope.row[column.prop] | dateFilter(column.format)}}
              </span>
              <!-- 可以编辑的格式 -->
              <el-form-item v-if="column.isEdit"
                            :prop="`data.${scope.$index}.${column.prop}`"
                            :rules="rules[column.prop]? rules[column.prop] :null">
                <el-date-picker v-model="scope.row[column.prop]"
                                :type="column.editType"
                                :value-format="column.editType ==='date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm:ss'"
                                placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </template>

            <!-- 数字格式表格 -->
            <span v-if="column.type===9 || column.type=== 'number'">{{scope.row[column.prop] | numberFilter(column.format)}}</span>

            <!-- 可编辑表格（一直显示编辑） 如果某一行不需要显示input 设置当前行 row noInput属性为 true-->
            <el-form-item v-if="column.type===10"
                          :prop="`data.${scope.$index}.${column.prop}`"
                          :rules="rules[column.prop]? rules[column.prop] :null">
              <el-input v-if="!scope.row.noInput"
                        size="small"
                        :type="column.inputType?column.inputType:'text'"
                        v-model.trim="scope.row[column.prop]"
                        placeholder="请输入内容"
                        class="t-input"
                        :maxlength="column.maxLength?column.maxLength:40"
                        @focus="focus(scope.$index, column.prop)"
                        @blur="blur(scope.$index, column.prop)"
                        @change="inputChange($event, scope.$index, column.prop, scope.row)"></el-input>
              <span v-if="scope.row.noInput">{{scope.row[column.prop]}}</span>
            </el-form-item>

            <!-- 省市区转义表格 -->
            <span v-if="column.type===11">{{scope.row[column.prop] | areaFilter}}</span>

            <!-- 下拉框表格  -->
            <el-form-item v-if="column.type===12"
                          :prop="`data.${scope.$index}.${column.prop}`"
                          :rules="rules[column.prop]? rules[column.prop] :null">
              <el-select size="small"
                         v-model="scope.row[column.prop]"
                         placeholder="请选择"
                         :filterable="column.notfilter? false: true"
                         :filter-method="column.filterMethod"
                         class="t-input"
                         :disabled="column.disabled"
                         @change="selectChange($event, column.optionCode?options[column.optionCode]:[], column.changeFn, scope.row, scope.$index)">
                <!-- 本行下拉框数据受本行其他数据影响 -->
                <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
                <el-option v-if="column.optionByProp"
                           v-for="item in options[column.optionCode]? options[column.optionCode][scope.row[column.optionByProp]]:[]"
                           :key="item.value"
                           :label="item.label"
                           :value="typeof(scope.row[column.prop]) == 'number'?Number(item.id):String(item.id)">
                </el-option>
                <!-- 本行下拉框数据不受本行其他数据影响 -->
                <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
                <template v-if="!column.optionByProp && !column.filterMethod">
                  <el-option v-for="item in  column.optionCode?options[column.optionCode]:column.format"
                             :key="item.value"
                             :label="item.label"
                             :value="typeof(scope.row[column.prop]) == 'number'?Number(item.id):String(item.id)">
                  </el-option>
                </template>
                <template v-if="!column.optionByProp && column.filterMethod">
                  <el-option v-for="item in  column.optionCode?options[column.optionCode]:column.format"
                             :key="item.value"
                             :label="item.label"
                             :value="typeof(scope.row[column.prop]) == 'number'?Number(item.id):String(item.id)">
                  </el-option>
                </template>
              </el-select>
              <!-- <span v-if="!scope.row.isInput"
							      class="t-text">{{scope.row[column.prop] | stringFilter(column.optionCode?options[column.optionCode]:column.format)}}</span> -->
            </el-form-item>

            <!-- 图片 -->
            <el-image v-if="column.type===13 || column.type=== 'img'"
                      style="height: 30px"
                      :src="scope.row[column.prop]?fileUrl + scope.row[column.prop]: ''"
                      :preview-src-list="scope.row[column.srcList]?scope.row[column.srcList]:[fileUrl + scope.row[column.prop]]">
              <div slot="error"
                   class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>

            <!-- 数字计算表格 -->
            <span v-if="column.type===14">{{numberCompute(column.prop, scope.row, column.compute) | numberFilter(column.format)}}</span>
            <!-- 进度图 -->
            <span v-if="column.type===15"
                  :title="scope.row[column.prop].finish + '/' + scope.row[column.prop].all">
              <span class="progress-item"
                    v-for="n in scope.row[column.prop].all"
                    :class="{'active': n <= scope.row[column.prop].finish}"
                    :key="n"></span>
            </span>

            <!-- 分页下拉框类型 -->
            <el-form-item v-if="column.type===16"
                          :prop="`data.${scope.$index}.${column.prop}`">
              <pagination-select :ref="column.ref"
                                 :initData="scope.row[column.prop]"
                                 :config="column.selectConfig"
                                 :options="column.option"
                                 :disabled="column.disabled"
                                 @change="paginationSelectChange($event, column.changeFn)"></pagination-select>
            </el-form-item>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </el-form>

</template>

<script type="text/ecmascript-6">
import PaginationSelect from "@/components/select/PaginationSelect";
import { getStore } from 'js/store'
let _this = null
export default {
  name: 'MainTable',
  data() {
    _this = this
    return {
      activeRow: {},
      formData: { data: [] },
      expandDataCopy: [],
      fileUrl: null
    }
  },
  props: {
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
    //具有边框
    hasBorder: {
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
    // 是否显示展开行
    showExpand: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 展开行标题
    expandTitle: {
      type: String,
      default: () => {
        return "子项目"
      }
    },
    //是否显示合计
		/* 	summaryFunction: {
				type: Function,
				default: _this !== null ? _this.summaryFn : () => { }
			}, */
    //是否可以选择
    hasSelection: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    //是否点击行勾选
    clickRowSelect: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    //是否有序列项
    hasIndex: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 这是相应的字段展示
		/* theaderData: {以下是示例数据
			type: 0,         //<number> 0 文本内容  1、button 2、 switch  3、 icon  4 对号叉号表格  5超链接表格
			width: '120px',	 // <string> '120px' 宽度像素值  'none' 不设置宽度
			hasSort: false,  //<Boolean> 是否排序
			isShow: true,  //<Boolean> 是否展示
			isFixed: true,  //<Boolean> 是否冻结
			prop: 'name',   //<String>  对应与下方tbodyData的key 如 name：'老王'
			label: '姓名',  //<String>   表头标签
			summaryType:  0,  //<Number>   总计类型   0 合计   1平均值
			option：["是","否"]  //<Array>  type 4 情况下 填写的话按填写内容显示 无此项显示默认的 启用 禁用
			optionCode: <String>  从props中传入的options对象中获取value 实际作用等同于下面format 直接携带数据
			format： // 文本类型0下是 [{id：1, value: "内容"}]   时间类型是 "yyyy-MM-dd"     数字类型 "true,4" true表示是否显示千位分隔符 后面数字表示保留几位小数
		}, */
    theaderData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 这是数据源
		/* tbodyData: [
			{
				name: '老王',
				id: '456789',
				button: '新增', // 单个按钮
				btn: [	       // 多个按钮
						{
							label: "删除",
							type: "common",
							fn: "delBtn"
						},
						{
							label: "删除",
							type: "text",
							fn: "delBtn"
						}
					],
				switch: false,
				icon: {
					class: "icon-02",
					title: "我是title"
				},
				file: {
					label: "委托单打印模板.rptl",
					url: "http://www.baidu.com"
				},
				org: '深圳',
				date: '2017-11-12'
			},
		] */
    tbodyData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 展开部分的数据
    expandData: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => {
        return {}
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
  created() {
    this.fileUrl = getStore({ name: "serviceOption" }).fileUrl;
  },
  mounted() {
    $("body").click((e) => {
      let _con = $('.el-table '); // 设置目标区域
      if (!_con.is(e.target) && _con.has(e.target).length === 0) {
        this.closeInput()
      }
    })
  },
  components: {
    PaginationSelect
  },
  methods: {
    summaryFn(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '统计';
          return;
        }
        // 这一列数据的数组 非数字的为NaN
        const values = data.map(item => Number(item[column.property]));
        const key = column.property;
        // 针对 求和 和 求平均数 做区分
        const col = this.theaderData.find((item) => {
          if (item.prop === key) return item
        })
        sums[index] = '';
        if (col) {
          if (col.summaryType === 0 && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = '合计：' + this.$filters.number(sums[index], col.format);
          }
          if (col.summaryType === 1 && !values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = '平均值：' + this.$filters.number((sums[index] / data.length).toFixed(2), col.format);
          }
        }
      });
      return sums;
    },
    doLayout() {
      this.$refs.table.doLayout();
    },
    validate(callback) {
      this.$refs.form.validate((valid) => {
        if (valid) callback(valid)
      })
    },
    //将选中的行发送到父组件
    handleSelectionChange(val) {
      const selectionArr = [];
      val.forEach((el) => {
        selectionArr.push(el);
      });
      this.$emit('commitSelection', selectionArr);
    },
    // 表头slot button 事件
    headerButtonClick(prop) {
      this.$emit('headerButtonClick', prop);
    },
    // 单个按钮点击事件发送当前行给父组件
    buttonClick(val, index, fn) {
      this.$emit('buttonClick', val, index, fn);
    },
    // 多个按钮点击事件发送当前行给父组件
    buttonsClick(fn, val, index, allData) {
      // 父组件不是mainPage时
      this.$emit(fn, val, index, allData);
      // 父组件是mainPage时
      this.$emit('buttonClick', val, index, fn, allData);
    },
    // 滑块事件发送当前行给父组件
    switchChange(val, index) {
      this.$emit('switchChange', val, index);
    },
    // input变化事件
    inputChange(val, index, prop, row) {
      this.$emit('inputChange', val, index, prop, row);
    },
    focus(index, prop) {
      this.$emit('focus', index, prop);
    },
    blur(index, prop) {
      this.$emit('blur', index, prop);
    },
    closeInput() {
      if (!Array.isArray(this.tbodyData)) return;
      this.tbodyData.map((item) => {
        if (item.isInput) item.isInput = false;
      })
    },
		/* 表格通用规则：
		* 1、鼠标点击A行，选择框是选择状态，再点击B行则选中B行 A行取消
		* 2、复选要点击复选框(包含外侧表格)才能复选
		* 3、点击A行，应为选中状态，勾选状态，动作可以操作右上角的按钮以及所附属列表信息
		*/
    cellClick(row, column, cell, event) {
      if (column.type === "selection") {
        this.$refs.table.toggleRowSelection(row);
      } else {
        if (this.clickRowSelect) {
          this.$refs.table.clearSelection(row);
          this.$refs.table.toggleRowSelection(row);
        }
        this.closeInput();
        row.isInput = true;
        clearTimeout(this.rowClickTime);
        //防抖
        this.rowClickTime = setTimeout(() => {
          this.$emit("rowClick", row);
        }, 300);
      }
    },
    currentChange(row) {
      if (row === null) return;
      // 保存当前选中行，用于刷新后恢复高亮显示当前行
      this.activeRow = row;
    },
		/* rowDblclick(row, event, column) {
			// 双击勾选当前行
			this.$refs.table.toggleRowSelection(row);
		}, */
    // 排序变化
    sortChange(column) {
      this.$emit("sortChange", column.prop, column.order)
    },
    // 展开行变化
    expandChange(row, expandedRows) {
      this.expandDataCopy = Array.isArray(this.expandData) ? [] : {};
      // 只开启一个展开行，方便数据刷新，避免页面卡顿
      if (expandedRows.length === 1 && row.id === expandedRows[0].id) {
        this.$emit("expandChange", row);
      }
      if (expandedRows.length === 2) {
        if (row.id === expandedRows[1].id) {
          this.$emit("expandChange", row)
        }
        if (row.id !== expandedRows[0].id) {
          this.$refs.table.toggleRowExpansion(expandedRows[0], false);
        }
      }
    },
    // 普通下拉框相关方法部分
    selectChange(val, option, functionName, row, index) {
      if (functionName) {
        const data = option.find((item) => {
          // eslint-disable-next-line eqeqeq
          if (!this.$dataIsNull(item.id) && item.id == val) return item
        });
        //console.log(index)
        this.$emit(functionName, [val, data], row, index);
      }
    },
    // 分页下拉框相关方法部分 -------------------------------
    paginationSelectChange([val, data], functionName) {
      if (functionName) {
        this.$emit(functionName, [val, data])
      }
    },
		/**
		 * @description:数字计算方法
		 * @param {String}  prop [本列属性值]
		 * @param {Object}  rowData [本行数据对象]
		 * @param {Array}  dataArr [计算数据和符号组成的数组] 如 ['qty', "*", 'price'，"*", 2]
		 * @return:
		 */
    numberCompute: function (prop, rowData, dataArr) {
      if (!Array.isArray(dataArr)) return 0;
      const parseFn = (item) => {
        if (isNaN(item)) {
          switch (item) {
            case "+":
              return "+";
            case "-":
              return "-";
            case "*":
              return "*";
            case "/":
              return "/";
            case "(":
              return "(";
            case ")":
              return ")";
            case "%":
              return "%";
            default:
              return isNaN(rowData[item]) ? 0 : Number(rowData[item]);
          }
        } else {
          return item
        }
      }
      let text = null;
      dataArr.map((item) => {
        text += parseFn(item);
      })
      // eslint-disable-next-line no-eval
      const result = eval(text);
      rowData[prop] = result;
      return result;
    }

  },
  filters: {
    dateFilter: function (val, formatTxt) {
      return _this.$filters.date(val, formatTxt)
    },
    numberFilter: function (val, formatTxt) {
      return _this.$filters.number(val, formatTxt)
    },
    stringFilter: function (val, formatArr) {
      return _this.$filters.string(val, formatArr)
    },
    areaFilter: function (val) {
      return _this.$filters.area(val)
    }
  },
  watch: {
    tbodyData: {
      immediate: true,
      handler: function (val) {
        this.$set(this.formData, "data", val);
        // 没有id的不做控制
        if (!this.activeRow.hasOwnProperty("id")) return;
        // 根据对应的id，将刷新前选中的数据标记出来
        if (Array.isArray(val) && val.length !== 0 && val[0].id) {
          val.find((item) => {
            if (item.id === this.activeRow.id) {
              this.$nextTick(() => {
                this.$refs.table.setCurrentRow(item)
              })
            }
          })
        }
      }
    },
    expandData: {
      immediate: true,
      handler: function (val) {
        this.expandDataCopy = val
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
>>> .el-table .cell
  padding 0 2px
  white-space nowrap

  .el-input .el-input__inner
    height 36px
    line-height 36px

  .table-icon
    display inline-block
    width 24px
    height 24px
    // background url('../../assets/images/icons_test.png') no-repeat

  .el-form-item
    margin-bottom 0

    .el-form-item__error
      top 2px
      right 0
      left auto

.progress-item
  display inline-block
  margin-right 5px
  width 18px
  height 8px
  background-color #c0c4cc

  &.active
    background-color #2fc25b
</style>
