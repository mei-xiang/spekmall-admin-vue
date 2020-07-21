<!--
 * @Description: 数据字典
 -->

<template>
	<div class="data two-column content">
		<div class="item left">
			<LeftTree ref="leftTree"
					  headerTitle="数据类型"
					  @choiceData="leftChoiceData">
			</LeftTree>
		</div>
		
		<div class="item right">
			<div class="setup-box clearfix">
				<div class="form-box fl">
					<el-form :model="searchData"
							 size="mini"
							 :inline="true">
						<el-form-item label="名称：">
							<el-input v-model.trim="searchData.text"
									  maxlength="20"></el-input>
						</el-form-item>
						<el-form-item label="值：">
							<el-input v-model.trim="searchData.value"
									  maxlength="20"></el-input>
						</el-form-item>
						<el-form-item label="">
							<el-button type="common"
									   icon="el-icon-search"
									   @click="search">查询</el-button>
							<el-button icon="el-icon-refresh"  
                     v-if="$isPermission($route.path)"
									   @click="resetSearch">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="btn-box fr">
					<btn-list :btnListData="btnListData"
							  @addBtn="addBtn"
							  @editBtn="editBtn"
							  @delBtn="delBtn">
					</btn-list>
				</div>
			</div>

			<Main-table :height="tableMaxH"
						:hasIndex="true"
						:hasSelection="true"
						:theaderData="theaderData"
						:tbodyData="tbodyData"
						@commitSelection="clickChoicedData">
			</Main-table>
			<!-- 分页 -->
			<main-pagination :current-page="currentPage"
							 :page-size="pageSize"
							 :total="total"
							 :time="time"
							 @currentChange="currentChange"
							 @sizeChange="sizeChange">
			</main-pagination>
		</div>

		<!--右侧 新增，修改弹框 -->
		<el-dialog :title="isAddType?'新增':'修改'"
				   v-dialogDrag
				   @close="close"
				   :visible.sync="isShowAddOrEdit">
			<main-form ref="addOrEditForm"
					   :data="addOrEditData"
					   :form="formConfig"
					   :rules="addOrEditRules"></main-form>
			<div slot="footer">
				<el-button type="primary"
						   size="small"
						   @click="submit(isAddType)">确 定</el-button>
				<el-button size="small"
						   @click="closeAddOrEdit">取 消</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script type="text/ecmascript-6">
