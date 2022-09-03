<template>
  <div class="lineCharts" ref="lineCharts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    // 初始化,获取容器
    const Linechart = echarts.init(this.$refs.lineCharts);
    // 配置对象
    Linechart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          data: [120, 90, 155, 212, 110,150,213],
          // 拐点样式
          itemStyle: {
            opacity: 0,
          },
          // 线的样式
          lineStyle: {
            color: "purple",
          },
          // 填充样式
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          // 平滑曲线
          smooth:true
        },
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    });
  },
};
</script>

<style>
.lineCharts {
  height: 49px;
}
</style>