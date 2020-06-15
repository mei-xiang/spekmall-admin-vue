/*
 * @Description: 自定义指令
 * @Author: jiaxin
 * @Date: 2018-11-19 15:58:31
 */
import Vue from 'vue';
import hljs from 'highlight.js';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('json', json);

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
	bind(el, binding, vnode, oldVnode) {
		const dialogHeaderEl = el.querySelector('.el-dialog__header');
		const dragDom = el.querySelector('.el-dialog');
		dialogHeaderEl.style.cursor = 'move';

		// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
		const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

		dialogHeaderEl.onmousedown = (e) => {
			// 获取margin值 (left=right)
			const ml = parseFloat(sty.marginLeft);
			const mt = parseFloat(sty.marginTop);
			const height = parseFloat(sty.height);
			const left = parseFloat(sty.left);
			const top = parseFloat(sty.top);
			// 鼠标按下，计算当前鼠标到元素边缘的距离
			const disX = e.clientX - left;
			const disY = e.clientY - top;

			document.onmousemove = function (e) {
				// 通过事件委托，计算移动的距离
				let l = e.clientX - disX;
				let t = e.clientY - disY;
				// 边缘判断
				if (l <= -ml) {
					l = -ml;
				}
				if (l >= ml) {
					l = ml;
				}
				if (t <= -mt) {
					t = -mt;
				}
				if (t >= document.body.clientHeight - mt - height) {
					t = document.body.clientHeight - mt - height;
				}

				// 移动当前元素
				dragDom.style.left = `${l}px`;
				dragDom.style.top = `${t}px`;

				//将此时的位置传出去
				//binding.value({x:e.pageX,y:e.pageY})
			};

			document.onmouseup = function (e) {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
	}
})
// v-dragY: 上下两列拖动 调整大小
Vue.directive('dragY', {
	bind(el, binding, vnode, oldVnode) {
		const oDiv = el;
		if (binding.value.length !== 0) {
			const fn = binding.value[2];
			//获取某元素以浏览器左上角为原点的坐标
			const getPoint = (obj) => {
				var t = obj.offsetTop; //获取该元素对应父容器的上边距
				var l = obj.offsetLeft; //对应父容器的上边距
				//判断是否有父容器，如果存在则累加其边距
				// eslint-disable-next-line no-cond-assign
				while (obj = obj.offsetParent) { //等效 obj = obj.offsetParent;while (obj != undefined)
					t += obj.offsetTop; //叠加父容器的上边距
					l += obj.offsetLeft; //叠加父容器的左边距
				}
				return { top: t, left: l }
			}
			oDiv.onmousedown = function (ev) {
				let contentH = parseInt(document.getElementById("content").style.height);
				let topDiv = document.getElementById(binding.value[0]);
				let botDiv = document.getElementById(binding.value[1]);

				ev = ev || window.event; //兼容性
				ev.preventDefault();

				document.onmousemove = function (ev) {
					ev = ev || window.event;
					ev.preventDefault();
					let disy = ev.clientY - getPoint(topDiv).top;
					if (disy <= 0) { //此处Y最小应等于滚动条高度，适配网页中所有位置
						disy = 0;
					}
					if (disy >= contentH - 10) {
						disy = contentH - 10;
					}
					topDiv.style.height = disy + 'px';
					botDiv.style.height = contentH - disy + 'px';
					fn();
				}

				document.onmouseup = function () {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			};
		}
	}
})
// 代码高亮
Vue.directive('highlight', el => {
	let blocks = el.querySelectorAll('pre code');
	blocks.forEach((block) => {
		hljs.highlightBlock(block)
	})
});
