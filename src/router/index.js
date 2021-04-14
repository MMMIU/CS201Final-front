import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Lobby from '../components/lobby/Lobby'
import GameRoom from '../components/game/GameRoom'
import Profile from '../components/profile/Profile'
import store from '../store'

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
    },
    {
      path: '/gameroom',
      name: 'gameroom',
      component: GameRoom,
      meta: {
        allowBack: false,
        requireAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        allowBack: true,
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
      checkAllowBack(to)
    } else {
      console.log('该页面需要登陆')
      next({
        path: '/'
      })
    }
  } else {
    next()
    checkAllowBack(to)
  }
})

function checkAllowBack (to) {
  let allowBack = true
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  if (!allowBack) {
    console.log('back prevented')
    history.pushState(null, null, location.href)
  }
  store.commit('UPDATE_ALLOWBACK', {
    allowBack: allowBack
  })
}
export default router
