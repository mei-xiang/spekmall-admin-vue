<!--
 * @Description: 树形组件(支持多选)
 * @Author: jiaxin
 * @LastEditors: jiaxin
 * @Date: 2018-11-19 09:31:14
 * @LastEditTime: 2019-07-26 11:04:33
 -->
<template>
	<div class="multiChoiceTree">
		<div class="header">
			<el-input placeholder="输入关键字"
					  size="small"
					  v-model="filterText">
			</el-input>
		</div>
		<div class="body">
			<el-scrollbar style="height:100%">
				<el-tree class="filter-tree"
						 show-checkbox
						 :data="data"
						 node-key="id"
						 :check-strictly="checkStrictly"
						 :props="props"
						 :default-expand-all="expandAll"
						 @check="check"
						 :default-checked-keys="defaultCheckedKeys"
						 :expand-on-click-node="false"
						 :filter-node-method="filterNode"
						 ref="tree">
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
		expandAll: {
			type: Boolean,
			default: false
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
		// 父子节点关联性 false 关联  true 无关联
		checkStrictly: {
			type: Boolean,
			default: false
		},
		// 在上面 checkStrictly: true 无关联的时候，父节点是否影响子节点的全选或者清空全选
		isChangeChildren: {
			type: Boolean,
			default: false
		},
		// 是菜单按钮权限树 用来定义特殊情况处理特殊逻辑的标志
		isMenuBtnTree: {
			type: Boolean,
			default: false
		},
		defaultCheckedKeys: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data[this.props.label].indexOf(value) !== -1;
		},
		openOriginzation() {
			this.isShow = true;
		},
		chioceData(data) {
			this.$emit("chioceNode", data);
			this.isShow = false;
		},
		// 获取当前选中节点数据
		getCheckedData(hasHalfChecked = true) {
			let arr = [];
			if (hasHalfChecked) {
				arr = [
					...this.$refs.tree.getCheckedKeys(),
					...this.$refs.tree.getHalfCheckedKeys()
				]
			} else {
				arr = [
					...this.$refs.tree.getCheckedKeys()
				]
			}
			const data = {
				nodes: this.$refs.tree.getCheckedNodes(),
				// IDArr: this.$refs.tree.getCheckedKeys()
				// 以下代码是返回勾选和半勾选id数组
				IDArr: arr
			}
			return data
		},
		// 根据ID数组选中
		setCheckedKeys(arr) {
			if (!Array.isArray(arr) || arr.length === 0) return;
			// 无关联性的直接显示全部节点
			if (this.checkStrictly) {
				this.$refs.tree.setCheckedKeys(arr);
				return
			}
			// 有关联关系的 需要考虑是否为子节点
			// 回显时 过滤半选节点id， 避免半选节点被选中造成子节点全部选中
			let newArr = [];
			const children = this.props.children;
			const checked = (id, data, newArr) => {
				data.forEach(item => {
					if (item.id === id) {
						if (!item[children] || item[children].length === 0) {
							newArr.push(item.id)
						}
					} else {
						if (item[children] && item[children].length !== 0) {
							checked(id, item[children], newArr)
						}
					}
				});
			};
			arr.forEach(item => {
				checked(item, this.data, newArr)
			})
			this.$refs.tree.setCheckedKeys(newArr)
		},
		/**
   		* @description: 当复选框被点击的时候触发
   		* @param {Object} data [传递给data属性的数组中该节点所对应的对象]
   		* @param {Object} checkedNodes [树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性]
   		* @return:
   		*/
		check(data, checkedNodes) {
			this.$emit("check", data, checkedNodes);
			if (!this.checkStrictly || !this.isChangeChildren) return;
			const id = data.id;
			const isChecked = checkedNodes.checkedKeys.indexOf(id) !== -1;
			if (this.isMenuBtnTree && isChecked) {
				const arr = this.$treeFn.findAllPId(this.data, data.id, {
					children: "children",
					pId: "parentId"
				});
				arr.forEach((item) => {
					this.$refs.tree.setChecked(item, isChecked);
				})
			}
			if (!data[this.props.children]) return;
			const children = data[this.props.children];
			const childrenIdArr = this.$treeFn.findAllId(children);
			childrenIdArr.forEach(item => {
				this.$refs.tree.setChecked(item, isChecked);
			})
		}
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		}
	}

}
</script>

<style lang="stylus" scoped>
.multiChoiceTree
	position relative
	padding-left 15px
	height 100%
	.header
		box-sizing border-box
		position absolute
		top 0
		left 0
		z-index 10
		padding-left 15px
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
		padding-top 32px
		height 100%
		overflow auto
</style>
