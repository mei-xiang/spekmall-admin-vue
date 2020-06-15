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
// 设置全局混合模式
import setLayoutHeight from "@/assets/js/mixins/setLayoutHeight"; // 设置布局的高度
import components from './components/components.js'; //全局组件注册

Vue.prototype.axios = axios_; // 挂载到Vue实例上面
Vue.config.productionTip = false;

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
