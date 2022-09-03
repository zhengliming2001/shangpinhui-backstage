<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>

      <el-table-column prop="skuName" label="名称" width="150">
      </el-table-column>

      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>

      <el-table-column prop="prop" label="默认图片" width="150" align="center">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>

      <el-table-column prop="price" label="价格(元)" width="80" align="center">
      </el-table-column>

      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-if="row.isSale == 0"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            v-else
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>

          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="selectSku(row)"
          ></el-button>

          <el-drawer
            title="我是标题"
            :visible.sync="drawer"
            :with-header="false"
            :size="'50%'"
            :show-close="false"
            :before-close='close'
          >
            <el-row>
              <el-col :span="5">
                <div class="grid-content bg-purple-dark">名称</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple-dark">
                  {{ skuInfo.skuName }}
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="5">
                <div class="grid-content bg-purple-dark">描述</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple-dark">
                  {{ skuInfo.skuDesc }}
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="5">
                <div class="grid-content bg-purple-dark">价格</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple-dark">
                  {{ skuInfo.price }}元
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="5">
                <div class="grid-content bg-purple-dark">平台属性</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple-dark">
                  <template>
                    <el-tag
                      type="success"
                      v-for="item in skuInfo.skuAttrValueList"
                      :key="item.id"
                      style="margin: 0px 5px"
                      >{{ item.attrId }} -- {{ item.valueId }}</el-tag
                    >
                  </template>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="5">
                <div class="grid-content bg-purple-dark">商品图片</div>
              </el-col>
              <el-col :span="19">
                <div class="grid-content bg-purple-dark" >
                  <template>

                    <div class="block">
                      <el-carousel  height="300px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                          <img :src="item.imgUrl" alt="" style="width:100%;height:100%">
                        </el-carousel-item>
                      </el-carousel>
                    </div>

                  </template>
                </div>
              </el-col>
            </el-row>
          </el-drawer>

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 15, 20]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="text-align: center; margin: 10px 0"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      skuList: [],
      drawer: false,
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    //   获取数据
    async getSkuList(pager = 1) {
      this.page = pager;
      const result = await this.$API.sku.reqGetSkuList(this.page, this.limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.skuList = result.data.records;
      }
    },
    // 当分页器当前页变化时
    handleCurrentChange(page) {
      this.getSkuList(page);
    },
    // 当分页器的单页显示数量变化时
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async onSale(row) {
      const result = await this.$API.sku.reqOnSale(row.id);
      if (result.code === 200) {
        // 上架
        row.isSale = 1;
        // 弹出通知
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    // 下架
    async cancelSale(row) {
      const result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code === 200) {
        // 上架
        row.isSale = 0;
        // 弹出通知
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    // edit
    edit() {
      this.$message("正在开发中...");
    },
    async selectSku(row) {
      // 展开抽屉
      this.drawer = true;
      // 发送请求
      const result = await this.$API.sku.reqGetSkuInfo(row.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    },
    // 关闭抽屉
    close(done){
      // 关闭
      done();
      // 清除数据
      this.skuInfo={};
    }
  },
};
</script>

// 轮播图样式
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  
</style>

<style scoped>
.el-row {
  margin: 10px;
}
.el-row .el-col-5 {
  text-align: right;
  font-size: 16px;
  color: black;
  font-weight: bolder;
}
.el-row .el-col-19 {
  text-align: left;
  padding-left: 20px;
}

/* style添加上scoped属性后,相当于给当前组件的元素添加了一个统一的自定义属性,该组件的子组件的最外层元素也会拥有该自定义属性，内层元素则只拥有自身的scoped添加的自定义属性 */
/* 如果想要在添加scoped的情况下，影响到子组件内层元素，则需要使用————深层选择器 */

/* >>>——原生css深度选择器 */
/* /deep/——less深度选择器 */
/* ::/deep/——scss深度选择器 */

>>>.el-carousel__button{
    width: 20px;
    height: 20px;
    background: rgb(221, 189, 250);
    border-radius: 50%;
  }
</style>