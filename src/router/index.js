import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Lobby from '../components/mainRoom/Lobby'

import store from '../store/user'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: {
        allowBack: false,
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        allowBack: false,
        requireAuth: false
      }
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: Lobby,
      meta: {
        allowBack: false,
        requireAuth: true
      }
    }
  ]
})

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token) { // 通过vuex state获取当前的token是否存在
      next()
    } else {
      console.log('该页面需要登陆')
      next({
        path: '/'
        // query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