import LeftTree from './component/DataLeftTree';
import MainPagination from "@/components/MainPagination";
export default {
	name: "systemDict",
	// eslint-disable-next-line no-undef
	mixins: [setLayoutHeight],
	data() {
		return {
			// 右侧数据
			searchData: {
				text: null,
				value: null
			},
			searchParam: {},
			noSingle: true,
			noMore: true,
			// 按钮列表部分
			btnListData: [
				{
					label: "新增",
					icon: "el-icon-circle-plus-outline",
					disabled: () => { return this.leftChoiced === null },
					fn: "addBtn",
					permission: 'systemDict'
				},
				{
					label: "修改",
					icon: "el-icon-edit",
					disabled: () => { return this.noSingle },
					fn: "editBtn",
					permission: 'systemDict'
				},
				{
					label: "删除",
					icon: "el-icon-delete",
					disabled: () => { return this.noSingle && this.noMore },
					fn: "delBtn",
					permission: 'systemDict'
				}
			],
			tableMaxH: 500,
			theaderData: [
				{
					type: 0,
					width: '120px',
					hasSort: false,
					isShow: true,
					prop: 'text',
					label: '中文名称'
				},
				{
					type: 0,
					width: '120px',
					hasSort: false,
					isShow: true,
					prop: 'textEn',
					label: '英文名称'
				},
				{
					type: 0,
					width: '120px',
					hasSort: false,
					isShow: true,
					prop: 'value',
					label: '值'
				},
				{
					type: 0,
					width: '80px',
					hasSort: false,
					isShow: true,
					prop: 'orderNo',
					label: '排序'
				},
				/* {
					type: 4,
					width: '100px',
					hasSort: false,
					isShow: true,
					prop: 'isDefault',
					label: '是否默认值',
					option: ["是", "否"]
				}, */
				{
					type: 0,
					width: 'none',
					hasSort: false,
					isShow: true,
					prop: 'description',
					label: '描述'
				},
				{
					type: 4,
					width: '100px',
					hasSort: false,
					isShow: true,
					prop: 'isEnable',
					label: '启用状态'
				},
				{
					type: 8,
					width: '180px',
					hasSort: false,
					isShow: true,
					prop: 'updateDate',
					label: '最后修改时间'
				}
			],
			tbodyData: [],
			// 选择左侧复选框选中的数据
			leftChoiced: null,
			// 右侧选择数据
			choicedData: [],
			// 弹框相关
			isShowAddOrEdit: false,
			isAddType: true,
			labelWidth: "120px",
			addOrEditData: {
				pId: '',
				pName: "根节点",
				text: "",
				value: "",
				textEn: "",
				description: "",
				orderNo: "",
				isDefault: true,
				isEnable: true
			},
			formConfig: [
				[{
					span: 24,
					labelWidth: "140px",
					list: [
						{
							type: "readOnly",
							label: "数据类型：",
							prop: "pName"
						},
						{
							type: "text",
							label: "中文名称：",
							prop: "text"
						},
						{
							type: "text",
							label: "英文名称：",
							prop: "textEn"
						},
						{
							type: "text",
							label: "值：",
							prop: "value"
						},
						{
							type: "number",
							label: "排序：",
							prop: "orderNo"
						},
						{
							type: "textarea",
							label: "描述：",
              prop: "description",
              // hidden: true
						},
						{
							type: "switch",
							label: "是否启用：",
							prop: "isEnable"
						}
					]
				}]
			],
			addOrEditRules: {
				text: [
					this.$rules.setRequired("请输入中文名称"),
					this.$rules.setLength(1, 18)
				],
				value: [
					this.$rules.setRequired("请输入值"),
					// this.$rules.setCode(1, 20)
				]
			},
			// 分页相关
			currentPage: 1,
			pageSize: 20,
			total: 0,
			time: 0
		};
	},
	components: { LeftTree, MainPagination },
	methods: {
		// 左侧部分
		leftChoiceData(data) {
			this.leftChoiced = data;
			this.currentPage = 1;
			this.getList();
		},
		// 右侧部分
		search() {
      this.$search();
      
		},
		resetSearch() {
			this.$resetSearch();
		},
		clickChoicedData(Arr) {
			this.choicedData = Arr;
			if (Arr.length === 0) {
				this.noSingle = true;
				this.noMore = true;
			} else if (Arr.length === 1) {
				this.noSingle = false;
				this.noMore = true;
			} else {
				this.noSingle = true;
				this.noMore = false;
			}
		},
		// 新增
		addBtn() {
			let { id, name } = this.leftChoiced;
			this.addOrEditData.pId = id;
			this.addOrEditData.pName = name;
			this.isShowAddOrEdit = true;
			this.isAddType = true;
		},
		// 修改
		editBtn() {
			this.isShowAddOrEdit = true;
			this.isAddType = false;
			this.axios.get(`/dictionary/detail/${this.choicedData[0].id}`).then((res) => {
				let { id, name } = this.leftChoiced;
				this.addOrEditData = {
					id: res.data.id,
					pId: id,
					pName: name,
					text: res.data.text,
					value: res.data.value,
					textEn: res.data.textEn,
					description: res.data.description,
					orderNo: res.data.orderNo,
					isDefault: res.data.isDefault,
					isEnable: res.data.isEnable
				}
			});
		},
		submit(isAddType) {
			this.$refs.addOrEditForm.validate((data) => {
				let fn = "post";
				let url = "/dictionary/detail";
				if (!isAddType) {
					fn = "put";
					url = `/dictionary/detail/${data.id}`;
        }
				this.axios[fn](url, data).then((res) => {
					this.$message.success("新增成功");
					this.closeAddOrEdit();
					this.getList();
				});
			})
		},
		// 删除
		delBtn() {
			this.$delBtn(() => {
				let ids = '';
				this.choicedData.forEach(val => {
					ids += `${val.id},`
				})
				ids = ids.substr(0, ids.length - 1);
				this.axios.del(`/dictionary/detail/${ids}`).then((res) => {
					this.$message.success("删除成功");
					this.getList();
				});
			}, "确定删除选中的数据？")
		},
		closeAddOrEdit() {
			this.isShowAddOrEdit = false;
		},
		currentChange(val) {
			this.currentPage = val;
			this.getList();
		},
		sizeChange(val) {
			this.currentPage = 1;
			this.pageSize = val;
			this.getList();
		},
		// 获取列表
		getList() {
			this.searchParam.page = this.currentPage;
			this.searchParam.size = this.pageSize;
      this.searchParam.pId = this.leftChoiced.id;
			this.axios.get("/dictionary/detail/page", this.searchParam).then((res) => {
				let data = res.data.content;
				data.sort((a, b) => {
					return a.orderNo - b.orderNo
				})
				this.tbodyData = data;
				this.$handlerList(res);
			});
		},
		close() {
			// 关闭弹框初始化数据
			this.addOrEditData = this.$options.data.call(this).addOrEditData;
			this.$refs.addOrEditForm.clearValidate();
		}
	}
};
</script>
