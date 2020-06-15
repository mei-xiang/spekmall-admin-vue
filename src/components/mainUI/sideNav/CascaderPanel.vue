<!-- 左侧导航组件 -->
<template>
	<div class="cascader-panel">
		<ul v-if="data && data.length"
		    @mouseover="handlemouseover">
			<cascader-item :class="[{isactive:currentIndex===index}]"
			               v-for="(item,index) in data"
			               :data="item"
			               :key="item.id"
			               @mouseenter.native.stop="showChild(item,index)">
			</cascader-item>
			<i class="cascader-line"></i>
		</ul>
		<cascader-panel v-if="childMenu && childMenu.length"
		                :data="childMenu">
		</cascader-panel>
	</div>
</template>

<script type="text/ecmascript-6">
import CascaderItem from "./CascaderItem";
export default {
	name: "CascaderPanel",
	components: {
		CascaderItem
	},
	props: {
		data: Array
	},
	data() {
		return {
			childMenu: [],
			currentIndex: -1,
		};
	},
	watch: {
		data() {
			this.childMenu = [];
			this.currentIndex = -1;
		}
	},
	methods: {
		showChild(item, index) {
			this.currentIndex = index;
			this.childMenu = item.children;
			console.log(item);

		},
		handlemouseover(e) {
			console.log("this is over", e.srcElement.nodeName)
			if (e.srcElement.nodeName == "P" || e.srcElement.nodeName == "I") {
				return
			} else {
				this.currentIndex = -1;
				this.childMenu = [];
			}
		},
	}
};
</script>
