import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '../src/api/request.js'
import qs from 'qs'
import global from './global.js'
import {
  getCurDate,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from './utils/common.js'
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;

Vue.prototype.$http = axios
Vue.use(Element);
Vue.config.productionTip = false
Vue.prototype.$qs = qs

Vue.prototype.$getCurDate = getCurDate
Vue.prototype.$setSessionStorage = setSessionStorage
Vue.prototype.$getSessionStorage = getSessionStorage
Vue.prototype.$removeSessionStorage = removeSessionStorage
Vue.prototype.$setLocalStorage = setLocalStorage
Vue.prototype.$getLocalStorage = getLocalStorage
Vue.prototype.$removeLocalStorage = removeLocalStorage


//require('./mockjs/mock.js')
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
