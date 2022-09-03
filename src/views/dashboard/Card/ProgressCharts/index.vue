<template>
  <div class="progressCharts" ref="progressCharts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    // 初始化,获取容器
    const ProgressChart = echarts.init(this.$refs.progressCharts);
    // 配置对象
    ProgressChart.setOption({
      xAxis: {
        show:false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        type:'category'
      },
      series: [
        {
          type: "bar",
          data: [78],
          color:'yellowgreen',
          barWidth:10,
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          label:{
            formatter:'|',
            show:true,
            position:'right'
          }
        }
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }
    });
  },
};
</script>

<style>
.progressCharts {
  height: 49px;
}
</style>