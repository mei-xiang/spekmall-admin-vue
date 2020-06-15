<!--
 * @Description: 咨询管理
 -->

<template>
	<div>
		<main-page ref="mainPage"
				   :height="tableMaxH"
				   :hasSelection="false"
				   @buttonClick="buttonClick"
				   :options="options"></main-page>

		<!-- 新增，修改弹框 -->
		<el-dialog title="企业信息"
				   v-dialogDrag
				   @close="closeDialog"
				   custom-class="two-col-dialog"
				   :visible.sync="isShowDialog">
			<main-form ref="mainForm"
					   :data="postData"
					   :options="options"
					   :form="formConfig"></main-form>
		</el-dialog>

	</div>
</template>

<script type="text/ecmascript-6">
export default {
	name: "Consulting",
	// eslint-disable-next-line no-undef
	mixins: [setLayoutHeight],
	data() {
		return {
			mainPageData: {
				ajaxData: {
					type: "get",
					url: "/api/serviceConsults",
					params: null,
					records: 'data'
				},
				search: {
					mainConfigData: [
						{
							label: "手机号",
							key: "phone",
							type: 0,
							width: 120
						},
						{
							label: "公司名称",
							key: "companyName",
							type: 0,
							width: 120
						},
						{
							label: "状态",
							key: "isRead",
							type: 2,
							width: 120,
							selectOption: [
								{ id: true, label: '已读' },
								{ id: false, label: '未读' }
							]
						}
					],
					searchData: {
						phone: "",
						companyName: ""
					}
				},
				theaderData: [
					{
						type: 8,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'createTime',
						label: '咨询时间'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'companyName',
						label: '企业名称'
					},
					{
						type: 0,
						width: 80,
						hasSort: false,
						isShow: true,
						prop: 'isRead',
						label: '状态',
						format: [
							{ id: true, label: '已读' },
							{ id: false, label: '未读' }
						]
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'totalMember',
						label: '职工人数'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'address',
						label: '企业地址'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'contactor',
						label: '联系人姓名'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'phone',
						label: '联系手机'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'industry',
						label: '所属行业',
						optionCode: "INDUSTRY"
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'mainProduct',
						label: '主营产品'
					},
					{
						type: 0,
						width: 'none',
						hasSort: false,
						isShow: true,
						prop: 'companyNature',
						label: '企业性质',
						optionCode: "EPROP"
					},
					{
						type: 1,
						width: 'none',
						hasSort: false,
						isShow: true,
						btnList: [
							{
								label: "查看",
								fn: "detailBtn"
							}
						],
						label: '操作'
					}
				]
			},
			options: {},
			postData: {},
			// 弹框相关
			isShowDialog: false,
			formConfig: [
				[
					{
						span: 12,
						labelWidth: "140px",
						list: [
							{
								type: "readOnly",
								label: "企业名称：",
								prop: "companyName"
							}
						]
					},
					{
						span: 12,
						labelWidth: "120px",
						list: [
							{
								type: "readOnly",
								label: "职工人数：",
								prop: "totalMember"
							}
						]
					}
				],
				[
					{
						span: 24,
						labelWidth: "140px",
						list: [
							{
								type: "readOnly",
								label: "企业地址：",
								prop: "address"
							}
						]
					}
				],
				[
					{
						span: 12,
						labelWidth: "140px",
						list: [
							{
								type: "readOnly",
								label: "联系人姓名：",
								prop: "contactor"
							},
							{
								type: "readOnly",
								label: "所属行业：",
								prop: "industry",
								optionCode: "INDUSTRY"
							}
						]
					},
					{
						span: 12,
						labelWidth: "120px",
						list: [
							{
								type: "readOnly",
								label: "联系手机：",
								prop: "phone"
							},
							{
								type: "readOnly",
								label: "主营产品：",
								prop: "mainProduct"
							}
						]
					}
				],
				[
					{
						span: 24,
						labelWidth: "140px",
						list: [
							{
								type: "readOnly",
								label: "咨询内容：",
								prop: "content"
							}
						]
					}
				],
				[
					{
						span: 12,
						labelWidth: "140px",
						list: [
							{
								type: "readOnly",
								label: "企业性质：",
								prop: "companyNature",
								optionCode: "EPROP"
							},
							{
								type: "readOnly",
								label: "标识需求：",
								prop: "markDemand",
								optionCode: "INDENTYREQ"
							},
							{
								type: "readOnly",
								label: "标识载体：",
								prop: "markCarrier",
								optionCode: "INDENTY"
							},
							{
								type: "readOnly",
								label: "企业内部系统对接：",
								prop: "inSystem",
								optionCode: "EINSYS"
							},
							{
								type: "readOnly",
								label: "企业日均赋码量：",
								prop: "perCode",
								optionCode: "EPEDAY"
							}
						]
					},
					{
						span: 12,
						labelWidth: "120px",
						list: [
							{
								type: "readOnly",
								label: "咨询服务类型：",
								prop: "consultType",
								optionCode: "CONSERTYPE"
							},
							{
								type: "readOnly",
								label: "标识对象：",
								prop: "markObject",
								optionCode: "INDENTYOBJ"
							},
							{
								type: "readOnly",
								label: "应用环节：",
								prop: "applyPoint",
								optionCode: "APPNODE"
							},
							{
								type: "readOnly",
								label: "企业总赋码量：",
								prop: "totalCode",
								optionCode: "ETOTAL"
							}
						]
					}
				]
			]

		};
	},
	methods: {
		getOptions() {
			const codes = "INDUSTRY, EPROP, INDENTYREQ, INDENTY, EINSYS, EPEDAY, CONSERTYPE, INDENTYOBJ, APPNODE, ETOTAL";
			this.axios.get("/api/dictionary/detail/childs/" + codes)
				.then((res) => {
					let obj = {};
					res.data.map((item) => {
						obj[item.code] = item.details.map((subItem) => {
							return {
								id: subItem.value,
								label: subItem.text
							}
						})
					})
					this.options = obj;
				});
		},
		buttonClick(val, index) {
			this.axios.get(`/api/serviceConsults/${val.id}`).then((res) => {
				this.postData = res.data;
				this.isShowDialog = true;
			});
		},
		setPage() {
			this.$refs.mainPage.setPageConfig(this.mainPageData);
		},
		// 右侧按钮列表部分 -------------------------
		closeAddOrEdit() {
			this.isShowDialog = false;
		},
		// 获取列表数据
		getList() {
			this.$refs.mainPage.getList()
		},
		closeDialog() {
			// 关闭弹框初始化数据
			this.postData = this.$options.data.call(this).postData;
			this.getList();
		}
	},
	mounted() {
		this.setPage();
		this.getOptions()
	}
};
</script>
