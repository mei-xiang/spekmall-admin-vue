/*
 * @Description: 路由 name 和 component 映射
 */
export default {
  "home": resolve => require(['@/pages/home/Home'], resolve), // 首页

  "selfShop": resolve => require(["@/pages/self/SelfShop"], resolve), // 自营店铺管理
  "selfProduct": resolve => require(["@/pages/self/SelfProduct"], resolve), // 自营商品管理
  "selfOrder": resolve => require(["@/pages/self/SelfOrder"], resolve), // 自营订单管理
  "myMsg": resolve => require(["@/pages/self/MyMsg"], resolve), // 我的消息

  "buyerMember": resolve => require(["@/pages/buyerMember/BuyerMember"], resolve), // 买家会员管理

  "supplierApply": resolve => require(["@/pages/supplier/SupplierApply"], resolve), // 供应商申请管理
  "supplierMember": resolve => require(["@/pages/supplier/SupplierMember.vue"], resolve), // 供应商会员管理
  "supplierShop": resolve => require(["@/pages/supplier/supplierShop"], resolve), // 供应商店铺管理

  "productList": resolve => require(["@/pages/product/ProductList"], resolve), // 商品管理列表
  "productLabel": resolve => require(["@/pages/product/ProductLabel"], resolve), // 商品标签管理
  "productCategory": resolve => require(["@/pages/product/ProductCategory"], resolve), // 商品类别管理

  "orderElec": resolve => require(["@/pages/order/OrderElec"], resolve), // 电商订单管理
  "orderBuy": resolve => require(["@/pages/order/OrderBuy"], resolve), // 求购订单管理

  "hotRecommend": resolve => require(["@/pages/hot/HotRecommend"], resolve), // 热门推荐管理
  "hotProduct": resolve => require(["@/pages/hot/HotProduct"], resolve), // 首页热门品类管理

  "brand": resolve => require(["@/pages/brand/Brand"], resolve), // 品牌管理

  "msg": resolve => require(["@/pages/message/Msg"], resolve), // 消息管理

  "info": resolve => require(["@/pages/info/Info"], resolve), // 信息管理

  "systemUser": resolve => require(["@/pages/system/SystemUser"], resolve), // 系统用户管理
  "systemRole": resolve => require(["@/pages/system/SystemRole"], resolve), // 系统角色管理
  "systemMenu": resolve => require(["@/pages/system/SystemMenu"], resolve), // 系统菜单管理
};
