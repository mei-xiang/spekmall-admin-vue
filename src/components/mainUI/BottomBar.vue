<!-- 系统下部信息栏 -->
<template>
	<ul class="bottom-bar">
		<li><span>当前账号：</span>{{userInfo.user_name}}</li>
		<!-- <li><span>所属机构：</span>{{userInfo.org_name}}</li>
		<li><span>所属部门：</span>{{userInfo.dept_name}}</li> -->
		<li><span>所属机构：</span>{{userInfo.company_name}}</li>
		<li><span>所属部门：</span>{{userInfo.org_name}}</li>
		<li><span>上次登录时间：</span>{{$date.format(userInfo.last_login_time)}}</li>
	</ul>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from "vuex";
export default {
	name: "BottomBar",
	data() {
		return {
		};
	},
	computed: {
		...mapGetters(["userInfo"])
	}
};
</script>

<style scoped lang="stylus">
.bottom-bar
	height 30px
	line-height 30px
	background-color $themeColor_bottom-bar
	text-align center
	color #fff
	li
		padding-right 15px
		display inline-block
		span
			padding-right 5px
</style>
