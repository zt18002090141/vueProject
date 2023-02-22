<template>
  <div>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.title" placeholder="请输入搜索内容" clearable @clear="getPosterList">
            <el-button slot="append" icon="el-icon-search" @click="getPosterList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showPosterDialog" type="primary">新建</el-button>
          <el-button @click="deletePoster()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="title" label="轮播图名称" width="200">
        </el-table-column>
        <el-table-column label="轮播图片" width="250">
          <template slot-scope="scope">
            <el-image style="width: 200px; height: 100px" :src="scope.row.url" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updated" label="更新时间" width="180">
        </el-table-column>
        <el-table-column prop="statu" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.statu == 1)" size="mini" type="primary">正常</el-tag>
            <el-tag v-else size="mini" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editPoster(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deletePoster(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 新建/编辑dialog -->
    <el-dialog :title="posterTitle" :visible.sync="posterDialogVisible" @closed="resetForm('posterFormRef')"
      width="35%">
      <el-form ref="posterFormRef" :model="posterForm" label-width="100px" :rules="posterFormRules">
        <el-form-item label="轮播图名称" prop="title">
          <el-input v-model="posterForm.title"></el-input>
        </el-form-item>

        <el-form-item label="轮播图片">
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :headers="headers">
            <img v-if="posterForm.url" :src="posterForm.url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="posterForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('posterFormRef')">取消</el-button>
        <el-button type="primary" @click="submitPosterForm('posterFormRef')">确定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data() {
    return {
      //搜索表单数据
      searchForm: {},
      // 控制批量删除是否可用
      deleteBtnStu: true,
      //轮播图新建或编辑对话框
      posterDialogVisible: false,

      //表格数据
      tableData: [],
      
      // 改变新建/编辑dialog的标题
      posterTitle: '',
      posterForm: {},
      posterFormRules: {
        title: [{ required: true, message: '请输入轮播图名称', trigger: 'blur' }],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
      // 复选框
      multiplieSelection: [],
      // 分页数据
      size: 5,
      current: 1,
      total: 0,

      //
      headers: {
        token: localStorage.getItem('token'),
      },

    }
  },
  created() {
    this.getPosterList()

  },
  methods: {
    //获得轮播图数据信息
    getPosterList() {
      this.$http.get('/system/poster/list', {
        //分页
        params: {
          title: this.searchForm.title,
          size: this.size,
          current: this.current,
        }
      }).then(response => {
        this.tableData = response.data.data.records
        this.size = response.data.data.size
        this.current = response.data.data.current
        this.total = response.data.data.total
      })
    },
    //展示新建轮播图
    showPosterDialog() {
      this.posterDialogVisible = true
      this.posterTitle = '添加轮播图'
    },
    //删除轮播图
    async deletePoster(id) {
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
      this.$http.post('/system/poster/delete', ids).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error("删除轮播图数据失败")
        }
        this.$message({
          showClose: true,
          message: '轮播图数据删除成功',
          type: 'success',
          onClose: () => {
            this.getPosterList()
          }
        })
      })
    },

    // 重置轮播图表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.posterDialogVisible = false
      this.posterForm = {}
    },
    //编辑
    editPoster(id) {
      this.posterTitle = '编辑轮播图'
      this.posterDialogVisible = true
      this.$http.get('/system/poster/info/' + id).then(response => {
        this.posterForm = response.data.data
      })
    },
    //提交 新建/编辑 数据
    submitPosterForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.$http.post('/system/poster/' + (this.posterForm.id ? 'update' : 'save'), this.posterForm).then((response) => {
          this.$message({
            showClose: true,
            type: "success",
            message: this.posterForm.id ? '更新轮播图信息成功' : '新建轮播图信息成功',
            onClose: () => {
              this.getPosterList()
            }
          })
        })
      })
      this.resetForm(formName)
    },

    handleAvatarSuccess(response, file) {
      this.$forceUpdate()
      this.posterForm.url = response.data;
    },

    //
    handleSelectionChange(val) {
      this.multiplieSelection = val
      this.deleteBtnStu = val.length == 0
      console.log(val);
    },
    handleSizeChange(newSize) {
      this.size = newSize
      this.getPosterList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getPosterList()
    }

  },

}

</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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