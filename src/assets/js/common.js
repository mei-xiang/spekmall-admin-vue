/*
 * @Description:
 * @Author: jiaxin
 * @Date: 2019-05-20 16:12:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-10 18:07:40
 */
import Vue from 'vue'
import { getStore } from 'js/store'
import Map from '@/assets/js/data/map';
let vm = new Vue({});
const printJS = require('print-js');

export default {
  install (Vue) {
    // 确认框 函数
    Vue.prototype.$delBtn = (delAjax, text) => {
      const str = text || '此操作将删除该数据, 是否继续?';
      vm.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      }).then(() => {
        delAjax(); // 调用删除接口
      })
    }
		/**
		 * @description:  对上面确认框 函数的深化，直接用于数据删除、审核、反审等需要确认后发送请求的场景
		 * @param {Array} data [表格勾选的数据数组]
		 * @param {String} axiosFn [axios自定义的几种方法名get、post、put、del等]
		 * @param {String} url [请求的路径，其中参数id占位符需要大括号包裹如{id}]
		 * @param {String} txt [提示的文字]
		 * @return:
		 */
    Vue.prototype.$confirmAxios = function (data, axiosFn, url, txt) {
      vm.$delBtn(() => {
        const ids = this.$array.returnArrayByKey(data, "id").join(",");
        url = url.replace("{id}", ids);
        vm.axios[axiosFn](url)
          .then((res) => {
            vm.$message.success(res.message);
            this.getList();
          })
      }, txt)
    }
		/**
		 * @description: 根据选择数据验证btn是否可以使用
		 * @param {Array/ Object} data [用于验证按钮可用与否的数据]
		 * @param {String} text [不通过验证的提示文字]
		 * @param {Function} fn [验证函数，返回true、false]
		 * @return: true 满足条件  false 不满足条件
		 */
    Vue.prototype.$btnValidator = (data, text, fn) => {
      let warnObj = { text: text };
      let res = false;
      if (Array.isArray(data)) {
        res = data.some((item) => {
          if (fn(item, warnObj)) return true
        })
      } else if (typeof data === "object") {
        res = fn(data, warnObj)
      }
      if (res) {
        vm.$message({
          type: 'warning',
          message: warnObj.text
        });
      }
      return res;
    }

    // 解决传参 [key][0][val]  =>  key[0].val
    // 调用示例: $dataTransform(this.addOrEditData, 'buttons');
    Vue.prototype.$dataTransform = (object, property) => {
      if (Array.isArray(object[property])) {
        object[property].forEach((val, i) => {
          for (var j in val) {
            object[property + "[" + i + "]." + j] = val[j];
          }
        });
        delete object[property];
      }
      if (object[property] instanceof Object) {
        for (const key in object[property]) {
          if (object[property].hasOwnProperty(key)) {
            const element = object[property][key];
            object[property + "." + key] = element;
          }
        }
        delete object[property];
      }
    }
		/**
  		* @description: 判断数据不存在 或 为空值
  		* @param {所有数据类型} data [需要验证的数据]
  		* @return: [存在非空false,不存在或是空值true]
  		*/
    Vue.prototype.$dataIsNull = (data) => {
      if (typeof data === "undefined") {
        return true;
      } else if (data instanceof Array) {
        if (data.length === 0) return true;
      } else if (data instanceof Object) {
        if (JSON.stringify(data) === '{}') return true;
      } else if (data === 'null' || data === null || data === 'undefined' || data === '') {
        return true;
      } else {
        return false;
      }
    }
		/**
  		* @description: 用于后台获取的数据应用于页面数据，避免直接赋值带来的属性缺失
  		* @param {Object} pageData [页面初始化的数据，与接口相匹配]
  		* @param {Object} getData [后台获取的数据，由于未初始化的数据后台不做返回，可能缺失重要属性]
  		* @return: [补全必要字段的后台数据]
  		*/
    Vue.prototype.$mergeObject = (pageData, getData) => {
      for (const item in pageData) {
        if (!getData.hasOwnProperty(item)) {
          getData[item] = pageData[item];
        }
      }
      return getData
    }
    // 日期时间相关方法
    Vue.prototype.$date = {
      // 时间格式化
      format: (date, fmt = "yyyy-MM-dd hh:mm:ss") => {
        if (!date || date == null) {
          return date;
        }
        date = new Date(date)
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };
        let padLeftZero = (str) => {
          return ('00' + str).substr(str.length);
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
          }
        }
        return fmt;
      },
      // 验证开始时间 结束时间 的关系
      validator: (start, end, symbol = ">=") => {
        if (start && end) {
          // eslint-disable-next-line no-eval
          if (eval(`${new Date(start).getTime()}${symbol}${new Date(end).getTime()}`)) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
			/**
    		* @description: 计算两天之间相差多少年月日
    		* @param {String}  sDate1 [开始日期yyyy-MM-dd]
    		* @param {String}  sDate2 [结束日期yyyy-MM-dd]
    		* @return: { y: y, m: m, d: d }
    		*/
      dateDiff: (sDate1, sDate2) => {
        var fixDate = function (sDate) {
          var aD = sDate.split('-');
          for (var i = 0; i < aD.length; i++) {
            aD[i] = fixZero(parseInt(aD[i]));
          }
          return aD.join('-');
        };
        var fixZero = function (n) {
          return n < 10 ? '0' + n : n;
        };
        var fixInt = function (a) {
          for (var i = 0; i < a.length; i++) {
            a[i] = parseInt(a[i]);
          }
          return a;
        };
        var getMonthDays = function (y, m) {
          var aMonthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          // eslint-disable-next-line eqeqeq
          if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
            aMonthDays[2] = 29;
          }
          return aMonthDays[m];
        };
        var y = 0;
        var m = 0;
        var d = 0;
        var sTmp;
        var aTmp;
        sDate1 = fixDate(sDate1);
        sDate2 = fixDate(sDate2);
        if (sDate1 > sDate2) {
          sTmp = sDate2;
          sDate2 = sDate1;
          sDate1 = sTmp;
        }
        var aDate1 = sDate1.split('-');
        aDate1 = fixInt(aDate1);
        var aDate2 = sDate2.split('-');
        aDate2 = fixInt(aDate2);
        //计算相差的年份
				/*aTmp = [aDate1[0]+1,fixZero(aDate1[1]),fixZero(aDate1[2])];
				while(aTmp.join('-') <= sDate2){
					y++;
					aTmp[0]++;
				}*/
        y = aDate2[0] - aDate1[0];
        if (sDate2.replace(aDate2[0], '') < sDate1.replace(aDate1[0], '')) {
          y = y - 1;
        }
        //计算月份
        aTmp = [aDate1[0] + y, aDate1[1], fixZero(aDate1[2])];
        while (true) {
          // eslint-disable-next-line eqeqeq
          if (aTmp[1] == 12) {
            aTmp[0]++;
            aTmp[1] = 1;
          } else {
            aTmp[1]++;
          }
          if (([aTmp[0], fixZero(aTmp[1]), aTmp[2]]).join('-') <= sDate2) {
            m++;
          } else {
            break;
          }
        }
        //计算天数
        aTmp = [aDate1[0] + y, aDate1[1] + m, aDate1[2]];
        if (aTmp[1] > 12) {
          aTmp[0]++;
          aTmp[1] -= 12;
        }
        while (true) {
          // eslint-disable-next-line eqeqeq
          if (aTmp[2] == getMonthDays(aTmp[0], aTmp[1])) {
            aTmp[1]++;
            aTmp[2] = 1;
          } else {
            aTmp[2]++;
          }
          sTmp = ([aTmp[0], fixZero(aTmp[1]), fixZero(aTmp[2])]).join('-');
          if (sTmp <= sDate2) {
            d++;
          } else {
            break;
          }
        }
        return { y: y, m: m, d: d };
      }
    }
    // 数字相关方法
    Vue.prototype.$number = {
      // 时间格式化
      format: (number, decimals, isThousandsSep) => {
				/*
				 * 参数说明：
				 * number：要格式化的数字
				 * decimals：保留几位小数
				 * isThousandsSep：是否加入千分位符号
				 * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        // eslint-disable-next-line one-var
        let n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
          sep = ',',
          dec = '.',
          s = '',
          toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
          };
        // console.log(toFixedFix(n, prec),Math.round(n));
        s = toFixedFix(n, prec).split('.');
        var re = /(-?\d+)(\d{3})/;
        // 判断是否加千位分隔符
        if (isThousandsSep) {
          while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
          }
        }
        if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
      },
      // 纯数字字符串转为数字 反之 不处理
      parseNumber: (val) => {
        return isNaN(Number(val)) ? val : Number(val)
      }
    }
    // 文本方法操作
    Vue.prototype.$text = {
      // 防止脚本注入 替换script标签
      stripScript: (str) => {
        return str.replace(/<script.*?>.*?<\/script>/ig, '');
      },
      // 取消文本两端的空格和换行符
      trim: (str) => {
        if (typeof str === "string") {
          return str.replace(/(^\s*)|(\s*$)/g, "").replace(/(^\r\n*)|(\r\n*$)/g, "");
        } else {
          return str
        }
      }
    }
    // 数组方法
    Vue.prototype.$array = {
			/**
			 * @description: 获取数组中每个对象某个key的新集合
			 * @param {type}
			 * @return:
			 */
      returnArrayByKey: (originArr, key) => {
        let arr = [];
        if (Array.isArray(originArr)) {
          originArr.forEach((item) => {
            if (item[key]) arr.push(item[key]);
          });
        }
        return arr;
      }
    }
    // 对象数组深拷贝
    Vue.prototype.$clone = (obj) => {
      let clone = (obj) => {
        if (obj === null) return obj;
        if (typeof obj !== 'object') { return obj; }
        let cloneObj = {};
        switch (obj.constructor) {
          case Array:
            cloneObj = [];
            if (obj.length !== 0) {
              for (let i = 0, len = obj.length; i < len; i++) {
                cloneObj.push(clone(obj[i]));
              }
            }
            break;
          case Object:
            for (var property in obj) {
              cloneObj[property] = typeof obj[property] === 'object' ? clone(obj[property]) : obj[property];
            }
            break;
          case Map:
            cloneObj = new Map();
            obj.forEach((value, key) => {
              cloneObj.set(key, typeof value === 'object' ? clone(value) : value);
            });
            break;
          case Set:
            cloneObj = new Set();
            obj.forEach(value => {
              cloneObj.add(typeof value === 'object' ? clone(value) : value);
            });
            break;
        }
        return cloneObj;
      }
      return clone(obj)
    }
    // 获得树形数据ID数组
    Vue.prototype.$treeFn = {
			/**
			* @description:  线性数据转化为树
			* @param {Array} originArr [原始数组]
			* @param {Number} originId [初始化的顶级节点id]
			* @param {Object} config [数据配置项]
			* @return:
			*/
      toTree: (originArr, originId, config) => {
        const configName = config.name || "name";
        const configPId = config.pId || "pId";
        const configPName = config.pName || "pName";
        const configChildren = config.children || "children";
        const configOriginNode = config.originNode || "根节点";
        let obj = {};
        originArr.forEach((item, index) => {
          obj[item.id] = item
        })
        // let newObj = JSON.parse(JSON.stringify(obj));
        const toTreeFn = (arr, id) => {
          let tree = [];
          let temp = null;
          originArr.forEach((item, index) => {
            item[configPName] = obj[item[configPId]] ? obj[item[configPId]][configName] : configOriginNode;
            if (item[configPId] === id) {
              temp = toTreeFn(arr, item.id);
              if (temp.length > 0) {
                item[configChildren] = temp;
              }
              tree.push(item);
              delete originArr[index];
            }
          })
          return tree;
        }
        return toTreeFn(originArr, originId)
      },
			/**
			* @description:  获取树中  所有节点id
			* @param {Array} originArr [原始数组]
			* @param {Object} config [数据配置项]
			* @return:
			*/
      findAllId: (originArr, config) => {
        config = config || "children";
        let arr = [];
        const getId = (data1, arr1) => {
          data1.map((item) => {
            arr1.push(item.id);
            if (item[config]) {
              getId(item[config], arr1)
            }
          })
        }
        getId(originArr, arr);
        return arr
      },
			/**
			* @description:  获取当前节点及其所有父节点 id
			* @param {Array} originArr [原始数组]
			* @param {Number,String} findId [初始化的顶级节点id]
			* @param {Object} config [数据配置项]
			* @return:
			*/
      findAllPId: (originArr, findId, config) => {
        if (!findId) return [];
        if (!config) {
          config = {
            children: "children",
            pId: "pId"
          }
        }
        let { children, pId } = config;
        let result = [];
        const findNode = (arr, id) => {
          if (!Array.isArray(arr)) return;
          arr.some((item) => {
            if (item.id === id) {
              result.unshift(item.id);
              if (item[pId] !== 0) {
                findNode(originArr, item[pId]);
              };
            }
            if (item[children] && item[children].length !== 0) {
              findNode(item[children], id);
            }
          })
        }
        findNode(originArr, findId);
        // console.log("查找多叉树某节点所有父级id", result);
        return result;
      },
			/**
			* @description:  通过节点id找到节点数据
			* @param {Array} originArr [原始数组]
			* @param {Number,String} findId [初始化的顶级节点id]
			* @param {Object} config [数据配置项]
			* @return:
			*/
      findNodeById: (originArr, findId, config) => {
        if (!findId) return [];
        if (!config) {
          config = {
            children: "children"
          }
        }
        let { children } = config;
        let result = {};
        const findNode = (arr, id) => {
          if (!Array.isArray(arr)) return;
          arr.find((item) => {
            if (item.id === id) {
              result = item;
              return true;
            }
            if (item[children] && item[children].length !== 0) {
              findNode(item[children], id);
            }
          })
        }
        findNode(originArr, findId);
        // console.log("查找多叉树某节点所有父级id", result);
        return result;
      }
    }

    // 阿拉伯数字转中文大写
    Vue.prototype.$capital = (n) => {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) { return "数据非法"; }
      // eslint-disable-next-line one-var
      var unit = "千百拾亿千百拾万千百拾元角分",
        str = "";
      n += "00";
      var p = n.indexOf('.');
      // eslint-disable-next-line curly
      if (p >= 0)
        n = n.substring(0, p) + n.substr(p + 1, 2);
      unit = unit.substr(unit.length - n.length);
      // eslint-disable-next-line curly
      for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
      return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }

    // 下拉框相关
    Vue.prototype.$select = {
			/**
			 * @description: 根据codes获取相关数据
			 * @param arr {array} code组成的数组
			 * @return: option  {object} 数据结构如下
			 * {
			 * 		code：[
			 * 			{value: "0", text: "银行列表", isDefault: true, orderNo: 1}
			 *			{value: "1", text: "工商银行", isDefault: true, orderNo: 2}
			 *		]
			 * }
			 */
      getByCodes: (arr) => {
        if (!Array.isArray(arr)) return;
        const codes = arr.join(",");
        let option = {};
        return new Promise((resolve, reject) => {
          window.core.http.get(`/api/common-service/select/${codes}/options`).then((res) => {
            // eslint-disable-next-line eqeqeq
            if (res.statusCode == 200) {
              // 组合option数据
              res.data.map((item) => {
                option[item.code] = item.options.map((item) => {
                  // 判断是否为纯数字类型的字符串 是 将id转化为number
                  // 保留value为初始值 类型string
                  // 使用时根据具体情况选择 id或者 value
                  if (/^[0-9]+$/.test(item.value)) {
                    item.id = Number(item.value);
                  } else {
                    item.id = item.value;
                  }
                  item.label = item.text;
                  return item;
                })
              })
              resolve(option);
            }
          });
        })
      }
    }

    // 过滤函数
    Vue.prototype.$filters = {
			/**
			 * @description: 过滤字符串
			 * @param val {string}  value
			 * @param formatArr {Array} 格式化数组   [{value:1 , label: "A"}]
			 * @return: 过滤后的值
			 */
      string: function (val, formatArr) {
        // if (vm.$dataIsNull(val)) return val;
        let newVal = null;
        if (Array.isArray(formatArr)) {
          if (typeof val === "string") {
            newVal = val.split(",");
          } else if (Array.isArray(val)) {
            newVal = val
          } else {
            newVal = [val]
          }
          let result = [];
          newVal.forEach((valItem) => {
            let obj = formatArr.find((item) => {
              /* eslint-disable eqeqeq */
              if (item.id == valItem) {
                return true
              }
            })
            if (!obj) return val;
            if (obj.label) {
              result.push(obj.label);
            } else if (obj.name) {
              result.push(obj.name)
            } else if (obj.title) {
              result.push(obj.title)
            } else if (obj.text) {
              result.push(obj.text)
            } else {
              result.push(valItem)
            }
          })
          return result.join(",")
        }
        return val
      },
			/**
			 * @description: 过滤时间
			 * @param val {string}  value
			 * @param formatTxt {string} 格式化类型
			 * @return: 过滤后的值
			 */
      date: function (val, formatTxt) {
        if (val === undefined || val === null || val === "") return val;
        if (typeof formatTxt !== "string" || formatTxt === "") {
          formatTxt = "yyyy-MM-dd hh:mm:ss"
        }
        return Vue.prototype.$date.format(val, formatTxt)
      },
			/**
			 * @description: 过滤数字
			 * @param val {string}  value
			 * @param formatTxt {string} 格式化类型 number,Boolean  number表示保留几位小数 Boolean表示是否显示千分位分隔符
			 * @return: 过滤后的值
			 */
      number: function (val, formatTxt) {
        if (val === undefined || val === null || val === "") return val;
        if (typeof formatTxt === "string" && formatTxt !== "") {
          let [n, isTS] = formatTxt.split(",");
          if (isTS === "true") {
            isTS = true;
          } else {
            isTS = false;
          }
          return Vue.prototype.$number.format(val, n, isTS)
        }
        return val;
      },
			/**
			 * @description: 过滤地址
			 * @param val {string}  value
			 * @return: 过滤后的值
			 */
      area: function (val) {
        const thisId = Number(val);
        let result = null;
        const parseId = (arr, id) => {
          arr.map((item) => {
            if (item.value === id) {
              result = item.label;
              return item.label;
            }
            if (item.children && item.children.length !== 0) {
              parseId(item.children, id)
            }
          })
        }
        if (isNaN(thisId)) {
          return val
        } else {
          parseId(Map, thisId);
          return result === null ? val : result;
        }
      }
    }

    // 打印
    Vue.prototype.$print = {
			/**
			 * @description: 打印html
			 * @param ElementId {string} 元素Id
			 * @param header {string}  打印文件标题名称
			 * @return: 无
			 */
      html: (ElementId, header) => {
        printJS({
          printable: ElementId,
          type: 'html',
          header: header,
          headerStyle: 'font-weight：400; text-align:center',
          maxWidth: 1920,
          css: '/static/css/print.css',
          scanStyles: false
        })
      },
			/**
			 * @description: 打印table
			 * @param printData {Array}   打印的数据
			 * @param theaderData {Array}  表格thead数据
			 * @param header {string}  打印文件标题名称
			 * @return: 无
			 */
      table: (printData, theaderData, header) => {
        let data = Vue.prototype.$print.parseData(printData, theaderData);
        printJS({
          printable: data.body,
          properties: data.header,
          type: 'json',
          header: header,
          headerStyle: 'font-weight：400; text-align:center',
          maxWidth: 1920,
          css: '/static/css/print.css',
          scanStyles: false
        })
      },
			/**
			 * @description: 解析表格数据
			 * @param tbodyData {Array}   表格tbody数据
			 * @param theaderData {Array}  表格thead数据
			 * @return: result
			 */
      parseData: (tbodyData, theaderData) => {
        let result = {
          header: [],
          body: []
        };
        result.body = Vue.prototype.$clone(tbodyData);
        const parseData = (key, type, format) => {
          result.body.map((item) => {
            if (typeof item[key] === "undefined") item[key] = "";
            if (item[key] === true) item[key] = "√";
            if (item[key] === false) item[key] = "";
            if (type) item[key] = Vue.prototype.$filters[type](item[key], format);
            return item;
          })
        }
        theaderData.forEach(item => {
          result.header.push({
            field: item.prop,
            displayName: item.label
          })
          switch (item.type) {
            case 0: //文字
            case 12: //文字
              parseData(item.prop, "string", item.format);
              break;
            case 8: //日期
              parseData(item.prop, "date", item.format);
              break;
            case 9: //数字
              parseData(item.prop, "number", item.format);
              break;
            case 11: //地区
              parseData(item.prop, "area", item.format);
              break;
            default:
              parseData(item.prop);
              break;
          }
        })
        return result
      },
			/**
			 * @description: 打印pdf base64格式
			 * @param tbodyData {Array}   表格tbody数据
			 * @param theaderData {Array}  表格thead数据
			 * @return: result
			 */
      pdf: (base64string) => {
        printJS({ printable: base64string, type: 'pdf' })
      }
    }

    // 文件服务相关操作
    Vue.prototype.$file = {
			/**
			 * @description: 文件验证器
			 * @param file {string} 文件对象（element ui上传工具验证方法传入对象）
			 * @param typeArr {array} 文件类型组成的数组 ["jpg", "png"], 不传参表示任意类型文件
			 * @param size {number} 单位Mb , 不传参表示任意大小文件
			 * @return: 无
			 */
      validator: (file, typeArr, size) => {
        const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
        let [extension, isLt] = [true, true];
        if (typeArr) {
          extension = typeArr.join(",").indexOf(testmsg) !== -1;
          if (!extension) {
            Vue.prototype.$message({
              message: `上传文件只能是 ${typeArr.join("/")} 格式!`,
              type: 'warning'
            });
          }
        }
        if (size) {
          isLt = file.size / 1024 / 1024 < size;
          if (!isLt) {
            Vue.prototype.$message({
              message: `上传文件大小不能超过 ${size} Mb!`,
              type: 'warning'
            });
          }
        }
        return extension && isLt
      }
    }

		/**
		 * @description: 处理分页获取数据 时间 总数 页面的方法
		 * @param {Object} res [请求列表数据返回的数据对象]
		 * @return:
		 */
    Vue.prototype.$handlerList = function (res) {
      this.time = res.resTime;
      this.total = res.data.total;
      this.currentPage = res.data.current;
    }
		/**
		 * @description: 搜索列表的统一处理方式
		 * @return:
		 */
    Vue.prototype.$search = function () {
      this.currentPage = 1;
      this.searchParam = this.$clone(this.searchData);
      this.getList();
    }
		/**
		 * @description: 重置搜索列表的统一处理方式
		 * @return:
		 */
    Vue.prototype.$resetSearch = function () {
      this.currentPage = 1;
      this.searchData = this.$options.data.call(this).searchData;
      this.searchParam = {};
      this.getList();
    }

		/**
		 * @description: 是否有权限权限
		 * @param {String} code [权限码]
		 * @return:
		 */
    Vue.prototype.$isPermission = function (code) {
      const permissions = getStore({ name: "userInfo" }).permissions;
      return permissions.indexOf(code) !== -1
    }
		/**
		 * @description:  通过 prop 在 MainForm 组件配置数据中 找到相应的对象
		 * @param {String} prop [属性]
		 * @param {Array} configArr [mainform配置数组]
		 * @return:
		 */
    Vue.prototype.$findConfigByProp = function (prop, configArr) {
      let res = null;
      configArr.find((item1) => {
        item1.find((item2) => {
          res = item2.list.find((item3) => {
            if (item3.prop === prop) return true
          })
          if (res instanceof Object) return true
        })
        if (res instanceof Object) return true
      })
      return res
    }
		/**
		 * @description:  获取图片url
		 * @param {String} path [图片路径]
		 * @return:
		 */
    Vue.prototype.$imageSrc = function (path) {
      if (typeof path === "string" && path !== "") {
        const fileUrl = getStore({ name: "serviceOption" }).fileUrl;
        return fileUrl + path
      } else {
        return ""
      }
    }
    /**
		 * @description:  标准时间转成时间格式数据 2014-04-23 18:55:49
		 * @param {String} timeStr [标准时间]
		 * @return: 2014-04-23 18:55:49
		 */
    Vue.prototype.$timeDate = function (timeStr) {
      const date = new Date(timeStr);
      const Y = date.getFullYear();
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    }
    /**
		 * @description:  标准时间转成时间格式数据 2014-04-23 18:55:49
		 * @param {String} timeStr [标准时间]
		 * @return: 2014-04-23 18:55:49
		 */
    Vue.prototype.$token = function (timeStr) {
      return getStore({ name: "access_token", type: "string" });
    }
    /**
		 * @description:  获取地址栏参数
		 * @param {String} name [字段名称]
		 * @return:
		 */
    Vue.prototype.$getQueryString = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
    /**
		 * @description:  根据字符串解析成数组
		 * @param {String} picStr [路径字符串]
		 * @return: imgBaseUrl + /home/file/upload/20200620/wgmkkp73uyxvodo7ddf1icon_top_head_user.png
		 */
    Vue.prototype.$getArrayByStr = function (picStr) {
      if (!picStr) return []
      return picStr.split(",");
    }
    /**
		 * @description:  获取截取后的制定字符后面字符
		 * @param {String} picStr [路径字符串]
		 * @return: 
		 */
    Vue.prototype.$getPartStr = function (complete, part) {
      var str = complete;
      str = str.match(eval('/' + part + '(\S*)/'))[1];
      return str
    }
  }
}
