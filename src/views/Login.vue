<template>

    <el-row :gutter="24">
        <el-col :xl="6" :lg="7">
            <h2>欢迎使用xx电影后台管理系统</h2>
            <el-image style="width:160px;height:160px" :src="require('@/assets/logo.png')"></el-image>
            <p>springboot+vue前后端分离项目</p>
            <p>浙江万里学院</p>
        </el-col>
        <el-col :span="1">
            <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :xl="6" :lg="7">
            <el-form ref="loginFormRef" :model="loginForm" label-width="80px" label-position="right"
                :rules="loginRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" style="width:380px"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" style="width:380px" show-password></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="captchaCode">
                    <el-input v-model="loginForm.captchaCode" style="width:240px;float: left;" maxlength="5"></el-input>
                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha()"></el-image>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">
                        登录
                    </el-button>
                    <el-button type="primary" @click="resetForm()">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>

</template>

<script>
export default {
    data() {
        return {
            // 登录表单数据
            loginForm: {
                username: '',
                password: '',
                captchaCode: '',
                key: ''
            },
            // 验证码图片地址
            captchaImg: '',
            // 登录表单验证
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                captchaCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 5, max: 5, message: '验证码长度为5', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCaptcha()
    },
    methods: {
        // 表单登录
        submitForm() {
            this.$refs.loginFormRef.validate(valid => {
                if (!valid) {
                    this.getCaptcha()
                } else {
                    this.$http.post('/login', this.$qs.stringify(this.loginForm)).then(res => {
                      //  console.log("res=====>" + res);
                        let token = res.headers['token']
                        this.$store.commit('SET_TOKEN', token)
                        this.$store.commit('saveUsername', this.loginForm.username)
                        this.$router.push('/index')
                    }).catch((error) => {
                        console.log('异常', error)
                        this.loginForm.captchaCode = ''
                        this.getCaptcha() //获得新的验证码
                    })
                }


                //   console.log(valid);
            })
        },
        // 重置登录表单
        resetForm() {
            this.$refs.loginFormRef.resetFields()
        },
        getCaptcha() {
            this.$http.get('/captcha').then(res => {
                // console.log(res);
                this.captchaImg = res.data.data.captchaImg
                //  console.log(this.captchaImg);
                this.loginForm.key = res.data.data.key
                //   console.log(this.captchaImg);
            })

        }
    }
}

</script>

<style scoped>
.el-row {
    background: #fafafa;
    height: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
}

.el-divider {
    height: 300px;
}

.captchaImg {
    float: left;
    width: 100px;
    height: 40px;
    margin-left: 10px;
    border-radius: 5px;
}
</style>