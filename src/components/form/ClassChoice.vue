<!--
 * @Description: 表单控件中的 分类选择组件
 * @Author: jiaxin
 * @Date: 2018-12-18 10:36:00
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-08-22 16:49:30
 -->
<template>
	<el-cascader ref="tree"
				 placeholder="输入关键字"
				 :options="classTree"
				 :props="defaultProps"
				 v-model="choiceArr"
				 filterable
				 :show-all-levels="false"
				 @change="change"></el-cascader>
</template>

<script>
import { mapActions } from "vuex";
export default {
	data() {
		return {
			defaultProps: {
				value: "id",
				children: 'subCategory',
				label: 'name',
				checkStrictly: true
			},
			choiceArr: []
		}
	},
	props: {
		// 传入大类的类型
		// 1 页面 2 打印模板 3实体验证 4 工具栏 5 表格  6 消息提醒  7 规则引擎
		classType: {
			type: Number,
			default: 1
		},
		// 传入默认选中的 id
		choiceId: {
			type: Number,
			default: 0
		},
		// 禁用的id
		disabledId: {
			type: [Number, null],
			default: null
		},
		// 是否显示根节点
		isShowRoot: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		...mapActions(["GET_CLASS"]),
		change(val) {
			// console.log(val[val.length - 1]);
			// 抛出修改变动后的数据
			this.$emit("update:choiceId", val[val.length - 1]);
			const node = this.$refs.tree.getCheckedNodes();
			this.$emit("change", node);
		}
	},
	computed: {
		classTree: function () {
			let tree = [];
			if (this.isShowRoot) {
				tree = [
					{
						id: this.classType,
						name: "根节点",
						subCategory: this.$store.state.classObj[this.classType]
					}
				]
			} else {
				tree = this.$store.state.classObj[this.classType]
			}
			// 将禁用的节点禁用掉，并删除其子节点（向下禁用比较麻烦）
			if (this.$dataIsNull(this.disabledId)) {
				return tree
			} else {
				let treeCopy = this.$clone(tree);
				let obj = this.$treeFn.findNodeById(treeCopy, this.disabledId, { children: "subCategory" });
				obj.disabled = true;
				delete obj.subCategory;
				return treeCopy
			}
		}

	},
	watch: {
		choiceId: {
			immediate: true,
			handler: function (val) {
				this.choiceArr = this.$treeFn.findAllPId(this.classTree, val, {
					children: "subCategory",
					pId: "pId"
				});
			}
		}
	},
	mounted() {
		this.GET_CLASS(this.classType);
	}
}
</script>
