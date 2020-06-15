<!--
 * @Description: 可单选的级联菜单
 * @Author: jiaxin
 * @LastEditors: jiaxin
 * @Date: 2019-02-28 16:18:17
 * @LastEditTime: 2019-07-23 10:19:48
 -->

<template>
	<el-cascader placeholder="输入关键字"
	             size="mini"
	             :options="bodyData"
	             :props="props"
	             v-model="choiceArr"
	             filterable
	             :show-all-levels="false"
	             @change="change"></el-cascader>
</template>

<script>
export default {
	data() {
		return {
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
		},
		// 树形结构数据
		bodyData: {
			type: Array,
			default: () => {
				return []
			}
		},
		// 配置节点参数
		props: {
			type: Object,
			default: () => {
				return {
					value: "id",
					children: 'subCategory',
					label: 'name',
					checkStrictly: true
				}
			}
		}
	},
	methods: {
		change(val) {
			// 抛出修改变动后的数据
			console.log(val[val.length - 1]);
			this.$emit("update:choiceId", val[val.length - 1])
		}
	},
	watch: {
		choiceId: {
			immediate: true,
			handler: function (val, oldVal) {
				this.choiceArr = this.$treeFn.findAllPId(this.bodyData, val, {
					children: "children",
					pId: "parentId"
				});
			}
		}
	}
}
</script>
