// store index.js
import Vue from 'vue'
import Vuex from 'vuex'
import {mutations} from './mutations'
Vue.use(Vuex)

// 初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
  username: window.sessionStorage.getItem('username'),
  token: window.sessionStorage.getItem('token'),
  roomNumber: 0,
  totalGames: 0,
  winGames: 0,
  opponent: null,
  opponentScore: 0
}

const actions = {
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})
