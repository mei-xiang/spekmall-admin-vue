<!-- 侧边导航 -->
<template>
<!-- <div class="side-nav" style=" backgroundColor: #fff "> -->
  <div class="side-nav" :style="{ backgroundColor: theme }">
    <el-scrollbar style="height:100%">
      <div class="logo">
        <img src="../../../assets/images/avatar.png" alt="" />
        <p>思贝克商城官方自营店</p>
      </div>
      <el-menu
        :default-active="$route.path"
        :backgroundColor="theme"
        text-color="#909399"
        active-text-color="#1989FA"
        router
      >
        <template v-for="item in userInfo.leftMenu">
          <el-submenu
            v-if="item.children"
            :key="item.id"
            :index="item.menuUrl ? item.menuUrl : item.menuName"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.menuName }}</span>
            </template>
            <el-menu-item
              v-for="item1 in item.children"
              :key="item1.id"
              :index="item1.menuUrl"
            >
              <template slot="title">
                <i :class="item1.icon"></i>
                <span>{{ item1.menuName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            v-if="!item.children"
            :key="item.id"
            :index="item.menuUrl"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.menuName }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
	name: "SideNav",
	computed: {
		...mapGetters(["userInfo", "theme"])
	}
};
</script>

<style scoped lang="stylus">
.el-menu-item:hover
  background-color #1989FA!important
  color: #fff!important

.el-menu-item.is-active
  background-color #1989FA!important
  color: #fff!important

.el-submenu .el-submenu__title:hover
  background-color #1989FA!important
  color: #fff!important

.logo
  text-align center
  padding-top 35px
.logo img
  display inline-block
  width 96px
  height 96px

.logo p
  color #fff
  line-height 40px
  font-size: 16px;
  color: #999999;
  font-family: 'PingFangSC-Semibold';

.side-nav
	box-sizing border-box
	position absolute
	top 0
	left 0
	padding-top 60px
	width 200px
	height 100%
	z-index 1
	transition left 0.28s

	.el-menu
		border none

	>>>.el-menu-item
		height 46px
		line-height 46px
		border none
</style>
