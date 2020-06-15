<!--
 * @Description: 单选树形组件（适用于弹窗内二级选择）
 * @Author: jiaxin
 * @LastEditors: jiaxin
 * @Date: 2018-11-19 09:31:14
 * @LastEditTime: 2019-07-30 17:11:47
 -->

<template>
	<div class="RadioTree"
			v-show="isShow">
		<div class="header">
			<div class="el-dialog__header">
				<span class="el-dialog__title">{{headerTitle}}</span>
				<button type="button"
						aria-label="Close"
						class="el-dialog__headerbtn"
						@click="isShow=false">
					<i class="el-dialog__close el-icon el-icon-close"></i>
				</button>
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
							ref="tree2">
					<span slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span>
							<el-button type="text"
										size="mini"
										@click="() => chioceData(data)">
								选择
							</el-button>
						</span>
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
			isShow: false,
			filterText: ''
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
			this.$emit("chioceNode", data);
			this.isShow = false;
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
	position absolute
	top 0
	left 0
	z-index 2
	width 100%
	height 100%
	background-color #fff
	.header
		position absolute
		z-index 10
		width 100%
		background-color #fff
		.title
			padding-left 30px
			height 50px
			line-height 50px
			background-color #409EFF
			font-size 18px
			color #fff
			.close
				position absolute
				top 15px
				right 35px
				cursor pointer
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
</style>
