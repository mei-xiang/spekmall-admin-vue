<!--
 * @Description: 树形表格组件
 * @Author: jiaxin
 * @Date: 2018-11-20 16:14:21
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-24 17:24:29
 -->
<template>
	<div class="tree-wrap">
		<ul class="tree-header clearfix">
			<li v-if="isShowCheckbox"
			    class="checkAll">
				<el-checkbox v-model="checkAll"></el-checkbox>
			</li>
			<li v-for="(item,index) in headerData"
			    :key="index"
			    :style="{'width':item.width,'left':leftArr[index],'text-align':item.align}">
				{{ item.label }}
			</li>
		</ul>
		<div class="tree-inner"
		     :style="{'height':treeHeight+'px'}">
			<el-scrollbar style="height:100%">
				<el-tree :data="bodyData"
				         ref="tree"
				         node-key="id"
						 :draggable="draggable"
				         :allow-drop="allowDrop"
				         :allow-drag="allowDrag"
				         :show-checkbox="isShowCheckbox"
				         :default-expand-all="expandAll"
						 :default-expanded-keys="expandedKeys"
				         :props="props"
				         :default-checked-keys="defaultCheckedKeys"
						 :expand-on-click-node="false"
						 :filter-node-method="filterNode"
						 @node-expand="nodeExpand"
				         @node-drop="handleDrop"
				         @check="check">
					<span class="tree-node"
					      slot-scope="{ node, data }">
						<template v-for="(item,index) in headerData">
							<!-- 名称节点 -->
							<span class="el-tree-node__label"
							      v-if="item.id===0"
							      :key="item.key"
								  :title="data[item.key]"
							      :style="{'width':labelWidth}">{{data[item.key]}}</span>
							<!-- 功能节点 -->
							<span v-if="item.id===1"
							      :key="item.key"
							      class="item btn"
							      :style="{'width':item.width,'left':leftArr[index]}">
								<span class="btn-inner">
									<i v-if="item.add(data)"
									   class="el-icon-circle-plus-outline fn-blue"
									   title="本节点下新增"
									   @click="clickAdd(data,node)"></i>
									<i v-if="item.edit(data)"
									   class="el-icon-edit fn-blue"
									   title="编辑"
									   @click="clickEdit(data,node)"></i>
									<i v-if="item.delete(data)"
									   class="el-icon-delete fn-blue"
									   title="删除"
									   @click="clickDelete(data,node)"></i>
								</span>
							</span>
							<!-- 一般文字节点 -->
							<span v-if="item.id===2"
							      class="item"
							      :key="item.key"
							      :title="data[item.key]"
							      :style="{'width':item.width,'left':leftArr[index]}">{{data[item.key] | stringFilter(item.format)}}</span>
							<!-- 对号图标节点 -->
							<span v-if="item.id===3"
							      class="item"
							      :key="item.key"
							      :style="{'width':item.width,'left':leftArr[index]}">
								<i :class="{'el-icon-check':data[item.key]}"></i>
								<!-- <i :class="{'el-icon-check':data[item.key],'el-icon-close':!data[item.key]}"></i> -->
							</span>
							<!-- 时间节点 -->
							<span v-if="item.id===4"
							      class="item"
							      :key="item.key"
							      :title="data[item.key] | dateFilter(item.format)"
							      :style="{'width':item.width,'left':leftArr[index]}">{{data[item.key] | dateFilter(item.format)}}</span>
						</template>

					</span>
				</el-tree>
			</el-scrollbar>
		</div>

	</div>
</template>

