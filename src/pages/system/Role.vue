<!--
 * @Description: 角色设置
 -->

<template>
	<div>
		<main-page ref="mainPage"
				   :height="tableMaxH"
				   :hasSelection="false"
				   @clickBtn="clickBtn"
				   @buttonClick="buttonClick"></main-page>

		<!-- 新增，修改弹框 -->
		<el-dialog :title="isAddType?'新增':'修改'"
				   v-dialogDrag
				   @close="closeDialog"
				   :visible.sync="isShowAddOrEdit">
			<main-form ref="mainForm"
					   :data="postData"
					   :form="formConfig"
					   :rules="rule"></main-form>
			<div class="tree-wrap">
				<ul class="clearfix">
					<li class="fl">菜单名称</li>
					<li class="fr">是否可编辑</li>
				</ul>

				<el-scrollbar style="height:100%">
					<el-tree ref="tree"
							 :data="treeData"
							 show-checkbox
							 node-key="id"
							 default-expand-all
							 @check-change="checkNode"
							 :expand-on-click-node="false">
						<span class="custom-tree-node"
							  slot-scope="{ node, data }">
							<span>{{ data.menuName }}</span>
							<span v-if="data.isPage">
								<el-switch v-model="data.isEditor"></el-switch>
							</span>
						</span>
					</el-tree>
				</el-scrollbar>

			</div>

			<div slot="footer">
				<el-button type="primary"
						   @click="submit(isAddType)">确 定</el-button>
				<el-button @click="closeAddOrEdit">取 消</el-button>
			</div>

		</el-dialog>

	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name: "Role",
	// eslint-disable-next-line no-undef
	mixins: [setLayoutHeight],
	data() {
		return {
			mainPageData: {
				ajaxData: {
					type: "get",
					url: "/api/sysRoles",
					params: null,
					records: 'data'
				},
				search: {
					mainConfigData: [
						{
							label: "角色名称",
							key: "nameZh",
							type: 0,
							width: 120
						}
					],
					searchData: {
						nameZh: ""
					}
				},
				btnListData: [
					{
						label: "新增",
						icon: "el-icon-circle-plus-outline",
						gridSelectModel: 2,
						fn: "addBtn",
						permission: 'role'
					}
				],
				theaderData: [
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'nameZh',
						label: '角色昵称'
					},
					{
						type: 1,
						width: 'none',
						hasSort: false,
						isShow: () => {
							return this.$isPermission("role")
						},
						btnList: [
							{
								label: "编辑",
								fn: "editBtn"
							},
							{
								label: "删除",
								fn: "delBtn"
							}
						],
						label: '操作'
					}
				]
			},
			postData: {
				id: null,
				nameZh: ""
			},
			pIds: [],
			// 弹框相关
			isShowAddOrEdit: false,
			isAddType: true,
			treeData: [],
			formConfig: [
				[
					{
						span: 24,
						labelWidth: "120px",
						list: [
							{
								type: "text",
								label: "角色昵称：",
								prop: "nameZh"
							}
						]
					}
				]
			],
			rule: {
				nameZh: [
					this.$rules.setRequired("请输入角色昵称"),
					this.$rules.setLength(1, 20)
				]
			}

		};
	},
	methods: {
		clickBtn(fn) {
			this[fn]();
		},
		async addBtn() {
			await this.getMenu();
			this.isShowAddOrEdit = true;
			this.isAddType = true;
			this.parseTree("set", []);
		},
		parseTree(type, idsArr) {
			const treeData = this.treeData;
			let result = [];
			const findNode = (arr, ids) => {
				if (!Array.isArray(arr)) return;
				arr.map((item) => {
					// 设置模式
					if (type === "set") {
						if (ids.indexOf(item.id) !== -1) {
							item.isEditor = true
						} else if (item.isPage) {
							item.isEditor = false
						}
					}
					// 获取数据模式
					if (type === "get") {
						if (item.isPage && item.isEditor && ids.indexOf(item.id) !== -1) {
							result.push(item.id)
						}
					}
					if (item.children && item.children.length !== 0) {
						findNode(item.children, ids);
					}
				})
			}
			findNode(treeData, idsArr);
			return result;
		},
		buttonClick(val, index, fn) {
			this[fn](val, index);
		},
		getMenu() {
			return new Promise((resolve, reject) => {
				this.axios.get("/api/sysmenus", {
					pageSize: 9999999,
					pageNum: 1,
					isEnable: true
				}).then((res) => {
					this.pIds = [];
					const arr = res.data.records.map((item) => {
						if (!this.$dataIsNull(item.menuUrl)) {
							item.isPage = true;
							item.isEditor = false;
						} else {
							this.pIds.push(item.id)
						}
						return item
					})
					this.treeData = this.$treeFn.toTree(arr, 0, {
						name: 'menuName',
						pId: 'parentId',
						pName: 'pName',
						children: "children",
						originNode: "根节点"
					})
					resolve()
				});
			})
		},
		checkNode(data, isChoiced) {
			if (data.isPage) data.isEditor = isChoiced
		},
		setPage() {
			this.$refs.mainPage.setPageConfig(this.mainPageData);
		},
		// 获取列表数据
		getList() {
			this.$refs.mainPage.getList()
		},
		// 右侧按钮列表部分 -------------------------
		async editBtn(data) {
			await this.getMenu();
			this.axios.get(`/api/sysRoles/rolemenu/${data.id}`).then((res) => {
				const resDate = res.data;
				this.postData = data;
				// 设置勾选项
				const checkedIds = resDate.viewMenuIds.filter((item) => {
					if (this.pIds.indexOf(item) === -1) return true
				})
				this.isAddType = false;
				this.isShowAddOrEdit = true;
				console.log(checkedIds);
				this.$nextTick(() => {
					this.$refs.tree.setCheckedKeys(checkedIds);
					this.$nextTick(() => {
						this.parseTree("set", resDate.editMenuIds);
					})
				})
			});
		},
		delBtn(data) {
			this.$delBtn(() => {
				this.axios.del(`/api/sysRoles/${data.id}`).then((res) => {
					this.$message.success(res.msg);
					this.closeAddOrEdit();
					this.getList();
				});
			})
		},
		// 提交保存数据
		submit(isAddType) {
			let fn = "post";
			let url = "/api/sysRoles/rolemenu";
			if (!isAddType) {
				fn = "put";
				url += `/${this.postData.id}`;
			};
			this.$refs["mainForm"].validate((data) => {
				const checkedIds = this.$refs.tree.getCheckedKeys();
				const halfChecked = this.$refs.tree.getHalfCheckedKeys();
				data.viewMenuIds = [...checkedIds, ...halfChecked];
				data.editMenuIds = this.parseTree("get", checkedIds);
				this.axios[fn](url, data).then((res) => {
					this.$message.success(res.msg);
					this.closeAddOrEdit();
					this.getList();
				});
			});
		},
		closeAddOrEdit() {
			this.isShowAddOrEdit = false;
		},
		closeDialog() {
			// 关闭弹框初始化数据
			this.postData = this.$options.data.call(this).postData;
			this.$nextTick(() => {
				this.$refs.mainForm.clearValidate();
			})
		}
	},
	mounted() {
		this.setPage();
	}
};
</script>

<style scoped lang="stylus">
.custom-tree-node
	flex 1
	display flex
	align-items center
	justify-content space-between
	font-size 14px
	padding-right 10px

.tree-wrap
	box-sizing border-box
	position relative
	padding 30px 0 0 35px
	height 350px

	ul
		box-sizing border-box
		position absolute
		top 0
		left 0
		width 100%
		padding-left 48px

	li
		height 30px
		line-height 30px
		font-size 12px
</style>
