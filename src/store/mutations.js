import {
  setStore
} from 'js/store'

const mutations = {
  SET_NEWS(state, val) {
    state.news = val
  },
  // 消息未读数
  SET_NOREADTOTAL(state, val) {
    state.noReadTotal = val
  },
  // 主题颜色
  SET_THEME: (state, color) => {
    state.theme = color
    setStore({
      name: 'theme',
      content: state.theme
    })
  },
  // 添加tabs
  ADD_TABS(state, data) {
    state.options.push(data);
    setStore({
      name: 'options',
      content: state.options,
      type: 'Session'
    })
  },
  // 删除tabs
  DELETE_TABS(state, route) {
    let index = 0;
    for (let option of state.options) {
      if (option.route === route) {
        break;
      }
      index++;
    }
    state.options.splice(index, 1);
    setStore({
      name: 'options',
      content: state.options,
      type: 'Session'
    })
  },
  RESET_TABS(state) {
    state.options = [{
      name: '首页',
      route: "/home"
    }];
    setStore({
      name: 'options',
      content: state.options,
      type: 'Session'
    })
  },
  // 设置当前激活的tab
  SET_ACTIVE_INDEX(state, index) {
    state.activeIndex = index;
    setStore({
      name: 'activeIndex',
      content: state.activeIndex,
      type: 'Session'
    })
  },
  // 设置详情信息
  SET_USER_INFO(state, info) {
    state.userInfo = info;
    setStore({
      name: 'userInfo',
      content: info,
      type: "Session"
    })
  },
  // 设置窗口高
  SET_WINDOW_H(state, H) {
    state.windowH = H;
  },
  // 设置窗口宽
  SET_WINDOW_W(state, W) {
    state.windowW = W;
  },
  // 设置边框开关
  OPEN_SIDEBAR(state) {
    state.isOpenSidebar = !state.isOpenSidebar;
  },
  // 设置详情信息
  SET_PAGE(state, data) {
    state.page = data;
    setStore({
      name: 'page',
      content: data
    })
  }
}

export default mutations
