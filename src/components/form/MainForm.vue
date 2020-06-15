<!--
 * @Description: 主表单组件
 * @Author: jiaxin
 * @Date: 2019-01-08 14:58:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-10 16:36:55
 -->
<template>
  <el-form :model="data"
           :ref="refName"
           :custom-class="className"
           :rules="rules">
    <template v-for="(rowItem, rowIndex) in form">
      <el-row :key="rowIndex">
        <template v-for="(colItem, colIndex) in rowItem">
          <el-col v-if="!colItem.hidden"
                  :key="colIndex"
                  :span="colItem.span">
            <template v-for="(item, index) in colItem.list">
              <!-- 只读模式 -->
              <el-form-item :key="index"
                            v-if="item.type === 'readOnly' && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.beforeTxt">{{item.beforeTxt}}</span>
                <span class="text-wrap">{{data[item.prop] | stringFilter(item.optionCode?options[item.optionCode]:item.format)}}</span>
                <span v-if="item.afterTxt">{{item.afterTxt}}</span>
              </el-form-item>
              <!-- 文本类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'text' && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly && !$dataIsNull(data[item.prop])">
                  <span v-if="item.beforeTxt">{{item.beforeTxt}}</span>
                  <span class="text-wrap">{{data[item.prop]}}</span>
                  <span v-if="item.afterTxt">{{item.afterTxt}}</span>
                </span>
                <el-input v-if="!item.readOnly"
                          v-model.trim="data[item.prop]"
                          :maxlength="item.maxLength?item.maxLength:20"
                          :placeholder="item.placeholder"
                          @change="item.change?textChange($event, item.change,item.changeFn): null"
                          :disabled="item.disabled">
                  <template v-if="item.beforeTxt"
                            slot="prepend">{{item.beforeTxt}}</template>
                  <template v-if="item.afterTxt"
                            slot="append">{{item.afterTxt}}</template>
                </el-input>
              </el-form-item>
              <!-- 可搜索文本类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'autocomplete'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-autocomplete v-model="data.unCreditCode"
                                 :fetch-suggestions="querySearchAsync"
                                 :trigger-on-focus="false"
                                 @select="handleSelect"></el-autocomplete>
              </el-form-item>
              <!-- 滑块开关类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'switch'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly">
                  {{item.on?data[item.prop] === item.on? "是":"否":data[item.prop]?"是":"否" }}
                </span>
                <el-switch v-if="!item.readOnly"
                           v-model="data[item.prop]"
                           :disabled="item.disabled"
                           :active-value="typeof item.on === 'undefined'?true:item.on"
                           :inactive-value="typeof item.off === 'undefined'?false:item.off"
                           @change="item.changeFn?switchChange($event, item.changeFn): null"></el-switch>
              </el-form-item>
              <!-- 文本域类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'textarea'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.prop]}}
                </span>
                <!-- 文本域类型 -->
                <el-input v-if="!item.readOnly"
                          type="textarea"
                          :rows="item.rows"
                          maxlength="200"
                          v-model="data[item.prop]"
                          :disabled="item.disabled"></el-input>
              </el-form-item>
              <!-- 密码类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'password'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly">
                  {{data[item.prop]}}
                </span>
                <!-- 密码类型 -->
                <el-input v-if="!item.readOnly"
                          type="password"
                          :rows="item.rows"
                          maxlength="16"
                          v-model.trim="data[item.prop]"
                          :disabled="item.disabled"
                          :show-password="item.showPassword"></el-input>
              </el-form-item>
              <!-- 数字类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'number'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.prop] | numberFilter(item.format)}}
                </span>
                <!-- 数字类型 -->
                <el-input v-if="!item.readOnly"
                          type="number"
                          maxlength="16"
                          @change="item.change?textChange($event, item.change,item.changeFn): null"
                          v-model.trim="data[item.prop]"
                          :disabled="item.disabled"></el-input>
              </el-form-item>
              <!-- 三级地理 -->
              <el-form-item :key="index"
                            v-if="item.type === 'areas'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <choice-areas v-if="!item.readOnly"
                              :data="data[item.value]"
                              :prop="item.propArray"
                              @returnData="changeArea($event, item.propLabel)"
                              :disabled="item.disabled"></choice-areas>
                <span v-if="item.readOnly">{{$filters.area(data[item.value][0])}}{{$filters.area(data[item.value][1])}}{{$filters.area(data[item.value][2])}}</span>
              </el-form-item>
              <!-- 日期类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'date'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.prop] | dateFilter("yyyy-MM-dd")}}
                </span>
                <el-date-picker v-if="!item.readOnly"
                                v-model="data[item.prop]"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                :disabled="item.disabled"
                                @change="timeChange($event, 'date', item.prop)">
                </el-date-picker>
              </el-form-item>
              <!-- 日期时间类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'datetime'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.prop] | dateFilter("yyyy-MM-dd hh:mm:ss")}}
                </span>
                <el-date-picker v-if="!item.readOnly"
                                v-model="data[item.prop]"
                                type="datetime"
                                value-format="yyyy-MM-dd hh:mm:ss"
                                placeholder="选择日期时间"
                                :disabled="item.disabled"
                                @change="timeChange($event, 'datetime', item.prop)">
                </el-date-picker>
              </el-form-item>
              <!-- 下拉框类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'select'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.prop] | stringFilter(item.optionCode?options[item.optionCode]:item.format) }}
                </span>
                <el-select v-if="!item.readOnly"
                           :multiple="item.multiple"
                           :popper-class="item.selectConfig?'titel-select':null"
                           v-model="data[item.prop]"
                           placeholder="请选择"
                           :filterable="item.notfilter? false: true"
                           :filter-method="item.filterMethod"
                           @change="selectChange($event, item.selectCode?option[item.selectCode]:options[item.optionCode], item.changeFn)"
                           :disabled="item.disabled">
                  <li v-if="item.selectConfig"
                      class="option-title">
                    <span class="option-item"
                          style="width: 60px">序号</span>
                    <span v-for="(item, index) in item.selectConfig.title"
                          :key="index"
                          class="option-item"
                          :style="{'width':item.width}">{{item.label}}</span>
                  </li>
                  <el-option v-for="(subitem, subIndex) in item.selectCode?option[item.selectCode]:options[item.optionCode]"
                             :key="subitem.id"
                             :label="subitem.label"
                             :value="typeof(data[item.prop]) == 'number'?Number(subitem.id):String(subitem.id)">
                    <div v-if="item.selectConfig">
                      <span class="option-item"
                            style="width: 60px">{{subIndex + 1}}</span>
                      <span v-for="(item, index) in item.selectConfig.title"
                            :key="index"
                            class="option-item"
                            :style="{'width':item.width}"
                            :title="subitem[item.prop] | stringFilter(item.format)">{{subitem[item.prop] | stringFilter(item.format)}}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 分页下拉框类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'paginationSelect'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      class="text-wrap">
                  {{data[item.showProp]}}
                </span>
                <pagination-select v-if="!item.readOnly"
                                   :ref="item.ref"
                                   :initData="data[item.prop]"
                                   :config="item.selectConfig"
                                   :options="item.option"
                                   :disabled="item.disabled"
                                   @change="paginationSelectChange($event, item.changeFn)"></pagination-select>
              </el-form-item>
              <!-- 级联选择器 动态加载次级选项-->
              <el-form-item :key="index"
                            v-if="item.type === 'cascader'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-cascader :ref="item.changeFn"
                             :options="options[item.optionCode]"
                             :value="data[item.value]"
                             :show-all-levels="item.showAllLevels ? true : false"
                             @change="cascaderChange($event,item)"
                             :props="item.defaultProps"
                             :disabled="item.disabled"></el-cascader>
              </el-form-item>
              <!-- 组织机构选择 -->
              <el-form-item :key="index"
                            v-if="item.type === 'org'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <Cascader :choiceId.sync="data[item.prop]"
                          :props="orgProps"
                          :bodyData="orgTree"></Cascader>
              </el-form-item>
              <!-- 分类选择 -->
              <el-form-item :key="index"
                            v-if="item.type === 'class'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <class-choice :classType="item.classType"
                              :isShowRoot="item.isShowRoot"
                              :disabledId="item.disabledId"
                              :choiceId.sync="data[item.prop]"
                              @change="classChange"></class-choice>
              </el-form-item>
              <!-- 系统表格列选择 -->
              <el-form-item :key="index"
                            v-if="item.type === 'table'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <table-choice :choiceId.sync="data[item.prop]"></table-choice>
              </el-form-item>
            </template>

          </el-col>
        </template>
      </el-row>
    </template>
    <div v-if="button.isShow"
         class="footer"
         :class="'text-' + button.align">
      <template v-for="(item, index) in button.list">
        <el-button v-if="item.isShow && item.type === 'submit'"
                   :type="item.style"
                   @click="submit(item.ajaxType, item.url, item.resolve, item.reject)"
                   :key="index"
                   :size="item.size">{{item.text}}</el-button>
        <el-button v-if="item.isShow && item.type === 'cancel'"
                   :type="item.style"
                   @click="cancel(item.resolve)"
                   :key="index"
                   :size="item.size">{{item.text}}</el-button>
      </template>
    </div>
  </el-form>
