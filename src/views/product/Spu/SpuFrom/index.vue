<template>
  <!-- 表单 -->
  <el-form ref="form" label-width="80px">
    <!-- spu名称 -->
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
    </el-form-item>

    <!-- 品牌 -->
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spu.tmId">
        <el-option
          :label="tradmark.tmName"
          :value="tradmark.id"
          v-for="tradmark in tradmarkList"
          :key="tradmark.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <!-- Spu描述 -->
    <el-form-item label="SPU描述">
      <el-input type="textarea" rows="5" v-model="spu.description"></el-input>
    </el-form-item>

    <!-- spu图片 -->
    <!-- file-list——图片的存放位置，数组，数组中的每项必须包含name和url字段 -->
    <!-- on-preview——预览图片事件 -->
    <!-- on-remove——删除图片事件 -->
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImgList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-select
        :placeholder="`还有${options.length}个选择`"
        v-model="marketIdAndName"
      >
        <!-- :value="`${market.id}:${market.name}`"收集销售属性的id和名称 -->
        <el-option
          :label="market.name"
          :value="`${market.id}:${market.name}`"
          v-for="market in options"
          :key="market.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left: 10px"
        :disabled="!marketIdAndName"
        @click="addMarket"
        >添加销售属性</el-button
      >
    </el-form-item>

    <!-- 表格 -->
    <el-form-item>
      <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>

        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>

        <el-table-column
          prop="spuSaleAttrValueList"
          label="属性值名称列表"
          width="width"
        >
          <template slot-scope="{ row }">
            <el-tag
              :key="tag.id"
              v-for="(tag, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="handleClose(row, index)"
              size="small"
              style="margin: 5px"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="150" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteMarketAttr($index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 保存与取消 -->
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
//
//
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu数据的初始化
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // spu名称
        spuName: "",
        // 品牌Id
        tmId: "",
        // spu图片信息
        spuImageList: [
        ],
        // 品牌属性信息
        spuSaleAttrList: [
        ],
      },
      tradmarkList: [],
      marketList: [],
      spuImgList: [],
      dynamicTags: [],
      marketIdAndName: "",
    };
  },
  computed: {
    options() {
      let result = this.marketList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          // 返回两个列表中不相等的项
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    // 图片添加成功的回调
    // response——图片上传成功的响应信息
    // file——当前图片的文件信息
    // fileList——添加成功后的图片列表
    handlerSuccess(_, file, fileList) {
      // 添加成功修改数据
      this.spuImgList = fileList;
    },
    // 删除图片的回调
    // file——当前删除的图片
    // fileList——删除完毕后的图片列表
    handleRemove(_, fileList) {
      // 删除完成后修改图片列表数据
      this.spuImgList = fileList;
    },
    // 预览图片的回调
    // file当前预览图片
    handlePictureCardPreview(file) {
      //将当前图片的url赋值给大于
      this.dialogImageUrl = file.url;
      // 并显示大图
      this.dialogVisible = true;
    },
    // 初始化表单数据的函数
    // 发送四个请求
    async initSpuData(spu) {
      // 获取当前spu信息
      const spuResult = await this.$API.spu.reqGetSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }

      // 获取品牌信息
      const tradmarkResult = await this.$API.spu.reqGetTrademarkList();
      if (tradmarkResult.code === 200) {
        this.tradmarkList = tradmarkResult.data;
      }

      // 获取销售属性(三种)
      const marketResult = await this.$API.spu.reqGetMarketAttr();
      if (marketResult.code === 200) {
        this.marketList = marketResult.data;
      }

      // 获取spu图片
      const spuImgResult = await this.$API.spu.reqGetSpuImg(spu.id);
      if (spuImgResult.code === 200) {
        let imgArr = [];
        spuImgResult.data.forEach((item) => {
          imgArr.push({
            name: item.imgName,
            url: item.imgUrl,
          });
        });
        this.spuImgList = imgArr;
      }
    },
    // 添加spu
    async addSpuDate(category3Id) {
      // 收集3id
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      const tradmarkResult = await this.$API.spu.reqGetTrademarkList();
      if (tradmarkResult.code === 200) {
        this.tradmarkList = tradmarkResult.data;
      }
      // 获取销售属性
      const marketResult = await this.$API.spu.reqGetMarketAttr();
      if (marketResult.code === 200) {
        this.marketList = marketResult.data;
      }
    },
    handleInputConfirm(row) {
      row.inputVisible = false;
      let { inputValue } = row;
      // 不能输入空值
      if (inputValue.trim() === "") {
        this.$message("请不要输入空值");
        return;
      }
      // 不能重复添加
      let result = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (result) {
        this.$message({
          type: "error",
          message: "不能重复添加",
        });
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId: row.baseSaleAttrId,
        isChecked: null,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: inputValue,
        spuId: row.spuId,
      });
    },
    // 显示输入框
    showInput(row) {
      // 给每个row添加一个响应式属性，控制切换按钮和输入框
      this.$set(row, "inputVisible", false);
      this.$set(row, "inputValue", "");
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 添加销售属性
    addMarket() {
      // 将收集到的销售属性的id和name结构出来
      let [baseSaleAttrId, saleAttrName] = this.marketIdAndName.split(":");
      // 添加进spu.spuSaleAttrList数组
      this.spu.spuSaleAttrList.push({ baseSaleAttrId, saleAttrName });
      // 添加完成清空收集值的字符串
      this.marketIdAndName = "";
    },
    // 删除tag
    handleClose(row, index) {
      // 删除对应的tag
      row.spuSaleAttrValueList.splice(index, 1);
    },
    // 删除销售属性
    deleteMarketAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    // 添加或修改spu
    async addOrUpdateSpu() {
      // 整理参数，整理照片墙数据
      // 携带参数:对于图片需要携带imageName和imageUrl字段
      // map会返回一个处理过的数组
      this.spu.spuImageList = this.spuImgList.map((item) => {
        return {
          imageName: item.name,
          // 判断是否存在item.response,如果存在则使用其data值，否则则使用url
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发送请求
      const result = await this.$API.spu.reqaddOrUpdateSpu(this.spu);
      console.log(result);
      if (result.code === 200) {
        // 如果修改或者添加成功
        // 切换显示内容
        this.$emit("changeStatus", 0);
        // 弹出添加成功的提示
        this.$message({
          type: "success",
          message: this.spu.id ? "修改成功" : "添加成功",
        });
      }
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 取消添加spu的回调
    cancel() {
      // 切换显示内容
      this.$emit("changeStatus", 0);
      // 清除数据
      //合并数据，达到清除效果
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>