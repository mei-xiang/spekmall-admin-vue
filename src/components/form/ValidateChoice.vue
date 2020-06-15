<!--
 * @Description: 实体验证规则中的分类选择组件
 * @Author: jiaxin
 * @Date: 2018-12-18 10:36:00
 * @LastEditors: xiabing
 * @LastEditTime: 2019-03-05 14:07:39
 -->
<template>
	<el-cascader placeholder="输入关键字"
	             :options="bodyData"
	             :props="defaultProps"
	             v-model="choiceArr"
	             filterable
	             :show-all-levels="false"
	             @change="change"></el-cascader>
</template>

<script>
export default {
	data() {
		return {
			defaultProps: {
				value: "id",
				children: 'subCategory',
				label: 'name',
				checkStrictly: true
			},
			bodyData: [],
			choiceArr: []
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
		switchClass() {
			this.axios.get(`/api/common-service/category/validate/tree/`).then((res) => {
				// eslint-disable-next-line eqeqeq
				if (res.statusCode == 200) {
					this.bodyData = res.data.subCategory;
				}
			});
		},
		change(val) {
			// console.log(val[val.length - 1]);
			// 抛出修改变动后的数据
			this.$emit("change", val[val.length - 1]);
		}
	},
	// activated () {
	// 	debugger;
	// 	this.switchClass();
	// },
	mounted () {
		if (this.bodyData.length === 0) this.switchClass();
	},
	watch: {
		choiceId: {
			immediate: true,
			handler: function (val) {
				this.choiceArr = this.$treeFn.findAllPId(this.bodyData, val, {
					children: "subCategory",
					pId: "pId"
				});
			}
		}
	}
}
</script>
