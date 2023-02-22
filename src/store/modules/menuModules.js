import Vue from 'vue'
import Vuex from 'vuex'

export default {

    state: {
        // 系统菜单数据
        menuList: [],
        // 系统权限数据
        permList: [],
        // 表示菜单是否加载过的
        hasRoute: false,
        editableTabsValue: 'Index',
        editableTabs: [
            {
                title: '首页',
                name: 'Index'
            }
        ]
    },
    getters: {
    },
    mutations: {
        //    设置存储菜单
        setMenuList(state, menus) {
            state.menuList = menus
            sessionStorage.setItem('menuList', JSON.stringify(menus))
        },
        // 设置权限信息
        setPerMList(state, authoritys) {
            state.permList = authoritys
        },
        // 修改hasRoute
        changeRouteStatus(state, hasRoute) {
            state.hasRoute = hasRoute
            localStorage.setItem('hasRoute', hasRoute)
        },
        setEditTables(state, editableTabs) {
            state.editableTabs = editableTabs
        },
        // 激活选项卡
        setActviceTab(state, tabName) {
            state.editableTabsValue = tabName
        },
        addTabs(state, tab) {
            let index = state.editableTabs.findIndex(item => item.name == tab.name)
            // 判断是否激活
            if (index == -1) {
                state.editableTabs.push(tab)
            }
            state.editableTabsValue = tab.name
        },
        resetState: (state) => {
            state.menuList = []
            state.permList = []
            state.hasRoute = false
            state.editableTabsValue = 'Index'
            state.editableTabs = [
                {
                    title: '首页',
                    name: 'Index'
                }
            ]
        }
    },
    actions: {
    },
    modules: {
    }

}