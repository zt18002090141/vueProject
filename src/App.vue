<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: 'App'
    }
  },
  watch: {
    $route(to, from) {
      if (to.path != '/login' && to.path !='/') {
        let obj = {
          title: to.meta.title,
          name: to.name,
        }
        this.$store.commit('addTabs', obj)
        this.$store.commit('setActviceTab',obj.name)
      }
    }
  }
}

</script>
<style lang="less">
html,
body,
#app {
  font-family: 'Microsoft Yahei', sans-serif;
  height: 100%;
  margin: 0;
  padding: 0;
  color: #494949;
  font-size: 14px;
}
</style>

