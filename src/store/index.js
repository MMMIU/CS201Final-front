import Vue from 'vue'
import Vuex from 'vuex'
import {mutations} from './mutations'
import {actions} from './actions'

Vue.use(Vuex)

const state = {
  username: window.sessionStorage.getItem('username'),
  token: window.sessionStorage.getItem('token'),
  roomNumber: null,
  totalGames: null,
  winGames: null,
  opponent: null,
  questions: [],
  allowBack: true
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
