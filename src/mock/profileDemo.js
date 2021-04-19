let profileDemo = {
  token: 1234567890,
  totalGames: 100,
  winGames: 50
}

export default {
  'post|/statistics': option => {
    return {
      status: 200,
      data: profileDemo
    }
  }
}
