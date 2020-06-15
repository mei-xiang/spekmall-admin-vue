<!-- 左侧导航组件 -->
<template>
	<li class="cascader-item">
		<p @click="router(data.path)">{{ data.label }}</p>
		<i class="el-icon-arrow-right"
		   v-if='data.children'>
		</i>
	</li>
</template>

<script type="text/ecmascript-6">
export default {
	name: "CascaderItem",
	props: {
		data: Object
	},
	methods: {
		router(path) {
			if (path !== undefined) {
				this.$router.push(path)
			}
		}
	}
}
</script>
