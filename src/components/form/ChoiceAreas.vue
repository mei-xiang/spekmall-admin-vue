<!--
 * @Description: 区域选择三级菜单
 * @Author: jiaxin
 * @Date: 2018-12-12 14:16:12
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-07-23 10:13:10
 -->
<template>
	<el-cascader :options="CityInfo"
				 size="small"
				 v-model="value"
				 :props="defaultProps"
				 :clearable="true"
				 :filterable="true"
				 @change="handleChange">
	</el-cascader>
</template>
<script>
import map from "@/assets/js/data/map";
export default {
	data: function () {
		return {
			CityInfo: map, //地区数据
			defaultProps: {
				label: "label",
				value: "value"
			},
			value: []
		}
	},
	props: {
		data: {
			type: Array,
			default: () => {
				return []
			}
		},
		prop: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	methods: {
		handleChange(value) {
			const obj = {
				value: value,
				label: [
					this.parseProvince(value[0]),
					this.parseCity(value[1]),
					this.parseArea(value[2])
				],
				prop: this.prop
			}
			this.$emit("returnData", obj)
		},
		parseProvince(value) {
			for (let y in this.CityInfo) {
				if (this.CityInfo[y].value === value) {
					return this.CityInfo[y].label
				}
			}
		},
		parseCity(value) {
			for (let y in this.CityInfo) {
				for (let z in this.CityInfo[y].children) {
					if (this.CityInfo[y].children[z].value === value && value !== undefined) {
						return this.CityInfo[y].children[z].label;
					}
				}
			}
		},
		parseArea(value) {
			for (let y in this.CityInfo) {
				for (let z in this.CityInfo[y].children) {
					for (let i in this.CityInfo[y].children[z].children) {
						if (this.CityInfo[y].children[z].children[i].value === value && value !== undefined) {
							return this.CityInfo[y].children[z].children[i].label
						}
					}
				}
			}
		}
	},
	watch: {
		data: {
			immediate: true,
			handler: function (val) {
				this.value = [];
				val.map((item) => {
					const newItem = this.$dataIsNull(item) ? null : Number(item);
					this.value.push(newItem)
				})
			}
		}
	}
}
</script>

<style lang="stylus">
.el-cascader
	width 100%
</style>
