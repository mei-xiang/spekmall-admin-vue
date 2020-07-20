<!--
 * @Description: 主表组件
 -->
<template>
  <el-form :model="data"
           :ref="refName"
           :class="className"
           :label-position="labelPositon"
           label-width="100%"
           :rules="rules">
    <template v-for="(rowItem, rowIndex) in form">
      <el-row :key="rowIndex"
              :gutter="22">
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
                            :label-width="colItem.labelWidth"
                            :class="item.class">
                <span v-if="item.beforeTxt">{{item.beforeTxt}}</span>
                <span v-if="item.replaceTxt">{{item.replaceTxt}}</span>
                <span v-if="!item.replaceTxt">{{data[item.prop] | stringFilter(item.optionCode?options[item.optionCode]:item.format)}}</span>
                <span v-if="item.afterTxt">{{item.afterTxt}}</span>
              </el-form-item>
              <!-- 文本类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'text' && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly && !$dataIsNull(data[item.prop])"
                      :class="item.class">
                  <span v-if="item.beforeTxt">{{item.beforeTxt}}</span>
                  {{data[item.prop]}}
                  <span v-if="item.afterTxt">{{item.afterTxt}}</span>
                </span>
                <el-input v-if="!item.readOnly"
                          :placeholder="item.placeholder"
                          v-model.trim="data[item.prop]"
                          :maxlength="item.maxLength?item.maxLength:20"
                          @change="item.change?textChange($event, item.change,item.changeFn): null"
                          :disabled="item.disabled">
                  <template v-if="item.beforeTxt"
                            slot="prepend">{{item.beforeTxt}}</template>
                  <template v-if="item.afterTxt"
                            slot="append">{{item.afterTxt}}</template>
                </el-input>
              </el-form-item>
              <!-- 滑块开关类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'switch'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly&& !item.text1">
                  {{item.on?data[item.prop] === item.on? "是":"否":data[item.prop]?"是":"否" }}
                </span>
                <span v-if="item.readOnly&& item.text1">
                  {{item.on?data[item.prop] === item.on? item.text1:item.text2:data[item.prop]?item.text1:item.text2 }}
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
                <span v-if="item.readOnly">
                  {{data[item.prop]}}
                </span>
                <!-- 文本域类型 -->
                <el-input v-if="!item.readOnly"
                          type="textarea"
                          :placeholder="item.placeholder"
                          :rows="item.rows"
                          maxlength="200"
                          v-model.trim="data[item.prop]"
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
                          :placeholder="item.placeholder"
                          type="password"
                          :rows="item.rows"
                          maxlength="20"
                          v-model.trim="data[item.prop]"
                          :disabled="item.disabled"></el-input>
              </el-form-item>
              <!-- 数字类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'number'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly"
                      :class="item.class">
                  <span v-if="item.beforeTxt && data[item.prop]">{{item.beforeTxt}}</span>
                  {{data[item.prop] | numberFilter(item.format)}}
                  <span v-if="item.afterTxt && data[item.prop]">{{item.afterTxt}}</span>
                </span>
                <!-- 数字类型 -->
                <el-input v-if="!item.readOnly"
                          type="number"
                          maxlength="16"
                          @change="item.change?textChange($event, item.change,item.changeFn): null"
                          v-model.trim="data[item.prop]"
                          :disabled="item.disabled">
                  <template v-if="item.beforeTxt"
                            slot="prepend">{{item.beforeTxt}}</template>
                  <template v-if="item.afterTxt"
                            slot="append">{{item.afterTxt}}</template>
                </el-input>
              </el-form-item>
              <!-- 日期类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'date'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly">
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
                <span v-if="item.readOnly">
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
                <span v-if="item.readOnly">
                  {{data[item.prop] | stringFilter(item.optionCode?options[item.optionCode]:item.format) }}
                </span>
                <el-select v-if="!item.readOnly"
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
              <!--单选框类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'radios'  && !item.hidden "
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <span v-if="item.readOnly">
                  {{data[item.prop] | stringFilter(item.radioOptList)}}
                </span>
                <el-radio-group v-model="data[item.prop]"
                                v-if="!item.readOnly">
                  <el-radio v-for="i in item.radioOptList"
                            :label="i.value"
                            :key="i.value"
                            @change="item.changeFn?radioChange($event,data[item.prop], item.changeFn): null"
                            :value="i.value">{{i.text}}</el-radio>
                </el-radio-group>
                <!-- sp -->
              </el-form-item>
              <!--复选框类型 -->
              <el-form-item :key="index"
                            v-if="item.type === 'checkbox'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-checkbox-group v-model="data[item.prop]"
                                   v-if="!item.readOnly">
                  <el-checkbox @change="item.changeFn?checkboxChange($event,data[item.prop], item.changeFn): null"
                               v-for="i in item.checkOptList"
                               :label="i.value"
                               :key="i.value"
                               :value="i.value">{{i.label}}</el-checkbox>
                </el-checkbox-group>
                <span v-if="item.readOnly">{{ item.checkOptList | selectorFilter(data[item.prop]) }}</span>

              </el-form-item>
              <!-- 简版下拉框 -->
              <el-form-item :key="index"
                            v-if="item.type === 'selector'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-select v-model="data[item.prop]"
                           @change="item.changeFn?selectorChange($event,data[item.prop], item.changeFn): null"
                           :multiple="item.multiple"
                           v-if="!item.readOnly"
                           style="width:100%">
                  <el-option v-for="i in item.optList"
                             :label="i.text"
                             :key="i.value"
                             :value="i.value"></el-option>
                </el-select>

                <span v-if="item.readOnly">{{ data[item.prop] | filterOfSelector(item.optList,data)}}</span>
              </el-form-item>
              <!-- 三级地理 -->
              <!-- {
                type: "areas",    类型
                label: "归属地：", 标签显示
                prop: "province", 用来控制校验必填等
                value: "areas1",  初始显示值
                readOnly: true,   是否只读
                propArray: ["province", "city"],    id赋值字段数组
                propLabel: ["provinceLabel", "cityLabel"], label赋值字段数组
              }, -->
              <el-form-item :key="index"
                            v-if="item.type === 'areas'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <choice-areas v-if="!item.readOnly"
                              :showArea="item.showArea"
                              :data="data[item.value]"
                              :prop="item.propArray"
                              :placeholder="item.placeholder"
                              @returnData="changeArea($event, item.propLabel, item.value)"
                              :disabled="item.disabled"></choice-areas>
                <span v-if="item.readOnly">{{data[item.value][0] | areaFilter}}{{data[item.value][1] | areaFilter}}{{data[item.value][3] | areaFilter}}</span>
              </el-form-item>
              <!-- 图片上传 -->
              <el-form-item :key="index"
                            v-if="item.type === 'uploadImage'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-upload class="upload-demo"
                           :class="{disabled:item.isMax}"
                           v-if="!item.readOnly"
                           action="customer"
                           :limit="item.limit"
                           :accept="item.accept"
                           :on-change="imgChange"
                           :on-exceed="exceed"
                           :http-request="item.submitFiles"
                           :before-upload="item.beforeUpload"
                           :file-list="data[item.prop]"
                           list-type="picture-card">
                  <i class="el-icon-plus"></i>
                  <!-- 自定义图片显示 -->
                  <div slot="file"
                       slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail"
                         v-lazy="$parseUrl(file.url)"
                         alt="">
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview"
                            @click="pictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                      </span>
                    </span>
                    <span class="delete"
                          @click="item.remove(file)">
                      <i class="el-icon-error"></i>
                    </span>
                    <span class="cover top"
                          v-if="item.cover"
                          v-show="file.index === 0">封面</span>
                    <span class="cover btm"
                          v-if="item.cover"
                          v-show="file.index !== 0"
                          @click="item.setCover(file)">设为封面</span>
                  </div>
                  <!-- 下部tip -->
                  <div slot="tip">
                    <p class="img-tip"
                       v-if="Array.isArray(item.tipList)"
                       v-for="(subItem, index) in item.tipList"
                       :key="index">{{subItem}}</p>
                    <template v-if="typeof item.tipList === 'function'">
                      <p class="img-tip"
                         v-for="(subItem, index) in item.tipList(data[item.prop])"
                         :key="index">{{subItem}}</p>
                    </template>

                  </div>
                </el-upload>
                <el-image class="img-upload"
                          v-if="item.readOnly"
                          v-for="(it, index) in data[item.prop]"
                          :key="index"
                          :src="$parseUrl(it.url)"
                          :preview-src-list="data[item.prop].map((subItem) => {return $parseUrl(subItem.url)})">
                </el-image>
                <!-- <span v-if="item.readOnly">{{data[item.prop]}}</span> -->
              </el-form-item>
              <!-- 分类 选择 -->
              <el-form-item :key="index"
                            v-if="item.type === 'category'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-cascader ref="category"
                             v-if="!item.readOnly"
                             :options="categoryData"
                             v-model="data[item.prop]"
                             :show-all-levels="item.showAllLevels ? true : false"
                             @change="categoryChange($event,item)"
                             :props="setCategory(item.checkStrictly)"
                             :disabled="item.disabled"></el-cascader>

                <span v-if="item.readOnly">{{data[item.showValue] | categoryFilter}}</span>
              </el-form-item>

              <!-- 次级联选 -->
              <el-form-item :key="index"
                            v-if="item.type === 'cascader'  && !item.hidden"
                            :label="item.label"
                            :prop="item.prop"
                            :size="size"
                            :label-width="colItem.labelWidth">
                <el-cascader ref="cascader"
                             v-if="!item.readOnly"
                             :options="item.optList"
                             :placeholder="item.placeholder"
                             :props="item.props"
                             v-model="data[item.prop]"
                             :show-all-levels="item.showAllLevels ? true : false"
                             :disabled="item.disabled"></el-cascader>

                <span v-if="item.readOnly">{{data[item.prop] | filterOfCascader(item.optList,data)}}</span>
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
    <!-- 查看大图 -->
    <el-image ref="preview"
              class="hide-Img"
              :src="dialogImageUrl"
              :preview-src-list="[dialogImageUrl]"
              :z-index="100"></el-image>
  </el-form>
