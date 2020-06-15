<!--
 * @Description: 页面主选项卡组件
 * @Author: jiaxin
 * @Date: 2019-05-23 10:34:12
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-04 17:52:48
 -->
<template>
	<el-tabs :type="type"
			 v-model="tabsName"
			 @tab-click="handleClick"
			 :before-leave="beforeLeave">
		<template v-for="item in data">
			<el-tab-pane v-if="!item.hidden"
						 :key="item.name"
						 :name="item.name">
				<el-badge slot="label"
						  :type="item.numberType || 'success'"
						  :value="item.number>0?item.number:null"
						  class="item">
					{{item.label}}
				</el-badge>
				<slot :name="item.name"></slot>
			</el-tab-pane>
		</template>
	</el-tabs>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return {
			tabsName: this.activeName
		};
	},
	props: {
		type: {
			type: String,
			default: () => {
				return "card"
			}
		},
		activeName: {
			type: String,
			default: () => {
				return ""
			}
		},
		// 配置数据 格式如 [{ label: "订单明细", name: "first", number: 10 }]
		data: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	methods: {
		handleClick(tab, event) {
			this.$emit("tab-click", tab, event)
		},
		// 刷新子组件el-badge的数据
		refresh() {
			this.$nextTick(() => {
				this.$children[0].$children[0].$forceUpdate();
			})
		},
		beforeLeave(activeName, oldActiveName) {
			this.$emit("before-leave", activeName, oldActiveName);
			return true
		}
	},
	watch: {
		data: {
			immediate: true,
			handler: function (val) {
				this.refresh();
			}
		}
	}
};
</script>

<style scoped lang="stylus">
>>>.el-badge__content.is-fixed
	top 12px
	right 6px
>>>.el-badge__content
	padding 0 3px
	height 14px
	line-height 14px
</style>
