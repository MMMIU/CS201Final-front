let profileDemo = {
  token: 1234567890,
  totalGames: 100,
  winGames: 50
}

export default {
  'post|/requestprofile': option => {
    return {
      status: 200,
      data: profileDemo
    }
  }
}
