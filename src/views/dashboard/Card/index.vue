<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" content="￥12980">
            <template slot="charts">
              <span>周同比</span>
              &nbsp;&nbsp;&nbsp;
              <span>56.67%</span>
              &nbsp;&nbsp;
              <svg
                t="1660987087030"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4871"
                width="12"
                height="12"
              >
                <path
                  d="M960 704L512 256l-448 448z"
                  fill="#d81e06"
                  p-id="4872"
                ></path>
              </svg>
              &nbsp;&nbsp;
              <span>日同比</span>
              &nbsp;&nbsp;&nbsp;
              <span>19.16%</span>
              &nbsp;&nbsp;
              <svg
                t="1660987162594"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5811"
                width="12"
                height="12"
              >
                <path
                  d="M64 320l448 448 448-448z"
                  fill="#1afa29"
                  p-id="5812"
                ></path>
              </svg>
            </template>

            <template slot="footer">
              <p>日销售额&nbsp;￥12423</p>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail title="访问量" content="88460">
            <template slot="charts">
              <LineCharts>

              </LineCharts>
            </template>
            <template slot="footer">
              <p>日访问量&nbsp;1234</p>
            </template>
          </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail title="支付钱数" content="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
              <template slot="footer">
              <p>转化率&nbsp;65%</p>
            </template>
               </Detail>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" content="78%">
            <template slot="charts">
              <ProgressCharts>

              </ProgressCharts>
            </template>

              <template slot="footer">
                  <span>周同比</span>
              &nbsp;&nbsp;&nbsp;
              <span>56.67%</span>
              &nbsp;&nbsp;
              <svg
                t="1660987087030"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4871"
                width="12"
                height="12"
              >
                <path
                  d="M960 704L512 256l-448 448z"
                  fill="#d81e06"
                  p-id="4872"
                ></path>
              </svg>
              &nbsp;&nbsp;
              <span>日同比</span>
              &nbsp;&nbsp;&nbsp;
              <span>19.16%</span>
              &nbsp;&nbsp;
              <svg
                t="1660987162594"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5811"
                width="12"
                height="12"
              >
                <path
                  d="M64 320l448 448 448-448z"
                  fill="#1afa29"
                  p-id="5812"
                ></path>
              </svg>
            </template>
         </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineCharts from './LineCharts'
import BarCharts from './BarCharts'
import ProgressCharts from './ProgressCharts'

export default {
  name: "Card",
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressCharts
  },
};
</script>

<style>
</style>