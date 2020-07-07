/*
 * @Description: 路由设置
 * @Author: jiaxin
 * @Date: 2019-05-20 16:12:11
 * @LastEditors: jiaxin
 * @LastEditTime: 2020-06-11 11:22:11
 */
import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from 'js/store'

// vue路由懒加载  异步加载

const login = resolve => require(['@/pages/login/Login'], resolve)

const error = resolve => require(['@/pages/error/Error'], resolve)

const userSetting = resolve => require(['@/pages/system/UserSetting'], resolve)

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/error'
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        showNav: false // 不显示nav
      }
    },
    {
      path: '/error',
      name: 'error',
      component: error,
      meta: {
        title: '404'
      }
    },
    {
      path: '/userSetting',
      name: 'userSetting',
      component: userSetting,
      meta: {
        title: '用户设置'
      }
    },
    {
      path: '/supperApplyInfo',
      name: 'supperApplyInfo',
      component: resolve => require(['@/pages/supplier/SupperApplyInfo'], resolve),
      meta: {
        title: '供应商注册信息'
      }
    },
    {
      path: '/supplierMemberInfo',
      name: 'supplierMemberInfo',
      component: resolve => require(['@/pages/supplier/SupplierMemberInfo'], resolve),
      meta: {
        title: '供应商会员信息'
      }
    },
    {
      path: '/supplierShopInfo',
      name: 'supplierShopInfo',
      component: resolve => require(['@/pages/supplier/SupplierShopInfo'], resolve),
      meta: {
        title: '供应商店铺信息'
      }
    },
    {
      path: '/productListInfo',
      name: 'productListInfo',
      component: resolve => require(['@/pages/product/ProductListInfo'], resolve),
      meta: {
        title: '商品查看'
      }
    },
    {
      path: '/selfShopInfo',
      name: 'selfShopInfo',
      component: resolve => require(['@/pages/self/SelfShopInfo'], resolve),
      meta: {
        title: '自营店铺信息'
      }
    },
    {
      path: '/selfProductInfo',
      name: 'selfProductInfo',
      component: resolve => require(['@/pages/self/SelfProductInfo'], resolve),
      meta: {
        title: '自营商品信息'
      }
    },
    // 自营订单详情与电商订单详情
    {
      path: '/orderInfo',
      name: 'orderInfo',
      component: resolve => require(['@/pages/self/OrderInfo'], resolve),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/orderRefund',
      name: 'orderRefund',
      component: resolve => require(['@/pages/self/OrderRefund'], resolve),
      meta: {
        title: '订单详情-退款操作'
      }
    },
    {
      path: '/orderBuyInfo',
      name: 'orderBuyInfo',
      component: resolve => require(['@/pages/order/OrderBuyInfo'], resolve),
      meta: {
        title: '求购订单详情'
      }
    },
  ]
})

let indexScrollTop = 0

router.beforeEach((to, from, next) => {
  const token = getStore({ name: 'access_token', type: "string" });
  // 路由进入下一个路由对象前，判断是否需要登陆
  // 在路由meta对象中由个requireAuth字段，只要此字段为true，必须做鉴权处理
  if (to.matched.some(res => res.meta.requireAuth)) {
    // 未登录
    if (!token) {
      next({
        path: '/login',
        query: {
          redirect: to.path // 将跳转的路由path作为参数，登录成功后再跳转到该路由
        }
      })
    } else {
      next()
      // 登录四小时后超时
      let overdueTime = Number(token.datetime) + (1000 * 60 * 60 * 4);
      let nowTime = +new Date();
      // 登陆过期和未过期
      if (nowTime > overdueTime) {
        // 登录过期的处理，君可按需处理之后再执行如下方法去登录页面
        // 我这里没有其他处理，直接去了登录页面
        next({
          path: '/login',
          query: {
            redirect: to.path
          }
        })
      } else {
        next();
      }
    }
  } else {
    next();
  }
  if (to.path !== '/index') {
    // 记录现在滚动的位置
    indexScrollTop = document.body.scrollTop
  }
  // 修改网页title（暂时无意义）
  // document.title = to.meta.title || document.title
})
router.afterEach(route => {
  if (route.path !== '/index') {
    document.body.scrollTop = 0
  } else {
    Vue.nextTick(() => {
      // 回到之前滚动位置
      document.body.scrollTop = indexScrollTop
    })
  }
})
export default router
