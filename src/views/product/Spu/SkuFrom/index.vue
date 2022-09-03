<template>
  <div>
    <el-form ref="form" label-width="80px">
      <!-- spu名称 -->
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>

      <!-- sku名称 -->
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <!-- 价格 -->
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
      </el-form-item>

      <!-- 重量 -->
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <!-- 规格描述 -->
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          spus="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="formLine" label-width="80px">
          <!-- 屏幕尺寸 -->

          <el-form-item
            :label="item.attrName"
            v-for="item in attrInfoList"
            :key="item.id"
            style="margin-bottom: 10px"
          >
            <!-- 收集到平台属性上对象上，等后续操作 -->
            <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
              <!-- 要收集平台属性的id和值的id -->
              <el-option
                :label="item2.valueName"
                :value="`${item.id}:${item2.id}`"
                v-for="item2 in item.attrValueList"
                :key="item2.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <!-- 颜色 -->
          <el-form-item
            :label="item.saleAttrName"
            v-for="item in spuSaleAttrList"
            :key="item.id"
          >
            <!-- 收集到销售属性自身 -->
            <el-select
              placeholder="请选择"
              v-model="item.saleAttrIdAndSaleAttrValueId"
            >
              <!-- 要收集销售属性的id和销售属性值的id -->
              <el-option
                :label="item2.saleAttrValueName"
                :value="`${item.id}:${item2.id}`"
                v-for="item2 in item.spuSaleAttrValueList"
                :key="item2.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="imgList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            width="50"
            align="center"
          >
          </el-table-column>

          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button
                style="color: greenyellow"
                size="mini"
                v-if="row.isDefault == 1"
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <!-- 保存和取消 -->
      <el-form-item>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuFrom",
  data() {
    return {
      imgList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // 保存时要提交的数据
      skuInfo: {
        // 父组件传递的
        // 三级分类的id
        category3Id: 0,
        // spuid
        spuId: 0,
        // 品牌id
        tmId: 0,

        // v-model收集的
        // 价格
        price: 0,
        // 重量
        weight: "",
        // 描述
        skuDesc: "",

        // 自己计算收集
        // 属性值列表
        skuAttrValueList: [
          /* {
            // 平台属性的id
            attrId: 0,
            // 值的id
            valueId: 0,
          }, */
        ],
        // 默认图片
        skuDefaultImg: "",
        // 图片列表
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        // 销售属性值列表
        skuSaleAttrValueList: [
          /*  {
          //  销售属性id
            saleAttrId: 0,
            // 销售属性值id
            saleAttrValueId: 0,
          }, */
        ],
      },
      // spu
      spu: {},
      checkedImgList: [],
    };
  },
  methods: {
    // 获取初始数据
    async getData(category1Id, category2Id, spu) {
      // 收集数据
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 获取图片列表
      const imgResult = await this.$API.spu.reqGetSpuImgList(spu.id);
      //获取销售属性
      const SaleAttrResult = await this.$API.spu.reqGetSpuSaleAttrList(spu.id);
      // 获取属性
      const attrInfoResult = await this.$API.spu.reqGetAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      try {
        const result = await Promise.all([
          imgResult,
          SaleAttrResult,
          attrInfoResult,
        ]);
        // 成功了存储数据
        this.imgList = result[0].data;
        // 给每个图片信息添加字段
        this.imgList.forEach((item) => {
          this.$set(item, "isDefault", 0);
        });
        this.spuSaleAttrList = result[1].data;
        this.attrInfoList = result[2].data;
      } catch (error) {
        alert(error.message);
      }
    },
    // 选中的图片回调
    // selection——当前选中的所有图片信息(数组)
    handleSelectionChange(selection) {
      // 将选中的图片先存在响应式数据中(不能直接存在提交的数据中，数据字段不一样)
      this.checkedImgList = selection;
    },
    // 设置为默认的回调
    changeDefault(row) {
      // 排他
      this.imgList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消
    cancel() {
      //切换显示内容
      this.$emit("changeStatus", 0);
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    async addSku() {
      // 整理参数
      // 结构参数
      const { attrInfoList, spuSaleAttrList, skuInfo, checkedImgList } = this;
      // 平台属性,方法二(使用数组的reduce方法)
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        // 依赖返回值
        return prev;
      }, []);

      // 销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndSaleAttrValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleAttrIdAndSaleAttrValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);

      // 图片
      skuInfo.skuImageList=checkedImgList.map((item) => {
        return {
          id: item.id,
          imgName: item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId: item.id,
        };
      });
    
      // 发请求
      const result=await this.$API.spu.reqAddSku(skuInfo);
      if(result.code===200){
        // 成功后切换显示内容
        this.$emit('changeStatus',0);
        // 弹出提示信息
        this.$message({
          type:'success',
          message:'SKU添加成功'
        })
        // 清空数据
        Object.assign(this._data,this.$options.data())
      }
    },
  },
};
</script>

<style>
</style>