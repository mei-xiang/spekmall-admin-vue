<!--
 * @Description: 左侧菜单树(分类部分)
 * @Author: jiaxin
 * @Date: 2018-11-19 09:31:14
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-08-22 16:38:30
 -->
<template>
	<div class="leftTree">
		<div class="header">
			<div class="title ellipsis"
				 :style="{'background':theme}">
				{{headerTitle}}：{{chioceTypeLabel}}
				<i v-if="$isPermission('clsManAddCode')"
				   class="el-icon-circle-plus-outline"
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
						 :data="treeData"
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
						<span class="label ellipsis">{{ data[defaultProps.label]}}</span>
						<!-- <el-tooltip :content="data[defaultProps.label]"
									:open-delay="500"
									placement="top">
						</el-tooltip> -->
						<span class="btn">
							<i class="el-icon-circle-plus-outline fn-green"
							   title="本节点下新增"
							   v-if="$isPermission('clsManAddCode')"
							   @click="clickAdd(data, node)"></i>
							<i class="el-icon-edit fn-yellow"
							   title="修改"
							   v-if="$isPermission('clsManEditCode')"
							   @click="clickEdit(data, node)"></i>
							<i v-if="!data[defaultProps.children] && $isPermission('clsManDelCode')"
							   class="el-icon-delete fn-red"
							   title="删除"
							   @click="clickDelete(data, node)"></i>
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
			<main-form ref="formRules"
					   :rules="rules"
					   :data="addOrEditData"
					   :form="formConfig"
					   @classChange="classChange"></main-form>
			<div slot="footer">
				<el-button type="primary"
						   size="small"
						   @click="submit(isAddType)">确 定</el-button>
				<el-button @click="closeAddOrEdit"
						   size="small">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	data() {
		return {
			filterText: '',
			defaultProps: {
				children: 'subCategory',
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
				pId: null,
				pName: null,
				id: null,
				name: null,
				code: null,
				remark: null
			},
			formConfig: [],
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
		classType: {
			type: Number,
			default: () => {
				return 1
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
		...mapActions(["GET_CLASS"]),
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
		switchClass(val) {
			this.GET_CLASS(val)
		},
		// 配置表单
		setFormConfig(classType, disabledId) {
			this.formConfig = [
				[
					{
						span: 24,
						labelWidth: "80px",
						list: [
							{
								type: "class",
								label: "父节点：",
								isShowRoot: true,
								prop: "pId",
								classType: classType,
								disabledId: disabledId
							},
							{
								type: "text",
								label: "编码：",
								prop: "code"
							},
							{
								type: "text",
								label: "名称：",
								prop: "name"
							},
							{
								type: "textarea",
								label: "描述：",
								prop: "remark"
							}
						]
					}
				]
			]
		},
		// 新增部分 ------------------------------
		// 展开选择树
		openChoiceTree() {
			this.$refs.choiceTree.showTree();
		},
		// 选择节点
		classChange(node) {
			this.addOrEditData.pName = node[0].label;
		},
		addRootNode() {
			this.setFormConfig(this.classType);
			this.isAddType = true;
			this.showAddOrEditDialog = true;
			this.addOrEditData.pId = this.classType;
			this.addOrEditData.pName = '根节点';
		},
		clickAdd(data, node) {
			this.setFormConfig(this.classType);
			this.isAddType = true;
			this.showAddOrEditDialog = true;
			this.addOrEditData.pId = data.id;
			this.addOrEditData.pName = data.name;
		},
		submit(isAddType) {
			this.$refs["formRules"].validate((data) => {
				let fn = null;
				if (isAddType) {
					fn = "put";
				} else {
					fn = "post";
				}
				this.axios[fn](`/api/common-service/category`, data).then((res) => {
					this.$message({
						message: res.message,
						type: 'success'
					})
					this.switchClass(this.classType);
					this.closeAddOrEdit();
				});
			});
		},
		// 修改部分 -----------------------------
		clickEdit(data, node) {
			this.axios.get(`/api/common-service/category/${data.id}`).then((res) => {
				const resData = res.data;
				this.setFormConfig(this.classType, data.id);
				this.addOrEditData = {
					pId: resData.pId,
					pName: resData.pIdName,
					id: data.id,
					name: resData.name,
					code: resData.code,
					remark: resData.remark
				};
				this.isAddType = false;
				this.showAddOrEditDialog = true;
			});
		},
		// 点击删除删除
		clickDelete(data, node) {
			this.$delBtn(() => {
				this.axios.del(`/api/common-service/category/${data.id}`, {
					id: data.id
				}).then((res) => {
					// eslint-disable-next-line eqeqeq
					if (res.statusCode == 200) {
						this.$message({
							message: res.message,
							type: 'success'
						})
						this.switchClass(this.classType);
					}
				});
			})
		},
		closeDialog() {
			// 关闭弹框初始化数据
			this.addOrEditData = this.$options.data.call(this).addOrEditData;
			this.$refs.formRules.clearValidate();
		},
		// 关闭dialog
		closeAddOrEdit() {
			this.showAddOrEditDialog = false;
		}
	},
	mounted() {
		this.switchClass(this.classType);
	},
	computed: {
		...mapGetters(["classObj", "theme"]),
		treeData: function () {
			this.$nextTick(() => {
				this.$refs.tree.filter(this.filterText);
			})
			return this.$clone(this.classObj[this.classType]);
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
