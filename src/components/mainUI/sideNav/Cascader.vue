<!-- 左侧导航组件 -->
<template>
	<div class="cascader animated"
	     :class="{'slideInLeft':isCollapse,'slideOutLeft':!isCollapse}">
		<cascader-panel :data="data"></cascader-panel>
	</div>
</template>

<script type="text/ecmascript-6">
import CascaderPanel from "./CascaderPanel";
export default {
	name: "Cascader",
	components: {
		CascaderPanel
	},
	props: {
		data: Array,
		isCollapse: Boolean
	}
};
</script>

<style lang="stylus">
.animated
	animation-duration 0.5s
	animation-fill-mode both
// .nav-enter-active, .nav-leave-active
// transition all 5s
// .nav-enter, .nav-leave-to
// width 0
.cascader
	height 100%
	position fixed
	top 59px
	left 0
	bottom 0
	z-index 9
	.cascader-panel
		display flex
		height 100%
		box-sizing border-box
		background #4A4F64
		.cascader-line
			display inline-block
			height 100%
			width 1px
			background-color hsla(0, 0%, 100%, 0.15)
			position absolute
			top 0
			right 0
		ul
			width 200px
			box-sizing border-box
			padding-top 10px
			position relative
			.cascader-item
				height 40px
				line-height 40px
				box-sizing border-box
				cursor pointer
				position relative
				p
					color #fff
					font-size 14px
					text-indent 20px
				.el-icon-arrow-right
					color #fff
					font-size 17px
					position absolute
					top 11px
					right 10px
			.isactive
				p, .el-icon-arrow-right
					color #00c1de
</style>
