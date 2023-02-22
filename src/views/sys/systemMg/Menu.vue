<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="showDialogVisible" v-if="hasAuth('sys:menu:save')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border default-expand-all row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :cell-style="{ padding: '2px' }">
      <el-table-column prop="name" label="名称" width="160" sortable>
      </el-table-column>
      <el-table-column prop="perms" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" width="170">
      </el-table-column>
      <el-table-column label="菜单类型" prop="type" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" type="primary" size="mini">0</el-tag>
          <el-tag v-else-if="scope.row.type == 1" type="warning" size="mini">1</el-tag>
          <el-tag v-else type="info" size="mini">2</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="菜单URL" width="160">
      </el-table-column>
      <el-table-column prop="component" label="菜单组件" width="200">
      </el-table-column>
      <el-table-column prop="ordernum" label="排序号" width="70">
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu == 1" type="primary" size="mini">正常</el-tag>
          <el-tag v-else type="danger" size="mini" >禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editMenu(scope.row.id)" type="text">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button @click="deleteMenu(scope.row.id)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @close="(dialogVisible = false)">
      <el-form :model="menuForm" :rules="menuFormRules" ref="menuFormRef" label-width="100px">
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="menuForm.parentId" placeholder="请选择选择上级菜单">
            <el-option label="/" value="0"></el-option>
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id" :key="item.id">
                <span>{{ item.name }}</span>
              </el-option>
              <el-option v-for="child in item.children" :key="child.id" :value="child.id" :label="child.name">
                <span>{{ "--" + child.name }}</span>
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="perms">
          <el-input v-model="menuForm.perms" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="path">
          <el-input v-model="menuForm.path" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="menuForm.component" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="menuForm.statu">
            <el-radio :label="0">0</el-radio>
            <el-radio :label="1">1</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序号" prop="ordernum">
          <el-input-number v-model="menuForm.ordernum" :min="1" label="排序号"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('menuFormRef')">取 消</el-button>
        <el-button type="primary" @click="submitForm('menuFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>

</template>

<script>
export default {
  data() {
    return {
      // 表格列表数据
      tableData: [],
      // 控制新建/编辑dialog的显示与隐藏
      dialogVisible: false,
      // 新建/编辑dialog的表单数据
      menuForm: {},
      // 新建/编辑dialog的表单验证规则
      menuFormRules: {
        parentId: [
          { required: true, message: '请输入父组件', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        perms: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入菜单类型', trigger: 'blur' }
        ],
        statu: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        ordernum: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ],
      },
      // 改变新建/编辑dialog的标题
      title: ''
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    // 获得所有菜单数据
    getMenus() {
      this.$http.get('/system/menu/list').then(res => {
        this.tableData = res.data.data
      })
    },
    // 新建dialog的显示与标题的改变
    showDialogVisible() {
      this.dialogVisible = true
      this.title = '新建菜单'
    },
    // 编辑dialog的显示与标题的改变，并通过id获取对应数据的展示
    editMenu(id) {
      this.title = '编辑菜单'
      this.$http.get('/system/menu/info/' + id).then(res => {
        this.menuForm = res.data.data
      })
      this.dialogVisible = true
    },
    // 通过id删除对应菜单
    async deleteMenu(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该菜单，是否继续',
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
      await this.$http.post('/system/menu/delete' + id).then(res => {
        if (res.data.code == 200) {
          this.$message({
            showClose: true,
            message: '删除菜单成功',
            type: 'success',
            onClose: () => {
              this.getMenus()
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.menuForm = {}
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.$http.post('/system/menu/' + (this.menuForm.id ? 'update' : 'save'), this.menuForm).then(res => {
          this.$message({
            showClose: true,
            message: '添加菜单成功',
            type: 'success',
            onClose: () => {
              this.getMenus()
              this.resetForm('menuFormRef')
            }
          })
          this.dialogVisible = false
        })
      })
    }
  }
}

</script>

<style scoped>
.el-dialog {
  margin: 10px 20px;
}

.el-dialog .el-form .el-form-item {
  margin-bottom: 18px;
}
</style>