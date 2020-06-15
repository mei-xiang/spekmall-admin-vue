import {
	Loading
} from 'element-ui'
// let needLoadingRequestCount = 0
let loading = null;

export function showLoading() {
	loading = Loading.service({
		lock: true,
		spinner: "el-icon-loading",
		text: '拼命加载中…',
		background: 'rgba(255, 255, 255, 0)',
		customClass: "loading"
	})
}

export function hideLoading() {
	if (loading !== null) loading.close()
}
