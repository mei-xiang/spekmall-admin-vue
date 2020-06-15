<!--
 * @Description: 上下两部分表格布局，拖拽调整高度组件
 * @Author: jiaxin
 * @Date: 2018-12-11 10:56:44
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-02 16:55:29
 -->
<template>
	<div v-dragY="dragY"
	     class="position-line">
		<div class="position-icon">
			<i v-show="isShowUpIcon"
			   @click="toDown"
			   class="el-icon-caret-bottom"></i>
			<i v-show="!isShowUpIcon"
			   @click="toUp"
			   class="el-icon-caret-top"></i>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name: "DragY",
	data() {
		return {
			isShowUpIcon: true,
			topHeight: 0,
			botHeight: 0
		};
	},
	props: {
		/**
		 * @description: 拖拽指令的传入参数 Array
		 * @param {String} 第1个参数 [上部分表格容器ID]
		 * @param {String} 第2个参数 [下部分表格容器ID]
		 * @param {Function} 第3个参数 [调整高度的函数]
		 * @return:
		 */
		dragY: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	methods: {
		toUp() {
			this.isShowUpIcon = true;
			if (this.dragY[0] && this.dragY[2]) {
				const top = $("#" + this.dragY[0]);
				const bot = $("#" + this.dragY[1]);
				top.height(this.topHeight);
				bot.height(this.botHeight);
			}
			if (this.dragY[2]) this.dragY[2]();
		},
		toDown() {
			this.isShowUpIcon = false;
			if (this.dragY[0] && this.dragY[2]) {
				const top = $("#" + this.dragY[0]);
				const bot = $("#" + this.dragY[1]);
				const topH = top.height();
				const botH = bot.height();
				this.topHeight = topH;
				this.botHeight = botH;
				top.height(topH + botH - 15);
				bot.height(15);
			}
			if (this.dragY[2]) this.dragY[2]();
		}
	}
};
</script>

<style scoped lang="stylus">
.position-icon
	position absolute
	top -8px
	right 0
	z-index 200
	width 25px
	height 50px
	font-size 26px
	cursor pointer
</style>
