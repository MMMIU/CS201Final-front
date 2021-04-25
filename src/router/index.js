import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/Login'
import Lobby from '../components/lobby/Lobby'
import GameRoom from '../components/game/GameRoom'
import Profile from '../components/profile/Profile'
import About from '../components/about/About'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
      path: '/battle',
      name: 'battle',
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
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        allowBack: true,
        requireAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (to.meta.requireAuth) {
    if (token) {
      next()
      checkAllowBack(to)
    } else {
      console.log('This page requires authentication.')
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