</template>

<script>
import ChoiceAreas from "@/components/form/ChoiceAreas";
import ClassChoice from '@/components/form/ClassChoice';
import TableChoice from '@/components/form/TableChoice';
import Cascader from "@/components/tree/cascader";
import PaginationSelect from "@/components/select/PaginationSelect";
import { mapGetters } from 'vuex';
let _this
export default {
  data() {
    _this = this
    return {
      // 自动补全获取结果数组
      restaurants: [
        // { "value": "1111111" }
      ],
      // 暂存子列表数据
      childrenArr: [],
      // 下拉框 option对象
      option: {},
      loading: false,
      areas: [],
      orgProps: {
        value: "id",
        children: 'children',
        label: 'orgName',
        checkStrictly: true
      }
    }
  },
  props: {
    size: {
      type: String,
      default: () => {
        return "small"
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    refName: {
      type: String,
      default: () => {
        return "mainForm"
      }
    },
    className: {
      type: String,
      default: () => {
        return null
      }
    },
    // 双向绑定的数据
    // 实例如下
    // data: {
    // 	id: "1232312",
    // 	orgId: "1232312", // 组织机构ID
    // 	companyName: "", // 企业名称
    // 	unCreditCode: "", // 统一信用代码
    // 	comState: "", // 企业跟进状态
    // },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 配置数据
    // 实例如下 二维数组
    // form: [
    // 	[ //表示一行的数据
    // 		{//表示本行内一列数据
    // 			span: 12,
    // 			labelWidth: "120px", //string
    // 			list: [
    // 				{
    // 					type: "text",        //string  类型(text, textarea, areas, date, datetime, autocomplete, switch, select)
    // 					label: "企业名称：",  //string
    // 					prop: "companyName", //string  字段名   areas类型下为数组["province", "city", "county"]  其余为string
    // 					rows: 4,             // number  textarea类型下控制默认显示行高
    // 					selectCode: "companyName" //string  接口请求下拉框数据,
    // 					optionCode: "companyName" //string  直接使用父级传入的option数据
    //				    disabled: true,     //控制禁用
    // 				},
    //				{
    //					type: "paginationSelect",  分页搜索下拉框
    //					label: "仓库：",
    //					prop: "hubId",
    //					changeFn: "hubIdChange",  数据变化后的父级回调函数命名
    //					selectConfig: {
    //						ajax: {
    //							type: "get",
    //							url: '/api/storage-service/houses',
    //							queryProp: "houseName"  请求查询的字段
    //						},
    //						pageSize: 20,
    //						title: [       显示数据表格标题数据，同时影响到表格布局显示
    //							{
    //								label: "仓库编号",
    //								prop: "houseNo",
    //								width: "140px"，
    //                              format: [{value:1, label: "1111"}]  数据过滤内容
    //							},
    //							{
    //								label: "仓库名称",
    //								prop: "houseName",
    //								width: "200px"
    //							}
    //						],
    //						defaultProp: {
    //							value: "id",
    //							label: "houseName"
    //						}
    //					},
    //					option: [] 当修改的时候初始化option数据
    //				},
    // 			]
    // 		}
    // 	]
    // ],
    form: {
      type: Array,
      default: () => {
        return []
      }
    },
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    button: {
      type: Object,
      default: () => {
        return {
          isShow: false,
          align: "center",
          list: [
						/* {
							style: "common",
							size: "mini",
							isShow: true,
							text: "保存",
							type: "submit",
							ajaxType: "put",
							url: "/api/customer-service/customers",
							resolve: "saveSuccess",  //请求成功后父组件回调函数名
							reject: "saveFailed",	//请求失败后父组件回调函数名
						},
						{
							style: null,
							size: "mini",
							isShow: true,
							text: "取消",
							type: "cancel",
							resolve: "cancel"
						} */
          ]
        }
      }
    }
  },
  components: {
    ChoiceAreas,
    ClassChoice,
    TableChoice,
    Cascader,
    PaginationSelect
  },
  methods: {
    // 修改三级地理数据
    changeArea(data, propLabelArray) {
      data.prop.map((item, index) => {
        this.data[item] = data.value[index] ? data.value[index] : null;
        if (Array.isArray(propLabelArray) && propLabelArray.length !== 0) {
          this.data[propLabelArray[index]] = data.label[index];
        }
      })
    },
    // 自动补全统一信用代码 -----------------------------------
    querySearchAsync(queryString, cb) {
      if (queryString.length < 4) return;
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // 遍历获取其中selectCode 并 请求获取
    getSelect(arr) {
      let codeList = new Set();
      arr.map((topItem) => {
        if (topItem.length !== 0) {
          topItem.map((subItem) => {
            subItem.list.map((item) => {
              if (item.type === "select" && item.selectCode) {
                codeList.add(item.selectCode)
              }
            })
          })
        }
      })
      if (codeList.size === 0) return;
      const codes = Array.from(codeList).join(",");
      return new Promise((resolve, reject) => {
        this.axios.get(`/api/common-service/select/${codes}/options`).then((res) => {
          // eslint-disable-next-line eqeqeq
          if (res.statusCode == 200) {
            this.option = {};
            // 组合option数据
            res.data.map((item) => {
              this.option[item.code] = [];
              item.options.map((subItem) => {
                this.option[item.code].push({
                  id: subItem.value,
                  label: subItem.text
                })
              })
            })
          }
          resolve();
        });
      })
    },
    // 父组件获取验证情况/验证后的数据
    returnData() {

    },
		/**
		 * @description: 内部提交表单
		 * @param ajaxType {string}
		 * @param url {string}
		 * @param resolve {string}   成功回调函数名
		 * @param reject {string}    失败回调函数名
		 * @return:
		 */
    submit(ajaxType, url, resolve, reject) {
      this.$refs[this.refName].validate((valid) => {
        if (valid) {
          // 过滤文件前后空格
          this.trim();
          this.axios[ajaxType](url, this.data).then((res) => {
            // eslint-disable-next-line eqeqeq
            if (res.statusCode == 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$refs[this.refName].clearValidate();
              if (resolve) {
                this.$emit("callback", resolve, res)
              }
            } else {
              if (reject) {
                this.$emit("callback", reject, res)
              }
            }
          })
        } else {
          this.$message({
            message: "表单信息有误，请检查确认",
            type: 'warning'
          })
        }
      })
    },
    cancel(resolve) {
      this.$emit("callback", resolve)
    },
    trim() {
      // 过滤文件前后空格
      for (const item in this.data) {
        let val = this.data[item];
        this.data[item] = this.$text.trim(val);
      }
    },
    // 外部提交验证
    validate(callback) {
      this.$refs[this.refName].validate((valid) => {
        if (valid) {
          if (callback) {
            this.trim();
            callback(this.data)
          }
        } else {
          return false;
        }
      });
    },
    // 校验字段
    validateField(field) {
      this.$refs[this.refName].validateField(field);
    },
    // 清除校验结果
    clearValidate() {
      this.$refs[this.refName].clearValidate();
    },
    cascaderChange(arr, config) {
      const node = this.$refs[config.changeFn][0].getCheckedNodes();
      this.$emit(config.changeFn, arr, node);
    },
    classChange(node) {
      this.$emit("classChange", node);
    },
    // 普通下拉框相关方法部分 -------------------------------
    selectChange(val, option, functionName) {
      if (functionName) {
        const data = option.find((item) => {
          // eslint-disable-next-line eqeqeq
          if (item.id != null && item.id == val) return item
        });
        this.$emit(functionName, [val, data]);
      }
    },
    // 分页下拉框相关方法部分 -------------------------------
    paginationSelectChange([val, data], functionName) {
      if (functionName) {
        this.$emit(functionName, [val, data])
      }
    },
		/**
		 * @description: 文本变化
		 * @param {String}  val   [变化后的值]
		 * @param {String}  prop  [发生变化的字段名]
		 * @param {Object}  changeObj [产生关联的字段名数组]
		 *               change: {
		 *						type: "price",
		 *						amount: "qty", 数据参数唯一
		 *						total: "qty",  总价和单价 可以是一对一字符串 也可以是一对一的数组
		 *						price: "salesPrice"
		 *					}
		 *
		 *
		 * @return:
		 */
    textChange(val, changeObj, functionName) {
      if (changeObj.type === "price") {
        this.priceChange(val, changeObj);
      }
      if (changeObj.type === "changeFns") {
        this.$emit(functionName, val)
      }
    },
    timeChange(val, type, prop) {
      this.$emit(`${type}Change`, val, prop);
    },
    switchChange(val, functionName) {
      this.$emit(functionName, val);
    },
    // 处理价格变化
    priceChange(val, changeObj) {
      const regPrice = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      const regAmout = new RegExp(`^[0-9]{1,10}$`);
      const { thisProp, amount, price, total } = changeObj;
      if (thisProp === "amount") {
        if (!regAmout.test(val)) return;
      } else {
        if (!regPrice.test(val)) return;
      }
      const value = Number(val);
      let [priceItem, totalItem, amountItem] = [null, null, null]
      switch (thisProp) {
        case "amount":
          if (Array.isArray(price)) {
            price.map((item, index) => {
              priceItem = this.data[item];
              totalItem = this.data[total[index]];
              if (regPrice.test(priceItem)) {
                // 有正确的单价
                this.data[total[index]] = (priceItem * value).toFixed(2);
              } else if (!regPrice.test(priceItem) && regPrice.test(totalItem)) {
                // 无正确单价 有正取总价
                this.data[item] = (totalItem / value).toFixed(2);
              }
            })
          } else {
            priceItem = this.data[price];
            totalItem = this.data[total];
            if (regPrice.test(priceItem)) {
              // 有正确的单价
              this.data[total] = (priceItem * value).toFixed(2);
            } else if (!regPrice.test(priceItem) && regPrice.test(totalItem)) {
              // 无正确单价 有正取总价
              this.data[price] = (totalItem / value).toFixed(2);
            }
          }
          break;
        case "price":
          amountItem = this.data[amount];
          totalItem = this.data[total];
          if (regAmout.test(amountItem)) {
            // 有正确的数量
            this.data[total] = (amountItem * value).toFixed(2);
          }
          break;
        case "total":
          amountItem = this.data[amount];
          priceItem = this.data[price];
          if (regAmout.test(amountItem)) {
            // 有正确的数量
            this.data[price] = (value / amountItem).toFixed(2);
          }
          break;
        default:
          break;
      }
    }

  },
  computed: {
    ...mapGetters(["orgTree"])
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
    form: {
      immediate: true,
      handler: function (val) {
        if (Array.isArray(val)) this.getSelect(val);
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-autocomplete, .el-date-editor.el-input
  width 100%

.text-wrap
  word-break break-all
</style>
