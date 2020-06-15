/*
 * @Description: 封装axios
 * @Author: xiabing
 * @Date: 2018-09-26 10:27:15
 * @LastEditors: jiaxin
 * @LastEditTime: 2020-06-11 11:33:58
 */

import Vue from 'vue'
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import router from '../router'
import { setStore, getStore, removeStore } from 'js/store'
import { showLoading, hideLoading } from '../assets/js/loading';
import apiUrl from './env';

// 富文本配置
const UEDITOR_CONFIG = { //常量
  toolbars: [[
    'fullscreen', 'source', '|', 'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
    'directionalityltr', 'directionalityrtl', 'indent', '|',
    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
    'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
    'print', 'preview', 'searchreplace', 'drafts', 'help'
  ]],
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 350,
  // 初始容器宽度
  initialFrameWidth: '99%',
  // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
  // serverUrl: 'http://35.201.165.105:8000/controller.php',
  // UEditor 资源文件存放的根目录，如果你使用的是 vue-cli 3.x，设置为'/UEditor/'（参考下方的常见问题2）
  UEDITOR_HOME_URL: '/static/UEditor/',
  serverUrl: ""
}

const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

let [oldServer, newServer] = [null, null];
// 环境的切换(暂时改用本地代理跨域,以下代码暂时不启用)
const env = process.env.NODE_ENV

UEDITOR_CONFIG.serverUrl = `${apiUrl[env].apiUrl}/ueditor/config`;
setStore({
  name: "serviceOption",
  content: {
    isDebug: true,
    fileUrl: `${apiUrl[env].apiUrl}/file/white/download?filePath=`,
    socketUrl: apiUrl[env].socketUrl
  }
})

if (env !== 'development') {
  oldServer = "/api";
  newServer = "";
  axios.defaults.baseURL = apiUrl[env].apiUrl;
}

// 设置富文本配置项
setStore({
  name: "UEDITOR_CONFIG",
  content: UEDITOR_CONFIG
})
// 请求超时时间
// axios.defaults.timeout = 10000;

// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let windowLoadingcontrol = null;
let windowAjaxTime = {
  start: null,
  end: null
};
// 请求拦截器
axios.interceptors.request.use(config => {
  // 处理短时间内重复的请求
  let requestData = getRequestIdentify(config, true);
  removePending(requestData, true);
  config.cancelToken = new CancelToken((c) => {
    pending[requestData] = c
  });
  // 按规则重写请求路径
  if (oldServer !== null && newServer !== null) {
    if (Array.isArray(oldServer)) {
      oldServer.forEach((item, index) => {
        config.url = config.url.replace(item, newServer[index]);
      })
    } else {
      config.url = config.url.replace(oldServer, newServer);
    }
  };
  showLoading();
  // 给每次请求写入开始时间 方便后面计算结束时间
  windowAjaxTime.start = new Date().getTime();
  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
  const token = getStore({ name: 'access_token', type: "string" });
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
}, error => {
  hideLoading();
  return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(response => {
  clearTimeout(windowLoadingcontrol);
  windowLoadingcontrol = setTimeout(() => {
    hideLoading();
  }, 300);
  const resData = response.data;
  // console.log('响应拦截器', response);
  if (response.headers['content-type'].indexOf('application/octet-stream') !== -1) {
    return Promise.resolve(response);
  } else if (Number(resData.code) === 200) {
    windowAjaxTime.end = new Date().getTime();
    response.data.resTime = windowAjaxTime.end - windowAjaxTime.start;
    return Promise.resolve(response);
    // blob不拦截
		/* if (response.data.constructor === Blob) {
			return Promise.resolve(response);
		} */
  } else {
    Vue.prototype.$message.error(resData.msg)
    return Promise.reject(response);
  }
}, (error) => {
  hideLoading();
  // console.log(error.response);
  // 服务器状态码不是200的情况
  if (error.response.status) {
    switch (error.response.status) {
      // 登录过期则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        removeStore({ name: 'access_token' });
        removeStore({ name: 'userInfo' });
        this.$socket.close();
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        location.reload();
        break;

      default:
        break;
    }
  }
  Vue.prototype.$message.error(error.response.data.message || "服务出错了，请稍后再试")
  return Promise.reject(error)
})

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params) {
  // 以下是对含有数组的参数的处理方式，根据目前要求合理选择
  // QS.stringify({ids: [1, 2, 3]}, { indices: false })
  //形式： ids=1&ids=2&ids=3
  // QS.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘indices‘})
  //形式： ids[0]=1&ids1]=2&ids[2]=3
  // QS.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘brackets‘})
  //形式：ids[]=1&ids[]=2&ids[]=3
  // QS.stringify({ids: [1, 2, 3]}, {arrayFormat: ‘repeat‘})
  //形式： ids=1&ids=2&ids=3
  const dealObjectValue = (obj) => {
    let param = {};
    if (obj === null || obj === undefined || obj === "") return param;
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        const arr = obj[key].find((item) => {
          if (item !== null && item !== undefined && item !== "") return item
        })
        if (arr) {
          param[key] = obj[key];
        }
      } else if (obj[key] instanceof Object) {
        param[key] = dealObjectValue(obj[key]);
      } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        param[key] = obj[key];
      }
    }
    return param;
  };
  const newParams = dealObjectValue(params);
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: newParams,
      paramsSerializer: function (params) {
        return QS.stringify(params, { arrayFormat: 'indices' })
      }
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object/String} config [Object:post请求配置,一般情况下用于设置请求头headers,不传是按默认配置;String:"json"]
 */
