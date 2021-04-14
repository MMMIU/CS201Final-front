const mutations = {
  SET_TOKEN: (state, data) => {
    state.token = data
    window.sessionStorage.setItem('token', data)
  },
  SET_USER: (state, data) => {
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
  SET_QUESTIONS: (state, data) => {
    state.questions = data
  },
  CLEAR_ROOM: (state) => {
    state.roomNumber = null
    state.opponent = null
    state.opponentScore = null
  },
  UPDATE_ALLOWBACK: (state, data) => {
    state.allowBack = data.allowBack
    window.sessionStorage.setItem('token', data)
  },
  LOGOUT: (state) => {
    state.token = null
    state.username = null
    window.sessionStorage.removeItem('token')
    window.sessionStorage.removeItem('username')
  }
}

export {
  mutations
}
