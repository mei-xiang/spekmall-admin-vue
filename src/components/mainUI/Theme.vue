<!-- 主题颜色 -->
<template>
	<el-color-picker size="small"
	                 class="theme-picker"
	                 popper-class="theme-picker-dropdown"
	                 v-model="themeVal">
	</el-color-picker>
</template>

<script type="text/ecmascript-6">
import theme from "@/assets/js/theme.js";
export default {
	name: "TopTheme",
	mixins: [theme()],
	data() {
		return { chalk: "" };
	}
};
</script>

<style scoped lang="stylus">
.theme-picker .el-color-picker__trigger
	vertical-align middle
.theme-picker-dropdown .el-color-dropdown__link-btn
	display none
</style>
