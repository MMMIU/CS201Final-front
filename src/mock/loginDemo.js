let loginDemo = {
  token: 1234567890,
  username: 'MMMIU'
}

export default {
  'post|/logincheck': (req, res) => {
    return {
      status: 200,
      data: loginDemo
    }
  }
}
