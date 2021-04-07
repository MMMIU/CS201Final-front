let loginDemo = {
  token: 1234567890,
  username: 'MMMIU'
}

export default {
  'post|/logincheck': option => {
    return {
      status: 200,
      data: loginDemo
    }
  }
}
