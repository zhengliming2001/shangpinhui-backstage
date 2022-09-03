<template>
  <div>
    <el-card class="box-card" style="margin: 20px 0">
      <!--自定义事件接收子组件传来的分类id-->
      <!-- 传递isShowTable控制三级联动的禁不禁用 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isDisabled="isShowTable"
      />
    </el-card>
    <el-card class="box-card">
      <!-- 表格 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" border>
          <el-table-column
            label="序号"
            width="80"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <!-- 使用插槽 -->
              <!-- row——当前数据 -->
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 5px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-right: 10px"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>

        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="valueName" label="属性值名称" width="width">
            <template slot-scope="{ row }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="addEnd(row)"
                @keyup.enter.native="addEnd(row)"
                ref="add"
              ></el-input>
              <span v-else @click="handler(row)" style="display: block">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定要删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- attrValueList没数据时不能保存 -->
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="this.attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash的深拷贝方法
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 属性列表
      attrList: [],
      // 一级分类id
      category1Id: "",
      // 二级分类id
      category2Id: "",
      // 三级分类id
      category3Id: "",
      //   控制表格的显示与隐藏
      isShowTable: true,
      // 收集添加属性的数据
      attrInfo: {
        // 属性名
        attrName: "",
        // 属性值列表
        attrValueList: [],
        // 收集id
        categoryId: 0,
        // 收集的id的等级，这里收集的全都是三级分类的id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取对应id的属性列表
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
        this.getAttrList();
      }
    },
    // 发送请求的回调函数
    async getAttrList() {
      const result = await this.$API.attr.reqGetAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (result.code === 200) {
        // 请求成功，存储数据
        this.attrList = result.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        // id一般有后台指定，暂定undefind
        // 如果时修改属性，attrId即为其外部的id
        // 如果为添加属性，则在外部找不到id，即为undefind
        attrId: this.attrInfo.id,
        valueName: "",
        // 每个添加的属性值都自带一个开关属性，控制自身的查看与编辑模式的切换
        flag: true,
      });
      // 自动获取焦点
      this.$nextTick(() => {
        this.$refs.add.focus();
      });
    },
    // 添加属性
    addAttr() {
      // 隐藏表格
      this.isShowTable = false;
      // 清空上一次残存的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 顺便收集下第三分类的id
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改属性
    updateAttr(row) {
      // 隐藏表格
      this.isShowTable = false;
      // 在修改页面显示已有的属性信息
      // 在点击取消时，不能修改原有的属性，所以得使用深拷贝(数据结构太复杂)
      this.attrInfo = cloneDeep(row);
      // 给修改属性添加flag字段
      // 要添加的是响应式的数据(不然flag的值改变，页面不变化)，所以使用Vue.set方法添加
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    handler(row) {
      row.flag = true;
      // 自动获焦
      this.$nextTick(() => {
        this.$refs.add.focus();
      });
    },
    // 输入完成
    addEnd(row) {
      // console.log(row);
      // 判断输入的是否为空
      if (row.valueName.trim() === "") {
        // 警告
        this.$message({
          type: "warning",
          message: "请添加正确的属性值",
        });
        // 停止向下执行
        return;
      }
      // 判断输入的属性值是否已经存在
      // array.some()返回一个布尔值(如果存在符合条件的值为true,不存在则为false)
      const isSome = this.attrInfo.attrValueList.some((item) => {
        if (item !== row) {
          return row.valueName === item.valueName;
        }
      });
      // 如果已经存在相同的属性值则警告，且不往下进行
      if (isSome) {
        this.$message({
          type: "warning",
          message: "请勿重复添加相同属性值",
        });
        return;
      }
      // 隐藏输入框
      row.flag = false;
    },
    // 删除属性值(element-ui版本问题，该事件为onConfirm)
    deleteAttrValue(index) {
      // 删除当前属性值
      this.attrInfo.attrValueList.splice(index, 1);
      console.log(this.attrInfo.attrValueList);
    },
    // 保存
    async addOrUpdateAttr() {
      // 处理参数————去除掉空值的，将属性内的flag字段去除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉空值
          if (item.valueName !== "") {
            // 去除有属性值对象的flag字段
            delete item.flag;
            // 返回
            // array.filter()会将返回值为true的项重新整合成一个新数组
            return true;
          }
        }
      );
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 成功之后

        // 返回属性展示页
        this.isShowTable = true;
        // 重新获取数据
        this.getAttrList();
        // 弹出添加成功
        this.$message({
          type: "success",
          message: "添加成功",
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message,
        });
      }
    },
  },
};
</script>

<style>
</style>