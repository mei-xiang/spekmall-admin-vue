<!--
 * @Description: 头部主菜单
 * @Author: jiaxin
 * @Date: 2018-11-08 12:35:03
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-31 15:17:26
 -->

<template>
	<el-container>
		<el-aside width="200px">
			<el-scrollbar style="height:100%">
				<ul class="left fl">
					<li v-for="item in leftMenu"
					    :key="item.ID"
					    @mouseover="choiceMainMenu(item.ID)"
					    @mouseout="clearEvent"
					    :class="{'left-active':item.active}">
						<span>
							<i class="iconfont"
							   :class="item.icon"></i>
							{{item.label}}
						</span>
					</li>
				</ul>
			</el-scrollbar>
		</el-aside>
		<el-container>
			<el-header height="50px">
				<div class="input-wrap">
					<el-input v-model="menuSearch"
					          clearable
					          maxlength="20"
					          prefix-icon="el-icon-search"
					          placeholder="请输入菜单名称"></el-input>
				</div>
			</el-header>
			<el-main>
				<ul v-for="item1 in showRightMenu"
				    :key="item1.id">
					<li class="title">{{item1.name}}</li>
					<li v-for="item2 in item1.children"
					    :key="item2.id">
						<router-link :to="item2.url">
							{{item2.name}}
						</router-link>
					</li>
				</ul>
			</el-main>
		</el-container>
	</el-container>

</template>
<script>
import { mapGetters } from "vuex";
export default {
	name: "headerMenu",
	data() {
		return {
			leftMenu: [],
			// 右侧搜索的菜单名称
			menuSearch: "",
			// 左侧选择的菜单ID
			leftNemuID: 0,
			timeout: null
		}
	},
	methods: {
		choiceMainMenu(ID) {
			this.timeout = setTimeout(() => {
				this.leftMenu.forEach((item) => {
					item.active = false;
					if (item.ID === ID) {
						item.active = true;
						this.leftNemuID = item.ID;
					}
				})
			}, 100);
		},
		clearEvent() {
			if (this.timeout !== null) {
				clearTimeout(this.timeout)
			}
		}

	},
	computed: {
		...mapGetters(["userInfo"]),
		showRightMenu() {
			// 深拷贝
			if (!this.userInfo.mainMenu.right[this.leftNemuID]) return;
			let menu = this.$clone(this.userInfo.mainMenu.right[this.leftNemuID]);
			let showMenu = menu.filter((item) => {
				let isShow = false;
				if (item.children && item.children.length !== 0) {
					let subMenu = item.children.filter((sbuItem) => {
						if (sbuItem.name.indexOf(this.menuSearch) !== -1) {
							isShow = true;
							return true
						}
					})
					item.children = subMenu;
				}
				return isShow
			})
			return showMenu;
		}
	},
	mounted () {
		this.leftMenu = this.$clone(this.userInfo.mainMenu.left)
	}
}
</script>

<style lang="stylus" scoped>
$height = 32px
.el-container
	height 450px
	.left
		width 100%
		height 100%
		background-color #06274B
		li
			height 70px
			line-height 70px
			padding-left 20px
			font-size 16px
			color #fff
			cursor pointer
			span
				box-sizing border-box
				display block
				width 100%
				height 100%
				border-bottom 1px solid #0D427C
			i
				position relative
				top 2px
				display inline-block
				padding-right 20px
				font-size 18px
			&:last-child
				span
					border none
		.left-active
			background-color #fff
			color #00438A
			span
				border none
			i
				color #00438A
	.input-wrap
		padding-top 20px
		>>>.el-input__inner
			height $height
			line-height $height
			border-radius 4px
			border none
			background-color #EAEEF5
		>>>.el-input__icon
			line-height $height
	.el-main
		display flex
		flex-direction column
		flex-wrap wrap
		justify-content flex-start
		align-items flex-start
		padding 5px 20px 20px
		width 100%
		li
			height 30px
			line-height 30px
			min-width 130px
			font-size 12px
			color #333
			&:first-child
				padding-top 10px
			&:nth-child(2)
				padding-top 2px
		.title
			height 36px
			line-height 36px
			font-size 14px
			font-weight bolder
			color #000
			border-bottom 1px solid #d8d8d8
</style>
