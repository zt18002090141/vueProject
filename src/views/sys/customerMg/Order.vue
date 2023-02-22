<template>

    <div>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-form ref="searchFormRef" :model="searchForm" label-width="80px" :inline="true">
                <el-form-item>
                    <el-input v-model="searchForm.id" placeholder="请输入订单ID" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="deleteOrder()" type="danger" :disabled="deleteBtnStu">批量删除</el-button>
                </el-form-item>
            </el-form>
            <!-- 订单列表数据 -->
            <el-table :data="tableData" stripe style="width: 100%;margin-bottom: 20px" border
                :cell-style="{ padding: '2px' }" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column prop="id" label="订单ID" width="80">
                </el-table-column>
                <el-table-column prop="uid" label="客户ID" width="150">
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="150">
                </el-table-column>
                <!-- TODO 多表查询，通过aid 来获取排片信息 -->
                <!-- <el-table-column  width="150">
        </el-table-column> -->
                <el-table-column prop="seats" label="座位号" width="150">
                </el-table-column>
                <el-table-column prop="price" label="金额" width="80">
                </el-table-column>
                <el-table-column label="是否退款" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="(scope.row.isRefund == 1)" size="mini" type="danger">已退款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="payAt" label="支付时间" width="150">
                </el-table-column>
                <el-table-column prop="created" label="创建时间" width="150">
                </el-table-column>
                <el-table-column prop="statu" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="(scope.row.statu == 1)" size="mini" type="primary">正常</el-tag>
                        <el-tag v-else size="mini" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteOrder(scope.row.id)" type="text">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button @click="showDetails(scope.row.uid,scope.row.aid)" type="text">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current"
                :page-sizes="[5, 10, 15, 20]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <el-dialog title="详情" width="30%" :visible.sync="dialogVisible">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户信息" name="fansInfo">
                    <el-row :gutter="24">
                        <el-col :span="12">客户ID</el-col>
                        <el-col :span="12">{{ fansInfo.id }}</el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">客户名称</el-col>
                        <el-col :span="12">{{ fansInfo.username }}</el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">客户头像</el-col>
                        <el-col :span="12">
                            <el-avatar size="small" :src="fansInfo.avatar"></el-avatar></el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">客户性别</el-col>
                        <el-col :span="12">
                            <span v-if="fansInfo.sex == '1'">男</span>
                            <span v-if="fansInfo.sex == '0'">女</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">客户邮箱</el-col>
                        <el-col :span="12">{{ fansInfo.email }}</el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="排片信息" name="arrangementInfo">
                    <el-row :gutter="24">
                        <el-col :span="12">电影名称</el-col>
                        <el-col :span="12">{{ arrangementInfo.name }}</el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">放映时间</el-col>
                        <el-col :span="12">{{ arrangementInfo.startTime }}-----{{arrangementInfo.endTime}}</el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
    data() {
        return {
            // 搜索条件（通过订单id来查询订单）
            searchForm: {},
            // 控制批量删除按钮是否可用
            deleteBtnStu: true,
            // 表格数据列表
            tableData: [],
            // 复选框数组
            selection: [],
            // 分页数据
            size: 5,
            current: 1,
            total: 0,
            fansInfo: {},
            dialogVisible: false,
            activeName: 'fansInfo',
            // 保存tabID
            fansInfoId: '',
            aInfoId:'',
            fansInfo: {},
            arrangementInfo: {}


        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        // 获取订单列表数据
        getOrderList() {
            this.$http.get('/system/order/list', {
                params: {
                    id: this.searchForm.id,
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
        // 复选框事件
        handleSelectionChange(val) {
            this.selection = val
            this.deleteBtnStu = val.length == 0
        },
        // 删除订单
        async deleteOrder(id) {
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
            console.log(ids);
            this.$http.post('/system/order/delete', ids).then(res => {
                this.$message({
                    showClose: true,
                    message: '删除菜单成功',
                    type: 'success',
                    onClose: () => {
                        this.getOrderList()
                    }
                })
            })
        },
        handleSizeChange(newSize) {
            this.size = newSize
            this.getOrderList()
        },
        handleCurrentChange(newCurrent) {
            this.size = newCurrent
            this.getOrderList()
        },
        showDetails(uid,aid) {
            console.log(uid);
            this.dialogVisible = true
            this.fansInfoId = uid
            this.aInfoId=aid
            this.$http.get('/system/order/info/' + uid).then(res => {
                this.fansInfo = res.data.data
            })

        },
        getFansInfo() {
            this.$http.get('/system/fans/info/' + this.fansInfoId).then(res => {
                this.fansInfo = res.data.data
            })
        },
        getArranmentInfo() {
            this.$http.get('/system/order/arrinfo/' + this.aInfoId).then(res => {
                this.arrangementInfo = res.data.data
            })
        },
        handleClick(tab) {
            //  console.log(tab);
            if (tab.paneName == 'fansInfo') {
                this.getFansInfo()
            }
            if (tab.paneName == 'arrangementInfo') {
                this.getArranmentInfo()
            }
        }
    }

}

</script>

<style scoped>

</style>