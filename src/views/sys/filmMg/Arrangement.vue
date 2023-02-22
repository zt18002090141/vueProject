<template>

  <div>
    <el-card>
      <!-- 头部 搜索 新建 批量删除 -->
      <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item>
            <el-input v-model="searchForm.name" placeholder="请输入搜索内容" clearable @clear="getArrangementList">
            <el-button slot="append" icon="el-icon-search" @click="getArrangementList"></el-button>
           </el-input>

        </el-form-item>

        <el-form-item>
          <el-button @click="showCategoryDialog" type="primary">新建</el-button>
          <el-button @click="deleteArrangement()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
          <!-- <el-popconfirm title="这是一段内容确定删除吗？" @confirm="deleteArrangement()">
            <el-button type="danger" :disabled="deleteBtnStu" slot="reference">批量删除</el-button>
          </el-popconfirm> -->
        </el-form-item>

      </el-form>

      <!-- 排片表单数据展示 -->
      <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border :cell-style="{ padding: '2px' }"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="name" label="电影名称" width="120"></el-table-column>        
        <el-table-column prop="price" label="价格(元)" width="120"></el-table-column>
        <el-table-column prop="type" label="电影类型" width="120" >
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.type" size="mini" type="primary" :key="item">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="seatNumber" label="座位数(个)" width="120"></el-table-column>
        <el-table-column prop="boxOffice" label="票房(万元)" width="120"></el-table-column>
        <el-table-column prop="date" label="放映日期" width="120"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="120"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="120"></el-table-column>
        <el-table-column prop="statu" label="状态" width="120">
          <template slot-scope="scope">
            <!-- 1 正在播放  2 失效 3 还未开始 -->
            <el-tag v-if="(scope.row.statu == 2)" size="mini" type="warning">正在播放</el-tag>
            <el-tag v-else-if="(scope.row.statu == 1)" size="mini" type="info">已经失效</el-tag>
            <el-tag v-else size="mini" type="primary">即将开始</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editArrangement(scope.row.id)" type="text">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="deleteArrangement(scope.row.id)" type="text">删除</el-button>
            <!-- <template>
                <el-popconfirm title="确定要删除该电影吗？" @confirm="deleteArrangement(scope.row.id)">
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
    <el-dialog :title="title" :visible.sync="arrangementDialogVisible" @closed="resetForm('arrangementForm')"
      width="25%">
      <el-form ref="arrangementForm" :model="arrangementForm" label-width="100px" :rules="arrangementFormRules">
        <!-- <el-form-item label="用户名称" prop="name">
            <el-input v-model="categoryForm.name"></el-input>
          </el-form-item> -->
        <el-form-item label="电影选择" prop="name">
          <el-select v-model="arrangementForm.name" placeholder="请选择电影">
            <el-option v-for="(item, index) in filmList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价(张)" prop="price">
          <el-input v-model="arrangementForm.price" auto-complete="off" size="medium" width="30%"></el-input>
        </el-form-item>
        <el-form-item label="2D/3D" prop="type">
          <el-radio-group v-model="arrangementForm.type">
            <el-radio :label="'0'"  >2D</el-radio>
            <el-radio :label="'1'"  >3D</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="放映日期" prop="date">
          <el-date-picker v-model="arrangementForm.date" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="arrangementForm.startTime" placeholder="电影开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker v-model="arrangementForm.endTime" placeholder="电影结束时间" />
        </el-form-item>
        <el-form-item label="座位数" prop="seatNumber">
          <el-input-number v-model="arrangementForm.seatNumber" :min="1" label="排序号"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('arrangementForm')">取消</el-button>
        <el-button type="primary" @click="submitarrangementForm('arrangementForm')">确定</el-button>
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
      arrangementDialogVisible: false,
      // 改变新建/编辑dialog的标题
      title: '',
      // 表格数据
      tableData: [],
      // 分类dialog表单数据
      arrangementForm: {},
      moive: 0,
      // 分类dialog表单验证规则
      arrangementFormRules: {
        name: [{ required: true, message: '请选择电影名称', trigger: 'blur' }],
        //todo:价格控制在 20 - 80之间
        price: [{ required: true, message: '请给定正常的价格', trigger: 'blur' }],
        type: [{ required: true, message: '请选择电影2D/3D', trigger: 'blur' }],
        date: [{ required: true, message: '请选择电影放映时间', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择电影开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择电影结束时间', trigger: 'blur' }],
        seatNumber: [{ required: true, message: '请给定影院座位数', trigger: 'blur' }],
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
    this.getArrangementList()
    //获取电影表中的电影
    this.$http.get('/system/film/list').then(res => {
      this.filmList = res.data.data.records;
      // console.log(this.filmList);
    })
  },
  methods: {
    getArrangementList() {
      this.$http.get("/system/arrangement/list", {
        params: {
          name: this.searchForm.name,
          time:this.searchForm.time,
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
          val.startTime = this.dayjs(val.startTime).format("HH:mm:ss")
          val.endTime = this.dayjs(val.endTime).format("HH:mm:ss")
        })
      })
    },
    showCategoryDialog() {
      this.arrangementDialogVisible = true
      this.title = '新建排片'
      //this.isUse = true
    },
    //清空
    resetForm(formName) {

      this.$refs[formName].resetFields()
      this.arrangementDialogVisible = false
      this.arrangementForm = {}
    },
    //编辑
    editArrangement(id) {

      this.title = '编辑分类'

      this.$http.get('/system/arrangement/info/' + id).then(res => {
        this.arrangementForm = res.data.data
      })
      //this.isUse = false
      this.arrangementDialogVisible = true
      this.arrangementForm = {}

    },

    //提交
    submitarrangementForm(formName) {

      this.$refs[formName].validate(valid => {
        if (!valid) return
        this.$http.post('/system/arrangement/' + (this.arrangementForm.id ? 'update' : 'save'), this.arrangementForm).then(res => {
          if(res.data.code == 200){
            this.$message({
              showClose: true,
              type: "success",
              message: this.arrangementForm.id ? '更新排片信息成功' : '新建排片 信息成功',
              onClose: () => {
                this.getArrangementList()
              }
            })
          }else {
            this.$message({
              showClose: true,
              type: "error",
              message: "新建失败",
              onClose: () => {
                this.getArrangementList()
              }
            })
          } 
        })
      })
      this.arrangementDialogVisible = false

    },
    //删除单个或者多个
    async deleteArrangement(id) {
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
      this.$http.post('/system/arrangement/delete', ids).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error("删除排片数据失败")
        }
        this.$message({
          showClose: true,
          message: '排片数据删除成功',
          type: 'success',
          onClose: () => {
            this.getArrangementList()
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
      this.getArrangementList()
    },
    handleCurrentChange(newNum) {
      this.current = newNum
      this.getArrangementList()
    }
  }
}

</script>

<style scoped>

</style>