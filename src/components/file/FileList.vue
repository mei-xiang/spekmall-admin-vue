<!--
 * @Description: 附件工具栏 + 列表 + 新增弹窗
 * @Author: jiaxin
 * @Date: 2019-06-26 10:23:59
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-02 15:29:31
 -->
<template>
	<div>
		<div v-if="isEdit"
			 class="setup-box clearfix">
			<div class="btn-box"
				 :class="{'fl':!rightBtn, 'fr':rightBtn}">
				<btn-list :btnListData="btnListData"
						  @addBtn="addBtn"
						  @delBtn="delBtn(choicedData)">
				</btn-list>
			</div>
		</div>
		<Main-table :maxHeight="contentH"
					:hasIndex="true"
					:hasSelection="isEdit"
					:theaderData="theaderData"
					:tbodyData="tbodyDataCopy"
					@commitSelection="clickChoicedData">
		</Main-table>
		<!-- 新增 文件上传弹框 -->
		<fileUpload-dialog :isShow.sync="isShowUpload"
						   :encrypt="encrypt"
						   @success="getFileList"></fileUpload-dialog>
	</div>
</template>

<script type="text/ecmascript-6">
import MainTable from "@/components/MainTable";
import BtnList from "@/components/BtnList";
import FileUploadDialog from "@/components/dialog/FileUploadDialog";
export default {
	data() {
		return {
			labelWidth: "140px",
			isShowUpload: false,
			choicedData: [],
			btnListData: [
				{
					label: "新增",
					icon: "el-icon-circle-plus-outline",
					disabled: () => { return false },
					fn: "addBtn"
				},
				{
					label: "删除",
					icon: "el-icon-delete",
					disabled: () => { return this.choicedData.length === 0 },
					fn: "delBtn"
				}
			],
			tbodyDataCopy: []

		}
	},
	props: {
		encrypt: {
			type: String,
			default: ""
		},
		contentH: {
			type: Number,
			default: 1500
		},
		isEdit: {
			type: Boolean,
			default: true
		},
		rightBtn: {
			type: Boolean,
			default: true
		},
		tbodyData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	components: {
		MainTable,
		BtnList,
		FileUploadDialog
	},
	methods: {
		init(data) {
			this.clearList();
			this.getFileList();
		},
		// 附件相关 -------------------------------------
		clickChoicedData(Arr) {
			this.choicedData = Arr;
		},
		addBtn() {
			this.isShowUpload = true;
		},
		// 刷新文件列表
		getFileList() {
			if (this.encrypt.length === 0) return;
			this.$file.getList(this.encrypt).then((data) => {
				this.tbodyDataCopy = data;
			})
		},
		// 删除文件
		delBtn(data) {
			this.$delBtn(() => {
				const codesArr = this.$array.returnArrayByKey(data, "code");
				this.$file.delete(codesArr, this.encrypt).then((res) => {
					this.getFileList();
				})
			})
		},
		clearList() {
			this.choicedData = [];
			this.tbodyDataCopy = [];
		}

	},
	computed: {
		theaderData() {
			return this.$store.state.fileListTheaderData
		}
	},
	watch: {
		tbodyData: {
			immediate: true,
			handler: function (val) {
				this.tbodyDataCopy = val
			}
		}
	}

}
</script>
