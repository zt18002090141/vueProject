<template>

  <div>
    <el-card>
      <!-- 工具栏 -->
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.username" placeholder="请输入搜索内容" clearable @clear="getFansList">
            <el-button slot="append" icon="el-icon-search" @click="getFansList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showFansDialogForm" type="primary">新建</el-button>
          <el-button @click="deleteFans()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格 -->
      <el-table :cell-style="{ padding: '2px' }" :data="tableData" border default-expand-all stripe
        style="width: 100%; margin-bottom:20px; " @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column label="头像" width="55">
          <template slot-scope="scope">
            <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="手机号码" width="150">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="90">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="50">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.sex == 1" type="success">男</el-tag>
            <el-tag size="mini" v-else type="danger">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="statu" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.statu == 1" type="success">正常</el-tag>
            <el-tag size="mini" v-else-if="scope.row.statu == 0" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- TODO:新建需要进行权限验证 -->
            <el-button type="text" @click="resetPass(scope.row.id, scope.row.username)">重置密码</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="editFans(scope.row.id)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deleteFans(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-card>
    <!-- 新增或编辑用户对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%" @closed="resetForm('fansFormRef')">
      <el-form :model="fansForm" ref="fansFormRef" :rules="fansFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="fansForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="fansForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="fansForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="fansForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('fansFormRef')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('fansFormRef')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    // 验证邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 获取用户列表的参数对象
    var checkTel = (rule, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      //搜索栏对象
      searchForm: {},
      title: '',
      //新建与编辑用户对话框是否显示
      dialogFormVisible: false,
      //用户分配角色对话框
      roleDialogFormVisble: false,
      //表示使用复选框 选中的多行用户对象
      multiplieSelection: [],
      //编辑用户的表单对象
      fansForm: {},
      //批量删除的按钮是否可用
      deleteBtnStu: true,
      //用户表格的数据:
      tableData: [],
      current: 1, //分页：当前页码，默认显示第一页
      size: 5, //分页：一页显示多少条数据，默认显示10条
      total: 0, //分页：所有的角色记录数
      fansFormRules: {
        id: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: checkTel, trigger: 'blur' },],
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' },],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getFansList()
  },
  methods: {
    //获得所有用户的信息
    getFansList() {
      //获得用户的信息
      this.$http.get('/system/fans/list', {
        params: {
          username: this.searchForm.username, //搜索栏里的  搜索名称
          //当前的页码
          current: this.current,
          //一页显示多少条
          size: this.size,
        },
      }).then((response) => {
        console.log("1");
          this.tableData = response.data.data.records
          this.size = response.data.data.size
          this.current = response.data.data.current
          this.total = response.data.data.total
        })
    },
    showFansDialogForm() {
      this.dialogFormVisible = true
      this.title = '新建粉丝'
    },
    //删除一个或批量删除用户的方法  参数：用户编号
    async deleteFans(id) {
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
      var ids = [] //存储需要删除的所有用户id
      id ? ids.push(id) : this.multiplieSelection.forEach((row) => {
        ids.push(row.id)
      })
      //    console.log('删除的id是', ids)
      this.$http.post('/system/fans/delete', ids).then((response) => {
        this.$message({
          showClose: true,
          message: '删除粉丝成功',
          type: 'success',
          onClose: () => {
            //数据提交成功，重新加载页面角色信息
            this.getFansList()
          },
        })
      })
    },
    //复选框选中的事件
    handleSelectionChange(rows) {
      this.multiplieSelection = rows //得到复选框 选中 多个用户对象
      this.deleteBtnStu = this.multiplieSelection.length == 0 //如果选择的数量不是0，批量删除按钮可用
    },

    //编辑用户的方法
    editFans(id) {
      //编辑用户，首先请求服务器API ,获得当前编辑 用户信息的数据，显示在对话框表单中
      this.$http.get('/system/fans/info/' + id).then((response) => {
        this.fansForm = response.data.data
        this.dialogFormVisible = true //显示编辑用户对话框
      })
    },
    //重置 用户编辑对话框 表单
    resetForm(formName) {
      // console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
      this.editForm = {}
      this.dialogFormVisible = false //编辑 角色对话框 为false不显示
    },
    //重置密码的方法
    resetPass(id, username) {
      this.$confirm(
        '重置用户【' + username + '】的密码，是否继续执行该操作',
        '重置密码提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        //请求服务器端，进行重置密码的请求操作
        this.$http.post('/system/fans/repass/' + id).then((response) => {
          if (response.data.code == 200 && response.data.code != undefined) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '重置密码成功!',
            })
          }
        })
      })
    },
    //提交新建或编辑用户
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        this.$http.post('/system/fans/' + (this.fansForm.id ? 'update' : 'save'), this.fansForm)
          .then((response) => {
            //提交成功，重置表单
            this.$message({
              showClose: true,
              message: this.fansForm.id ? '客户更新成功' : response.data.message,
              type: 'success',
              onClose: () => {
                //数据提交成功，重新加载页面用户信息
                this.getFansList()
              },
            })
          })
      })
      this.resetForm(formName)
    },
    //修改一页显示的记录数
    handleSizeChange(val) {
      this.size = val
      this.getFansList()
    },
    //点击页码的方法
    handleCurrentChange(val) {
      this.current = val
      this.getFansList()
    },
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