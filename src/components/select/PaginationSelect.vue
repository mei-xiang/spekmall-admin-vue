<!--
 * @Description:  带标题分页的选择框
 * @Author: jiaxin
 * @Date: 2019-05-24 15:40:17
 * @LastEditors: jiaxin
 * @LastEditTime: 2019-08-22 11:03:26
 -->
<template>
	<el-select v-model="initDataCopy"
			   popper-class="pagination-select"
			   filterable
			   remote
			   placeholder="请输入关键字查询"
			   :remote-method="queryByKey"
			   @change="change($event, option)"
			   @focus="focus"
			   :loading="loading"
			   :disabled="disabled">
		<li class="option-title">
			<span class="option-item"
				  style="width: 60px">序号</span>
			<span v-for="(item, index) in config.title"
				  :key="index"
				  class="option-item"
				  :style="{'width':item.width}">{{item.label}}</span>

		</li>
		<li class="option-bottom"
			@click.stop="">
			<el-pagination layout="prev, pager, next"
						   :total="total"
						   :page-size="config.pageSize"
						   hide-on-single-page
						   @current-change="queryByPageNum">
			</el-pagination>
		</li>
		<el-option v-for="(subitem, index) in option"
				   :key="subitem[config.defaultProp.value]"
				   :label="subitem[config.defaultProp.label]"
				   :value="subitem[config.defaultProp.value]">
			<div>
				<span class="option-item"
					  style="width: 60px">{{index + 1}}</span>
				<span v-for="(item, index) in config.title"
					  :key="index"
					  class="option-item"
					  :style="{'width':item.width}"
					  :title="subitem[item.prop] | stringFilter(item.format)">{{subitem[item.prop] | stringFilter(item.format)}}</span>
			</div>
		</el-option>
	</el-select>
</template>

<script>
let _this
export default {
	data() {
		_this = this
		return {
			initDataCopy: null,
			option: [],
			total: 0,
			queryString: null,
			loading: false
		}
	},
	props: {
		// 初始数据
		initData: {
			// 在保存id的情况下为Number，为单向数据，需要在下面change的父组件中自行修改
			// 如果只是保存label不存id则修改的情况回显时可以直接传入对应的值用作显示
			type: [Number, String]
		},
		config: {
			type: Object,
			default: () => {
				return {
					/* ajax: {
						type: "get",
						url: '/api/goods-service/commoditys',
						queryProp: "itemModel"
					},
					pageSize: 20,
					title: [
						{
							label: "型号",
							prop: "itemModel",
							width: "120px"
						},
						{
							label: "名称",
							prop: "itemName",
							width: "120px"
						}
					],
					defaultProp: {
						value: "id",
						label: "itemModel"
					} */
				}
			}
		},
		options: {
			type: Array,
			default: () => {
				return []
			}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		initData: {
			immediate: true,
			handler: function (val) {
				this.initDataCopy = val;
			}
		},
		options: {
			immediate: true,
			handler: function (val) {
				this.option = val;
			}
		}
	},
	methods: {
		// 未输入内容直接获取选择
		focus() {
			if (!this.$dataIsNull(this.queryString)) return;
			this.queryByKey("");
		},
		// 根据关键字查询
		queryByKey(val, pageNum = 1) {
			this.queryString = val;
			this.loading = true;
			let param = {
				pageNum: pageNum,
				pageSize: this.config.pageSize
			};
			param[this.config.ajax.queryProp] = val;
			this.axios[this.config.ajax.type](this.config.ajax.url, param).then((res) => {
                this.loading = false;
                let datas = null;
                if (res.data.hasOwnProperty('records')) {
                    datas = res.data.records
                } else {
                    datas = [res.data]
                }
                const data = datas;
				this.total = res.data.total;
				if (Array.isArray(data)) {
					this.option = data;
				} else {
					this.option = [];
				}
			})
		},
		queryByPageNum(pageNum) {
			this.queryByKey(this.queryByKey, pageNum)
		},
		change(val, option) {
			const data = option.find((item) => {
				if (item.id !== null && item.id !== undefined && item.id === val) return item
			});
			this.$emit("change", [val, data])
		}
	},
	filters: {
		stringFilter: function (val, formatArr) {
			return _this.$filters.string(val, formatArr)
		}
	}

}
</script>
