<template>

    <el-container class="home-container">
        <el-aside width="200px">
            <Menu></Menu>
        </el-aside>
        <el-container>
            <el-header style="height:55px">
                <strong>xx电影后台管理系统</strong>
                <div class="header-avatar">
                    <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link :to="{ name: 'userCenter' }">个人中心</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'EditPwd' }">修改密码</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <Tabs></Tabs>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import Menu from '@/components/MenuBar.vue'
import Tabs from '@/components/Tab.vue'
export default {
    data() {
        return {
            userInfo: {
                id: '',
                username: '',
                avatar: '',
            }
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        logout() {
            this.$http.post('/logout').then(res => {
                //   console.log('11');
                sessionStorage.clear()
                localStorage.clear()
                this.$router.push('/login')
                this.$store.commit('resetState')
            })
        },
        getUserInfo() {
            this.$http.get('/user/userInfo').then(res => {
                //  console.log(res);
                this.userInfo = res.data.data
            })
        }
    },
    components: {
        Menu, Tabs
    }
}

</script>

<style scoped lang="less">
.home-container {
    height: 100%;
    padding: 0;
    margin: 0;
}

.el-header {
    background-color: rgba(55, 61, 65, .5);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >strong {
        margin-left: 15px;
    }
}

.el-aside {
    background-color: #333744;
    line-height: 200px;
    text-align: left;
}

.el-dropdown-link {
    cursor: pointer;
    color: #000603;
}

.el-main {
    padding: 0;
    background-color: rgba(234, 237, 241, .5);
}

a {
    text-decoration: none;
}

.header-avatar {
    float: right;
    width: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;

}
</style>