<!--
 * @Description: 表单控件中的 表格选择组件
 * @Author: jiaxin
 * @Date: 2018-12-25 13:44:23
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-08-16 10:13:12
 -->

<template>
	<el-select v-model="value"
	           filterable
			   @change="change"
	           placeholder="请选择">
		<el-option v-for="item in option"
		           :key="item.value"
		           :label="item.label"
		           :value="item.value">
			<span style="float: left">{{ item.label }}</span>
			<span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
		</el-option>
	</el-select>
</template>

<script>
export default {
	data() {
		return {
			option: [],
			value: null
		}
	},
	props: {
		// 传入默认选中的 id
		choiceId: {
			type: Number,
			default: () => {
				return 0
			}
		}
	},
	methods: {
		getList() {
			let data = {
				pageNum: 1,
				pageSize: 99999,
				orderBy: null,
				categoryId: null,
				code: null,
				title: null
			};
			this.axios.get("/api/common-service/grid", data).then((res) => {
				// eslint-disable-next-line eqeqeq
				if (res.statusCode == 200) {
					// console.log(res.data);
					this.option = [];
					res.data.records.forEach(val => {
						this.option.push({
							value: val.id,
							label: val.title,
							code: val.code
						});
					});
				}
			});
		},
		change(val) {
			// 抛出修改变动后的数据
			this.$emit("update:choiceId", val);
			this.$emit("change", val);
		}
	},
	activated() {
		this.getList();
	},
	watch: {
		choiceId: {
			immediate: true,
			handler: function (val) {
				this.value = val;
			}
		}
	}
}
</script>