<script>
import { mapGetters } from "vuex";
let _this
export default {
	data() {
		_this = this
		return {
			checkAll: false,
			expandedKeys: [], // 刷新后默认展开的节点id数组
			// 第一列label的宽度
			labelWidth: null,
			//每一列left数值数组
			leftArr: [],
			allIdArr: []
		}
	},
	props: {
		props: {
			type: Object,
			defaulte: () => {
				return {
					children: 'children',
					label: 'label',
					pId: 'pId'
				}
			}
		},
		expandAll: {
			type: Boolean,
			defaulte: () => {
				return false
			}
		},
		treeHeight: {
			type: Number,
			defaulte: () => {
				return 500
			}
		},
		draggable: {
			type: Boolean,
			defaulte: () => {
				return false
			}
		},
		isShowCheckbox: {
			type: Boolean,
			defaulte: () => {
				return false
			}
		},
		filterText: {
			type: String,
			defaulte: () => {
				return ""
			}
		},
		defaultCheckedKeys: {
			type: Array,
			defaulte: () => {
				return []
			}
		},
		/* 参考数据
		headerData: [
			{
				id: 0,
				key: "label",
				label: "组织名称",
				width: "30%",
				align: "center",
				bodyAlign: "center"
			},
			{
				id: 1,
				key: "btn",
				label: "新增/编辑/删除",
				width: "10%",
				align: "center",
				bodyAlign: "center",
				add: (data) => {
					return true
				},
				edit: (data) => {
					return true
				},
				delete: (data) => {
					if (data.children) {
						return false
					} else {
						return true
					}
				}
			},
			{
				id: 3,
				key: "isTenantMenu",
				label: "是否租户菜单",
				width: "10%",
				align: "center",
				bodyAlign: "center"
			},
			{
				id: 2,
				key: "url",
				label: "URL",
				width: "20%",
				align: "center",
				bodyAlign: "center"
			},
			{
				id: 2,
				key: "icon",
				label: "图标",
				width: "10%",
				align: "center",
				bodyAlign: "center"
			},
			{
				id: 2,
				key: "time",
				label: "修改时间",
				width: "15%",
				align: "center",
				bodyAlign: "center"
			},
			{
				id: 3,
				key: "state",
				label: "状态",
				width: "5%",
				align: "center",
				bodyAlign: "center"
			}
		], */
		headerData: {
			type: Array,
			defaulte: () => {
				return []
			}
		},
		bodyData: {
			type: Array,
			defaulte: () => {
				return []
			}
		},
		bodyLayout: {
			type: Object,
			defaulte: () => {
				return {}
			}
		}
	},
	methods: {
		// 过滤树形节点
		filterNode(value, data) {
			if (!value) return true;
			return data[this.props.label].indexOf(value) !== -1;
		},
		// 展开、折叠树形控件
		closeOrOpenTree(isOpen) {
			let node = this.$refs.tree.store._getAllNodes();
			for (var i = 0; i < node.length; i++) {
				node[i].expanded = isOpen;
			}
		},
		nodeExpand(data) {
			if (this.expandedKeys.indexOf(data.id) === -1) this.expandedKeys.push(data.id);
		},
		clickAdd(data, node) {
			this.$emit("clickAdd", data, node);
		},
		clickEdit(data, node) {
			this.$emit("clickEdit", data, node);
		},
		clickDelete(data, node) {
			this.$emit("clickDelete", data, node);
		},
		// 拖拽的事件完成
		handleDrop(draggingNode, inNode, dropType, ev) {
			this.$emit("handleDrop", draggingNode, inNode, dropType, ev)
		},
		allowDrop(draggingNode, dropNode, type) {
			return type;
		},
		allowDrag(draggingNode) {
			// return draggingNode.data[this.props.label].indexOf('三级 3-2-2') === -1;
			return true
		},
		// 获取当前选中节点数据
		getCheckedData() {
			const data = {
				nodes: this.$refs.tree.getCheckedNodes(),
				IDArr: this.$refs.tree.getCheckedKeys()
				// 以下代码是返回勾选和半勾选id数组
				/* IDArr: [
					...this.$refs.tree.getCheckedKeys(),
					...this.$refs.tree.getHalfCheckedKeys()
				] */
			}
			return data
		},
		// 点击全选
		clickAll(isAll) {
			if (isAll) {
				this.$refs.tree.setCheckedKeys(this.allIdArr)
			} else {
				this.$refs.tree.setCheckedKeys([])
			}
			const nodes = this.$refs.tree.getCheckedNodes();
			this.$emit("check", [], { "checkedNodes": nodes })
		},
		// 点击复选框
		check(checkedNode, checkedNodes) {
			this.$emit("check", checkedNode, checkedNodes)
		}
	},
	computed: {
		...mapGetters(["windowH"])
	},
	watch: {
		filterText(newVal) {
			this.$refs.tree.filter(newVal);
		},
		headerData: {
			immediate: true,
			handler: function (val) {
				if (!val) return;
				this.leftArr = [0];
				let left = 0;
				val.map((item, index) => {
					// console.log(item.width, parseInt(item.width));
					if (index === 0) {
						this.labelWidth = (parseInt(item.width) - 5) + "%";
					}
					left += parseInt(item.width);
					this.leftArr.push(left + "%")
				})
			}
		},
		bodyData: {
			immediate: true,
			handler: function (val) {
				if (val.length === 0 && !this.isShowCheckbox) return;
				this.allIdArr = this.$treeFn.findAllId(val)
			}
		},
		checkAll(val) {
			this.clickAll(val);
		}
	},
	filters: {
		dateFilter: function (val, formatTxt) {
			// console.log(formatTxt,"格式");
			if (typeof formatTxt !== "string") {
				formatTxt = "yyyy-MM-dd hh:mm:ss"
			}
			return _this.$date.format(val, formatTxt)
		},
		stringFilter: function (val, formatArr) {
			if (Array.isArray(formatArr)) {
				// console.log(formatArr,"格式化");
				let obj = null;
				formatArr.some((item) => {
					// eslint-disable-next-line eqeqeq
					if (item.id == val) {
						obj = item;
						return true
					}
				})
				if (obj === null) {
					return val
				}
				if (obj.label) {
					return obj.label
				} else if (obj.name) {
					return obj.name
				} else if (obj.title) {
					return obj.title
				} else {
					return val
				}
			}
			return val
		}
	}

}
</script>

<style lang="stylus" scoped>
$height = 30px
.tree-wrap
	>>>.el-tree-node__content
		border-left 1px solid #e8e3e3
		border-right 1px solid #e8e3e3
		border-bottom 1px solid #e8e3e3
		// &:last-child
		// border-bottom none
	.tree-header
		position relative
		height $height
		border 1px solid #e8e3e3
		background-color #f2f2f2
		li
			box-size border-box
			position absolute
			top 0
			height $height
			line-height $height
			border-left 1px solid #e8e3e3
		.checkAll
			top 0
			left 23px
			z-index 2
			border none
	.tree-inner
		overflow auto
	>>>.tree-node
		display inline-block
		width 100%
		span
			display inline-block
			height $height
			line-height $height
			text-align center
			white-space nowrap
			text-overflow ellipsis
			overflow hidden
			&:first-child
				text-align left
		.item
			position absolute
			top 0
			border-left 1px solid #f2f2f2
		.btn
			font-size 18px
			.btn-inner
				display inline-block
				width 100px
				text-align left
			i
				padding 0 5px
				&:hover
					color #0080ff
</style>
