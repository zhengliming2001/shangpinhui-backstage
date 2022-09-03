<template>
  <div>
      <el-card>
          <div slot="header" class="top">
              <span>线上热门搜索</span>
              <span class='el-icon-more'></span>
          </div>
          <div>
              <div class="charts">
                  <LineCharts class="chart"/>
                  <LineCharts class="chart"/>
              </div>
          </div>
      </el-card>
  </div>
</template>

<script>
import LineCharts from './LineCharts'
export default {
    name:'Search',
    components:{
        LineCharts
    }

}
</script>

<style scoped>
.top{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}
.charts{
    display:flex;
}
.chart{
    flex: 1;
}
</style>