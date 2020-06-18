<!--
 * @Description:
 * @Author: jiaxin
 * @Date: 2019-09-25 09:10:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-09 17:04:48
 -->

<template>
  <div id="app"
       :class="{'openSidebar':isOpenSidebar,'hideSidebar':!isOpenSidebar}">
    <side-nav v-if="showNav"></side-nav>
    <div v-if="showNav"
         class="app-header">
      <my-header></my-header>
    </div>
    <div class="top-bar"
         v-if="showNav">
      <my-tabs></my-tabs>
      <nav-menu></nav-menu>
    </div>
    <div id="content"
         class="content">
      <!-- <transition name="fade-transform"
			            mode="out-in"> -->
      <keep-alive :include="routePathArr"
                  :max="15">
        <router-view />
      </keep-alive>
      <!-- </transition> -->
    </div>
    <!-- <BottomBar v-if="showNav"></BottomBar> -->
  </div>
</template>

<script>
import fileList from '@/router/fileList';
import MyHeader from "@/components/mainUI/header/Header";
import NavMenu from "@/components/mainUI/NavMenu";
import SideNav from "@/components/mainUI/sideNav/SideNav";
import MyTabs from "@/components/mainUI/Tabs";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      showNav: true,
      timer: null //计算屏幕宽高防抖，保存定时器对象
    };
  },
  methods: {
    ...mapMutations(["SET_WINDOW_W", "SET_WINDOW_H"]),
    setContentHight() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
        if (this.showNav) {
          // 屏幕高度
          const windowH = document.documentElement.clientHeight || document.body.clientHeight;
          const windowW = document.documentElement.clientWidth || document.body.clientWidth;
          this.SET_WINDOW_W(windowW);
          this.SET_WINDOW_H(windowH);
          const headerH = $(".app-header").height();
          const topbarH = $(".top-bar").height();
          const bottomH = $(".bottom-bar").height() || 0;
          $("#content").height(windowH - headerH - topbarH - bottomH);
        } else {
          $("#content").height("100%");
        }
      }, 300);
    }
  },
  created() {
    if (this.userInfo.routerList && this.userInfo.routerList.length !== 0) {
      this.userInfo.routerList.map((item) => {
        item.component = fileList[item.name];
        return item
      })
      this.$router.addRoutes(this.userInfo.routerList);
      this.$router.onReady(() => {
        this.$router.push(this.activeIndex);
      })
    }
  },
  mounted() {
    this.setContentHight();
    window.onresize = () => {
      this.setContentHight();
    }
  },
  computed: {
    ...mapGetters(["userInfo", "isOpenSidebar", "routePathArr", "activeIndex"])
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (val.meta.showNav === false) {
          this.showNav = false;
        } else {
          this.showNav = true;
        };
        this.setContentHight();
      }
    }
  },
  components: { MyHeader, NavMenu, SideNav, MyTabs }
};
</script>

<style scoped lang="stylus">
$maxWidth = 1440px
$padding = 30px

.app-header
  position relative
  z-index 2

.top-bar, .content
  box-sizing border-box
  transition padding-left 0.28s

.content
  padding-right 0px
  overflow scroll
  @media (max-width: $maxWidth)
    padding-right ($padding / 3)

.openSidebar
  .side-nav
    left 0

  .top-bar
    padding-left 200px

  .content
    padding-left: 230px;

.hideSidebar
  .side-nav
    left -200px

  .top-bar
    padding-left 0

  .content
    padding-left: 0px

    @media (max-width: $maxWidth)
      padding-left ($padding / 3)
</style>
