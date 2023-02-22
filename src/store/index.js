import Vue from 'vue'
import Vuex from 'vuex'
import menus from './modules/menuModules.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    username:''
  },
  getters: {
  },
  mutations: {
    SET_TOKEN:(state,tokenVal)=>{
      state.token=tokenVal
      localStorage.setItem('token',tokenVal)
    },
    saveUsername(state,username){
      state.username=username
    }
  },
  actions: {
  },
  modules: {
    menus
  }
})
