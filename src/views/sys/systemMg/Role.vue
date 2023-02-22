<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="请输入搜索内容" clearable @clear="getRoleList">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="showDialogVisible" type="primary">新建</el-button>
          <el-button @click="deleteRole()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单数据 -->
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="名称" width="150">
        </el-table-column>
        <el-table-column prop="code" label="唯一编码" width="150">
        </el-table-column>
        <el-table-column prop="remark" label="描述" width="360">
        </el-table-column>
        <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.statu == 1" type="primary" size="mini">正常</el-tag>
            <el-tag v-else type="danger" size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editRole(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="setRole(scope.row.id)" type="text">分配权限</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteRole(scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
        :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 新建/编辑dialog -->
    <el-dialog :title="title" :visible.sync="dialogVisible" @closed="resetRoleForm('roleFormRef')" width="35%">
      <el-form ref="roleFormRef" :model="roleForm" label-width="100px" :rules="roleFormRules">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="唯一编码">
          <el-input v-model="roleForm.code"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="描述">
          <el-input v-model="roleForm.remark"></el-input>
        </el-form-item>
        <el-form-item prop="statu" label="状态" v-if="isShow">
          <el-radio-group v-model="roleForm.statu">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetRoleForm('roleFormRef')">取消</el-button>
        <el-button type="primary" @click="submitForm('roleFormRef')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 权限分配dialog -->
    <el-dialog title="分配权限" :visible.sync="permDialogVisible" @closed="resetPermForm('permFormRef')" width="25%">
      <el-form ref="permFormRef" :model="permForm" label-width="100px">
        <el-tree :data="permTreedata" :props="defaultProps" show-checkbox default-expand-all check-strictly
          node-key="id" :default-checked-keys="defKeys" ref="permTreeRef">
        </el-tree>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPermForm('permFormRef')">取消</el-button>
        <el-button type="primary" @click="submitPermForm('permFormRef')">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      // 控制批量删除按钮是否可用
      deleteBtnStu: true,
      // 搜索表单的搜索条件（name）
      searchForm: {},
      // 控制新建/编辑dialog的显示与隐藏
      dialogVisible: false,
      // 表格列表数据
      tableData: [],
      // 分页数据
      current: 1,
      size: 5,
      total: 0,
      // 控制权限分配dialog的显示与隐藏
      permDialogVisible: false,
      // 权限列表数据
      permTreedata: [],
      // 属性控件参数
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      permForm: {},
      // 默认选中数组id值
      defKeys: [],
      // 角色表单数据
      roleForm: {},
      // 选择框数据
      selection: [],
      // 添加角色表单验证规则
      roleFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      // 改变新建/编辑dialog的标题
      title: '',
      // 控制是否展示状态单选按钮
      isShow: false

    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色信息，对应角色的权限列表，及分页数据
    async getRoleList() {
      await this.$http.get('/system/role/list', {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        if (res.data.code !== 200) {
          return this.$message({
            showClose: true,
            type: 'danger',
            message: '获取角色列表信息失败',
          })
        }
        this.tableData = res.data.data.records,
          this.total = res.data.data.total,
          this.current = res.data.data.current,
          this.size = res.data.data.size
      })
      await this.$http.get('/system/menu/list').then(res => {
        this.permTreedata = res.data.data
      })
    },
    // 新建dialog的显示与标题的改变
    showDialogVisible() {
      this.title = '新建角色'
      this.isShow = false
      this.dialogVisible = true
    },
    // 编辑dialog的显示与标题的改变，并通过id获取对应数据的展示
    async editRole(id) {
      this.title = '编辑角色'
      this.isShow = true
      this.dialogVisible = true
      await this.$http.get('/system/role/info' + id).then(res => {
        if (res.data.code !== 200) {
          return this.$message({
            showClose: true,
            type: 'danger',
            message: '获取该角色信息失败',
          })
        }
        this.roleForm = res.data.data
      })
    },
    // 删除角色
    async deleteRole(id) {
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
      var roleIds = []
      id ? roleIds.push(id) : this.selection.forEach(val => {
        roleIds.push(val.id)
      })
      await this.$http.post('/system/role/delete', roleIds).then(res => {
        if (res.data.code !== 200) {
          return this.$message({
            showClose: true,
            type: 'danger',
            message: '角色删除失败',
          })
        }
        this.$message({
          showClose: true,
          message: '角色信息删除成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        })
      })
    },
    // 分配权限
    setRole(id) {
      this.$http.get('/system/role/info' + id).then(res => {
        if (res.data.code !== 200) {
          return this.$message({
            showClose: true,
            type: 'danger',
            message: '获取该角色权限信息失败',
          })
        }
        this.$refs.permTreeRef.setCheckedKeys(res.data.data.menuIds)
        this.permForm = res.data.data
      })
      this.permDialogVisible = true
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.size = newSize
      this.getRoleList()
    },
    //监听pagenum改变的事件
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getRoleList()
    },
    // 
    handleSelectionChange(val) {
      this.selection = val
      this.deleteBtnStu = val.length == 0
      // *****-----****
      //  console.log(val);
    },
    // 重置角色表单信息
    resetRoleForm(formName) {
      this.$refs[formName].resetFields()
      this.roleForm = {}
      this.dialogVisible = false
    },
    // 重置权限表单信息
    resetPermForm(formName) {
      this.$refs[formName].resetFields()
      this.permForm = {}
      this.permDialogVisible = false
    },
    // 提交权限修改信息
    async submitPermForm(formName) {
      var menuIds = this.$refs.permTreeRef.getCheckedKeys()
      await this.$http.post('/system/role/perm/' + this.permForm.id, menuIds).then(res => {
        if (res.data.code !== 200) {
          return this.$message({
            showClose: true,
            type: 'danger',
            message: '角色更新失败',
          })
        }
        this.$message({
          showClose: true,
          type: 'success',
          message: '角色权限修改成功',
          onClose: () => {
            this.getRoleList()
          }
        })
      })
      this.resetPermForm(formName)
    },
    // 提交新建/编辑dialog表单数据
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        await this.$http.post('/system/role/' + (this.roleForm.id ? 'update' : 'save'), this.roleForm).then(res => {
          if (res.data.code !== 200) {
            return this.$message({
              showClose: true,
              type: 'danger',
              message: this.roleForm.id ? '更新角色数据失败' : '新建角色失败',
            })
          }
          this.$message({
            showClose: true,
            type: 'success',
            message: this.roleForm.id ? '更新角色数据成功' : '新建角色成功',
            onClose: () => {
              this.getRoleList()
            }
          })
        })
      })
      this.resetRoleForm(formName)
    }
  }
}
</script>

<style scoped>

</style>