function post(url, params, config) {
  return new Promise((resolve, reject) => {
    let parameters = params;
    if (!config) {
      parameters = url.indexOf('/core/') >= 0 ? params : QS.stringify(params);
    } else if (config === "json") {
      config = {
        headers: { 'Content-Type': 'application/json;charset=utf-8' }
      }
    }
    axios.post(url, parameters, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * put方法， 对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object/String} config [Object:post请求配置,一般情况下用于设置请求头headers,不传是按默认配置;String:"json"]
 */
function put(url, params, config) {
  return new Promise((resolve, reject) => {
    let parameters = params;
    if (!config) {
      parameters = QS.stringify(params);
    }
    axios.put(url, parameters)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * del方法， 对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function del(url, params) {
  return new Promise((resolve, reject) => {
    // 此类型参数传递为url传递方式
    axios.delete(url, { params: params })
      // 此类型参数传递为对象传递
      // axios.delete(url, { data: params })
      // axios.delete(url, QS.stringify({ data: params }))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * upload方法   文件上传
 * @param {Array} files [文件对象数组]
 * @param {String} url [接口url]  默认值 '/api/file-service/file/upload'
 * @param {String} paramName [文件参数命名] 默认值 'files'
 * @param {Object} otherParam [其余参数]
 */
function upload(files, url, paramName, otherParam) {
  url = url || '/api/file/upload';
  paramName = paramName || 'file';
  let param = new FormData(); //创建form对象
  if (Object.prototype.isPrototypeOf(otherParam) && Object.keys(otherParam).length !== 0) {
    for (const key in otherParam) {
      if (otherParam.hasOwnProperty(key)) {
        const element = otherParam[key];
        param.append(key, element);
      }
    }
  }
  files.map((item) => {
    param.append(paramName, item);//通过append向form对象添加数据
  })
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  };
  return new Promise((resolve, reject) => {
    axios.post(url, param, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * download方法
 * @param {String} type [请求的方式]
 * @param {Object} params [请求时携带的参数]
 * @param {Boolean} isDownLoad [是否下载] 默认值 true
 */
function download(params, isDownLoad = true) {
  let config = {
    params: params,
    headers: {
      'content-disposition': "attachment;filename*=UTF-8",
      'Content-Type': 'application/x-download;charset=utf-8'
    },
    responseType: 'blob'
  };
  return new Promise((resolve, reject) => {
    axios.get("/api/file/download", config)
      .then(res => {
        if (!res) return;
        const disposition = res.headers["content-disposition"];
        const fileNameFromHeader = (disposition) => {
          var result = null;
          if (disposition && /filename=.*/ig.test(disposition)) {
            result = disposition.match(/filename=.*/ig);
            return decodeURI(escape(result[0].split('=')[1]));
          }
          return null;
        }
        const fileName = fileNameFromHeader(disposition);
        let url = window.URL.createObjectURL(res.data);
        resolve([url, fileName]);
        if (!isDownLoad) return;
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export default {
  get,
  post,
  put,
  del,
  upload,
  download,
  all: axios.all,
  spread: axios.spread
}
