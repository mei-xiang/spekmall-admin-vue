/**
 * base路由
 */
export default [
  // 买家会员管理
  {
    path: "/buyerMembership",
    name: "buyerMembership",
    meta: {
      title: "买家会员管理"
    },
    component: resolve =>
      require(["@/pages/buyerMembership/BuyerMembership"], resolve)
  },
  // 供应商管理
  {
    path: "/supplierApplication",
    name: "supplierApplication",
    meta: {
      title: "供应商申请管理"
    },
    component: resolve =>
      require(["@/pages/supplier/SupplierApplication"], resolve)
  },
  {
    path: "/supplierMembership",
    name: "supplierMembership",
    meta: {
      title: "供应商会员管理"
    },
    component: resolve =>
      require(["@/pages/supplier/SupplierMembership"], resolve)
  },
  {
    path: "/supplierStore",
    name: "supplierStore",
    meta: {
      title: "供应商店铺管理"
    },
    component: resolve => require(["@/pages/supplier/SupplierStore"], resolve)
  },
  // 商品管理
  {
    path: "/commodityList",
    name: "commodityList",
    meta: {
      title: "商品管理列表"
    },
    component: resolve => require(["@/pages/commodity/CommodityList"], resolve)
  },
  {
    path: "/commodityLabel",
    name: "commodityLabel",
    meta: {
      title: "商品标签管理"
    },
    component: resolve => require(["@/pages/commodity/CommodityLabel"], resolve)
  },
  {
    path: "/category",
    name: "category",
    meta: {
      title: "类别管理"
    },
    component: resolve => require(["@/pages/commodity/Category"], resolve)
  },
  // 订单管理
  {
    path: "/electricityOrder",
    name: "electricityOrder",
    meta: {
      title: "类别管理"
    },
    component: resolve => require(["@/pages/order/ElectricityOrder"], resolve)
  },
  {
    path: "/purchaseOrder",
    name: "purchaseOrder",
    meta: {
      title: "求购订单管理"
    },
    component: resolve => require(["@/pages/order/PurchaseOrder"], resolve)
  },
  // 自营管理
  {
    path: "/proprietaryStore",
    name: "proprietaryStore",
    meta: {
      title: "自营店铺管理"
    },
    component: resolve =>
      require(["@/pages/proprietary/ProprietaryStore"], resolve)
  },
  {
    path: "/proprietaryProduct",
    name: "proprietaryProduct",
    meta: {
      title: "自营商品管理"
    },
    component: resolve =>
      require(["@/pages/proprietary/ProprietaryProduct"], resolve)
  },
  {
    path: "/proprietaryOrder",
    name: "proprietaryOrder",
    meta: {
      title: "自营订单管理"
    },
    component: resolve =>
      require(["@/pages/proprietary/ProprietaryOrder"], resolve)
  },
  {
    path: "/myMessage",
    name: "myMessage",
    meta: {
      title: "我的消息"
    },
    component: resolve => require(["@/pages/proprietary/MyMessage"], resolve)
  },
  // 热门管理
  {
    path: "/hotRecommendation",
    name: "hotRecommendation",
    meta: {
      title: "热门推荐管理"
    },
    component: resolve => require(["@/pages/hot/HotRecommendation"], resolve)
  },
  {
    path: "/homePopularCategory",
    name: "homePopularCategory",
    meta: {
      title: "首页热门品类管理"
    },
    component: resolve => require(["@/pages/hot/HomePopularCategory"], resolve)
  },
  // 品牌管理
  {
    path: "/brand",
    name: "brand",
    meta: {
      title: "品牌管理"
    },
    component: resolve => require(["@/pages/brand/Brand"], resolve)
  },
  // 信息管理
  {
    path: "/banner",
    name: "banner",
    meta: {
      title: "banner管理"
    },
    component: resolve => require(["@/pages/info/Banner"], resolve)
  },
  // 消息管理
  {
    path: "/service",
    name: "service",
    meta: {
      title: "客服管理"
    },
    component: resolve => require(["@/pages/message/Service"], resolve)
  },
  // 消息管理
  {
    path: "/systemUser",
    name: "systemUser",
    meta: {
      title: "系统用户管理"
    },
    component: resolve => require(["@/pages/system/SystemUser"], resolve)
  },
  {
    path: "/userRight",
    name: "userRight",
    meta: {
      title: "用户权限管理"
    },
    component: resolve => require(["@/pages/system/UserRight"], resolve)
  },
  {
    path: "/securitySettings",
    name: "securitySettings",
    meta: {
      title: "安全设置"
    },
    component: resolve => require(["@/pages/system/SecuritySettings"], resolve)
  }
];
