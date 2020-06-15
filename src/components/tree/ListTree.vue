<!--
 * @Description: 列表展示左右的树
 * @Author: jiaxin
 * @LastEditors: jiaxin
 * @Date: 2018-11-19 09:31:14
 * @LastEditTime: 2019-07-13 17:17:20
 -->

<template>
	<div class="RadioTree">
		<div class="header">
			<div class="el-dialog__header">
				<span class="el-dialog__title">{{headerTitle}}</span>
				<span class="sub-title"
					  v-show="choiceDate[props.label]">目前选中:{{choiceDate[props.label]}}</span>
			</div>
			<div class="input-wrap">
				<el-input placeholder="输入关键字"
						  size="small"
						  v-model="filterText">
				</el-input>
			</div>
		</div>
		<div class="body">
			<el-scrollbar style="height:100%">
				<el-tree class="filter-tree"
						 :data="data"
						 :props="props"
						 :default-expand-all="false"
						 :expand-on-click-node="false"
						 :filter-node-method="filterNode"
						 @node-click="chioceData"
						 ref="tree2">
					<span slot-scope="{ data }"
						  :class="{'disabled': data.disabled}">
						<slot :node="data"></slot>
					</span>
				</el-tree>

			</el-scrollbar>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			filterText: '',
			choiceDate: {}
		};
	},
	props: {
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		props: {
			type: Object,
			default: () => {
				return {
					children: 'children',
					label: 'label'
				}
			}
		},
		headerTitle: {
			type: String,
			default: () => {
				return "标题"
			}
		}
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data[this.props.label].indexOf(value) !== -1;
		},
		showTree() {
			this.isShow = true;
		},
		chioceData(data) {
			if (data.disabled) {
				data = {}
			}
			this.$emit("chioceNode", data);
			this.choiceDate = data
		}
	},
	watch: {
		filterText(val) {
			this.$refs.tree2.filter(val);
		}
	}

}
</script>

<style lang="stylus" scoped>
.RadioTree
	position relative
	width 100%
	height 100%
	background-color #fff
	.header
		position absolute
		z-index 10
		width 100%
		background-color #fff
		.sub-title
			padding-left 10px
			font-size 12px
		.title
			padding-left 30px
			height 50px
			line-height 50px
			background-color #409EFF
			font-size 18px
			color #fff
		.input-wrap
			padding 5px 15px 0
	.body
		box-sizing border-box
		padding 101px 15px 10px
		height 100%
		overflow auto
	>>>.el-tree-node__content
		button
			display none
	>>>.el-tree-node__content:hover
		button
			display inline
.disabled
	cursor not-allowed
</style>
