<!--
 * @Description: 图标组件
 * @Author: jiaxin
 * @Date: 2019-07-10 09:30:42
 * @LastEditors  : jiaxin
 * @LastEditTime : 2019-12-18 15:39:13
 -->
 <template>
	<div id="chart-box"
		 class="chart-box"></div>
</template>

 <script>
 const { echarts } = require('js/echarts/echarts.js')
export default {
	data() {
		return {
			chart: null
		}
	},
	methods: {
		draw(option) {
			this.chart.setOption(option);
		}
	},
	mounted() {
		this.chart = echarts.init(document.getElementById('chart-box'));
	}
}
 </script>
 <style lang="stylus" scoped>
.chart-box
	height 100%
</style>
