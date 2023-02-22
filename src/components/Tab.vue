<template>

    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
        <el-tab-pane :key="item.name" v-for="item in editableTabs" :label="item.title" :name="item.name">
        </el-tab-pane>
    </el-tabs>

</template>

<script>
export default {
    data() { return {} },
    methods: {
        removeTab(targetName) {
            let tabs = this.editableTabs
            let activeName = this.editableTabsValue
            if (targetName == 'Index') return
            if (targetName == activeName) {
                tabs.forEach((tab, index) => {
                    if (tab.name == targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1]
                        if (nextTab) {
                            activeName = nextTab.name
                        }
                    }
                });
            }
            this.editableTabsValue = activeName
            this.editableTabs = tabs.filter((tab) =>
                tab.name != targetName
            )
            this.$router.push({name:activeName})
        },
        clickTab(target) {
            this.$router.push({ name: target.name })
        },
    },
    computed: {
        editableTabsValue: {
            get() {
                return this.$store.state.menus.editableTabsValue
            },
            set(val) {
                this.$store.state.menus.editableTabsValue = val
            }
        },
        editableTabs: {
            get() {
                return this.$store.state.menus.editableTabs
            },
            set(val) {
                this.$store.state.menus.editableTabs = val
            }
        }
    }
}

</script>

<style scoped>
.el-tabs {
    background-color: rgb(248, 249, 250);
}
</style>