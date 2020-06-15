<!--
 * @Description: 导入弹窗组件
 * @Author: jiaxin
 * @Date: 2019-05-22 14:12:35
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-05-22 15:28:14
 -->
<template>
	<el-dialog title="导入"
	           v-dialogDrag
	           :modal-append-to-body='false'
	           :visible.sync="isImportant">
		<slot name="header"></slot>
		<el-form ref="uploadForm"
		         size="mini">
			<el-form-item label=""
			              label-width="60px">
				<el-button type="text"
				           @click="downTemplate">模板下载</el-button>
			</el-form-item>
			<el-form-item label="上传文件："
			              prop="name"
			              size="small"
			              :label-width="labelWidth">
				<el-upload class="upload"
				           ref="upload"
				           :multiple="false"
				           :show-file-list="false"
				           action=""
				           :http-request="submitImport"
				           :beforeUpload="beforeSubmitImport">
					<el-button size="mini"
					           type="primary">点击上传</el-button>
					<div slot="tip"
					     class="el-upload__tip">只能上传<span class="fn-red">{{fileTypeArray.join("/")}}</span>文件，且不超过<span class="fn-red">{{fileMaxSize}}MB</span></div>
				</el-upload>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button size="small"
			           @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			isImportant: false,
			labelWidth: "130px",
		}
	},
	props: {
		// file 类型
		fileTypeArray: {
			type: [Array],
			default: () => {
				return ["xlsx"]
			}
		},
		fileMaxSize: {
			type: [Number],
			default: () => {
				return 10
			}
		},
	},
	methods: {
		open() {
			this.isImportant = true;
		},
		close() {
			this.isImportant = false;
		},
		// 下载模板回调
		downTemplate() {
			this.$emit("down")
		},
		// 上传验证
		beforeSubmitImport(file) {
			return this.$file.validator(file, this.fileTypeArray, this.fileMaxSize);
		},
		submitImport(data) {
			this.$emit("submit", data);
		},
	}
}
</script>

