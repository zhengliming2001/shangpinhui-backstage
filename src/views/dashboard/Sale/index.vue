<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix top">
        <el-tabs v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>

        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>

          <!-- 日历 -->

          <el-date-picker
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            v-model="date"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="text item">
        <!-- 柱状图 -->
        <el-row :gutter="10">
          <el-col :span="18" class="charts"></el-col>
          <!-- 数据表 -->
          <el-col :span="6">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="left up">1</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left up">2</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left up">3</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left">4</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left">5</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left">6</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>

              <li>
                <span class="left">7</span>
                <span>肯德基</span>
                <span class="_right">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      date: [],
    };
  },
  mounted() {
    this.myEcharts = echarts.init(document.querySelector(".charts"));
    this.myEcharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "0",
        right: "0",
        bottom: "0",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
    this.$store.dispatch("getList");
  },
  computed: {
    // 计算title
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      list: (state) => state.home.list,
    }),
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      //  startOf——开始
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  watch: {
    // 监听title
    title() {
      // 再次修改标题
      this.myEcharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: [
          {
            data:
              this.title == "销售额"
                ? this.list.orderFullYearAxis
                : this.list.userFullYearAxis,
          },
        ],
        series: [
          {
            data:
              this.title == "销售额"
                ? this.list.orderFullYear
                : this.list.userFullYear,
          },
        ],
      });
    },
    // 监听list是否已经有数据,有数据直接进行渲染
    list() {
      if (this.list) {
        this.myEcharts.setOption({
          xAxis: [
            {
              data:this.list.orderFullYearAxis
            },
          ],
          series: [
            {
              data:this.list.orderFullYear
            },
          ],
        });
      }
    },
  },
};
</script>

<style scoped>
.top {
  position: relative;
}

.right {
  position: absolute;
  right: 0;
  top: 0;
}
.right span {
  margin: 15px;
  cursor: pointer;
}
.date {
  width: 212px;
  margin-left: 10px;
}
.charts {
  height: 200px;
}
ul {
  margin-top: 20px;
  list-style: none;
}
ul li {
  height: 20px;
  line-height: 20px;
  margin: 5px 0;
}
.left {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
  margin-right: 15px;
}
.up {
  border-radius: 50%;
  background: black;
  color: white;
}
._right {
  float: right;
}
</style>