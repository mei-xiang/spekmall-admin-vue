<!--
 * @Description: 文件上传弹窗组件
 * @Author: jiaxin
 * @Date: 2019-05-22 14:12:35
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-12-17 13:58:17
 -->
<template>
	<el-dialog title="文件上传"
	           v-dialogDrag
	           :modal-append-to-body='false'
	           :before-close="beforeClose"
	           @close="closeDialog"
	           :visible="isShow">
		<el-form ref="uploadForm"
		         size="mini">
			<el-form-item label="文件："
			              :label-width="labelWidth">
				<el-upload class="upload-box"
				           ref="uploadFilesList"
				           drag
				           action=""
				           :limit="6"
				           :on-change="onChangeList"
				           :http-request="submitFilesList"
				           :beforeUpload="beforeAvatarUpload"
				           :auto-upload="false"
				           multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
					<div slot="tip"
					     class="el-upload__tip">上传文件大小不超过20Mb</div>
				</el-upload>
			</el-form-item>
			<!-- <el-form-item label="备注："
			              :label-width="labelWidth">
				<el-input type="textarea"
				          v-model.trim="uploadRemark"
				          :maxlength="200"></el-input>
			</el-form-item> -->

		</el-form>
		<div slot="footer">
			<el-button type="primary"
			           size="small"
			           @click="addSubmitEnclosure">上 传</el-button>
			<el-button size="small"
			           @click="close">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			labelWidth: "105px",
			isShowCopy: false,
			uploadRemark: ""
		}
	},
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		encrypt: {
			type: String
		}
	},
	methods: {
		beforeClose(done) {
			this.$emit("update:isShow", false);
			done();
		},
		close() {
			this.$emit("update:isShow", false);
		},
		closeDialog() {
			this.$refs.uploadFilesList.clearFiles();
			this.uploadRemark = "";
		},
		addSubmitEnclosure() {
			this.$refs.uploadFilesList.submit();
		},
		// 文件状态改变时获取文件列表
		onChangeList(file, fileList) {
			this.uploadFileList = fileList;
		},
		// 上传前验证文件格式和大小
		beforeAvatarUpload(file) {
			return this.$file.validator(file, null, 20);
		},
		submitFilesList(data) {
			const fileArr = this.uploadFileList.map((item) => {
				return item.raw
			});
			this.axios.upload(fileArr).then(res => {
				this.$emit("success", res.data);
				this.close();
				this.$message.success(res.message);
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.upload-box
	>>>.el-upload-dragger
		width 273px
</style>
