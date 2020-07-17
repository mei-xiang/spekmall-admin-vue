/*
 * @Description:
 * @Author: jiaxin
 * @Date: 2019-05-20 16:12:11
 * @LastEditors: jiaxin
 * @LastEditTime: 2020-06-11 11:19:45
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
import store from './store' //vuex存储文件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'styles/index.styl'
import axios_ from './api/http' // axios封装
import Common from 'js/common' // 公共js
import contentmenu from 'v-contextmenu' //右键菜单组件
import 'v-contextmenu/dist/index.css' //右键菜单相关样式
import 'js/directives.js' // 引入自定义指令
import rules from 'js/rules.js' // 引入自定义验证
import myConst from 'js/const.js' // 常量设置
// import { getStore } from 'js/store'
import baseUrl from './api/env'

import './assets/font/font.css' // 引入字体
import './assets/iconfont/iconfont.css' // inonfont字体图标
import SliderVerificationCode from 'slider-verification-code';
import 'slider-verification-code/lib/slider-verification-code.css';

// 设置全局混合模式
import setLayoutHeight from "@/assets/js/mixins/setLayoutHeight"; // 设置布局的高度
import components from './components/components.js'; //全局组件注册

// const token = getStore({ name: 'access_token', type: 'string' })

Vue.prototype.axios = axios_; // 挂载到Vue实例上面
Vue.prototype.store = store; // 挂载到Vue实例上面
// Vue.prototype.BaseUrl = `${baseUrl.test.apiUrl}` // 登录测试----测试接口
Vue.prototype.BaseUrl = `${baseUrl[process.env.NODE_ENV].apiUrl}`
Vue.prototype.imgBaseUrl = `${baseUrl[process.env.NODE_ENV].apiUrl}/file/white/download?filePath=` // 图片拼接部分
// Vue.prototype.uploadImgUrl = `${baseUrl[process.env.NODE_ENV].apiUrl}/file/upload?token=${token}` // 图片上传地址
Vue.config.productionTip = false;
Vue.use(SliderVerificationCode);

//核心库扩展，把代理加入核心变量中，方便其他模块调用
window.core = window.core || {};
window.core.http = axios_;

window.setLayoutHeight = setLayoutHeight
window.setLayoutHeight = setLayoutHeight

Vue.use(Common).use(ElementUI).use(contentmenu).use(rules).use(myConst).use(components);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
