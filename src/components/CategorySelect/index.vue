<template>
  <div>
    <!-- inline：行内 -->
                                                                  <!-- 展示属性的表格不显示时，不能操作该表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled='!isDisabled'>
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="getCategory2List">
                          <!-- 这里的label的值决定选择框的显示内容 -->
          <el-option :label="c1.name" :value='c1.id' v-for="c1 in list1" :key="c1.id">{{c1.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" >
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="getCategory3List">
          <el-option :label="c2.name" :value='c2.id' v-for="c2 in list2" :key="c2.id">{{c2.name}}</el-option>
          </el-select> 
      </el-form-item>

        <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler">
          <el-option :label="c3.name" :value='c3.id' v-for="c3 in list3" :key="c3.id">{{c3.name}}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['isDisabled'],
  mounted(){
    // 页面加载完毕获取一级分类列表
    this.getCategory1List();
  },
  data() {
    return {
      // 收集表单数据
      cForm:{
        // 收集一级分类的id
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      // 收集分类列表
      list1:[],
      list2:[],
      list3:[]
    }
  },
  methods:{
    // 获取一级分类列表
    async getCategory1List(){
      const result=await this.$API.attr.reqGetCategory1List();
      if(result.code===200){
        this.list1=result.data
      }
    },
    // 获取二级分类列表(一级分类选择框的内容变化是获取二级分类列表)
    async getCategory2List(){
      // 当一级分类变化时，清除二级三级分类的列表和id
      this.list2=[]
      this.list3=[]
      this.cForm.category2Id=''
      this.cForm.category3Id=''
      const result=await this.$API.attr.reqGetCategory2List(this.cForm.category1Id);
      if(result.code===200){
        // 触发父组件的自定义事件，传送一级分类id
        // 为了区分分类的层级，传入两个参数区分
        this.$emit('getCategoryId',{categoryId:this.cForm.category1Id,level:1})
        this.list2=result.data
      }
    },
    // 获取三级分类列表(二级分类选择框的内容变化是获取二级分类列表)
    async getCategory3List(){
      // 当二级分类变化时，清除三级分类的列表和id
      this.list3=[]
      this.cForm.category3Id=''
      const result=await this.$API.attr.reqGetCategory3List(this.cForm.category2Id);
      if(result.code===200){
        // 触发父组件的自定义事件，传送二级分类id
        this.$emit('getCategoryId',{categoryId:this.cForm.category2Id,level:2})
        this.list3=result.data
      }
    },
    // 当三级分类改变时的回调函数
    handler(){
      // 触发父组件的自定义事件，传送三级分类id
        this.$emit('getCategoryId',{categoryId:this.cForm.category3Id,level:3})
    }
  }
};
</script>

<style>
</style>