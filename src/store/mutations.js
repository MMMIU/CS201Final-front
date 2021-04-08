const mutations = {
  SET_TOKEN: (state, data) => {
    state.token = data
    window.sessionStorage.setItem('token', data)
  },
  SET_USER: (state, data) => {
    // 把用户名存起来
    state.username = data
    window.sessionStorage.setItem('username', data)
  },
  SET_ROOM_NUMBER: (state, data) => {
    state.roomNumber = data
  },
  SET_TOTAL_GAMES: (state, data) => {
    state.totalGames = data
  },
  SET_WIN_GAMES: (state, data) => {
    state.winGames = data
  },
  SET_OPPONENT: (state, data) => {
    state.opponent = data
  },
  SET_OPPONENT_SCORE: (state, data) => {
    state.opponentScore = data
  },
  LOGOUT: (state) => {
    // 登出的时候要清除token
    state.token = null
    state.username = null
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('username')
  }
}

export {
  mutations
}
