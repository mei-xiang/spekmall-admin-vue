<!-- 标签页 -->
<template>
	<div class="tabs" id="tabs">
		<!-- 右键菜单组件 -->
		<v-contextmenu ref="contextmenu">
			<v-contextmenu-item @click="closeThisTab">关闭当前</v-contextmenu-item>
			<v-contextmenu-item @click="closeAllTabs">关闭所有</v-contextmenu-item>
		</v-contextmenu>
		<!-- tabs组件 -->
		<el-tabs v-model="activeIndex"
		         type="card"
		         @tab-click="tabClick"
		         v-if="options.length"
		         @tab-remove="tabRemove">
			<el-tab-pane :key="item.name"
			             v-for="item in options"
			             :name="item.route"
			             :closable="item.route!=='/index'">
				<span v-contextmenu:contextmenu
				      :route="item.route"
				      @contextmenu="getNode"
				      slot="label">{{item.name}}</span>
			</el-tab-pane>
		</el-tabs>

		<!-- 全部菜单列表 -->
		<div class="tabs-list"
		     v-show="isShowAllTabsBtn">
			<el-dropdown trigger="click"
			             @command="clickTabsList">
				<div class="tabs-list-btn">
					<i class="el-icon-caret-bottom"></i>
				</div>
				<el-dropdown-menu slot="dropdown">
					<template v-for="(item, index) in options">
						<el-dropdown-item :command="item.route"
						                  :key="index">{{item.name}}</el-dropdown-item>
					</template>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

	</div>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapGetters } from "vuex";
export default {
	name: "Tabs",
	data() {
		return {
			contextmenuRoute: null, //右键触发时当前tab的route
			isShowAllTabsBtn: false //控制是否显示全部tabs的按钮
		};
	},
	methods: {
		...mapMutations({
			deleteTabs: "DELETE_TABS",
			set_active_index: "SET_ACTIVE_INDEX",
			add_tabs: "ADD_TABS",
			reset_tabs: "RESET_TABS"
		}),
		// tab切换时，动态的切换路由
		tabClick(tab) {
			let path = this.activeIndex;
			// 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
			/* if (this.activeIndex === "/userInfo") {
				path = this.activeIndex + "/" + this.$store.state.userInfo.name;
			} */
			this.$router.push({ path: path });
		},
		tabRemove(targetName) {
			// 首页不可删除
			if (targetName === "/index") {
				return;
			}
			this.deleteTabs(targetName);
			const n = this.options.length;
			if (this.activeIndex === targetName) {
				// 设置当前激活的路由
				if (this.options && n >= 1) {
					this.set_active_index(
						this.options[this.options.length - 1].route
					);
					this.$router.push({ path: this.activeIndex });
				} else {
					this.$router.push({ path: "/index" });
				}
			}
		},
		// 右键菜单触发时获取node，从中获得对应的route数据
		getNode(node) {
			if (!node.target.attributes.route.value) return;
			let route = node.target.attributes.route.value;
			this.contextmenuRoute = route;
		},
		// 关闭当前右键选择的tab
		closeThisTab() {
			this.tabRemove(this.contextmenuRoute);
		},
		// 关闭所有tabs
		closeAllTabs() {
			this.$router.push("/index");
			this.reset_tabs();
		},
		// 控制全部tabs按钮是否显示
		changeAllTabsBtnShow() {
			setTimeout(() => {
				if (!$(".el-tabs__nav") || !$(".el-tabs__nav").width()) return;
				let tabsWidth = $(".el-tabs__nav").width();
				let wrapWidth = $("#tabs").width();
				if (tabsWidth >= wrapWidth) {
					this.isShowAllTabsBtn = true;
				} else {
					this.isShowAllTabsBtn = false;
				}
			}, 300)
		},
		// 点击右侧tabs-list 跳转路由
		clickTabsList(path) {
			this.activeIndex = path;
			// 用户详情页的时候，对应了二级路由，需要拼接添加第二级路由
			/* if (path === "/userInfo") {
				path = this.activeIndex + "/" + this.$store.state.userInfo.name;
			} */
			this.$router.push({ path: path });
		}
	},
	computed: {
		...mapGetters(["theme", "windowW", "options", "isOpenSidebar"]),
		activeIndex: {
			get() {
				return this.$store.state.activeIndex;
			},
			set(val) {
				this.set_active_index(val);
			}
		}
	},
	watch: {
		$route(to) {
			if (to.path === "/" || to.path === "/error") return;

			let flag = false;
			for (let option of this.options) {
				if (option.route === to.path) {
					flag = true;
					this.set_active_index("/" + to.path.split("/")[1]);
					break;
				}
			}
			if (!flag) {
				this.add_tabs({
					route: "/" + to.path.split("/")[1],
					name: to.meta["title"]
				});
				this.set_active_index("/" + to.path.split("/")[1]);
			}
		},
		windowW() {
			this.changeAllTabsBtnShow();
		},
		options() {
			this.changeAllTabsBtnShow();
		},
		isOpenSidebar() {
			this.changeAllTabsBtnShow();
		}
	},
	mounted() {
		this.changeAllTabsBtnShow();
	}
};
</script>

<style scoped lang="stylus">
$padding = 13px
>>>.el-tabs__header
	padding-top 3px
	margin-bottom 0
>>>.el-tabs__item
	border-top 2px solid #f2f2f2
	background-color #f2f2f2
	color #666
	&.is-active
		border-top 2px solid #00438A
		border-bottom-color #fff
		background-color #fff
		&.is-closable
			padding 0 $padding!important
	.el-icon-close
		width 14px!important
>>>.el-tabs__nav-next,
>>>.el-tabs__nav-prev
	width 17px
	height 42px
	line-height 42px
	background-color #555
	color #fff
>>>.el-tabs__item
	padding 0 $padding
	span
		display inline-block
		height 100%
>>>.el-tabs--top.el-tabs--card .el-tabs__item:nth-child(2)
	padding-left $padding
.tabs
	position relative
.tabs-list
	position absolute
	bottom -20px
	right 0
	width 20px
	height 20px
	line-height 20px
	text-align center
	background-color #ccc
	font-size 18px
	cursor pointer
	.tabs-list-btn
		width 20px
		height 20px
.el-tabs__nav-scroll
	background-color #F2F2F2 !important

</style>
