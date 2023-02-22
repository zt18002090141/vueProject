<template>

  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入搜索内容" clearable @clear="getCategoryList">
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showCategoryDialog" type="primary">新建</el-button>
          <el-button @click="deleteCategory()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column label="封面" width="120">
          <!-- todo图片 -->
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 75px" :src="scope.row.url" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updated" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="statu" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.statu == 1)" size="mini" type="primary">正常</el-tag>
            <el-tag v-else size="mini" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editCategory(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteCategory(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 新建/编辑dialog -->
    <el-dialog :title="title" :visible.sync="categoryDialogVisible" @closed="resetForm('categoryFormRef')" width="25%">
      <el-form ref="categoryFormRef" :model="categoryForm" label-width="100px" :rules="categoryFormRules">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="url">
          <el-upload action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :headers="headers">
            <img V-if="categoryForm.url" :src="categoryForm.url" class="avatar" style="width:80px;height:100px">
            <i V-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="statu" label="状态">
          <el-radio-group v-model="categoryForm.statu" :disabled="isUse">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('categoryFormRef')">取消</el-button>
        <el-button type="primary" @click="submitcategoryForm('categoryFormRef')">确定</el-button>
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
      categoryDialogVisible: false,
      // 改变新建/编辑dialog的标题
      title: '',
      // 表格数据
      tableData: [],
      // 分类dialog表单数据
      categoryForm: {},
      // 分类dialog表单验证规则
      categoryFormRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        url: [{ required: true, message: '请添加分类图片', trigger: 'blur' }],
      },
      // 控制分类dialog状态选项是否使用
      isUse: true,
      // 复选框
      multiplieSelection: [],
      // 分页数据
      size: 5,
      current: 1,
      total: 0,
      // 上传图片header
      //   headers: { token: localstorage.getItem('token') },
      headers: {
        token: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取分配表格数据列表
    getCategoryList() {
      this.$http.get('/system/category/list', {
        params: {
          name: this.searchForm.name,
          size: this.size,
          current: this.current
        }
      }).then(res => {
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    // 展示新建dialog
    showCategoryDialog() {
      this.categoryDialogVisible = true
      this.title = '新建分类'
      this.isUse = true
    },
    // 重置分类表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.categoryDialogVisible = false
    },
    handleSelectionChange(val) {
      this.multiplieSelection = val
      this.deleteBtnStu = val.length == 0
      console.log(val);
    },
    // 展示编辑分类dialog，并获取对应id的数据
    editCategory(id) {
      this.title = '编辑分类'
      this.isUse = false
      this.categoryDialogVisible = true
      this.$http.get('/system/category/info/' + id).then(res => {
        this.categoryForm = res.data.data
      })
    },
    // 提交新建/编辑表单数据
    submitcategoryForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.$http.post('/system/category/' + (this.categoryForm.id ? 'update' : 'save'), this.categoryForm).then(res => {
          if(res.data.code !=200){
            this.$message({
            showClose: true,
            type: "danger",
            message: res.data.message,
            onClose: () => {
              this.getCategoryList()
            }
          })
          }
          this.$message({
            showClose: true,
            type: "success",
            message: this.categoryForm.id ? '更新分类信息成功' : '新建分类信息成功',
            onClose: () => {
              this.getCategoryList()
            }
          })
        })
      })
      this.resetForm(formName)
    },
    // 删除分类
    async deleteCategory(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色，是否继续',
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
      this.$http.post('/system/category/delete', ids).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error("删除分类数据失败")
        }
        this.$message({
          showClose: true,
          message: '分类数据删除成功',
          type: 'success',
          onClose: () => {
            this.getCategoryList()
          }
        })
      })
    },
    handleSizeChange(newSize) {
      this.size = newSize
      this.getCategoryList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getCategoryList()
    },
    // 图片上传成功回调
    handleAvatarSuccess(response, file) {
      this.categoryForm.url = response.data
    }

  }
}

</script>

<style scoped>

</style>