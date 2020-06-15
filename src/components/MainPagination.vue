<!--
 * @Description: 分页组件
 * @Author: jiaxin
 * @Date: 2018-12-04 11:25:14
 -->
<template>
	<div class="pagination clearfix">
		<el-pagination @size-change="handleSizeChange"
		               @current-change="handleCurrentChange"
		               :current-page="currentPage"
		               :page-sizes="pageSizes"
		               :page-size="pageSize"
		               layout="sizes, prev, pager, next, jumper"
		               :total="total">
		</el-pagination>
		<p>
			检索到 {{total}} 条记录
			<span v-show="total!==0">，显示第 {{pageSize*(currentPage-1)+1}} 条 - 第 {{pageSize*currentPage>total?total:pageSize*currentPage}} 条</span>
			<span v-show="time!==0">，查询耗时 {{time |countTime}}</span>
		</p>
	</div>
</template>

<script type="text/ecmascript-6">

export default {
	name: 'MainPagination',
	data() {
		return {
		}
	},
	props: {
		// 当前页数
		currentPage: {
			type: Number,
			default: () => {
				return 1
			}
		},
		// 每页多少条数据
		pageSize: {
			type: Number,
			default: () => {
				return 2
			}
		},
		// 数据总数
		total: {
			type: Number,
			default: () => {
				return 100
			}
		},
		// 页面尺寸类型
		pageSizes: {
			type: Array,
			default: () => {
				return [20, 50, 100]
			}
		},
		// time
		time: {
			type: Number,
			default: () => {
				return 26
			}
		}
	},
	methods: {
		handleSizeChange(val) {
			this.$emit("sizeChange", val)
		},
		handleCurrentChange(val) {
			this.$emit("currentChange", val)
		}
	},
	filters: {
		countTime(val) {
			let [m, s, ms, text] = [
				Math.floor(val / (1000 * 60)),
				Math.floor(val / 1000) % 60,
				val % 1000,
				""
			];
			if (m !== 0) {
				text += m + "分 "
			}
			if (s !== 0) {
				text += s + "秒 "
			}
			if (ms !== 0) {
				text += ms + "毫秒"
			}
			return text
		}
	}

}
</script>

<style lang="stylus" scoped>
.pagination
	background-color #f5f5f5
	height 34px
	line-height 25px
	overflow hidden
	p
		float left
		padding-left 20px
		font-size 14px
		padding-top 3px
>>>.el-pagination
	float left
.el-pagination
	span:not([class*=suffix])
		line-height 25px !important
</style>
