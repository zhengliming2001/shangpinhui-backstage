<template>
  <div class="piechart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PieCharts",
  mounted() {
    this.myCharts = echarts.init(document.querySelector(".piechart"));
    this.myCharts.setOption({
        title:{
            text:'',
            left:'center',
            top:'center'
        },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["50%", "75%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
          },
          emphasis: {
            
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "搜索引擎" },
          ],
        },
      ],
    });
    // 绑定事件
    this.myCharts.on('mouseover', (params)=>{
        this.myCharts.setOption({
            title:{
                text:params.data.name,
                subtext:params.data.value
            }
        })
    });
  },
//   

};
</script>

<style>
.piechart {
  width: 100%;
  height: 160px;
}
</style>