<!--
 * @Description: 数据字典 - 左侧菜单树
 -->
<template>
	<div class="leftTree">
		<div class="header">
			<div class="title ellipsis">
				{{headerTitle}}：{{chioceTypeLabel}}
				<i class="el-icon-circle-plus-outline"
				   title="新增一级节点"
				   @click="addRootNode"></i>
			</div>
			<el-input placeholder="输入关键字"
					  size="small"
					  v-model="filterText">
			</el-input>
		</div>
		<div class="body">
			<el-scrollbar style="height:100%">
				<el-tree class="filter-tree"
						 :data="bodyData"
						 :props="defaultProps"
						 node-key="id"
						 :default-expanded-keys="expandedKeys"
						 :expand-on-click-node="false"
						 :filter-node-method="filterNode"
						 @node-click="clickNode"
						 @node-expand="nodeExpand"
						 @node-collapse="nodeCollapse"
						 ref="tree">
					<span class="node-wrap"
						  slot-scope="{ node, data }">
						<el-tooltip :content="data[defaultProps.label]"
									:open-delay="500"
									placement="top">
							<span class="label ellipsis">{{ data[defaultProps.label]}}</span>
						</el-tooltip>
						<span class="btn"
							  v-if="$isPermission('category')">
							<i class="el-icon-circle-plus-outline fn-green"
							   title="本节点下新增"
							   @click.stop="clickAdd(data, node)"></i>
							<i class="el-icon-edit fn-yellow"
							   title="修改"
							   @click.stop="clickEdit(data, node)"></i>
							<i class="el-icon-delete fn-red"
							   title="删除"
							   @click.stop="clickDelete(data, node)"></i>
						</span>
					</span>
				</el-tree>

			</el-scrollbar>
		</div>
		<!-- 新增、修改弹框 -->
		<el-dialog :title="isAddType?'新增':'修改'"
				   v-dialogDrag
				   @close="closeDialog"
				   :visible.sync="showAddOrEditDialog">
			<main-form ref="mainForm"
					   :data="addOrEditData"
					   :form="formConfig"
					   :rules="rules"></main-form>
			<div slot="footer">
				<el-button type="primary"
						   @click="submit(isAddType)">确 定</el-button>
				<el-button @click="closeAddOrEdit">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			filterText: '',
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			expandedKeys: [], // 刷新后默认展开的节点id数组
			chioceTypeLabel: "",
			bodyData: [],
			choiceTreeData: [],
			// 新增 编辑 弹窗部分 --------------
			showAddOrEditDialog: false,
			isAddType: true,
			// 新增修改 数据
			addOrEditData: {
				pId: '',
				pName: '',
				name: '',
				code: '',
				remark: '',
				isEnable: true,
				id: ''
			},
			formConfig: [
				[{
					span: 24,
					labelWidth: "140px",
					list: [
						{
							type: "readOnly",
							label: "父节点：",
							prop: "pName"
						},
						{
							type: "text",
							label: "节点名称：",
							prop: "name"
						},
						{
							type: "text",
							label: "编码：",
							prop: "code"
						},
						{
							type: "textarea",
							label: "描述：",
							prop: "remark"
						}
					]
				}]
			],
			// 验证规则部分
			rules: {
				name: [
					this.$rules.setRequired("请输入名称"),
					this.$rules.setLength(1, 20)
				],
				code: [
					this.$rules.setRequired("请输入编码"),
					this.$rules.setCode(1, 40)
				],
				remark: [
					this.$rules.setRequired("请输入描述"),
					this.$rules.setLength(1, 20)
				]
			}
		};
	},
	props: {
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
			return data[this.defaultProps.label].indexOf(value) !== -1;
		},
		clickNode(data) {
			if (data.notChoice) return;
			this.chioceTypeLabel = data[this.defaultProps.label];
			this.$emit("choiceData", data);
		},
		nodeExpand(data) {
			if (this.expandedKeys.indexOf(data.id) === -1) this.expandedKeys.push(data.id);
		},
		nodeCollapse(data) {
			const index = this.expandedKeys.indexOf(data.id);
			if (index !== -1) this.expandedKeys.splice(index, 1);
		},
		refresh() {
			this.axios.get(`/api/dictionarys`, {
				pageNum: 1,
				pageSize: 99999
			}).then((res) => {
				let resData = res.data.records;
				this.bodyData = this.$treeFn.toTree(resData, 0, {
					name: 'name',
					pId: 'pId',
					pName: 'pName',
					children: "children",
					originNode: "根节点"
				})
				this.$nextTick(() => {
					this.$refs.tree.filter(this.filterText);
				})
			});
		},
		// 新增部分 -----------------------------
		// 展开选择树
		openChoiceTree() {
			this.$refs.choiceTree.showTree();
		},
		// 选择节点
		choicedNode(data) {
			this.addOrEditData.pId = data.id;
			this.addOrEditData.pName = data.name;
		},
		// 新增根节点
		addRootNode() {
			this.isAddType = true;
			this.showAddOrEditDialog = true;
			this.addOrEditData.pId = 0;
			this.addOrEditData.pName = '根节点';
		},
		// 新增子节点
		clickAdd(data, node) {
			this.isAddType = true;
			this.showAddOrEditDialog = true;
			this.addOrEditData.pId = data.id;
			this.addOrEditData.pName = data.pName;
		},
		// 修改部分 -----------------------------
		clickEdit(data, node) {
			this.axios.get(`/api/dictionarys/${data.id}`).then((res) => {
				const resData = res.data;
				this.addOrEditData = {
					pId: resData.pId,
					pName: data.pName,
					name: resData.name,
					code: resData.code,
					remark: resData.remark,
					isEnable: resData.isEnable,
					isSystem: resData.isSystem,
					id: resData.id
				};
				this.isAddType = false;
				this.showAddOrEditDialog = true;
			});
		},
		submit(isAddType) {
			this.$refs.mainForm.validate((data) => {
				let fn = "post";
				let url = "/api/dictionarys";
				if (!isAddType) {
					fn = "put";
					url = `/api/dictionarys/${data.id}`;
				}
				this.axios[fn](url, data).then((res) => {
					this.$message({
						message: res.message,
						type: 'success'
					})
					this.refresh();
					this.closeAddOrEdit();
				});
			})
		},
		// 点击删除删除
		clickDelete(data, node) {
			this.$delBtn(() => {
				this.axios.del(`/api/dictionarys/${data.id}`, {
					id: data.id
				}).then((res) => {
					this.$message({
						message: "删除成功",
						type: 'success'
					})
					this.refresh();
				});
			})
		},
		closeDialog() {
			// 关闭弹框初始化数据
			this.addOrEditData = this.$options.data.call(this).addOrEditData;
			this.$refs.mainForm.clearValidate();
		},
		// 关闭dialog
		closeAddOrEdit() {
			this.showAddOrEditDialog = false;
		}
	},
	created() {
		this.refresh();
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		}
	}

}
</script>

<style lang="stylus" scoped>
.leftTree
	position relative
	height 100%

	>>>.el-tree
		padding-bottom 10px

		.btn
			visibility hidden

		.el-tree-node__content:hover .btn
			visibility visible

		.el-tree-node>.el-tree-node__children
			overflow initial

	.header
		position absolute
		z-index 10
		width 100%
		background-color #fff

		.title
			padding 0 18px
			height 40px
			line-height 40px
			font-size 14px
			background-color #1e56a0
			color #fff

			i
				position absolute
				top 10px
				right 8px
				font-size 18px
				cursor pointer

			.close
				position absolute
				top 15px
				right 35px
				cursor pointer

		.input-wrap
			padding 5px 15px 0

	.body
		box-sizing border-box
		padding-top 73px
		height 100%
		overflow auto

		.label
			display inline-block
			max-width 140px

		>>>.btn
			padding-left 10px
			height 30px
			line-height 30px
			font-size 18px

			i
				&:hover
					color #0080ff

	>>>.el-scrollbar__wrap
		overflow-x auto

	.input-btn
		display flex
</style>
