<template>
    <div class="editPwdBox">
        <span>{{ this.username + ':' + '修改密码' }}</span>
        <el-form :model="editPwdForm" :rules="editPwdRules" ref="editPwdFormRef" label-width="auto"
            class="demo-ruleForm">
            <el-form-item label="原密码" prop="oldPwd">
                <el-input v-model="editPwdForm.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="editPwdForm.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPwd">
                <el-input v-model="editPwdForm.checkPwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('editPwdFormRef')">提交</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
export default {

    data() {
        var validatePwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('密码不能为空'))
            } else if (value != this.editPwdForm.newPwd) {
                callback(new Error('两次密码不一致'))
            }else{
                callback()
            }
        }
        return {
            editPwdForm: {},
            username: this.$store.state.username,
            editPwdRules: {
                oldPwd: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码必须在6-12字符', trigger: 'blur' }
                ],
                checkPwd: [
                    { validator:validatePwd, trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        resetForm() {
            this.$refs.editPwdFormRef.resetFields()
        },
        submitForm(val) {

            this.$refs.editPwdFormRef.validate(valid => {
                if (!valid) {
                    return
                }


            })

        }
    }
}

</script>

<style scoped>
.editPwdBox {
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>