</template>

<script>
import ChoiceAreas from "@/components/form/ChoiceAreas";
import { mapGetters } from 'vuex';
let _this
export default {
  data() {
    _this = this
    return {
      // 暂存子列表数据
      childrenArr: [],
      // 下拉框 option对象
      option: {},
      loading: false,
      areas: [],
      dialogImageUrl: '',

    }
  },
  components: {
    ChoiceAreas
  },
  props: {
    labelPositon: {
      type: String,
      default: () => {
        return "left"
      }
    },
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
        return ''
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
  methods: {
    // 修改三级地理数据
    changeArea(data, propLabelArray, value) {
      this.data[value] = data.value;
      data.prop.map((item, index) => {
        this.data[item] = data.value[index] ? data.value[index] : null;
        if (Array.isArray(propLabelArray) && propLabelArray.length !== 0) {
          this.data[propLabelArray[index]] = data.label[index];
        }
      })
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
    // 外部提交验证 (回调方式)
    validate(callback) {
      this.$refs[this.refName].validate((valid) => {
        if (valid) {
          if (callback) callback(this.data);
        } else {
          if (callback) callback();
        }
      });
    },
    // 外部提交验证 (Promise方式)
    validatePromise() {
      return new Promise((resolve, reject) => {
        this.$refs[this.refName].validate((valid) => {
          if (valid) {
            resolve(this.data);
          } else {
            reject(valid);
          }
        });
      })

    },
    validateField(val) {
      this.$refs[this.refName].validateField(val)
    },
    // 清除校验结果
    clearValidate() {
      this.$refs[this.refName].clearValidate();
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
      } else {
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
    },
    radioChange(val, option, functionName) {
      this.$emit(functionName, val, option);
    },
    checkboxChange(val, option, functionName) {
      this.$emit(functionName, option);
    },
    selectorChange(val, option, functionName) {
      this.$emit(functionName, option);
    },
    // 超出限制个数
    exceed(file, fileList) {
      this.$message.warning('上传文件超出限制个数')
    },
    closeViewer() {
      this.dialogImageUrl = false;
    },
    pictureCardPreview(file) {
      this.dialogImageUrl = this.$parseUrl(file.url);
      this.$nextTick(() => {
        this.$refs.preview.clickHandler();
      })
    },
    // 将准备状态的图片清空，取消默认上传的图片显示，由自定义上传成功来回显图片
    imgChange: (file, fileList) => {
      if (file.status === 'ready') {
        fileList.splice(fileList.length - 1, 1);
      }
    },
    // 分类 -------------------------------------------------------------------------
    categoryChange(arr, config) {
      const node = this.$refs.category[0].getCheckedNodes();
      this.$emit('categoryChange', arr, node);
    },
    setCategory(checkStrictly) {
      return {
        value: "id",
        children: 'childrens',
        label: 'name',
        checkStrictly: checkStrictly
      }
    },
    // 计算分类所有的父级id
    parseCategoryId(id) {
      return this.$treeFn.findAllPId(_this.categoryData, id, {
        children: "childrens",
        label: "name",
        pId: "fid"
      })
    }
  },
  filters: {
    dateFilter: function (val, formatTxt) {
      return _this.$filters.date(val, formatTxt)
    },
    numberFilter: function (val, formatTxt) {
      if (formatTxt === '2,ture' && _this.$dataIsNull(val)) {
        return '议价'
      } else {
        return _this.$filters.number(val, formatTxt)
      }

    },
    stringFilter: function (val, formatArr) {
      return _this.$filters.string(val, formatArr)
    },
    areaFilter: function (val) {

      let result = null;
      const parseId = (arr, id) => {
        arr.map((item) => {
          if (item.id === id) {
            result = item.name;
            return item.name;
          }
          if (item.lower && item.lower.length !== 0) {
            parseId(item.lower, id)
          }
        })
      }
      if (val && _this.allAreaData) {
        parseId(_this.allAreaData, val);
        return result === null ? val : result;
      } else {
        return val
      }
    },
    selectorFilter: function (val, arr) {
      let newArr = []
      let newArrStr = null
      val.forEach(item => {
        if (arr.includes(item.value)) {
          newArr.push(item.label);
        };
      })
      newArrStr = newArr.toString()
      return newArrStr
    },
    categoryFilter: function (val) {
      const { label } = _this.parseCategoryId(val)
      return Array.isArray(label) ? label.join(' / ') : ''
    },
    // 因为单选的select 后台返回的是字符串，而多选的selctor返回的是数组，所以再写一个过滤器
    filterOfSelector: function (val, optionList, data) {
      if (!val) return; // 避免初始化时 还没有请求到数据带来的报错
      // 接口返回有的是直接是 不需要查找的值，有的是需要进行查找的值。根据是否中文进行判断
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let res = typeof val === "string" ? true : false;

      let newArr = [];
      if (res) {
        if (reg.test(val)) {
          return val
        } else {
          let res = optionList.filter(it => it.value === val)[0]
          return res && res.text
        }

      } else {
        optionList.forEach(item => {
          if (val.includes(item.value)) {
            newArr.push(item.text)
          }
        })
      }
      return newArr.toString()
    },
    filterOfCascader: function (val, optionList, data) {
      if (!val) return; // 避免初始化时 还没有请求到数据带来的报错
      // 接口返回有的是直接是 不需要查找的值，有的是需要进行查找的值。根据是否中文进行判断
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      let res = typeof val === "string" ? true : false;
      let newArr = [];
      let val1 = optionList.filter(it => it.value === val[0])
      if (val1.length > 0) {
        newArr.push(val1[0].label)
        let val2 = val1[0].children.filter(it => it.value === val[1])
        newArr.push(val2[0].label)
      }
      return newArr.toString()
    },

  },
  watch: {
    form: {
      immediate: true,
      handler: function (val) {
        if (Array.isArray(val)) this.getSelect(val);
      }
    }
  },
  computed: {
    ...mapGetters(['allAreaData', 'categoryData'])
  }
}
</script>
<style lang="stylus" scoped>
.el-autocomplete, .el-date-editor.el-input
  width 100%

// 显示列表下的样式 --------------------------------------------------
.show-List
  .el-form-item
    margin-bottom 12px

  >>>.el-form-item__label
    box-sizing content-box
    padding-right 0
    line-height 20px

  >>>.el-form-item__content
    line-height 20px

// 买家中心，账户管理，企业信息 字体为16px，margin-bottom要求25px
.buyer-company-info
  .el-form-item
    margin-bottom 15px

  >>>.el-form-item__label
    font-size 16px

  >>>.el-form-item__content
    font-size 16px
    width 407px
    color #141415

.font-orange
  color #FF8300
  font-weight bold

// 图片上传相关样式  ------------------------------------------------
>>>.el-upload-list__item, >>>.el-upload--picture-card
  width 104px
  height 104px
  border-radius 0

>>>.el-upload--picture-card
  margin-bottom 10px
  line-height 104px

>>>.el-upload-list__item
  overflow visible
  margin-right 20px
  border 0

  &>div
    width 100%
    height 100%
    line-height 104px

    img
      height auto
      max-height 100%

.img-tip
  line-height 24px
  color #969592

.img-upload
  width 104px
  margin 0 8px 8px 0
  height 104px

>>>.disabled .el-upload--picture-card
  display none

>>>.el-upload-list--picture-card
  .el-upload-list__item-preview
    font-size 20px

  .delete
    position absolute
    top -7px
    right -7px
    z-index 100
    display block
    width 14px
    height 14px
    font-size 16px
    color $font-color-gray
    cursor pointer

    i
      display block

  .cover
    position absolute
    display block
    padding 0 4px
    height 17px
    line-height 18px
    font-size 12px
    color $font-color
    $linear-gradient()

  .top
    top 1px
    left 0

  .btm
    bottom -1px
    right 0
    cursor pointer

.hide-Img
  >>>.el-image__inner, >>>.el-image__error
    display none
</style>
