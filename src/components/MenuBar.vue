<template>

    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff"
        active-text-color="#409EFF" unique-opened>
        <router-link to="/index">
            <el-menu-item index="Index">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页</span>
                </template>
            </el-menu-item>
        </router-link>
        <el-submenu :index="item.name" v-for="item in menuList" :key="item.id">
            <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
            </template>
            <router-link :to="subItem.path" v-for="(subItem, index) in item.children" :key="index">
                <el-menu-item :index="subItem.name" @click="selectMenu(subItem)">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.title }}</span>
                </el-menu-item>
            </router-link>
        </el-submenu>
    </el-menu>

</template>

<script>
export default {
    data() {
        return {
            menuList:this.$store.state.menus.menuList,
            activeMenu:this.$store.state.menus.editableTabsValue
        }
    },
    created() {
    },
    methods: {
        selectMenu(item) {
            let obj = {
                title: item.title,
                name: item.name
            }
            this.$store.commit('addTabs', obj)
        }
    }
}

</script>

<style scoped>
.el-menu {
    border-right: none;
}

a {
    text-decoration: none;
}
</style>