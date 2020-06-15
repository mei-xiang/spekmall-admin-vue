<!-- 侧边导航 -->
<template>
	<div class="side-nav" :style="{'backgroundColor':theme}">
		<el-scrollbar style="height:100%">
			<el-menu :default-active="$route.path"
					 :backgroundColor="theme"
					 text-color="#fff"
					 active-text-color="#ffd04b"
					 router>
				<template v-for="item in userInfo.leftMenu">
					<el-submenu v-if="item.children"
								:key="item.id"
								:index="item.menuUrl?item.menuUrl:item.menuName">
						<template slot="title">
							<i :class="item.icon"></i>
							<span>{{item.menuName}}</span>
						</template>
						<el-menu-item v-for="item1 in item.children"
									  :key="item1.id"
									  :index="item1.menuUrl">
							<template slot="title">
								<i :class="item1.icon"></i>
								<span>{{item1.menuName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>
					<el-menu-item v-if="!item.children"
								  :key="item.id"
								  :index="item.menuUrl">
						<template slot="title">
							<i :class="item.icon"></i>
							<span>{{item.menuName}}</span>
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
