let demoList = {
  token: 1234567890,
  user: 'MMMIU'
}

export default {
  'post|/logincheck': option => {
    return {
      status: 200,
      data: demoList
    }
  }
}
