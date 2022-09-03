<template>
  <div class="barCharts" ref="barCharts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "BarCharts",
  mounted() {
    // 初始化,获取容器
    const Barchart = echarts.init(this.$refs.barCharts);
    // 配置对象
    Barchart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [120, 90, 155, 212, 110,150,213],
          color:'yellowgreen'
        }
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      tooltip:{}
    });
  },
};
</script>

<style>
.barCharts {
  height: 49px;
}
</style>