<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin-bottom: 20px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isDisabled="status == 0"
      />
    </el-card>

    <!-- 内容 -->
    <el-card>
      <!-- 展示spu列表 -->
      <div v-show="status === 0">
        <!-- 添加按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <!-- 数据表格 -->
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column prop="spuName" label="Spu名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="Spu描述" width="width">
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
            align="center"
          >
            <!-- 操作按钮 -->
            <!-- 自定义封装带提示的按钮 -->
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的全部sku"
                @click="getSkuList(row)"
              ></HintButton>

              <el-dialog
                :title="`${title}的SKU`"
                :visible.sync="dialogTableVisible"
                @close="close"
              >
                <el-table
                  style="width: 100%"
                  border
                  :data="skuList"
                  v-loading="loading"
                >
                  <el-table-column prop="skuName" label="名称" width="width">
                  </el-table-column>

                  <el-table-column prop="price" label="价格" width="width">
                  </el-table-column>

                  <el-table-column prop="weight" label="重量" width="width">
                  </el-table-column>

                  <el-table-column prop="prop" label="默认图片" width="width">
                    <template slot-scope="{ row }">
                      <img
                        :src="row.skuDefaultImg"
                        alt=""
                        style="width: 100%"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>

              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <!-- 事件与回调 -->
        <!-- @size-change="handleSizeChange"
            @current-change="handleCurrentChange" -->
        <el-pagination
          v-show="spuList.length > 0"
          style="text-align: center; margin-top: 20px"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>

      <!-- 添加或修改spu -->
      <SpuFrom v-show="status === 1" ref="spu" @changeStatus="changeStatus" />
      <!-- 添加sku -->
      <SkuFrom v-show="status === 2" ref="sku" @changeStatus="changeStatus" />
    </el-card>
  </div>
</template>

<script>
import SpuFrom from "./SpuFrom";
import SkuFrom from "./SkuFrom";
export default {
  name: "Spu",
  data() {
    return {
      //   三级联动id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 当前页
      page: 1,
      // 默认的单页展示数据条数
      limit: 3,
      // spu数据列表
      spuList: [],
      // 数据总条数
      total: 0,
      status: 0,
      // 是否显示表格
      dialogTableVisible: false,
      skuList: [],
      title: "",
      loading: true,
    };
  },
  components: {
    SpuFrom,
    SkuFrom,
  },
  methods: {
    //   获取三级联动的id
    getCategoryId({ categoryId, level }) {
      // 根据level判断是几级分类
      if (level === 1) {
        this.category1Id = categoryId;
        // 一级分类变化清除二三级的id和属性列表
        (this.category2Id = ""), (this.category3Id = ""), (this.attrList = []);
      } else if (level === 2) {
        this.category2Id = categoryId;
        // 二级分类变化清除三级分类的id和属性列表
        (this.category3Id = ""), (this.attrList = []);
      } else {
        this.category3Id = categoryId;
        // 当获取到三级分类时发送请求
        this.getSpuList();
      }
    },
    // 获取spu数据列表
    async getSpuList(pager = 1) {
      // 如果分页器的当前页码变化，将值赋值给响应式数据参数page
      this.page = pager;
      const result = await this.$API.spu.reqGetSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      console.log(result);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // limit变化时的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu
    addSpu() {
      // 切换显示内容
      this.status = 1;
      // 添加spu时将三级分类的id传入
      this.$refs.spu.addSpuDate(this.category3Id);
    },
    // 修改Spu
    updateSpu(row) {
      // 切换内容区域显示的内容
      this.status = 1;
      // 在父组件中调用子组件中的初始化函数
      // 这样每次点击修改按钮都能够重新发送请求
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件的回调(取消添加修改)
    changeStatus(status) {
      this.status = status;
      // 每次切换都要重新获取数据(并且传入当前所在页)
      this.getSpuList(this.page);
    },
    // 删除spu
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id);
      // 删除成功
      if (result.code === 200) {
        // 弹出提示
        this.$message({
          type: "success",
          message: "删除成功",
        });
        // 重新获取数据,并返回应在的页
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku
    addSku(row) {
      // 切换显示内容
      this.status = 2;
      // 调用子组件中的函数发送请求，并且传入参数
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 显示当前spu的所有sku
    async getSkuList(row) {
      // 显示对话框
      this.dialogTableVisible = true;
      //获取标题
      this.title = row.spuName;
      // 发送请求
      const result = await this.$API.spu.reqGetSkuList(row.id);
      // 存储数据
      if (result.code === 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框
    close() {
      //清除数据
      this.skuList = [];
      // 重置loading
      this.loading = true;
    },
  },
};
</script>

<style>
</style>