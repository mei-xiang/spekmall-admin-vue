import {
	validatenull
} from 'js/validate'
/**
 * 存储localStorage
 */
export const setStore = (params) => {
	const {
		name,
		content,
		type
	} = params;
	const obj = {
		dataType: typeof (content),
		content: content,
		type: type,
		datetime: new Date().getTime()
	}
	if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
	else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */
export const getStore = (params) => {
	const { name } = params;
	let obj = {};
	let content = null;
	// 默认取localStorage
	obj = window.localStorage.getItem(name)
	// 判断为空 取sessionStorage
	if (validatenull(obj)) obj = window.sessionStorage.getItem(name);
	// sessionStorage为空 返回null
	if (validatenull(obj)) return null;
	obj = JSON.parse(obj)
	if (obj.dataType === 'number') {
		content = Number(obj.content)
	} else if (obj.dataType === 'boolean') {
		// eslint-disable-next-line no-eval
		content = eval(obj.content)
	} else {
		content = obj.content
	}
	return content;
}
/**
 * 删除localStorage
 */
export const removeStore = params => {
	let {
		name
	} = params;
	window.localStorage.removeItem(name);
	window.sessionStorage.removeItem(name);
}
