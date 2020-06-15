/*
 * @Description: 路由 name 和 component 映射
 */
export default {
  "index": resolve => require(['@/pages/index/Index'], resolve),
  "banner": resolve => require(['@/pages/banner/index'], resolve),
  "job": resolve => require(['@/pages/job/index'], resolve),

  "news": resolve => require(['@/pages/news/index'], resolve),
  "user": resolve => require(['@/pages/system/User'], resolve),
  "role": resolve => require(['@/pages/system/Role'], resolve),
  "menu": resolve => require(['@/pages/menu/Menu'], resolve),

  "msg": resolve => require(['@/pages/message/Message'], resolve),
  "uv": resolve => require(['@/pages/accessCount/uv'], resolve),
  "pv": resolve => require(['@/pages/accessCount/pv'], resolve)
}
