import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '@/store'
import axios from '@/api/request.js'

Vue.use(VueRouter)

//解决重复路由问题
const originaPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originaPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: "/login" },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/', name: 'Home', component: Home, children: [
      { path: '/index', name: 'Index', component: () => import('@/views/Index.vue') },
      { path: '/editpwd', name: 'EditPwd', meta: { title: '修改密码' }, component: () => import('@/views/Pwd.vue') },
      { path: '/user_center', name: 'userCenter', meta: { title: '用户中心' }, component: () => import('@/views/sys/systemMg/Menu.vue') },
    ]
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 代表将要访问路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next('/login) 强制跳转
  let token = localStorage.getItem('token')
  let hasRoute = store.state.menus.hasRoute
  if (to.path == '/login') {
    next()
  } else if (!token) {
    next('/login') // 没有token,强制跳转到login
  } else if (!hasRoute) {
    axios.get('/menu/nav').then(res => {
      store.commit('setMenuList', res.data.data.nav)
      store.commit('setPerMList', res.data.data.authoritys)
      console.log("res" + res.data.data.nav);
      res.data.data.nav.forEach((item) => {
        // 是否存在子菜单
        if (item.children) {
          item.children.forEach((subItem) => {
            let route = menuToRouter(subItem)
            if (route) {
              routes[2].children.push(route)
            }
          })
        }
      })
      //  router.addRoutes(routes)
      for (let r of routes) {
        router.addRoute(r)
      }
      store.commit('changeRouteStatus', true)
      next({ path: to.path })
    })
  } else {
    next()
  }
})

const menuToRouter = menu => {
  if (!menu.component) {
    return null
  }

  let route = {
    path: menu.path,
    name: menu.name,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = () => import('@/views/' + menu.component + '.vue')
  return route
}


export default router
