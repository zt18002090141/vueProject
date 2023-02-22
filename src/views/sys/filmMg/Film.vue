<template>

  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入搜索内容" clearable @clear="getFilmList">
            <el-button slot="append" icon="el-icon-search" @click="getFilmList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showDialogVisible" type="primary">新建</el-button>
          <el-button @click="deleteFilm()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 电影表格数据 -->
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="电影名称" width="250">
        </el-table-column>
        <el-table-column prop="releaseTime" label="上映时间" width="150">
        </el-table-column>
        <el-table-column prop="region" label="地区" width="150">
        </el-table-column>
        <el-table-column prop="grade" label="评分" width="100">
        </el-table-column>
        <!-- todo 多表查询 -->
        <el-table-column label="类型" width="120">
          <template slot-scope="scope">
            <el-tag :key="item.id" v-for="item in scope.row.category" style="margin-left:5px" size="mini">{{ item.name
            }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="120">
          <!-- todo图片 -->
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 75px" :src="scope.row.cover" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="120">
        </el-table-column>
        <el-table-column prop="statu" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.statu == 1)" size="mini" type="primary">正常</el-tag>
            <el-tag v-else size="mini" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editFilm(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteFilm(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!--新建/编辑dialog  -->
    <el-dialog :title="title" :visible.sync="filmDialogVisible" @closed="resetForm('filmFormRef')" width="30%">
      <el-form ref="filmFormRef" :model="filmForm" label-width="100px" :rules="filmFormRules">
        <!-- TODO -->
        <el-form-item label="封面" prop="cover">
          <el-upload action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :headers="headers">
            <img V-if="filmForm.cover" :src="filmForm.cover" class="avatar" style="width:80px;height:100px">
            <i V-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="电影名称" prop="name">
          <el-input v-model="filmForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-select v-model="filmForm.categoryId" placeholder="请选择">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评分" prop="grade">
          <el-input v-model="filmForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="上映时间" prop="releaseTime">
          <el-date-picker v-model="filmForm.releaseTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地区" prop="region">
          <el-input v-model="filmForm.region"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model="filmForm.duration"></el-input>
        </el-form-item>
        <el-form-item prop="statu" label="状态">
          <el-radio-group v-model="filmForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('filmFormRef')">取消</el-button>
        <el-button type="primary" @click="submitFilmForm('filmFormRef')">确定</el-button>
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
      // 控制批量删除按钮是否可用
      deleteBtnStu: true,
      // 电影表格数据
      tableData: [],
      // 新建/编辑dialog标题改变
      title: '',
      // 控制新建/编辑dialog的显示与隐藏
      filmDialogVisible: false,
      // 复选框数组
      selection: [],
      // 分页参数
      size: 5,
      current: 1,
      total: 0,
      // 新建/编辑dialog表单数据
      filmForm: {},
      // 新建/编辑dialog表单验证规则
      filmFormRules: {
        name: [{ required: true, message: '请输入影片名称', trigger: 'blur' }],
        releaseTime: [{ required: true, message: '请输入上映时间', trigger: 'blur' }],
        region: [{ required: true, message: '请输入地区', trigger: 'blur' }],
        cover: [{ required: true, message: '请输入请选择封面', trigger: 'blur' }],
        duration: [{ required: true, message: '请输入影片时长', trigger: 'blur' }],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      // 上传图片header
      //   headers: { token: localstorage.getItem('token') },
      headers: {
        token: localStorage.getItem('token')
      },
      categoryList: []

    }
  },
  created() {
    this.getFilmList()
  },
  methods: {
    // 获取电影表单数据列表
    getFilmList() {
      this.$http.get('/system/film/list', {
        params: {
          name: this.searchForm.name,
          size: this.size,
          current: this.current
        }
      }).then(res => {
        console.log("bug---------------------------------");
        console.log(res.data.data.records);
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
        // this.tableData.category.name=res.data.data.records.category.name
      })
      this.$http.get('/system/category/list').then(res => {
        this.categoryList = res.data.data.records
        // console.log("bug---------------------------------");
        // console.log(res.data.data.records);
      })
    },
    // 控制新建dialog的显示
    showDialogVisible() {
      this.title = '新建电影'
      this.filmDialogVisible = true
    },
    // 复选框事件
    handleSelectionChange(val) {
      this.selection = val
      this.deleteBtnStu = val.length == 0
    },
    // 编辑影片
    editFilm(id) {
      this.filmDialogVisible = true
      this.title = '编辑电影'
      this.$http.get("/system/film/info/" + id).then(res => {
        this.filmForm = res.data.data

      })
      console.log(id);
    },
    // 删除影片数据
    async deleteFilm(id) {
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
      id ? ids.push(id) : this.selection.forEach(val => { ids.push(val.id) })
      this.$http.post('/system/film/delete', ids).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error("删除影片数据失败")
        }
        this.$message({
          showClose: true,
          message: '影片数据删除成功',
          type: 'success',
          onClose: () => {
            this.getFilmList()
          }
        })
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.filmDialogVisible = false
      this.filmForm={}
    },
    // 监听分页参数变化
    handleSizeChange(newSize) {
      this.size = newSize
      this.getFilmList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getFilmList()
    },
    // 上传成功
    handleAvatarSuccess(response, file) {
      this.filmForm.cover = response.data
    },

    submitFilmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http.post('/system/film/' + (this.filmForm.id ? 'update' : 'save'), this.filmForm).then(res => {
          this.$message({
            showClose: true,
            type: 'success',
            message: this.filmForm.id ? '编辑影片信息成功' : '新建影片成功',
            onClose: () => {
              this.getFilmList()
            }
          })
        })
      })
      this.resetForm(formName)
    },
  }
}

</script>

<style scoped>

</style>