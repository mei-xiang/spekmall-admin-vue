import {
  getStore
} from 'js/store'

const state = {
  news: localStorage.getItem('news'),
  // 主题颜色
  theme: getStore({
    name: 'theme'
  }) || '#fff',
  // 保存页面选项卡数据
  options: getStore({
    name: 'options'
  }) || [{
    name: '首页',
    route: "/index"
  }],
  // 激活的页面index
  activeIndex: getStore({
    name: 'activeIndex'
  }) || '/index',
  // 用户信息
  userInfo: getStore({
    name: 'userInfo'
  }) || {
    allMenuList: [],
    leftMenu: [],
    mainMenu: {
      left: [],
      right: {}
    },
    permissions: []
  },
  // 窗口高度
  windowH: null,
  // 窗口宽度
  windowW: null,
  // 是显示侧边栏
  isOpenSidebar: false,
  // 域名相关
  domain: {
    prefix: "www.",
    suffix: ".ec-chain.com"
  },
  // 文件展示列表配置文件
  fileListTheaderData: [
    {
      type: 5,
      width: '',
      hasSort: false,
      isShow: true,
      prop: 'fileUrl',
      label: '文件名'
    },
    {
      type: 0,
      width: '',
      hasSort: false,
      isShow: true,
      prop: 'remark',
      label: '备注'
    },
    {
      type: 0,
      width: '',
      hasSort: false,
      isShow: true,
      prop: 'createUserName',
      label: '创建人'
    },
    {
      type: 8,
      width: '',
      hasSort: false,
      isShow: true,
      prop: 'createTime',
      label: '创建时间'
    }
  ],
  // 激活的页面index
  page: getStore({
    name: 'page'
  }) || [
      'homePV', // 联系我们PV ,
      'contactUsPv', // 联系我们PV ,
      'culturePv', // 企业文化PV ,
      'developPv', // 发展历程PV ,
      'equipmentPv', // 专业设备PV ,
      'honorPv', // 资质荣誉PV ,
      'mes1Pv', // 智能仓储管理PV ,
      'mes2Pv', // 云制造平台PV ,
      'msgColumnPv', // 留言专栏PV ,
      'newsPv', // 新闻资讯PV ,
      'processFlowPv', // 工艺流程PV ,
      'productPv', // 产品介绍PV ,
      'recruitPv', // 人才招聘PV ,
      'surveyPv' // 公司概况PV
    ]
}

export default state
