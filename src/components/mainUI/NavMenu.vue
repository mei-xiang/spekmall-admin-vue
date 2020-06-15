<!--
 * @Description: 标签下方面包屑组件
 * @Author: jiaxin
 * @Date: 2019-05-20 16:12:11
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-12-05 09:42:57
 -->
<template>
	<div class="navMenu clearfix">
		<span class="fl">当前位置：</span>
		<div class="menu-box fl">
			<el-breadcrumb separator-class="el-icon-arrow-right">
				<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
				<el-breadcrumb-item v-show="isShowLevelTab">{{parentLevelName}}</el-breadcrumb-item>
				<el-breadcrumb-item>{{menuName}}</el-breadcrumb-item>
				<!-- <el-breadcrumb-item v-for="(item)  in levelList" :key="item.path" v-if="item.meta.title">
				<router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link>
			</el-breadcrumb-item> -->
			</el-breadcrumb>
		</div>
	 <br>
     <hr class="hr">
	</div>

</template>

<script type="text/ecmascript-6">
export default {
	name: "NavMenu",
	data() {
		return {
			isShowLevelTab: false,
			levelList: null,
			parentLevelName: "",
			menuName: ""
		};
	},
	methods: {
        /**
         * 生成面包屑的方法
         */
		getBreadcrumb() {
			console.log(this.$route);
			let route = this.$route;
			this.menuName = route.meta.title;
			this.isShowLevelTab = false;
			if (route.meta.parent) {
				this.isShowLevelTab = true;
				this.parentLevelName = route.meta.parent;
			}
		}
	},
	mounted() {
		this.getBreadcrumb();
	},
	watch: {
		$route(to, from) {
			this.getBreadcrumb();
		}
	}
};
</script>

<style scoped lang="stylus">
.navMenu
	padding 10px 0 5px 30px
.hr
	display block
	margin-top 8px
	border-color #F2F2F2
</style>
