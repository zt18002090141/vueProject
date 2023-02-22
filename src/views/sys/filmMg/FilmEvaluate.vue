<template>

  <div>
    <el-card>
      <!-- 头部 搜索 新建 批量删除 -->
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.id" placeholder="请输入搜索内容" clearable @clear="getFilmEvaluateList">
            <el-button slot="append" icon="el-icon-search" @click="getFilmEvaluateList"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="showCategoryDialog" type="primary">新建</el-button>
          <el-button @click="deleteFilmEvaluate()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
          <!-- <el-popconfirm title="这是一段内容确定删除吗？" @confirm="deleteFilmEvaluate()">
            <el-button type="danger" :disabled="deleteBtnStu" slot="reference">批量删除</el-button>
          </el-popconfirm> -->
        </el-form-item>

      </el-form>

      <!-- 排片表单数据展示 -->
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="fname" label="电影名称" width="180"></el-table-column>
        <el-table-column prop="uname" label="用户名" width="120"></el-table-column>
        <el-table-column prop="star" label="评分" width="80">
        </el-table-column>
        <el-table-column prop="comment" label="评价" width="200"></el-table-column>
        <el-table-column prop="created" label="创建时间" width="180" ></el-table-column>
        <el-table-column prop="statu" label="状态" width="80" >
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.statu == 1)" size="mini" type="success">正常</el-tag>
            <el-tag v-else-if="(scope.row.statu == 0)" size="mini" type="info">失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editFilmEvaluate(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteFilmEvaluate(scope.row.id)" type="text">删除</el-button>
            <!-- <template>
                <el-popconfirm title="确定要删除该电影吗？" @confirm="deleteFilmEvaluate(scope.row.id)">
                <el-button type="text" slot="reference">删除</el-button>
              </el-popconfirm>
            </template> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>


    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="filmEvaluateDialogVisible" @closed="resetForm('filmEvaluateForm')"
      width="25%">
      <el-form ref="filmEvaluateForm" :model="filmEvaluateForm" label-width="100px" :rules="filmEvaluateFormRules">
        <!-- <el-form-item label="用户名称" prop="name">
            <el-input v-model="categoryForm.name"></el-input>
          </el-form-item> -->
        <el-form-item label="电影名称" prop="fname">
          <el-input v-model="filmEvaluateForm.fname" auto-complete="off" size="medium" width="30%"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="uname">
          <el-input v-model="filmEvaluateForm.uname" auto-complete="off" size="medium" width="30%"></el-input>
        </el-form-item>
        <el-form-item  label="评分" prop="star">
          <el-rate v-model="filmEvaluateForm.star" show-text></el-rate>
        </el-form-item>
        <el-form-item label="评论" prop="comment">
          <el-input type="textarea" v-model="filmEvaluateForm.comment"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="filmEvaluateForm.statu">
            <el-radio :label="0"  >失效</el-radio>
            <el-radio :label="1"  >正常</el-radio>
          </el-radio-group>
        </el-form-item>
        </el-form>
        
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('filmEvaluateForm')">取消</el-button>
        <el-button type="primary" @click="submitfilmEvaluateForm('filmEvaluateForm')">确定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data() {
    return {
      // 搜索表单数据
      searchForm: {},
      // 控制批量删除是否可用
      deleteBtnStu: true,
      // 控制新建/编辑dialog的显示与隐藏
      filmEvaluateDialogVisible: false,
      // 改变新建/编辑dialog的标题
      title: '',
      // 表格数据
      tableData: [],
      // 分类dialog表单数据
      filmEvaluateForm: {},
      moive: 0,
      // 分类dialog表单验证规则
      filmEvaluateFormRules: {
        fname: [{ required: true, message: '请输入电影名称', trigger: 'blur' }],
        uname: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        star: [{ required: true, message: '评分不能为空', trigger: 'blur' }],
        comment: [{ required: true, message: '评论不能为空', trigger: 'blur' }],
      },
      filmList: [],
      // TODO:控制分类dialog状态选项是否使用
      isUse: true,
      // 复选框
      multiplieSelection: [],
      // 分页数据
      size: 5,
      current: 1,
      total: 0
    }
  },
  created() {
    this.getFilmEvaluateList()
    //获取电影表中的电影
    this.$http.get('/system/film/list').then(res => {
      this.filmList = res.data.data.records;
      // console.log(this.filmList);
    })
  },
  methods: {
    getFilmEvaluateList() {
      this.$http.get("/system/filmEvaluate/list", {
        params: {
          id: (this.searchForm.id==undefined|| this.searchForm.id == '')?-1:this.searchForm.id,
          size: this.size,
          current: this.current,
        }
      }).then(res => {  
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
        this.tableData.forEach(val => {
          val.date = this.dayjs(val.date).format("YYYY-MM-DD")
          val.created = this.dayjs(val.created).format("YYYY-MM-DD hh:mm:ss")
          val.endTime = this.dayjs(val.endTime).format("YYYY-MM-DD hh:mm:ss")
        })
      })
    },
    showCategoryDialog() {
      this.filmEvaluateDialogVisible = true
      this.title = '新建排片'
      //this.isUse = true
    },
    //清空
    resetForm(formName) {

      this.$refs[formName].resetFields()
      this.filmEvaluateDialogVisible = false
      this.filmEvaluateForm = {}
    },
    //编辑
    editFilmEvaluate(id) {

      this.title = '编辑分类'

      this.$http.get('/system/filmEvaluate/info/' + id).then(res => {
        this.filmEvaluateForm = res.data.data
      })
      //this.isUse = false
      this.filmEvaluateDialogVisible = true
      this.filmEvaluateForm = {}

    },

    //提交
    submitfilmEvaluateForm(formName) {
      
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.$http.post('/system/filmEvaluate/' + (this.filmEvaluateForm.id ? 'update' : 'save'), this.filmEvaluateForm).then(res => {
          if (res.data.code == 200){
              this.$message({
                showClose: true,
                type: "success",
                message: res.data.data,
                onClose: () => {
                  this.getFilmEvaluateList()
                }
              })
          }else {
            return 
          }
          
        })
      })
      this.filmEvaluateDialogVisible = false

    },
    //删除单个或者多个
    async deleteFilmEvaluate(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该记录，是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring',
        }
      ).catch((error) => {
        return error
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      var ids = []
      id ? ids.push(id) : this.multiplieSelection.forEach(val => { ids.push(val.id) })
      this.$http.post('/system/filmEvaluate/delete', ids).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error("删除评论数据失败")
        }
        this.$message({
          showClose: true,
          message: '删除评论数据成功',
          type: 'success',
          onClose: () => {
            this.getFilmEvaluateList()
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.multiplieSelection = val
      this.deleteBtnStu = val.length == 0
    },
    handleSizeChange(newSize) {
      this.size = newSize
      this.getFilmEvaluateList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getFilmEvaluateList()
    }
  }
}

</script>

<style scoped>

</style>