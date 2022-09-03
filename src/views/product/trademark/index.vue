<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="addTradmark"
      >添加</el-button
    >
    <!-- 表格 -->
    <!-- border——给表格添加边框 -->
    <el-table border :data="list">
      <!-- table-column——列 -->
      <!-- label——显示标题  -->
      <!-- width——宽度 -->
      <el-table-column
        label="序号"
        type="index"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="品牌名称"
        prop="tmName"
        align="center"
      ></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl" align="center">
        <template slot-scope="{ row}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="prop" align="center">
        <template slot-scope="{ row}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradmark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradmark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- total——数据总条数 -->
    <!-- pager-count———显示的按钮数(左右键+连续的键数) -->
    <!-- current-page————当前页码数 -->
    <!-- page-size——默认每一页可以展示的数据条数 -->
    <!-- layout————布局顺序 -->
    <!-- page-sizes——可以自己调节没页展示的数据 -->

    <!-- 事件 -->
    <!-- @current-change————当currentPage 改变时会触发，触发的回调里会将当前的page回传-->
    <!-- @size-change————当page-sizes改变时会触发，触发的回调里会将当前的page-size回传 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :pager-count="7"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="gettradmarklist"
      @size-change="updateLimit"
      layout="prev, pager, next, jumper, ->,sizes, total"
    >
    </el-pagination>

    <!-- 弹窗 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        style="width: 80%"
        v-model="tmForm"
        :model="tmForm"
        :rules="rules"
        ref="ruleForm"
      >
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!-- 上传品牌logo -->
        <!-- 要验证的字段添加属性 -->
        <el-form-item label="上传logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 上传文件的提示 -->
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Tradmark",
  data() {
  // 自定义校验规则
    var validatetmName=(rule,value,callback)=>{
    //  rule：对应的校验规则
    // value:输入的值
    // callback:放行函数
    if(value.length>=2 && value.length<=10){
      // 成功放行
      callback();
    }else{
      // 失败返回一个错误
      callback(new Error('输入不符合规则'))
      return false;
    }
    }
    return {
      page: 2,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      //   收集表单的数据
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          // required——是否必填
          // message——提示信息
          // trigger——触发事件
          { required: true, message: "请输入活动名称", trigger: "blur" },
          // 系统校验
          // {min: 2,max: 10,message: "长度在 2 到 10 个字符",trigger: "change",},
          // 自定义校验规则
          // validator——校验规则
          // validatetmName——校验规则的回调，写在响应式数据里
          { validator: validatetmName, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  mounted() {
    // 页面挂载时发送请求
    this.gettradmarklist();
  },
  methods: {
    // 发送获取品牌列表的请求
    // 接收一个参数(分页器当前页改变时触发的回调返回的当前页码数),设置默认值为不触发事件时展示的数据
    async gettradmarklist(pager = 2) {
      // console.log(pager);
      // 触发事件，修改参数
      this.page = pager;
      // 结构参数
      const { page, limit } = this;
      // 发送请求
      const result = await this.$API.tradmark.reqGetTradmarkList(page, limit);
      if (result.code === 200) {
        // 请求成功获取数据，存储到动态数据里
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 每页展示多少条数据事件触发的回调
    // 参数为事件触发时回调返回的当前选择的每页展示数据数
    updateLimit(limit) {
      // 修改参数
      this.limit = limit;
      // 重新发送请求
      this.gettradmarklist();
    },
    // 添加品牌
    addTradmark() {
      this.dialogFormVisible = true;
      //   添加之前清空原有的数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改品牌
    updateTradmark(row) {
      this.dialogFormVisible = true;
      // 因为直接赋值对于复杂数据类型来说为引用赋值，指向同一对象，容易引起数据混乱，所以采用浅拷贝的方式
      this.tmForm = { ...row };
    },
    // 删除品牌
    deleteTradmark(row){
      console.log(row);
       this.$confirm(`确定要删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 点击确定
        }).then(async () => {
          const result=await this.$API.tradmark.reqDeleteTradmark(row.id)
          console.log(result);
          if(result.code===200){
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
            // 获取新数据是进行判断，如果当前页的数据还有则保持在当前页，如果没有则返回前一页
            this.gettradmarklist(this.list.length>1?this.page:this.page-1)
          }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res.code === 200) {
        //   上传成功存储图片位置
        this.tmForm.logoUrl = res.data;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或者修改品牌
    /* async */ addOrUpdateTm() {
      this.$refs.ruleForm.validate(async (valid) => {
        // valid————表单验证是否通过，全部通过为true
        //  验证通过
        if (valid) {
          this.dialogFormVisible = false;
        const result=await this.$API.tradmark.reqAddOrUpdateTradmark(this.tmForm)
        if(result.code===200){
            this.$message({
              message:this.tmForm.id?'修改成功':'添加成功',
              type:'success'
            })
            // 添加成功再次获取数据
            // 如果是修改品牌，确定后留在当前页，添加品牌回到开始页
            // this.page当前所在的页数
            this.gettradmarklist(this.tmForm.id?this.page:2);
        }
        // 验证失败
        }else{
          this.$message({
            type:'error',
            message:'验证不通过,请按照要求填写信息'
          })
          return false
        }
      });
    },
  },
  resetForm(ruleForm) {
    this.$refs[ruleForm].resetFields();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>