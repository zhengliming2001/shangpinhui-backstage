<template>
  <div>
    <el-card>
      <div slot="header" class="top">
        <span>线上热门搜索</span>
        <div>
          <el-radio-group  size="mini" class="radio" v-model="radio">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts">
            <PieCharts/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import PieCharts from './PieCharts'
export default {
  name: "Category",
  data() {
      return {
          radio:'全部渠道'
      }
  },
  components:{
      PieCharts
  }
};
</script>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  position: relative;
}
.radio{
    position: absolute;
    top: -8px;
    right: 0;
}
</style>