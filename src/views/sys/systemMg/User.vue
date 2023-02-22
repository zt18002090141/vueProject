<template>

  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.username" placeholder="请输入搜索内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showUserDialog" type="primary" v-if="hasAuth('sys:user:save')">新建</el-button>
          <el-button @click="deleteUser()" type="danger" :disabled="deleteBtnStu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户表格数据列表 -->
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column label="头像" width="60">
          <template slot-scope="scope">
            <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="名称" width="120">
        </el-table-column>
        <el-table-column prop="roles" label="角色名称" width="220">
          <template slot-scope="scope">
            <el-tag :key="item.id" v-for="item in scope.row.roles" style="margin-left:5px" size="mini">{{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <el-table-column prop="statu" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.statu == 1)" size="mini" type="primary">正常</el-tag>
            <el-tag v-else size="mini" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="resetPwd(scope.row.id, scope.row.username)" type="text">重置密码</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="setRole(scope.row.id)" type="text">分配角色</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteUser(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 权限角色dialog -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" @closed="resetForm('roleFormRef')" width="25%">
      <el-form ref="roleFormRef" :model="roleForm" label-width="100px">
        <el-tree :data="roleTreedata" :props="defaultProps" show-checkbox default-expand-all check-strictly
          node-key="id" :default-checked-keys="defKeys" ref="roleTreeRef">
        </el-tree>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('roleFormRef')">取消</el-button>
        <el-button type="primary" @click="submitRoleForm('roleFormRef')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 新建用户Dialog -->
    <el-dialog :title="title" :visible.sync="userDialogVisible" @closed="resetForm('userFormRef')" width="25%">
      <el-form ref="userFormRef" :model="userForm" label-width="100px" :rules="userFormRules">
        <!-- TODO -->
        <el-form-item label="头像" prop="avatar" v-if="title == '编辑用户'">
          <el-upload action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :headers="headers">
            <img V-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <i V-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="statu" label="状态">
          <el-radio-group v-model="userForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('userFormRef')">取消</el-button>
        <el-button type="primary" @click="submitUserForm('userFormRef')">确定</el-button>
      </span>
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
      // 控制删除按钮是否可用
      deleteBtnStu: true,
      // 搜索表单数据
      searchForm: {},
      // 用户数据
      tableData: [],
      current: 1,
      size: 10,
      total: 20,
      roleDialogVisible: false,
      // 树型控件数据
      roleTreedata: [],
      // 属性控件参数
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      //表示使用复选框 选中的多行用户对象
      multiplieSelection: [],
      defKeys: [],
      // 角色表单数据
      roleForm: {},
      // 添加用户表单数据
      userForm: {},
      userDialogVisible: false,
      title: '',
      // 添加规则
      userFormRules: {
        username: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        email: [{ required: true, message: '请输入唯一编码', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' },],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: checkTel, trigger: 'blur' },],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      // 上传图片header
      //   headers: { token: localstorage.getItem('token') },
      headers: {
        token: localStorage.getItem('token')
      }
    }
  },
  created() {
    this.getUserList()
    this.$http.get('/system/role/list').then(res => {
      this.roleTreedata = res.data.data.records
    })
  },

  methods: {
    // 获取用户数据列表
    getUserList() {
      this.$http.get('/system/user/list', {
        params: {
          username: this.searchForm.username,
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
    // 复选框的事件
    handleSelectionChange(val) {
      this.multiplieSelection = val //得到复选框 选中 多个用户对象
      this.deleteBtnStu = val.length == 0 //如果选择的数量不是0，批量删除按钮可用
    },
    // 控制addDIalog的显示与隐藏
    showUserDialog() {
      this.userDialogVisible = true
      this.title = '新建用户'
    },
    // 删除用户
    async deleteUser(id) {
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
      var userIds = []
      id ? userIds.push(id) : this.multiplieSelection.forEach(val => {
        userIds.push(val.id)
      })
      this.$http.post('/system/user/delete', userIds).then(res => {
        this.$message({
          showClose: true,
          message: '用户信息删除成功',
          type: 'success',
          onClose: () => {
            this.getUserList()
          }
        })
      })
    },
    // 编辑用户
    editUser(id) {
      this.$http.get('/system/user/info/' + id).then(res => {
        this.userForm = res.data.data
      })
      this.userDialogVisible = true
      this.title = '编辑用户'
    },
    // 分配角色
    setRole(id) {
      this.$http.get('/system/user/info/' + id).then(res => {
        let system_user = res.data.data
        this.roleForm = system_user
        var roles = []
        system_user.roles.forEach(role => {
          roles.push(role.id)
        })
        this.$refs.roleTreeRef.setCheckedKeys(roles)
      })
      this.roleDialogVisible = true
    },
    // 重置密码
    resetPwd(id, username) {
      this.$confirm(
        `是否重置【${username}】的密码`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'waring',
        }
      ).then(() => {
        this.$http.post('/system/user/repass/' + id).then(res => {
          if (res.data.code == 200 && res.data.code != undefined) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '重置密码成功'
            })
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 监听分页参数变化
    handleSizeChange(newSize) {
      this.size = newSize
      this.getUserList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getUserList()
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.roleDialogVisible = false
      this.userDialogVisible = false
    },
    // 提交分配角色表单
    submitRoleForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        var roleIds = this.$refs.roleTreeRef.getCheckedKeys()
        this.$http.post('/system/user/role/' + this.roleForm.id, roleIds).then(res => {
          // 判断
          this.$message({
            showClose: true,
            type: 'success',
            message: '修改用户角色信息成功',
            onClose: () => {
              this.getUserList()
            }
          })
        })
      })
      this.roleDialogVisible = false
    },
    // 提交用户表单
    submitUserForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        await this.$http.post('/system/user/' + (this.userForm.id ? 'update' : 'save'), this.userForm).then(res => {
          this.$message({
            showClose: true,
            type: 'success',
            message: '修改成功',
            onClose: () => {
              this.getUserList()
            }
          })
        })
      })
      this.resetForm(formName)
    },
    // 图片上传成功回调
    handleAvatarSuccess(response, file) {
      this.userForm.avatar = response.data
    }

  }
}

</script>

<style scoped>
.avatar {
  width: 60px;
  height: 60px;
}
</style>