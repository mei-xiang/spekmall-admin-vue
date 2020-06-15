/*
 * @Description: 系统公共常量 （常量命名以大写字母和下划线组成）
 * @Author: jiaxin
 * @Date: 2019-07-01 14:01:20
 * @LastEditors: jiaxin
 * @LastEditTime: 2020-03-02 17:24:40
 */

export default {
	install(Vue) {
		// elementUI (option)常量
		Vue.prototype.ELEMENT_UI = {
			// 时间控件快捷键 option
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			}
		}
		// WORKFLOW 常量
		Vue.prototype.FINANCING_DETAIL_STATE = [
			{ id: 0, label: "洽谈" },
			{ id: 1, label: "签约" },
			{ id: 2, label: "审批" },
			{ id: 3, label: "放款" }
		]
	}
}
